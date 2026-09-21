const API_BASE = "http://localhost/fmcg-vendora/backend/api";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch raw data from all distributor endpoints.
 */
export async function fetchRawAnalyticsData(token) {
  const [ordersRes, deliveriesRes, stockRes, retailersRes, driversRes, creditRes] =
    await Promise.allSettled([
      fetch(`${API_BASE}/distributor/orders.php`,     { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/deliveries.php`, { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/stock.php`,      { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/retailers.php`,  { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/drivers.php`,    { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(`${API_BASE}/distributor/credit.php`,     { headers: authHeaders(token) }).then((r) => r.json()),
    ]);

  return {
    orders:     ordersRes.status     === "fulfilled" && ordersRes.value?.success     ? ordersRes.value.data     ?? [] : [],
    deliveries: deliveriesRes.status === "fulfilled" && deliveriesRes.value?.success ? deliveriesRes.value.data ?? [] : [],
    stock:      stockRes.status      === "fulfilled" && stockRes.value?.success      ? stockRes.value.data      ?? [] : [],
    retailers:  retailersRes.status  === "fulfilled" && retailersRes.value?.success  ? retailersRes.value.data  ?? [] : [],
    drivers:    driversRes.status    === "fulfilled" && driversRes.value?.success    ? driversRes.value.data    ?? [] : [],
    credits:    creditRes.status     === "fulfilled" && creditRes.value?.success     ? creditRes.value.data     ?? [] : [],
  };
}

/**
 * Filter orders according to the selected timeframe.
 */
export function filterOrdersByTimeframe(orders, timeframe) {
  if (timeframe === "All Time") return orders;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  return orders.filter((o) => {
    if (!o.created_at) return true;
    const datePart = (o.created_at || "").split(" ")[0];
    const [yStr, mStr, dStr] = datePart.split("-");
    const oYear = parseInt(yStr, 10);
    const oMonth = parseInt(mStr, 10) - 1;
    const oDay = parseInt(dStr, 10);
    const oDate = new Date(oYear, oMonth, oDay);

    if (isNaN(oDate.getTime())) return true;

    if (timeframe === "This Month") {
      return oYear === currentYear && oMonth === currentMonth;
    } else if (timeframe === "Last Month") {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return oYear === lastMonthYear && oMonth === lastMonth;
    } else if (timeframe === "This Quarter") {
      const currentQuarter = Math.floor(currentMonth / 3);
      const oQuarter = Math.floor(oMonth / 3);
      return oYear === currentYear && oQuarter === currentQuarter;
    }
    return true;
  });
}

/**
 * Compute all analytics datasets for a given timeframe.
 */
export function computeAnalyticsForTimeframe(rawData, timeframe = "This Month") {
  const { orders = [], deliveries = [], stock = [], retailers = [], drivers = [], credits = [] } = rawData;

  const timeframeOrders = filterOrdersByTimeframe(orders, timeframe);

  // ── KPI Cards ──────────────────────────────────────────────────────────────
  const totalRetailers = retailers.length;
  const activeDrivers  = drivers.filter((d) => (d.status || "").toLowerCase() === "approved").length;
  const totalOrders    = timeframeOrders.length;

  const totalRevenue = timeframeOrders
    .filter((o) => ["delivered", "approved"].includes((o.status || "").toLowerCase()))
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  const totalOutstanding = credits.reduce(
    (sum, c) => sum + parseFloat(c.current_balance || 0),
    0
  );

  // Aggregate stock by product_id
  const stockMap = {};
  stock.forEach((b) => {
    if (!stockMap[b.product_id]) {
      stockMap[b.product_id] = { quantity: 0, name: b.product_name || "Product" };
    }
    if ((b.status || "").toLowerCase() === "active") {
      stockMap[b.product_id].quantity += parseInt(b.quantity || 0, 10);
    }
  });
  const lowStockCount = Object.values(stockMap).filter(
    (p) => p.quantity > 0 && p.quantity <= 20
  ).length;

  // ── Sales Overview (Adapts dynamically to timeframe filter) ───────────────
  const salesData = buildSalesDataByTimeframe(orders, timeframe);

  // ── Top Products (Filtered by timeframe) ──────────────────────────────────
  const topProducts = buildTopProducts(timeframeOrders);

  // ── Order Status Breakdown (Filtered by timeframe) ────────────────────────
  const orderStatusData = buildOrderStatusData(timeframeOrders);

  // ── Payment Breakdown (Filtered by timeframe) ─────────────────────────────
  const paymentData = buildPaymentData(timeframeOrders);

  // ── Outstanding Retailers ─────────────────────────────────────────────────
  const outstandingRetailers = buildOutstandingRetailers(credits, retailers, orders);

  // ── Driver Performance ────────────────────────────────────────────────────
  const driverPerformance = buildDriverPerformance(drivers, deliveries);

  // ── Retailer Growth (Monthly) ─────────────────────────────────────────────
  const retailerGrowth = buildRetailerGrowth(retailers);

  // ── Inventory Insights ────────────────────────────────────────────────────
  const stockValues = Object.values(stockMap);
  const inStockCount    = stockValues.filter((p) => p.quantity > 20).length;
  const outOfStockCount = stockValues.filter((p) => p.quantity <= 0).length;
  const inventoryInsights = [
    { title: "Products In Stock",      value: inStockCount,    note: "Optimal stock levels", color: "green"  },
    { title: "Low Stock Alert",        value: lowStockCount,   note: "Need reordering soon", color: "yellow" },
    { title: "Out of Stock",           value: outOfStockCount, note: "Immediate replenishment", color: "red" },
    { title: "Total Catalog Items",    value: Object.keys(stockMap).length, note: "All managed products", color: "blue" },
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
    topProducts,
    orderStatusData,
    paymentData,
    outstandingRetailers,
    driverPerformance,
    retailerGrowth,
    inventoryInsights,
  };
}

/**
 * Main fetcher returning rawData and computed analytics.
 */
export async function fetchAnalyticsData(token, timeframe = "This Month") {
  const rawData = await fetchRawAnalyticsData(token);
  const computed = computeAnalyticsForTimeframe(rawData, timeframe);
  return {
    ...computed,
    rawData,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Builds sales data dynamically for the selected timeframe:
 * - "This Month": Daily bars for this current month
 * - "Last Month": Daily bars for the previous month
 * - "This Quarter": Monthly bars for the current 3-month quarter
 * - "All Time": Monthly bars across all available order history
 */
function buildSalesDataByTimeframe(allOrders, timeframe) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  if (timeframe === "This Month") {
    // Generate buckets for days in this month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const grouped = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentYear, currentMonth, day);
      const key = formatLocalDate(d);
      const label = `${String(day).padStart(2, "0")} ${MONTH_NAMES[currentMonth]}`;
      grouped[key] = { label, value: 0, count: 0, date: key };
    }

    allOrders.forEach((o) => {
      const status = (o.status || "").toLowerCase();
      if (["delivered", "approved", "processing", "pending"].includes(status)) {
        const rawDate = (o.created_at || "").split(" ")[0];
        const amount = parseFloat(o.total_amount || o.order_amount || 0);
        if (grouped[rawDate]) {
          grouped[rawDate].value += amount;
          grouped[rawDate].count += 1;
        }
      }
    });

    const list = Object.values(grouped);
    // If all days are 0 and there are orders, include last 7 active days fallback
    const totalVal = list.reduce((acc, c) => acc + c.value, 0);
    if (totalVal === 0 && allOrders.length > 0) {
      return buildRecentActiveSalesData(allOrders);
    }
    return list;
  }

  if (timeframe === "Last Month") {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInLastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();
    const grouped = {};

    for (let day = 1; day <= daysInLastMonth; day++) {
      const d = new Date(lastMonthYear, lastMonth, day);
      const key = formatLocalDate(d);
      const label = `${String(day).padStart(2, "0")} ${MONTH_NAMES[lastMonth]}`;
      grouped[key] = { label, value: 0, count: 0, date: key };
    }

    allOrders.forEach((o) => {
      const status = (o.status || "").toLowerCase();
      if (["delivered", "approved", "processing", "pending"].includes(status)) {
        const rawDate = (o.created_at || "").split(" ")[0];
        const amount = parseFloat(o.total_amount || o.order_amount || 0);
        if (grouped[rawDate]) {
          grouped[rawDate].value += amount;
          grouped[rawDate].count += 1;
        }
      }
    });

    return Object.values(grouped);
  }

  if (timeframe === "This Quarter") {
    const quarterIndex = Math.floor(currentMonth / 3);
    const startMonth = quarterIndex * 3;
    const grouped = {};

    for (let i = 0; i < 3; i++) {
      const m = startMonth + i;
      const key = `${currentYear}-${String(m + 1).padStart(2, "0")}`;
      const label = `${MONTH_NAMES[m]} ${currentYear}`;
      grouped[key] = { label, value: 0, count: 0, date: key };
    }

    allOrders.forEach((o) => {
      const status = (o.status || "").toLowerCase();
      if (["delivered", "approved", "processing", "pending"].includes(status)) {
        const monthKey = (o.created_at || "").substring(0, 7);
        const amount = parseFloat(o.total_amount || o.order_amount || 0);
        if (grouped[monthKey]) {
          grouped[monthKey].value += amount;
          grouped[monthKey].count += 1;
        }
      }
    });

    return Object.values(grouped);
  }

  // "All Time": Group all orders by month
  const monthMap = {};
  // Initialize at least the last 6 months so chart is complete
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    monthMap[key] = { label, value: 0, count: 0, date: key };
  }

  allOrders.forEach((o) => {
    const status = (o.status || "").toLowerCase();
    if (["delivered", "approved", "processing", "pending"].includes(status)) {
      const monthKey = (o.created_at || "").substring(0, 7);
      if (monthKey && monthKey.length === 7) {
        if (!monthMap[monthKey]) {
          const [y, m] = monthKey.split("-");
          const mIdx = parseInt(m, 10) - 1;
          const label = `${MONTH_NAMES[mIdx] || m} ${y}`;
          monthMap[monthKey] = { label, value: 0, count: 0, date: monthKey };
        }
        monthMap[monthKey].value += parseFloat(o.total_amount || o.order_amount || 0);
        monthMap[monthKey].count += 1;
      }
    }
  });

  return Object.values(monthMap).sort((a, b) => a.date.localeCompare(b.date));
}

function buildRecentActiveSalesData(orders) {
  const orderDateMap = {};
  orders.forEach((o) => {
    const status = (o.status || "").toLowerCase();
    if (!["rejected", "cancelled"].includes(status)) {
      const rawDate = (o.created_at || "").split(" ")[0];
      if (rawDate) {
        if (!orderDateMap[rawDate]) {
          const parts = rawDate.split("-");
          const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          const label = !isNaN(d.getTime())
            ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
            : rawDate;
          orderDateMap[rawDate] = { label, value: 0, count: 0, date: rawDate };
        }
        orderDateMap[rawDate].value += parseFloat(o.total_amount || 0);
        orderDateMap[rawDate].count += 1;
      }
    }
  });

  const activeList = Object.values(orderDateMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  return activeList.length > 0 ? activeList : [];
}

function buildOutstandingRetailers(credits, retailers, orders) {
  if (credits && credits.length > 0) {
    return credits
      .map((c) => {
        const balance = parseFloat(c.current_balance || 0);
        const limit = parseFloat(c.credit_limit || 0);
        const usedPct = limit > 0 ? Math.min(Math.round((balance / limit) * 100), 100) : (balance > 0 ? 100 : 0);
        return {
          name:        c.shop_name || `Retailer #${c.retailer_id}`,
          owner:       c.owner_name || "",
          retailer_id: c.retailer_id,
          amount:      Number(balance).toLocaleString("en-LK", { minimumFractionDigits: 2 }),
          rawAmount:   balance,
          creditLimit: Number(limit).toLocaleString("en-LK"),
          rawLimit:    limit,
          usedPercentage: usedPct,
        };
      })
      .sort((a, b) => b.rawAmount - a.rawAmount || b.rawLimit - a.rawLimit)
      .slice(0, 6);
  }

  const map = {};
  orders.forEach((o) => {
    const isCredit = (o.payment_method || "").toLowerCase().includes("credit");
    const creditDue = parseFloat(o.credit_amount || (isCredit ? o.total_amount : 0) || 0);
    const shop = o.shop_name || `Retailer #${o.retailer_id}`;
    if (!map[shop]) {
      map[shop] = { name: shop, owner: o.owner_name || "", rawAmount: 0, rawLimit: 50000 };
    }
    if (isCredit && o.status !== "Rejected" && o.status !== "Cancelled") {
      map[shop].rawAmount += creditDue;
    }
  });

  retailers.forEach((r) => {
    const shop = r.shop_name || `Retailer #${r.retailer_id}`;
    if (!map[shop]) {
      map[shop] = { name: shop, owner: r.owner_name || "", rawAmount: 0, rawLimit: 50000 };
    }
  });

  return Object.values(map)
    .map((item) => ({
      ...item,
      amount: Number(item.rawAmount).toLocaleString("en-LK", { minimumFractionDigits: 2 }),
      creditLimit: Number(item.rawLimit).toLocaleString("en-LK"),
      usedPercentage: item.rawLimit > 0 ? Math.min(Math.round((item.rawAmount / item.rawLimit) * 100), 100) : 0,
    }))
    .sort((a, b) => b.rawAmount - a.rawAmount)
    .slice(0, 6);
}

function buildTopProducts(orders) {
  const productMap = {};
  orders.forEach((o) => {
    const status = (o.status || "").toLowerCase();
    if (status === "rejected" || status === "cancelled") return;

    const items = o.items || o.order_items || [];
    items.forEach((item) => {
      const name = item.product_name || item.name || `Product #${item.product_id || "Unknown"}`;
      if (!productMap[name]) productMap[name] = { orders: 0, revenue: 0 };
      const qty = parseInt(item.quantity || 1, 10);
      const price = parseFloat(item.total_price || (qty * (item.unit_price || 0)) || item.subtotal || item.total || 0);
      productMap[name].orders  += qty;
      productMap[name].revenue += price;
    });
  });

  const sorted = Object.entries(productMap)
    .map(([name, d]) => ({
      name,
      orders:  d.orders,
      rawRevenue: d.revenue,
      revenue: d.revenue.toLocaleString("en-LK", { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    }))
    .sort((a, b) => b.rawRevenue - a.rawRevenue || b.orders - a.orders)
    .slice(0, 5);

  return sorted;
}

function buildOrderStatusData(orders) {
  const total = orders.length;
  if (!total) return [];

  const counts = {
    Delivered:  0,
    Approved:   0,
    Processing: 0,
    Pending:    0,
    Rejected:   0,
  };

  orders.forEach((o) => {
    const s = (o.status || "Pending").toLowerCase();
    if (s === "delivered") counts.Delivered += 1;
    else if (s === "approved") counts.Approved += 1;
    else if (s === "processing") counts.Processing += 1;
    else if (s === "rejected" || s === "cancelled") counts.Rejected += 1;
    else counts.Pending += 1;
  });

  return [
    { label: "Delivered",  count: counts.Delivered,  value: Math.round((counts.Delivered  / total) * 100), color: "#10b981" },
    { label: "Approved",   count: counts.Approved,   value: Math.round((counts.Approved   / total) * 100), color: "#3b82f6" },
    { label: "Processing", count: counts.Processing, value: Math.round((counts.Processing / total) * 100), color: "#8b5cf6" },
    { label: "Pending",    count: counts.Pending,    value: Math.round((counts.Pending    / total) * 100), color: "#f59e0b" },
    { label: "Rejected",   count: counts.Rejected,   value: Math.round((counts.Rejected   / total) * 100), color: "#ef4444" },
  ].filter((s) => s.count > 0);
}

function buildPaymentData(orders) {
  const activeOrders = orders.filter((o) => {
    const s = (o.status || "").toLowerCase();
    return s !== "rejected" && s !== "cancelled";
  });
  if (!activeOrders.length) return [];

  let cash = 0, credit = 0, split = 0, online = 0;
  activeOrders.forEach((o) => {
    const method = (o.payment_method || "cash").toLowerCase().trim();
    const amount = parseFloat(o.total_amount || 0);
    if (method === "cash") {
      cash += amount;
    } else if (method === "credit") {
      credit += amount;
    } else if (method === "cash_credit" || method === "split" || method.includes("credit")) {
      split += amount;
    } else {
      online += amount;
    }
  });

  const total = cash + credit + split + online;
  if (total <= 0) return [];

  return [
    { label: "Cash",          amount: cash,   value: Math.round((cash   / total) * 100), color: "#10b981" },
    { label: "Credit",        amount: credit, value: Math.round((credit / total) * 100), color: "#3b82f6" },
    { label: "Cash + Credit", amount: split,  value: Math.round((split  / total) * 100), color: "#f59e0b" },
    { label: "Online",        amount: online, value: Math.round((online / total) * 100), color: "#8b5cf6" },
  ].filter((p) => p.value > 0 || p.amount > 0);
}

function buildDriverPerformance(drivers, deliveries) {
  const countMap = {};
  deliveries.forEach((d) => {
    const status = (d.status || "").toUpperCase();
    if (status === "DELIVERED" && d.driver_id) {
      countMap[d.driver_id] = (countMap[d.driver_id] || 0) + 1;
    }
  });

  return drivers
    .filter((d) => (d.status || "").toLowerCase() === "approved")
    .map((d) => ({
      id:         d.driver_id,
      name:       d.full_name || `Driver #${d.driver_id}`,
      phone:      d.phone || "",
      vehicle:    d.vehicle_number || "",
      deliveries: countMap[d.driver_id] || 0,
    }))
    .sort((a, b) => b.deliveries - a.deliveries)
    .slice(0, 5);
}

function buildRetailerGrowth(retailers) {
  const months = {};
  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months[key] = { month: MONTH_NAMES[d.getMonth()], fullMonth: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`, value: 0 };
  }

  retailers.forEach((r) => {
    const date = r.created_at || "";
    const key  = date.substring(0, 7); // YYYY-MM
    if (months[key]) {
      months[key].value += 1;
    }
  });

  return Object.values(months);
}
