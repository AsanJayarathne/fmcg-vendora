-- ============================================================
--  Migration: Add 'Received' status to supply_request
--  Run this in phpMyAdmin on the vendora_fmcg database
-- ============================================================

USE `vendora_fmcg`;

ALTER TABLE `supply_request`
  MODIFY COLUMN `status`
    ENUM('Pending','Partially_Approved','Rejected','Received')
    DEFAULT 'Pending';
