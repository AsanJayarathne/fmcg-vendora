CREATE DATABASE IF NOT EXISTS `vendora_fmcg` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vendora_fmcg`;
USE `vendora_fmcg`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: mysql-1da83cc7-vendorafmcg.d.aivencloud.com    Database: vendora_fmcg
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
-- LOG_BIN removed
-- SQL_LOG_BIN removed

--
-- GTID state at the beginning of the backup 
--

-- GTID_PURGED removed for MariaDB

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `token_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`),
  UNIQUE KEY `uq_auth_tokens_token` (`token`),
  KEY `idx_auth_tokens_user` (`user_id`),
  CONSTRAINT `fk_auth_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (129,6,'a408d45be93c16fc754c36663a49f0a44eee37fbee1a64c43dbbe87054d6455c','DISTRIBUTOR','2026-08-15 13:56:19','2026-08-14 08:26:19'),(151,8,'c12e1420b1ac466d4afebc5d4c7428ecad51ee60283816647894ed24809decdb','RETAILER','2026-08-21 23:37:50','2026-08-20 18:07:54'),(186,7,'bf3c99a00444c32470a0b9d1cca6d7008f179bf6916f7acd2f4c71400b16677a','DISTRIBUTOR','2026-09-01 13:29:23','2026-08-31 07:59:23'),(197,3,'42ec1fcb9a42ddda83fec530ee5d12a54c2b654ee41949adbc0bd6755ae4649b','RETAILER','2026-09-20 16:03:31','2026-09-19 10:33:32'),(198,3,'6d28864a762a2874c350f288dfcf7a525af5e58eb56c40aea40ec62ece5b1a95','RETAILER','2026-09-20 16:08:53','2026-09-19 10:38:53'),(200,2,'55121b91b482651d857047ca00758003e7995f239f3493f8673ef5677522302e','DISTRIBUTOR','2026-09-20 16:16:15','2026-09-19 10:46:15'),(201,3,'52df3f066bb49c90174a0def032f2ff4cf1e47bd8e7859d02998db683326628d','RETAILER','2026-09-20 16:17:19','2026-09-19 10:47:19'),(202,3,'ca12bcf11e73915016a1e540372cf952863ee81f941ef0300a9d32aee0409c64','RETAILER','2026-09-20 16:19:33','2026-09-19 10:49:33'),(203,1,'71eb776c4b1a071f67dec01efb13aca596c6273f6480273d3441e4477f6c10c7','SUPER_ADMIN','2026-09-20 16:28:11','2026-09-19 10:58:11'),(204,2,'188222612bff1dc5d2d16350078880c9e8d2f8a6724ee2fe121cf39838b3500b','DISTRIBUTOR','2026-09-21 07:42:09','2026-09-20 02:12:10'),(205,1,'ea80a9bb8dd0c7d6fd5ab4044f53db8500068c86ec36e8f50176c170bfed2020','SUPER_ADMIN','2026-09-21 07:42:28','2026-09-20 02:12:29'),(206,4,'4bcfc4708fbee83903463103410d14f3e3f76b1aae6914e27faea8b0f1c4a83e','DRIVER','2026-09-21 07:54:41','2026-09-20 02:24:41'),(207,3,'7038c856796b5759d49c4c5bf35b6097803789a6eb2c5f2b1d8ea0f1a62a9287','RETAILER','2026-09-21 07:58:11','2026-09-20 02:28:11'),(208,3,'6ed7a3baa7342b7ec1764dadff29a6a55679f52abc0b86a5d655ca95d7a18a5e','RETAILER','2026-09-21 08:53:57','2026-09-20 03:23:57');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credit_account`
--

DROP TABLE IF EXISTS `credit_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_account` (
  `credit_id` int NOT NULL AUTO_INCREMENT,
  `retailer_id` int NOT NULL,
  `distributor_id` int NOT NULL,
  `credit_limit` decimal(12,2) NOT NULL,
  `current_balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `available_credit` decimal(12,2) NOT NULL,
  `status` enum('Active','Blocked') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`credit_id`),
  UNIQUE KEY `uq_credit_retailer_dist` (`retailer_id`,`distributor_id`),
  KEY `idx_credit_status` (`status`),
  KEY `fk_credit_distributor` (`distributor_id`),
  CONSTRAINT `fk_credit_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_credit_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailer` (`retailer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_account`
--

LOCK TABLES `credit_account` WRITE;
/*!40000 ALTER TABLE `credit_account` DISABLE KEYS */;
INSERT INTO `credit_account` VALUES (1,1,1,50000.00,0.00,50000.00,'Active','2026-07-13 09:49:19','2026-08-31 09:04:20'),(2,1,3,20000.00,0.00,20000.00,'Active','2026-07-29 08:19:50','2026-08-16 08:17:25'),(3,3,1,30000.00,0.00,30000.00,'Active','2026-08-14 08:17:40','2026-08-24 18:25:16'),(4,3,3,40000.00,0.00,40000.00,'Active','2026-08-14 08:18:14','2026-08-14 08:18:14'),(5,2,1,10000.00,0.00,10000.00,'Active','2026-08-24 17:17:17','2026-08-24 17:17:17'),(6,4,3,0.00,0.00,0.00,'Active','2026-08-27 19:46:09','2026-08-27 19:46:26'),(7,2,3,10000.00,0.00,10000.00,'Active','2026-08-27 19:47:04','2026-08-27 19:47:04');
/*!40000 ALTER TABLE `credit_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credit_transaction`
--

DROP TABLE IF EXISTS `credit_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_transaction` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `credit_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  `transaction_type` enum('Debit','Credit','Adjustment') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `balance_after` decimal(12,2) DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `idx_credittxn_credit` (`credit_id`),
  KEY `idx_credittxn_order` (`order_id`),
  KEY `idx_credittxn_payment` (`payment_id`),
  KEY `idx_credittxn_type` (`transaction_type`),
  KEY `fk_credittxn_created_by` (`created_by`),
  CONSTRAINT `fk_credittxn_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_credittxn_credit` FOREIGN KEY (`credit_id`) REFERENCES `credit_account` (`credit_id`),
  CONSTRAINT `fk_credittxn_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_credittxn_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_transaction`
--

LOCK TABLES `credit_transaction` WRITE;
/*!40000 ALTER TABLE `credit_transaction` DISABLE KEYS */;
INSERT INTO `credit_transaction` VALUES (1,1,1,NULL,'Debit',1000.00,1000.00,'Order #1 delivered — credit portion',NULL,'2026-07-13 15:03:53','2026-07-13 15:03:53'),(3,1,6,NULL,'Credit',2500.00,0.00,'Outstanding credit settlement via Order #6 delivery',NULL,'2026-07-13 15:41:50','2026-07-13 15:41:50'),(4,1,8,NULL,'Debit',600.00,600.00,'Order #8 delivered — credit portion',NULL,'2026-07-13 16:11:06','2026-07-13 16:11:06'),(6,1,10,NULL,'Debit',1000.00,1000.00,'Order #10 delivered — credit portion',NULL,'2026-07-13 16:16:00','2026-07-13 16:16:00'),(8,1,11,NULL,'Debit',1200.00,3800.00,'Order #11 delivered — credit portion',NULL,'2026-07-13 16:42:21','2026-07-13 16:42:21'),(9,1,11,NULL,'Credit',2600.00,1200.00,'Outstanding credit settlement via Order #11 delivery',NULL,'2026-07-13 16:42:21','2026-07-13 16:42:21'),(10,1,12,NULL,'Credit',1200.00,0.00,'Outstanding credit settlement via Order #12 delivery',NULL,'2026-07-13 16:50:26','2026-07-13 16:50:26'),(11,1,14,NULL,'Debit',1000.00,1000.00,'Order #14 delivered — credit portion',NULL,'2026-07-13 17:46:57','2026-07-13 17:46:57'),(12,1,15,NULL,'Credit',1000.00,0.00,'Outstanding credit settlement via Order #15 delivery',NULL,'2026-07-13 17:54:20','2026-07-13 17:54:20'),(13,1,25,NULL,'Debit',1368.00,1368.00,'Order #25 delivered — credit portion',NULL,'2026-07-29 08:34:55','2026-07-29 08:34:55'),(14,1,26,NULL,'Credit',1368.00,0.00,'Outstanding credit settlement via Order #26 delivery',NULL,'2026-08-01 10:31:39','2026-08-01 10:31:39'),(15,1,26,NULL,'Credit',1368.00,-1368.00,'Outstanding credit settlement via Order #26 delivery',NULL,'2026-08-01 10:31:41','2026-08-01 10:31:41'),(16,1,76,NULL,'Debit',4284.00,4284.00,'Order #76 delivered — credit portion',NULL,'2026-08-16 18:08:36','2026-08-16 18:08:36'),(17,1,80,NULL,'Debit',500.00,4784.00,'Order #80 delivered — credit portion',NULL,'2026-08-16 18:58:33','2026-08-16 18:58:33'),(18,1,80,NULL,'Credit',4284.00,500.00,'Outstanding credit settlement via Order #80 delivery',NULL,'2026-08-16 18:58:34','2026-08-16 18:58:34'),(19,3,81,NULL,'Debit',1000.00,1000.00,'Order #81 delivered — credit portion',NULL,'2026-08-24 09:30:36','2026-08-24 09:30:36'),(20,3,NULL,23,'Credit',1000.00,0.00,'Full Online Debit Settlement (Ref: TEST_GATEWAY_REF_123)',8,'2026-08-24 18:25:16','2026-08-24 18:25:16'),(21,1,85,NULL,'Debit',684.00,684.00,'Order #85 delivered — credit portion',NULL,'2026-08-24 18:35:42','2026-08-24 18:35:42'),(22,1,NULL,24,'Credit',684.00,0.00,'Full Online Debit Settlement (Ref: PAY_REF_953169)',3,'2026-08-24 18:37:19','2026-08-24 18:37:19'),(23,1,86,NULL,'Debit',4680.00,4680.00,'Order #86 delivered — credit portion',NULL,'2026-08-24 19:26:47','2026-08-24 19:26:47'),(24,1,88,NULL,'Credit',4680.00,0.00,'Outstanding credit settlement via Order #88 delivery',NULL,'2026-08-31 09:04:20','2026-08-31 09:04:20');
/*!40000 ALTER TABLE `credit_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery` (
  `delivery_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `driver_id` int DEFAULT NULL,
  `claimed_at` datetime DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `status` enum('OPEN','CLAIMED','DELIVERED','RETURNED') COLLATE utf8mb4_unicode_ci DEFAULT 'OPEN',
  `total_amount` decimal(12,2) DEFAULT NULL,
  `collected_amount` decimal(12,2) DEFAULT NULL,
  `remarks` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`delivery_id`),
  KEY `idx_delivery_order` (`order_id`),
  KEY `idx_delivery_driver` (`driver_id`),
  KEY `idx_delivery_status` (`status`),
  CONSTRAINT `fk_delivery_driver` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`),
  CONSTRAINT `fk_delivery_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
INSERT INTO `delivery` VALUES (1,1,1,'2026-07-13 20:30:44','2026-07-13 20:33:53','DELIVERED',1000.00,0.00,'Delivered successfully','2026-07-13 15:00:34','2026-07-13 16:32:09'),(2,6,1,'2026-07-13 21:11:32','2026-07-13 21:11:50','DELIVERED',600.00,3100.00,'Delivered successfully','2026-07-13 15:41:22','2026-07-13 15:41:50'),(3,7,1,'2026-07-13 21:16:57','2026-07-13 21:17:09','DELIVERED',1000.00,1000.00,'Delivered successfully','2026-07-13 15:46:38','2026-07-13 15:47:09'),(4,8,1,'2026-07-13 21:40:56','2026-07-13 21:41:06','DELIVERED',600.00,0.00,'Delivered successfully','2026-07-13 16:10:43','2026-07-13 16:32:09'),(5,10,1,'2026-07-13 21:45:45','2026-07-13 21:46:00','DELIVERED',1000.00,0.00,'Delivered successfully','2026-07-13 16:15:37','2026-07-13 16:32:09'),(6,11,1,'2026-07-13 22:12:15','2026-07-13 22:12:21','DELIVERED',1200.00,2600.00,'Delivered successfully','2026-07-13 16:42:01','2026-07-13 16:42:21'),(7,12,1,'2026-07-13 22:19:38','2026-07-13 22:20:26','DELIVERED',950.00,2150.00,'Delivered successfully','2026-07-13 16:49:32','2026-07-13 16:50:26'),(8,13,1,'2026-07-13 22:33:27','2026-07-13 23:16:54','DELIVERED',400.00,400.00,'Delivered successfully','2026-07-13 17:03:10','2026-07-13 17:46:54'),(9,14,1,'2026-07-13 23:16:42','2026-07-13 23:16:57','DELIVERED',1000.00,0.00,'Delivered successfully','2026-07-13 17:45:39','2026-07-13 17:46:57'),(10,15,1,'2026-07-13 23:24:01','2026-07-13 23:24:20','DELIVERED',800.00,1800.00,'Delivered successfully','2026-07-13 17:52:27','2026-07-13 17:54:20'),(11,16,1,'2026-07-14 01:06:33','2026-07-14 10:48:44','DELIVERED',1540.00,1540.00,'Delivered successfully','2026-07-13 19:36:16','2026-07-14 05:18:44'),(12,17,1,'2026-07-14 10:48:29','2026-07-14 10:48:40','DELIVERED',2000.00,2000.00,'Delivered successfully','2026-07-13 19:38:09','2026-07-14 05:18:40'),(13,18,1,'2026-07-17 14:52:53','2026-07-17 14:52:57','DELIVERED',480.00,480.00,'Delivered successfully','2026-07-14 05:16:49','2026-07-17 09:22:57'),(14,20,1,'2026-07-17 15:09:27','2026-07-17 15:09:32','DELIVERED',1900.00,1900.00,'Delivered successfully','2026-07-17 09:39:19','2026-07-17 09:39:32'),(15,21,1,'2026-07-26 12:15:50','2026-07-29 14:04:35','DELIVERED',3647.77,3647.77,'Delivered successfully','2026-07-25 16:32:38','2026-07-29 08:34:35'),(16,22,1,'2026-07-29 14:04:29','2026-07-29 14:04:37','DELIVERED',1672.00,1672.00,'Delivered successfully','2026-07-26 06:44:52','2026-07-29 08:34:37'),(17,23,NULL,NULL,NULL,'OPEN',1215.92,NULL,NULL,'2026-07-29 08:25:42','2026-07-29 08:25:42'),(18,24,NULL,NULL,NULL,'OPEN',2431.85,NULL,NULL,'2026-07-29 08:32:59','2026-07-29 08:32:59'),(19,25,1,'2026-07-29 14:04:47','2026-07-29 14:04:55','DELIVERED',1368.00,0.00,'Delivered successfully','2026-07-29 08:33:59','2026-07-29 08:34:55'),(20,26,1,'2026-08-01 10:24:15','2026-08-01 10:31:41','DELIVERED',1672.00,3040.00,'Delivered successfully','2026-08-01 10:23:57','2026-08-01 10:31:41'),(21,27,1,'2026-08-01 12:37:44','2026-08-08 06:27:43','DELIVERED',2812.00,1444.00,'Delivered successfully','2026-08-01 12:36:25','2026-08-08 06:27:43'),(22,28,1,'2026-08-08 06:27:29','2026-08-08 06:27:48','DELIVERED',4635.69,3267.69,'Delivered successfully','2026-08-01 12:40:04','2026-08-08 06:27:48'),(23,35,1,'2026-08-08 06:26:18','2026-08-08 06:27:53','DELIVERED',110.00,-1368.00,'Delivered successfully','2026-08-08 06:21:51','2026-08-08 06:27:53'),(24,38,1,'2026-08-08 06:34:05','2026-08-08 06:37:28','DELIVERED',1824.00,-1368.00,'Delivered successfully','2026-08-08 06:33:52','2026-08-08 06:37:28'),(25,76,1,'2026-08-16 21:25:49','2026-08-16 23:38:36','DELIVERED',4284.00,0.00,'Delivered successfully','2026-08-16 15:14:18','2026-08-16 18:08:36'),(26,77,1,'2026-08-16 21:25:47','2026-08-16 21:26:38','DELIVERED',988.00,988.00,'Delivered successfully','2026-08-16 15:20:20','2026-08-16 15:56:38'),(27,78,1,'2026-08-16 21:25:45','2026-08-16 23:38:30','RETURNED',14212.00,NULL,'Returned by customer','2026-08-16 15:27:44','2026-08-16 18:08:30'),(28,79,1,'2026-08-16 22:06:21','2026-08-16 22:07:01','DELIVERED',20736.00,20736.00,'Delivered successfully','2026-08-16 16:18:26','2026-08-16 16:37:01'),(29,64,NULL,NULL,NULL,'OPEN',1215.92,NULL,NULL,'2026-08-16 18:06:00','2026-08-16 18:06:00'),(30,66,NULL,NULL,NULL,'OPEN',5759.64,NULL,NULL,'2026-08-16 18:06:11','2026-08-16 18:06:11'),(31,67,NULL,NULL,NULL,'OPEN',5759.64,NULL,NULL,'2026-08-16 18:06:24','2026-08-16 18:06:24'),(32,69,1,'2026-08-16 23:46:22','2026-08-16 23:46:28','DELIVERED',987.77,0.00,'Delivered successfully','2026-08-16 18:15:39','2026-08-16 18:16:28'),(33,61,1,'2026-08-16 23:53:22','2026-08-16 23:53:49','DELIVERED',3799.92,0.00,'Delivered successfully','2026-08-16 18:18:03','2026-08-16 18:23:49'),(34,58,1,'2026-08-16 23:53:22','2026-08-16 23:54:11','DELIVERED',1976.00,0.00,'Delivered successfully','2026-08-16 18:20:36','2026-08-16 18:24:11'),(35,59,1,'2026-08-16 23:53:22','2026-08-16 23:54:11','DELIVERED',988.00,0.00,'Delivered successfully','2026-08-16 18:20:36','2026-08-16 18:24:11'),(36,60,1,'2026-08-16 23:53:21','2026-08-16 23:54:12','DELIVERED',1367.92,0.00,'Delivered successfully','2026-08-16 18:20:37','2026-08-16 18:24:12'),(37,39,1,'2026-08-16 23:53:18','2026-08-16 23:54:16','DELIVERED',1216.00,1216.00,'Delivered successfully','2026-08-16 18:22:17','2026-08-16 18:24:16'),(38,42,1,'2026-08-16 23:53:18','2026-08-16 23:54:16','DELIVERED',684.00,0.00,'Delivered successfully','2026-08-16 18:22:17','2026-08-16 18:24:16'),(39,48,1,'2026-08-16 23:53:19','2026-08-16 23:54:17','DELIVERED',1216.00,1216.00,'Delivered successfully','2026-08-16 18:23:11','2026-08-16 18:24:17'),(40,80,1,'2026-08-17 00:25:37','2026-08-17 00:28:35','DELIVERED',1184.00,4968.00,'Delivered successfully','2026-08-16 18:54:55','2026-08-16 18:58:35'),(41,81,1,'2026-08-24 14:59:51','2026-08-24 15:00:36','DELIVERED',1184.00,184.00,'Delivered successfully','2026-08-24 09:17:04','2026-08-24 09:30:36'),(42,85,1,'2026-08-25 00:05:31','2026-08-25 00:05:42','DELIVERED',684.00,0.00,'Delivered successfully','2026-08-24 18:35:16','2026-08-24 18:35:42'),(43,86,1,'2026-08-25 00:56:39','2026-08-25 00:56:47','DELIVERED',4680.00,0.00,'Delivered successfully','2026-08-24 19:24:15','2026-08-24 19:26:47'),(44,87,NULL,NULL,NULL,'OPEN',1215.92,NULL,NULL,'2026-08-24 19:27:40','2026-08-24 19:27:40'),(45,88,1,'2026-08-31 13:47:54','2026-08-31 14:34:20','DELIVERED',684.00,5364.00,'Delivered successfully','2026-08-31 08:16:21','2026-08-31 09:04:20'),(46,89,1,'2026-08-31 14:44:03','2026-08-31 14:44:11','RETURNED',684.00,NULL,'Returned by customer','2026-08-31 09:13:53','2026-08-31 09:14:11');
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distributor`
--

DROP TABLE IF EXISTS `distributor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributor` (
  `distributor_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reg_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lic_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doc_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected','Blocked') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `region_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`distributor_id`),
  UNIQUE KEY `uq_distributor_user` (`user_id`),
  UNIQUE KEY `uq_distributor_reg` (`reg_number`),
  UNIQUE KEY `uq_distributor_lic` (`lic_number`),
  KEY `idx_distributor_status` (`status`),
  KEY `idx_distributor_region` (`region_id`),
  CONSTRAINT `fk_distributor_region` FOREIGN KEY (`region_id`) REFERENCES `distributor_region` (`region_id`),
  CONSTRAINT `fk_distributor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributor`
--

LOCK TABLES `distributor` WRITE;
/*!40000 ALTER TABLE `distributor` DISABLE KEYS */;
INSERT INTO `distributor` VALUES (1,2,'Golden Distribution Ltd','123 Commerce St','REG001','LIC001',NULL,'Approved',1,'2026-07-13 09:49:19','2026-07-13 13:39:18'),(2,6,'Mega Distributors','56/2,king Avenue,Kalutara','PV/123456','LIC-5678',NULL,'Approved',3,'2026-07-13 19:32:25','2026-08-14 08:28:43'),(3,7,'Next gen Supplies (PVT)LTD','123, MainStreet,Colombo 7','PV/28508','LIC-508',NULL,'Approved',1,'2026-07-29 08:17:56','2026-07-29 08:19:17');
/*!40000 ALTER TABLE `distributor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distributor_batch`
--

DROP TABLE IF EXISTS `distributor_batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributor_batch` (
  `dist_batch_id` int NOT NULL AUTO_INCREMENT,
  `distributor_id` int NOT NULL,
  `product_id` int NOT NULL,
  `source_batch_id` int DEFAULT NULL,
  `transfer_id` int DEFAULT NULL,
  `batch_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `received_qty` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `cost_price` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `mfg_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('Active','Exhausted','Expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `received_at` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`dist_batch_id`),
  UNIQUE KEY `uq_dist_batch_number` (`batch_number`),
  KEY `idx_distbatch_distributor` (`distributor_id`),
  KEY `idx_distbatch_product` (`product_id`),
  KEY `idx_distbatch_source` (`source_batch_id`),
  KEY `idx_distbatch_transfer` (`transfer_id`),
  KEY `idx_distbatch_status` (`status`),
  KEY `idx_distbatch_expiry` (`expiry_date`),
  CONSTRAINT `fk_distbatch_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_distbatch_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `fk_distbatch_source_batch` FOREIGN KEY (`source_batch_id`) REFERENCES `warehouse_batch` (`batch_id`),
  CONSTRAINT `fk_distbatch_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `stock_transfer` (`transfer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributor_batch`
--

LOCK TABLES `distributor_batch` WRITE;
/*!40000 ALTER TABLE `distributor_batch` DISABLE KEYS */;
INSERT INTO `distributor_batch` VALUES (1,1,1,1,NULL,'DB-LEGACY-1-001',150,30,90.00,110.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-08-16 15:27:44'),(2,1,2,2,NULL,'DB-LEGACY-1-002',200,200,35.00,45.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(3,1,3,3,NULL,'DB-LEGACY-1-003',100,100,70.00,85.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(4,1,4,4,NULL,'DB-LEGACY-1-004',120,120,60.00,75.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(5,1,5,5,NULL,'DB-LEGACY-1-005',80,80,110.00,130.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(6,1,6,6,NULL,'DB-LEGACY-1-006',50,50,400.00,480.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(7,1,7,7,NULL,'DB-LEGACY-1-007',272,240,45.00,55.00,NULL,NULL,'Active','2026-07-14','2026-07-19 14:12:36','2026-07-29 08:34:37'),(8,1,8,8,NULL,'DB-LEGACY-1-008',0,0,80.00,600.00,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(9,1,9,9,NULL,'DB-LEGACY-1-009',0,0,95.00,320.00,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(10,1,10,10,NULL,'DB-LEGACY-1-010',240,240,85.00,130.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(11,1,11,11,NULL,'DB-LEGACY-1-011',350,318,120.00,240.00,NULL,NULL,'Active','2026-07-17','2026-07-19 14:12:36','2026-08-08 06:37:28'),(12,1,12,12,NULL,'DB-LEGACY-1-012',0,0,75.00,129.97,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(13,1,13,13,NULL,'DB-LEGACY-1-013',150,150,45.00,499.99,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(14,1,14,14,NULL,'DB-LEGACY-1-014',295,295,60.00,230.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(15,1,15,15,NULL,'DB-LEGACY-1-015',0,0,130.00,420.00,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(16,1,16,16,NULL,'DB-LEGACY-1-016',0,0,90.00,160.00,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(17,1,17,17,NULL,'DB-LEGACY-1-017',50,34,110.00,300.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-08-08 06:27:47'),(18,1,18,18,NULL,'DB-LEGACY-1-018',111,111,50.00,130.00,NULL,NULL,'Active','2026-07-17','2026-07-19 14:12:36','2026-07-25 16:31:16'),(19,1,19,19,NULL,'DB-LEGACY-1-019',0,0,60.00,119.96,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(20,1,20,20,NULL,'DB-LEGACY-1-020',30,30,70.00,160.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(21,1,21,21,NULL,'DB-LEGACY-1-021',80,48,65.00,179.99,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-08-16 18:24:12'),(22,1,22,22,NULL,'DB-LEGACY-1-022',0,0,85.00,179.99,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(23,1,23,23,NULL,'DB-LEGACY-1-023',120,120,150.00,570.00,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(24,1,24,24,NULL,'DB-LEGACY-1-024',200,200,110.00,139.98,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(25,1,25,25,NULL,'DB-LEGACY-1-025',0,0,95.00,149.99,NULL,NULL,'Exhausted','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(26,1,26,26,NULL,'DB-LEGACY-1-026',180,180,95.00,219.99,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(27,1,27,27,NULL,'DB-LEGACY-1-027',110,110,45.00,259.79,NULL,NULL,'Active','2026-07-13','2026-07-19 14:12:36','2026-07-19 14:12:36'),(28,1,1,1,1,'DB-202607-001',50,0,100.00,140.00,NULL,'2027-06-30','Exhausted','2026-07-22','2026-07-22 11:19:06','2026-08-16 15:27:44'),(29,1,25,25,2,'DB-202607-002',100,100,120.00,149.99,NULL,'2027-05-14','Active','2026-07-22','2026-07-22 11:19:13','2026-07-22 11:19:13'),(30,1,6,6,2,'DB-202607-003',100,4,450.00,600.00,NULL,'2027-10-10','Active','2026-07-22','2026-07-22 11:19:13','2026-08-16 16:37:00'),(31,1,16,16,3,'DB-202607-004',300,268,120.00,160.00,NULL,'2027-03-30','Active','2026-07-22','2026-07-22 11:19:20','2026-08-16 18:24:17'),(32,1,18,18,4,'DB-202607-005',100,0,120.00,130.00,NULL,'2028-01-14','Exhausted','2026-07-22','2026-07-22 11:34:19','2026-08-16 18:20:35'),(33,1,18,18,5,'DB-202607-006',90,0,120.00,130.00,NULL,'2028-01-14','Exhausted','2026-07-22','2026-07-22 11:50:18','2026-08-24 19:26:46'),(34,1,18,18,6,'DB-202607-007',30,28,120.00,130.00,NULL,'2028-01-14','Active','2026-07-22','2026-07-22 17:45:57','2026-08-24 19:26:46'),(35,1,18,18,7,'DB-202607-008',200,200,120.00,130.00,NULL,'2028-01-14','Active','2026-07-22','2026-07-22 17:50:19','2026-07-25 16:31:16'),(36,1,16,30,7,'DB-202607-009',100,100,85.00,100.00,'2026-07-21','2026-07-23','Expired','2026-07-22','2026-07-22 17:50:19','2026-07-25 16:29:10'),(37,1,13,13,8,'DB-202607-010',200,184,400.00,499.99,NULL,'2027-03-15','Active','2026-07-22','2026-07-22 18:05:48','2026-08-16 18:23:49'),(38,1,10,31,8,'DB-202607-011',500,252,70.00,90.00,'2026-07-20','2026-09-03','Expired','2026-07-22','2026-07-22 18:05:48','2026-09-19 10:46:16'),(39,1,12,12,9,'DB-202607-012',100,68,100.00,129.97,NULL,'2027-03-13','Active','2026-07-22','2026-07-22 18:15:42','2026-08-16 18:16:28'),(40,3,18,18,10,'DB-202607-013',150,0,120.00,159.99,NULL,'2028-01-14','Exhausted','2026-07-29','2026-07-29 08:23:23','2026-08-16 18:06:34'),(41,1,10,10,13,'DB-202608-001',10,10,100.00,130.00,NULL,'2027-02-28','Active','2026-08-24','2026-08-24 08:14:40','2026-08-24 08:30:21'),(42,1,10,10,14,'DB-202608-002',10,10,100.00,130.00,NULL,'2027-02-28','Active','2026-08-24','2026-08-24 09:11:42','2026-08-24 09:12:29'),(43,3,18,18,15,'DB-202608-003',100,92,120.00,159.99,NULL,'2028-01-14','Active','2026-08-25','2026-08-24 19:20:29','2026-08-24 19:27:39');
/*!40000 ALTER TABLE `distributor_batch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distributor_region`
--

DROP TABLE IF EXISTS `distributor_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributor_region` (
  `region_id` int NOT NULL AUTO_INCREMENT,
  `region_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`region_id`),
  UNIQUE KEY `uq_region_name` (`region_name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributor_region`
--

LOCK TABLES `distributor_region` WRITE;
/*!40000 ALTER TABLE `distributor_region` DISABLE KEYS */;
INSERT INTO `distributor_region` VALUES (1,'Colombo','Colombo District','2026-07-13 09:49:18'),(2,'Gampaha','Gampaha District','2026-07-13 09:49:18'),(3,'Kalutara','Kalutara District','2026-07-13 09:49:18'),(4,'Kandy','Kandy District','2026-07-13 09:49:18'),(5,'Matale','Matale District','2026-07-13 09:49:18'),(6,'Nuwara Eliya','Nuwara Eliya District','2026-07-13 09:49:18'),(7,'Galle','Galle District','2026-07-13 09:49:18'),(8,'Matara','Matara District','2026-07-13 09:49:18'),(9,'Hambantota','Hambantota District','2026-07-13 09:49:18'),(10,'Jaffna','Jaffna District','2026-07-13 09:49:18'),(11,'Kilinochchi','Kilinochchi District','2026-07-13 09:49:18'),(12,'Mannar','Mannar District','2026-07-13 09:49:18'),(13,'Vavuniya','Vavuniya District','2026-07-13 09:49:18'),(14,'Mullaitivu','Mullaitivu District','2026-07-13 09:49:18'),(15,'Batticaloa','Batticaloa District','2026-07-13 09:49:18'),(16,'Ampara','Ampara District','2026-07-13 09:49:18'),(17,'Trincomalee','Trincomalee District','2026-07-13 09:49:18'),(18,'Kurunegala','Kurunegala District','2026-07-13 09:49:18'),(19,'Puttalam','Puttalam District','2026-07-13 09:49:18'),(20,'Anuradhapura','Anuradhapura District','2026-07-13 09:49:18'),(21,'Polonnaruwa','Polonnaruwa District','2026-07-13 09:49:18'),(22,'Badulla','Badulla District','2026-07-13 09:49:18'),(23,'Moneragala','Moneragala District','2026-07-13 09:49:18'),(24,'Ratnapura','Ratnapura District','2026-07-13 09:49:18'),(25,'Kegalle','Kegalle District','2026-07-13 09:49:18');
/*!40000 ALTER TABLE `distributor_region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver`
--

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver` (
  `driver_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `distributor_id` int NOT NULL,
  `license_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicle_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Pending','Approved','Blocked') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`driver_id`),
  UNIQUE KEY `uq_driver_user` (`user_id`),
  UNIQUE KEY `uq_driver_license` (`license_number`),
  UNIQUE KEY `uq_driver_vehicle` (`vehicle_number`),
  KEY `idx_driver_status` (`status`),
  KEY `idx_driver_distributor` (`distributor_id`),
  CONSTRAINT `fk_driver_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_driver_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver`
--

LOCK TABLES `driver` WRITE;
/*!40000 ALTER TABLE `driver` DISABLE KEYS */;
INSERT INTO `driver` VALUES (1,4,1,'DL123456','ABC-1234','Approved','2026-07-13 09:49:19','2026-07-13 09:49:19');
/*!40000 ALTER TABLE `driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verifications`
--

DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` int NOT NULL DEFAULT '0',
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_verify_email` (`email`),
  KEY `idx_verify_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verifications`
--

LOCK TABLES `email_verifications` WRITE;
/*!40000 ALTER TABLE `email_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gateway_payments`
--

DROP TABLE IF EXISTS `gateway_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gateway_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `credit_id` int DEFAULT NULL,
  `retailer_id` int NOT NULL,
  `distributor_id` int NOT NULL,
  `payment_type` enum('ORDER','CREDIT_SETTLEMENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ORDER',
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'LKR',
  `gateway_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'MockGateway',
  `transaction_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway_ref` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('INITIATED','PENDING','SUCCESS','FAILED','CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'INITIATED',
  `signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response_payload` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gw_order` (`order_id`),
  KEY `idx_gw_credit` (`credit_id`),
  CONSTRAINT `fk_gw_credit` FOREIGN KEY (`credit_id`) REFERENCES `credit_account` (`credit_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gw_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gateway_payments`
--

LOCK TABLES `gateway_payments` WRITE;
/*!40000 ALTER TABLE `gateway_payments` DISABLE KEYS */;
INSERT INTO `gateway_payments` VALUES (1,30,NULL,1,1,'ORDER',220.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_30_1786169074_df2a5fbd','TEST_REF_123','SUCCESS','fb242f2985e4726c4be110f1d553e6603af3cac02d79a4a779e2eec20dea9a16','[]','2026-08-08 06:04:36','2026-08-08 06:04:36'),(2,34,NULL,1,1,'ORDER',1368.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_34_1786169403_a932357f','PAY_REF_359818','SUCCESS','4f3049a09a125eb6498585b677d3281932fd47db4f91181811db0102568f544f','{\"transaction_token\":\"GW_TXN_34_1786169403_a932357f\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_359818\",\"signature\":\"4f3049a09a125eb6498585b677d3281932fd47db4f91181811db0102568f544f\"}','2026-08-08 06:10:04','2026-08-08 06:13:22'),(3,35,NULL,1,1,'ORDER',110.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_35_1786169487_a1ea1f2a',NULL,'INITIATED','cc99e70085b58fabf71eef4b76d2b0b9c8147423a990a03a5f6916f116e64d8f',NULL,'2026-08-08 06:11:29','2026-08-08 06:11:29'),(4,36,NULL,1,1,'ORDER',110.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_36_1786169574_f632b907','PAY_REF_TEST','SUCCESS','bbda2e224b9eb532108a393442cabdb00b96ff52830d80063d82a31da1bdd5f9','[]','2026-08-08 06:12:55','2026-08-08 06:12:55'),(5,37,NULL,1,1,'ORDER',110.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_37_1786169903_ec428447','PAY_REF_TEST','SUCCESS','e270759b84b3fe73c0ee6456175d1de58604fbdf212975be294328b2ff7702a0','[]','2026-08-08 06:18:24','2026-08-08 06:18:25'),(6,38,NULL,1,1,'ORDER',1824.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_38_1786170770_4fbea44c','PAY_REF_681085','SUCCESS','7c7e89ef47d64ca8563748bfa46232098dd3b578a7c17ebf206542d3a8da84f9','{\"transaction_token\":\"GW_TXN_38_1786170770_4fbea44c\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_681085\",\"signature\":\"7c7e89ef47d64ca8563748bfa46232098dd3b578a7c17ebf206542d3a8da84f9\"}','2026-08-08 06:32:51','2026-08-08 06:32:59'),(7,42,NULL,1,1,'ORDER',684.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_42_1786173959_5f544247','PAY_REF_456694','SUCCESS','3a4aea3460d6526e5f9fbaf80a86ed6e6e14a079c2c3fae49309149d4a390983','{\"transaction_token\":\"GW_TXN_42_1786173959_5f544247\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_456694\",\"signature\":\"3a4aea3460d6526e5f9fbaf80a86ed6e6e14a079c2c3fae49309149d4a390983\"}','2026-08-08 07:26:00','2026-08-08 07:26:04'),(8,43,NULL,1,1,'ORDER',3648.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_43_1786174282_9fcf22e4','PAY_REF_882734','SUCCESS','51865c566eb846319cba649e1c6a3e25b7e0b3c2a72389f8e55b67bc141cdf23','{\"transaction_token\":\"GW_TXN_43_1786174282_9fcf22e4\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_882734\",\"signature\":\"51865c566eb846319cba649e1c6a3e25b7e0b3c2a72389f8e55b67bc141cdf23\"}','2026-08-08 07:31:24','2026-08-08 07:31:41'),(9,44,NULL,1,1,'ORDER',684.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_44_1786301651_2623d5cc','PAY_REF_922334','SUCCESS','e9b67f5a8afd2b83b58b6c6a0d1b5f4d2a8e41e6a00b28b05234752644747b8f','{\"transaction_token\":\"GW_TXN_44_1786301651_2623d5cc\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_922334\",\"signature\":\"e9b67f5a8afd2b83b58b6c6a0d1b5f4d2a8e41e6a00b28b05234752644747b8f\"}','2026-08-09 18:54:11','2026-08-09 18:54:23'),(10,45,NULL,1,1,'ORDER',7072.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_45_1786471375_6e6c38fe','PAY_REF_364916','SUCCESS','75dfb496484815c37dcc74caa4d142c2f85512d2bd20e80c4aae88d491c70bef','{\"transaction_token\":\"GW_TXN_45_1786471375_6e6c38fe\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_364916\",\"signature\":\"75dfb496484815c37dcc74caa4d142c2f85512d2bd20e80c4aae88d491c70bef\"}','2026-08-11 18:02:56','2026-08-11 18:03:05'),(11,50,NULL,1,1,'ORDER',988.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_50_1786639312_21b5d85d',NULL,'INITIATED','2d84cb2b3e8a4062a8380b21a595a7c83575ed94e5e9b58b7070312b7b25b52c',NULL,'2026-08-13 16:41:51','2026-08-13 16:41:51'),(12,51,NULL,1,3,'ORDER',1215.92,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_51_1786639379_01c94d4a',NULL,'INITIATED','9424ed2497d5348ff836fadeb96347f1d7821ebff5875ffbc4bc9bedf8ca02b2',NULL,'2026-08-13 16:42:58','2026-08-13 16:42:58'),(17,57,NULL,1,1,'ORDER',3799.92,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_57_1786641013_08def109','PAY_REF_498873','SUCCESS','c997ecb5428ea699d4168d4a2a8a5e05c2f07357fae8a55a082c60c2779cdc85','{\"transaction_token\":\"GW_TXN_57_1786641013_08def109\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_498873\",\"signature\":\"c997ecb5428ea699d4168d4a2a8a5e05c2f07357fae8a55a082c60c2779cdc85\"}','2026-08-13 17:10:11','2026-08-13 17:10:19'),(18,58,NULL,1,1,'ORDER',1976.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_58_1786641106_8da30243','PAY_REF_863177','SUCCESS','57934386a5583c80793da3ff47f6c78c719ac4e1c6548da2fe0403e76d1761b8','{\"transaction_token\":\"GW_TXN_58_1786641106_8da30243\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_863177\",\"signature\":\"57934386a5583c80793da3ff47f6c78c719ac4e1c6548da2fe0403e76d1761b8\"}','2026-08-13 17:11:44','2026-08-13 17:11:54'),(19,59,NULL,1,1,'ORDER',988.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_59_1786643187_5bd957d6','PAY_REF_190127','SUCCESS','caed5dace766fb2bd3cae6047bf392abe8452b13e16d92834d22bfafb33ff36c','{\"transaction_token\":\"GW_TXN_59_1786643187_5bd957d6\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_190127\",\"signature\":\"caed5dace766fb2bd3cae6047bf392abe8452b13e16d92834d22bfafb33ff36c\"}','2026-08-13 17:46:27','2026-08-13 17:46:31'),(20,60,NULL,1,1,'ORDER',1367.92,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_60_1786643617_eb8c5942','PAY_REF_214881','SUCCESS','d27f9b6b7e3e341aa00820707285e6ead6c8e330d8d4cb15cfa3ef65ceaba504','{\"transaction_token\":\"GW_TXN_60_1786643617_eb8c5942\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_214881\",\"signature\":\"d27f9b6b7e3e341aa00820707285e6ead6c8e330d8d4cb15cfa3ef65ceaba504\"}','2026-08-13 17:53:37','2026-08-13 17:53:43'),(21,61,NULL,1,1,'ORDER',3799.92,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_61_1786643699_c4055ea5',NULL,'INITIATED','3cd369cd493632cac704792a70e95c9ef4aac90e9ab168020f6086d1ea029f65',NULL,'2026-08-13 17:54:59','2026-08-13 17:54:59'),(22,62,NULL,1,1,'ORDER',3799.92,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_62_1786643721_02b688be',NULL,'INITIATED','6b3b194ce57bb95b57886ec0cbfb6adcd8519dfd8919da2385cc8c38286437db',NULL,'2026-08-13 17:55:21','2026-08-13 17:55:21'),(23,64,NULL,1,3,'ORDER',1215.92,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_64_1786643855_d5464e1e','PAY_REF_487535','SUCCESS','fb76604139eaf2f034e7fbb25e71c81c9e536d1c10404c56327fe815e2408c03','{\"transaction_token\":\"GW_TXN_64_1786643855_d5464e1e\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_487535\",\"signature\":\"fb76604139eaf2f034e7fbb25e71c81c9e536d1c10404c56327fe815e2408c03\"}','2026-08-13 17:57:35','2026-08-13 17:57:41'),(24,66,NULL,1,3,'ORDER',5759.64,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_66_1786644094_93d1699a',NULL,'INITIATED','260f892b01e36af563105b622e9053859ab6cbe6c2688b36a55f7981fe1776c8',NULL,'2026-08-13 18:01:34','2026-08-13 18:01:34'),(25,67,NULL,1,3,'ORDER',5759.64,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_67_1786644115_8ae597ea',NULL,'INITIATED','a91299b04c231f0c07ce18190b43ddf71d3cdfd8ce3094bce1ab9d97a5ede3c0',NULL,'2026-08-13 18:01:55','2026-08-13 18:01:55'),(26,68,NULL,1,3,'ORDER',5759.64,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_68_1786644130_834b5c0e','PAY_REF_769266','SUCCESS','9bc1482443bb75ec4c1cf4ee0b41bc8bf16993c403c1798aebd8664c0c8bdad0','{\"transaction_token\":\"GW_TXN_68_1786644130_834b5c0e\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_769266\",\"signature\":\"9bc1482443bb75ec4c1cf4ee0b41bc8bf16993c403c1798aebd8664c0c8bdad0\"}','2026-08-13 18:02:10','2026-08-13 18:02:15'),(27,69,NULL,1,1,'ORDER',987.77,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_69_1786644591_a89849a1','PAY_REF_211680','SUCCESS','92c4d189bdb844dfbbbccb84ece400ce421de6010796f666ae6294d35ae975ad','{\"transaction_token\":\"GW_TXN_69_1786644591_a89849a1\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_211680\",\"signature\":\"92c4d189bdb844dfbbbccb84ece400ce421de6010796f666ae6294d35ae975ad\"}','2026-08-13 18:09:51','2026-08-13 18:09:54'),(31,73,NULL,1,1,'ORDER',17999.64,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_73_1786644901_54fbff99','PAY_REF_784518','SUCCESS','0e182c4afbb768a3a84c1bf99b6abb6615707607e274a261a3880750324eefad','{\"transaction_token\":\"GW_TXN_73_1786644901_54fbff99\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_784518\",\"signature\":\"0e182c4afbb768a3a84c1bf99b6abb6615707607e274a261a3880750324eefad\"}','2026-08-13 18:15:01','2026-08-13 18:15:05'),(32,74,NULL,1,3,'ORDER',2431.85,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_74_1786678500_3486638a','PAY_REF_761185','SUCCESS','8e71f8124e7414640c957dba11c8f39ad398422bea8e74d3c30a55e1874ab226','{\"transaction_token\":\"GW_TXN_74_1786678500_3486638a\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_761185\",\"signature\":\"8e71f8124e7414640c957dba11c8f39ad398422bea8e74d3c30a55e1874ab226\"}','2026-08-14 03:35:02','2026-08-14 03:37:06'),(33,75,NULL,1,1,'ORDER',5616.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_TXN_75_1786696761_d0888ce5','PAY_REF_686581','SUCCESS','dce4d50ec62bfc728afa07eeec9f44e7e9af2a979937eacbbe5f5743b423f411','{\"transaction_token\":\"GW_TXN_75_1786696761_d0888ce5\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_686581\",\"signature\":\"dce4d50ec62bfc728afa07eeec9f44e7e9af2a979937eacbbe5f5743b423f411\"}','2026-08-14 08:39:21','2026-08-14 08:39:26'),(36,NULL,1,1,1,'CREDIT_SETTLEMENT',500.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_CREDIT_1_1787595876_a17b4e31','TEST_GATEWAY_REF_123','SUCCESS','47d40efa3e0f12341daa9be72021e42afda03e5e945420b07aa1e4bbdd6677a5','[]','2026-08-24 18:24:37','2026-08-24 18:24:38'),(37,NULL,3,3,1,'CREDIT_SETTLEMENT',1000.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_CREDIT_3_1787595913_2dfdfbcd','TEST_GATEWAY_REF_123','SUCCESS','0dcc39bc81ab703d16fb4d75b50b041a7d2f5d4698e0fad78068baa7a3da218e','[]','2026-08-24 18:25:13','2026-08-24 18:25:15'),(38,NULL,1,1,1,'CREDIT_SETTLEMENT',684.00,'LKR','Vendora Mock Gateway (Sandbox)','GW_CREDIT_1_1787596629_56019ffc','PAY_REF_953169','SUCCESS','b8f7c8f769dbe109ec208f2755d8c69a4064ea4247405cf3cd94e05bf052a871','{\"transaction_token\":\"GW_CREDIT_1_1787596629_56019ffc\",\"status\":\"SUCCESS\",\"gateway_ref\":\"PAY_REF_953169\",\"signature\":\"b8f7c8f769dbe109ec208f2755d8c69a4064ea4247405cf3cd94e05bf052a871\"}','2026-08-24 18:37:09','2026-08-24 18:37:18');
/*!40000 ALTER TABLE `gateway_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_notif_user` (`user_id`),
  KEY `idx_notif_is_read` (`is_read`),
  KEY `idx_notif_created` (`created_at`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=355 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,2,'Account Status Updated','Your account status changed to: Blocked',1,'2026-07-13 13:39:14','2026-08-31 08:02:45'),(2,2,'Account Status Updated','Your account status changed to: Approved',1,'2026-07-13 13:39:18','2026-08-31 08:02:45'),(3,1,'New Supply Request','Distributor ID 1 submitted supply request #1',1,'2026-07-13 14:11:26','2026-08-25 18:31:39'),(4,1,'New Supply Request','Distributor ID 1 submitted supply request #2',1,'2026-07-13 14:11:46','2026-08-25 18:31:39'),(5,2,'New Order Received','Order #1 placed. Total: LKR 1000',1,'2026-07-13 14:44:13','2026-08-31 08:02:45'),(6,3,'Order Approved','Your order #1 has been approved.',1,'2026-07-13 15:00:34','2026-08-25 18:23:12'),(7,2,'New Order Received','Order #2 placed. Total: LKR 165',1,'2026-07-13 15:03:25','2026-08-31 08:02:45'),(8,3,'Order Delivered','Your order #1 has been delivered.',1,'2026-07-13 15:03:53','2026-08-25 18:23:12'),(9,2,'New Order Received','Order #3 placed. Total: LKR 2500',1,'2026-07-13 15:11:22','2026-08-31 08:02:45'),(10,2,'New Order Received','Order #4 placed. Total: LKR 600',1,'2026-07-13 15:20:35','2026-08-31 08:02:45'),(11,2,'New Order Received','Order #5 placed. Total: LKR 950',1,'2026-07-13 15:21:44','2026-08-31 08:02:45'),(12,2,'New Order Received','Order #6 placed. Total: LKR 600',1,'2026-07-13 15:26:03','2026-08-31 08:02:45'),(13,3,'Order Approved','Your order #6 has been approved.',1,'2026-07-13 15:41:22','2026-08-25 18:23:12'),(14,3,'Order Delivered','Your order #6 has been delivered.',1,'2026-07-13 15:41:50','2026-08-25 18:23:12'),(15,2,'New Order Received','Order #7 placed. Total: LKR 1000',1,'2026-07-13 15:46:24','2026-08-31 08:02:45'),(16,2,'Order Confirmed by Retailer','Retailer has locked order #7 for processing.',1,'2026-07-13 15:46:30','2026-08-31 08:02:45'),(17,3,'Order Approved','Your order #7 has been approved.',1,'2026-07-13 15:46:38','2026-08-25 18:23:12'),(18,3,'Order Delivered','Your order #7 has been delivered.',1,'2026-07-13 15:47:09','2026-08-25 18:23:12'),(19,2,'New Order Received','Order #8 placed. Total: LKR 600',1,'2026-07-13 16:06:09','2026-08-31 08:02:45'),(20,2,'Order Confirmed by Retailer','Retailer has locked order #8 for processing.',1,'2026-07-13 16:06:38','2026-08-31 08:02:45'),(21,3,'Order Approved','Your order #8 has been approved.',1,'2026-07-13 16:10:43','2026-08-25 18:23:12'),(22,3,'Order Delivered','Your order #8 has been delivered.',1,'2026-07-13 16:11:06','2026-08-25 18:23:12'),(23,2,'New Order Received','Order #9 placed. Total: LKR 1000',1,'2026-07-13 16:12:18','2026-08-31 08:02:45'),(24,2,'New Order Received','Order #10 placed. Total: LKR 1000',1,'2026-07-13 16:15:20','2026-08-31 08:02:45'),(25,2,'Order Confirmed by Retailer','Retailer has locked order #10 for processing.',1,'2026-07-13 16:15:26','2026-08-31 08:02:45'),(26,3,'Order Approved','Your order #10 has been approved.',1,'2026-07-13 16:15:37','2026-08-25 18:23:12'),(27,3,'Order Delivered','Your order #10 has been delivered.',1,'2026-07-13 16:16:00','2026-08-25 18:23:12'),(28,2,'New Order Received','Order #11 placed. Total: LKR 1200',1,'2026-07-13 16:41:43','2026-08-31 08:02:45'),(29,2,'Order Confirmed by Retailer','Retailer has locked order #11 for processing.',1,'2026-07-13 16:41:49','2026-08-31 08:02:45'),(30,3,'Order Approved','Your order #11 has been approved.',1,'2026-07-13 16:42:01','2026-08-25 18:23:12'),(31,3,'Order Delivered','Your order #11 has been delivered.',1,'2026-07-13 16:42:21','2026-08-25 18:23:12'),(32,2,'New Order Received','Order #12 placed. Total: LKR 950',1,'2026-07-13 16:48:41','2026-08-31 08:02:45'),(33,2,'Order Confirmed by Retailer','Retailer has locked order #12 for processing.',1,'2026-07-13 16:49:23','2026-08-31 08:02:45'),(34,3,'Order Approved','Your order #12 has been approved.',1,'2026-07-13 16:49:32','2026-08-25 18:23:12'),(35,3,'Order Delivered','Your order #12 has been delivered.',1,'2026-07-13 16:50:26','2026-08-25 18:23:12'),(36,2,'New Order Received','Order #13 placed. Total: LKR 400',1,'2026-07-13 17:01:25','2026-08-31 08:02:45'),(37,2,'Order Confirmed by Retailer','Retailer has locked order #13 for processing.',1,'2026-07-13 17:01:35','2026-08-31 08:02:45'),(38,3,'Order Approved','Your order #13 has been approved.',1,'2026-07-13 17:03:10','2026-08-25 18:23:12'),(39,2,'New Order Received','Order #14 placed. Total: LKR 1000',1,'2026-07-13 17:45:05','2026-08-31 08:02:45'),(40,2,'Order Confirmed by Retailer','Retailer has locked order #14 for processing.',1,'2026-07-13 17:45:12','2026-08-31 08:02:45'),(41,3,'Order Approved','Your order #14 has been approved.',1,'2026-07-13 17:45:39','2026-08-25 18:23:12'),(42,3,'Order Delivered','Your order #13 has been delivered.',1,'2026-07-13 17:46:54','2026-08-25 18:23:12'),(43,3,'Order Delivered','Your order #14 has been delivered.',1,'2026-07-13 17:46:57','2026-08-25 18:23:12'),(44,2,'New Order Received','Order #15 placed. Total: LKR 800',1,'2026-07-13 17:50:41','2026-08-31 08:02:45'),(45,2,'Order Confirmed by Retailer','Retailer has locked order #15 for processing.',1,'2026-07-13 17:51:26','2026-08-31 08:02:45'),(46,3,'Order Approved','Your order #15 has been approved.',1,'2026-07-13 17:52:27','2026-08-25 18:23:12'),(47,3,'Order Delivered','Your order #15 has been delivered.',1,'2026-07-13 17:54:20','2026-08-25 18:23:12'),(48,2,'New Order Received','Order #16 placed. Total: LKR 1540',1,'2026-07-13 19:35:46','2026-08-31 08:02:45'),(49,2,'Order Confirmed by Retailer','Retailer has locked order #16 for processing.',1,'2026-07-13 19:35:57','2026-08-31 08:02:45'),(50,3,'Order Approved','Your order #16 has been approved.',1,'2026-07-13 19:36:17','2026-08-25 18:23:12'),(51,2,'New Order Received','Order #17 placed. Total: LKR 2000',1,'2026-07-13 19:37:29','2026-08-31 08:02:45'),(52,2,'Order Confirmed by Retailer','Retailer has locked order #17 for processing.',1,'2026-07-13 19:37:36','2026-08-31 08:02:45'),(53,3,'Order Approved','Your order #17 has been approved.',1,'2026-07-13 19:38:09','2026-08-25 18:23:12'),(54,2,'New Order Received','Order #18 placed. Total: LKR 480',1,'2026-07-14 05:15:41','2026-08-31 08:02:45'),(55,2,'Order Confirmed by Retailer','Retailer has locked order #18 for processing.',1,'2026-07-14 05:16:00','2026-08-31 08:02:45'),(56,3,'Order Approved','Your order #18 has been approved.',1,'2026-07-14 05:16:49','2026-08-25 18:23:12'),(57,5,'Account Status Update','Your registration has been approved.',0,'2026-07-14 05:17:57','2026-07-14 05:17:57'),(58,3,'Order Delivered','Your order #17 has been delivered.',1,'2026-07-14 05:18:40','2026-08-25 18:23:12'),(59,3,'Order Delivered','Your order #16 has been delivered.',1,'2026-07-14 05:18:44','2026-08-25 18:23:12'),(60,6,'Account Status Updated','Your account status changed to: Approved',0,'2026-07-14 05:20:11','2026-07-14 05:20:11'),(61,3,'Order Delivered','Your order #18 has been delivered.',1,'2026-07-17 09:22:57','2026-08-25 18:23:12'),(62,2,'New Order Received','Order #19 placed. Total: LKR 2200',1,'2026-07-17 09:23:50','2026-08-31 08:02:45'),(63,2,'Order Confirmed by Retailer','Retailer has locked order #19 for processing.',1,'2026-07-17 09:24:04','2026-08-31 08:02:45'),(64,2,'New Order Received','Order #20 placed. Total: LKR 1900',1,'2026-07-17 09:38:52','2026-08-31 08:02:45'),(65,2,'Order Confirmed by Retailer','Retailer has locked order #20 for processing.',1,'2026-07-17 09:39:04','2026-08-31 08:02:45'),(66,3,'Order Rejected','Your order #19 was rejected.',1,'2026-07-17 09:39:18','2026-08-25 18:23:12'),(67,3,'Order Approved','Your order #20 has been approved.',1,'2026-07-17 09:39:19','2026-08-25 18:23:12'),(68,3,'Order Delivered','Your order #20 has been delivered.',1,'2026-07-17 09:39:32','2026-08-25 18:23:12'),(69,1,'New Supply Request','Distributor ID 1 submitted supply request #3',1,'2026-07-19 12:31:02','2026-08-25 18:31:39'),(70,1,'New Supply Request','Distributor ID 1 submitted supply request #4',1,'2026-07-22 11:12:10','2026-08-25 18:31:39'),(71,2,'Supply Request Approved','Your supply request #1 has been approved.',1,'2026-07-22 11:19:06','2026-08-31 08:02:45'),(72,2,'Supply Request Approved','Your supply request #2 has been approved.',1,'2026-07-22 11:19:13','2026-08-31 08:02:45'),(73,2,'Supply Request Rejected','Your supply request #3 was rejected. Reason: ',1,'2026-07-22 11:19:17','2026-08-31 08:02:45'),(74,2,'Supply Request Approved','Your supply request #4 has been approved.',1,'2026-07-22 11:19:20','2026-08-31 08:02:45'),(75,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #4.',1,'2026-07-22 11:20:49','2026-08-25 18:31:39'),(76,1,'New Supply Request','Distributor ID 1 submitted supply request #5',1,'2026-07-22 11:33:16','2026-08-25 18:31:39'),(77,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #2.',1,'2026-07-22 11:33:43','2026-08-25 18:31:39'),(78,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #1.',1,'2026-07-22 11:33:56','2026-08-25 18:31:39'),(79,2,'Supply Request Approved','Your supply request #5 has been approved.',1,'2026-07-22 11:34:19','2026-08-31 08:02:45'),(80,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #5.',1,'2026-07-22 11:34:51','2026-08-25 18:31:39'),(81,1,'New Supply Request','Distributor ID 1 submitted supply request #6',1,'2026-07-22 11:49:44','2026-08-25 18:31:39'),(82,2,'Supply Request Approved','Your supply request #6 has been approved.',1,'2026-07-22 11:50:18','2026-08-31 08:02:45'),(83,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #6.',1,'2026-07-22 11:50:58','2026-08-25 18:31:39'),(84,1,'New Supply Request','Distributor ID 1 submitted supply request #7',1,'2026-07-22 17:45:42','2026-08-25 18:31:39'),(85,2,'Supply Request Approved','Your supply request #7 has been approved.',1,'2026-07-22 17:45:57','2026-08-31 08:02:45'),(86,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #7.',1,'2026-07-22 17:46:36','2026-08-25 18:31:39'),(87,1,'New Supply Request','Distributor ID 1 submitted supply request #8',1,'2026-07-22 17:47:24','2026-08-25 18:31:39'),(88,2,'Supply Request Approved','Your supply request #8 has been approved.',1,'2026-07-22 17:50:19','2026-08-31 08:02:45'),(89,5,'Account Status Update','Your registration has been rejected.',0,'2026-07-22 18:02:11','2026-07-22 18:02:11'),(90,5,'Account Status Update','Your registration has been approved.',0,'2026-07-22 18:02:20','2026-07-22 18:02:20'),(91,1,'New Supply Request','Distributor ID 1 submitted supply request #9',1,'2026-07-22 18:03:54','2026-08-25 18:31:39'),(92,2,'Supply Request Approved','Your supply request #9 has been approved.',1,'2026-07-22 18:05:48','2026-08-31 08:02:45'),(93,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #8.',1,'2026-07-22 18:07:18','2026-08-25 18:31:39'),(94,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #9.',1,'2026-07-22 18:07:27','2026-08-25 18:31:39'),(95,1,'New Supply Request','Distributor ID 1 submitted supply request #10',1,'2026-07-22 18:08:23','2026-08-25 18:31:39'),(96,2,'Supply Request Approved','Your supply request #10 has been approved.',1,'2026-07-22 18:15:42','2026-08-31 08:02:45'),(97,3,'Account Status Update','Your account has been blocked.',1,'2026-07-22 18:23:51','2026-08-25 18:23:12'),(98,3,'Account Status Update','Your registration has been approved.',1,'2026-07-22 18:25:20','2026-08-25 18:23:12'),(99,2,'New Order Received','Order #21 placed. Total: LKR 3647.77',1,'2026-07-24 12:55:51','2026-08-31 08:02:45'),(100,2,'Order Confirmed by Retailer','Retailer has locked order #21 for processing.',1,'2026-07-24 12:56:20','2026-08-31 08:02:45'),(101,3,'Order Approved','Your order #21 has been approved.',1,'2026-07-25 16:32:38','2026-08-25 18:23:12'),(102,2,'New Order Received','Order #22 placed. Total: LKR 1672',1,'2026-07-26 06:43:43','2026-08-31 08:02:45'),(103,2,'Order Confirmed by Retailer','Retailer has locked order #22 for processing.',1,'2026-07-26 06:43:56','2026-08-31 08:02:45'),(104,3,'Order Approved','Your order #22 has been approved.',1,'2026-07-26 06:44:52','2026-08-25 18:23:12'),(105,7,'Account Status Updated','Your account status changed to: Approved',1,'2026-07-29 08:19:17','2026-08-25 18:24:41'),(106,1,'New Supply Request','Distributor ID 3 submitted supply request #11',1,'2026-07-29 08:22:55','2026-08-25 18:31:39'),(107,7,'Supply Request Approved','Your supply request #11 has been approved.',1,'2026-07-29 08:23:23','2026-08-25 18:24:41'),(108,1,'Stock Received Confirmation','Distributor ID 3 confirmed receipt of stock for request #11.',1,'2026-07-29 08:23:40','2026-08-25 18:31:39'),(109,7,'New Order Received','Order #23 placed. Total: LKR 1215.92',1,'2026-07-29 08:24:51','2026-08-25 18:24:41'),(110,7,'Order Confirmed by Retailer','Retailer has locked order #23 for processing.',1,'2026-07-29 08:25:04','2026-08-25 18:24:41'),(111,3,'Order Approved','Your order #23 has been approved.',1,'2026-07-29 08:25:42','2026-08-25 18:23:12'),(112,7,'New Order Received','Order #24 placed. Total: LKR 2431.85',1,'2026-07-29 08:30:56','2026-08-25 18:24:41'),(113,7,'Order Confirmed by Retailer','Retailer has locked order #24 for processing.',1,'2026-07-29 08:31:28','2026-08-25 18:24:41'),(114,2,'New Order Received','Order #25 placed. Total: LKR 1368',1,'2026-07-29 08:32:25','2026-08-31 08:02:45'),(115,3,'Order Approved','Your order #24 has been approved.',1,'2026-07-29 08:32:59','2026-08-25 18:23:12'),(116,2,'Order Confirmed by Retailer','Retailer has locked order #25 for processing.',1,'2026-07-29 08:33:52','2026-08-31 08:02:45'),(117,3,'Order Approved','Your order #25 has been approved.',1,'2026-07-29 08:33:59','2026-08-25 18:23:12'),(118,3,'Order Delivered','Your order #21 has been delivered.',1,'2026-07-29 08:34:35','2026-08-25 18:23:12'),(119,3,'Order Delivered','Your order #22 has been delivered.',1,'2026-07-29 08:34:37','2026-08-25 18:23:12'),(120,3,'Order Delivered','Your order #25 has been delivered.',1,'2026-07-29 08:34:55','2026-08-25 18:23:12'),(121,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #10.',1,'2026-07-29 08:46:24','2026-08-25 18:31:39'),(122,2,'New Order Received','Order #26 placed. Total: LKR 1672',1,'2026-08-01 10:22:35','2026-08-31 08:02:45'),(123,3,'Order Approved','Your order #26 has been approved.',1,'2026-08-01 10:23:57','2026-08-25 18:23:12'),(124,3,'Order Delivered','Your order #26 has been delivered.',1,'2026-08-01 10:31:40','2026-08-25 18:23:12'),(125,3,'Order Delivered','Your order #26 has been delivered.',1,'2026-08-01 10:31:42','2026-08-25 18:23:12'),(126,2,'New Order Received','Order #27 placed. Total: LKR 2812',1,'2026-08-01 12:35:50','2026-08-31 08:02:45'),(127,3,'Order Approved','Your order #27 has been approved.',1,'2026-08-01 12:36:26','2026-08-25 18:23:12'),(128,2,'New Order Received','Order #28 placed. Total: LKR 4635.69',1,'2026-08-01 12:39:28','2026-08-31 08:02:45'),(129,3,'Order Approved','Your order #28 has been approved.',1,'2026-08-01 12:40:04','2026-08-25 18:23:12'),(130,2,'New Order Received','Order #29 placed. Total: LKR 220',1,'2026-08-08 06:04:16','2026-08-31 08:02:45'),(131,2,'New Order Received','Order #30 placed. Total: LKR 220',1,'2026-08-08 06:04:34','2026-08-31 08:02:45'),(132,2,'Online Payment Received','Order #30 paid online (LKR 220.00). Ref: TEST_REF_123',1,'2026-08-08 06:04:37','2026-08-31 08:02:45'),(133,3,'Payment Successful','Your online payment of LKR 220.00 for Order #30 was successful.',1,'2026-08-08 06:04:38','2026-08-25 18:23:12'),(134,2,'New Order Received','Order #31 placed. Total: LKR 2432',1,'2026-08-08 06:06:15','2026-08-31 08:02:45'),(135,2,'New Order Received','Order #32 placed. Total: LKR 2432',1,'2026-08-08 06:06:29','2026-08-31 08:02:45'),(136,2,'New Order Received','Order #33 placed. Total: LKR 1368',1,'2026-08-08 06:07:19','2026-08-31 08:02:45'),(137,2,'New Order Received','Order #34 placed. Total: LKR 1368',1,'2026-08-08 06:10:02','2026-08-31 08:02:45'),(138,2,'New Order Received','Order #35 placed. Total: LKR 110',1,'2026-08-08 06:11:27','2026-08-31 08:02:45'),(139,2,'New Order Received','Order #36 placed. Total: LKR 110',1,'2026-08-08 06:12:54','2026-08-31 08:02:45'),(140,2,'Online Payment Received','Order #36 paid online (LKR 110.00). Ref: PAY_REF_TEST',1,'2026-08-08 06:12:57','2026-08-31 08:02:45'),(141,3,'Payment Successful','Your online payment of LKR 110.00 for Order #36 was successful.',1,'2026-08-08 06:12:57','2026-08-25 18:23:12'),(142,2,'Online Payment Received','Order #34 paid online (LKR 1,368.00). Ref: PAY_REF_359818',1,'2026-08-08 06:13:24','2026-08-31 08:02:45'),(143,3,'Payment Successful','Your online payment of LKR 1,368.00 for Order #34 was successful.',1,'2026-08-08 06:13:24','2026-08-25 18:23:12'),(144,2,'New Order Received','Order #37 placed. Total: LKR 110',1,'2026-08-08 06:18:23','2026-08-31 08:02:45'),(145,2,'Online Payment Received','Order #37 paid online (LKR 110.00). Ref: PAY_REF_TEST',1,'2026-08-08 06:18:26','2026-08-31 08:02:45'),(146,3,'Payment Successful','Your online payment of LKR 110.00 for Order #37 was successful.',1,'2026-08-08 06:18:26','2026-08-25 18:23:12'),(147,3,'Order Approved','Your order #35 has been approved.',1,'2026-08-08 06:21:52','2026-08-25 18:23:12'),(148,3,'Order Rejected','Your order #31 was rejected.',1,'2026-08-08 06:22:51','2026-08-25 18:23:12'),(149,3,'Order Delivered','Your order #27 has been delivered.',1,'2026-08-08 06:27:44','2026-08-25 18:23:12'),(150,3,'Order Delivered','Your order #28 has been delivered.',1,'2026-08-08 06:27:49','2026-08-25 18:23:12'),(151,3,'Order Delivered','Your order #35 has been delivered.',1,'2026-08-08 06:27:54','2026-08-25 18:23:12'),(152,3,'Order Rejected','Your order #29 was rejected.',1,'2026-08-08 06:29:26','2026-08-25 18:23:12'),(153,3,'Order Rejected','Your order #30 was rejected.',1,'2026-08-08 06:29:27','2026-08-25 18:23:12'),(154,3,'Order Rejected','Your order #32 was rejected.',1,'2026-08-08 06:29:27','2026-08-25 18:23:12'),(155,3,'Order Rejected','Your order #33 was rejected.',1,'2026-08-08 06:29:45','2026-08-25 18:23:12'),(156,3,'Order Rejected','Your order #34 was rejected.',1,'2026-08-08 06:29:46','2026-08-25 18:23:12'),(157,3,'Order Rejected','Your order #36 was rejected.',1,'2026-08-08 06:29:46','2026-08-25 18:23:12'),(158,3,'Order Rejected','Your order #37 was rejected.',1,'2026-08-08 06:29:47','2026-08-25 18:23:12'),(159,2,'New Order Received','Order #38 placed. Total: LKR 1824',1,'2026-08-08 06:32:49','2026-08-31 08:02:45'),(160,2,'Online Payment Received','Order #38 paid online (LKR 1,824.00). Ref: PAY_REF_681085',1,'2026-08-08 06:33:01','2026-08-31 08:02:45'),(161,3,'Payment Successful','Your online payment of LKR 1,824.00 for Order #38 was successful.',1,'2026-08-08 06:33:01','2026-08-25 18:23:12'),(162,3,'Order Approved','Your order #38 has been approved.',1,'2026-08-08 06:33:52','2026-08-25 18:23:12'),(163,3,'Order Delivered','Your order #38 has been delivered.',1,'2026-08-08 06:37:29','2026-08-25 18:23:12'),(164,2,'New Order Received','Order #39 placed. Total: LKR 1216',1,'2026-08-08 07:04:36','2026-08-31 08:02:45'),(165,2,'New Order Received','Order #40 placed. Total: LKR 1216',1,'2026-08-08 07:21:47','2026-08-31 08:02:45'),(166,7,'New Order Received','Order #41 placed. Total: LKR 1215.92',1,'2026-08-08 07:23:28','2026-08-25 18:24:41'),(167,2,'New Order Received','Order #42 placed. Total: LKR 684',1,'2026-08-08 07:25:58','2026-08-31 08:02:45'),(168,2,'Online Payment Received','Order #42 paid online (LKR 684.00). Ref: PAY_REF_456694',1,'2026-08-08 07:26:05','2026-08-31 08:02:45'),(169,3,'Payment Successful','Your online payment of LKR 684.00 for Order #42 was successful.',1,'2026-08-08 07:26:05','2026-08-25 18:23:12'),(170,2,'Order Confirmed by Retailer','Retailer has locked order #42 for processing.',1,'2026-08-08 07:28:26','2026-08-31 08:02:45'),(171,2,'New Order Received','Order #43 placed. Total: LKR 3648',1,'2026-08-08 07:31:22','2026-08-31 08:02:45'),(172,2,'Online Payment Received','Order #43 paid online (LKR 3,648.00). Ref: PAY_REF_882734',1,'2026-08-08 07:31:42','2026-08-31 08:02:45'),(173,3,'Payment Successful','Your online payment of LKR 3,648.00 for Order #43 was successful.',1,'2026-08-08 07:31:42','2026-08-25 18:23:12'),(174,2,'New Order Received','Order #44 placed. Total: LKR 684',1,'2026-08-09 18:54:10','2026-08-31 08:02:45'),(175,2,'Online Payment Received','Order #44 paid online (LKR 684.00). Ref: PAY_REF_922334',1,'2026-08-09 18:54:24','2026-08-31 08:02:45'),(176,3,'Payment Successful','Your online payment of LKR 684.00 for Order #44 was successful.',1,'2026-08-09 18:54:24','2026-08-25 18:23:12'),(177,2,'New Order Received','Order #45 placed. Total: LKR 7072',1,'2026-08-11 18:02:53','2026-08-31 08:02:45'),(178,2,'Online Payment Received','Order #45 paid online (LKR 7,072.00). Ref: PAY_REF_364916',1,'2026-08-11 18:03:07','2026-08-31 08:02:45'),(179,3,'Payment Successful','Your online payment of LKR 7,072.00 for Order #45 was successful.',1,'2026-08-11 18:03:07','2026-08-25 18:23:12'),(180,2,'New Order Received','Order #46 placed. Total: LKR 988',1,'2026-08-11 18:26:16','2026-08-31 08:02:45'),(181,7,'New Order Received','Order #47 placed. Total: LKR 4607.71',1,'2026-08-11 18:26:42','2026-08-25 18:24:41'),(182,7,'Order Confirmed by Retailer','Retailer has locked order #47 for processing.',1,'2026-08-11 18:27:49','2026-08-25 18:24:41'),(183,2,'Order Confirmed by Retailer','Retailer has locked order #46 for processing.',1,'2026-08-11 18:27:52','2026-08-31 08:02:45'),(184,2,'New Order Received','Order #48 placed. Total: LKR 1216',1,'2026-08-11 18:28:18','2026-08-31 08:02:45'),(185,2,'Order Confirmed by Retailer','Retailer has locked order #48 for processing.',1,'2026-08-11 18:28:25','2026-08-31 08:02:45'),(186,2,'New Order Received','Order #49 placed. Total: LKR 3744',1,'2026-08-11 18:34:52','2026-08-31 08:02:45'),(187,2,'Order Confirmed by Retailer','Retailer has locked order #49 for processing.',1,'2026-08-11 18:35:00','2026-08-31 08:02:45'),(188,2,'New Order Received','Order #50 placed. Total: LKR 988',1,'2026-08-13 16:41:48','2026-08-31 08:02:45'),(189,7,'New Order Received','Order #51 placed. Total: LKR 1215.92',1,'2026-08-13 16:42:55','2026-08-25 18:24:41'),(190,2,'New Order Received','Order #52 placed. Total: LKR 1216',1,'2026-08-13 16:45:58','2026-08-31 08:02:45'),(191,2,'New Order Received','Order #53 placed. Total: LKR 684',1,'2026-08-13 17:03:33','2026-08-31 08:02:45'),(192,2,'New Order Received','Order #54 placed. Total: LKR 684',1,'2026-08-13 17:04:21','2026-08-31 08:02:45'),(193,2,'New Order Received','Order #55 placed. Total: LKR 684',1,'2026-08-13 17:08:14','2026-08-31 08:02:45'),(194,2,'New Order Received','Order #56 placed. Total: LKR 3799.92',1,'2026-08-13 17:09:50','2026-08-31 08:02:45'),(195,2,'New Order Received','Order #57 placed. Total: LKR 3799.92',1,'2026-08-13 17:10:09','2026-08-31 08:02:45'),(196,2,'Online Payment Received','Order #57 paid online (LKR 3,799.92). Ref: PAY_REF_498873',1,'2026-08-13 17:10:20','2026-08-31 08:02:45'),(197,3,'Payment Successful','Your online payment of LKR 3,799.92 for Order #57 was successful.',1,'2026-08-13 17:10:21','2026-08-25 18:23:12'),(198,2,'New Order Received','Order #58 placed. Total: LKR 1976',1,'2026-08-13 17:11:22','2026-08-31 08:02:45'),(199,2,'Online Payment Received','Order #58 paid online (LKR 1,976.00). Ref: PAY_REF_863177',1,'2026-08-13 17:11:56','2026-08-31 08:02:45'),(200,3,'Payment Successful','Your online payment of LKR 1,976.00 for Order #58 was successful.',1,'2026-08-13 17:11:56','2026-08-25 18:23:12'),(201,2,'New Order Received','Order #59 placed. Total: LKR 988',1,'2026-08-13 17:46:25','2026-08-31 08:02:45'),(202,2,'Online Payment Received','Order #59 paid online (LKR 988.00). Ref: PAY_REF_190127',1,'2026-08-13 17:46:32','2026-08-31 08:02:45'),(203,3,'Payment Successful','Your online payment of LKR 988.00 for Order #59 was successful.',1,'2026-08-13 17:46:32','2026-08-25 18:23:12'),(204,2,'New Order Received','Order #60 placed. Total: LKR 1367.92',1,'2026-08-13 17:53:35','2026-08-31 08:02:45'),(205,2,'Online Payment Received','Order #60 paid online (LKR 1,367.92). Ref: PAY_REF_214881',1,'2026-08-13 17:53:45','2026-08-31 08:02:45'),(206,3,'Payment Successful','Your online payment of LKR 1,367.92 for Order #60 was successful.',1,'2026-08-13 17:53:45','2026-08-25 18:23:12'),(207,2,'New Order Received','Order #61 placed. Total: LKR 3799.92',1,'2026-08-13 17:54:57','2026-08-31 08:02:45'),(208,2,'New Order Received','Order #62 placed. Total: LKR 3799.92',1,'2026-08-13 17:55:20','2026-08-31 08:02:45'),(209,2,'New Order Received','Order #63 placed. Total: LKR 3799.92',1,'2026-08-13 17:55:31','2026-08-31 08:02:45'),(210,7,'New Order Received','Order #64 placed. Total: LKR 1215.92',1,'2026-08-13 17:57:33','2026-08-25 18:24:41'),(211,7,'Online Payment Received','Order #64 paid online (LKR 1,215.92). Ref: PAY_REF_487535',1,'2026-08-13 17:57:42','2026-08-25 18:24:41'),(212,3,'Payment Successful','Your online payment of LKR 1,215.92 for Order #64 was successful.',1,'2026-08-13 17:57:42','2026-08-25 18:23:12'),(213,2,'New Order Received','Order #65 placed. Total: LKR 5472',1,'2026-08-13 18:00:24','2026-08-31 08:02:45'),(214,7,'New Order Received','Order #66 placed. Total: LKR 5759.64',1,'2026-08-13 18:01:32','2026-08-25 18:24:41'),(215,7,'New Order Received','Order #67 placed. Total: LKR 5759.64',1,'2026-08-13 18:01:53','2026-08-25 18:24:41'),(216,7,'New Order Received','Order #68 placed. Total: LKR 5759.64',1,'2026-08-13 18:02:08','2026-08-25 18:24:41'),(217,7,'Online Payment Received','Order #68 paid online (LKR 5,759.64). Ref: PAY_REF_769266',1,'2026-08-13 18:02:16','2026-08-25 18:24:41'),(218,3,'Payment Successful','Your online payment of LKR 5,759.64 for Order #68 was successful.',1,'2026-08-13 18:02:17','2026-08-25 18:23:12'),(219,2,'New Order Received','Order #69 placed. Total: LKR 987.77',1,'2026-08-13 18:09:49','2026-08-31 08:02:45'),(220,2,'Online Payment Received','Order #69 paid online (LKR 987.77). Ref: PAY_REF_211680',1,'2026-08-13 18:09:56','2026-08-31 08:02:45'),(221,3,'Payment Successful','Your online payment of LKR 987.77 for Order #69 was successful.',1,'2026-08-13 18:09:56','2026-08-25 18:23:12'),(222,2,'New Order Received','Order #70 placed. Total: LKR 1976',1,'2026-08-13 18:11:59','2026-08-31 08:02:45'),(223,2,'New Order Received','Order #71 placed. Total: LKR 17999.64',1,'2026-08-13 18:13:20','2026-08-31 08:02:45'),(224,2,'New Order Received','Order #72 placed. Total: LKR 17999.64',1,'2026-08-13 18:14:10','2026-08-31 08:02:45'),(225,2,'New Order Received','Order #73 placed. Total: LKR 17999.64',1,'2026-08-13 18:14:59','2026-08-31 08:02:45'),(226,2,'Online Payment Received','Order #73 paid online (LKR 17,999.64). Ref: PAY_REF_784518',1,'2026-08-13 18:15:07','2026-08-31 08:02:45'),(227,3,'Payment Successful','Your online payment of LKR 17,999.64 for Order #73 was successful.',1,'2026-08-13 18:15:07','2026-08-25 18:23:12'),(228,7,'New Order Received','Order #74 placed. Total: LKR 2431.85',1,'2026-08-14 03:34:43','2026-08-25 18:24:41'),(229,7,'Online Payment Received','Order #74 paid online (LKR 2,431.85). Ref: PAY_REF_388817',1,'2026-08-14 03:35:27','2026-08-25 18:24:41'),(230,3,'Payment Successful','Your online payment of LKR 2,431.85 for Order #74 was successful.',1,'2026-08-14 03:35:28','2026-08-25 18:23:12'),(231,7,'Online Payment Received','Order #74 paid online (LKR 2,431.85). Ref: PAY_REF_688430',1,'2026-08-14 03:36:51','2026-08-25 18:24:36'),(232,3,'Payment Successful','Your online payment of LKR 2,431.85 for Order #74 was successful.',1,'2026-08-14 03:36:53','2026-08-25 18:23:12'),(233,7,'Online Payment Received','Order #74 paid online (LKR 2,431.85). Ref: PAY_REF_761185',1,'2026-08-14 03:37:11','2026-08-25 18:24:41'),(234,3,'Payment Successful','Your online payment of LKR 2,431.85 for Order #74 was successful.',1,'2026-08-14 03:37:12','2026-08-25 18:23:12'),(235,8,'Account Status Update','Your registration has been approved.',0,'2026-08-14 08:14:16','2026-08-14 08:14:16'),(236,3,'Account Status Update','Your account has been blocked.',1,'2026-08-14 08:35:23','2026-08-25 18:23:12'),(237,3,'Account Status Update','Your registration has been approved.',1,'2026-08-14 08:35:53','2026-08-25 18:23:12'),(238,2,'New Order Received','Order #75 placed. Total: LKR 5616',1,'2026-08-14 08:39:17','2026-08-31 08:02:45'),(239,2,'Online Payment Received','Order #75 paid online (LKR 5,616.00). Ref: PAY_REF_686581',1,'2026-08-14 08:39:28','2026-08-31 08:02:45'),(240,3,'Payment Successful','Your online payment of LKR 5,616.00 for Order #75 was successful.',1,'2026-08-14 08:39:28','2026-08-25 18:23:12'),(241,3,'Account Status Update','Your account access with Next gen Supplies (PVT)LTD has been blocked.',1,'2026-08-16 08:16:20','2026-08-25 18:23:12'),(242,3,'Account Status Update','Your registration/account has been approved.',1,'2026-08-16 08:17:26','2026-08-25 18:23:12'),(243,2,'New Order Received','Order #76 placed. Total: LKR 4284',1,'2026-08-16 15:11:52','2026-08-31 08:02:45'),(244,2,'Order Confirmed by Retailer','Retailer has locked order #76 for processing.',1,'2026-08-16 15:13:42','2026-08-31 08:02:45'),(245,3,'Order Approved','Your order #76 has been approved.',1,'2026-08-16 15:14:18','2026-08-25 18:23:12'),(246,2,'New Order Received','Order #77 placed. Total: LKR 988',1,'2026-08-16 15:19:33','2026-08-31 08:02:45'),(247,2,'Order Confirmed by Retailer','Retailer has locked order #77 for processing.',1,'2026-08-16 15:19:45','2026-08-31 08:02:45'),(248,3,'Order Approved','Your order #77 has been approved.',1,'2026-08-16 15:20:21','2026-08-25 18:23:07'),(249,2,'New Order Received','Order #78 placed. Total: LKR 14212',1,'2026-08-16 15:26:51','2026-08-31 08:02:45'),(250,2,'Order Confirmed by Retailer','Retailer has locked order #78 for processing.',1,'2026-08-16 15:26:58','2026-08-31 08:02:45'),(251,3,'Order Approved','Your order #78 has been approved.',1,'2026-08-16 15:27:45','2026-08-25 18:23:09'),(252,3,'Order Delivered','Your order #77 has been delivered.',1,'2026-08-16 15:56:39','2026-08-25 18:23:12'),(253,2,'New Order Received','Order #79 placed. Total: LKR 20736',1,'2026-08-16 16:17:18','2026-08-31 08:02:45'),(254,2,'Order Confirmed by Retailer','Retailer has locked order #79 for processing.',1,'2026-08-16 16:17:24','2026-08-31 08:02:45'),(255,8,'Order Approved','Your order #79 has been approved.',0,'2026-08-16 16:18:26','2026-08-16 16:18:26'),(256,8,'Order Delivered','Your order #79 has been delivered.',0,'2026-08-16 16:37:01','2026-08-16 16:37:01'),(257,3,'Order Rejected','Your order #47 was rejected.',1,'2026-08-16 18:04:56','2026-08-25 18:23:12'),(258,3,'Order Rejected','Your order #51 was rejected.',1,'2026-08-16 18:05:19','2026-08-25 18:23:12'),(259,3,'Order Approved','Your order #64 has been approved.',1,'2026-08-16 18:06:01','2026-08-25 18:23:12'),(260,3,'Order Approved','Your order #66 has been approved.',1,'2026-08-16 18:06:12','2026-08-25 18:23:12'),(261,3,'Order Approved','Your order #67 has been approved.',1,'2026-08-16 18:06:24','2026-08-25 18:23:12'),(262,3,'Order Rejected','Your order #68 was rejected.',1,'2026-08-16 18:06:43','2026-08-25 18:23:12'),(263,3,'Order Rejected','Your order #74 was rejected.',1,'2026-08-16 18:06:54','2026-08-25 18:23:12'),(264,3,'Delivery Returned','Your order #78 could not be delivered. Reason: Returned by customer',1,'2026-08-16 18:08:31','2026-08-25 18:23:12'),(265,3,'Order Delivered','Your order #76 has been delivered.',1,'2026-08-16 18:08:37','2026-08-25 18:23:12'),(266,3,'Order Rejected','Your order #75 was rejected.',1,'2026-08-16 18:12:39','2026-08-25 18:23:12'),(267,3,'Order Rejected','Your order #73 was rejected.',1,'2026-08-16 18:15:05','2026-08-25 18:23:12'),(268,3,'Order Approved','Your order #69 has been approved.',1,'2026-08-16 18:15:40','2026-08-25 18:23:12'),(269,3,'Order Delivered','Your order #69 has been delivered.',1,'2026-08-16 18:16:29','2026-08-25 18:23:12'),(270,3,'Order Rejected','Your order #62 was rejected.',1,'2026-08-16 18:16:32','2026-08-25 18:23:12'),(271,3,'Order Rejected','Your order #52 was rejected.',1,'2026-08-16 18:17:12','2026-08-25 18:23:12'),(272,3,'Order Approved','Your order #61 has been approved.',1,'2026-08-16 18:18:03','2026-08-25 18:23:12'),(273,3,'Order Rejected','Your order #49 was rejected.',1,'2026-08-16 18:18:43','2026-08-25 18:23:12'),(274,3,'Order Rejected','Your order #50 was rejected.',1,'2026-08-16 18:19:20','2026-08-25 18:23:12'),(275,3,'Order Rejected','Your order #57 was rejected.',1,'2026-08-16 18:19:22','2026-08-25 18:23:12'),(276,3,'Order Approved','Your order #58 has been approved.',1,'2026-08-16 18:20:37','2026-08-25 18:23:12'),(277,3,'Order Approved','Your order #59 has been approved.',1,'2026-08-16 18:20:37','2026-08-25 18:23:12'),(278,3,'Order Approved','Your order #60 has been approved.',1,'2026-08-16 18:20:37','2026-08-25 18:23:12'),(279,3,'Order Approved','Your order #39 has been approved.',1,'2026-08-16 18:22:17','2026-08-25 18:23:12'),(280,3,'Order Rejected','Your order #43 was rejected.',1,'2026-08-16 18:22:17','2026-08-25 18:23:12'),(281,3,'Order Approved','Your order #42 has been approved.',1,'2026-08-16 18:22:17','2026-08-25 18:23:12'),(282,3,'Order Rejected','Your order #44 was rejected.',1,'2026-08-16 18:22:18','2026-08-25 18:23:12'),(283,3,'Order Rejected','Your order #45 was rejected.',1,'2026-08-16 18:22:18','2026-08-25 18:23:12'),(284,3,'Order Rejected','Your order #46 was rejected.',1,'2026-08-16 18:22:19','2026-08-25 18:23:12'),(285,3,'Order Approved','Your order #48 has been approved.',1,'2026-08-16 18:23:11','2026-08-25 18:23:12'),(286,3,'Order Delivered','Your order #61 has been delivered.',1,'2026-08-16 18:23:50','2026-08-25 18:23:12'),(287,3,'Order Delivered','Your order #58 has been delivered.',1,'2026-08-16 18:24:11','2026-08-25 18:23:12'),(288,3,'Order Delivered','Your order #59 has been delivered.',1,'2026-08-16 18:24:12','2026-08-25 18:23:12'),(289,3,'Order Delivered','Your order #60 has been delivered.',1,'2026-08-16 18:24:13','2026-08-25 18:23:12'),(290,3,'Order Delivered','Your order #39 has been delivered.',1,'2026-08-16 18:24:17','2026-08-25 18:23:12'),(291,3,'Order Delivered','Your order #42 has been delivered.',1,'2026-08-16 18:24:17','2026-08-25 18:23:12'),(292,3,'Order Delivered','Your order #48 has been delivered.',1,'2026-08-16 18:24:18','2026-08-25 18:23:12'),(293,2,'New Order Received','Order #80 placed. Total: LKR 1184',1,'2026-08-16 18:53:51','2026-08-31 08:02:45'),(294,2,'Order Confirmed by Retailer','Retailer has locked order #80 for processing.',1,'2026-08-16 18:54:12','2026-08-31 08:02:45'),(295,3,'Order Approved','Your order #80 has been approved.',1,'2026-08-16 18:54:55','2026-08-25 18:23:12'),(296,3,'Order Delivered','Your order #80 has been delivered.',1,'2026-08-16 18:58:35','2026-08-25 18:23:12'),(297,1,'New Supply Request','Distributor ID 1 submitted supply request #12',1,'2026-08-18 18:33:32','2026-08-25 18:31:39'),(298,2,'Supply Request Approved','Your supply request #12 has been approved.',1,'2026-08-18 18:34:38','2026-08-31 08:02:45'),(299,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #12.',1,'2026-08-18 18:35:55','2026-08-25 18:31:39'),(300,2,'New Order Received','Order #81 placed. Total: LKR 1184',1,'2026-08-20 18:08:47','2026-08-31 08:02:45'),(301,1,'New Supply Request','Distributor ID 1 submitted supply request #13',1,'2026-08-24 07:39:33','2026-08-25 18:31:39'),(302,2,'Supply Request Approved','Your supply request #13 has been approved.',1,'2026-08-24 07:41:23','2026-08-31 08:02:45'),(303,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #13.',1,'2026-08-24 07:42:37','2026-08-25 18:31:39'),(304,1,'New Supply Request','Distributor ID 1 submitted supply request #14',1,'2026-08-24 08:11:56','2026-08-25 18:31:39'),(305,2,'Supply Request Approved','Your supply request #14 has been approved.',1,'2026-08-24 08:14:41','2026-08-31 08:02:45'),(306,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #14.',1,'2026-08-24 08:30:21','2026-08-25 18:31:39'),(307,1,'New Supply Request','Distributor ID 1 submitted supply request #15',1,'2026-08-24 09:10:49','2026-08-25 18:31:39'),(308,2,'Supply Request Approved','Your supply request #15 has been approved.',1,'2026-08-24 09:11:43','2026-08-31 08:02:45'),(309,1,'Stock Received Confirmation','Distributor ID 1 confirmed receipt of stock for request #15.',1,'2026-08-24 09:12:30','2026-08-25 18:31:39'),(310,2,'New Order Received','Order #82 placed. Total: LKR 684',1,'2026-08-24 09:15:15','2026-08-31 08:02:45'),(311,2,'Order Confirmed by Retailer','Retailer has locked order #82 for processing.',1,'2026-08-24 09:15:34','2026-08-31 08:02:45'),(312,8,'Order Approved','Your order #81 has been approved.',0,'2026-08-24 09:17:04','2026-08-24 09:17:04'),(313,3,'Order Rejected','Your order #82 was rejected.',1,'2026-08-24 09:26:47','2026-08-25 18:23:12'),(314,8,'Order Delivered','Your order #81 has been delivered.',0,'2026-08-24 09:30:37','2026-08-24 09:30:37'),(315,8,'Account Status Update','Your account access with Golden Distribution Ltd has been blocked.',0,'2026-08-24 17:18:40','2026-08-24 17:18:40'),(316,3,'Account Status Update','Your account access with Golden Distribution Ltd has been blocked.',1,'2026-08-24 17:19:07','2026-08-25 18:23:12'),(317,8,'Account Status Update','Your registration has been rejected.',0,'2026-08-24 17:19:16','2026-08-24 17:19:16'),(318,3,'Account Status Update','Your registration/account has been approved.',1,'2026-08-24 17:19:47','2026-08-25 18:23:12'),(319,8,'Account Status Update','Your registration/account has been approved.',0,'2026-08-24 17:23:22','2026-08-24 17:23:22'),(320,2,'New Order Received','Order #83 placed. Total: LKR 2356',1,'2026-08-24 17:54:12','2026-08-31 08:02:45'),(321,2,'New Order Received','Order #84 placed. Total: LKR 684',1,'2026-08-24 17:54:38','2026-08-31 08:02:45'),(322,2,'Full Credit Settlement Received','Retailer \'New Castle\' settled full outstanding debt of LKR 1,000.00 online. Ref: TEST_GATEWAY_REF_123',1,'2026-08-24 18:25:17','2026-08-31 08:02:45'),(323,8,'Debt Settlement Confirmed','Your full online debt settlement of LKR 1,000.00 was processed. Your credit line is fully restored.',0,'2026-08-24 18:25:17','2026-08-24 18:25:17'),(324,2,'New Order Received','Order #85 placed. Total: LKR 684',1,'2026-08-24 18:32:52','2026-08-31 08:02:45'),(325,2,'Order Confirmed by Retailer','Retailer has locked order #85 for processing.',1,'2026-08-24 18:33:59','2026-08-31 08:02:45'),(326,3,'Order Approved','Your order #85 has been approved.',1,'2026-08-24 18:35:17','2026-08-25 18:23:12'),(327,3,'Order Delivered','Your order #85 has been delivered.',1,'2026-08-24 18:35:44','2026-08-25 18:23:12'),(328,2,'Full Credit Settlement Received','Retailer \'Star Grocery Store\' settled full outstanding debt of LKR 684.00 online. Ref: PAY_REF_953169',1,'2026-08-24 18:37:20','2026-08-31 08:02:45'),(329,3,'Debt Settlement Confirmed','Your full online debt settlement of LKR 684.00 was processed. Your credit line is fully restored.',1,'2026-08-24 18:37:20','2026-08-25 18:23:12'),(330,1,'New Supply Request','Distributor ID 3 submitted supply request #16',1,'2026-08-24 19:19:48','2026-08-25 18:31:39'),(331,7,'Supply Request Approved','Your supply request #16 has been approved.',1,'2026-08-24 19:20:30','2026-08-25 18:24:41'),(332,1,'Stock Received Confirmation','Distributor ID 3 confirmed receipt of stock for request #16.',1,'2026-08-24 19:21:36','2026-08-25 18:31:39'),(333,2,'New Order Received','Order #86 placed. Total: LKR 4680',1,'2026-08-24 19:22:13','2026-08-31 08:02:45'),(334,2,'Order Confirmed by Retailer','Retailer has locked order #86 for processing.',1,'2026-08-24 19:22:29','2026-08-31 08:02:45'),(335,7,'New Order Received','Order #87 placed. Total: LKR 1215.92',1,'2026-08-24 19:22:53','2026-08-25 18:24:41'),(336,3,'Order Approved','Your order #86 has been approved.',1,'2026-08-24 19:24:16','2026-08-25 18:23:12'),(337,7,'Order Confirmed by Retailer','Retailer has locked order #87 for processing.',1,'2026-08-24 19:26:21','2026-08-25 18:24:26'),(338,3,'Order Delivered','Your order #86 has been delivered.',1,'2026-08-24 19:26:48','2026-08-25 18:23:12'),(339,3,'Order Approved','Your order #87 has been approved.',1,'2026-08-24 19:27:40','2026-08-25 18:23:12'),(340,4,'New Delivery Job Available','Order #87 is ready for delivery in Colombo Central.',1,'2026-08-25 18:30:21','2026-08-25 18:36:52'),(341,4,'Dispatch Alert','Assigned route updated for today\'s scheduled deliveries.',1,'2026-08-25 18:30:21','2026-08-25 18:36:49'),(342,4,'Account Status Verified','Your driver credentials and account status are active.',1,'2026-08-25 18:30:21','2026-08-25 18:30:21'),(343,10,'Account Status Update','Your registration/account has been approved.',0,'2026-08-27 19:46:09','2026-08-27 19:46:09'),(344,10,'Account Status Update','Your account access with Next gen Supplies (PVT)LTD has been blocked.',0,'2026-08-27 19:46:20','2026-08-27 19:46:20'),(345,10,'Account Status Update','Your registration/account has been approved.',0,'2026-08-27 19:46:26','2026-08-27 19:46:26'),(346,2,'New Order Received','Order #88 placed. Total: LKR 684',1,'2026-08-31 08:13:23','2026-08-31 08:17:27'),(347,2,'Order Confirmed by Retailer','Retailer has locked order #88 for processing.',1,'2026-08-31 08:13:40','2026-08-31 08:17:27'),(348,3,'Order Approved','Your order #88 has been approved.',1,'2026-08-31 08:16:22','2026-08-31 09:12:53'),(349,3,'Order Delivered','Your order #88 has been delivered.',1,'2026-08-31 09:04:22','2026-08-31 09:12:53'),(350,2,'New Order Received','Order #89 placed. Total: LKR 684',1,'2026-08-31 09:13:01','2026-08-31 09:16:19'),(351,2,'Order Confirmed by Retailer','Retailer has locked order #89 for processing.',1,'2026-08-31 09:13:08','2026-08-31 09:16:19'),(352,3,'Order Approved','Your order #89 has been approved.',1,'2026-08-31 09:13:54','2026-08-31 14:01:37'),(353,3,'Delivery Returned','Your order #89 could not be delivered. Reason: Returned by customer',1,'2026-08-31 09:14:13','2026-08-31 14:01:37'),(354,2,'New Order Received','Order #91 placed. Total: LKR 684',1,'2026-08-31 14:02:45','2026-09-19 10:47:09');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_item_id`),
  KEY `idx_orderitems_order` (`order_id`),
  KEY `idx_orderitems_product` (`product_id`),
  CONSTRAINT `fk_orderitems_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitems_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,11,5,200.00,1000.00,'2026-07-13 14:44:13'),(3,3,14,10,190.00,1900.00,'2026-07-13 15:11:22'),(4,3,18,5,120.00,600.00,'2026-07-13 15:11:22'),(7,6,18,5,120.00,600.00,'2026-07-13 15:26:03'),(8,7,11,5,200.00,1000.00,'2026-07-13 15:46:24'),(9,8,11,3,200.00,600.00,'2026-07-13 16:06:09'),(11,10,10,10,100.00,1000.00,'2026-07-13 16:15:20'),(12,11,11,6,200.00,1200.00,'2026-07-13 16:41:43'),(13,12,14,5,190.00,950.00,'2026-07-13 16:48:41'),(14,13,11,2,200.00,400.00,'2026-07-13 17:01:25'),(15,14,11,5,200.00,1000.00,'2026-07-13 17:45:05'),(16,15,11,4,200.00,800.00,'2026-07-13 17:50:41'),(17,16,7,28,55.00,1540.00,'2026-07-13 19:35:46'),(18,17,11,10,200.00,2000.00,'2026-07-13 19:37:29'),(19,18,18,4,120.00,480.00,'2026-07-14 05:15:41'),(20,19,11,11,200.00,2200.00,'2026-07-17 09:23:50'),(21,20,11,10,200.00,1900.00,'2026-07-17 09:38:52'),(22,21,18,24,159.99,3647.77,'2026-07-24 12:55:51'),(23,22,1,8,110.00,836.00,'2026-07-26 06:43:43'),(24,22,7,16,55.00,836.00,'2026-07-26 06:43:43'),(25,23,18,8,159.99,1215.92,'2026-07-29 08:24:51'),(26,24,18,16,159.99,2431.85,'2026-07-29 08:30:56'),(27,25,10,16,90.00,1368.00,'2026-07-29 08:32:25'),(28,26,10,8,90.00,684.00,'2026-08-01 10:22:34'),(29,26,18,8,130.00,988.00,'2026-08-01 10:22:34'),(30,27,18,8,130.00,988.00,'2026-08-01 12:35:49'),(31,27,11,8,240.00,1824.00,'2026-08-01 12:35:49'),(32,28,17,8,300.00,2280.00,'2026-08-01 12:39:27'),(33,28,21,8,179.99,1367.92,'2026-08-01 12:39:28'),(34,28,12,8,129.97,987.77,'2026-08-01 12:39:28'),(35,29,1,2,110.00,220.00,'2026-08-08 06:04:16'),(36,30,1,2,110.00,220.00,'2026-08-08 06:04:34'),(37,31,16,16,160.00,2432.00,'2026-08-08 06:06:15'),(38,32,16,16,160.00,2432.00,'2026-08-08 06:06:29'),(39,33,10,16,90.00,1368.00,'2026-08-08 06:07:19'),(40,34,10,16,90.00,1368.00,'2026-08-08 06:10:02'),(41,35,1,1,110.00,110.00,'2026-08-08 06:11:27'),(42,36,1,1,110.00,110.00,'2026-08-08 06:12:54'),(43,37,1,1,110.00,110.00,'2026-08-08 06:18:23'),(44,38,11,8,240.00,1824.00,'2026-08-08 06:32:49'),(45,39,16,8,160.00,1216.00,'2026-08-08 07:04:36'),(48,42,10,8,90.00,684.00,'2026-08-08 07:25:58'),(49,43,6,8,480.00,3648.00,'2026-08-08 07:31:21'),(50,44,10,8,90.00,684.00,'2026-08-09 18:54:10'),(51,45,18,64,130.00,7072.00,'2026-08-11 18:02:52'),(52,46,18,8,130.00,988.00,'2026-08-11 18:26:16'),(53,47,18,32,159.99,4607.71,'2026-08-11 18:26:41'),(54,48,16,8,160.00,1216.00,'2026-08-11 18:28:18'),(55,49,18,32,130.00,3744.00,'2026-08-11 18:34:51'),(56,50,18,8,130.00,988.00,'2026-08-13 16:41:47'),(57,51,18,8,159.99,1215.92,'2026-08-13 16:42:55'),(58,52,16,8,160.00,1216.00,'2026-08-13 16:45:58'),(63,57,13,8,499.99,3799.92,'2026-08-13 17:10:09'),(64,58,18,16,130.00,1976.00,'2026-08-13 17:11:22'),(65,59,18,8,130.00,988.00,'2026-08-13 17:46:25'),(66,60,21,8,179.99,1367.92,'2026-08-13 17:53:35'),(67,61,13,8,499.99,3799.92,'2026-08-13 17:54:57'),(68,62,13,8,499.99,3799.92,'2026-08-13 17:55:19'),(70,64,18,8,159.99,1215.92,'2026-08-13 17:57:33'),(72,66,18,40,159.99,5759.64,'2026-08-13 18:01:32'),(73,67,18,40,159.99,5759.64,'2026-08-13 18:01:53'),(74,68,18,40,159.99,5759.64,'2026-08-13 18:02:08'),(75,69,12,8,129.97,987.77,'2026-08-13 18:09:49'),(79,73,13,40,499.99,17999.64,'2026-08-13 18:14:58'),(80,74,18,16,159.99,2431.85,'2026-08-14 03:34:42'),(81,75,18,48,130.00,5616.00,'2026-08-14 08:39:17'),(82,76,10,56,90.00,4284.00,'2026-08-16 15:11:52'),(83,77,18,8,130.00,988.00,'2026-08-16 15:19:32'),(84,78,1,152,110.00,14212.00,'2026-08-16 15:26:50'),(85,79,6,48,480.00,20736.00,'2026-08-16 16:17:17'),(86,80,10,8,90.00,684.00,'2026-08-16 18:53:51'),(87,81,10,8,90.00,684.00,'2026-08-20 18:08:47'),(88,82,10,8,90.00,684.00,'2026-08-24 09:15:15'),(92,85,10,8,90.00,684.00,'2026-08-24 18:32:51'),(93,86,18,40,130.00,4680.00,'2026-08-24 19:22:13'),(94,87,18,8,159.99,1215.92,'2026-08-24 19:22:53'),(95,88,10,8,90.00,684.00,'2026-08-31 08:13:23'),(96,89,10,8,90.00,684.00,'2026-08-31 09:13:00');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `retailer_id` int NOT NULL,
  `distributor_id` int NOT NULL,
  `order_type` enum('Normal','Urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Normal',
  `status` enum('Pending','Approved','Processing','Delivered','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `total_amount` decimal(12,2) DEFAULT NULL,
  `payment_method` enum('Cash','Credit','Cash_Credit','Online','Online_Credit') COLLATE utf8mb4_unicode_ci DEFAULT 'Cash',
  `payment_status` enum('Unpaid','Pending_Gateway','Paid','Failed','Refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'Unpaid',
  `credit_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `cash_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `outstanding_credit` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `idx_orders_retailer` (`retailer_id`),
  KEY `idx_orders_distributor` (`distributor_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_created` (`created_at`),
  CONSTRAINT `fk_orders_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_orders_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailer` (`retailer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,'Normal','Delivered',1000.00,'Credit','Unpaid',1000.00,0.00,0.00,'2026-07-13 14:44:13','2026-07-13 15:03:53'),(3,1,1,'Normal','Delivered',2500.00,'Credit','Unpaid',2500.00,0.00,0.00,'2026-07-13 15:11:22','2026-07-13 15:17:40'),(6,1,1,'Normal','Delivered',600.00,'Cash','Unpaid',0.00,600.00,2500.00,'2026-07-13 15:26:03','2026-07-13 15:41:50'),(7,1,1,'Normal','Delivered',1000.00,'Cash','Unpaid',0.00,1000.00,0.00,'2026-07-13 15:46:24','2026-07-13 15:47:09'),(8,1,1,'Normal','Delivered',600.00,'Credit','Unpaid',600.00,0.00,0.00,'2026-07-13 16:06:09','2026-07-13 16:11:06'),(10,1,1,'Normal','Delivered',1000.00,'Credit','Unpaid',1000.00,0.00,0.00,'2026-07-13 16:15:20','2026-07-13 16:16:00'),(11,1,1,'Normal','Delivered',1200.00,'Credit','Unpaid',1200.00,0.00,2600.00,'2026-07-13 16:41:43','2026-07-13 16:42:21'),(12,1,1,'Normal','Delivered',950.00,'Cash','Unpaid',0.00,950.00,1200.00,'2026-07-13 16:48:41','2026-07-13 16:50:26'),(13,1,1,'Normal','Delivered',400.00,'Cash','Unpaid',0.00,400.00,0.00,'2026-07-13 17:01:25','2026-07-13 17:46:54'),(14,1,1,'Normal','Delivered',1000.00,'Credit','Unpaid',1000.00,0.00,0.00,'2026-07-13 17:45:05','2026-07-13 17:46:57'),(15,1,1,'Normal','Delivered',800.00,'Cash','Unpaid',0.00,800.00,1000.00,'2026-07-13 17:50:41','2026-07-13 17:54:20'),(16,1,1,'Normal','Delivered',1540.00,'Cash','Unpaid',0.00,1540.00,0.00,'2026-07-13 19:35:46','2026-07-14 05:18:44'),(17,1,1,'Normal','Delivered',2000.00,'Cash','Unpaid',0.00,2000.00,0.00,'2026-07-13 19:37:29','2026-07-14 05:18:40'),(18,1,1,'Normal','Delivered',480.00,'Cash','Unpaid',0.00,480.00,0.00,'2026-07-14 05:15:41','2026-07-17 09:22:57'),(19,1,1,'Normal','Rejected',2200.00,'Cash','Unpaid',0.00,2200.00,0.00,'2026-07-17 09:23:50','2026-07-17 09:39:18'),(20,1,1,'Normal','Delivered',1900.00,'Cash','Unpaid',0.00,1900.00,0.00,'2026-07-17 09:38:52','2026-07-17 09:39:32'),(21,1,1,'Normal','Delivered',3647.77,'Cash','Unpaid',0.00,3647.77,0.00,'2026-07-24 12:55:51','2026-07-29 08:34:35'),(22,1,1,'Normal','Delivered',1672.00,'Cash','Unpaid',0.00,1672.00,0.00,'2026-07-26 06:43:43','2026-07-29 08:34:37'),(23,1,3,'Normal','Approved',1215.92,'Credit','Unpaid',1215.92,0.00,0.00,'2026-07-29 08:24:51','2026-07-29 08:25:42'),(24,1,3,'Normal','Approved',2431.85,'Credit','Unpaid',2431.85,0.00,0.00,'2026-07-29 08:30:56','2026-07-29 08:32:59'),(25,1,1,'Normal','Delivered',1368.00,'Credit','Unpaid',1368.00,0.00,0.00,'2026-07-29 08:32:25','2026-07-29 08:34:55'),(26,1,1,'Normal','Delivered',1672.00,'Cash','Unpaid',0.00,1672.00,1368.00,'2026-08-01 10:22:34','2026-08-01 10:31:40'),(27,1,1,'Normal','Delivered',2812.00,'Cash','Unpaid',0.00,2812.00,-1368.00,'2026-08-01 12:35:49','2026-08-08 06:27:43'),(28,1,1,'Normal','Delivered',4635.69,'Cash','Unpaid',0.00,4635.69,-1368.00,'2026-08-01 12:39:27','2026-08-08 06:27:48'),(29,1,1,'Normal','Rejected',220.00,'Online','Pending_Gateway',0.00,0.00,-1368.00,'2026-08-08 06:04:16','2026-08-08 06:29:25'),(30,1,1,'Normal','Rejected',220.00,'Online','Paid',0.00,0.00,-1368.00,'2026-08-08 06:04:34','2026-08-08 06:29:26'),(31,1,1,'Normal','Rejected',2432.00,'Online','Pending_Gateway',0.00,0.00,-1368.00,'2026-08-08 06:06:14','2026-08-08 06:22:50'),(32,1,1,'Normal','Rejected',2432.00,'Online','Pending_Gateway',0.00,0.00,-1368.00,'2026-08-08 06:06:28','2026-08-08 06:29:27'),(33,1,1,'Normal','Rejected',1368.00,'Online','Pending_Gateway',0.00,0.00,-1368.00,'2026-08-08 06:07:19','2026-08-08 06:29:45'),(34,1,1,'Normal','Rejected',1368.00,'Online','Paid',0.00,0.00,-1368.00,'2026-08-08 06:10:02','2026-08-08 06:29:45'),(35,1,1,'Normal','Delivered',110.00,'Online','Pending_Gateway',0.00,0.00,-1368.00,'2026-08-08 06:11:27','2026-08-08 06:27:53'),(36,1,1,'Normal','Rejected',110.00,'Online','Paid',0.00,0.00,-1368.00,'2026-08-08 06:12:53','2026-08-08 06:29:46'),(37,1,1,'Normal','Rejected',110.00,'Online','Paid',0.00,0.00,-1368.00,'2026-08-08 06:18:22','2026-08-08 06:29:47'),(38,1,1,'Normal','Delivered',1824.00,'Online','Paid',0.00,0.00,-1368.00,'2026-08-08 06:32:49','2026-08-08 06:37:29'),(39,1,1,'Normal','Delivered',1216.00,'Cash','Unpaid',0.00,1216.00,0.00,'2026-08-08 07:04:35','2026-08-16 18:24:16'),(42,1,1,'Normal','Delivered',684.00,'Online','Paid',0.00,0.00,0.00,'2026-08-08 07:25:57','2026-08-16 18:24:17'),(43,1,1,'Normal','Rejected',3648.00,'Online','Paid',0.00,0.00,0.00,'2026-08-08 07:31:21','2026-08-16 18:22:17'),(44,1,1,'Normal','Rejected',684.00,'Online','Paid',0.00,0.00,0.00,'2026-08-09 18:54:09','2026-08-16 18:22:17'),(45,1,1,'Normal','Rejected',7072.00,'Online','Paid',0.00,0.00,0.00,'2026-08-11 18:02:52','2026-08-16 18:22:18'),(46,1,1,'Normal','Rejected',988.00,'Credit','Unpaid',988.00,0.00,0.00,'2026-08-11 18:26:15','2026-08-16 18:22:18'),(47,1,3,'Normal','Rejected',4607.71,'Cash_Credit','Unpaid',2599.00,2008.71,0.00,'2026-08-11 18:26:41','2026-08-16 18:04:56'),(48,1,1,'Normal','Delivered',1216.00,'Cash','Unpaid',0.00,1216.00,0.00,'2026-08-11 18:28:18','2026-08-16 18:24:18'),(49,1,1,'Normal','Rejected',3744.00,'Cash','Unpaid',0.00,3744.00,0.00,'2026-08-11 18:34:51','2026-08-16 18:18:43'),(50,1,1,'Normal','Rejected',988.00,'Online','Pending_Gateway',0.00,0.00,0.00,'2026-08-13 16:41:47','2026-08-16 18:19:19'),(51,1,3,'Normal','Rejected',1215.92,'Online','Pending_Gateway',0.00,0.00,0.00,'2026-08-13 16:42:55','2026-08-16 18:05:19'),(52,1,1,'Normal','Rejected',1216.00,'Cash_Credit','Unpaid',1000.00,216.00,0.00,'2026-08-13 16:45:58','2026-08-16 18:17:12'),(57,1,1,'Normal','Rejected',3799.92,'Online','Paid',0.00,0.00,0.00,'2026-08-13 17:10:08','2026-08-16 18:19:21'),(58,1,1,'Normal','Delivered',1976.00,'Online','Paid',0.00,0.00,0.00,'2026-08-13 17:11:22','2026-08-16 18:24:11'),(59,1,1,'Normal','Delivered',988.00,'Online','Paid',0.00,0.00,0.00,'2026-08-13 17:46:25','2026-08-16 18:24:11'),(60,1,1,'Normal','Delivered',1367.92,'Online','Paid',0.00,0.00,0.00,'2026-08-13 17:53:34','2026-08-16 18:24:12'),(61,1,1,'Normal','Delivered',3799.92,'Online','Pending_Gateway',0.00,0.00,0.00,'2026-08-13 17:54:57','2026-08-16 18:23:49'),(62,1,1,'Normal','Rejected',3799.92,'Online','Pending_Gateway',0.00,0.00,0.00,'2026-08-13 17:55:19','2026-08-16 18:16:31'),(64,1,3,'Normal','Approved',1215.92,'Online','Paid',0.00,0.00,0.00,'2026-08-13 17:57:32','2026-08-16 18:06:00'),(66,1,3,'Normal','Approved',5759.64,'Online','Pending_Gateway',0.00,0.00,0.00,'2026-08-13 18:01:31','2026-08-16 18:06:11'),(67,1,3,'Normal','Approved',5759.64,'Online','Pending_Gateway',0.00,0.00,0.00,'2026-08-13 18:01:53','2026-08-16 18:06:23'),(68,1,3,'Normal','Rejected',5759.64,'Online','Paid',0.00,0.00,0.00,'2026-08-13 18:02:08','2026-08-16 18:06:43'),(69,1,1,'Normal','Delivered',987.77,'Online','Paid',0.00,0.00,0.00,'2026-08-13 18:09:49','2026-08-16 18:16:29'),(73,1,1,'Normal','Rejected',17999.64,'Online','Paid',0.00,0.00,0.00,'2026-08-13 18:14:58','2026-08-16 18:15:04'),(74,1,3,'Normal','Rejected',2431.85,'Online','Paid',0.00,0.00,0.00,'2026-08-14 03:34:41','2026-08-16 18:06:53'),(75,1,1,'Normal','Rejected',5616.00,'Online','Paid',0.00,0.00,0.00,'2026-08-14 08:39:17','2026-08-16 18:12:39'),(76,1,1,'Normal','Delivered',4284.00,'Credit','Unpaid',4284.00,0.00,0.00,'2026-08-16 15:11:52','2026-08-16 18:08:36'),(77,1,1,'Normal','Delivered',988.00,'Cash','Unpaid',0.00,988.00,0.00,'2026-08-16 15:19:32','2026-08-16 15:56:38'),(78,1,1,'Normal','Rejected',14212.00,'Credit','Unpaid',14212.00,0.00,0.00,'2026-08-16 15:26:50','2026-08-16 18:08:30'),(79,3,1,'Normal','Delivered',20736.00,'Cash','Unpaid',0.00,20736.00,0.00,'2026-08-16 16:17:17','2026-08-16 16:37:01'),(80,1,1,'Urgent','Delivered',1184.00,'Cash_Credit','Unpaid',500.00,684.00,4284.00,'2026-08-16 18:53:51','2026-08-16 18:58:35'),(81,3,1,'Urgent','Delivered',1184.00,'Cash_Credit','Unpaid',1000.00,184.00,0.00,'2026-08-20 18:08:47','2026-08-24 09:30:36'),(82,1,1,'Normal','Rejected',684.00,'Cash','Unpaid',0.00,684.00,500.00,'2026-08-24 09:15:14','2026-08-24 09:26:47'),(85,1,1,'Normal','Delivered',684.00,'Credit','Unpaid',684.00,0.00,0.00,'2026-08-24 18:32:51','2026-08-24 18:35:42'),(86,1,1,'Normal','Delivered',4680.00,'Credit','Unpaid',4680.00,0.00,0.00,'2026-08-24 19:22:12','2026-08-24 19:26:48'),(87,1,3,'Normal','Approved',1215.92,'Credit','Unpaid',1215.92,0.00,0.00,'2026-08-24 19:22:52','2026-08-24 19:27:39'),(88,1,1,'Normal','Delivered',684.00,'Cash','Unpaid',0.00,684.00,4680.00,'2026-08-31 08:13:23','2026-08-31 09:04:21'),(89,1,1,'Normal','Rejected',684.00,'Cash','Unpaid',0.00,684.00,0.00,'2026-08-31 09:13:00','2026-08-31 09:14:12');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reset_email` (`email`),
  KEY `idx_reset_token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` VALUES (3,'admin.vendora@yopmail.com','87049e61192a4f58dbe0de5ff43bc4130aeba54c8fcb7a598779e3ec1f71d289','2026-08-26 23:09:02',1,'2026-08-26 17:24:03'),(4,'admin.vendora@yopmail.com','bf694d8569ec086c5880f46eec3edf8562e1607f8ecb495cedf8d41913648fdd','2026-09-19 16:39:58',1,'2026-09-19 10:54:58');
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `retailer_id` int NOT NULL,
  `distributor_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `payment_date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('Cash','Bank','Online','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_no` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `received_by` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `idx_payment_retailer` (`retailer_id`),
  KEY `idx_payment_distributor` (`distributor_id`),
  KEY `idx_payment_order` (`order_id`),
  KEY `idx_payment_date` (`payment_date`),
  KEY `fk_payment_received_by` (`received_by`),
  CONSTRAINT `fk_payment_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_payment_received_by` FOREIGN KEY (`received_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_payment_retailer` FOREIGN KEY (`retailer_id`) REFERENCES `retailer` (`retailer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,1,30,'2026-08-08',220.00,'Online','TEST_REF_123',3,'2026-08-08 06:04:37'),(2,1,1,36,'2026-08-08',110.00,'Online','PAY_REF_TEST',3,'2026-08-08 06:12:56'),(3,1,1,34,'2026-08-08',1368.00,'Online','PAY_REF_359818',3,'2026-08-08 06:13:23'),(4,1,1,37,'2026-08-08',110.00,'Online','PAY_REF_TEST',3,'2026-08-08 06:18:25'),(5,1,1,38,'2026-08-08',1824.00,'Online','PAY_REF_681085',3,'2026-08-08 06:33:00'),(6,1,1,42,'2026-08-08',684.00,'Online','PAY_REF_456694',3,'2026-08-08 07:26:05'),(7,1,1,43,'2026-08-08',3648.00,'Online','PAY_REF_882734',3,'2026-08-08 07:31:42'),(8,1,1,44,'2026-08-10',684.00,'Online','PAY_REF_922334',3,'2026-08-09 18:54:24'),(9,1,1,45,'2026-08-11',7072.00,'Online','PAY_REF_364916',3,'2026-08-11 18:03:07'),(10,1,1,57,'2026-08-13',3799.92,'Online','PAY_REF_498873',3,'2026-08-13 17:10:20'),(11,1,1,58,'2026-08-13',1976.00,'Online','PAY_REF_863177',3,'2026-08-13 17:11:56'),(12,1,1,59,'2026-08-13',988.00,'Online','PAY_REF_190127',3,'2026-08-13 17:46:32'),(13,1,1,60,'2026-08-13',1367.92,'Online','PAY_REF_214881',3,'2026-08-13 17:53:44'),(14,1,3,64,'2026-08-13',1215.92,'Online','PAY_REF_487535',3,'2026-08-13 17:57:42'),(15,1,3,68,'2026-08-13',5759.64,'Online','PAY_REF_769266',3,'2026-08-13 18:02:16'),(16,1,1,69,'2026-08-13',987.77,'Online','PAY_REF_211680',3,'2026-08-13 18:09:55'),(17,1,1,73,'2026-08-13',17999.64,'Online','PAY_REF_784518',3,'2026-08-13 18:15:06'),(18,1,3,74,'2026-08-14',2431.85,'Online','PAY_REF_388817',3,'2026-08-14 03:35:25'),(19,1,3,74,'2026-08-14',2431.85,'Online','PAY_REF_688430',3,'2026-08-14 03:36:49'),(20,1,3,74,'2026-08-14',2431.85,'Online','PAY_REF_761185',3,'2026-08-14 03:37:10'),(21,1,1,75,'2026-08-14',5616.00,'Online','PAY_REF_686581',3,'2026-08-14 08:39:27'),(22,1,1,NULL,'2026-08-24',500.00,'Online','TEST_GATEWAY_REF_123',3,'2026-08-24 18:24:40'),(23,3,1,NULL,'2026-08-24',1000.00,'Online','TEST_GATEWAY_REF_123',8,'2026-08-24 18:25:16'),(24,1,1,NULL,'2026-08-25',684.00,'Online','PAY_REF_953169',3,'2026-08-24 18:37:19');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `product_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `idx_product_category` (`category_id`),
  KEY `idx_product_name` (`product_name`),
  KEY `idx_product_status` (`status`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'Munchee Super Cream Cracker 190g','Perfect crispy cream crackers','190g','prod_6a54c9c36b26e4.13593588.jpg','Active','2026-07-13 09:49:18','2026-07-22 11:39:48'),(2,2,'Munchee lite Marie 80g','Classic tea time Marie biscuits','80g','prod_6a54e5841727c1.97962687.jpg','Active','2026-07-13 09:49:18','2026-07-22 11:39:40'),(3,2,'Munchee Lite marie 200g','Creamy tangy lemon puff biscuits','200g','prod_6a54e62e40e927.40874654.jpg','Active','2026-07-13 09:49:18','2026-07-22 11:39:30'),(4,7,'Munchee Nice 100g','A premium selection of sweet biscuits','100g','prod_6a54d0925c3c13.45148183.jpg','Active','2026-07-13 09:49:18','2026-07-13 11:48:34'),(5,5,'Munchee Chocolate Chip Cookies 100g','Rich chocolate chips baked to perfection','100g','prod_6a54c5a116d450.67866384.jpg','Active','2026-07-13 09:49:18','2026-07-22 11:39:19'),(6,6,'Munchee Biscuit Assortment 400g','A premium selection of sweet biscuits','400g','prod_6a54c447c584e0.17048571.jpg','Active','2026-07-13 09:49:18','2026-07-22 11:39:07'),(7,7,'Munchee Nice Biscuit 400g','Sweet coconut shorties biscuits','400g','prod_6a54d128b70de3.85133595.jpg','Active','2026-07-13 09:49:18','2026-07-13 11:51:04'),(8,6,'Munchee Favourites 250g','A premium selection of sweet biscuits','250 g','prod_6a54c5638f08d1.09960869.jpg','Active','2026-07-13 11:00:51','2026-07-22 11:38:57'),(9,5,'Choc Shock cookie 90g','Rich chocolate chips baked to perfection','90g','prod_6a54c661775404.23071756.jpg','Active','2026-07-13 11:05:05','2026-07-22 11:38:46'),(10,5,'Hawaian Cookies 100g','Features a blend of rich coconut and subtle tropical fruit','100g','prod_6a54c71a209ab3.75553932.jpg','Active','2026-07-13 11:08:10','2026-07-22 11:38:37'),(11,5,'Hawaian Cookies 200g','Features a blend of rich coconut and subtle tropical fruit','200g','prod_6a54c772ec3a10.02534379.jpg','Active','2026-07-13 11:09:38','2026-07-13 11:09:38'),(12,5,'Ginger Biscuit 90g','Baked with natural ginger extract','90g','prod_6a54c8da13ae91.30253512.jpg','Active','2026-07-13 11:15:38','2026-07-22 11:38:27'),(13,5,'Ginger Biscuits 400g','Baked with natural ginger extract','400g','prod_6a54c9192e65e6.27639092.jpg','Active','2026-07-13 11:16:41','2026-07-22 11:38:17'),(14,1,'Super Cream Cracker 250g','Perfect crispy cream crackers','250g','prod_6a54cb45927f26.42079687.jpg','Active','2026-07-13 11:25:57','2026-07-22 11:38:08'),(15,1,'Super Cream Cracker 500g','Perfect crispy cream crackers','500g','prod_6a54cc3c8f2300.98201961.jpg','Active','2026-07-13 11:30:04','2026-07-13 11:30:04'),(16,1,'Cheese Cracker 100g','A savory,baked snack crafted by blending butter and real cheese','100g','prod_6a54ccd9739c19.67892137.jpg','Active','2026-07-13 11:32:41','2026-07-22 11:37:57'),(17,1,'Cheese Cracker 200g','A savory,baked snack crafted by blending butter and real cheese','200g','prod_6a54ccfe0b8dc5.86138609.jpg','Active','2026-07-13 11:33:18','2026-07-22 11:37:48'),(18,1,'Bran Cracker 100g','A savory,baked snack crafted by blending butter and real cheese','100g','prod_6a54cd27738e07.68819299.jpg','Active','2026-07-13 11:33:59','2026-07-22 11:37:34'),(19,1,'Potato Cracker 90g','Thin savory biscuits made from real potato starch','90g','prod_6a54cdadba97c5.12250881.jpg','Active','2026-07-13 11:36:13','2026-07-22 11:37:15'),(20,1,'Tifin Original 90g','Perfect crispy cream crackers','90g','prod_6a54cdf0413848.86356769.jpg','Active','2026-07-13 11:37:20','2026-07-22 11:37:02'),(21,4,'Chocolate Cream Wafers 85g','Biscuit with a difference which gives you a soft crispy bites','85g','prod_6a54ced173add1.61104181.jpg','Active','2026-07-13 11:41:05','2026-07-13 11:41:05'),(22,4,'vanilla Cream Wafers 85g','Biscuit with a difference which gives you a soft crispy bites','85g','prod_6a54cf12df5ea4.10086952.jpg','Active','2026-07-13 11:42:10','2026-07-13 11:42:10'),(23,4,'vanilla cream wafers 400g','Biscuit with a difference which gives you a soft crispy bites','400g','prod_6a54cf6099a464.37621923.jpg','Active','2026-07-13 11:43:28','2026-07-13 11:43:28'),(24,7,'T Crunch Biscuits 100g','Sweet coconut shorties biscuits','100g','prod_6a54cfb0abadb1.62120985.jpg','Active','2026-07-13 11:44:48','2026-07-22 11:36:38'),(25,7,'Milk Short Cake 95g','Sweet coconut shorties biscuits','95g','prod_6a54cfe0520eb1.64608393.jpg','Active','2026-07-13 11:45:36','2026-07-13 11:45:36'),(26,7,'Milk Short Cake 200g','Sweet coconut shorties biscuits','200g','prod_6a54d013a86ab4.15017168.jpg','Active','2026-07-13 11:46:27','2026-07-13 11:46:27'),(27,2,'Tikiri marie 380g','A premium selection of sweet biscuits','380g','prod_6a54e6da2b3a60.92939647.jpg','Active','2026-07-13 13:23:38','2026-07-13 13:23:38'),(28,5,'Munchee Lemon Puff 400g','Perfect crispy cream crackers','400g','prod_6a9539f2f40696.50056830.jpg','Inactive','2026-07-14 05:19:46','2026-09-19 10:45:17');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,'crackers','Crispy crackers and salted biscuits','2026-07-13 09:49:18'),(2,'marie','Classic Marie biscuits','2026-07-13 09:49:18'),(3,'creambiscuits','Sweet cream-filled sandwich biscuits','2026-07-13 09:49:18'),(4,'wafers','Crisp wafer layers with sweet cream','2026-07-13 09:49:18'),(5,'cookies','Delicious baked chocolate chip cookies','2026-07-13 09:57:24'),(6,'gift assortments','Premium biscuit gift selections','2026-07-13 09:49:18'),(7,'shorties','Rich coconut and butter shorties','2026-07-13 09:49:18');
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_pricing`
--

DROP TABLE IF EXISTS `product_pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_pricing` (
  `pricing_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `mrp_max_retail_price` decimal(10,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pricing_id`),
  KEY `idx_pricing_product` (`product_id`),
  KEY `idx_pricing_from` (`effective_from`),
  KEY `idx_pricing_to` (`effective_to`),
  CONSTRAINT `fk_pricing_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_pricing`
--

LOCK TABLES `product_pricing` WRITE;
/*!40000 ALTER TABLE `product_pricing` DISABLE KEYS */;
INSERT INTO `product_pricing` VALUES (1,1,100.00,140.00,'2026-01-01','2026-07-13','2026-07-13 09:49:18','2026-07-13 11:19:31'),(2,2,40.00,60.00,'2026-01-01','2026-07-13','2026-07-13 09:49:18','2026-07-13 13:17:56'),(3,3,80.00,110.00,'2026-01-01','2026-07-13','2026-07-13 09:49:18','2026-07-13 13:20:46'),(4,4,70.00,95.00,'2026-01-01','2026-07-13','2026-07-13 09:49:18','2026-07-13 11:48:34'),(5,5,120.00,160.00,'2026-01-01','2026-07-13','2026-07-13 09:49:18','2026-07-13 11:01:53'),(6,6,450.00,600.00,'2026-01-01','2026-07-13','2026-07-13 09:49:18','2026-07-13 10:51:43'),(7,7,50.00,75.00,'2026-01-01','2026-07-13','2026-07-13 09:49:18','2026-07-13 11:51:04'),(8,6,450.00,600.00,'2026-07-13','2026-07-13','2026-07-13 10:51:43','2026-07-13 10:56:07'),(9,6,450.00,600.00,'2026-07-13','2026-07-22','2026-07-13 10:56:07','2026-07-22 11:39:07'),(10,8,400.00,600.00,'2026-07-13','2026-07-22','2026-07-13 11:00:51','2026-07-22 11:38:57'),(11,5,120.00,160.00,'2026-07-13','2026-07-22','2026-07-13 11:01:53','2026-07-22 11:39:19'),(12,9,279.99,320.00,'2026-07-13','2026-07-22','2026-07-13 11:05:05','2026-07-22 11:38:46'),(13,10,100.00,130.00,'2026-07-13','2026-07-22','2026-07-13 11:08:10','2026-07-22 11:38:37'),(14,11,200.00,240.00,'2026-07-13',NULL,'2026-07-13 11:09:38','2026-07-13 11:09:38'),(15,12,100.00,129.97,'2026-07-13','2026-07-22','2026-07-13 11:15:38','2026-07-22 11:38:27'),(16,13,400.00,499.99,'2026-07-13','2026-07-22','2026-07-13 11:16:41','2026-07-22 11:38:17'),(17,1,100.00,140.00,'2026-07-13','2026-07-22','2026-07-13 11:19:31','2026-07-22 11:39:48'),(18,14,190.00,230.00,'2026-07-13','2026-07-22','2026-07-13 11:25:57','2026-07-22 11:38:08'),(19,15,370.00,420.00,'2026-07-13',NULL,'2026-07-13 11:30:04','2026-07-13 11:30:04'),(20,16,120.00,160.00,'2026-07-13','2026-07-22','2026-07-13 11:32:41','2026-07-22 11:37:57'),(21,17,240.00,300.00,'2026-07-13','2026-07-22','2026-07-13 11:33:18','2026-07-22 11:37:48'),(22,18,120.00,159.99,'2026-07-13','2026-07-22','2026-07-13 11:33:59','2026-07-22 11:37:34'),(23,19,100.00,119.96,'2026-07-13','2026-07-22','2026-07-13 11:36:13','2026-07-22 11:37:15'),(24,20,130.00,160.00,'2026-07-13','2026-07-22','2026-07-13 11:37:20','2026-07-22 11:37:02'),(25,21,140.00,179.99,'2026-07-13',NULL,'2026-07-13 11:41:05','2026-07-13 11:41:05'),(26,22,140.00,179.99,'2026-07-13',NULL,'2026-07-13 11:42:10','2026-07-13 11:42:10'),(27,23,519.99,570.00,'2026-07-13',NULL,'2026-07-13 11:43:28','2026-07-13 11:43:28'),(28,24,120.00,139.98,'2026-07-13','2026-07-22','2026-07-13 11:44:48','2026-07-22 11:36:38'),(29,25,120.00,149.99,'2026-07-13',NULL,'2026-07-13 11:45:36','2026-07-13 11:45:36'),(30,26,170.00,219.99,'2026-07-13',NULL,'2026-07-13 11:46:27','2026-07-13 11:46:27'),(31,4,70.00,95.00,'2026-07-13',NULL,'2026-07-13 11:48:34','2026-07-13 11:48:34'),(32,7,260.00,300.00,'2026-07-13',NULL,'2026-07-13 11:51:04','2026-07-13 11:51:04'),(33,2,40.00,50.00,'2026-07-13','2026-07-22','2026-07-13 13:17:56','2026-07-22 11:39:40'),(34,3,80.00,110.00,'2026-07-13','2026-07-13','2026-07-13 13:20:46','2026-07-13 13:21:34'),(35,3,180.00,210.00,'2026-07-13','2026-07-22','2026-07-13 13:21:34','2026-07-22 11:39:30'),(36,27,240.00,259.79,'2026-07-13',NULL,'2026-07-13 13:23:38','2026-07-13 13:23:38'),(37,28,160.00,200.00,'2026-07-14','2026-07-22','2026-07-14 05:19:46','2026-07-22 11:36:21'),(38,28,160.00,200.00,'2026-07-22','2026-08-12','2026-07-22 11:36:21','2026-08-12 12:37:14'),(39,24,120.00,139.98,'2026-07-22',NULL,'2026-07-22 11:36:38','2026-07-22 11:36:38'),(40,20,130.00,160.00,'2026-07-22',NULL,'2026-07-22 11:37:02','2026-07-22 11:37:02'),(41,19,100.00,119.96,'2026-07-22',NULL,'2026-07-22 11:37:15','2026-07-22 11:37:15'),(42,18,120.00,159.99,'2026-07-22',NULL,'2026-07-22 11:37:34','2026-07-22 11:37:34'),(43,17,240.00,300.00,'2026-07-22',NULL,'2026-07-22 11:37:48','2026-07-22 11:37:48'),(44,16,120.00,160.00,'2026-07-22',NULL,'2026-07-22 11:37:57','2026-07-22 11:37:57'),(45,14,190.00,230.00,'2026-07-22',NULL,'2026-07-22 11:38:08','2026-07-22 11:38:08'),(46,13,400.00,499.99,'2026-07-22',NULL,'2026-07-22 11:38:17','2026-07-22 11:38:17'),(47,12,100.00,129.97,'2026-07-22',NULL,'2026-07-22 11:38:27','2026-07-22 11:38:27'),(48,10,100.00,130.00,'2026-07-22',NULL,'2026-07-22 11:38:37','2026-07-22 11:38:37'),(49,9,279.99,320.00,'2026-07-22',NULL,'2026-07-22 11:38:46','2026-07-22 11:38:46'),(50,8,400.00,600.00,'2026-07-22',NULL,'2026-07-22 11:38:57','2026-07-22 11:38:57'),(51,6,450.00,600.00,'2026-07-22',NULL,'2026-07-22 11:39:07','2026-07-22 11:39:07'),(52,5,120.00,160.00,'2026-07-22',NULL,'2026-07-22 11:39:19','2026-07-22 11:39:19'),(53,3,180.00,210.00,'2026-07-22',NULL,'2026-07-22 11:39:30','2026-07-22 11:39:30'),(54,2,40.00,50.00,'2026-07-22',NULL,'2026-07-22 11:39:40','2026-07-22 11:39:40'),(55,1,100.00,140.00,'2026-07-22',NULL,'2026-07-22 11:39:48','2026-07-22 11:39:48'),(56,28,260.00,200.00,'2026-08-12','2026-08-22','2026-08-12 12:37:15','2026-08-22 17:48:46'),(57,28,160.00,200.00,'2026-08-22','2026-08-22','2026-08-22 17:48:46','2026-08-22 17:49:01'),(58,28,160.00,200.00,'2026-08-22','2026-08-31','2026-08-22 17:49:02','2026-08-31 08:22:36'),(59,28,160.00,200.00,'2026-08-31','2026-08-31','2026-08-31 08:22:36','2026-08-31 08:23:16'),(60,28,160.00,200.00,'2026-08-31','2026-09-19','2026-08-31 08:23:17','2026-09-19 10:45:18'),(61,28,160.00,200.00,'2026-09-19',NULL,'2026-09-19 10:45:18','2026-09-19 10:45:18');
/*!40000 ALTER TABLE `product_pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `retailer`
--

DROP TABLE IF EXISTS `retailer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `retailer` (
  `retailer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `region_id` int NOT NULL,
  `shop_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shop_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `nic_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected','Blocked') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`retailer_id`),
  UNIQUE KEY `uq_retailer_user` (`user_id`),
  UNIQUE KEY `uq_retailer_nic` (`nic_number`),
  KEY `idx_retailer_status` (`status`),
  KEY `idx_retailer_region` (`region_id`),
  CONSTRAINT `fk_retailer_region` FOREIGN KEY (`region_id`) REFERENCES `distributor_region` (`region_id`),
  CONSTRAINT `fk_retailer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retailer`
--

LOCK TABLES `retailer` WRITE;
/*!40000 ALTER TABLE `retailer` DISABLE KEYS */;
INSERT INTO `retailer` VALUES (1,3,1,'Star Grocery Store','Mr. tharindu','456 Market Rd','Colombo',6.92707860,79.86124300,'NIC123456','0772222222','Approved','2026-07-13 09:49:19','2026-08-31 15:27:36'),(2,5,1,'Priyashan store','Dilii Priyashan','Ruwanwalla, Awissawella','Awissawella',NULL,NULL,'200220705227','+94763042721','Approved','2026-07-13 19:26:17','2026-07-22 18:02:20'),(3,8,1,'New Castle','Nimal Shantha','No.56/2,, New Moor Street','Colombo',6.93437200,79.84989900,'200220702752','+94715648223','Approved','2026-08-13 15:47:29','2026-08-24 17:23:21'),(4,10,1,'Test Supermarket','Mr. Test','123 Main St','Colombo',NULL,NULL,'199560278633','0797269664','Approved','2026-08-26 17:04:07','2026-08-27 19:46:08');
/*!40000 ALTER TABLE `retailer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uq_roles_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'SUPER_ADMIN','System Administrator with full access','2026-07-13 09:49:18'),(2,'DISTRIBUTOR','Distributor who manages orders and inventory','2026-07-13 09:49:18'),(3,'RETAILER','Retailer who places orders','2026-07-13 09:49:18'),(4,'DRIVER','Driver who handles deliveries','2026-07-13 09:49:18');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_transfer`
--

DROP TABLE IF EXISTS `stock_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_transfer` (
  `transfer_id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `distributor_id` int NOT NULL,
  `transfer_date` datetime NOT NULL,
  `status` enum('Pending','Approved','Dispatched','Received','Cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `approved_by` int DEFAULT NULL,
  `received_by` int DEFAULT NULL,
  `remarks` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transfer_id`),
  KEY `idx_transfer_request` (`request_id`),
  KEY `idx_transfer_distributor` (`distributor_id`),
  KEY `idx_transfer_status` (`status`),
  KEY `fk_transfer_approved_by` (`approved_by`),
  KEY `fk_transfer_received_by` (`received_by`),
  CONSTRAINT `fk_transfer_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_transfer_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`),
  CONSTRAINT `fk_transfer_received_by` FOREIGN KEY (`received_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_transfer_request` FOREIGN KEY (`request_id`) REFERENCES `supply_request` (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_transfer`
--

LOCK TABLES `stock_transfer` WRITE;
/*!40000 ALTER TABLE `stock_transfer` DISABLE KEYS */;
INSERT INTO `stock_transfer` VALUES (1,1,1,'2026-07-22 16:49:06','Approved',1,NULL,NULL,'2026-07-22 11:19:06','2026-07-22 11:19:06'),(2,2,1,'2026-07-22 16:49:13','Approved',1,NULL,NULL,'2026-07-22 11:19:13','2026-07-22 11:19:13'),(3,4,1,'2026-07-22 16:49:20','Approved',1,NULL,NULL,'2026-07-22 11:19:20','2026-07-22 11:19:20'),(4,5,1,'2026-07-22 17:04:19','Approved',1,NULL,NULL,'2026-07-22 11:34:19','2026-07-22 11:34:19'),(5,6,1,'2026-07-22 17:20:18','Approved',1,NULL,NULL,'2026-07-22 11:50:18','2026-07-22 11:50:18'),(6,7,1,'2026-07-22 23:15:57','Approved',1,NULL,NULL,'2026-07-22 17:45:57','2026-07-22 17:45:57'),(7,8,1,'2026-07-22 23:20:19','Approved',1,NULL,NULL,'2026-07-22 17:50:19','2026-07-22 17:50:19'),(8,9,1,'2026-07-22 23:35:48','Approved',1,NULL,NULL,'2026-07-22 18:05:48','2026-07-22 18:05:48'),(9,10,1,'2026-07-22 23:45:42','Approved',1,NULL,NULL,'2026-07-22 18:15:42','2026-07-22 18:15:42'),(10,11,3,'2026-07-29 13:53:22','Approved',1,NULL,NULL,'2026-07-29 08:23:22','2026-07-29 08:23:22'),(11,12,1,'2026-08-19 00:04:38','Approved',1,NULL,NULL,'2026-08-18 18:34:38','2026-08-18 18:34:38'),(12,13,1,'2026-08-24 13:11:22','Approved',1,NULL,NULL,'2026-08-24 07:41:22','2026-08-24 07:41:22'),(13,14,1,'2026-08-24 13:44:39','Approved',1,NULL,NULL,'2026-08-24 08:14:39','2026-08-24 08:14:39'),(14,15,1,'2026-08-24 14:41:41','Approved',1,NULL,NULL,'2026-08-24 09:11:41','2026-08-24 09:11:41'),(15,16,3,'2026-08-25 00:50:28','Approved',1,NULL,NULL,'2026-08-24 19:20:28','2026-08-24 19:20:28');
/*!40000 ALTER TABLE `stock_transfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_transfer_items`
--

DROP TABLE IF EXISTS `stock_transfer_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_transfer_items` (
  `transfer_item_id` int NOT NULL AUTO_INCREMENT,
  `transfer_id` int NOT NULL,
  `warehouse_batch_id` int NOT NULL,
  `product_id` int NOT NULL,
  `dispatched_qty` int NOT NULL,
  `cost_price` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transfer_item_id`),
  KEY `idx_sti_transfer` (`transfer_id`),
  KEY `idx_sti_warehouse_batch` (`warehouse_batch_id`),
  KEY `idx_sti_product` (`product_id`),
  CONSTRAINT `fk_sti_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `fk_sti_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `stock_transfer` (`transfer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sti_warehouse_batch` FOREIGN KEY (`warehouse_batch_id`) REFERENCES `warehouse_batch` (`batch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_transfer_items`
--

LOCK TABLES `stock_transfer_items` WRITE;
/*!40000 ALTER TABLE `stock_transfer_items` DISABLE KEYS */;
INSERT INTO `stock_transfer_items` VALUES (1,1,1,1,50,100.00,140.00,'2026-07-22 11:19:06'),(2,2,25,25,100,120.00,149.99,'2026-07-22 11:19:13'),(3,2,6,6,100,450.00,600.00,'2026-07-22 11:19:13'),(4,3,16,16,300,120.00,160.00,'2026-07-22 11:19:20'),(5,4,18,18,100,120.00,159.99,'2026-07-22 11:34:19'),(6,5,18,18,90,120.00,159.99,'2026-07-22 11:50:18'),(7,6,18,18,30,120.00,159.99,'2026-07-22 17:45:57'),(8,7,18,18,200,120.00,159.99,'2026-07-22 17:50:19'),(9,7,30,16,100,85.00,100.00,'2026-07-22 17:50:19'),(10,8,13,13,200,400.00,499.99,'2026-07-22 18:05:48'),(11,8,31,10,500,70.00,90.00,'2026-07-22 18:05:48'),(12,9,12,12,100,100.00,129.97,'2026-07-22 18:15:42'),(13,10,18,18,150,120.00,159.99,'2026-07-29 08:23:23'),(14,13,10,10,10,100.00,130.00,'2026-08-24 08:14:40'),(15,14,10,10,10,100.00,130.00,'2026-08-24 09:11:41'),(16,15,18,18,100,120.00,159.99,'2026-08-24 19:20:29');
/*!40000 ALTER TABLE `stock_transfer_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supply_request`
--

DROP TABLE IF EXISTS `supply_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supply_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `distributor_id` int NOT NULL,
  `request_date` date NOT NULL,
  `status` enum('Pending','Partially_Approved','Rejected','Received') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `remarks` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `idx_supplyreq_distributor` (`distributor_id`),
  KEY `idx_supplyreq_status` (`status`),
  KEY `idx_supplyreq_date` (`request_date`),
  CONSTRAINT `fk_supplyreq_distributor` FOREIGN KEY (`distributor_id`) REFERENCES `distributor` (`distributor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supply_request`
--

LOCK TABLES `supply_request` WRITE;
/*!40000 ALTER TABLE `supply_request` DISABLE KEYS */;
INSERT INTO `supply_request` VALUES (1,1,'2026-07-13','Received','','2026-07-13 14:11:26','2026-07-22 11:33:56'),(2,1,'2026-07-13','Received','','2026-07-13 14:11:46','2026-07-22 11:33:43'),(3,1,'2026-07-19','Rejected','','2026-07-19 12:31:02','2026-07-22 11:19:17'),(4,1,'2026-07-22','Received','','2026-07-22 11:12:10','2026-07-22 11:20:49'),(5,1,'2026-07-22','Received','','2026-07-22 11:33:16','2026-07-22 11:34:51'),(6,1,'2026-07-22','Received','','2026-07-22 11:49:44','2026-07-22 11:50:58'),(7,1,'2026-07-22','Received','','2026-07-22 17:45:41','2026-07-22 17:46:36'),(8,1,'2026-07-22','Received','','2026-07-22 17:47:24','2026-07-22 18:07:18'),(9,1,'2026-07-22','Received','','2026-07-22 18:03:54','2026-07-22 18:07:27'),(10,1,'2026-07-22','Received','','2026-07-22 18:08:23','2026-07-29 08:46:24'),(11,3,'2026-07-29','Received','','2026-07-29 08:22:55','2026-07-29 08:23:40'),(12,1,'2026-08-19','Received','','2026-08-18 18:33:32','2026-08-18 18:35:54'),(13,1,'2026-08-24','Received','','2026-08-24 07:39:32','2026-08-24 07:42:37'),(14,1,'2026-08-24','Received','','2026-08-24 08:11:55','2026-08-24 08:30:21'),(15,1,'2026-08-24','Received','','2026-08-24 09:10:48','2026-08-24 09:12:29'),(16,3,'2026-08-25','Received','','2026-08-24 19:19:47','2026-08-24 19:21:36');
/*!40000 ALTER TABLE `supply_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supply_request_items`
--

DROP TABLE IF EXISTS `supply_request_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supply_request_items` (
  `request_item_id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `product_id` int NOT NULL,
  `requested_qty` int NOT NULL,
  `approved_qty` int DEFAULT NULL,
  `remarks` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_item_id`),
  KEY `idx_supplyitems_request` (`request_id`),
  KEY `idx_supplyitems_product` (`product_id`),
  CONSTRAINT `fk_supplyitems_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `fk_supplyitems_request` FOREIGN KEY (`request_id`) REFERENCES `supply_request` (`request_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supply_request_items`
--

LOCK TABLES `supply_request_items` WRITE;
/*!40000 ALTER TABLE `supply_request_items` DISABLE KEYS */;
INSERT INTO `supply_request_items` VALUES (1,1,1,50,50,NULL,'2026-07-22 11:19:06'),(2,2,25,100,100,NULL,'2026-07-22 11:19:13'),(3,2,6,100,100,NULL,'2026-07-22 11:19:13'),(4,3,20,50,NULL,NULL,'2026-07-19 12:31:02'),(5,4,16,300,300,NULL,'2026-07-22 11:19:20'),(6,5,18,100,100,NULL,'2026-07-22 11:34:19'),(7,6,18,90,90,NULL,'2026-07-22 11:50:18'),(8,7,18,30,30,NULL,'2026-07-22 17:45:57'),(9,8,18,200,200,NULL,'2026-07-22 17:50:19'),(10,8,16,100,100,NULL,'2026-07-22 17:50:19'),(11,9,13,200,200,NULL,'2026-07-22 18:05:48'),(12,9,10,500,500,NULL,'2026-07-22 18:05:48'),(13,10,12,100,100,NULL,'2026-07-22 18:15:42'),(14,11,18,150,150,NULL,'2026-07-29 08:23:23'),(15,12,18,200,NULL,NULL,'2026-08-18 18:33:32'),(16,13,10,20,NULL,NULL,'2026-08-24 07:39:33'),(17,14,10,10,10,NULL,'2026-08-24 08:14:40'),(18,15,10,10,10,NULL,'2026-08-24 09:11:42'),(19,16,18,100,100,NULL,'2026-08-24 19:20:29');
/*!40000 ALTER TABLE `supply_request_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_phone` (`phone`),
  KEY `idx_users_role` (`role_id`),
  KEY `idx_users_active` (`is_active`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin.vendora@yopmail.com','0771234567',NULL,'$2y$10$3IPXLOk4RdlTvCSf9AYO/..QxugP5vrqQ4Iq6p1TtG8cDESE4s/a2',1,1,1,'2026-07-13 09:49:18','2026-09-19 10:58:03'),(2,'Golden Distributor','golden@distributor.com','0771111118',NULL,'624bb493061bfc379d7774f53a6e595378a1c59738196574c7e7422620516504',2,1,1,'2026-07-13 09:49:18','2026-08-26 18:24:05'),(3,'Star Retailer','star@retail.com','0772222222','avatar_6a959d4b4e90c4.53022227.png','7c8be7f4a4895b26fd4b9d54a1e6be9e14d8944a54352358c25dd2e33c0374fc',3,1,1,'2026-07-13 09:49:18','2026-08-31 15:27:07'),(4,'John Driver','john@driver.com','0773333333',NULL,'494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382',4,1,1,'2026-07-13 09:49:18','2026-08-26 18:24:05'),(5,'Dilii Priyashan','Dilii@retail.com','+94763042721',NULL,'$2y$10$9MTQ7dv7hi9yUE2QomQqMOCHqTkp6Y2kzfzCU9UaxqI6r8/326F82',3,1,1,'2026-07-13 19:26:17','2026-08-26 18:24:15'),(6,'Ajantha Silva','Ajantha@gmail.com','+94 245768411',NULL,'$2y$10$aOW88CMJlSzJJ28.1LcYuOmUUsav5TDHMM.nyIJn0YnMfn9EaDoWa',2,1,1,'2026-07-13 19:32:25','2026-08-26 18:24:15'),(7,'pasindu piumal','pasindu@gmail.com','+94764229802',NULL,'$2y$10$7yyvoOvrg8H8va6YNgg3hO230fX4CSszK4lTKxAExYR6oBfjZheG6',2,1,1,'2026-07-29 08:17:56','2026-08-26 18:24:15'),(8,'Nimal Shantha','Nimal@gmail.com','+94715648223',NULL,'$2y$10$zLuB28wQ4AnGPQsElU1lmeBaahj2aScZrTEuE.uq1cegzEQ3naIQS',3,1,1,'2026-08-13 15:47:29','2026-08-26 18:24:15'),(10,'Test Retailer','retailer_test_1787763846@example.com','0797269664',NULL,'$2y$10$QzQDJYaCnvgGmewx8m7by.Z1b5qXenUXOZhAdKNGCgv3xwmVKfMeS',3,1,1,'2026-08-26 17:04:06','2026-08-27 19:46:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse_batch`
--

DROP TABLE IF EXISTS `warehouse_batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse_batch` (
  `batch_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `batch_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `received_qty` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `cost_price` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `mfg_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('Active','Exhausted','Expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `received_at` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`batch_id`),
  UNIQUE KEY `uq_wh_batch_number` (`batch_number`),
  KEY `idx_whbatch_product` (`product_id`),
  KEY `idx_whbatch_status` (`status`),
  KEY `idx_whbatch_expiry` (`expiry_date`),
  CONSTRAINT `fk_whbatch_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse_batch`
--

LOCK TABLES `warehouse_batch` WRITE;
/*!40000 ALTER TABLE `warehouse_batch` DISABLE KEYS */;
INSERT INTO `warehouse_batch` VALUES (1,1,'WH-LEGACY-001',1000,950,100.00,140.00,NULL,'2027-06-30','Active','2026-07-13','2026-07-19 14:12:30','2026-07-22 11:19:06'),(2,2,'WH-LEGACY-002',1500,1500,40.00,50.00,NULL,'2027-08-15','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(3,3,'WH-LEGACY-003',800,800,180.00,210.00,NULL,'2027-09-01','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(4,4,'WH-LEGACY-004',1200,1200,70.00,95.00,NULL,'2027-12-31','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(5,5,'WH-LEGACY-005',600,600,120.00,160.00,NULL,'2027-11-20','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(6,6,'WH-LEGACY-006',300,200,450.00,600.00,NULL,'2027-10-10','Active','2026-07-13','2026-07-19 14:12:30','2026-07-22 11:19:13'),(7,7,'WH-LEGACY-007',2000,2000,260.00,300.00,NULL,'2028-01-15','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(8,8,'WH-LEGACY-008',290,290,400.00,600.00,NULL,'2027-02-18','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(9,9,'WH-LEGACY-009',150,150,279.99,320.00,NULL,'2027-02-23','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(10,10,'WH-LEGACY-010',20,0,100.00,130.00,NULL,'2027-02-28','Exhausted','2026-07-13','2026-07-19 14:12:30','2026-08-24 09:11:41'),(11,11,'WH-LEGACY-011',0,0,200.00,240.00,NULL,'2027-03-05','Exhausted','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(12,12,'WH-LEGACY-012',600,500,100.00,129.97,NULL,'2027-03-13','Active','2026-07-13','2026-07-19 14:12:30','2026-07-22 18:15:42'),(13,13,'WH-LEGACY-013',700,500,400.00,499.99,NULL,'2027-03-15','Active','2026-07-13','2026-07-19 14:12:30','2026-07-22 18:05:48'),(14,14,'WH-LEGACY-014',300,300,190.00,230.00,NULL,'2027-03-20','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(15,15,'WH-LEGACY-015',0,0,370.00,420.00,NULL,'2027-03-25','Exhausted','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(16,16,'WH-LEGACY-016',300,0,120.00,160.00,NULL,'2027-03-30','Exhausted','2026-07-13','2026-07-19 14:12:30','2026-07-22 11:19:20'),(17,17,'WH-LEGACY-017',150,150,240.00,300.00,NULL,'2028-01-03','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(18,18,'WH-LEGACY-018',600,200,120.00,159.99,NULL,'2028-01-14','Active','2026-07-13','2026-07-19 14:12:30','2026-08-24 19:20:29'),(19,19,'WH-LEGACY-019',0,0,100.00,119.96,NULL,'2027-04-14','Exhausted','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(20,20,'WH-LEGACY-020',10,10,130.00,160.00,NULL,'2027-04-19','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(21,21,'WH-LEGACY-021',400,400,140.00,179.99,NULL,'2027-04-24','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(22,22,'WH-LEGACY-022',560,560,140.00,179.99,NULL,'2027-04-29','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(23,23,'WH-LEGACY-023',400,400,519.99,570.00,NULL,'2027-05-04','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(24,24,'WH-LEGACY-024',600,600,120.00,139.98,NULL,'2027-05-09','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(25,25,'WH-LEGACY-025',670,570,120.00,149.99,NULL,'2027-05-14','Active','2026-07-13','2026-07-19 14:12:30','2026-07-22 11:19:13'),(26,26,'WH-LEGACY-026',500,500,170.00,219.99,NULL,'2027-05-19','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(27,27,'WH-LEGACY-027',240,240,240.00,259.79,NULL,'2027-05-24','Active','2026-07-13','2026-07-19 14:12:30','2026-07-19 14:12:30'),(28,28,'WH-LEGACY-028',0,0,160.00,200.00,NULL,NULL,'Exhausted','2026-07-14','2026-07-19 14:12:30','2026-07-19 14:12:30'),(29,1,'WH-202607-001',10,10,100.00,140.00,'2026-07-22','2027-07-22','Active','2026-07-22','2026-07-22 11:30:41','2026-07-22 11:30:41'),(30,16,'WH-202607-002',500,400,85.00,100.00,'2026-07-21','2026-07-23','Expired','2026-07-22','2026-07-22 17:50:10','2026-07-26 06:46:32'),(31,10,'WH-202607-003',500,0,70.00,90.00,'2026-07-20','2026-09-03','Exhausted','2026-07-23','2026-07-22 18:05:36','2026-07-22 18:05:48');
/*!40000 ALTER TABLE `warehouse_batch` ENABLE KEYS */;
UNLOCK TABLES;
-- SQL_LOG_BIN removed
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-20  9:28:37