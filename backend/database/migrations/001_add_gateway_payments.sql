-- ============================================================
-- Migration: Add Gateway Payments & Update Payment Enums
-- Target: MySQL / MariaDB (vendora_fmcg)
-- ============================================================

USE `vendora_fmcg`;

-- 1. Create gateway_payments table for session handshakes, tokens, IPN webhooks & logs
CREATE TABLE IF NOT EXISTS `gateway_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `retailer_id` int(11) NOT NULL,
  `distributor_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'LKR',
  `gateway_name` varchar(50) DEFAULT 'MockGateway',
  `transaction_token` varchar(255) DEFAULT NULL,
  `gateway_ref` varchar(100) DEFAULT NULL,
  `status` enum('INITIATED','PENDING','SUCCESS','FAILED','CANCELLED') DEFAULT 'INITIATED',
  `signature` varchar(255) DEFAULT NULL,
  `response_payload` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_gw_order` (`order_id`),
  CONSTRAINT `fk_gw_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Modify orders payment_method enum & add payment_status column
ALTER TABLE `orders` 
MODIFY COLUMN `payment_method` enum('Cash','Credit','Cash_Credit','Online','Online_Credit') DEFAULT 'Cash';

ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `payment_status` enum('Unpaid','Pending_Gateway','Paid','Failed','Refunded') DEFAULT 'Unpaid' AFTER `payment_method`;

-- 3. Modify payment table payment_method enum to include 'Online'
ALTER TABLE `payment` 
MODIFY COLUMN `payment_method` enum('Cash','Bank','Online','Other') NOT NULL;
