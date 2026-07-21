import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.role;
  } catch (e) {
    return null;
  }
};

const orderStatusMeta = [
  { key: "รอดำเนินการ", label: "รอดำเนินการ", tone: "amber" },
  { key: "จัดส่งแล้ว", label: "จัดส่งแล้ว", tone: "blue" },
  { key: "เสร็จสิ้น", label: "เสร็จสิ้น", tone: "green" },
];

export default function SummaryReport() {
  const navigate = useNavigate();
  const [currentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const tokenRole = getRoleFromToken(currentUser?.token);
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }
    if (currentUser.role !== "admin" || tokenRole !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/users", {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }),
          fetch("/api/manager/orders", {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }),
        ]);

        const [productsData, usersData, ordersData] = await Promise.all([
          productsRes.json(),
          usersRes.json(),
          ordersRes.json(),
        ]);

        if (!productsRes.ok) throw new Error(productsData.message || "ไม่สามารถโหลดสินค้าได้");
        if (!usersRes.ok) throw new Error(usersData.message || "ไม่สามารถโหลดผู้ใช้ได้");
        if (!ordersRes.ok) throw new Error(ordersData.message || "ไม่สามารถโหลดคำสั่งซื้อได้");

        setProducts(Array.isArray(productsData) ? productsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดรายงาน");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const report = useMemo(() => {
    const totalUsers = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const managers = users.filter((u) => u.role === "manager").length;
    const customers = users.filter((u) => !u.role || u.role === "user").length;

    const totalProducts = products.length;
    const lowStock = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 3).length;
    const outOfStock = products.filter((p) => Number(p.stock) === 0).length;
    const inventoryValue = products.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
      0
    );

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === "รอดำเนินการ").length;
    const shippedOrders = orders.filter((o) => o.status === "จัดส่งแล้ว").length;
    const completedOrders = orders.filter((o) => o.status === "เสร็จสิ้น").length;

    const statusCounts = orderStatusMeta.map((item) => ({
      ...item,
      value: orders.filter((o) => o.status === item.key).length,
    }));

    const salesMap = new Map();
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const id = String(item.id ?? item.name ?? Math.random());
        const quantity = Number(item.quantity || 0);
        const revenue = Number(item.price || 0) * quantity;
        const existing = salesMap.get(id) || {
          id,
          name: item.name || "Unknown",
          brand: item.brand || "-",
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += quantity;
        existing.revenue += revenue;
        salesMap.set(id, existing);
      });
    });

    const topProducts = [...salesMap.values()]
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 5);

    return {
      totalUsers,
      admins,
      managers,
      customers,
      totalProducts,
      lowStock,
      outOfStock,
      inventoryValue,
      totalOrders,
      totalRevenue,
      pendingOrders,
      shippedOrders,
      completedOrders,
      statusCounts,
      topProducts,
      recentOrders,
    };
  }, [orders, products, users]);

  const statCards = [
    { label: "ผู้ใช้ทั้งหมด", value: report.totalUsers, icon: "groups", color: "text-slate-700", bg: "bg-slate-50" },
    { label: "คำสั่งซื้อทั้งหมด", value: report.totalOrders, icon: "receipt_long", color: "text-primary", bg: "bg-primary-fixed" },
    { label: "รายได้รวม", value: `฿${report.totalRevenue.toLocaleString()}`, icon: "payments", color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "มูลค่าสต็อก", value: `฿${report.inventoryValue.toLocaleString()}`, icon: "inventory_2", color: "text-secondary", bg: "bg-secondary-fixed" },
  ];

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="bg-gradient-to-r from-secondary to-primary px-margin-desktop py-10 shadow-sm">
        <div className="max-w-container-max mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-white text-3xl">analytics</span>
                <h1 className="text-white text-3xl font-bold tracking-tight" style={{ margin: 0 }}>
                  รายงานภาพรวมสำหรับผู้ดูแลระบบ
                </h1>
              </div>
              <p className="text-white/70 text-sm mt-1">
                ระบบกำลังแสดงข้อมูลล่าสุดของสินค้า ผู้ใช้ และคำสั่งซื้อในมุมมองของ <span className="text-white font-semibold">{currentUser?.name}</span>
              </p>
            </div>
            <Link
              to="/admin/manageProduct"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-5 py-2.5 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              ไปที่จัดการสินค้า
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-8 space-y-6">
        {loading ? (
          <div className="bg-white rounded-2xl border border-outline-variant p-10 text-center shadow-sm">
            <div className="inline-flex items-center gap-3 text-on-surface-variant">
              <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>กำลังโหลดรายงาน...</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div key={card.label} className="bg-white rounded-2xl border border-outline-variant p-5 flex items-center gap-4 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${card.color} text-2xl`}>{card.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-outline-variant p-5 shadow-sm">
                <p className="text-sm font-semibold text-on-surface mb-4">สรุปผู้ใช้</p>
                <div className="space-y-3">
                  {[
                    { label: "Admin", value: report.admins, accent: "bg-primary" },
                    { label: "Manager", value: report.managers, accent: "bg-secondary" },
                    { label: "Customer", value: report.customers, accent: "bg-emerald-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-on-surface-variant">{item.label}</span>
                        <span className="font-semibold text-on-surface">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={`h-full ${item.accent}`}
                          style={{ width: `${Math.max(10, (item.value / Math.max(report.totalUsers, 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant p-5 shadow-sm">
                <p className="text-sm font-semibold text-on-surface mb-4">สถานะคำสั่งซื้อ</p>
                <div className="space-y-3">
                  {report.statusCounts.map((item) => (
                    <div key={item.key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-on-surface-variant">{item.label}</span>
                        <span className="font-semibold text-on-surface">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className={`h-full ${
                            item.tone === "green"
                              ? "bg-emerald-500"
                              : item.tone === "blue"
                                ? "bg-blue-500"
                                : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.max(10, (item.value / Math.max(report.totalOrders, 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant p-5 shadow-sm">
                <p className="text-sm font-semibold text-on-surface mb-4">สถานะคลังสินค้า</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                    <p className="text-xs text-amber-700 uppercase font-semibold">Low Stock</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">{report.lowStock}</p>
                  </div>
                  <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                    <p className="text-xs text-red-700 uppercase font-semibold">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-700 mt-1">{report.outOfStock}</p>
                  </div>
                  
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low">
                  <h2 className="text-base font-semibold text-on-surface">สินค้าขายดี</h2>
                </div>
                {report.topProducts.length === 0 ? (
                  <div className="p-6 text-sm text-on-surface-variant">ยังไม่มีข้อมูลการสั่งซื้อเพื่อสรุปสินค้าขายดี</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-low/60">
                          <th className="px-5 py-3">สินค้า</th>
                          <th className="px-5 py-3 text-right">จำนวน</th>
                          <th className="px-5 py-3 text-right">รายได้</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/50">
                        {report.topProducts.map((item) => (
                          <tr key={item.id}>
                            <td className="px-5 py-3">
                              <p className="font-medium text-on-surface">{item.name}</p>
                              <p className="text-xs text-on-surface-variant">{item.brand}</p>
                            </td>
                            <td className="px-5 py-3 text-right font-semibold">{item.quantity}</td>
                            <td className="px-5 py-3 text-right font-semibold">฿{item.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low">
                  <h2 className="text-base font-semibold text-on-surface">คำสั่งซื้อล่าสุด</h2>
                </div>
                {report.recentOrders.length === 0 ? (
                  <div className="p-6 text-sm text-on-surface-variant">ยังไม่มีคำสั่งซื้อในระบบ</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-on-surface-variant bg-surface-container-low/60">
                          <th className="px-5 py-3">Order</th>
                          <th className="px-5 py-3">วันที่</th>
                          <th className="px-5 py-3 text-right">ยอดรวม</th>
                          <th className="px-5 py-3 text-right">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/50">
                        {report.recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-5 py-3 font-mono text-xs text-on-surface">{order.id}</td>
                            <td className="px-5 py-3 text-on-surface-variant">{order.date || "-"}</td>
                            <td className="px-5 py-3 text-right font-semibold">฿{Number(order.total || 0).toLocaleString()}</td>
                            <td className="px-5 py-3 text-right">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant">
                                {order.status || "-"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-fixed to-secondary-fixed rounded-2xl border border-outline-variant p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-on-surface">คำแนะนำสำหรับผู้ดูแล</p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    ตรวจสอบสินค้าสต็อกต่ำและคำสั่งซื้อที่ยังรอดำเนินการ เพื่อป้องกันการขาดสินค้าและช่วยให้การจัดส่งไม่สะดุด
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/admin/manageUser"
                    className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">groups</span>
                    จัดการผู้ใช้
                  </Link>
                  <Link
                    to="/admin/shipping"
                    className="inline-flex items-center gap-2 bg-white text-secondary font-semibold px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    ดูสถานะขนส่ง
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
