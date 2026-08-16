-- Migration 003: Add order_type to orders table
ALTER TABLE `orders`
ADD COLUMN `order_type` enum('Normal','Urgent') NOT NULL DEFAULT 'Normal' AFTER `distributor_id`;
