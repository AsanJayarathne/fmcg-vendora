# FMCG Vendora — Online Debit Settlement Implementation Plan

Comprehensive guide and technical architecture to implement an **Online Debt / Credit Settlement (Full Settlement Only)** feature for retailers across the **Vendora FMCG** system.

---

## 1. Overview & Business Value

Currently, retailers accumulate debt on their credit accounts when placing credit orders, which is traditionally settled on subsequent orders or cash collection. 

This feature allows retailers to **settle their full outstanding credit balance directly online at any time** using the integrated payment gateway (Credit/Debit Card, Sandbox Mock Gateway).

> [!NOTE]
> **Strict Policy**: Settlement must always be for the **exact full outstanding debt** (`current_balance`). Partial settlements are not permitted.

### Key Benefits
* **Accelerates Cash Flow**: Distributors receive payments in full without waiting for subsequent physical deliveries.
* **Instant Full Credit Line Restoration**: Retailers hitting their credit limit can instantly clear 100% of their debt online and restore their entire available credit line.
* **Zero Impact on Existing Orders**: 100% backward compatible with normal order checkout.

---

## 2. End-to-End Architecture & Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Retailer as Retailer
    participant UI as Retailer Portal (CreditOverview)
    participant Modal as SettleDebitModal
    participant GW as PaymentGatewayModal (Card/Mock)
    participant BE as PHP Backend (Credit & PaymentGateway API)
    participant DB as MySQL (credit_account, credit_transaction, gateway_payments)

    Retailer->>UI: Views Credit Balance (e.g. Outstanding Debt: Rs. 45,000)
    Retailer->>UI: Clicks "Settle Full Balance Online" button
    UI->>Modal: Opens Settle Debit Modal displaying full balance (Rs. 45,000)
    Retailer->>Modal: Clicks "Proceed to Pay Full Balance"
    Modal->>BE: POST /api/credit/initiate-settlement.php { credit_id, amount: 45000 }
    BE->>DB: Validates retailer owns account & amount == current_balance
    BE->>DB: Records transaction token in gateway_payments (type: 'CREDIT_SETTLEMENT', credit_id: X, order_id: NULL)
    BE-->>Modal: Returns gateway token, signature, distributor name, amount
    Modal->>GW: Opens PaymentGatewayModal
    Retailer->>GW: Submits card / mock payment
    GW->>BE: POST /api/payment/callback.php (Status: SUCCESS)
    BE->>DB: 1. Resets current_balance = 0 & restores available_credit = credit_limit
    BE->>DB: 2. Inserts audit record in credit_transaction (type: 'PAYMENT')
    BE->>DB: 3. Inserts record in payment table
    BE->>BE: 4. Sends push notifications to Retailer & Distributor
    GW-->>UI: Displays Payment Success Confirmation
    UI->>UI: Refreshes credit overview with 0 debt and full available credit
```

---

## 3. Database Migration

File: `backend/database/migrations/004_alter_gateway_payments_for_credit_settlement.sql`

```sql
-- ============================================================
-- Migration: Support Credit / Debit Settlement in Gateway Payments
-- ============================================================

-- 1. Allow order_id to be NULL for standalone debit settlements
ALTER TABLE `gateway_payments` MODIFY `order_id` INT(11) NULL;

-- 2. Add credit_id and payment_type columns
ALTER TABLE `gateway_payments` 
  ADD COLUMN `credit_id` INT(11) NULL AFTER `order_id`,
  ADD COLUMN `payment_type` ENUM('ORDER', 'CREDIT_SETTLEMENT') NOT NULL DEFAULT 'ORDER' AFTER `distributor_id`,
  ADD KEY `idx_gw_credit` (`credit_id`),
  ADD CONSTRAINT `fk_gw_credit` FOREIGN KEY (`credit_id`) REFERENCES `credit_account` (`credit_id`) ON DELETE CASCADE;
```

---

## 4. Backend Implementation Steps (`backend/`)

### A. Update Gateway Payment Repository (`backend/repository/GatewayPaymentRepository.php`)
Add a dedicated method for credit settlement records:
```php
public function createSettlement(int $creditId, int $retailerId, int $distributorId, float $amount, string $token, string $signature, string $gatewayName = 'Vendora Mock Gateway (Sandbox)'): int {
    $stmt = $this->db->prepare("
        INSERT INTO gateway_payments 
        (order_id, credit_id, retailer_id, distributor_id, payment_type, amount, currency, gateway_name, transaction_token, status, signature)
        VALUES (NULL, ?, ?, ?, 'CREDIT_SETTLEMENT', ?, 'LKR', ?, ?, 'INITIATED', ?)
    ");
    $stmt->execute([$creditId, $retailerId, $distributorId, $amount, $gatewayName, $token, $signature]);
    return (int)$this->db->lastInsertId();
}
```

### B. Update Payment Gateway Service (`backend/service/PaymentGatewayService.php`)
1. **Add `initiateCreditSettlement(int $retailerId, int $creditId, float $amount)`**:
   - Validates that the credit account exists and belongs to the authenticated retailer.
   - Validates `$account['current_balance'] > 0`.
   - **Enforces Full Settlement**: Validates that `$amount == (float)$account['current_balance']` (rejects partial payments with 400 error).
   - Generates token and cryptographic signature.
   - Saves record via `gwRepo->createSettlement(...)`.
   - Returns transaction payload for frontend modal.

2. **Update `processCallback(...)`**:
   - Checks `payment_type` of the gateway transaction:
   ```php
   if ($gwRecord['payment_type'] === 'CREDIT_SETTLEMENT') {
       $creditId = (int)$gwRecord['credit_id'];
       
       // 1. Full credit settlement: clears balance and restores available limit
       $this->creditRepo->credit($creditId, $amount);
       
       // 2. Add audit trail in credit_transaction
       $account = $this->creditRepo->findById($creditId);
       $retailer = $this->retailerRepo->findById((int)$gwRecord['retailer_id']);
       $userId = $retailer ? (int)$retailer['user_id'] : 1;
       
       $this->creditRepo->addTransaction(
           $creditId,
           'PAYMENT',
           $amount,
           (float)$account['current_balance'],
           "Full Online Debit Settlement (Ref: " . ($gatewayRef ?: $token) . ")",
           null,
           null,
           $userId
       );
       
       // 3. Send notifications
       $distributor = $this->distributorRepo->findById((int)$gwRecord['distributor_id']);
       if ($distributor) {
           $this->notifService->send($distributor['user_id'], "Full Credit Settlement Received", "Retailer '{$retailer['shop_name']}' settled full debt of LKR " . number_format($amount, 2) . " online.");
       }
       if ($retailer) {
           $this->notifService->send($retailer['user_id'], "Debt Settlement Confirmed", "Your full online debt settlement of LKR " . number_format($amount, 2) . " was processed. Your credit line is fully restored.");
       }
   } else {
       // Standard Order Payment Flow (Existing Logic)
       $this->orderRepo->updatePaymentStatus($orderId, 'Paid');
       $this->orderRepo->updateStatus($orderId, 'Processing');
       $this->orderRepo->recordPayment(...);
   }
   ```

### C. Create API Endpoint (`backend/api/credit/initiate-settlement.php`)
* **Endpoint**: `POST /backend/api/credit/initiate-settlement.php`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Request Body**:
  ```json
  {
    "credit_id": 3,
    "amount": 45000.00
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "data": {
      "gateway_payment_id": 42,
      "credit_id": 3,
      "amount": 45000.00,
      "currency": "LKR",
      "transaction_token": "a1b2c3d4...",
      "signature": "e5f6g7...",
      "shop_name": "Sunrise Mart",
      "distributor_name": "Nestle Lanka PLC"
    }
  }
  ```

---

## 5. Frontend Implementation Steps (`retailer-frontend`)

### A. Settle Debit Modal Component (`src/components/Credits/SettleDebitModal.jsx`)
* Modal interface allowing the retailer to:
  * View current outstanding balance with the selected distributor.
  * Clear visual breakdown showing:
    * Total Credit Limit
    * Current Outstanding Debt (Amount to be settled in full)
    * Post-Payment Available Credit (100% restored)
  * Action button: **"Pay Full Balance (Rs. XX,XXX.XX)"**
  * Initiates payment gateway with the exact outstanding amount.

### B. Update Credit Overview Card (`src/components/Credits/CreditOverview.jsx`)
* Add a primary **"Settle Full Debt Online"** button with a credit card icon.
* Automatically passes the active distributor's `credit_id` and `current_balance`.
* If `used === 0`, the button displays `"No Outstanding Debt"` and is disabled.

### C. Service Integration (`src/services/orderService.js` / `creditService.js`)
Add service function:
```javascript
export async function initiateCreditSettlement(token, creditId, amount) {
  const res = await fetch("http://localhost/fmcg-vendora/backend/api/credit/initiate-settlement.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ credit_id: creditId, amount: Number(amount) })
  });
  return res.json();
}
```

---

## 6. Verification & Testing Checklist

1. **Safety Verification**:
   * Run standard order placement with Cash, Credit, and Online payment to confirm zero regression.
2. **Full Debt Settlement Test**:
   * Settle full debt (e.g. `Rs. 45,000`) $\rightarrow$ verify balance drops to `Rs. 0.00` and available limit matches 100% of the credit limit.
3. **Partial Amount Rejection Test**:
   * Attempt to send an amount less than `current_balance` directly to the API $\rightarrow$ verify backend rejects it with `400 Bad Request: "Partial settlement is not allowed. Full balance must be settled."`
4. **Audit History Verification**:
   * Check `credit_transaction` table to ensure the full settlement is logged with type `'PAYMENT'`, updated `balance_after = 0.00`, and reference code.
