# System Architecture: Region, Distributor & Retailer Workflows

This document outlines the workflow and architectural rules regarding **Regions**, **Distributors**, **Retailers**, and **Authentication Security** in the system. Use this as a reference guide for system behavior and troubleshooting.

---

## 1. User Authentication & Password Security

### Principles
* **One-Way Hashing**: Passwords in this system are hashed using **Bcrypt** (`$2y$10$...`) via PHP's `password_hash()`.
* **Non-Reversible**: Passwords cannot be decrypted or retrieved in plain text.
* **Verification**: Password authentication is handled via `password_verify($candidatePassword, $storedHash)`.

### Development Password Reset
If a test user's password needs to be reset during local development:
1. Generate a new Bcrypt hash using PHP CLI:
   ```bash
   php -r "echo password_hash('new_password_here', PASSWORD_DEFAULT);"
   ```
2. Update the `users` table record directly in MySQL:
   ```sql
   UPDATE users SET password = '<GENERATED_HASH>' WHERE email = 'user@example.com';
   ```

---

## 2. Retailer Registration & Regional Approval Flow

### Registration
* When a retailer registers, their account is initialized with:
  * `retailer.region_id` = Selected Region ID
  * `retailer.status` = `'Pending'`
  * `users.is_active` = `false`

### Approval in a Region with Multiple Distributors
When a region has **2 or more approved distributors**:
1. **Shared Visibility**: All distributors registered in that region will see the newly registered retailer under their "Pending Retailers" list via `GET /api/distributor/retailers.php`.
2. **First-Come Approval**: Whichever distributor approves the retailer first (`PUT /api/distributor/retailers.php?id=X` with `status: "Approved"`) will set `retailer.status = 'Approved'` and activate the user (`users.is_active = true`).

---

## 3. Product Catalog, Cart & Order Placement Workflow

### Product Browsing
* Retailers view products across **all approved distributors** within their region via `ProductRepository::getCatalogForRegion`.
* The retailer UI tags each product with its `distributor_id` and `distributor_name`.
* Retailers can view all regional products or filter by a specific distributor using the frontend UI filter.

### Multi-Distributor Cart & Ordering
1. **Multi-Distributor Cart**: A retailer can add products from **Distributor A** and **Distributor B** into their shopping cart at the same time.
2. **Sub-Order Grouping**: The frontend cart (`Cart.jsx`) groups cart items by `distributor_id`.
3. **Checkout**: During checkout, separate order requests are submitted for each distributor, passing their specific `distributor_id` to `OrderService::placeOrder`.

### Backend Order Processing & `LIMIT 1` Fallback
* When `distributor_id` is supplied in the order request, the order is routed directly to that distributor.
* If `distributor_id` is omitted in an API payload, `RetailerRepository::getDistributorForRetailer` defaults to querying an approved distributor in that region using `LIMIT 1`.

---

## 4. Per-Distributor Blocking (Without Creating New Database Tables)

### Utilizing the Existing `credit_account` Table
The database **already contains** a table called `credit_account` that stores distributor-retailer links:
```sql
CREATE TABLE `credit_account` (
  `credit_id`        int(11)       NOT NULL AUTO_INCREMENT,
  `retailer_id`      int(11)       NOT NULL,
  `distributor_id`   int(11)       NOT NULL,
  `status`           enum('Active','Blocked') DEFAULT 'Active',
  ...
  UNIQUE KEY `uq_credit_retailer_dist` (`retailer_id`,`distributor_id`)
);
```

### How to Implement Per-Distributor Blocking
To allow **Distributor A** to block a retailer without blocking them from **Distributor B**:

1. **Distributor Block Action (`RetailerController.php`)**:
   - Update `credit_account.status = 'Blocked'` for `(retailer_id, distributor_id)`.
   - **Do NOT** set `users.is_active = false`. This keeps the retailer's user account globally active so they can still log in.

2. **Catalog & Distributor Visibility (`ProductRepository.php`, `DistributorRepository.php`)**:
   - When the retailer browses products or views available distributors in their region, any distributor who has `credit_account.status = 'Blocked'` for this retailer is filtered out.
   - Products from Distributor A are hidden from the retailer, while products from Distributor B remain visible.

3. **Order Check (`OrderService.php`)**:
   - When the retailer places or modifies an order with Distributor A, check `credit_account.status`.
   - If `credit_account.status == 'Blocked'` for Distributor A, block the order.
   - If `credit_account.status == 'Active'` (or not blocked) for Distributor B, the retailer can continue ordering from Distributor B normally.

---

## 5. Summary Table of Component Roles

| Component | Responsibility | Relevant Files / Endpoints |
| :--- | :--- | :--- |
| **Retailer Registration** | Stores user with `region_id` and sets `status = Pending`. | `AuthService.php` / `POST /api/auth/register-retailer.php` |
| **Retailer Approval** | Any distributor in the region can approve/reject. | `RetailerController.php` / `PUT /api/distributor/retailers.php` |
| **Catalog Query** | Returns products from all approved distributors in region. | `ProductRepository.php` / `GET /api/retailer/products.php` |
| **Cart & Ordering** | Groups items by `distributor_id` and submits sub-orders. | `CartContext.jsx`, `Cart.jsx`, `OrderService.php` |
| **Per-Distributor Blocking** | Uses existing `credit_account.status` per `(retailer_id, distributor_id)`. | `CreditRepository.php`, `OrderService.php` |

---
*Created: August 2026 for reference on FMCG Vendora System Architecture.*

