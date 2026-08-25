-- ============================================================
-- Migration: Support Credit / Debit Settlement in Gateway Payments
-- Target: MySQL / MariaDB (vendora_fmcg)
-- ============================================================

USE `vendora_fmcg`;

-- 1. Allow order_id to be NULL for standalone debit settlements
ALTER TABLE `gateway_payments` MODIFY `order_id` INT(11) NULL;

-- 2. Add credit_id and payment_type columns
ALTER TABLE `gateway_payments` 
  ADD COLUMN IF NOT EXISTS `credit_id` INT(11) NULL AFTER `order_id`,
  ADD COLUMN IF NOT EXISTS `payment_type` ENUM('ORDER', 'CREDIT_SETTLEMENT') NOT NULL DEFAULT 'ORDER' AFTER `distributor_id`,
  ADD KEY IF NOT EXISTS `idx_gw_credit` (`credit_id`);

-- 3. Add constraint if not exists
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND CONSTRAINT_NAME = 'fk_gw_credit' AND TABLE_NAME = 'gateway_payments');
SET @sql_stmt = IF(@fk_exists = 0, 'ALTER TABLE gateway_payments ADD CONSTRAINT fk_gw_credit FOREIGN KEY (credit_id) REFERENCES credit_account (credit_id) ON DELETE CASCADE', 'SELECT 1');
PREPARE stmt FROM @sql_stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
