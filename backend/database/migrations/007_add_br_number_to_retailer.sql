-- ============================================================
-- Migration: 007_add_br_number_to_retailer.sql
-- Description: Adds br_number (Business Registration Number) to retailer table
-- ============================================================

ALTER TABLE `retailer` 
ADD COLUMN `br_number` VARCHAR(50) DEFAULT NULL AFTER `nic_number`;
