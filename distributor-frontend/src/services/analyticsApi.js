const API_BASE = "http://localhost/fmcg-vendora/backend/api";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch all analytics data aggregated from existing endpoints.
 * Returns an object with all sections needed by AnalyticsPage.
 */
export async function fetchAnalyticsData(token) {
  const [ordersRes, deliveriesRes, stockRes, retailersRes, driversRes, creditRes] =
    await Promise.allSettled([
      fetch(`${API_BASE}/distributor/orders.php`,     { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/deliveries.php`, { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/stock.php`,      { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/retailers.php`,  { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/drivers.php`,    { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/credit.php`,     { headers: authHeaders(token) }).then((r) => r.json()),
    ]);

  const orders     = ordersRes.status     === "fulfilled" && ordersRes.value.success     ? ordersRes.value.data     ?? [] : [];
  const deliveries = deliveriesRes.status === "fulfilled" && deliveriesRes.value.success ? deliveriesRes.value.data ?? [] : [];
  const stock      = stockRes.status      === "fulfilled" && stockRes.value.success      ? stockRes.value.data      ?? [] : [];
  const retailers  = retailersRes.status  === "fulfilled" && retailersRes.value.success  ? retailersRes.value.data  ?? [] : [];
  const drivers    = driversRes.status    === "fulfilled" && driversRes.value.success    ? driversRes.value.data    ?? [] : [];
  const credits    = creditRes.status     === "fulfilled" && creditRes.value.success     ? creditRes.value.data     ?? [] : [];

  // ── KPI Cards ──────────────────────────────────────────────────────────────
  const totalRetailers = retailers.length;
  const activeDrivers  = drivers.filter((d) => d.status === "Approved").length;
  const totalOrders    = orders.length;

  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  const totalOutstanding = credits.reduce(
    (sum, c) => sum + parseFloat(c.current_balance || 0),
    0
  );

  // Aggregate stock by product_id (Active batches only)
  const stockMap = {};
  stock.forEach((b) => {
    if (!stockMap[b.product_id]) {
      stockMap[b.product_id] = { quantity: 0 };
    }
    if (b.status === "Active") {
      stockMap[b.product_id].quantity += parseInt(b.quantity || 0);
    }
  });
  const lowStockCount = Object.values(stockMap).filter(
    (p) => p.quantity > 0 && p.quantity <= 20
  ).length;

  // ── Sales Overview (Last 7 Days) ──────────────────────────────────────────
  const salesData = buildSalesData(orders);

  // ── Sales by Territory ────────────────────────────────────────────────────
  const territoryData = buildTerritoryData(orders);

  // ── Top Products ──────────────────────────────────────────────────────────
  const topProducts = buildTopProducts(orders);

  // ── Order Status Breakdown ────────────────────────────────────────────────
  const orderStatusData = buildOrderStatusData(orders);

  // ── Payment Breakdown ─────────────────────────────────────────────────────
  const paymentData = buildPaymentData(orders);

  // ── Outstanding Retailers ─────────────────────────────────────────────────
  const outstandingRetailers = credits
    .filter((c) => parseFloat(c.current_balance || 0) > 0)
    .sort((a, b) => parseFloat(b.current_balance) - parseFloat(a.current_balance))
    .slice(0, 5)
    .map((c) => ({
      name:   c.shop_name || `Retailer #${c.retailer_id}`,
      amount: Number(c.current_balance).toLocaleString("en-LK", { minimumFractionDigits: 2 }),
    }));

  // ── Driver Performance ────────────────────────────────────────────────────
  const driverPerformance = buildDriverPerformance(drivers, deliveries);

  // ── Retailer Growth (Monthly) ─────────────────────────────────────────────
  const retailerGrowth = buildRetailerGrowth(retailers);

  // ── Inventory Insights ────────────────────────────────────────────────────
  const stockValues = Object.values(stockMap);
  const inStockCount   = stockValues.filter((p) => p.quantity > 20).length;
  const outOfStockCount = stockValues.filter((p) => p.quantity <= 0).length;
  const inventoryInsights = [
    { title: "Products In Stock",      value: inStockCount,    note: "Active products",     color: "green"  },
    { title: "Low Stock Products",     value: lowStockCount,   note: "Need replenishment",  color: "yellow" },
    { title: "Out of Stock Products",  value: outOfStockCount, note: "Requires restock",    color: "red"    },
    { title: "Total SKUs Tracked",     value: Object.keys(stockMap).length, note: "All products", color: "blue" },
  ];

  return {
    kpis: {
      totalRetailers,
      activeDrivers,
      totalOrders,
      totalRevenue,
      totalOutstanding,
      lowStockCount,
    },
    salesData,
    territoryData,
    topProducts,
    orderStatusData,
    paymentData,
    outstandingRetailers,
    driverPerformance,
    retailerGrowth,
    inventoryInsights,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildSalesData(orders) {
  const grouped = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const key   = d.toISOString().split("T")[0];
    grouped[key] = { label, value: 0 };
  }
  orders.forEach((o) => {
    if (o.status === "Delivered" || o.status === "Approved") {
      const key = (o.created_at || "").split(" ")[0];
      if (grouped[key]) grouped[key].value += parseFloat(o.total_amount || 0);
    }
  });
  return Object.values(grouped);
}

function buildTerritoryData(orders) {
  const territories = { Kegalle: 0, Colombo: 0, Galle: 0, Kandy: 0, Kurunegala: 0, Other: 0 };
  let totalSales = 0;
  orders.forEach((o) => {
    if (o.status === "Delivered" || o.status === "Approved") {
      const addr = (o.shop_address || "").toLowerCase();
      const val  = parseFloat(o.total_amount || 0);
      let found  = false;
      for (const t of Object.keys(territories)) {
        if (t !== "Other" && addr.includes(t.toLowerCase())) {
          territories[t] += val; found = true; break;
        }
      }
      if (!found) territories.Other += val;
      totalSales += val;
    }
  });
  const result = Object.keys(territories)
    .map((name) => {
      const val = territories[name];
      return {
        name,
        value:      parseFloat((val / 1000).toFixed(1)),
        percentage: totalSales > 0 ? ((val / totalSales) * 100).toFixed(1) + "%" : "0%",
      };
    })
    .filter((t) => t.value > 0)
    .sort((a, b) => b.value - a.value);
  return result.length > 0
    ? result
    : [{ name: "Colombo", value: 0, percentage: "0%" }, { name: "Kegalle", value: 0, percentage: "0%" }];
}

function buildTopProducts(orders) {
  const productMap = {};
  orders.forEach((o) => {
    if (o.status !== "Delivered") return;
    const items = o.items || o.order_items || [];
    items.forEach((item) => {
      const name = item.product_name || item.name || "Unknown";
      if (!productMap[name]) productMap[name] = { orders: 0, revenue: 0 };
      productMap[name].orders  += parseInt(item.quantity || 1);
      productMap[name].revenue += parseFloat(item.subtotal || item.total || 0);
    });
  });
  const sorted = Object.entries(productMap)
    .map(([name, d]) => ({
      name,
      orders:  d.orders,
      revenue: d.revenue.toLocaleString("en-LK", { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);
  // Fallback if no items data
  if (sorted.length === 0) {
    return [
      { name: "No data available", orders: 0, revenue: "0" },
    ];
  }
  return sorted;
}

function buildOrderStatusData(orders) {
  const total = orders.length || 1;
  const counts = {
    Delivered:  orders.filter((o) => o.status === "Delivered").length,
    Pending:    orders.filter((o) => o.status === "Pending").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Rejected:   orders.filter((o) => o.status === "Rejected").length,
    Approved:   orders.filter((o) => o.status === "Approved").length,
  };
  return [
    { label: "Delivered",  value: Math.round((counts.Delivered  / total) * 100), color: "bg-green-500"  },
    { label: "Approved",   value: Math.round((counts.Approved   / total) * 100), color: "bg-blue-500"   },
    { label: "Pending",    value: Math.round((counts.Pending    / total) * 100), color: "bg-yellow-400" },
    { label: "Processing", value: Math.round((counts.Processing / total) * 100), color: "bg-indigo-500" },
    { label: "Rejected",   value: Math.round((counts.Rejected   / total) * 100), color: "bg-red-500"    },
  ].filter((s) => s.value > 0);
}

function buildPaymentData(orders) {
  const delivered = orders.filter((o) => o.status === "Delivered");
  let cash = 0, credit = 0, split = 0;
  delivered.forEach((o) => {
    const method = (o.payment_method || "cash").toLowerCase();
    if (method === "cash")   cash   += parseFloat(o.total_amount || 0);
    else if (method === "credit") credit += parseFloat(o.total_amount || 0);
    else split += parseFloat(o.total_amount || 0);
  });
  const total = cash + credit + split || 1;
  return [
    { label: "Cash",          value: Math.round((cash   / total) * 100), color: "bg-green-500"  },
    { label: "Credit",        value: Math.round((credit / total) * 100), color: "bg-blue-500"   },
    { label: "Split Payment", value: Math.round((split  / total) * 100), color: "bg-orange-500" },
  ].filter((p) => p.value > 0);
}

function buildDriverPerformance(drivers, deliveries) {
  const countMap = {};
  deliveries.forEach((d) => {
    if (d.status === "DELIVERED" && d.driver_id) {
      countMap[d.driver_id] = (countMap[d.driver_id] || 0) + 1;
    }
  });
  return drivers
    .filter((d) => d.status === "Approved")
    .map((d) => ({
      name:       d.full_name || `Driver #${d.driver_id}`,
      deliveries: countMap[d.driver_id] || 0,
    }))
    .sort((a, b) => b.deliveries - a.deliveries)
    .slice(0, 5);
}

function buildRetailerGrowth(retailers) {
  const months = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Get last 7 months
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = { month: monthNames[d.getMonth()], value: 0 };
  }
  retailers.forEach((r) => {
    const date = r.created_at || "";
    const key  = date.substring(0, 7); // YYYY-MM
    if (months[key]) months[key].value += 1;
  });
  return Object.values(months);
}
