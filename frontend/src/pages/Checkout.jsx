import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

const SearchableSelect = ({ placeholder, value, onChange, options, disabled, className, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(value || "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        disabled={disabled}
        required={required}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          if (e.target.value === "") {
            onChange("");
          }
        }}
        className={`${className} pr-10`}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/70 flex items-center">
        <span className="material-symbols-outlined text-lg">expand_more</span>
      </div>
      {isOpen && !disabled && (
        <ul className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-outline-variant bg-white py-1.5 shadow-lg outline-none text-sm text-on-surface">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <li
                key={i}
                onClick={() => {
                  onChange(opt);
                  setSearchTerm(opt);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-primary/5 hover:text-primary transition-colors text-left"
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-on-surface-variant/50 text-xs italic text-left">
              ไม่พบข้อมูล
            </li>
          )}
        </ul>
      )}
    </div>
  );
};


export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { showAlert } = useAlert();
  const [orderCompleted, setOrderCompleted] = useState(false);

  const [currentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  });

  useEffect(() => {
    if (!currentUser) {
      showAlert({
        title: "ต้องเข้าสู่ระบบ",
        message: "กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า"
      }).then(() => navigate("/login"));
    }
  }, [currentUser, navigate, showAlert]);

  useEffect(() => {
    if (currentUser && cart.length === 0 && !orderCompleted) {
      showAlert({
        title: "ตะกร้าว่างเปล่า",
        message: "ไม่มีสินค้าในตะกร้าสำหรับชำระเงิน"
      }).then(() => navigate("/"));
    }
  }, [cart, currentUser, navigate, orderCompleted, showAlert]);

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`shippingAddresses_${currentUser.id}`);
      const addresses = saved ? JSON.parse(saved) : [];
      if (addresses.length === 0) {
        // no-op: address validation is handled by the checkout form
      }
    }
  }, [currentUser, navigate]);

  // 2. Shipping calculation logic
  const SHIPPING_THRESHOLD = 1000;
  const STANDARD_SHIPPING_FEE = 100;
  const shippingFee = cartTotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = cartTotal + shippingFee;

  // 3. Address options (load from localStorage)
  const [savedAddresses] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`shippingAddresses_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 3.5 Credit Card options (load from localStorage)
  const [savedCards] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`payments_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedCardId, setSelectedCardId] = useState("");

  // Sync selected card
  useEffect(() => {
    if (savedCards.length > 0) {
      const defCard = savedCards.find((c) => c.isDefault) || savedCards[0];
      setSelectedCardId(String(defCard.id));
    }
  }, [savedCards]);

  // Billing / Shipping Form state
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Thailand administrative divisions API state and fetch
  const [thaiProvinces, setThaiProvinces] = useState([]);
  useEffect(() => {
    const fetchThaiAddresses = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province_with_district_and_sub_district.json");
        if (response.ok) {
          const data = await response.json();
          setThaiProvinces(data);
        }
      } catch (error) {
        console.error("Error fetching Thai address data:", error);
      }
    };
    fetchThaiAddresses();
  }, []);
  const [addressForm, setAddressForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    details: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
  });

  // Sync selected address to form
  useEffect(() => {
    if (selectedAddressId === "new" || selectedAddressId === "") {
      setAddressForm({
        name: currentUser?.name || "",
        phone: currentUser?.phone || "",
        details: "",
        subdistrict: "",
        district: "",
        province: "",
        postalCode: "",
      });
    } else {
      const matched = savedAddresses.find((addr) => String(addr.id) === String(selectedAddressId));
      if (matched) {
        setAddressForm({
          name: matched.name || "",
          phone: matched.phone || "",
          details: matched.details || "",
          subdistrict: matched.subdistrict || "",
          district: matched.district || "",
          province: matched.province || "",
          postalCode: matched.postalCode || "",
        });
      }
    }
  }, [selectedAddressId, savedAddresses]);

  // Set default address on mount if exists
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddr = savedAddresses.find((addr) => addr.isDefault) || savedAddresses[0];
      setSelectedAddressId(String(defaultAddr.id));
    } else {
      setSelectedAddressId("new");
    }
  }, [savedAddresses]);

  // 4. Payment method state
  const [paymentMethod, setPaymentMethod] = useState("transfer"); // transfer | promptpay | card | cod
  const [isPromptPayModalOpen, setIsPromptPayModalOpen] = useState(false);

  // Form error states
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!addressForm.name.trim()) newErrors.name = "กรุณากรอกชื่อ-นามสกุลผู้รับ";
    if (!addressForm.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    else if (!/^\d{9,10}$/.test(addressForm.phone.replace(/[-]/g, ""))) {
      newErrors.phone = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ควรมี 9-10 หลัก)";
    }
    if (!addressForm.details.trim()) newErrors.details = "กรุณากรอกรายละเอียดที่อยู่/บ้านเลขที่";
    if (!addressForm.subdistrict.trim()) newErrors.subdistrict = "กรุณากรอกตำบล/แขวง";
    if (!addressForm.district.trim()) newErrors.district = "กรุณากรอกอำเภอ/เขต";
    if (!addressForm.province.trim()) newErrors.province = "กรุณากรอกจังหวัด";
    if (!addressForm.postalCode.trim()) newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์";
    else if (!/^\d{5}$/.test(addressForm.postalCode)) {
      newErrors.postalCode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      await showAlert({
        title: "ข้อมูลไม่ครบถ้วน",
        message: "กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วนและถูกต้อง"
      });
      return;
    }

    if (paymentMethod === "card" && savedCards.length === 0) {
      showAlert({
        title: "ข้อมูลไม่ครบถ้วน",
        message: "กรุณากรอกข้อมูลบัตรให้ครบถ้วนและถูกต้อง"
      })
      return;
    }

    if (paymentMethod === "promptpay") {
      setIsPromptPayModalOpen(true);
    } else {
      processOrder();
    }
  };

  const processOrder = async () => {
    console.log("Process Order")
    const orderId = `IHC-${Math.floor(10000 + Math.random() * 90000)}`;

    const selectedCard = savedCards.find((c) => String(c.id) === String(selectedCardId));
    const cardDetail = selectedCard ? `${selectedCard.type} ${selectedCard.cardNumber}` : "บัตรเครดิต/เดบิต";

    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split("T")[0],
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total: grandTotal,
      status: "รอดำเนินการ",
      shippingAddress: `${addressForm.details} ต. ${addressForm.subdistrict} อ. ${addressForm.district} จ. ${addressForm.province} ${addressForm.postalCode}`,
      recipientName: addressForm.name,
      recipientPhone: addressForm.phone,
      paymentMethod: paymentMethod === "transfer" ? "โอนเงินผ่านบัญชีธนาคาร" :
        paymentMethod === "promptpay" ? "พร้อมเพย์ QR" :
          paymentMethod === "card" ? cardDetail : "เก็บเงินปลายทาง",
    };
    console.log(newOrder)
    console.log(currentUser);
    console.log(currentUser.token);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        const data = await response.json();
        await showAlert({
          title: "เกิดข้อผิดพลาด",
          message: data.message || "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อไปยังเซิร์ฟเวอร์",
        });
        return;
      }

      // Save order history in localStorage
      const savedOrdersKey = `orders_${currentUser.id}`;
      const existingOrders = JSON.parse(localStorage.getItem(savedOrdersKey) || "[]");

      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem(savedOrdersKey, JSON.stringify(updatedOrders));

      // Save new shipping address if selectedAddressId is "new"
      if (selectedAddressId === "new") {
        const shippingKey = `shippingAddresses_${currentUser.id}`;
        const currentSaved = JSON.parse(localStorage.getItem(shippingKey) || "[]");
        const nextId = currentSaved.length > 0 ? Math.max(...currentSaved.map((a) => a.id)) + 1 : 1;
        const newAddressObj = {
          id: nextId,
          name: addressForm.name,
          phone: addressForm.phone,
          details: addressForm.details,
          subdistrict: addressForm.subdistrict,
          district: addressForm.district,
          province: addressForm.province,
          postalCode: addressForm.postalCode,
          type: "home",
          isDefault: currentSaved.length === 0,
        };
        const updatedSaved = [...currentSaved, newAddressObj];
        localStorage.setItem(shippingKey, JSON.stringify(updatedSaved));
      }

      // Clear cart and redirect
      setOrderCompleted(true);
      clearCart();
      setIsPromptPayModalOpen(false);
      showAlert({
        title: "ทำรายการสั่งซื้อสำเร็จ",
        message: `หมายเลขคำสั่งซื้อของคุณคือ ${orderId}`
      }).then(() => navigate("/profile", { state: { activeTab: "ordeDrs" } }));
    } catch (err) {
      console.error(err);

      await showAlert({
        title: "เกิดข้อผิดพลาด",
        message: `เกิดข้อผิดพลาดจากโค้ด: ${err.message}`,
      });
      await showAlert({
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถติดต่อเซิร์ฟเวอร์เพื่อบันทึกการสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
      });
    }

    const updatedOrders = [newOrder, ...baseOrders];
    localStorage.setItem(savedOrdersKey, JSON.stringify(updatedOrders));

    // Clear cart and redirect
    setOrderCompleted(true);
    clearCart();
    setIsPromptPayModalOpen(false);

    showAlert({
      title: "ทำรายการสั่งซื้อสำเร็จ",
      message: `หมายเลขคำสั่งซื้อของคุณคือ ${orderId}`
    }).then(() => navigate("/profile", { state: { activeTab: "ordeDrs" } }));
  };


  const handleInputChange = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-specific error
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  if (!currentUser || (cart.length === 0 && !orderCompleted)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-[64px]">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-all duration-200 active:scale-90"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline-md my-0 font-display">ชำระเงิน</h1>
            <p className="text-sm text-on-surface-variant">กรอกข้อมูลการจัดส่งและทำการชำระเงินสำหรับสินค้าในตะกร้าของคุณ</p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Address Selection & Form Section */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                <h2 className="text-xl font-bold text-on-surface">ที่อยู่สำหรับจัดส่งสินค้า</h2>
              </div>

              {/* Saved Address Dropdown */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant">เลือกจากที่อยู่ที่บันทึกไว้</label>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-medium"
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        [{addr.isDefault ? "ที่อยู่หลัก" : "ที่อยู่รอง"}] ({addr.type === "home" ? "บ้าน" : addr.type === "work" ? "ที่ทำงาน" : "อื่นๆ"}) {addr.name} - {addr.details}, {addr.province} {addr.postalCode}
                      </option>
                    ))}
                    <option value="new">+ กรอกที่อยู่จัดส่งใหม่</option>
                  </select>
                </div>
              )}

              {/* Address Form Fields */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">ชื่อ - นามสกุลผู้รับ *</label>
                    <input
                      type="text"
                      value={addressForm.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={selectedAddressId !== "new"}
                      className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.name ? "border-error" : "border-outline-variant"
                        } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                      placeholder="สมชาย ใจดี"
                    />
                    {errors.name && <p className="text-xs text-error font-medium">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">เบอร์โทรศัพท์ติดต่อ *</label>
                    <input
                      type="text"
                      value={addressForm.phone}
                      minLength={10}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange("phone", value)
                      }}
                      disabled={selectedAddressId !== "new"}
                      className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.phone ? "border-error" : "border-outline-variant"
                        } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                      placeholder="0812345678"
                    />
                    {errors.phone && <p className="text-xs text-error font-medium">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant">ที่อยู่ / รายละเอียดที่อยู่ผู้รับ *</label>
                  <textarea
                    rows="3"
                    value={addressForm.details}
                    onChange={(e) => handleInputChange("details", e.target.value)}
                    disabled={selectedAddressId !== "new"}
                    className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.details ? "border-error" : "border-outline-variant"
                      } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                    placeholder="บ้านเลขที่, ถนน, หมู่บ้าน/อาคาร"
                  />
                  {errors.details && <p className="text-xs text-error font-medium">{errors.details}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Province */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">จังหวัด *</label>
                    {thaiProvinces.length > 0 ? (
                      <SearchableSelect
                        placeholder="-- พิมพ์ค้นหา / เลือกจังหวัด --"
                        required
                        value={addressForm.province}
                        onChange={(val) => {
                          setAddressForm((prev) => ({
                            ...prev,
                            province: val,
                            district: "",
                            subdistrict: "",
                            postalCode: ""
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            province: null,
                            district: null,
                            subdistrict: null,
                            postalCode: null
                          }));
                        }}
                        options={thaiProvinces.map((p) => p.name_th)}
                        disabled={selectedAddressId !== "new"}
                        className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm h-[42px] ${errors.province ? "border-error" : "border-outline-variant"
                          } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={addressForm.province}
                        onChange={(e) => handleInputChange("province", e.target.value)}
                        disabled={selectedAddressId !== "new"}
                        className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.province ? "border-error" : "border-outline-variant"
                          } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                        placeholder="กรุงเทพมหานคร"
                      />
                    )}
                    {errors.province && <p className="text-xs text-error font-medium">{errors.province}</p>}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">รหัสไปรษณีย์ *</label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      minLength={5}
                      maxLength={5}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange("postalCode", value)
                      }}
                      disabled={selectedAddressId !== "new"}
                      className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.postalCode ? "border-error" : "border-outline-variant"
                        } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                      placeholder="10330"
                    />
                    {errors.postalCode && <p className="text-xs text-error font-medium">{errors.postalCode}</p>}
                  </div>
                </div>

                {/* District and Subdistrict Grid */}
                {(addressForm.province || addressForm.district) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* District */}
                    {addressForm.province && (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface-variant">อำเภอ / เขต *</label>
                        {thaiProvinces.length > 0 ? (
                          <SearchableSelect
                            placeholder="-- พิมพ์ค้นหา / เลือกอำเภอ / เขต --"
                            required
                            value={addressForm.district}
                            onChange={(val) => {
                              setAddressForm((prev) => ({
                                ...prev,
                                district: val,
                                subdistrict: "",
                                postalCode: ""
                              }));
                              setErrors((prev) => ({
                                ...prev,
                                district: null,
                                subdistrict: null,
                                postalCode: null
                              }));
                            }}
                            options={(() => {
                              const provData = thaiProvinces.find(p => p.name_th === addressForm.province);
                              return provData ? provData.districts.map((d) => d.name_th) : [];
                            })()}
                            disabled={selectedAddressId !== "new"}
                            className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm h-[42px] ${errors.district ? "border-error" : "border-outline-variant"
                              } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={addressForm.district}
                            onChange={(e) => handleInputChange("district", e.target.value)}
                            disabled={selectedAddressId !== "new"}
                            className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.district ? "border-error" : "border-outline-variant"
                              } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                            placeholder="เขตปทุมวัน"
                          />
                        )}
                        {errors.district && <p className="text-xs text-error font-medium">{errors.district}</p>}
                      </div>
                    )}

                    {/* Subdistrict */}
                    {addressForm.province && addressForm.district && (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-on-surface-variant">ตำบล / แขวง *</label>
                        {thaiProvinces.length > 0 ? (
                          <SearchableSelect
                            placeholder="-- พิมพ์ค้นหา / เลือกตำบล / แขวง --"
                            required
                            value={addressForm.subdistrict}
                            onChange={(val) => {
                              const provData = thaiProvinces.find(p => p.name_th === addressForm.province);
                              const distData = provData ? provData.districts.find(d => d.name_th === addressForm.district) : null;
                              const subdistObj = distData ? distData.sub_districts.find(sd => sd.name_th === val) : null;
                              const zipCode = subdistObj ? String(subdistObj.zip_code) : "";
                              setAddressForm((prev) => ({
                                ...prev,
                                subdistrict: val,
                                postalCode: zipCode
                              }));
                              setErrors((prev) => ({
                                ...prev,
                                subdistrict: null,
                                postalCode: null
                              }));
                            }}
                            options={(() => {
                              const provData = thaiProvinces.find(p => p.name_th === addressForm.province);
                              const distData = provData ? provData.districts.find(d => d.name_th === addressForm.district) : null;
                              return distData ? distData.sub_districts.map((sd) => sd.name_th) : [];
                            })()}
                            disabled={selectedAddressId !== "new"}
                            className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm h-[42px] ${errors.subdistrict ? "border-error" : "border-outline-variant"
                              } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={addressForm.subdistrict}
                            onChange={(e) => handleInputChange("subdistrict", e.target.value)}
                            disabled={selectedAddressId !== "new"}
                            className={`w-full bg-white border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm ${errors.subdistrict ? "border-error" : "border-outline-variant"
                              } disabled:bg-surface-container/30 disabled:text-on-surface-variant/70`}
                            placeholder="ปทุมวัน"
                          />
                        )}
                        {errors.subdistrict && <p className="text-xs text-error font-medium">{errors.subdistrict}</p>}
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary text-2xl">payment</span>
                <h2 className="text-xl font-bold text-on-surface">ช่องทางการชำระเงิน</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bank Transfer */}
                <label
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === "transfer"
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-white border-outline-variant hover:border-primary/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={() => setPaymentMethod("transfer")}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-primary">account_balance</span>
                  <div className="text-left">
                    <span className="text-sm font-bold block text-on-surface">โอนเงินผ่านธนาคาร</span>
                    <span className="text-[11px] text-on-surface-variant font-medium">โอนเงินเข้าบัญชีและแนบหลักฐาน</span>
                  </div>
                </label>

                {/* PromptPay QR */}
                <label
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === "promptpay"
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-white border-outline-variant hover:border-primary/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="promptpay"
                    checked={paymentMethod === "promptpay"}
                    onChange={() => setPaymentMethod("promptpay")}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-primary">qr_code_2</span>
                  <div className="text-left">
                    <span className="text-sm font-bold block text-on-surface">พร้อมเพย์ QR Code</span>
                    <span className="text-[11px] text-on-surface-variant font-medium">สแกนชำระผ่านแอปพลิเคชัน</span>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === "card"
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-white border-outline-variant hover:border-primary/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-primary">credit_card</span>
                  <div className="text-left">
                    <span className="text-sm font-bold block text-on-surface">บัตรเครดิต / เดบิต</span>
                    <span className="text-[11px] text-on-surface-variant font-medium">ยินดีรับ VISA, Mastercard, JCB</span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${paymentMethod === "cod"
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-white border-outline-variant hover:border-primary/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <div className="text-left">
                    <span className="text-sm font-bold block text-on-surface">เก็บเงินปลายทาง (COD)</span>
                    <span className="text-[11px] text-on-surface-variant font-medium">ชำระด้วยเงินสดเมื่อได้รับสินค้า</span>
                  </div>
                </label>
              </div>

              {/* Dynamic Payment Guide */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50 text-xs text-on-surface-variant space-y-1">
                {paymentMethod === "transfer" && (
                  <>
                    <p className="font-bold text-on-surface">บัญชีสำหรับการโอนเงิน:</p>
                    <p>• ธนาคารไทยพาณิชย์ (SCB) | เลขที่บัญชี: 123-4-56789-0 | ชื่อบัญชี: บจก. ไอแฮฟคอมพิวเตอร์</p>
                    <p>• ธนาคารกสิกรไทย (KBank) | เลขที่บัญชี: 987-6-54321-0 | ชื่อบัญชี: บจก. ไอแฮฟคอมพิวเตอร์</p>
                    <p className="mt-2 text-[10px] text-primary">*กรุณาเก็บหลักฐานการโอนเงินเพื่ออ้างอิงตอนการส่งมอบ</p>
                  </>
                )}
                {paymentMethod === "promptpay" && (
                  <p>ระบบจะสร้าง QR Code พร้อมเพย์สำหรับแสกนชำระเงินตามจำนวนจริงของรายการสั่งซื้อนี้ทันทีหลังจากกดปุ่มชำระเงิน</p>
                )}
                {paymentMethod === "card" && (
                  <div className="space-y-2">
                    {savedCards.length > 0 ? (
                      <>
                        <p className="font-semibold text-on-surface text-xs mb-1">เลือกบัตรเครดิตที่ต้องการชำระเงิน:</p>
                        <select
                          value={selectedCardId}
                          onChange={(e) => setSelectedCardId(e.target.value)}
                          className="w-full bg-white border border-outline-variant rounded-lg py-2 px-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        >
                          {savedCards.map((card) => (
                            <option key={card.id} value={card.id}>
                              [{card.isDefault ? "บัตรเริ่มต้น" : "บัตรเสริม"}] {card.type} - {card.cardNumber} ({card.holder})
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <div className="bg-error-container/10 border border-error/20 p-3 rounded-lg text-center space-y-2">
                        <p className="text-error font-semibold text-[11px]">คุณยังไม่ได้บันทึกบัตรเครดิตในระบบ</p>
                        <button
                          type="button"
                          onClick={() => navigate("/profile", { state: { activeTab: "payment_methods" } })}
                          className="bg-primary text-white hover:brightness-110 px-3 py-1.5 rounded-lg font-bold text-[9px] transition-all cursor-pointer border-none"
                        >
                          ไปที่หน้าโปรไฟล์เพื่อเพิ่มบัตรเครดิต
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {paymentMethod === "cod" && (
                  <p>กรุณาเตรียมเงินสดจำนวน <b>{grandTotal.toLocaleString()}฿</b> ให้พร้อมในวันที่เจ้าหน้าที่ขนส่งเข้าไปจัดส่งสินค้าพัสดุ</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">shopping_basket</span>
                  <h2 className="text-xl font-bold text-on-surface font-headline-md my-0 font-display">รายการสินค้าในสั่งซื้อ</h2>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                  {cart.reduce((tot, item) => tot + item.quantity, 0)} รายการ
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-outline-variant/50 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex gap-4 first:pt-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover bg-surface rounded-lg border border-outline-variant/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface truncate pr-2">{item.name}</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium">แบรนด์: {item.brand} | จำนวน: {item.quantity}</p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-on-surface-variant">{item.price.toLocaleString()}฿ / ชิ้น</span>
                        <span className="text-xs font-bold text-on-surface">{(item.price * item.quantity).toLocaleString()}฿</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing breakdown */}
              <div className="border-t border-outline-variant pt-4 space-y-3">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>ยอดรวมสินค้า (Subtotal)</span>
                  <span className="font-semibold">{cartTotal.toLocaleString()}฿</span>
                </div>

                <div className="flex justify-between text-sm text-on-surface-variant items-center">
                  <div className="flex items-center gap-1.5">
                    <span>ค่าจัดส่ง (Shipping)</span>
                    {shippingFee === 0 && (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">ส่งฟรี!</span>
                    )}
                  </div>
                  <span className={shippingFee === 0 ? "text-green-600 font-bold" : "font-semibold"}>
                    {shippingFee === 0 ? "0฿" : `${shippingFee}฿`}
                  </span>
                </div>

                {shippingFee > 0 && (
                  <div className="bg-primary-container/20 border border-primary-container p-3 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm shrink-0">info</span>
                    <span className="text-[11px] text-on-primary-container font-semibold leading-relaxed">
                      ซื้อครบ 1,000฿ เพื่อรับสิทธิ์จัดส่งฟรีทั่วประเทศ! (อีก {(1000 - cartTotal).toLocaleString()}฿)
                    </span>
                  </div>
                )}

                <div className="border-t border-outline-variant pt-3 flex justify-between items-center text-headline-sm font-bold text-on-surface">
                  <span>ยอดเงินสุทธิที่ต้องชำระ</span>
                  <span className="text-primary font-display text-xl">{grandTotal.toLocaleString()}฿</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckoutSubmit}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm shadow-primary/10"
                >
                  <span className="material-symbols-outlined text-sm font-bold">payment</span>
                  <span>ยืนยันการสั่งซื้อและชำระเงิน</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full border border-outline-variant text-on-surface py-3 rounded-xl font-medium hover:bg-surface-container active:scale-95 transition-all text-center cursor-pointer bg-transparent"
                >
                  เลือกสินค้าต่อ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PromptPay QR Modal */}
      {isPromptPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPromptPayModalOpen(false)} />
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-outline-variant shadow-2xl relative z-10 text-center space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-on-surface font-headline-sm">พร้อมเพย์ QR Code</span>
              <button
                onClick={() => setIsPromptPayModalOpen(false)}
                className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="bg-surface-container-high rounded-2xl p-4 inline-block">
                {/* Mock PromptPay Logo */}
                <div className="flex justify-center items-center gap-1 mb-2">
                  <span className="text-blue-900 font-extrabold text-sm tracking-tight">Prompt</span>
                  <span className="text-blue-500 font-extrabold text-sm tracking-tight">Pay</span>
                </div>
                {/* Mock QR Code */}
                <div className="bg-white p-3 border border-outline-variant rounded-xl inline-block shadow-inner">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    alt="PromptPay QR Code"
                    className="w-[180px] h-[180px]"
                  />
                </div>
              </div>
              <p className="text-sm font-semibold text-on-surface mt-2">สแกนชำระเงินเพื่อยืนยันคำสั่งซื้อ</p>
              <p className="text-headline-md font-bold text-primary">{grandTotal.toLocaleString()}฿</p>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                *สแกนจ่ายด้วยแอปธนาคารใดก็ได้ เมื่อชำระเงินสำเร็จ กรุณากดปุ่ม <b>"ยืนยันการชำระเงิน"</b> ด้านล่าง
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={processOrder}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                <span>ยืนยันการชำระเงินเสร็จสิ้น</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
