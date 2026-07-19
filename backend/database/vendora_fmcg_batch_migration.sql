-- ============================================================
--  FMCG Vendora - Batch Inventory Migration Script
--  File   : vendora_fmcg_batch_migration.sql
--  Usage  : Run AFTER the new structure SQL has been applied
--           (warehouse_batch, distributor_batch, stock_transfer_items must exist)
--  Target : MySQL / MariaDB
-- ============================================================

USE `vendora_fmcg`;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- STEP 1: Migrate warehouse_stock → warehouse_batch
-- Creates one "Legacy Batch" per existing product stock row
-- ============================================================
INSERT INTO `warehouse_batch`
  (`product_id`, `batch_number`, `received_qty`, `quantity`,
   `cost_price`, `selling_price`, `expiry_date`, `status`, `received_at`)
SELECT
  ws.product_id,
  CONCAT('WH-LEGACY-', LPAD(ws.product_id, 3, '0')),
  ws.quantity,
  ws.quantity,
  -- cost_price: latest base_price from product_pricing
  COALESCE((
    SELECT pp.base_price
    FROM product_pricing pp
    WHERE pp.product_id = ws.product_id
    ORDER BY pp.effective_from DESC
    LIMIT 1
  ), 0.00),
  -- selling_price: latest MRP from product_pricing
  COALESCE((
    SELECT pp.mrp_max_retail_price
    FROM product_pricing pp
    WHERE pp.product_id = ws.product_id
    ORDER BY pp.effective_from DESC
    LIMIT 1
  ), 0.00),
  ws.expiry_date,
  IF(ws.quantity > 0, 'Active', 'Exhausted'),
  COALESCE(DATE(ws.created_at), CURDATE())
FROM `warehouse_stock` ws;

-- ============================================================
-- STEP 2: Migrate distributor_stock → distributor_batch
-- Creates one "Legacy Batch" per existing distributor-product row
-- ============================================================
INSERT INTO `distributor_batch`
  (`distributor_id`, `product_id`, `source_batch_id`, `batch_number`,
   `received_qty`, `quantity`, `cost_price`, `selling_price`,
   `status`, `received_at`)
SELECT
  ds.distributor_id,
  ds.product_id,
  -- link to matching legacy warehouse batch for traceability
  (SELECT wb.batch_id FROM warehouse_batch wb WHERE wb.product_id = ds.product_id LIMIT 1),
  CONCAT('DB-LEGACY-', ds.distributor_id, '-', LPAD(ds.product_id, 3, '0')),
  ds.quantity,
  ds.quantity,
  COALESCE(ds.unit_cost, 0.00),
  -- selling_price: latest distributor_pricing, fallback to product MRP
  COALESCE(
    (SELECT dp.price FROM distributor_pricing dp
     WHERE dp.distributor_id = ds.distributor_id AND dp.product_id = ds.product_id
     ORDER BY dp.effective_from DESC LIMIT 1),
    (SELECT pp.mrp_max_retail_price FROM product_pricing pp
     WHERE pp.product_id = ds.product_id ORDER BY pp.effective_from DESC LIMIT 1),
    0.00
  ),
  IF(ds.quantity > 0, 'Active', 'Exhausted'),
  COALESCE(DATE(ds.last_updated_at), CURDATE())
FROM `distributor_stock` ds;

-- ============================================================
-- VERIFICATION QUERIES
-- Run these to confirm migration row counts match before dropping old tables
-- ============================================================
-- SELECT 'warehouse_stock'  AS source, COUNT(*) AS rows FROM warehouse_stock
-- UNION ALL
-- SELECT 'warehouse_batch'  AS source, COUNT(*) AS rows FROM warehouse_batch
-- UNION ALL
-- SELECT 'distributor_stock' AS source, COUNT(*) AS rows FROM distributor_stock
-- UNION ALL
-- SELECT 'distributor_batch' AS source, COUNT(*) AS rows FROM distributor_batch;

-- ============================================================
-- STEP 3: DROP OLD TABLES
-- !! ONLY run after verifying migration row counts above !!
-- ============================================================
-- DROP TABLE IF EXISTS `distributor_pricing`;
-- DROP TABLE IF EXISTS `distributor_stock`;
-- DROP TABLE IF EXISTS `warehouse_stock`;

SET FOREIGN_KEY_CHECKS = 1;
-- ============================================================
-- End of migration script
-- ============================================================
