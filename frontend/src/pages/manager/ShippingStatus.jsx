import { useState, useEffect, useMemo } from "react";

export default function ShippingStatus() {
  const [currentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/manager/orders", {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/manager/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "ไม่สามารถอัปเดตสถานะได้");
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setSuccessMsg(`อัปเดตคำสั่งซื้อ #${orderId} เป็น "${newStatus}" สำเร็จ!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter & Search logic
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.userId?.toLowerCase().includes(q) ||
          o.shippingAddress?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }

    // Sort descending by date/id
    list.sort((a, b) => b.id.localeCompare(a.id));

    return list;
  }, [orders, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "รอดำเนินการ").length;
    const shipped = orders.filter((o) => o.status === "จัดส่งแล้ว").length;
    const completed = orders.filter((o) => o.status === "เสร็จสิ้น").length;
    return { total, pending, shipped, completed };
  }, [orders]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "เสร็จสิ้น":
        return "bg-green-100 text-green-700 border border-green-200";
      case "จัดส่งแล้ว":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-primary px-margin-desktop py-10 shadow-sm">
        <div className="max-w-container-max mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-white text-3xl">local_shipping</span>
            <h1 className="text-white text-3xl font-bold tracking-tight" style={{ margin: 0 }}>
              ระบบจัดการสถานะการขนส่ง (Shipping Management)
            </h1>
          </div>
          <p className="text-white/70 text-sm mt-1">
            เข้าสู่ระบบในฐานะ <span className="text-white font-semibold">{currentUser?.name}</span> ({currentUser?.role})
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-8 space-y-6">
        {/* Alerts */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-xl font-medium animate-fade-in">
            <span className="material-symbols-outlined">check_circle</span>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl font-medium animate-fade-in">
            <span className="material-symbols-outlined">error</span>
            {errorMsg}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "คำสั่งซื้อทั้งหมด", value: stats.total, icon: "receipt_long", color: "text-slate-700", bg: "bg-slate-50" },
            { label: "รอดำเนินการ", value: stats.pending, icon: "pending_actions", color: "text-amber-700", bg: "bg-amber-50" },
            { label: "จัดส่งแล้ว", value: stats.shipped, icon: "local_shipping", color: "text-blue-700", bg: "bg-blue-50" },
            { label: "เสร็จสิ้น / ได้รับแล้ว", value: stats.completed, icon: "task_alt", color: "text-green-700", bg: "bg-green-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-outline-variant p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search toolbar */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1 min-w-[250px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              placeholder="ค้นหาตาม Order ID, Customer ID หรือที่อยู่จัดส่ง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none cursor-pointer"
          >
            <option value="all">ทุกสถานะการจัดส่ง</option>
            <option value="รอดำเนินการ">รอดำเนินการ (Pending)</option>
            <option value="จัดส่งแล้ว">จัดส่งแล้ว (Shipped)</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น (Completed)</option>
          </select>

          <span className="text-sm text-on-surface-variant ml-auto">
            แสดงทั้งหมด <strong>{filteredOrders.length}</strong> รายการ
          </span>
        </div>

        {/* Orders Table/List */}
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
              <svg className="animate-spin h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>กำลังโหลดข้อมูลคำสั่งซื้อ...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
              <span className="material-symbols-outlined text-5xl text-outline-variant">assignment_late</span>
              <p>ไม่พบรายการคำสั่งซื้อ</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left px-5 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-36">ID คำสั่งซื้อ</th>
                    <th className="text-left px-5 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider">ลูกค้า (User ID)</th>
                    <th className="text-left px-5 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-1/3">ที่อยู่สำหรับจัดส่ง</th>
                    <th className="text-right px-5 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-28">ยอดชำระ</th>
                    <th className="text-center px-5 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-32">สถานะ</th>
                    <th className="text-center px-5 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-72">เปลี่ยนสถานะจัดส่ง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {filteredOrders.map((order) => {
                    const badgeClass = getStatusBadgeClass(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-xs text-on-surface">
                          {order.id}
                          <span className="block text-[10px] font-normal text-outline mt-1">{order.date}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <span className="font-semibold text-on-surface block">ID: {order.userId}</span>
                            <div className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded inline-block">
                              สินค้า: {order.items?.length || 0} ชิ้น
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2" title={order.shippingAddress}>
                            {order.shippingAddress || "-"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-on-surface">
                          {order.total?.toLocaleString()} ฿
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${badgeClass}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-1">
                            {[
                              { key: "รอดำเนินการ", label: "เตรียมส่ง", icon: "pending_actions", color: "hover:bg-amber-50 hover:text-amber-700" },
                              { key: "จัดส่งแล้ว", label: "จัดส่งแล้ว", icon: "local_shipping", color: "hover:bg-blue-50 hover:text-blue-700" },
                              { key: "เสร็จสิ้น", label: "เสร็จสิ้น", icon: "task_alt", color: "hover:bg-green-50 hover:text-green-700" },
                            ].map((btn) => (
                              <button
                                key={btn.key}
                                disabled={updatingOrderId === order.id || order.status === btn.key}
                                onClick={() => handleUpdateStatus(order.id, btn.key)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border-none cursor-pointer bg-transparent transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
                                  order.status === btn.key
                                    ? "text-secondary font-bold underline"
                                    : `text-on-surface-variant ${btn.color}`
                                }`}
                                title={`เปลี่ยนเป็น ${btn.key}`}
                              >
                                <span className="material-symbols-outlined text-sm">{btn.icon}</span>
                                <span>{btn.label}</span>
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
