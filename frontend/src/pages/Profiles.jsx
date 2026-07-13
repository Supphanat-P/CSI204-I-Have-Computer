import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Profiles() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  // 1. Session & Authentication check
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  });

  useEffect(() => {
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบเพื่อเข้าสู่หน้าโปรไฟล์");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Active Sidebar Tab state
  // Tabs: 'profile', 'shipping_address', 'tax_address', 'orders', 'wishlist', 'shipping_status', 'payment_methods'
  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.activeTab || "profile";
  });

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // 2. User Profile details state (load from localStorage)
  const [userProfile, setUserProfile] = useState(() => {
    const curr = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (curr) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const matched = users.find((u) => u.id === curr.id);
      if (matched) {
        return {
          firstName: matched.name.split(" ")[0] || "",
          lastName: matched.name.split(" ").slice(1).join(" ") || "",
          email: matched.email || "",
          phone: matched.phone || "-",
          birthDate: matched.birthDate || "-",
          lineId: matched.lineId || "-",
          facebook: matched.facebook || "-",
        };
      }
      return {
        firstName: curr.name.split(" ")[0] || "",
        lastName: curr.name.split(" ").slice(1).join(" ") || "",
        email: curr.email || "",
        phone: "-",
        birthDate: "-",
        lineId: "-",
        facebook: "-",
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "-",
      birthDate: "-",
      lineId: "-",
      facebook: "-",
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });

  // 3. Multiple Shipping Addresses state (load from localStorage)
  const [shippingAddresses, setShippingAddresses] = useState(() => {
    const curr = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (curr) {
      const saved = localStorage.getItem(`shippingAddresses_${curr.id}`);
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  // 4. Multiple Tax Invoice Addresses state (load from localStorage)
  const [taxAddresses, setTaxAddresses] = useState(() => {
    const curr = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (curr) {
      const saved = localStorage.getItem(`taxAddresses_${curr.id}`);
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  // Sync address changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`shippingAddresses_${currentUser.id}`, JSON.stringify(shippingAddresses));
    }
  }, [shippingAddresses, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`taxAddresses_${currentUser.id}`, JSON.stringify(taxAddresses));
    }
  }, [taxAddresses, currentUser]);

  // Address Modal, Search and Filter states
  const [addressSearch, setAddressSearch] = useState("");
  const [addressTagFilter, setAddressTagFilter] = useState("all"); // 'all' | 'home' | 'work' | 'other'
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null if adding new address
  const [addressModalType, setAddressModalType] = useState("shipping"); // 'shipping' | 'tax'

  // Temporary state for the address being added/edited inside modal
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    details: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
    type: "home",
    isDefault: false,
  });

  // Mock data for other tabs
  const [orders, setOrders] = useState(() => {
    const curr = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (curr) {
      const saved = localStorage.getItem(`orders_${curr.id}`);
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: "IHC-98241",
        date: "2026-06-15",
        items: "Intel Core i7-14700K + ASUS Prime Z790-A Wifi",
        total: 24900,
        status: "จัดส่งแล้ว",
      },
      {
        id: "IHC-97304",
        date: "2026-07-02",
        items: "Razer DeathAdder V3 Pro Wireless",
        total: 4990,
        status: "เสร็จสิ้น",
      },
    ];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
    }
  }, [orders, currentUser]);

  const handleConfirmDelivery = (orderId) => {
    if (window.confirm("คุณได้รับสินค้าและต้องการยืนยันว่าการจัดส่งเสร็จสิ้นใช่หรือไม่?")) {
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.id === orderId ? { ...ord, status: "เสร็จสิ้น" } : ord
        )
      );
      alert("🎉 ยืนยันการรับสินค้าสำเร็จ! ข้อมูลคำสั่งซื้อถูกบันทึกในประวัติการสั่งซื้อแล้ว");
    }
  };

  const [products, setProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const loadFavorites = () => {
    const curr = JSON.parse(localStorage.getItem("currentUser") || "null");
    const favoritesKey = curr ? `favorites_${curr.id}` : "favorites_guest";
    const favs = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    setFavoriteIds(favs);
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favoritesUpdated", loadFavorites);

    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products for wishlist", err);
      }
    }
    fetchProducts();

    return () => {
      window.removeEventListener("favoritesUpdated", loadFavorites);
    };
  }, []);

  const wishlist = useMemo(() => {
    return products.filter((p) => favoriteIds.includes(p.id));
  }, [products, favoriteIds]);

  const handleUnlike = (productId) => {
    const curr = JSON.parse(localStorage.getItem("currentUser") || "null");
    const favoritesKey = curr ? `favorites_${curr.id}` : "favorites_guest";
    let favs = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    favs = favs.filter((id) => id !== productId);
    localStorage.setItem(favoritesKey, JSON.stringify(favs));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const [payments, setPayments] = useState([
    {
      id: 1,
      type: "Visa",
      cardNumber: "**** **** **** 4321",
      holder: "THEEPAKORN R.",
      expiry: "12/28",
      isDefault: true,
    },
  ]);

  // Profile Edit functions
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          id: currentUser.id,
          name: `${tempProfile.firstName} ${tempProfile.lastName}`,
          email: tempProfile.email,
          phone: tempProfile.phone,
          birthDate: tempProfile.birthDate,
          lineId: tempProfile.lineId,
          facebook: tempProfile.facebook,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "ไม่สามารถบันทึกข้อมูลได้");
        return;
      }

      const updatedUser = data.user;
      
      setUserProfile({
        firstName: updatedUser.name.split(" ")[0] || "",
        lastName: updatedUser.name.split(" ").slice(1).join(" ") || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "-",
        birthDate: updatedUser.birthDate || "-",
        lineId: updatedUser.lineId || "-",
        facebook: updatedUser.facebook || "-",
      });

      // Save to localStorage users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            birthDate: updatedUser.birthDate,
            lineId: updatedUser.lineId,
            facebook: updatedUser.facebook,
          };
        }
        return u;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Update current user details in session
      const updatedCurrentUser = {
        ...currentUser,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        birthDate: updatedUser.birthDate,
        lineId: updatedUser.lineId,
        facebook: updatedUser.facebook,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
      setCurrentUser(updatedCurrentUser);

      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleCancelProfileEdit = () => {
    setTempProfile({ ...userProfile });
    setIsEditingProfile(false);
  };

  // Address Actions Handler
  const openAddressModal = (type, address = null) => {
    setAddressModalType(type);
    setEditingAddress(address);
    if (address) {
      setAddressForm({ ...address });
    } else {
      setAddressForm({
        name: "",
        phone: "",
        details: "",
        subdistrict: "",
        district: "",
        province: "",
        postalCode: "",
        type: "home",
        isDefault: false,
      });
    }
    setIsAddressModalOpen(true);
  };

  const saveAddress = (e) => {
    e.preventDefault();
    const isShipping = addressModalType === "shipping";
    const addressList = isShipping ? shippingAddresses : taxAddresses;
    const setAddressList = isShipping ? setShippingAddresses : setTaxAddresses;

    let updatedAddresses = [];
    const isNewDefault = addressForm.isDefault;

    if (editingAddress) {
      // Editing existing address
      updatedAddresses = addressList.map((addr) => {
        if (addr.id === editingAddress.id) {
          return { ...addressForm };
        }
        return isNewDefault ? { ...addr, isDefault: false } : addr;
      });
    } else {
      // Adding new address
      const newAddress = {
        ...addressForm,
        id: addressList.length > 0 ? Math.max(...addressList.map((a) => a.id)) + 1 : 1,
      };

      if (isNewDefault) {
        updatedAddresses = addressList.map((addr) => ({ ...addr, isDefault: false }));
        updatedAddresses.push(newAddress);
      } else {
        if (addressList.length === 0) {
          newAddress.isDefault = true;
        }
        updatedAddresses = [...addressList, newAddress];
      }
    }

    setAddressList(updatedAddresses);
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const deleteAddress = (type, id) => {
    const isShipping = type === "shipping";
    const addressList = isShipping ? shippingAddresses : taxAddresses;
    const setAddressList = isShipping ? setShippingAddresses : setTaxAddresses;

    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?")) {
      const remaining = addressList.filter((addr) => addr.id !== id);
      if (remaining.length > 0 && !remaining.some((addr) => addr.isDefault)) {
        remaining[0].isDefault = true;
      }
      setAddressList(remaining);
    }
  };

  const setAsDefault = (type, id) => {
    const isShipping = type === "shipping";
    const addressList = isShipping ? shippingAddresses : taxAddresses;
    const setAddressList = isShipping ? setShippingAddresses : setTaxAddresses;

    const updated = addressList.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddressList(updated);
  };

  // Get active list of addresses based on selection
  const currentAddresses = activeTab === "shipping_address" ? shippingAddresses : taxAddresses;

  // Filtered Addresses
  const filteredAddresses = currentAddresses.filter((addr) => {
    const matchesSearch =
      addr.name.toLowerCase().includes(addressSearch.toLowerCase()) ||
      addr.phone.includes(addressSearch) ||
      addr.details.toLowerCase().includes(addressSearch.toLowerCase()) ||
      addr.province.toLowerCase().includes(addressSearch.toLowerCase()) ||
      addr.subdistrict.toLowerCase().includes(addressSearch.toLowerCase()) ||
      addr.district.toLowerCase().includes(addressSearch.toLowerCase());

    const matchesTag = addressTagFilter === "all" || addr.type === addressTagFilter;

    return matchesSearch && matchesTag;
  });

  // Helper to render product items vertically (can display list of objects or fallback to legacy string)
  const renderItemsList = (items) => {
    if (Array.isArray(items)) {
      return (
        <div className="space-y-2 mt-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-contain bg-white border border-outline-variant/30 rounded-lg shrink-0 p-1"
                />
              ) : (
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined text-xl">image</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-bold text-on-surface truncate">{item.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {item.brand && <span>แบรนด์: {item.brand} | </span>}
                  จำนวน: <span className="font-semibold text-primary">{item.quantity}</span> ชิ้น | ราคา: {item.price.toLocaleString()}฿
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    // Fallback if legacy comma-separated string
    return (
      <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 mt-2">
        <p className="text-body-sm text-on-surface-variant">{items}</p>
      </div>
    );
  };

  if (!currentUser) {
    return null; // Don't render anything if redirecting
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-margin-desktop font-sans text-on-surface">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col lg:flex-row gap-gutter items-start">
          
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-80 shrink-0 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            
            {/* Header / Brand label in Sidebar */}
            <div className="p-6 border-b border-outline-variant bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">account_circle</span>
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface text-body-lg">
                    {userProfile.firstName} {userProfile.lastName}
                  </h3>
                  <p className="text-sm text-on-surface-variant break-all">{userProfile.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Group 1: รายการ */}
            <div className="p-4 border-b border-outline-variant">
              <span className="px-4 text-[11px] font-bold tracking-widest text-outline uppercase block mb-2">
                รายการ
              </span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left rounded-xl transition-all cursor-pointer ${
                    activeTab === "orders"
                      ? "flex items-center gap-3 px-4 py-3 text-primary border-l-4 border-primary bg-primary/5 font-semibold"
                      : "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <span className="text-body-md">คำสั่งซื้อ</span>
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full text-left rounded-xl transition-all cursor-pointer ${
                    activeTab === "wishlist"
                      ? "flex items-center gap-3 px-4 py-3 text-primary border-l-4 border-primary bg-primary/5 font-semibold"
                      : "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">favorite</span>
                  <span className="text-body-md">สินค้าที่ถูกใจ</span>
                </button>
                <button
                  onClick={() => setActiveTab("shipping_status")}
                  className={`w-full text-left rounded-xl transition-all cursor-pointer ${
                    activeTab === "shipping_status"
                      ? "flex items-center gap-3 px-4 py-3 text-primary border-l-4 border-primary bg-primary/5 font-semibold"
                      : "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">local_shipping</span>
                  <span className="text-body-md">เช็คสถานะการจัดส่ง</span>
                </button>
              </div>
            </div>

            {/* Menu Group 2: บัญชี */}
            <div className="p-4">
              <span className="px-4 text-[11px] font-bold tracking-widest text-outline uppercase block mb-2">
                บัญชี
              </span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left rounded-xl transition-all cursor-pointer ${
                    activeTab === "profile"
                      ? "flex items-center gap-3 px-4 py-3 text-primary border-l-4 border-primary bg-primary/5 font-semibold"
                      : "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">person</span>
                  <span className="text-body-md">ข้อมูลส่วนตัว</span>
                </button>
                <button
                  onClick={() => setActiveTab("shipping_address")}
                  className={`w-full text-left rounded-xl transition-all cursor-pointer ${
                    activeTab === "shipping_address"
                      ? "flex items-center gap-3 px-4 py-3 text-primary border-l-4 border-primary bg-primary/5 font-semibold"
                      : "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">location_on</span>
                  <span className="text-body-md">ที่อยู่สำหรับจัดส่ง</span>
                </button>
                <button
                  onClick={() => setActiveTab("tax_address")}
                  className={`w-full text-left rounded-xl transition-all cursor-pointer ${
                    activeTab === "tax_address"
                      ? "flex items-center gap-3 px-4 py-3 text-primary border-l-4 border-primary bg-primary/5 font-semibold"
                      : "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">receipt_long</span>
                  <span className="text-body-md">ที่อยู่สำหรับออกใบกำกับภาษี</span>
                </button>
                <button
                  onClick={() => setActiveTab("payment_methods")}
                  className={`w-full text-left rounded-xl transition-all cursor-pointer ${
                    activeTab === "payment_methods"
                      ? "flex items-center gap-3 px-4 py-3 text-primary border-l-4 border-primary bg-primary/5 font-semibold"
                      : "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className="text-body-md">ช่องทางการชำระเงิน</span>
                </button>
              </div>
            </div>

            {/* Menu Group 3: ผู้ดูแลระบบ (visible only for admin) */}
            {currentUser?.role === "admin" && (
              <div className="p-4 border-t border-outline-variant">
                <span className="px-4 text-[11px] font-bold tracking-widest text-primary uppercase block mb-2">
                  ผู้ดูแลระบบ
                </span>
                <div className="flex flex-col gap-1">
                  <Link
                    to="/admin"
                    className="w-full text-left rounded-xl transition-all flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/10 font-semibold"
                  >
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                    <span className="text-body-md">จัดการสินค้า / สต็อก</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <div className="p-4 border-t border-outline-variant bg-surface-container-low">
              <button
                onClick={() => {
                  if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
                    localStorage.removeItem("currentUser");
                    navigate("/login");
                  }
                }}
                className="w-full rounded-xl transition-all flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-750 hover:bg-red-50 cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-body-md">ออกจากระบบ</span>
              </button>
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
            
            {/* VIEW 1: ข้อมูลส่วนตัว (Personal Info) */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-3xl">badge</span>
                    <h2 className="text-2xl font-bold text-on-surface">ข้อมูลส่วนตัว</h2>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setTempProfile({ ...userProfile });
                        setIsEditingProfile(true);
                      }}
                      className="bg-primary/10 text-primary hover:bg-primary/20 px-5 py-2 rounded-xl text-body-sm font-semibold transition-all active:scale-95 cursor-pointer"
                    >
                      แก้ไขข้อมูลส่วนตัว
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  /* Editing Mode Form */
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                          ชื่อ
                        </label>
                        <input
                          type="text"
                          required
                          value={tempProfile.firstName}
                          onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                          นามสกุล
                        </label>
                        <input
                          type="text"
                          required
                          value={tempProfile.lastName}
                          onChange={(e) => setTempProfile({ ...tempProfile, lastName: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                          อีเมล
                        </label>
                        <input
                          type="email"
                          required
                          value={tempProfile.email}
                          onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                          หมายเลขโทรศัพท์
                        </label>
                        <input
                          type="text"
                          value={tempProfile.phone}
                          onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                          วัน / เดือน / ปีเกิด
                        </label>
                        <input
                          type="text"
                          placeholder="เช่น 01/01/2543"
                          value={tempProfile.birthDate}
                          onChange={(e) => setTempProfile({ ...tempProfile, birthDate: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                          ไลน์ไอดี
                        </label>
                        <input
                          type="text"
                          value={tempProfile.lineId}
                          onChange={(e) => setTempProfile({ ...tempProfile, lineId: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                          เฟสบุ๊ค
                        </label>
                        <input
                          type="text"
                          value={tempProfile.facebook}
                          onChange={(e) => setTempProfile({ ...tempProfile, facebook: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleCancelProfileEdit}
                        className="border border-outline px-6 py-2.5 rounded-xl font-medium text-on-surface hover:bg-surface-container transition-all cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-white hover:bg-primary/95 px-6 py-2.5 rounded-xl font-medium transition-all active:scale-95 cursor-pointer"
                      >
                        บันทึกข้อมูล
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode */
                  <div className="space-y-6">
                    {/* User overview and counts card */}
                    <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                      
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-full bg-outline-variant/40 flex items-center justify-center text-outline text-4xl shrink-0">
                        <span className="material-symbols-outlined text-5xl">person</span>
                      </div>

                      {/* Name */}
                      <div className="text-center md:text-left flex-1">
                        <h3 className="text-xl font-bold text-on-surface">
                          {userProfile.firstName} {userProfile.lastName}
                        </h3>
                        <p className="text-sm text-on-surface-variant">สมาชิกระดับทั่วไป</p>
                      </div>

                      {/* Counter badging */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                        <div className="bg-white border border-outline-variant p-3.5 rounded-xl text-center shrink-0 min-w-[90px]">
                          <span className="text-2xl font-bold text-primary block leading-none">0</span>
                          <span className="text-xs text-on-surface-variant">เสร็จสิ้น</span>
                        </div>
                        <div className="bg-white border border-outline-variant p-3.5 rounded-xl text-center shrink-0 min-w-[90px]">
                          <span className="text-2xl font-bold text-primary block leading-none">0</span>
                          <span className="text-xs text-on-surface-variant">จัดส่งแล้ว</span>
                        </div>
                        <div className="bg-white border border-outline-variant p-3.5 rounded-xl text-center shrink-0 min-w-[90px]">
                          <span className="text-2xl font-bold text-primary block leading-none">0</span>
                          <span className="text-xs text-on-surface-variant">รอดำเนินการ</span>
                        </div>
                        <div className="bg-white border border-outline-variant p-3.5 rounded-xl text-center shrink-0 min-w-[90px]">
                          <span className="text-2xl font-bold text-primary block leading-none">0</span>
                          <span className="text-xs text-on-surface-variant">รอชำระเงิน</span>
                        </div>
                      </div>
                    </div>

                    {/* Details table block */}
                    <div className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs text-outline font-medium uppercase mb-1">ชื่อ - นามสกุล</p>
                          <p className="text-on-surface font-medium">{userProfile.firstName} {userProfile.lastName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-outline font-medium uppercase mb-1">อีเมล</p>
                          <p className="text-on-surface font-medium break-all">{userProfile.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-outline font-medium uppercase mb-1">หมายเลขโทรศัพท์</p>
                          <p className="text-on-surface font-medium">{userProfile.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-outline font-medium uppercase mb-1">วัน / เดือน / ปีเกิด</p>
                          <p className="text-on-surface font-medium">{userProfile.birthDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-outline font-medium uppercase mb-1">ไลน์ไอดี</p>
                          <p className="text-on-surface font-medium">{userProfile.lineId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-outline font-medium uppercase mb-1">เฟสบุ๊ค</p>
                          <p className="text-on-surface font-medium">{userProfile.facebook}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2 & 3: ที่อยู่สำหรับจัดส่ง & ที่อยู่สำหรับออกใบกำกับภาษี (Address Lists) */}
            {(activeTab === "shipping_address" || activeTab === "tax_address") && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {activeTab === "shipping_address" ? "location_on" : "receipt_long"}
                    </span>
                    <h2 className="text-2xl font-bold text-on-surface">
                      {activeTab === "shipping_address" ? "ที่อยู่สำหรับจัดส่ง" : "ที่อยู่สำหรับออกใบกำกับภาษี"}
                    </h2>
                  </div>
                  <button
                    onClick={() => openAddressModal(activeTab === "shipping_address" ? "shipping" : "tax")}
                    className="bg-primary text-white hover:bg-primary-container hover:text-on-primary-container px-5 py-2.5 rounded-xl text-body-sm font-semibold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">add_location</span>
                    <span>เพิ่มที่อยู่ใหม่</span>
                  </button>
                </div>

                {/* Filters Row */}
                <div className="bg-surface-container-low border border-outline-variant p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                  {/* Search box */}
                  <div className="relative w-full md:flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อผู้รับ, เบอร์โทรศัพท์, จังหวัด หรือรายละเอียดที่อยู่..."
                      value={addressSearch}
                      onChange={(e) => setAddressSearch(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-body-sm"
                    />
                  </div>

                  {/* Tag Quick Filters */}
                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth">
                    <span className="text-body-sm text-on-surface-variant hidden md:inline whitespace-nowrap">
                      ประเภทที่อยู่:
                    </span>
                    {[
                      { key: "all", label: "ทั้งหมด" },
                      { key: "home", label: "บ้าน" },
                      { key: "work", label: "ที่ทำงาน" },
                      { key: "other", label: "อื่นๆ" },
                    ].map((pill) => (
                      <button
                        key={pill.key}
                        onClick={() => setAddressTagFilter(pill.key)}
                        className={`px-4 py-2 rounded-xl text-body-sm font-semibold transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                          addressTagFilter === pill.key
                            ? "bg-primary text-white"
                            : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Cards Grid */}
                {filteredAddresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          addr.isDefault
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-white border-outline-variant hover:border-primary/50"
                        }`}
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex justify-between items-center gap-2 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                                addr.type === "home"
                                  ? "bg-green-100 text-green-700"
                                  : addr.type === "work"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {addr.type === "home" ? "บ้าน" : addr.type === "work" ? "ที่ทำงาน" : "อื่นๆ"}
                            </span>
                            {addr.isDefault && (
                              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                เริ่มต้น
                              </span>
                            )}
                          </div>

                          {/* Recipient info */}
                          <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-lg text-outline">person</span>
                            {addr.name}
                          </h4>
                          <p className="text-body-sm font-medium text-on-surface-variant mb-2.5 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-lg text-outline">call</span>
                            {addr.phone}
                          </p>

                          {/* Address content */}
                          <p className="text-body-sm text-on-surface-variant leading-relaxed mb-4 flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-lg text-outline shrink-0 mt-0.5">location_on</span>
                            <span>
                              {addr.details} ต. {addr.subdistrict} อ. {addr.district} จ. {addr.province} {addr.postalCode}
                            </span>
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center border-t border-outline-variant pt-3 mt-2">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => setAsDefault(activeTab === "shipping_address" ? "shipping" : "tax", addr.id)}
                              className="text-primary hover:text-primary-container text-body-sm font-semibold transition-all active:scale-95 cursor-pointer"
                            >
                              ตั้งเป็นที่อยู่เริ่มต้น
                            </button>
                          ) : (
                            <div className="text-xs text-primary/70 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              <span>ที่อยู่หลักสำหรับการจัดส่ง</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openAddressModal(activeTab === "shipping_address" ? "shipping" : "tax", addr)}
                              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-all cursor-pointer"
                              title="แก้ไขที่อยู่"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => deleteAddress(activeTab === "shipping_address" ? "shipping" : "tax", addr.id)}
                              className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="ลบที่อยู่"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">location_off</span>
                    <h3 className="font-bold text-lg text-on-surface mb-1">ไม่พบข้อมูลที่อยู่</h3>
                    <p className="text-body-sm text-on-surface-variant max-w-sm">
                      ไม่มีที่อยู่ตามเงื่อนไขที่กรอง/ค้นหา ลองเพิ่มที่อยู่ใหม่เพื่อเริ่มต้นการสั่งซื้อพรีเมียมเทค
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: คำสั่งซื้อ (Orders) */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
                  <span className="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
                  <h2 className="text-2xl font-bold text-on-surface">คำสั่งซื้อของฉัน</h2>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-outline-variant rounded-2xl p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-on-surface text-body-lg">หมายเลขสั่งซื้อ: {ord.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            ord.status === "เสร็จสิ้น" ? "bg-green-100 text-green-700" :
                            ord.status === "จัดส่งแล้ว" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>{ord.status}</span>
                        </div>
                        {renderItemsList(ord.items)}
                        <p className="text-xs text-outline pt-1">วันที่ทำรายการ: {ord.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-on-surface-variant">ยอดรวมสุทธิ</p>
                        <p className="text-xl font-bold text-primary">{ord.total.toLocaleString()}฿</p>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 mt-2 justify-end">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="text-xs font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none"
                          >
                            ดูรายละเอียดคำสั่งซื้อ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 5: สินค้าที่ถูกใจ (Wishlist) */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
                  <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
                  <h2 className="text-2xl font-bold text-on-surface">สินค้าที่ชอบ</h2>
                </div>

                {wishlist.length === 0 ? (
                  <div className="py-16 text-center text-on-surface-variant flex flex-col items-center">
                    <div className="w-16 h-16 bg-error/5 rounded-full flex items-center justify-center text-error mb-4 shadow-inner">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                        favorite
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-on-surface mb-1">ยังไม่มีสินค้าที่ถูกใจ</h3>
                    <p className="text-sm text-on-surface-variant max-w-xs mb-6">คุณสามารถกดปุ่มรูปหัวใจบนหน้าสินค้าที่คุณชื่นชอบเพื่อเก็บไว้ดูได้ที่นี่</p>
                    <button
                      onClick={() => navigate("/products")}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl text-body-sm font-semibold hover:bg-primary-fixed-dim hover:text-primary-fixed transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                    >
                      ไปเลือกช็อปสินค้า
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-outline-variant rounded-2xl p-4 bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative">
                        <div>
                          <div className="aspect-square w-full bg-surface-container rounded-xl overflow-hidden mb-3 relative flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain p-2" />
                            <button
                              onClick={() => handleUnlike(item.id)}
                              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                            </button>
                          </div>
                          <h4 className="font-bold text-on-surface text-body-md line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-on-surface-variant mb-2">{item.brand} | {item.category || item.productType}</p>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant">
                          <span className="font-bold text-primary">{item.price.toLocaleString()}฿</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-primary text-white text-xs px-3.5 py-1.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container font-semibold transition-all cursor-pointer"
                          >
                            ใส่รถเข็น
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 6: เช็คสถานะการจัดส่ง (Shipping Status) */}
            {activeTab === "shipping_status" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
                  <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                  <h2 className="text-2xl font-bold text-on-surface">ตรวจสอบการจัดส่ง</h2>
                </div>

                {orders.length > 0 ? (
                  orders.map((ord) => (
                    <div key={ord.id} className="border border-outline-variant rounded-2xl p-5 bg-white space-y-4 mb-4">
                      <div className="flex items-center justify-between border-b border-outline-variant pb-3 flex-wrap gap-2">
                        <div>
                          <span className="text-xs text-outline block">พัสดุสำหรับสั่งซื้อ</span>
                          <span className="font-bold text-on-surface">#{ord.id}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-outline block">ผู้ให้บริการจัดส่ง</span>
                        </div>
                      </div>
                      <div className="py-2">
                        <div className="text-body-sm text-on-surface-variant block mb-2">
                          <b>รายการสินค้า:</b>
                          {renderItemsList(ord.items)}
                        </div>
                        {ord.shippingAddress && (
                          <span className="text-body-sm text-on-surface-variant block mb-1"><b>ที่อยู่จัดส่ง:</b> {ord.shippingAddress}</span>
                        )}
                        <div className="flex items-center gap-2 text-body-sm mt-2 font-semibold">
                          <span className="material-symbols-outlined text-lg">local_shipping</span>
                          <span className={ord.status === "เสร็จสิ้น" ? "text-green-600" : "text-primary"}>
                            {ord.status === "เสร็จสิ้น" ? "จัดส่งสินค้าสำเร็จเรียบร้อยแล้ว" :
                             ord.status === "รอดำเนินการ" ? "กำลังจัดเตรียมสินค้าเพื่อจัดส่ง" :
                             "อยู่ระหว่างนำส่งพัสดุ (พัสดุจะถึงภายในวันนี้)"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Timeline tracker */}
                      <div className="border-t border-outline-variant pt-4 space-y-3.5">
                        {ord.status === "เสร็จสิ้น" ? (
                          <>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                                <div className="w-0.5 h-12 bg-green-300"></div>
                              </div>
                              <div>
                                <span className="text-xs text-green-600 font-bold block">คลังสินค้าเตรียมและจัดส่งพัสดุ</span>
                                <span className="text-xs text-on-surface-variant">จัดส่งพัสดุออกจากคลังสินค้าเข้าระบบ</span>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                                <div className="w-0.5 h-12 bg-green-300"></div>
                              </div>
                              <div>
                                <span className="text-xs text-green-600 font-bold block">นำส่งพัสดุไปยังผู้รับ</span>
                                <span className="text-xs text-on-surface-variant">พนักงานส่งพัสดุกำลังนำส่งพัสดุไปยังปลายทาง</span>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                              </div>
                              <div>
                                <span className="text-xs text-green-600 font-bold block">จัดส่งสำเร็จ</span>
                                <span className="text-xs text-on-surface-variant">พัสดุได้รับการเซ็นรับและตรวจสอบความเรียบร้อยเสร็จสิ้น</span>
                              </div>
                            </div>
                          </>
                        ) : ord.status === "รอดำเนินการ" ? (
                          <>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                                <div className="w-0.5 h-12 bg-outline-variant"></div>
                              </div>
                              <div>
                                <span className="text-xs text-green-600 font-bold block">อยู่ระหว่างเตรียมจัดส่ง</span>
                                <span className="text-xs text-on-surface-variant">คลังสินค้าได้รับการชำระเงินและกำลังจัดเตรียมบรรจุสินค้าลงกล่อง</span>
                              </div>
                            </div>
                            <div className="flex gap-3 opacity-60">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-outline-variant z-10"></div>
                              </div>
                              <div>
                                <span className="text-xs text-outline font-bold block">รอส่งมอบบริษัทขนส่ง</span>
                                <span className="text-xs text-on-surface-variant">เตรียมส่งมอบพัสดุให้กับเจ้าหน้าที่ขนส่ง  </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                                <div className="w-0.5 h-12 bg-green-300"></div>
                              </div>
                              <div>
                                <span className="text-xs text-green-600 font-bold block">วานนี้ - ส่งพัสดุออกจากคลัง</span>
                                <span className="text-xs text-on-surface-variant">คลังสินค้าได้จัดเตรียมสินค้าและส่งมอบพัสดุเข้าระบบ</span>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                                <div className="w-0.5 h-12 bg-green-300"></div>
                              </div>
                              <div>
                                <span className="text-xs text-green-600 font-bold block">09:15 น. - ถึงสาขาปลายทาง</span>
                                <span className="text-xs text-on-surface-variant">พัสดุถึงศูนย์คัดแยกสาขาจตุจักร</span>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 z-10"></div>
                              </div>
                              <div>
                                <span className="text-xs text-green-600 font-bold block">12:30 น. - นำส่งพัสดุ</span>
                                <span className="text-xs text-on-surface-variant">พนักงานส่งพัสดุกำลังนำส่งพัสดุไปยังปลายทาง</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Complete order receipt action button */}
                      {ord.status !== "เสร็จสิ้น" && (
                        <div className="border-t border-outline-variant pt-4 flex justify-end">
                          <button
                            onClick={() => handleConfirmDelivery(ord.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border-none"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                            <span>ยืนยันได้รับสินค้าเรียบร้อย</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">local_shipping</span>
                    <h3 className="font-bold text-lg text-on-surface mb-1">ไม่มีข้อมูลคำสั่งซื้อ</h3>
                    <p className="text-body-sm text-on-surface-variant max-w-sm">
                      คุณยังไม่มีคำสั่งซื้อใดๆ ในบัญชีนี้เพื่อใช้ตรวจสอบการจัดส่ง
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 7: ช่องทางการชำระเงิน (Payment Methods) */}
            {activeTab === "payment_methods" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
                  <span className="material-symbols-outlined text-primary text-3xl">credit_card</span>
                  <h2 className="text-2xl font-bold text-on-surface">ช่องทางการชำระเงินของฉัน</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payments.map((pay) => (
                    <div key={pay.id} className="border border-primary bg-primary/5 rounded-2xl p-5 flex items-start gap-4">
                      <span className="material-symbols-outlined text-3xl text-primary">credit_card</span>
                      <div className="space-y-1">
                        <h4 className="font-bold text-on-surface">{pay.type} {pay.cardNumber}</h4>
                        <p className="text-xs text-on-surface-variant">ชื่อบนบัตร: {pay.holder}</p>
                        <p className="text-xs text-on-surface-variant">วันหมดอายุ: {pay.expiry}</p>
                        {pay.isDefault && (
                          <span className="inline-block mt-2 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                            เริ่มต้น
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-3xl">add_circle</span>
                    <span className="text-body-sm font-semibold">เพิ่มบัตรเครดิต/เดบิตใหม่</span>
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ADDRESS ADD/EDIT MODAL OVERLAY */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-outline-variant rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">
                  {editingAddress ? "edit_location" : "add_location"}
                </span>
                <span>
                  {editingAddress ? "แก้ไขข้อมูลที่อยู่" : "เพิ่มที่อยู่สำหรับจัดส่งใหม่"}
                </span>
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={saveAddress} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Recipient Name */}
                <div className="md:col-span-2">
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    {addressModalType === "shipping" ? "ชื่อ - นามสกุล ผู้รับ" : "ชื่อบริษัท / ชื่อผู้เสียภาษี"}
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    placeholder={addressModalType === "shipping" ? "ระบุชื่อจริงและนามสกุลผู้รับ" : "ระบุชื่อบริษัทเต็ม หรือชื่อ-นามสกุล"}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Recipient Phone */}
                <div>
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    หมายเลขโทรศัพท์
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="เช่น 0812345678"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Address type tag select */}
                <div>
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    ประเภทที่อยู่
                  </label>
                  <select
                    value={addressForm.type}
                    onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  >
                    <option value="home">บ้าน (Home)</option>
                    <option value="work">ที่ทำงาน (Work)</option>
                    <option value="other">อื่นๆ (Other)</option>
                  </select>
                </div>

                {/* Address Details */}
                <div className="md:col-span-2">
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    รายละเอียดที่อยู่
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={addressForm.details}
                    onChange={(e) => setAddressForm({ ...addressForm, details: e.target.value })}
                    placeholder="บ้านเลขที่, อาคาร, ชั้น, ซอย, ถนน หรือจุดสังเกต..."
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Subdistrict */}
                <div>
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    ตำบล / แขวง
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.subdistrict}
                    onChange={(e) => setAddressForm({ ...addressForm, subdistrict: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    อำเภอ / เขต
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    จังหวัด
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.province}
                    onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-body-sm font-medium text-on-surface-variant mb-1.5">
                    รหัสไปรษณีย์
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Default Address Checkbox */}
                <div className="md:col-span-2 flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="isDefaultAddress"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded text-primary border-outline-variant focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                  />
                  <label htmlFor="isDefaultAddress" className="text-body-sm text-on-surface-variant cursor-pointer select-none">
                    ตั้งที่อยู่นี้เป็นที่อยู่เริ่มต้น
                  </label>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="border border-outline px-6 py-2.5 rounded-xl font-medium text-on-surface hover:bg-surface-container transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/95 px-6 py-2.5 rounded-xl font-medium transition-all active:scale-95 cursor-pointer"
                >
                  บันทึกที่อยู่
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL OVERLAY */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-outline-variant rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden p-6 md:p-8 space-y-6 relative z-10">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <div>
                <h3 className="text-xl font-bold text-on-surface">รายละเอียดคำสั่งซื้อ</h3>
                <p className="text-xs text-outline mt-0.5">หมายเลข: #{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer transition-colors border-none bg-transparent"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-body-sm text-on-surface-variant max-h-[60vh] overflow-y-auto pr-1">
              {/* Order Status & Date */}
              <div className="flex justify-between items-center bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                <div>
                  <span className="text-xs text-outline block">วันที่สั่งซื้อ</span>
                  <span className="font-bold text-on-surface">{selectedOrder.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-outline block mb-0.5">สถานะการชำระเงิน/จัดส่ง</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedOrder.status === "เสร็จสิ้น" ? "bg-green-100 text-green-700" :
                    selectedOrder.status === "จัดส่งแล้ว" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">รายการสินค้า</span>
                {renderItemsList(selectedOrder.items)}
              </div>

              {/* Shipping Address & Contact */}
              {selectedOrder.recipientName && (
                <div className="space-y-3 pt-2">
                  <div className="border-t border-outline-variant/40 pt-3">
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1">ข้อมูลผู้รับสินค้า</span>
                    <p className="font-medium text-on-surface">{selectedOrder.recipientName} ({selectedOrder.recipientPhone})</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1">ที่อยู่จัดส่ง</span>
                    <p className="leading-relaxed">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {selectedOrder.paymentMethod && (
                <div className="border-t border-outline-variant/40 pt-3 flex justify-between">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">ช่องทางการชำระเงิน</span>
                  <span className="font-semibold text-on-surface">{selectedOrder.paymentMethod}</span>
                </div>
              )}

              {/* Total breakdown */}
              <div className="border-t border-outline-variant pt-4 flex justify-between items-center text-on-surface">
                <span className="font-bold text-body-md">ยอดชำระเงินทั้งหมด</span>
                <span className="text-primary font-bold text-xl">{selectedOrder.total.toLocaleString()}฿</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2.5 justify-end pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="border border-outline-variant px-5 py-2.5 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer flex items-center gap-1 bg-transparent"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>พิมพ์ใบสั่งซื้อ</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="bg-primary text-white hover:brightness-110 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 cursor-pointer border-none"
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
