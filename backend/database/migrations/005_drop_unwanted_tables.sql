-- ============================================================
-- Migration: 005_drop_unwanted_tables.sql
-- Description: Drop unused legacy tables (sales_report, system_announcement, transaction)
-- ============================================================

DROP TABLE IF EXISTS `sales_report`;
DROP TABLE IF EXISTS `system_announcement`;
DROP TABLE IF EXISTS `transaction`;
