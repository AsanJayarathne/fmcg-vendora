-- ============================================================
--  FMCG Vendora - Seed Data
--  File   : vendora_fmcg_seed.sql
--  Usage  : Import this file SECOND (after structure file)
--  Target : MySQL / MariaDB
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
USE `vendora_fmcg`;

-- ============================================================
-- 1. ROLES
-- ============================================================
INSERT INTO `roles` (`role_id`, `role_name`, `description`, `updated_at`) VALUES
(1, 'SUPER_ADMIN', 'System Administrator with full access',          '2026-06-22 17:31:55'),
(2, 'DISTRIBUTOR', 'Distributor who manages orders and inventory',   '2026-06-22 17:31:55'),
(3, 'RETAILER',    'Retailer who places orders',                     '2026-06-22 17:31:55'),
(4, 'DRIVER',      'Driver who handles deliveries',                  '2026-06-22 17:31:55');

-- ============================================================
-- 2. USERS
-- Passwords are SHA-256 hashed for seed accounts.
-- Seed login passwords (plain text for reference):
--   admin@vendora.com     -> admin123
--   golden@distributor.com -> dist123
--   star@retail.com        -> retail123
--   john@driver.com        -> driver123
-- ============================================================
INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password`, `role_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin User',                'admin@vendora.com',      '0771234567', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 1, 1, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 'Golden Dist',               'golden@distributor.com', '0771111111', '624bb493061bfc379d7774f53a6e595378a1c59738196574c7e7422620516504', 2, 1, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(3, 'Star Retail',               'star@retail.com',        '0772222222', '7c8be7f4a4895b26fd4b9d54a1e6be9e14d8944a54352358c25dd2e33c0374fc', 3, 1, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(4, 'John Driver',               'john@driver.com',        '0773333333', '494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382', 4, 1, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(5, 'Asan Rasmika Jayarathne',   'asanj1234@gmail.com',    '+94711120401','$2y$10$H0Tk9nvEgA/gmVj6bLc9X.I8orTlUJdVwIgiO7x7TiyRzZFqZr7xK', 2, 0, '2026-07-03 18:07:03', '2026-07-03 18:07:03');

-- ============================================================
-- 3. DISTRIBUTOR REGION
-- ============================================================
INSERT INTO `distributor_region` (`region_id`, `region_name`, `description`, `updated_at`) VALUES
(1, 'North Region', 'Northern distribution area', '2026-06-22 17:31:55'),
(2, 'South Region', 'Southern distribution area', '2026-06-22 17:31:55'),
(3, 'East Region',  'Eastern distribution area',  '2026-06-22 17:31:55'),
(4, 'West Region',  'Western distribution area',  '2026-06-22 17:31:55');

-- ============================================================
-- 4. PRODUCT CATEGORY
-- ============================================================
INSERT INTO `product_category` (`category_id`, `category_name`, `description`, `updated_at`) VALUES
(1, 'Beverages',  'Drinks and beverages',       '2026-06-22 17:31:55'),
(2, 'Snacks',     'Packaged snacks and treats', '2026-06-22 17:31:55'),
(3, 'Dairy',      'Milk and dairy products',    '2026-06-22 17:31:55'),
(4, 'Groceries',  'Grocery staples',            '2026-06-22 17:31:55');

-- ============================================================
-- 5. PRODUCT
-- ============================================================
INSERT INTO `product` (`product_id`, `category_id`, `product_name`, `description`, `unit`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Orange Juice 1L',    '100% natural orange juice',   'bottle', NULL, 'Active', '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 1, 'Mango Drink 500ml',  'Sweet mango fruit drink',     'bottle', NULL, 'Active', '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(3, 2, 'Potato Chips 100g',  'Crispy salted potato chips',  'pack',   NULL, 'Active', '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(4, 3, 'Milk 500ml',         'Fresh pasteurized milk',      'bottle', NULL, 'Active', '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(5, 4, 'Rice 5kg',           'Premium Basmati rice',        'bag',    NULL, 'Active', '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 6. PRODUCT PRICING
-- ============================================================
INSERT INTO `product_pricing` (`pricing_id`, `product_id`, `base_price`, `mrp_max_retail_price`, `effective_from`, `effective_to`, `created_at`, `updated_at`) VALUES
(1, 1,  45.00,  65.00, '2026-01-01', NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 2,  30.00,  45.00, '2026-01-01', NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(3, 3,  20.00,  35.00, '2026-01-01', NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(4, 4,  25.00,  40.00, '2026-01-01', NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(5, 5, 200.00, 300.00, '2026-01-01', NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 7. WAREHOUSE STOCK
-- ============================================================
INSERT INTO `warehouse_stock` (`stock_id`, `product_id`, `quantity`, `expiry_date`, `created_at`, `updated_at`) VALUES
(1, 1, 500, NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 2, 300, NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(3, 3, 200, NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(4, 4, 400, NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(5, 5, 100, NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 8. DISTRIBUTOR
-- ============================================================
INSERT INTO `distributor` (`distributor_id`, `user_id`, `company_name`, `company_address`, `reg_number`, `lic_number`, `doc_url`, `status`, `region_id`, `created_at`, `updated_at`) VALUES
(1, 2, 'Golden Distribution Ltd', '123 Commerce St', 'REG001',   'LIC001',   NULL, 'Approved', 1, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 5, 'goldensupply.pvt.ltd',    '1234,kandyroad,mologoda', 'PV/1234', 'LIC-1234', NULL, 'Pending',  1, '2026-07-03 18:07:03', '2026-07-03 18:07:03');

-- ============================================================
-- 9. RETAILER
-- ============================================================
INSERT INTO `retailer` (`retailer_id`, `user_id`, `region_id`, `shop_name`, `owner_name`, `shop_address`, `city`, `latitude`, `longitude`, `nic_number`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 'Star Grocery Store', 'Mr. Ram', '456 Market Rd', 'Colombo', 6.92707860, 79.86124300, 'NIC123456', NULL, 'Approved', '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 10. DRIVER
-- ============================================================
INSERT INTO `driver` (`driver_id`, `user_id`, `distributor_id`, `license_number`, `vehicle_number`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 'DL123456', 'ABC-1234', 'Approved', '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 11. DISTRIBUTOR STOCK
-- ============================================================
INSERT INTO `distributor_stock` (`distributor_stock_id`, `distributor_id`, `product_id`, `quantity`, `unit_cost`, `last_updated_at`, `updated_at`) VALUES
(1, 1, 1, 200,  45.00, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 1, 2, 150,  30.00, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(3, 1, 3, 100,  20.00, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(4, 1, 4, 250,  25.00, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(5, 1, 5,  50, 200.00, '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 12. CREDIT ACCOUNT
-- ============================================================
INSERT INTO `credit_account` (`credit_id`, `retailer_id`, `distributor_id`, `credit_limit`, `current_balance`, `available_credit`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 15000.00, 3700.00, 11300.00, 'Active', '2026-06-22 17:31:55', '2026-07-06 18:55:56');

-- ============================================================
-- 13. ORDERS
-- ============================================================
INSERT INTO `orders` (`order_id`, `retailer_id`, `distributor_id`, `status`, `total_amount`, `payment_method`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Delivered', 5000.00, 'Cash',   '2026-06-20 10:00:00', '2026-06-22 17:31:55'),
(2, 1, 1, 'Approved',  3700.00, 'Credit', '2026-06-22 09:30:00', '2026-06-22 17:31:55');

-- ============================================================
-- 14. ORDER ITEMS
-- ============================================================
INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `unit_price`, `total_price`, `updated_at`) VALUES
(1, 1, 1, 20,  65.00, 1300.00, '2026-06-22 17:31:55'),
(2, 1, 3, 20,  35.00,  700.00, '2026-06-22 17:31:55'),
(3, 1, 5, 10, 300.00, 3000.00, '2026-06-22 17:31:55'),
(4, 2, 4, 50,  40.00, 2000.00, '2026-06-22 17:31:55'),
(5, 2, 2, 30,  45.00, 1350.00, '2026-06-22 17:31:55'),
(6, 2, 3, 10,  35.00,  350.00, '2026-06-22 17:31:55');

-- ============================================================
-- 15. DELIVERY
-- ============================================================
INSERT INTO `delivery` (`delivery_id`, `order_id`, `driver_id`, `claimed_at`, `delivery_date`, `status`, `total_amount`, `collected_amount`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-06-20 11:00:00', '2026-06-20 12:30:00', 'DELIVERED', 5000.00, 5000.00, 'Delivered successfully, paid in cash.', '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 2, NULL, NULL, NULL, 'OPEN', 3700.00, 0.00, NULL, '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 16. PAYMENT
-- ============================================================
INSERT INTO `payment` (`payment_id`, `retailer_id`, `distributor_id`, `order_id`, `payment_date`, `amount`, `payment_method`, `reference_no`, `received_by`, `updated_at`) VALUES
(1, 1, 1, 1, '2026-06-20', 5000.00, 'Cash', 'CASH-ORD1-001', 4, '2026-06-22 17:31:55');

-- ============================================================
-- 17. CREDIT TRANSACTION
-- ============================================================
INSERT INTO `credit_transaction` (`transaction_id`, `credit_id`, `order_id`, `payment_id`, `transaction_type`, `amount`, `balance_after`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 2, NULL, 'Debit', 3700.00, 3700.00, 'Credit purchase for Order #2', 3, '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 18. SUPPLY REQUEST
-- ============================================================
INSERT INTO `supply_request` (`request_id`, `distributor_id`, `request_date`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-06-21', 'Pending', 'Weekly restock for beverages and snacks', '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 19. SUPPLY REQUEST ITEMS
-- ============================================================
INSERT INTO `supply_request_items` (`request_item_id`, `request_id`, `product_id`, `requested_qty`, `approved_qty`, `remarks`, `updated_at`) VALUES
(1, 1, 1, 100, NULL, 'Running low on Orange Juice',         '2026-06-22 17:31:55'),
(2, 1, 2,  50, NULL, 'Mango drink stock threshold reached', '2026-06-22 17:31:55');

-- ============================================================
-- 20. NOTIFICATION
-- ============================================================
INSERT INTO `notification` (`notification_id`, `user_id`, `title`, `message`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 2, 'New Order Received',  'Order #2 has been placed by Star Grocery Store for LKR 3700.00', 0, '2026-06-22 17:31:55', '2026-06-22 17:31:55'),
(2, 3, 'Delivery Confirmed',  'Your Order #1 has been delivered by driver John Driver.',        1, '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- 21. SYSTEM ANNOUNCEMENT
-- ============================================================
INSERT INTO `system_announcement` (`announcement_id`, `title`, `message`, `target_role`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to Vendora FMCG', 'Welcome to the new FMCG Vendora platform. Please ensure your profiles and prices are up to date.', 'ALL', 1, '2026-06-22 17:31:55', '2026-06-22 17:31:55');

-- ============================================================
-- Reset AUTO_INCREMENT values so new inserts continue correctly
-- ============================================================
ALTER TABLE `roles`               AUTO_INCREMENT = 5;
ALTER TABLE `users`               AUTO_INCREMENT = 6;
ALTER TABLE `auth_tokens`         AUTO_INCREMENT = 22;
ALTER TABLE `distributor_region`  AUTO_INCREMENT = 5;
ALTER TABLE `product_category`    AUTO_INCREMENT = 5;
ALTER TABLE `product`             AUTO_INCREMENT = 6;
ALTER TABLE `product_pricing`     AUTO_INCREMENT = 6;
ALTER TABLE `warehouse_stock`     AUTO_INCREMENT = 6;
ALTER TABLE `distributor`         AUTO_INCREMENT = 3;
ALTER TABLE `retailer`            AUTO_INCREMENT = 2;
ALTER TABLE `driver`              AUTO_INCREMENT = 2;
ALTER TABLE `distributor_stock`   AUTO_INCREMENT = 6;
ALTER TABLE `credit_account`      AUTO_INCREMENT = 2;
ALTER TABLE `orders`              AUTO_INCREMENT = 3;
ALTER TABLE `order_items`         AUTO_INCREMENT = 7;
ALTER TABLE `delivery`            AUTO_INCREMENT = 3;
ALTER TABLE `payment`             AUTO_INCREMENT = 2;
ALTER TABLE `credit_transaction`  AUTO_INCREMENT = 2;
ALTER TABLE `supply_request`      AUTO_INCREMENT = 2;
ALTER TABLE `supply_request_items` AUTO_INCREMENT = 3;
ALTER TABLE `notification`        AUTO_INCREMENT = 3;
ALTER TABLE `system_announcement` AUTO_INCREMENT = 2;

-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
-- End of seed file
-- ============================================================
