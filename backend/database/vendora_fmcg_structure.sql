-- ============================================================
--  FMCG Vendora - Database Structure (Schema Only)
--  File   : vendora_fmcg_structure.sql
--  Usage  : Import this file FIRST in phpMyAdmin
--  Target : MySQL / MariaDB
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Create & select the database
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `vendora_fmcg`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `vendora_fmcg`;

-- ============================================================
-- 1. ROLES
-- ============================================================
CREATE TABLE `roles` (
  `role_id`     int(11)      NOT NULL AUTO_INCREMENT,
  `role_name`   varchar(50)  NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at`  timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uq_roles_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. USERS
-- ============================================================
CREATE TABLE `users` (
  `user_id`           int(11)      NOT NULL AUTO_INCREMENT,
  `full_name`         varchar(100) NOT NULL,
  `email`             varchar(100) NOT NULL,
  `phone`             varchar(20)  NOT NULL,
  `avatar_url`        varchar(255) DEFAULT NULL,
  `password`          varchar(255) NOT NULL,
  `role_id`           int(11)      NOT NULL,
  `is_active`         tinyint(1)   NOT NULL DEFAULT 1,
  `is_email_verified` tinyint(1)   NOT NULL DEFAULT 0,
  `created_at`        timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`        timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_phone` (`phone`),
  KEY `idx_users_role`   (`role_id`),
  KEY `idx_users_active` (`is_active`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. AUTH TOKENS
-- ============================================================
CREATE TABLE `auth_tokens` (
  `token_id`   int(11)     NOT NULL AUTO_INCREMENT,
  `user_id`    int(11)     NOT NULL,
  `token`      varchar(64) NOT NULL,
  `role_name`  varchar(50) NOT NULL,
  `expires_at` datetime    NOT NULL,
  `created_at` timestamp   NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`token_id`),
  UNIQUE KEY `uq_auth_tokens_token` (`token`),
  KEY `idx_auth_tokens_user` (`user_id`),
  CONSTRAINT `fk_auth_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. DISTRIBUTOR REGION
-- ============================================================
CREATE TABLE `distributor_region` (
  `region_id`   int(11)      NOT NULL AUTO_INCREMENT,
  `region_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at`  timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`region_id`),
  UNIQUE KEY `uq_region_name` (`region_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. PRODUCT CATEGORY
-- ============================================================
CREATE TABLE `product_category` (
  `category_id`   int(11)      NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description`   varchar(255) DEFAULT NULL,
  `updated_at`    timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. PRODUCT
-- ============================================================
CREATE TABLE `product` (
  `product_id`   int(11)                    NOT NULL AUTO_INCREMENT,
  `category_id`  int(11)                    NOT NULL,
  `product_name` varchar(150)               NOT NULL,
  `description`  varchar(500)               DEFAULT NULL,
  `unit`         varchar(50)                DEFAULT NULL,
  `image_url`    varchar(255)               DEFAULT NULL,
  `status`       enum('Active','Inactive')   DEFAULT 'Active',
  `created_at`   timestamp                  NOT NULL DEFAULT current_timestamp(),
  `updated_at`   timestamp                  NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`product_id`),
  KEY `idx_product_category` (`category_id`),
  KEY `idx_product_name`     (`product_name`),
  KEY `idx_product_status`   (`status`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. PRODUCT PRICING
-- ============================================================
CREATE TABLE `product_pricing` (
  `pricing_id`           int(11)       NOT NULL AUTO_INCREMENT,
  `product_id`           int(11)       NOT NULL,
  `base_price`           decimal(10,2) NOT NULL,
  `mrp_max_retail_price` decimal(10,2) NOT NULL,
  `effective_from`       date          NOT NULL,
  `effective_to`         date          DEFAULT NULL,
  `created_at`           timestamp     NOT NULL DEFAULT current_timestamp(),
  `updated_at`           timestamp     NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`pricing_id`),
  KEY `idx_pricing_product` (`product_id`),
  KEY `idx_pricing_from`    (`effective_from`),
  KEY `idx_pricing_to`      (`effective_to`),
  CONSTRAINT `fk_pricing_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. WAREHOUSE BATCH (replaces warehouse_stock)
-- ============================================================
CREATE TABLE `warehouse_batch` (
  `batch_id`      int(11)                              NOT NULL AUTO_INCREMENT,
  `product_id`    int(11)                              NOT NULL,
  `batch_number`  varchar(50)                          NOT NULL,
  `received_qty`  int(11)                              NOT NULL,
  `quantity`      int(11)                              NOT NULL DEFAULT 0,
  `cost_price`    decimal(10,2)                        NOT NULL,
  `selling_price` decimal(10,2)                        NOT NULL,
  `mfg_date`      date                                 DEFAULT NULL,
  `expiry_date`   date                                 DEFAULT NULL,
  `status`        enum('Active','Exhausted','Expired')  NOT NULL DEFAULT 'Active',
  `received_at`   date                                 NOT NULL,
  `created_at`    timestamp                            NOT NULL DEFAULT current_timestamp(),
  `updated_at`    timestamp                            NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`batch_id`),
  UNIQUE KEY `uq_wh_batch_number`  (`batch_number`),
  KEY `idx_whbatch_product`        (`product_id`),
  KEY `idx_whbatch_status`         (`status`),
  KEY `idx_whbatch_expiry`         (`expiry_date`),
  CONSTRAINT `fk_whbatch_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. DISTRIBUTOR
-- ============================================================
CREATE TABLE `distributor` (
  `distributor_id`  int(11)                                        NOT NULL AUTO_INCREMENT,
  `user_id`         int(11)                                        NOT NULL,
  `company_name`    varchar(100)                                   NOT NULL,
  `company_address` varchar(255)                                   NOT NULL,
  `reg_number`      varchar(50)                                    NOT NULL,
  `lic_number`      varchar(50)                                    NOT NULL,
  `doc_url`         varchar(500)                                   DEFAULT NULL,
  `status`          enum('Pending','Approved','Rejected','Blocked') DEFAULT 'Pending',
  `region_id`       int(11)                                        NOT NULL,
  `created_at`      timestamp                                      NOT NULL DEFAULT current_timestamp(),
  `updated_at`      timestamp                                      NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`distributor_id`),
  UNIQUE KEY `uq_distributor_user` (`user_id`),
  UNIQUE KEY `uq_distributor_reg`  (`reg_number`),
  UNIQUE KEY `uq_distributor_lic`  (`lic_number`),
  KEY `idx_distributor_status` (`status`),
  KEY `idx_distributor_region` (`region_id`),
  CONSTRAINT `fk_distributor_region` FOREIGN KEY (`region_id`) REFERENCES `distributor_region` (`region_id`),
  CONSTRAINT `fk_distributor_user`   FOREIGN KEY (`user_id`)   REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. RETAILER
-- ============================================================
CREATE TABLE `retailer` (
  `retailer_id`  int(11)                                         NOT NULL AUTO_INCREMENT,
  `user_id`      int(11)                                         NOT NULL,
  `region_id`    int(11)                                         NOT NULL,
  `shop_name`    varchar(100)                                    NOT NULL,
  `owner_name`   varchar(100)                                    NOT NULL,
  `shop_address` varchar(255)                                    NOT NULL,
  `city`         varchar(100)                                    DEFAULT NULL,
  `latitude`     decimal(10,8)                                   DEFAULT NULL,
  `longitude`    decimal(11,8)                                   DEFAULT NULL,
  `nic_number`   varchar(20)                                     NOT NULL,
  `phone`        varchar(20)                                     DEFAULT NULL,
  `status`       enum('Pending','Approved','Rejected','Blocked')  DEFAULT 'Pending',
  `created_at`   timestamp                                       NOT NULL DEFAULT current_timestamp(),
  `updated_at`   timestamp                                       NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`retailer_id`),
  UNIQUE KEY `uq_retailer_user` (`user_id`),
  UNIQUE KEY `uq_retailer_nic`  (`nic_number`),
  KEY `idx_retailer_status` (`status`),
  KEY `idx_retailer_region` (`region_id`),
  CONSTRAINT `fk_retailer_region` FOREIGN KEY (`region_id`) REFERENCES `distributor_region` (`region_id`),
  CONSTRAINT `fk_retailer_user`   FOREIGN KEY (`user_id`)   REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. DRIVER
-- ============================================================
CREATE TABLE `driver` (
  `driver_id`      int(11)                          NOT NULL AUTO_INCREMENT,
  `user_id`        int(11)                          NOT NULL,
  `distributor_id` int(11)                          NOT NULL,
  `license_number` varchar(50)                      NOT NULL,
  `vehicle_number` varchar(50)                      NOT NULL,
  `status`         enum('Pending','Approved','Blocked') DEFAULT 'Pending',
  `created_at`     timestamp                        NOT NULL DEFAULT current_timestamp(),
  `updated_at`     timestamp                        NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`driver_id`),
  UNIQUE KEY `uq_driver_user`    (`user_id`),
  UNIQUE KEY `uq_driver_license` (`license_number`),
  UNIQUE KEY `uq_driver_vehicle` (`vehicle_number`),
  KEY `idx_driver_status`      (`status`),
  KEY `idx_driver_distributor` (`distributor_id`),
  CONSTRAINT `fk_driver_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_driver_user`        FOREIGN KEY (`user_id`)        REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. DISTRIBUTOR BATCH (replaces distributor_stock)
-- ============================================================
CREATE TABLE `distributor_batch` (
  `dist_batch_id`   int(11)                              NOT NULL AUTO_INCREMENT,
  `distributor_id`  int(11)                              NOT NULL,
  `product_id`      int(11)                              NOT NULL,
  `source_batch_id` int(11)                              DEFAULT NULL,
  `transfer_id`     int(11)                              DEFAULT NULL,
  `batch_number`    varchar(50)                          NOT NULL,
  `received_qty`    int(11)                              NOT NULL,
  `quantity`        int(11)                              NOT NULL DEFAULT 0,
  `cost_price`      decimal(10,2)                        NOT NULL,
  `selling_price`   decimal(10,2)                        NOT NULL,
  `mfg_date`        date                                 DEFAULT NULL,
  `expiry_date`     date                                 DEFAULT NULL,
  `status`          enum('Active','Exhausted','Expired')  NOT NULL DEFAULT 'Active',
  `received_at`     date                                 NOT NULL,
  `created_at`      timestamp                            NOT NULL DEFAULT current_timestamp(),
  `updated_at`      timestamp                            NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`dist_batch_id`),
  UNIQUE KEY `uq_dist_batch_number`       (`batch_number`),
  KEY `idx_distbatch_distributor`         (`distributor_id`),
  KEY `idx_distbatch_product`             (`product_id`),
  KEY `idx_distbatch_source`              (`source_batch_id`),
  KEY `idx_distbatch_transfer`            (`transfer_id`),
  KEY `idx_distbatch_status`              (`status`),
  KEY `idx_distbatch_expiry`              (`expiry_date`),
  CONSTRAINT `fk_distbatch_distributor`   FOREIGN KEY (`distributor_id`)  REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_distbatch_product`       FOREIGN KEY (`product_id`)      REFERENCES `product` (`product_id`),
  CONSTRAINT `fk_distbatch_source_batch`  FOREIGN KEY (`source_batch_id`) REFERENCES `warehouse_batch` (`batch_id`),
  CONSTRAINT `fk_distbatch_transfer`      FOREIGN KEY (`transfer_id`)     REFERENCES `stock_transfer` (`transfer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. STOCK TRANSFER ITEMS
-- ============================================================
CREATE TABLE `stock_transfer_items` (
  `transfer_item_id`   int(11)       NOT NULL AUTO_INCREMENT,
  `transfer_id`        int(11)       NOT NULL,
  `warehouse_batch_id` int(11)       NOT NULL,
  `product_id`         int(11)       NOT NULL,
  `dispatched_qty`     int(11)       NOT NULL,
  `cost_price`         decimal(10,2) NOT NULL,
  `selling_price`      decimal(10,2) NOT NULL,
  `created_at`         timestamp     NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`transfer_item_id`),
  KEY `idx_sti_transfer`        (`transfer_id`),
  KEY `idx_sti_warehouse_batch` (`warehouse_batch_id`),
  KEY `idx_sti_product`         (`product_id`),
  CONSTRAINT `fk_sti_transfer`        FOREIGN KEY (`transfer_id`)        REFERENCES `stock_transfer` (`transfer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sti_warehouse_batch` FOREIGN KEY (`warehouse_batch_id`) REFERENCES `warehouse_batch` (`batch_id`),
  CONSTRAINT `fk_sti_product`         FOREIGN KEY (`product_id`)         REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. CREDIT ACCOUNT
-- ============================================================
CREATE TABLE `credit_account` (
  `credit_id`        int(11)       NOT NULL AUTO_INCREMENT,
  `retailer_id`      int(11)       NOT NULL,
  `distributor_id`   int(11)       NOT NULL,
  `credit_limit`     decimal(12,2) NOT NULL,
  `current_balance`  decimal(12,2) NOT NULL DEFAULT 0.00,
  `available_credit` decimal(12,2) NOT NULL,
  `status`           enum('Active','Blocked') DEFAULT 'Active',
  `created_at`       timestamp     NOT NULL DEFAULT current_timestamp(),
  `updated_at`       timestamp     NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`credit_id`),
  UNIQUE KEY `uq_credit_retailer_dist` (`retailer_id`,`distributor_id`),
  KEY `idx_credit_status`    (`status`),
  KEY `fk_credit_distributor` (`distributor_id`),
  CONSTRAINT `fk_credit_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_credit_retailer`    FOREIGN KEY (`retailer_id`)    REFERENCES `retailer` (`retailer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. ORDERS
-- ============================================================
CREATE TABLE `orders` (
  `order_id`           int(11)                                                       NOT NULL AUTO_INCREMENT,
  `retailer_id`        int(11)                                                       NOT NULL,
  `distributor_id`     int(11)                                                       NOT NULL,
  `order_type`         enum('Normal','Urgent')                                       NOT NULL DEFAULT 'Normal',
  `status`             enum('Pending','Approved','Processing','Delivered','Rejected') DEFAULT 'Pending',
  `total_amount`       decimal(12,2)                                                 DEFAULT NULL,
  `payment_method`     enum('Cash','Credit','Cash_Credit','Online')                 DEFAULT 'Cash',
  `payment_status`     enum('Unpaid','Pending_Gateway','Paid','Failed','Refunded')   DEFAULT 'Unpaid',
  `credit_amount`      decimal(12,2)                                                 NOT NULL DEFAULT 0.00,
  `cash_amount`        decimal(12,2)                                                 NOT NULL DEFAULT 0.00,
  `outstanding_credit` decimal(12,2)                                                 NOT NULL DEFAULT 0.00,
  `created_at`         timestamp                                                     NOT NULL DEFAULT current_timestamp(),
  `updated_at`         timestamp                                                     NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`order_id`),
  KEY `idx_orders_retailer`    (`retailer_id`),
  KEY `idx_orders_distributor` (`distributor_id`),
  KEY `idx_orders_status`      (`status`),
  KEY `idx_orders_payment_st`  (`payment_status`),
  KEY `idx_orders_created`     (`created_at`),
  CONSTRAINT `fk_orders_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_orders_retailer`    FOREIGN KEY (`retailer_id`)    REFERENCES `retailer` (`retailer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. ORDER ITEMS
-- ============================================================
CREATE TABLE `order_items` (
  `order_item_id` int(11)       NOT NULL AUTO_INCREMENT,
  `order_id`      int(11)       NOT NULL,
  `product_id`    int(11)       NOT NULL,
  `quantity`      int(11)       NOT NULL,
  `unit_price`    decimal(10,2) NOT NULL,
  `total_price`   decimal(12,2) NOT NULL,
  `updated_at`    timestamp     NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`order_item_id`),
  KEY `idx_orderitems_order`   (`order_id`),
  KEY `idx_orderitems_product` (`product_id`),
  CONSTRAINT `fk_orderitems_order`   FOREIGN KEY (`order_id`)   REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitems_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. DELIVERY
-- ============================================================
CREATE TABLE `delivery` (
  `delivery_id`      int(11)                                      NOT NULL AUTO_INCREMENT,
  `order_id`         int(11)                                      NOT NULL,
  `driver_id`        int(11)                                      DEFAULT NULL,
  `claimed_at`       datetime                                     DEFAULT NULL,
  `delivery_date`    datetime                                     DEFAULT NULL,
  `status`           enum('OPEN','CLAIMED','DELIVERED','RETURNED') DEFAULT 'OPEN',
  `total_amount`     decimal(12,2)                                DEFAULT NULL,
  `collected_amount` decimal(12,2)                                DEFAULT NULL,
  `remarks`          varchar(500)                                 DEFAULT NULL,
  `created_at`       timestamp                                    NOT NULL DEFAULT current_timestamp(),
  `updated_at`       timestamp                                    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`delivery_id`),
  KEY `idx_delivery_order`  (`order_id`),
  KEY `idx_delivery_driver` (`driver_id`),
  KEY `idx_delivery_status` (`status`),
  CONSTRAINT `fk_delivery_driver` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`),
  CONSTRAINT `fk_delivery_order`  FOREIGN KEY (`order_id`)  REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. PAYMENT
-- ============================================================
CREATE TABLE `payment` (
  `payment_id`     int(11)                      NOT NULL AUTO_INCREMENT,
  `retailer_id`    int(11)                      NOT NULL,
  `distributor_id` int(11)                      NOT NULL,
  `order_id`       int(11)                      DEFAULT NULL,
  `payment_date`   date                         NOT NULL,
  `amount`         decimal(12,2)                NOT NULL,
  `payment_method` enum('Cash','Bank','Online','Other')  NOT NULL,
  `reference_no`   varchar(100)                 DEFAULT NULL,
  `received_by`    int(11)                      NOT NULL,
  `updated_at`     timestamp                    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`payment_id`),
  KEY `idx_payment_retailer`    (`retailer_id`),
  KEY `idx_payment_distributor` (`distributor_id`),
  KEY `idx_payment_order`       (`order_id`),
  KEY `idx_payment_date`        (`payment_date`),
  KEY `fk_payment_received_by`  (`received_by`),
  CONSTRAINT `fk_payment_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_payment_order`       FOREIGN KEY (`order_id`)       REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_payment_received_by` FOREIGN KEY (`received_by`)    REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_payment_retailer`    FOREIGN KEY (`retailer_id`)    REFERENCES `retailer` (`retailer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. CREDIT TRANSACTION
-- ============================================================
CREATE TABLE `credit_transaction` (
  `transaction_id`   int(11)                              NOT NULL AUTO_INCREMENT,
  `credit_id`        int(11)                              NOT NULL,
  `order_id`         int(11)                              DEFAULT NULL,
  `payment_id`       int(11)                              DEFAULT NULL,
  `transaction_type` enum('Debit','Credit','Adjustment')  DEFAULT NULL,
  `amount`           decimal(12,2)                        DEFAULT NULL,
  `balance_after`    decimal(12,2)                        DEFAULT NULL,
  `description`      varchar(255)                         DEFAULT NULL,
  `created_by`       int(11)                              DEFAULT NULL,
  `created_at`       timestamp                            NOT NULL DEFAULT current_timestamp(),
  `updated_at`       timestamp                            NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`transaction_id`),
  KEY `idx_credittxn_credit`    (`credit_id`),
  KEY `idx_credittxn_order`     (`order_id`),
  KEY `idx_credittxn_payment`   (`payment_id`),
  KEY `idx_credittxn_type`      (`transaction_type`),
  KEY `fk_credittxn_created_by` (`created_by`),
  CONSTRAINT `fk_credittxn_created_by` FOREIGN KEY (`created_by`)  REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_credittxn_credit`     FOREIGN KEY (`credit_id`)   REFERENCES `credit_account` (`credit_id`),
  CONSTRAINT `fk_credittxn_order`      FOREIGN KEY (`order_id`)    REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_credittxn_payment`    FOREIGN KEY (`payment_id`)  REFERENCES `payment` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 21. SUPPLY REQUEST
-- ============================================================
CREATE TABLE `supply_request` (
  `request_id`     int(11)                                    NOT NULL AUTO_INCREMENT,
  `distributor_id` int(11)                                    NOT NULL,
  `request_date`   date                                       NOT NULL,
  `status`         enum('Pending','Partially_Approved','Rejected','Received') DEFAULT 'Pending',
  `remarks`        varchar(500)                               DEFAULT NULL,
  `created_at`     timestamp                                  NOT NULL DEFAULT current_timestamp(),
  `updated_at`     timestamp                                  NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`request_id`),
  KEY `idx_supplyreq_distributor` (`distributor_id`),
  KEY `idx_supplyreq_status`      (`status`),
  KEY `idx_supplyreq_date`        (`request_date`),
  CONSTRAINT `fk_supplyreq_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 22. SUPPLY REQUEST ITEMS
-- ============================================================
CREATE TABLE `supply_request_items` (
  `request_item_id` int(11)      NOT NULL AUTO_INCREMENT,
  `request_id`      int(11)      NOT NULL,
  `product_id`      int(11)      NOT NULL,
  `requested_qty`   int(11)      NOT NULL,
  `approved_qty`    int(11)      DEFAULT NULL,
  `remarks`         varchar(255) DEFAULT NULL,
  `updated_at`      timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`request_item_id`),
  KEY `idx_supplyitems_request` (`request_id`),
  KEY `idx_supplyitems_product` (`product_id`),
  CONSTRAINT `fk_supplyitems_product` FOREIGN KEY (`product_id`)  REFERENCES `product` (`product_id`),
  CONSTRAINT `fk_supplyitems_request` FOREIGN KEY (`request_id`)  REFERENCES `supply_request` (`request_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 23. STOCK TRANSFER
-- ============================================================
CREATE TABLE `stock_transfer` (
  `transfer_id`    int(11)                                              NOT NULL AUTO_INCREMENT,
  `request_id`     int(11)                                              NOT NULL,
  `distributor_id` int(11)                                              NOT NULL,
  `transfer_date`  datetime                                             NOT NULL,
  `status`         enum('Pending','Approved','Dispatched','Received','Cancelled') DEFAULT 'Pending',
  `approved_by`    int(11)                                              DEFAULT NULL,
  `received_by`    int(11)                                              DEFAULT NULL,
  `remarks`        varchar(500)                                         DEFAULT NULL,
  `created_at`     timestamp                                            NOT NULL DEFAULT current_timestamp(),
  `updated_at`     timestamp                                            NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`transfer_id`),
  KEY `idx_transfer_request`     (`request_id`),
  KEY `idx_transfer_distributor` (`distributor_id`),
  KEY `idx_transfer_status`      (`status`),
  KEY `fk_transfer_approved_by`  (`approved_by`),
  KEY `fk_transfer_received_by`  (`received_by`),
  CONSTRAINT `fk_transfer_approved_by`  FOREIGN KEY (`approved_by`)    REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_transfer_distributor`  FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_transfer_received_by`  FOREIGN KEY (`received_by`)    REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_transfer_request`      FOREIGN KEY (`request_id`)     REFERENCES `supply_request` (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 24. NOTIFICATION
-- ============================================================
CREATE TABLE `notification` (
  `notification_id` int(11)      NOT NULL AUTO_INCREMENT,
  `user_id`         int(11)      NOT NULL,
  `title`           varchar(150) NOT NULL,
  `message`         varchar(500) NOT NULL,
  `is_read`         tinyint(1)   NOT NULL DEFAULT 0,
  `created_at`      timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`      timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`notification_id`),
  KEY `idx_notif_user`    (`user_id`),
  KEY `idx_notif_is_read` (`is_read`),
  KEY `idx_notif_created` (`created_at`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 27. GATEWAY PAYMENTS
-- ============================================================
CREATE TABLE `gateway_payments` (
  `id`                int(11)                                                               NOT NULL AUTO_INCREMENT,
  `order_id`          int(11)                                                               DEFAULT NULL,
  `credit_id`         int(11)                                                               DEFAULT NULL,
  `retailer_id`       int(11)                                                               NOT NULL,
  `distributor_id`    int(11)                                                               NOT NULL,
  `payment_type`      enum('ORDER','CREDIT_SETTLEMENT')                                     NOT NULL DEFAULT 'ORDER',
  `amount`            decimal(12,2)                                                         NOT NULL,
  `currency`          varchar(10)                                                           DEFAULT 'LKR',
  `gateway_name`      varchar(50)                                                           DEFAULT 'MockGateway',
  `transaction_token` varchar(255)                                                          DEFAULT NULL,
  `gateway_ref`       varchar(100)                                                          DEFAULT NULL,
  `status`            enum('INITIATED','PENDING','SUCCESS','FAILED','CANCELLED')           DEFAULT 'INITIATED',
  `signature`         varchar(255)                                                          DEFAULT NULL,
  `response_payload`  text                                                                  DEFAULT NULL,
  `created_at`        timestamp                                                             NOT NULL DEFAULT current_timestamp(),
  `updated_at`        timestamp                                                             NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_gw_order` (`order_id`),
  KEY `idx_gw_credit` (`credit_id`),
  CONSTRAINT `fk_gw_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gw_credit` FOREIGN KEY (`credit_id`) REFERENCES `credit_account` (`credit_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 28. EMAIL VERIFICATIONS (OTP)
-- ============================================================
CREATE TABLE `email_verifications` (
  `id`         int(11)      NOT NULL AUTO_INCREMENT,
  `email`      varchar(100) NOT NULL,
  `code`       varchar(6)   NOT NULL,
  `attempts`   int(11)      NOT NULL DEFAULT 0,
  `expires_at` datetime     NOT NULL,
  `used`       tinyint(1)   NOT NULL DEFAULT 0,
  `created_at` timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_verify_email` (`email`),
  KEY `idx_verify_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 29. PASSWORD RESETS
-- ============================================================
CREATE TABLE `password_resets` (
  `id`         int(11)      NOT NULL AUTO_INCREMENT,
  `email`      varchar(100) NOT NULL,
  `token`      varchar(128) NOT NULL,
  `expires_at` datetime     NOT NULL,
  `used`       tinyint(1)   NOT NULL DEFAULT 0,
  `created_at` timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_reset_email` (`email`),
  KEY `idx_reset_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
-- End of structure file
-- ============================================================

