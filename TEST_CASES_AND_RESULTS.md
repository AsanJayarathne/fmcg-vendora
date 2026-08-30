# 4.2 Test Cases and Results

### Table 3: Test Cases and Results for FMCG Vendora System

| Module | Test Case | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **User Authentication & Access Control** | Register new Retailer with valid shop details and coordinates | Account created, initial credit record initialized, redirected to login/dashboard | Passed |
| **User Authentication & Access Control** | Register user with already registered email | Registration rejected, appropriate duplicate email error message displayed | Passed |
| **User Authentication & Access Control** | Login with valid credentials (Admin / Distributor / Retailer / Driver) | Authentication token issued, role-specific dashboard displayed | Passed |
| **User Authentication & Access Control** | Login with invalid password or non-existent email | Authentication denied, "Invalid credentials" error message displayed | Passed |
| **User Authentication & Access Control** | Request password reset and submit valid reset token/OTP | Password updated successfully in database, session invalidated | Passed |
| **User Authentication & Access Control** | Unauthorized user attempts accessing protected endpoint (e.g., Driver accessing `/api/admin/`) | Request blocked with HTTP 403 Forbidden | Passed |
| **Product & Inventory Management** | Distributor/Admin adds new product with price and category | Product saved in database, visible in catalog | Passed |
| **Product & Inventory Management** | Distributor updates batch stock quantity and expiry date | Batch stock updated in `distributor_batch`, new inventory reflected | Passed |
| **Product & Inventory Management** | Distributor stock falls below configured minimum threshold | Low-stock alert badge and notification triggered | Passed |
| **Product & Inventory Management** | Retailer browses catalog with category and search filters | Matching products dynamically filtered and displayed | Passed |
| **Product & Inventory Management** | Retailer views out-of-stock product | Product displayed with disabled "Out of Stock" state, preventing cart addition | Passed |
| **Order Placement & Credit Risk Gate** | Retailer places order with Cash on Delivery (`Cash`) | Order saved with status `Pending`, total amount calculated correctly | Passed |
| **Order Placement & Credit Risk Gate** | Retailer places order with Full Credit within credit limit | Order placed, available credit decreased by order amount in `credit_account` | Passed |
| **Order Placement & Credit Risk Gate** | Retailer attempts credit order exceeding available credit limit | Order rejected with error message "Order total exceeds available credit" | Passed |
| **Order Placement & Credit Risk Gate** | Retailer places split payment order (`Cash + Credit`) | Order saved with distinct `cash_amount` and `credit_amount` recorded | Passed |
| **Order Placement & Credit Risk Gate** | Retailer attempts placing credit order with blocked credit account | Order rejected with error "Credit account is blocked" | Passed |
| **Order Placement & Credit Risk Gate** | Retailer cancels pending order within 15-minute lock window | Order cancelled, allocated credit balance restored | Passed |
| **Order Placement & Credit Risk Gate** | Retailer attempts to cancel order after 15-minute window expires | Cancellation button disabled, backend returns HTTP 403 Forbidden | Passed |
| **Online Payment Gateway** | Retailer selects Online Payment and initiates gateway checkout | Gateway session initialized, transaction token generated | Passed |
| **Online Payment Gateway** | Complete online card payment in sandbox gateway | Payment verified via SHA256 signature, order updated to `Paid` / `Processing` | Passed |
| **Online Payment Gateway** | Payment gateway simulation fails / card declined | Order marked as `Failed`, error feedback shown to user | Passed |
| **Online Payment Gateway** | Retailer settles 100% outstanding debt via online gateway | Outstanding balance cleared to 0.00, available credit restored to full limit | Passed |
| **Distributor Order Processing** | Distributor approves pending retailer order | Order status updated to `Approved`, delivery record created in pool | Passed |
| **Distributor Order Processing** | Distributor rejects pending retailer order with reason | Order status updated to `Rejected`, credit reserved released, retailer notified | Passed |
| **Warehouse Supply Requests** | Distributor submits stock supply request to Central Warehouse | Supply request saved as `Pending` with line items | Passed |
| **Warehouse Supply Requests** | Admin approves supply request and issues stock transfer | Stock deducted from Central Warehouse and transferred to Distributor batch | Passed |
| **Delivery Execution & Route Dispatch** | Driver views open job pool and claims available delivery | Delivery assigned to driver via atomic row-lock (`SELECT FOR UPDATE`) | Passed |
| **Delivery Execution & Route Dispatch** | Driver views claimed delivery routes on Leaflet GPS map | Shop location pin, route destination, and collectible amounts displayed | Passed |
| **Delivery Execution & Route Dispatch** | Driver marks delivery as Delivered and enters collected cash | Delivery status set to `DELIVERED`, distributor stock deducted, retailer notified | Passed |
| **Delivery Execution & Route Dispatch** | Driver marks delivery as Returned with failure reason | Delivery status set to `RETURNED`, order updated to `Rejected` | Passed |
| **Delivery Execution & Route Dispatch** | Driver views shift Cash Audit summary | Total collected cash matches sum of cash across completed route stops | Passed |
| **Credit Ledger & Financial Settlement** | Credit transaction audit log recorded upon order delivery | Entry inserted into `credit_transaction` with exact `balance_after` | Passed |
| **Credit Ledger & Financial Settlement** | Distributor records manual Bank Settlement with deposit reference | Retailer debt reduced, `payment` record logged, transaction history updated | Passed |
| **Credit Ledger & Financial Settlement** | Driver collects excess cash on delivery for old debt | Excess cash credited to outstanding debt, credit ledger balanced | Passed |
| **Credit Ledger & Financial Settlement** | Distributor blocks delinquent retailer credit account | Account status updated to `Blocked`, subsequent credit purchases blocked | Passed |
| **Analytics & Notifications** | System triggers real-time in-app notification on order lifecycle events | Notification delivered and unread counter incremented in navbar | Passed |
| **Analytics & Notifications** | Distributor views Analytics Dashboard | Sales Overview, KPI cards, and Payment Breakdown chart accurately rendered | Passed |
