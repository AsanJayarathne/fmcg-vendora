-- ============================================================
-- Migration 006: Add avatar_url column to users table
-- Target: vendora_fmcg
-- ============================================================

ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `avatar_url` VARCHAR(255) NULL AFTER `phone`;
