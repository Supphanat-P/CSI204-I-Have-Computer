import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
    Filler,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
    Filler,
    Legend,
);

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
    } catch {
        return null;
    }
};

const orderStatusMeta = [
    { key: "รอดำเนินการ", label: "รอดำเนินการ", tone: "amber" },
    { key: "จัดส่งแล้ว", label: "จัดส่งแล้ว", tone: "blue" },
    { key: "เสร็จสิ้น", label: "เสร็จสิ้น", tone: "green" },
];

const revenueWindows = [
    { key: "7d", label: "7 วัน", days: 7, granularity: "day" },
    { key: "1m", label: "1 เดือน", days: 30, granularity: "day" },
    { key: "3m", label: "3 เดือน", days: 90, granularity: "day" },
    { key: "1y", label: "1 ปี", days: 365, granularity: "month" },
];

const formatCurrency = (value) =>
    new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 0,
    }).format(value || 0);

const formatDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
    ).padStart(2, "0")}`;

const formatMonthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const formatDayLabel = (date) =>
    date.toLocaleDateString("th-TH", { day: "2-digit", month: "short" });

const formatMonthLabel = (date) =>
    date.toLocaleDateString("th-TH", { month: "short", year: "2-digit" });

const safeDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const getRevenueTimeline = (orders, window) => {
    const now = new Date();
    const buckets = [];
    const bucketMap = new Map();

    if (window.granularity === "day") {
        const start = new Date(now);
        start.setDate(now.getDate() - (window.days - 1));
        start.setHours(0, 0, 0, 0);

        for (let i = 0; i < window.days; i += 1) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const key = formatDateKey(date);
            const bucket = {
                key,
                label: formatDayLabel(date),
                revenue: 0,
                orders: 0,
            };
            buckets.push(bucket);
            bucketMap.set(key, bucket);
        }
    } else {
        const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        for (let i = 0; i < 12; i += 1) {
            const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
            const key = formatMonthKey(date);
            const bucket = {
                key,
                label: formatMonthLabel(date),
                revenue: 0,
                orders: 0,
            };
            buckets.push(bucket);
            bucketMap.set(key, bucket);
        }
    }

    orders.forEach((order) => {
        const date = safeDate(order.date);
        if (!date) return;
        const key =
            window.granularity === "day" ? formatDateKey(date) : formatMonthKey(date);
        const bucket = bucketMap.get(key);
        if (!bucket) return;
        bucket.revenue += Number(order.total || 0);
        bucket.orders += 1;
    });

    return buckets;
};

function MetricCard({ label, value, icon, tone, subtle = false }) {
    const toneMap = {
        primary: "text-primary bg-primary-fixed",
        secondary: "text-secondary bg-secondary-fixed",
        emerald: "text-emerald-700 bg-emerald-50",
        amber: "text-amber-700 bg-amber-50",
        red: "text-red-700 bg-red-50",
        slate: "text-slate-700 bg-slate-50",
    };

    return (
        <div className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneMap[tone] || toneMap.slate}`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        {label}
                    </p>
                    <p className={`mt-1 text-2xl font-bold ${subtle ? "text-on-surface-variant" : "text-on-surface"}`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function RevenueChart({ orders }) {
    const [selectedWindow, setSelectedWindow] = useState("7d");
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const windowConfig = revenueWindows.find((item) => item.key === selectedWindow) || revenueWindows[0];

    const timeline = useMemo(
        () => getRevenueTimeline(orders, windowConfig),
        [orders, windowConfig],
    );

    const { total, average, peak } = useMemo(() => {
        const values = timeline.map((item) => item.revenue);
        const totalValue = values.reduce((sum, value) => sum + value, 0);
        const averageValue = values.length ? totalValue / values.length : 0;
        const peakIndex = values.length ? values.indexOf(Math.max(...values)) : -1;
        return {
            total: totalValue,
            average: averageValue,
            peak: peakIndex >= 0 ? timeline[peakIndex] : null,
        };
    }, [timeline]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.35)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0.02)");

        chartRef.current = new ChartJS(ctx, {
            type: "line",
            data: {
                labels: timeline.map((item) => item.label),
                datasets: [
                    {
                        label: "รายได้",
                        data: timeline.map((item) => item.revenue),
                        borderColor: "rgba(99, 102, 241, 1)",
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.35,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "rgba(99, 102, 241, 1)",
                        pointBorderWidth: 2,
                        borderWidth: 3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => ` ${formatCurrency(context.parsed.y)}`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "#6b7280",
                            maxRotation: 0,
                            autoSkip: true,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(148, 163, 184, 0.18)" },
                        ticks: {
                            color: "#6b7280",
                            callback: (value) => formatCurrency(value),
                        },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [timeline]);

    return (
        <div className="rounded-[28px] border border-outline-variant bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Revenue Overview
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-on-surface">
                        กราฟรายได้
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {revenueWindows.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setSelectedWindow(item.key)}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedWindow === item.key
                                ? "border-primary bg-primary text-white shadow-sm"
                                : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-primary-fixed p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        รายได้รวมในช่วงนี้
                    </p>
                    <p className="mt-2 text-2xl font-bold text-on-surface">{formatCurrency(total)}</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        เฉลี่ยต่อช่วงย่อย
                    </p>
                    <p className="mt-2 text-2xl font-bold text-on-surface">{formatCurrency(average)}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        ช่วงที่ทำรายได้สูงสุด
                    </p>
                    <p className="mt-2 text-lg font-bold text-emerald-700">
                        {peak ? peak.label : "-"}
                    </p>
                    <p className="text-sm text-emerald-700/80">
                        {peak ? formatCurrency(peak.revenue) : formatCurrency(0)}
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-3xl border border-outline-variant bg-gradient-to-b from-surface-container-low to-white p-4">
                <div className="h-[340px]">
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    );
}

export default function SummaryReport() {
    const navigate = useNavigate();
    const [currentUser] = useState(() =>
        JSON.parse(localStorage.getItem("currentUser") || "null"),
    );
    const [selectedInventoryProduct, setSelectedInventoryProduct] = useState(null);
    const [showStockTableModal, setShowStockTableModal] = useState(false);
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
        const lowStock = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 3);
        const outOfStock = products.filter((p) => Number(p.stock) === 0);
        const alertProducts = products.filter((p) => Number(p.stock) <= 3);

        const inventoryValue = products.reduce(
            (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
            0,
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
            alertProducts,
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

    const closeInventoryModal = () => setSelectedInventoryProduct(null);

    if (!currentUser || currentUser.role !== "admin") return null;

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="relative overflow-hidden bg-gradient-to-r from-secondary via-primary to-primary px-margin-desktop py-10 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_40%)]" />
                <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

                <div className="relative max-w-container-max mx-auto">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-white text-3xl">analytics</span>
                                <h1 className="text-white text-3xl font-bold tracking-tight" style={{ margin: 0 }}>
                                    รายงานภาพรวมผู้ดูแลระบบ
                                </h1>
                            </div>
                            <p className="max-w-2xl text-white/75 text-sm leading-relaxed">
                                ดูยอดขาย คลังสินค้า ผู้ใช้ และคำสั่งซื้อในมุมมองที่อ่านง่ายขึ้น พร้อมกราฟรายได้แบบสลับช่วงเวลาได้
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/admin/manageProduct"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-lg transition hover:brightness-105 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                                จัดการสินค้า
                            </Link>
                            <Link
                                to="/admin/shipping"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-sm">local_shipping</span>
                                จัดการขนส่ง
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-container-max mx-auto px-margin-desktop py-8 space-y-6">
                {loading ? (
                    <div className="rounded-3xl border border-outline-variant bg-white p-10 text-center shadow-sm">
                        <div className="inline-flex items-center gap-3 text-on-surface-variant">
                            <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>กำลังโหลดรายงาน...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <MetricCard label="ผู้ใช้ทั้งหมด" value={report.totalUsers} icon="groups" tone="slate" />
                            <MetricCard label="คำสั่งซื้อทั้งหมด" value={report.totalOrders} icon="receipt_long" tone="primary" />
                            <MetricCard label="รายได้รวม" value={formatCurrency(report.totalRevenue)} icon="payments" tone="emerald" />
                            <MetricCard label="มูลค่าสต็อก" value={formatCurrency(report.inventoryValue)} icon="inventory_2" tone="secondary" />
                        </div>

                        <RevenueChart orders={orders} />

                        <div className="grid gap-4 lg:grid-cols-3">
                            <div className="rounded-[28px] border border-outline-variant bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Users</p>
                                        <h2 className="mt-1 text-xl font-bold text-on-surface">สรุปผู้ใช้</h2>
                                    </div>
                                    <span className="material-symbols-outlined text-primary">group</span>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-3">
                                    {[
                                        { label: "Admin", value: report.admins, accent: "bg-primary" },
                                        { label: "Manager", value: report.managers, accent: "bg-secondary" },
                                        { label: "Customer", value: report.customers, accent: "bg-emerald-500" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`h-3 w-3 rounded-full ${item.accent}`} />
                                                <span className="text-sm font-medium text-on-surface-variant">{item.label}</span>
                                            </div>
                                            <span className="text-lg font-bold text-on-surface">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-outline-variant bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Orders</p>
                                        <h2 className="mt-1 text-xl font-bold text-on-surface">สถานะคำสั่งซื้อ</h2>
                                    </div>
                                    <span className="material-symbols-outlined text-secondary">pending_actions</span>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-3">
                                    {report.statusCounts.map((item) => (
                                        <div key={item.key} className="flex items-center justify-between rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`h-3 w-3 rounded-full ${item.tone === "green"
                                                        ? "bg-emerald-500"
                                                        : item.tone === "blue"
                                                            ? "bg-blue-500"
                                                            : "bg-amber-500"
                                                        }`}
                                                />
                                                <span className="text-sm font-medium text-on-surface-variant">{item.label}</span>
                                            </div>
                                            <span className="text-lg font-bold text-on-surface">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ส่วนคลังสินค้า - ปรับให้กดดูตารางสินค้าสต็อกต่ำ/สินค้าหมดได้ */}
                            <div className="rounded-[28px] border border-outline-variant bg-white p-5 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">คลังสินค้า</p>
                                            <h2 className="mt-1 text-xl font-bold text-on-surface">ภาพรวมสต็อกสินค้า</h2>
                                        </div>
                                        <span className="material-symbols-outlined text-amber-700">warehouse</span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                            <p className="text-xs font-semibold uppercase text-amber-700">สต็อกต่ำ (1-3 ชิ้น)</p>
                                            <p className="mt-1 text-2xl font-bold text-amber-700">{report.lowStock.length}</p>
                                        </div>

                                        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                                            <p className="text-xs font-semibold uppercase text-red-700">สินค้าหมด (0 ชิ้น)</p>
                                            <p className="mt-1 text-2xl font-bold text-red-700">{report.outOfStock.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <button
                                        type="button"
                                        onClick={() => setShowStockTableModal(true)}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-white shadow transition hover:bg-amber-600 active:scale-95"
                                    >
                                        กดเพื่อดูตารางสินค้า
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="overflow-hidden rounded-[28px] border border-outline-variant bg-white shadow-sm">
                                <div className="border-b border-outline-variant bg-surface-container-low px-5 py-4">
                                    <h2 className="text-lg font-bold text-on-surface">สินค้าขายดี</h2>
                                </div>

                                {report.topProducts.length === 0 ? (
                                    <div className="p-6 text-sm text-on-surface-variant">
                                        ยังไม่มีข้อมูลการสั่งซื้อเพื่อสรุปสินค้าขายดี
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-surface-container-low/60 text-left text-xs uppercase tracking-wider text-on-surface-variant">
                                                    <th className="px-5 py-3">สินค้า</th>
                                                    <th className="px-5 py-3 text-right">จำนวน</th>
                                                    <th className="px-5 py-3 text-right">รายได้</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant/50">
                                                {report.topProducts.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-5 py-3">
                                                            <p
                                                                className="max-w-[260px] font-medium text-on-surface"
                                                                title={item.name}
                                                                style={{
                                                                    display: "-webkit-box",
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: "vertical",
                                                                    overflow: "hidden",
                                                                }}
                                                            >
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-on-surface-variant">{item.brand}</p>
                                                        </td>
                                                        <td className="px-5 py-3 text-right font-semibold">{item.quantity}</td>
                                                        <td className="px-5 py-3 text-right font-semibold">
                                                            {formatCurrency(item.revenue)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="overflow-hidden rounded-[28px] border border-outline-variant bg-white shadow-sm">
                                <div className="border-b border-outline-variant bg-surface-container-low px-5 py-4">
                                    <h2 className="text-lg font-bold text-on-surface">คำสั่งซื้อล่าสุด</h2>
                                </div>

                                {report.recentOrders.length === 0 ? (
                                    <div className="p-6 text-sm text-on-surface-variant">
                                        ยังไม่มีคำสั่งซื้อในระบบ
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-surface-container-low/60 text-left text-xs uppercase tracking-wider text-on-surface-variant">
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
                                                        <td className="px-5 py-3 text-right font-semibold">
                                                            {formatCurrency(order.total)}
                                                        </td>
                                                        <td className="px-5 py-3 text-right">
                                                            <span className="inline-flex rounded-full bg-surface-container px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
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

                        <div className="rounded-[28px] border border-outline-variant bg-gradient-to-r from-primary-fixed to-secondary-fixed p-5 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-on-surface">คำแนะนำสำหรับผู้ดูแล</p>
                                    <p className="mt-1 max-w-3xl text-sm text-on-surface-variant">
                                        ตรวจสอบสินค้าสต็อกต่ำและคำสั่งซื้อที่ยังรอดำเนินการเป็นหลัก เพื่อให้การขายและการจัดส่งไม่สะดุด
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        to="/admin/manageUser"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary border border-outline-variant transition hover:bg-surface-container-low"
                                    >
                                        <span className="material-symbols-outlined text-sm">groups</span>
                                        จัดการผู้ใช้
                                    </Link>
                                    <Link
                                        to="/admin/shipping"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-secondary border border-outline-variant transition hover:bg-surface-container-low"
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

            {/* Modal แสดงตารางรายการสินค้าที่ต้องเติม / สินค้าหมด */}
            {showStockTableModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowStockTableModal(false)}
                    />
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-outline-variant bg-white shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                    Stock Alert
                                </p>
                                <h3 className="mt-1 text-xl font-bold text-on-surface">
                                    รายการสินค้าที่ขาดหรือเหลือน้อย
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowStockTableModal(false)}
                                className="rounded-full border border-outline-variant bg-white px-3 py-1.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                            >
                                ปิด
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            {report.alertProducts.length === 0 ? (
                                <p className="text-center py-8 text-on-surface-variant font-medium">
                                    ไม่มีสินค้าที่สต็อกต่ำหรือสินค้าหมดในขณะนี้
                                </p>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="sticky top-0 bg-white border-b border-outline-variant text-xs uppercase tracking-wider text-on-surface-variant">
                                        <tr>
                                            <th className="pb-3 pl-2">สินค้า</th>
                                            <th className="pb-3">แบรนด์</th>
                                            <th className="pb-3 text-right">ราคา</th>
                                            <th className="pb-3 text-center">จำนวนในสต็อก</th>
                                            <th className="pb-3 text-center">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/40">
                                        {report.alertProducts.map((product) => {
                                            const isOut = Number(product.stock || 0) === 0;
                                            return (
                                                <tr key={product.id} className="hover:bg-surface-container-low/50">
                                                    <td className="py-3 pl-2">
                                                        <p className="font-semibold text-on-surface">{product.name}</p>
                                                        <p className="text-xs text-on-surface-variant">{product.type || "-"}</p>
                                                    </td>
                                                    <td className="py-3 text-on-surface-variant">{product.brand || "-"}</td>
                                                    <td className="py-3 text-right font-medium">{formatCurrency(product.price)}</td>
                                                    <td className="py-3 text-center font-bold text-base">
                                                        {product.stock ?? 0}
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isOut
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-amber-100 text-amber-700"
                                                                }`}
                                                        >
                                                            {isOut ? "หมด" : "สต็อกต่ำ"}
                                                        </span>
                                                    </td>
                                                   
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
}