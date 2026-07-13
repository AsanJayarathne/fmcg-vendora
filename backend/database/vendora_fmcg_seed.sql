-- ============================================================
--  FMCG Vendora - Seed Data
--  File   : vendora_fmcg_seed.sql
--  Usage  : Import this file SECOND (after structure file)
--  Target : MySQL / MariaDB
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
USE `vendora_fmcg`;

-- Truncate all tables to avoid unique constraint violations
TRUNCATE TABLE `credit_transaction`;
TRUNCATE TABLE `payment`;
TRUNCATE TABLE `delivery`;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `credit_account`;
TRUNCATE TABLE `distributor_pricing`;
TRUNCATE TABLE `distributor_stock`;
TRUNCATE TABLE `driver`;
TRUNCATE TABLE `retailer`;
TRUNCATE TABLE `distributor`;
TRUNCATE TABLE `warehouse_stock`;
TRUNCATE TABLE `product_pricing`;
TRUNCATE TABLE `product`;
TRUNCATE TABLE `product_category`;
TRUNCATE TABLE `distributor_region`;
TRUNCATE TABLE `auth_tokens`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `roles`;
TRUNCATE TABLE `supply_request_items`;
TRUNCATE TABLE `supply_request`;
TRUNCATE TABLE `notification`;
TRUNCATE TABLE `system_announcement`;

-- ============================================================
-- 1. ROLES
-- ============================================================
INSERT INTO `roles` (`role_id`, `role_name`, `description`) VALUES
(1, 'SUPER_ADMIN', 'System Administrator with full access'),
(2, 'DISTRIBUTOR', 'Distributor who manages orders and inventory'),
(3, 'RETAILER',    'Retailer who places orders'),
(4, 'DRIVER',      'Driver who handles deliveries');

-- ============================================================
-- 2. USERS
-- Passwords are SHA-256 hashed.
-- Credentials:
--   admin@vendora.com      -> admin123
--   golden@distributor.com -> dist123
--   star@retail.com        -> retail123
--   john@driver.com        -> driver123
-- ============================================================
INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password`, `role_id`, `is_active`) VALUES
(1, 'Admin User',        'admin@vendora.com',      '0771234567', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 1, 1),
(2, 'Golden Distributor', 'golden@distributor.com', '0771111111', '624bb493061bfc379d7774f53a6e595378a1c59738196574c7e7422620516504', 2, 1),
(3, 'Star Retailer',      'star@retail.com',        '0772222222', '7c8be7f4a4895b26fd4b9d54a1e6be9e14d8944a54352358c25dd2e33c0374fc', 3, 1),
(4, 'John Driver',        'john@driver.com',        '0773333333', '494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382', 4, 1);

-- ============================================================
-- 3. DISTRIBUTOR REGION (Sri Lanka 25 Districts)
-- ============================================================
INSERT INTO `distributor_region` (`region_id`, `region_name`, `description`) VALUES
(1, 'Colombo', 'Colombo District'),
(2, 'Gampaha', 'Gampaha District'),
(3, 'Kalutara', 'Kalutara District'),
(4, 'Kandy', 'Kandy District'),
(5, 'Matale', 'Matale District'),
(6, 'Nuwara Eliya', 'Nuwara Eliya District'),
(7, 'Galle', 'Galle District'),
(8, 'Matara', 'Matara District'),
(9, 'Hambantota', 'Hambantota District'),
(10, 'Jaffna', 'Jaffna District'),
(11, 'Kilinochchi', 'Kilinochchi District'),
(12, 'Mannar', 'Mannar District'),
(13, 'Vavuniya', 'Vavuniya District'),
(14, 'Mullaitivu', 'Mullaitivu District'),
(15, 'Batticaloa', 'Batticaloa District'),
(16, 'Ampara', 'Ampara District'),
(17, 'Trincomalee', 'Trincomalee District'),
(18, 'Kurunegala', 'Kurunegala District'),
(19, 'Puttalam', 'Puttalam District'),
(20, 'Anuradhapura', 'Anuradhapura District'),
(21, 'Polonnaruwa', 'Polonnaruwa District'),
(22, 'Badulla', 'Badulla District'),
(23, 'Moneragala', 'Moneragala District'),
(24, 'Ratnapura', 'Ratnapura District'),
(25, 'Kegalle', 'Kegalle District');

-- ============================================================
-- 4. PRODUCT CATEGORY
-- Categories requested: crackers, marie, creambiscuits, wafers, cokkies, gift assortments, shorties
-- ============================================================
INSERT INTO `product_category` (`category_id`, `category_name`, `description`) VALUES
(1, 'crackers',          'Crispy crackers and salted biscuits'),
(2, 'marie',             'Classic Marie biscuits'),
(3, 'creambiscuits',     'Sweet cream-filled sandwich biscuits'),
(4, 'wafers',            'Crisp wafer layers with sweet cream'),
(5, 'cokkies',           'Delicious baked chocolate chip cookies'),
(6, 'gift assortments',  'Premium biscuit gift selections'),
(7, 'shorties',          'Rich coconut and butter shorties');

-- ============================================================
-- 5. PRODUCT
-- ============================================================
INSERT INTO `product` (`product_id`, `category_id`, `product_name`, `description`, `unit`, `image_url`, `status`) VALUES
(1, 1, 'Munchee Super Cream Cracker', 'Perfect crispy cream crackers', '190g', NULL, 'Active'),
(2, 2, 'Maliban Gold Marie', 'Classic tea time Marie biscuits', '80g', NULL, 'Active'),
(3, 3, 'Munchee Lemon Puff', 'Creamy tangy lemon puff biscuits', '200g', NULL, 'Active'),
(4, 4, 'Munchee Chocolate Wafers', 'Delicious chocolate wafer biscuits', '100g', NULL, 'Active'),
(5, 5, 'Maliban Chocolate Chip Cookies', 'Rich chocolate chips baked to perfection', '150g', NULL, 'Active'),
(6, 6, 'Munchee Biscuit Assortment', 'A premium selection of sweet biscuits', '400g', NULL, 'Active'),
(7, 7, 'Munchee Nice Biscuit', 'Sweet coconut shorties biscuits', '100g', NULL, 'Active');

-- ============================================================
-- 6. PRODUCT PRICING
-- ============================================================
INSERT INTO `product_pricing` (`pricing_id`, `product_id`, `base_price`, `mrp_max_retail_price`, `effective_from`, `effective_to`) VALUES
(1, 1,  100.00,  140.00, '2026-01-01', NULL),
(2, 2,   40.00,   60.00, '2026-01-01', NULL),
(3, 3,   80.00,  110.00, '2026-01-01', NULL),
(4, 4,   70.00,   95.00, '2026-01-01', NULL),
(5, 5,  120.00,  160.00, '2026-01-01', NULL),
(6, 6,  450.00,  600.00, '2026-01-01', NULL),
(7, 7,   50.00,   75.00, '2026-01-01', NULL);

-- ============================================================
-- 7. WAREHOUSE STOCK
-- ============================================================
INSERT INTO `warehouse_stock` (`stock_id`, `product_id`, `quantity`, `expiry_date`) VALUES
(1, 1, 1000, NULL),
(2, 2, 1500, NULL),
(3, 3, 800, NULL),
(4, 4, 1200, NULL),
(5, 5, 600, NULL),
(6, 6, 300, NULL),
(7, 7, 2000, NULL);

-- ============================================================
-- 8. DISTRIBUTOR (Assigned to Colombo District - ID 1)
-- ============================================================
INSERT INTO `distributor` (`distributor_id`, `user_id`, `company_name`, `company_address`, `reg_number`, `lic_number`, `doc_url`, `status`, `region_id`) VALUES
(1, 2, 'Golden Distribution Ltd', '123 Commerce St', 'REG001', 'LIC001', NULL, 'Approved', 1);

-- ============================================================
-- 9. RETAILER (Assigned to Colombo District - ID 1)
-- ============================================================
INSERT INTO `retailer` (`retailer_id`, `user_id`, `region_id`, `shop_name`, `owner_name`, `shop_address`, `city`, `latitude`, `longitude`, `nic_number`, `phone`, `status`) VALUES
(1, 3, 1, 'Star Grocery Store', 'Mr. Ram', '456 Market Rd', 'Colombo', 6.92707860, 79.86124300, 'NIC123456', NULL, 'Approved');

-- ============================================================
-- 10. DRIVER
-- ============================================================
INSERT INTO `driver` (`driver_id`, `user_id`, `distributor_id`, `license_number`, `vehicle_number`, `status`) VALUES
(1, 4, 1, 'DL123456', 'ABC-1234', 'Approved');

-- ============================================================
-- 11. DISTRIBUTOR STOCK
-- ============================================================
INSERT INTO `distributor_stock` (`distributor_stock_id`, `distributor_id`, `product_id`, `quantity`, `unit_cost`) VALUES
(1, 1, 1, 150,  90.00),
(2, 1, 2, 200,  35.00),
(3, 1, 3, 100,  70.00),
(4, 1, 4, 120,  60.00),
(5, 1, 5,  80, 110.00),
(6, 1, 6,  50, 400.00),
(7, 1, 7, 300,  45.00);

-- ============================================================
-- 12. DISTRIBUTOR PRICING
-- ============================================================
INSERT INTO `distributor_pricing` (`dist_price_id`, `distributor_id`, `product_id`, `price`, `effective_from`) VALUES
(1, 1, 1, 110.00, '2026-07-13'),
(2, 1, 2,  45.00, '2026-07-13'),
(3, 1, 3,  85.00, '2026-07-13'),
(4, 1, 4,  75.00, '2026-07-13'),
(5, 1, 5, 130.00, '2026-07-13'),
(6, 1, 6, 480.00, '2026-07-13'),
(7, 1, 7,  55.00, '2026-07-13');

-- ============================================================
-- 13. CREDIT ACCOUNT
-- ============================================================
INSERT INTO `credit_account` (`credit_id`, `retailer_id`, `distributor_id`, `credit_limit`, `current_balance`, `available_credit`, `status`) VALUES
(1, 1, 1, 50000.00, 0.00, 50000.00, 'Active');

-- ============================================================
-- 14. SYSTEM ANNOUNCEMENT
-- ============================================================
INSERT INTO `system_announcement` (`announcement_id`, `title`, `message`, `target_role`, `created_by`) VALUES
(1, 'Welcome to Vendora FMCG', 'Welcome to the new FMCG Vendora platform. Please ensure your profiles and prices are up to date.', 'ALL', 1);

-- ============================================================
-- Reset AUTO_INCREMENT values
-- ============================================================
ALTER TABLE `roles`               AUTO_INCREMENT = 5;
ALTER TABLE `users`               AUTO_INCREMENT = 5;
ALTER TABLE `auth_tokens`         AUTO_INCREMENT = 1;
ALTER TABLE `distributor_region`  AUTO_INCREMENT = 26;
ALTER TABLE `product_category`    AUTO_INCREMENT = 8;
ALTER TABLE `product`             AUTO_INCREMENT = 8;
ALTER TABLE `product_pricing`     AUTO_INCREMENT = 8;
ALTER TABLE `warehouse_stock`     AUTO_INCREMENT = 8;
ALTER TABLE `distributor`         AUTO_INCREMENT = 2;
ALTER TABLE `retailer`            AUTO_INCREMENT = 2;
ALTER TABLE `driver`              AUTO_INCREMENT = 2;
ALTER TABLE `distributor_stock`   AUTO_INCREMENT = 8;
ALTER TABLE `distributor_pricing` AUTO_INCREMENT = 8;
ALTER TABLE `credit_account`      AUTO_INCREMENT = 2;
ALTER TABLE `orders`              AUTO_INCREMENT = 1;
ALTER TABLE `order_items`         AUTO_INCREMENT = 1;
ALTER TABLE `delivery`            AUTO_INCREMENT = 1;
ALTER TABLE `payment`             AUTO_INCREMENT = 1;
ALTER TABLE `credit_transaction`  AUTO_INCREMENT = 1;
ALTER TABLE `supply_request`      AUTO_INCREMENT = 1;
ALTER TABLE `supply_request_items` AUTO_INCREMENT = 1;
ALTER TABLE `notification`        AUTO_INCREMENT = 1;
ALTER TABLE `system_announcement` AUTO_INCREMENT = 2;

SET FOREIGN_KEY_CHECKS = 1;
