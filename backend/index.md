# Vendora Backend — Developer Index

> **Stack:** PHP 8 (OOP, no framework) · MySQL · XAMPP  
> **Pattern:** `util → repository → service → controller → api`  
> **Auth:** DB token via `Authorization: Bearer <token>` header

---

## Quick Start

### 1. Run the DB migration
Open phpMyAdmin and run `backend/database/add_auth_tokens.sql` once.

### 2. Test login (Postman)
```
POST http://localhost/fmcg-vendora/backend/api/auth/login.php
Content-Type: application/json

{ "email": "admin@vendora.com", "password": "admin123" }
```
Returns `{ "success": true, "data": { "token": "...", "role": "SUPER_ADMIN", ... } }`

### 3. Use token on every protected request
```
Authorization: Bearer <token>
```

---

## Folder Structure

```
backend/
├── util/                          # Shared helpers (no business logic)
│   ├── Database.php               # PDO singleton — one connection per request
│   ├── cors.php                   # CORS headers for React frontends
│   └── auth.php                   # requireAuth(), requireRole(), sendSuccess(), sendError(), getBody()
│
├── repository/                    # Raw SQL queries only. Return arrays, never echo.
│   ├── TokenRepository.php        # auth_tokens table
│   ├── UserRepository.php         # users table
│   ├── DistributorRepository.php  # distributor table
│   ├── RetailerRepository.php     # retailer table
│   ├── DriverRepository.php       # driver table
│   ├── ProductRepository.php      # product, product_category, product_pricing, distributor_pricing
│   ├── StockRepository.php        # warehouse_stock, distributor_stock
│   ├── OrderRepository.php        # orders, order_items
│   ├── DeliveryRepository.php     # delivery table
│   ├── SupplyRepository.php       # supply_request, supply_request_items, stock_transfer
│   ├── CreditRepository.php       # credit_account, credit_transaction
│   └── NotificationRepository.php # notification table
│
├── service/                       # Business logic. Calls repositories. Throws exceptions.
│   ├── AuthService.php            # login, logout, token generation
│   ├── NotificationService.php    # send, getForUser, markRead, countUnread
│   ├── OrderService.php           # placeOrder (credit gate), modifyOrder, cancelOrder, approveOrder, lock
│   ├── SupplyService.php          # createRequest, approveRequest (atomic), rejectRequest
│   └── DeliveryService.php        # getOpenPool, claim (atomic), markDelivered, markReturned
│
├── controller/                    # Reads request, calls service, calls sendSuccess/sendError.
│   ├── AuthController.php
│   ├── admin/
│   │   ├── ProductController.php       # catalog + categories + pricing
│   │   ├── WarehouseStockController.php
│   │   ├── SupplyController.php        # approve/reject supply requests
│   │   └── DistributorController.php
│   ├── distributor/
│   │   ├── RetailerController.php      # approve/reject retailers in region
│   │   ├── OrderController.php         # approve/reject orders
│   │   ├── CreditController.php        # manage credit accounts
│   │   └── DeliveryController.php      # open pool + audit view
│   ├── retailer/
│   │   ├── ProductController.php       # browse catalog (distributor-scoped)
│   │   └── OrderController.php         # place/modify/cancel orders
│   └── driver/
│       └── DeliveryController.php      # open pool, claim, deliver/return
│
├── api/                           # URL entry points. 3–5 lines each. require + call controller.
│   ├── auth/
│   │   ├── login.php
│   │   └── logout.php
│   ├── admin/
│   │   ├── products.php           # ?action=categories  ?action=pricing
│   │   ├── warehouse-stock.php
│   │   ├── supply-requests.php    # ?id=X&action=approve|reject
│   │   └── distributors.php
│   ├── distributor/
│   │   ├── retailers.php          # ?status=Pending  PUT ?id=X
│   │   ├── orders.php             # ?status=X  PUT ?id=X&action=approve|reject
│   │   ├── stock.php              # ?low_stock
│   │   ├── deliveries.php         # ?type=open|audit
│   │   ├── credit.php             # ?retailer_id=X  POST  PUT ?id=X&action=block
│   │   └── supply-requests.php    # GET  POST
│   ├── retailer/
│   │   ├── products.php           # ?category_id=X
│   │   ├── orders.php             # GET POST PUT DELETE ?id=X
│   │   ├── credit.php             # GET — view own credit + transactions
│   │   └── deliveries.php         # GET — track deliveries
│   ├── driver/
│   │   └── deliveries.php         # ?type=open|mine  PUT ?id=X&action=claim|deliver|return
│   └── notifications.php          # GET ?unread  PUT ?id=X (or all)
│
└── database/
    └── add_auth_tokens.sql        # Run once in phpMyAdmin
```

---

## Layer Rules

| Layer | Rule |
|---|---|
| `util/` | No classes. Just functions and one singleton. |
| `repository/` | Only SQL. No `echo`, no business decisions. |
| `service/` | No `$_GET`/`$_POST`. No `echo`. Throw `Exception` on errors. |
| `controller/` | No SQL. Reads request → calls service → calls `sendSuccess/sendError`. |
| `api/` | No logic. Just `require` + instantiate controller + call `handle()`. |

---

## Auth Flow

```
React POST /api/auth/login.php  { email, password }
  → AuthController → AuthService::login()
      → UserRepository::findByEmail()
      → password_verify() or SHA2 check
      → bin2hex(random_bytes(32))  ← secure token
      → TokenRepository::save()   ← stored in auth_tokens table (24h expiry)
      → returns { token, role, profile_id, ... }

React stores token in localStorage.

Every protected request:
  Authorization: Bearer <token>
  → util/auth.php requireRole('DISTRIBUTOR')
      → TokenRepository::findValid()  ← checks expiry
      → returns { user_id, role }
```

### Roles

| role_name | Login returns | Access prefix |
|---|---|---|
| `SUPER_ADMIN` | `profile_id: null` | `/api/admin/` |
| `DISTRIBUTOR` | `profile_id: distributor_id` | `/api/distributor/` |
| `RETAILER` | `profile_id: retailer_id` | `/api/retailer/` |
| `DRIVER` | `profile_id: driver_id` | `/api/driver/` |

---

## API Endpoints Reference

### Auth (public)

| Method | URL | Body | Returns |
|---|---|---|---|
| `POST` | `/api/auth/login.php` | `{email, password}` | token + profile |
| `DELETE` | `/api/auth/logout.php` | — | success |

---

### Admin (`SUPER_ADMIN` only)

| Method | URL | Params / Body | Action |
|---|---|---|---|
| `GET` | `/api/admin/products.php` | — | All products with current pricing |
| `GET` | `/api/admin/products.php` | `?id=X` | Single product |
| `POST` | `/api/admin/products.php` | `{product_name, category_id, unit, base_price, mrp}` | Create product |
| `PUT` | `/api/admin/products.php` | `?id=X&action=toggle` | Activate/Deactivate |
| `GET` | `/api/admin/products.php` | `?action=categories` | All categories |
| `POST` | `/api/admin/products.php` | `?action=categories` + body | Create category |
| `PUT` | `/api/admin/products.php` | `?action=categories&id=X` + body | Update category |
| `POST` | `/api/admin/products.php` | `?action=pricing` + `{product_id, base_price, mrp}` | Set new price (versioned) |
| `GET` | `/api/admin/warehouse-stock.php` | — | All warehouse stock |
| `PUT` | `/api/admin/warehouse-stock.php` | `{product_id, quantity}` | Adjust warehouse qty |
| `GET` | `/api/admin/supply-requests.php` | — | All supply requests |
| `GET` | `/api/admin/supply-requests.php` | `?id=X` | Request + items |
| `GET` | `/api/admin/supply-requests.php` | `?status=Pending` | Filter by status |
| `PUT` | `/api/admin/supply-requests.php` | `?id=X&action=approve` + `{approvals:[{request_item_id, approved_qty}]}` | **Atomic stock deduction** |
| `PUT` | `/api/admin/supply-requests.php` | `?id=X&action=reject` + `{remarks}` | Reject request |
| `GET` | `/api/admin/distributors.php` | — | All distributors |
| `PUT` | `/api/admin/distributors.php` | `?id=X` + `{status: Approved|Rejected|Blocked}` | Update distributor status |

---

### Distributor (`DISTRIBUTOR` only)
> All queries are automatically scoped to this distributor's `region_id`.

| Method | URL | Params / Body | Action |
|---|---|---|---|
| `GET` | `/api/distributor/retailers.php` | — | All retailers in region |
| `GET` | `/api/distributor/retailers.php` | `?status=Pending` | Filter |
| `PUT` | `/api/distributor/retailers.php` | `?id=X` + `{status}` | Approve/Reject/Block retailer |
| `GET` | `/api/distributor/orders.php` | — | All orders |
| `GET` | `/api/distributor/orders.php` | `?id=X` | Order + items |
| `GET` | `/api/distributor/orders.php` | `?status=Processing` | Filter by status |
| `PUT` | `/api/distributor/orders.php` | `?id=X&action=approve` | Approve → creates delivery |
| `PUT` | `/api/distributor/orders.php` | `?id=X&action=reject` | Reject order |
| `GET` | `/api/distributor/stock.php` | — | Own stock |
| `GET` | `/api/distributor/stock.php` | `?low_stock` | Items below threshold (qty < 50) |
| `GET` | `/api/distributor/deliveries.php` | — | All deliveries |
| `GET` | `/api/distributor/deliveries.php` | `?type=open` | Open pool (unclaimed) |
| `GET` | `/api/distributor/credit.php` | — | All retailer credit accounts |
| `GET` | `/api/distributor/credit.php` | `?retailer_id=X` | Credit + transaction ledger |
| `POST` | `/api/distributor/credit.php` | `{retailer_id, credit_limit}` | Create credit account |
| `PUT` | `/api/distributor/credit.php` | `?id=X` + `{credit_limit}` | Update limit |
| `PUT` | `/api/distributor/credit.php` | `?id=X&action=block` | Block account |
| `PUT` | `/api/distributor/credit.php` | `?id=X&action=unblock` | Unblock account |
| `GET` | `/api/distributor/supply-requests.php` | — | Own supply requests |
| `POST` | `/api/distributor/supply-requests.php` | `{items:[{product_id, quantity}], remarks}` | Submit request |

---

### Retailer (`RETAILER` only)
> Must have `status = 'Approved'`. All stock is scoped to their assigned distributor.

| Method | URL | Params / Body | Action |
|---|---|---|---|
| `GET` | `/api/retailer/products.php` | — | Catalog (only distributor's stock > 0) |
| `GET` | `/api/retailer/products.php` | `?category_id=X` | Filter by category |
| `GET` | `/api/retailer/orders.php` | — | Order history |
| `GET` | `/api/retailer/orders.php` | `?id=X` | Order + items + editable flag |
| `POST` | `/api/retailer/orders.php` | `{payment_method, items:[{product_id,quantity}]}` | Place order (credit gate runs) |
| `PUT` | `/api/retailer/orders.php` | `?id=X` + `{items}` | Modify order (within lock window) |
| `DELETE` | `/api/retailer/orders.php` | `?id=X` | Cancel order (within lock window) |
| `GET` | `/api/retailer/credit.php` | — | Credit balance + transaction history |
| `GET` | `/api/retailer/deliveries.php` | — | Track deliveries for own orders |

---

### Driver (`DRIVER` only)
> Must have `status = 'Approved'`.

| Method | URL | Params / Body | Action |
|---|---|---|---|
| `GET` | `/api/driver/deliveries.php` | `?type=open` | Open pool in own distributor's region |
| `GET` | `/api/driver/deliveries.php` | `?type=mine` | Own claimed deliveries |
| `PUT` | `/api/driver/deliveries.php` | `?id=X&action=claim` | Claim delivery (atomic — no race condition) |
| `PUT` | `/api/driver/deliveries.php` | `?id=X&action=deliver` + `{collected_amount, remarks}` | Mark delivered |
| `PUT` | `/api/driver/deliveries.php` | `?id=X&action=return` + `{remarks}` | Mark returned |

---

### Notifications (all roles)

| Method | URL | Action |
|---|---|---|
| `GET` | `/api/notifications.php` | All notifications for current user |
| `GET` | `/api/notifications.php?unread` | Unread only |
| `PUT` | `/api/notifications.php?id=X` | Mark one as read |
| `PUT` | `/api/notifications.php` | Mark all as read |

---

## Key Business Rules

### 1. Order Self-Correction Window (15 min)
- Every `POST /retailer/orders.php` creates order with status `Pending`.
- `editable: true` is returned while `NOW() < created_at + 15min`.
- **Lazy lock:** On every order read, if window expired and status is still `Pending`, it auto-updates to `Processing`.
- Once `Processing`, the distributor can approve it.

```
Pending (editable) → [15 min passes] → Processing (locked) → Approved → Delivered
                                                           ↘ Rejected
```

### 2. Credit Gate
- Only runs when `payment_method = 'Credit'`.
- Checks `credit_account.available_credit >= order total`.
- Throws **HTTP 402** if blocked.
- Credit is **debited** when driver marks delivery as `DELIVERED`.

### 3. Atomic Supply Approval
- Wrapped in `$db->beginTransaction()`.
- Deducts `warehouse_stock`, adds to `distributor_stock`, creates `stock_transfer` record.
- If any product has insufficient qty → **entire transaction rolls back**.

### 4. First-Come Delivery Claim
- Uses `SELECT ... FOR UPDATE` to lock the row.
- If two drivers claim simultaneously, the second gets **HTTP 409 Conflict**.

### 5. Stock Visibility Scoping
- Retailers **only see** products in `distributor_stock` for their assigned distributor.
- Price shown is `distributor_pricing` (if set) else `product_pricing.base_price`.

---

## Standard JSON Response Format

### Success
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Order total LKR 5000 exceeds available credit LKR 3200"
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Bad request / missing params |
| `401` | Invalid or missing token |
| `402` | Credit limit exceeded |
| `403` | Forbidden (wrong role / blocked) |
| `404` | Not found |
| `405` | Method not allowed |
| `409` | Conflict (e.g. delivery already claimed) |
| `422` | Unprocessable (e.g. insufficient stock) |
| `500` | DB connection failure |

---

## OOP Concepts Used (for report)

| Concept | Where |
|---|---|
| **Class & Object** | Every file is a class; instantiated with `new` |
| **Encapsulation** | `private` properties, exposed via `public` methods only |
| **Constructor injection** | Each service receives repositories via `__construct()` |
| **Singleton pattern** | `Database::getConnection()` — static method, one PDO instance |
| **Exception handling** | Services `throw new Exception(msg, code)`, controllers `catch` |
| **Type hints** | `string $email`, `int $id`, `?array` return types throughout |
| **Match expression** | Controllers use `match($method)` instead of if/else chains |

---

## Database Tables Quick Reference

| Table | Purpose |
|---|---|
| `roles` | role_id, role_name (SUPER_ADMIN / DISTRIBUTOR / RETAILER / DRIVER) |
| `users` | All login accounts |
| `distributor` | Distributor profiles + status + region |
| `retailer` | Retailer/shop profiles + status + region |
| `driver` | Driver profiles linked to a distributor |
| `auth_tokens` | Bearer tokens (64-char hex, 24h expiry) |
| `product` | Product master catalog |
| `product_category` | Categories |
| `product_pricing` | Versioned base pricing (effective_from / effective_to) |
| `distributor_pricing` | Distributor-specific price overrides |
| `warehouse_stock` | Central factory warehouse quantities |
| `distributor_stock` | Each distributor's local stock |
| `orders` | Order header (retailer → distributor) |
| `order_items` | Line items per order |
| `delivery` | Delivery job (OPEN → CLAIMED → DELIVERED/RETURNED) |
| `supply_request` | Distributor's stock replenishment request to admin |
| `supply_request_items` | Items per supply request + approved_qty |
| `stock_transfer` | Record of approved stock movements |
| `credit_account` | Retailer credit limit + current balance per distributor |
| `credit_transaction` | Ledger of all credit debits/credits |
| `payment` | Recorded cash/bank payments |
| `notification` | Per-user in-app notifications |

---

## Seed Credentials (for testing)

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@vendora.com | admin123 |
| Distributor | golden@distributor.com | dist123 |
| Retailer | star@retail.com | retail123 |
| Driver | john@driver.com | driver123 |
