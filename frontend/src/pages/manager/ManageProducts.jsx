import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Helper to decode JWT token payload on client side
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

export default function ManageProducts() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("id");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    brand: "",
    productType: "",
    customProductType: "",
    category: "",
    price: "",
    image: "",
    stock: "",
    description: "",
    attributes: [],
    attributesDetails: [],
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Add timestamp to prevent browser caching
      const res = await fetch("/api/products?t=" + Date.now());
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (e) {
      console.error("Fetch products error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter((p) => p.stock <= 3 && p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { total, lowStock, outOfStock, totalValue };
  }, [products]);

  const productTypes = useMemo(() => {
    return [...new Set(products.map((p) => p.productType || p.type).filter(Boolean))];
  }, [products]);

  // Extract all unique attribute keys
  const allAttrKeys = useMemo(() => {
    const keys = new Set();
    products.forEach(p => {
      if (p.attributes) Object.keys(p.attributes).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [products]);

  const allDetailKeys = useMemo(() => {
    const keys = new Set();
    products.forEach(p => {
      if (p.attributesDetails) Object.keys(p.attributesDetails).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [products]);

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let list = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") {
      if (filterType === "lowstock") list = list.filter((p) => p.stock <= 3 && p.stock > 0);
      else if (filterType === "outofstock") list = list.filter((p) => p.stock === 0);
      else list = list.filter((p) => p.productType === filterType);
    }
    list.sort((a, b) => {
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "stock_asc") return a.stock - b.stock;
      if (sortBy === "stock_desc") return b.stock - a.stock;
      return 0;
    });
    return list;
  }, [products, searchQuery, filterType, sortBy]);

  // Open add modal
  const handleAdd = () => {
    setFormData({ id: null, name: "", brand: "", productType: "", customProductType: "", category: "", price: "", image: "", stock: "", description: "", attributes: [], attributesDetails: [] });
    setFormError("");
    setActiveTab("general");
    setModalMode("add");
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name || "",
      brand: product.brand || "",
      productType: product.productType || product.type || "",
      customProductType: "",
      category: product.category || "",
      price: product.price?.toString() || "",
      image: product.image || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
      attributes: Object.entries(product.attributes || {}).map(([k, v]) => ({ key: k, value: v })),
      attributesDetails: Object.entries(product.attributesDetails || {}).map(([k, v]) => ({ key: k, value: v })),
    });
    setFormError("");
    setActiveTab("general");
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDelete = (products) => {
    
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name || !formData.brand || !formData.price) {
      setFormError("กรุณากรอกชื่อสินค้า แบรนด์ และราคา");
      return;
    }
    setFormLoading(true);
    try {
      const token = currentUser?.token;
      const endpoint = modalMode === "add" ? "/api/products/create" : "/api/products/update";

      let finalProductType = formData.productType;
      if (finalProductType === "__ADD_NEW__") {
        finalProductType = formData.customProductType || "";
      }

      const attributesObj = formData.attributes.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
        return acc;
      }, {});
      const attributesDetailsObj = formData.attributesDetails.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
        return acc;
      }, {});

      const payload = {
        ...formData,
        productType: finalProductType,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
        attributes: attributesObj,
        attributesDetails: attributesDetailsObj,
      };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "เกิดข้อผิดพลาด");
        return;
      }
      setShowModal(false);
      setSuccessMsg(modalMode === "add" ? "เพิ่มสินค้าสำเร็จ!" : "แก้ไขสินค้าสำเร็จ!");

      // Update local state immediately so UI reflects it without waiting for fetch
      if (modalMode === "add") {
        setProducts(prev => [...prev, data.product]);
      } else {
        setProducts(prev => prev.map(p => p.id === formData.id ? data.product : p));
      }

      // Delay fetch to allow nodemon restarts to settle
      setTimeout(fetchProducts, 1000);

      try {
        localStorage.setItem('products_last_updated', Date.now().toString());
        window.dispatchEvent(new Event('products_last_updated'));
      } catch (e) { }
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setFormError("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setFormLoading(false);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return { label: "หมดสต็อก", cls: "bg-red-100 text-red-700 border border-red-200" };
    if (stock <= 3) return { label: `${stock} (ต่ำ)`, cls: "bg-orange-100 text-orange-700 border border-orange-200" };
    return { label: stock.toString(), cls: "bg-emerald-100 text-emerald-700 border border-emerald-200" };
  };

  const tokenRole = getRoleFromToken(currentUser?.token);
  const isAuthorized =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "manager") &&
    (tokenRole === "admin" || tokenRole === "manager") &&
    currentUser.role === tokenRole;

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-primary px-margin-desktop py-10 shadow-sm">
        <div className="max-w-container-max mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
                <h1 className="text-white text-3xl font-bold tracking-tight" style={{ margin: 0 }}>
                  ระบบจัดการสินค้า (Products Management)
                </h1>
              </div>
              <p className="text-white/70 text-sm mt-1">
                เข้าสู่ระบบในฐานะ <span className="text-white font-semibold">{currentUser?.name}</span> ({currentUser?.role})
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-white text-primary font-bold px-5 py-2.5 rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer border-none"
            >
              <span className="material-symbols-outlined">add_circle</span>
              เพิ่มสินค้าใหม่
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop py-8 space-y-6">
        {/* Success toast */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-xl font-medium">
            <span className="material-symbols-outlined">check_circle</span>
            {successMsg}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "สินค้าทั้งหมด", value: stats.total, icon: "inventory_2", color: "text-primary", bg: "bg-primary-fixed" },
            { label: "สต็อกต่ำ (1-3)", value: stats.lowStock, icon: "warning", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "หมดสต็อก", value: stats.outOfStock, icon: "remove_shopping_cart", color: "text-red-600", bg: "bg-red-50" },
            { label: "มูลค่ารวม", value: `฿${stats.totalValue.toLocaleString()}`, icon: "payments", color: "text-emerald-700", bg: "bg-emerald-50" },
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

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="all">ทุกประเภท</option>
            <option value="lowstock">สต็อกต่ำ</option>
            <option value="outofstock">หมดสต็อก</option>
            {productTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="id">เรียงตาม ID</option>
            <option value="name">เรียงตามชื่อ</option>
            <option value="price_asc">ราคา (ต่ำ-สูง)</option>
            <option value="price_desc">ราคา (สูง-ต่ำ)</option>
            <option value="stock_asc">สต็อก (น้อย-มาก)</option>
            <option value="stock_desc">สต็อก (มาก-น้อย)</option>
          </select>

          <span className="text-sm text-on-surface-variant ml-auto">
            แสดง <strong>{filtered.length}</strong> รายการ
          </span>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
              <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>กำลังโหลดข้อมูล...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
              <span className="material-symbols-outlined text-5xl text-outline-variant">inventory_2</span>
              <p>ไม่พบสินค้า</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left px-4 py-3 text-on-surface-variant font-semibold uppercase tracking-wider text-xs w-12">ID</th>
                    <th className="text-left px-4 py-3 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">สินค้า</th>
                    <th className="text-left px-4 py-3 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">ประเภท</th>
                    <th className="text-right px-4 py-3 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">ราคา</th>
                    <th className="text-center px-4 py-3 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">สต็อก</th>
                    <th className="text-center px-4 py-3 text-on-surface-variant font-semibold uppercase tracking-wider text-xs">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {filtered.map((product) => {
                    const badge = getStockBadge(product.stock);
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-surface-container-low/50 transition-colors ${product.stock === 0 ? "opacity-70" : ""}`}
                      >
                        <td className="px-4 py-3 text-on-surface-variant font-mono text-xs">{product.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/40 shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-symbols-outlined text-outline-variant text-xl">image</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-on-surface">{product.name}</p>
                              <p className="text-xs text-primary font-bold mt-0.5">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-medium">
                            {product.type || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-on-surface">
                          {product.price?.toLocaleString()} ฿
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 active:scale-95 transition-all cursor-pointer border-none"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            แก้ไข
                          </button>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex flex-col border-b border-outline-variant sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    {modalMode === "add" ? "add_box" : "edit_note"}
                  </span>
                  <h2 className="text-lg font-bold text-on-surface" style={{ margin: 0 }}>
                    {modalMode === "add" ? "เพิ่มสินค้าใหม่" : "แก้ไขสินค้า"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex px-6 gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer bg-transparent px-1 border-none ${activeTab === 'general' ? 'border-b-primary text-primary' : 'border-b-transparent text-on-surface-variant hover:text-on-surface'}`}
                  style={{ borderBottomStyle: 'solid' }}
                >
                  ข้อมูลทั่วไป
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("attributes")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer bg-transparent px-1 border-none ${activeTab === 'attributes' ? 'border-b-primary text-primary' : 'border-b-transparent text-on-surface-variant hover:text-on-surface'}`}
                  style={{ borderBottomStyle: 'solid' }}
                >
                  คุณสมบัติ (Attributes)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer bg-transparent px-1 border-none ${activeTab === 'details' ? 'border-b-primary text-primary' : 'border-b-transparent text-on-surface-variant hover:text-on-surface'}`}
                  style={{ borderBottomStyle: 'solid' }}
                >
                  สเปกละเอียด (Details)
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {formError}
                </div>
              )}

              {/* General Tab */}
              <div className={activeTab === 'general' ? 'space-y-4' : 'hidden'}>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                    ชื่อสินค้า <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    placeholder='เช่น ASUS ROG Swift 27"'
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                      แบรนด์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData((f) => ({ ...f, brand: e.target.value }))}
                      placeholder="เช่น ASUS, Intel"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">ประเภทสินค้า</label>
                    <select
                      value={formData.productType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setFormData((f) => {
                          const newData = {
                            ...f,
                            productType: newType,
                            customProductType: newType === "__ADD_NEW__" ? f.customProductType : ""
                          };

                          // Auto-fill attributes when a known type is selected
                          if (newType !== "__ADD_NEW__" && newType !== "") {
                            const template = products.find(p => (p.productType || p.type) === newType);
                            if (template) {
                              if (template.attributes) {
                                const existingAttrs = f.attributes || [];
                                newData.attributes = Object.keys(template.attributes).map(k => {
                                  const existing = existingAttrs.find(a => a.key === k);
                                  return { key: k, value: existing ? existing.value : "" };
                                });
                              }
                              if (template.attributesDetails) {
                                const existingDetails = f.attributesDetails || [];
                                newData.attributesDetails = Object.keys(template.attributesDetails).map(k => {
                                  const existing = existingDetails.find(a => a.key === k);
                                  return { key: k, value: existing ? existing.value : "" };
                                });
                              }
                            }
                          }

                          return newData;
                        });
                      }}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl"
                    >
                      <option value="">เลือกประเภทสินค้า</option>

                      {productTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                      <option value="__ADD_NEW__" className="font-bold text-primary">+ เพิ่มประเภทใหม่</option>
                    </select>

                    {formData.productType === "__ADD_NEW__" && (
                      <input
                        type="text"
                        placeholder="พิมพ์ประเภทสินค้าใหม่"
                        value={formData.customProductType}
                        onChange={(e) => setFormData((f) => ({ ...f, customProductType: e.target.value }))}
                        className="w-full mt-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">หมวดหมู่ย่อย</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    placeholder="เช่น RTX 4070, Intel Core i7"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                      ราคา (฿) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">จำนวนสต็อก</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData((f) => ({ ...f, stock: e.target.value }))}
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">URL รูปภาพ</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                  {formData.image && (
                    <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-outline-variant">
                      <img
                        src={formData.image}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">รายละเอียดสินค้า</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    placeholder="อธิบายคุณสมบัติและจุดเด่นของสินค้า..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div> {/* End General Tab */}

              {/* Datalists for attributes */}
              <datalist id="attr-keys-list">
                {allAttrKeys.map(k => <option key={k} value={k} />)}
              </datalist>
              <datalist id="detail-keys-list">
                {allDetailKeys.map(k => <option key={k} value={k} />)}
              </datalist>

              {/* Attributes Tab */}
              <div className={activeTab === 'attributes' ? 'space-y-4' : 'hidden'}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-on-surface-variant">Attributes (คุณสมบัติหลัก)</label>
                  <button type="button" onClick={() => setFormData(f => ({ ...f, attributes: [...f.attributes, { key: '', value: '' }] }))} className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-none">+ เพิ่ม Attribute</button>
                </div>
                {formData.attributes.map((attr, idx) => (
                  <div key={idx} className="flex gap-3 mb-3 items-start">
                    <div className="w-1/3">
                      <label className="block text-xs text-on-surface-variant mb-1 font-semibold">Key</label>
                      <select
                        value={allAttrKeys.includes(attr.key) ? attr.key : (attr.key ? "__CUSTOM__" : "")}
                        onChange={(e) => {
                          const newAttr = [...formData.attributes];
                          if (e.target.value === "__CUSTOM__") {
                            newAttr[idx].key = attr.key || "";
                          } else {
                            newAttr[idx].key = e.target.value;
                          }
                          setFormData(f => ({ ...f, attributes: newAttr }));
                        }}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      >
                        <option value="">เลือกจากรายการ</option>
                        {allAttrKeys.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                        <option value="__CUSTOM__" className="font-bold text-primary">+ พิมพ์ Key เอง</option>
                      </select>
                      <p className="text-xs text-on-surface-variant mt-1">เลือกจากรายการที่มี หรือเลือก <span className="font-semibold">+ พิมพ์ Key เอง</span></p>

                      {(!allAttrKeys.includes(attr.key)) && (
                        <input
                          type="text"
                          placeholder="พิมพ์ Key ของคุณ (เช่น size, color)"
                          value={attr.key}
                          onChange={(e) => {
                            const newAttr = [...formData.attributes];
                            newAttr[idx].key = e.target.value;
                            setFormData(f => ({ ...f, attributes: newAttr }));
                          }}
                          className="w-full mt-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs text-on-surface-variant mb-1 font-semibold">Value</label>
                      <input type="text" placeholder='Value (เช่น 27")' value={attr.value} onChange={(e) => {
                        const newAttr = [...formData.attributes];
                        newAttr[idx].value = e.target.value;
                        setFormData(f => ({ ...f, attributes: newAttr }));
                      }} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    </div>

                    <div className="flex items-center mt-6">
                      <button type="button" onClick={() => {
                        const newAttr = formData.attributes.filter((_, i) => i !== idx);
                        setFormData(f => ({ ...f, attributes: newAttr }));
                      }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer bg-transparent border-none flex items-center justify-center"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attributes Details Tab */}
              <div className={activeTab === 'details' ? 'space-y-4' : 'hidden'}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-on-surface-variant">Attributes Details (สเปกโดยละเอียด)</label>
                  <button type="button" onClick={() => setFormData(f => ({ ...f, attributesDetails: [...f.attributesDetails, { key: '', value: '' }] }))} className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-none">+ เพิ่ม Detail</button>
                </div>
                {formData.attributesDetails.map((attr, idx) => (
                  <div key={idx} className="flex gap-3 mb-3 items-start">
                    <div className="w-1/3">
                      <label className="block text-xs text-on-surface-variant mb-1 font-semibold">Key</label>
                      <select
                        value={allDetailKeys.includes(attr.key) ? attr.key : (attr.key ? "__CUSTOM__" : "")}
                        onChange={(e) => {
                          const newAttr = [...formData.attributesDetails];
                          if (e.target.value === "__CUSTOM__") {
                            newAttr[idx].key = attr.key || "";
                          } else {
                            newAttr[idx].key = e.target.value;
                          }
                          setFormData(f => ({ ...f, attributesDetails: newAttr }));
                        }}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      >
                        <option value="">เลือกจากรายการ</option>
                        {allDetailKeys.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                        <option value="__CUSTOM__" className="font-bold text-primary">+ พิมพ์ Key เอง</option>
                      </select>
                      <p className="text-xs text-on-surface-variant mt-1">เลือกจากรายการที่มี หรือพิมพ์ Key ใหม่</p>

                      {(!allDetailKeys.includes(attr.key)) && (
                        <input
                          type="text"
                          placeholder="พิมพ์ Key ของคุณ (เช่น weight, model)"
                          value={attr.key}
                          onChange={(e) => {
                            const newAttr = [...formData.attributesDetails];
                            newAttr[idx].key = e.target.value;
                            setFormData(f => ({ ...f, attributesDetails: newAttr }));
                          }}
                          className="w-full mt-2 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs text-on-surface-variant mb-1 font-semibold">Value</label>
                      <input type="text" placeholder="Value (เช่น ASUS)" value={attr.value} onChange={(e) => {
                        const newAttr = [...formData.attributesDetails];
                        newAttr[idx].value = e.target.value;
                        setFormData(f => ({ ...f, attributesDetails: newAttr }));
                      }} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    </div>

                    <div className="flex items-center mt-6">
                      <button type="button" onClick={() => {
                        const newAttr = formData.attributesDetails.filter((_, i) => i !== idx);
                        setFormData(f => ({ ...f, attributesDetails: newAttr }));
                      }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer bg-transparent border-none flex items-center justify-center"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 mt-6 border-t border-outline-variant/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-outline-variant text-on-surface rounded-xl font-medium hover:bg-surface-container active:scale-95 transition-all cursor-pointer bg-transparent"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">{modalMode === "add" ? "add" : "save"}</span>
                      {modalMode === "add" ? "เพิ่มสินค้า" : "บันทึกการแก้ไข"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
