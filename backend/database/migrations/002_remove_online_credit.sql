-- Migration 002: Remove Online_Credit from orders payment_method enum
ALTER TABLE `orders` 
MODIFY COLUMN `payment_method` enum('Cash','Credit','Cash_Credit','Online') DEFAULT 'Cash';
