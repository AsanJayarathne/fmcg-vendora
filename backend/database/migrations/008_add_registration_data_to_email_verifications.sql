-- Migration: 008_add_registration_data_to_email_verifications.sql
-- Description: Add registration_data JSON column to stage pending account data until OTP email verification is confirmed.

ALTER TABLE `email_verifications` 
ADD COLUMN `registration_data` JSON DEFAULT NULL AFTER `used`;
