<?php
require_once __DIR__ . '/../../util/Database.php';

class AnalyticsController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function handle(): void {
        header('Content-Type: application/json');
        try {
            $range = $_GET['range'] ?? 'This Month';

            // 1. Total Platform Revenue & Order Stats (if orders table exists)
            $orderStats = ['total_revenue' => 0, 'total_orders' => 0];
            try {
                $stmt = $this->db->query("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue, COUNT(*) AS total_orders FROM orders");
                if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $orderStats = $row;
                }
            } catch (Exception $e) { /* fallback if table empty */ }

            // 2. Warehouse Stock Total & Value (warehouse_batch)
            $stockStats = ['total_stock_value' => 0, 'total_units' => 0];
            try {
                $stmt = $this->db->query("SELECT COALESCE(SUM(wb.quantity * wb.cost_price), 0) AS total_stock_value, COALESCE(SUM(wb.quantity), 0) AS total_units FROM warehouse_batch wb WHERE wb.status = 'Active'");
                if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $stockStats = $row;
                }
            } catch (Exception $e) { /* fallback */ }

            // 3. Supply Requests & Fulfillment Rate (supply_request)
            $supplyStats = ['total_requests' => 0, 'fulfilled_requests' => 0];
            try {
                $stmt = $this->db->query("SELECT COUNT(*) AS total_requests, SUM(CASE WHEN status IN ('Partially_Approved', 'Received') THEN 1 ELSE 0 END) AS fulfilled_requests FROM supply_request");
                if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $supplyStats = $row;
                }
            } catch (Exception $e) { /* fallback */ }

            $totalReqs = (int)($supplyStats['total_requests'] ?? 0);
            $fulfilledReqs = (int)($supplyStats['fulfilled_requests'] ?? 0);
            $fulfillmentRate = $totalReqs > 0 ? round(($fulfilledReqs / $totalReqs) * 100, 1) : 100.0;

            // 4. Active Distributors Count (distributor)
            $distributorStats = ['total_distributors' => 0];
            try {
                $stmt = $this->db->query("SELECT COUNT(*) AS total_distributors FROM distributor WHERE status = 'Approved'");
                if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $distributorStats = $row;
                }
            } catch (Exception $e) { /* fallback */ }

            // 5. Territory / Region Sales Breakdown (distributor_region)
            $territoryData = [];
            try {
                $stmt = $this->db->query("
                    SELECT 
                        dr.region_name,
                        COUNT(DISTINCT d.distributor_id) AS distributor_count,
                        COALESCE(SUM(o.total_amount), 0) AS revenue
                    FROM distributor_region dr
                    LEFT JOIN distributor d ON d.region_id = dr.region_id
                    LEFT JOIN orders o ON o.distributor_id = d.distributor_id
                    GROUP BY dr.region_id, dr.region_name
                    HAVING revenue > 0 OR distributor_count > 0
                    ORDER BY revenue DESC
                ");
                $territoryData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) { /* fallback */ }

            // 6. Category Performance (product_category)
            $categoryData = [];
            try {
                $stmt = $this->db->query("
                    SELECT 
                        pc.category_name,
                        COUNT(DISTINCT p.product_id) AS product_count,
                        COALESCE(SUM(oi.total_price), 0) AS revenue
                    FROM product_category pc
                    LEFT JOIN product p ON p.category_id = pc.category_id
                    LEFT JOIN order_items oi ON oi.product_id = p.product_id
                    GROUP BY pc.category_id, pc.category_name
                    ORDER BY revenue DESC
                ");
                $categoryData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) { /* fallback */ }

            // 7. Top Distributors Performance Table
            $topDistributors = [];
            try {
                $stmt = $this->db->query("
                    SELECT 
                        d.distributor_id,
                        d.company_name,
                        d.full_name,
                        dr.region_name,
                        COUNT(DISTINCT o.order_id) AS total_orders,
                        COALESCE(SUM(o.total_amount), 0) AS total_revenue,
                        d.status
                    FROM distributor d
                    LEFT JOIN distributor_region dr ON dr.region_id = d.region_id
                    LEFT JOIN orders o ON o.distributor_id = d.distributor_id
                    GROUP BY d.distributor_id, d.company_name, d.full_name, dr.region_name, d.status
                    ORDER BY total_revenue DESC, total_orders DESC
                    LIMIT 5
                ");
                $topDistributors = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) { /* fallback */ }

            // 8. Monthly Revenue Trend
            $monthlyTrend = [];
            try {
                $stmt = $this->db->query("
                    SELECT 
                        DATE_FORMAT(o.created_at, '%b') AS month_name,
                        MONTH(o.created_at) AS month_num,
                        COALESCE(SUM(o.total_amount), 0) AS revenue,
                        COUNT(o.order_id) AS orders
                    FROM orders o
                    GROUP BY month_name, month_num
                    ORDER BY month_num ASC
                ");
                $monthlyTrend = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Exception $e) { /* fallback */ }

            echo json_encode([
                'success' => true,
                'data' => [
                    'metrics' => [
                        'total_revenue'      => (float)($orderStats['total_revenue'] ?? 0),
                        'total_orders'       => (int)($orderStats['total_orders'] ?? 0),
                        'stock_value'        => (float)($stockStats['total_stock_value'] ?? 0),
                        'stock_units'        => (int)($stockStats['total_units'] ?? 0),
                        'fulfillment_rate'   => $fulfillmentRate,
                        'total_requests'     => $totalReqs,
                        'fulfilled_requests' => $fulfilledReqs,
                        'active_distributors'=> (int)($distributorStats['total_distributors'] ?? 0),
                    ],
                    'territory'       => $territoryData,
                    'categories'      => $categoryData,
                    'top_distributors'=> $topDistributors,
                    'monthly_trend'   => $monthlyTrend,
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
