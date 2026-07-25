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

  // Modal states
  const [shipModalOrder, setShipModalOrder] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState("Kerry Express");
  const [trackingInput, setTrackingInput] = useState("");

  const [detailModalOrder, setDetailModalOrder] = useState(null);

  const couriersList = [
    "Kerry Express",
    "Flash Express",
    "ไปรษณีย์ไทย (EMS)",
    "J&T Express",
    "Shopee Xpress",
    "Ninja Van",
    "DHL Express",
  ];

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

  // Update order status with optional courier and tracking number
  const handleUpdateStatus = async (orderId, newStatus, courier = null, trackingNumber = null) => {
    setUpdatingOrderId(orderId);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload = { orderId, status: newStatus };
      if (courier) payload.courier = courier;
      if (trackingNumber) payload.trackingNumber = trackingNumber;

      const res = await fetch("/api/manager/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "ไม่สามารถอัปเดตสถานะได้");
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...data.order } : o))
      );
      setSuccessMsg(`อัปเดตคำสั่งซื้อ #${orderId} เป็น "${newStatus}" สำเร็จ!`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Open ship modal
  const openShipModal = (order) => {
    setShipModalOrder(order);
    setSelectedCourier(order.courier || "Kerry Express");
    const autoTracking = `TH${Math.floor(100000000 + Math.random() * 900000000)}`;
    setTrackingInput(order.trackingNumber || autoTracking);
  };

  // Confirm shipping in modal
  const handleConfirmShip = async (e) => {
    e.preventDefault();
    if (!shipModalOrder) return;
    const targetOrder = shipModalOrder;
    setShipModalOrder(null);
    await handleUpdateStatus(targetOrder.id, "จัดส่งแล้ว", selectedCourier, trackingInput);
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
          o.shippingAddress?.toLowerCase().includes(q) ||
          o.recipientName?.toLowerCase().includes(q) ||
          o.trackingNumber?.toLowerCase().includes(q)
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

  // Render Visual Shipping Stepper
  const renderShippingStepper = (status) => {
    const steps = [
      { key: "รอดำเนินการ", label: "เตรียมส่ง", icon: "inventory_2" },
      { key: "จัดส่งแล้ว", label: "อยู่ระหว่างจัดส่ง", icon: "local_shipping" },
      { key: "เสร็จสิ้น", label: "จัดส่งเสร็จสิ้น", icon: "task_alt" },
    ];

    const getStepState = (stepKey) => {
      if (status === "เสร็จสิ้น") return "completed";
      if (status === "จัดส่งแล้ว") {
        if (stepKey === "รอดำเนินการ" || stepKey === "จัดส่งแล้ว") return stepKey === "จัดส่งแล้ว" ? "active" : "completed";
        return "upcoming";
      }
      // status === "รอดำเนินการ"
      if (stepKey === "รอดำเนินการ") return "active";
      return "upcoming";
    };

    return (
      <div className="flex items-center justify-between w-full max-w-[260px] mx-auto py-1">
        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          const isCompleted = state === "completed";
          const isActive = state === "active";

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none relative">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`h-[2px] flex-1 mx-1 transition-colors ${
                    isCompleted || isActive ? "bg-primary" : "bg-outline-variant/60"
                  }`}
                />
              )}
              {/* Step Circle */}
              <div className="flex flex-col items-center gap-1 group">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isActive
                      ? "bg-primary text-white ring-4 ring-primary/20 scale-105"
                      : "bg-surface-container-high text-on-surface-variant border border-outline-variant"
                  }`}
                  title={step.label}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isCompleted ? "check" : step.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-medium tracking-tight whitespace-nowrap ${
                    isActive
                      ? "text-primary font-bold"
                      : isCompleted
                      ? "text-emerald-700 font-semibold"
                      : "text-on-surface-variant/70"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
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
            { label: "เตรียมจัดส่ง (Pending)", value: stats.pending, icon: "pending_actions", color: "text-amber-700", bg: "bg-amber-50" },
            { label: "อยู่ระหว่างจัดส่ง (Shipped)", value: stats.shipped, icon: "local_shipping", color: "text-blue-700", bg: "bg-blue-50" },
            { label: "จัดส่งเสร็จสิ้น (Completed)", value: stats.completed, icon: "task_alt", color: "text-green-700", bg: "bg-green-50" },
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
              placeholder="ค้นหาตาม Order ID, Customer ID, ชื่อผู้รับ หรือ Tracking Number..."
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
            <option value="รอดำเนินการ">1. รอดำเนินการ (เตรียมจัดส่ง)</option>
            <option value="จัดส่งแล้ว">2. จัดส่งแล้ว (อยู่ระหว่างจัดส่ง)</option>
            <option value="เสร็จสิ้น">3. เสร็จสิ้น (จัดส่งสำเร็จ)</option>
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
                    <th className="text-left px-4 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-36">ID คำสั่งซื้อ</th>
                    <th className="text-left px-4 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-64">ผู้รับ & ที่อยู่จัดส่ง</th>
                    <th className="text-center px-4 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-64">ขั้นตอนการจัดส่ง (Shipping Step)</th>
                    <th className="text-left px-4 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-48">ข้อมูลพัสดุ / ขนส่ง</th>
                    <th className="text-right px-4 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-28">ยอดชำระ</th>
                    <th className="text-center px-4 py-3.5 text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-44">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {filteredOrders.map((order) => {
                    const isPending = order.status === "รอดำเนินการ";
                    const isShipped = order.status === "จัดส่งแล้ว";
                    const isCompleted = order.status === "เสร็จสิ้น";

                    return (
                      <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors">
                        {/* Order ID & Date */}
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => setDetailModalOrder(order)}
                            className="font-mono font-bold text-xs text-primary hover:underline border-none bg-transparent cursor-pointer p-0 text-left"
                            title="คลิกเพื่อดูรายละเอียดคำสั่งซื้อ"
                          >
                            #{order.id}
                          </button>
                          <span className="block text-[10px] font-normal text-outline mt-1">{order.date}</span>
                          <span className="inline-block text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded mt-1">
                            {order.items?.length || 0} รายการ
                          </span>
                        </td>

                        {/* Recipient & Address */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <span className="font-semibold text-on-surface block text-xs">
                              {order.recipientName || `User: ${order.userId}`}
                            </span>
                            {order.recipientPhone && (
                              <span className="text-[11px] text-on-surface-variant block">
                                โทร: {order.recipientPhone}
                              </span>
                            )}
                            <p className="text-[11px] text-on-surface-variant leading-tight line-clamp-2" title={order.shippingAddress}>
                              {order.shippingAddress || "-"}
                            </p>
                          </div>
                        </td>

                        {/* Shipping Progress Stepper */}
                        <td className="px-4 py-4 text-center">
                          {renderShippingStepper(order.status)}
                        </td>

                        {/* Tracking Info */}
                        <td className="px-4 py-4">
                          {order.courier || order.trackingNumber ? (
                            <div className="space-y-1 bg-surface-container-low p-2 rounded-xl border border-outline-variant/60">
                              <span className="text-xs font-bold text-primary block flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                {order.courier || "ขนส่ง"}
                              </span>
                              {order.trackingNumber && (
                                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border text-on-surface block select-all">
                                  {order.trackingNumber}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-outline italic">ยังไม่มีข้อมูลพัสดุ</span>
                          )}
                        </td>

                        {/* Price Total */}
                        <td className="px-4 py-4 text-right font-bold text-on-surface">
                          {order.total?.toLocaleString()} ฿
                        </td>

                        {/* Action buttons following proper linear flow */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            {isPending && (
                              <button
                                type="button"
                                disabled={updatingOrderId === order.id}
                                onClick={() => openShipModal(order)}
                                className="w-full flex items-center justify-center gap-1 bg-primary text-white hover:brightness-110 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm border-none cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                <span>แจ้งจัดส่งสินค้า</span>
                              </button>
                            )}

                            {isShipped && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold">
                                <span className="material-symbols-outlined text-sm animate-pulse">local_shipping</span>
                                <span>จัดส่งแล้ว<br />(รอผู้ซื้อยืนยัน)</span>
                              </span>
                            )}

                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span>ผู้ซื้อยืนยันรับสินค้าแล้ว</span>
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => setDetailModalOrder(order)}
                              className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer bg-transparent border-none"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>ดูรายละเอียด</span>
                            </button>
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

      {/* Ship Order Modal (บันทึกจัดส่ง & ออกเลขพัสดุ) */}
      {shipModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShipModalOrder(null)}
          />
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-outline-variant shadow-2xl relative z-10 space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                <h3 className="text-lg font-bold text-on-surface my-0">
                  แจ้งจัดส่งสินค้า (Order #{shipModalOrder.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShipModalOrder(null)}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmShip} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-on-surface-variant block">
                  บริษัทขนส่ง (Courier) *
                </label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  required
                >
                  {couriersList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-on-surface-variant block">
                  หมายเลขพัสดุ (Tracking Number) *
                </label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="เช่น TH123456789"
                  className="w-full font-mono bg-surface-container-low border border-outline-variant rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  required
                />
                <p className="text-[11px] text-on-surface-variant/70">
                  * เลขพัสดุจะถูกส่งต่อไปยังระบบติดตามของลูกค้าในทันที
                </p>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShipModalOrder(null)}
                  className="border border-outline-variant px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer bg-transparent"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:brightness-110 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer border-none flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>บันทึกและเปลี่ยนเป็น "จัดส่งแล้ว"</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDetailModalOrder(null)}
          />
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-outline-variant shadow-2xl relative z-10 space-y-5 animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div>
                <h3 className="text-lg font-bold text-on-surface my-0">
                  รายละเอียดคำสั่งซื้อ
                </h3>
                <span className="font-mono text-xs text-primary font-bold">#{detailModalOrder.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOrder(null)}
                className="p-1 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Stepper overview */}
              <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/60">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2 text-center">
                  สถานะคำสั่งซื้อปัจจุบัน: <span className="text-primary">{detailModalOrder.status}</span>
                </span>
                {renderShippingStepper(detailModalOrder.status)}
              </div>

              {/* Recipient details */}
              <div className="space-y-2 bg-surface-container-low/50 p-3.5 rounded-2xl border border-outline-variant/40">
                <span className="font-bold text-on-surface uppercase tracking-wider block border-b pb-1">
                  ข้อมูลการจัดส่งสินค้า
                </span>
                <p><b>ผู้รับ:</b> {detailModalOrder.recipientName || detailModalOrder.userId}</p>
                {detailModalOrder.recipientPhone && <p><b>เบอร์โทรศัพท์:</b> {detailModalOrder.recipientPhone}</p>}
                <p><b>ที่อยู่จัดส่ง:</b> {detailModalOrder.shippingAddress || "-"}</p>
                {detailModalOrder.courier && (
                  <p className="text-primary font-bold">
                    <b>บริษัทขนส่ง:</b> {detailModalOrder.courier} ({detailModalOrder.trackingNumber || "ไม่มีเลขพัสดุ"})
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="font-bold text-on-surface uppercase tracking-wider block">
                  รายการสินค้าในคำสั่งซื้อ ({detailModalOrder.items?.length || 0} รายการ)
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {detailModalOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-outline-variant/60">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded bg-surface border shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface truncate">{item.name}</p>
                        <p className="text-on-surface-variant text-[11px]">
                          จำนวน: {item.quantity} x {item.price?.toLocaleString()}฿
                        </p>
                      </div>
                      <span className="font-bold text-on-surface">
                        {(item.quantity * item.price)?.toLocaleString()}฿
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total breakdown */}
              <div className="border-t border-outline-variant pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-on-surface">ยอดชำระเงินสุทธิ</span>
                <span className="text-primary font-bold text-lg">{detailModalOrder.total?.toLocaleString()}฿</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setDetailModalOrder(null)}
                className="bg-primary text-white hover:brightness-110 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
