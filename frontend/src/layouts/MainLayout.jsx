import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const navItems = [];
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const updateFavoriteCount = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const favoritesKey = currentUser ? `favorites_${currentUser.id}` : "favorites_guest";
    const favs = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    setFavoriteCount(favs.length);
  };

  useEffect(() => {
    updateFavoriteCount();
    window.addEventListener("favoritesUpdated", updateFavoriteCount);
    return () => {
      window.removeEventListener("favoritesUpdated", updateFavoriteCount);
    };
  }, [location]);

  useEffect(() => {
    setIsLogin(!!localStorage.getItem("currentUser"));
  }, [location]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("currentUser");
      setIsLogin(false);
      navigate("/login");
    }
  };
  return (
    <>
      {/* TopNavBar */}
      <nav
        className={`flex flex-col w-full sticky top-0 z-50 px-margin-desktop py-4 bg-surface/90 border-b border-outline-variant backdrop-blur-md transition-shadow${isScrolled ? " shadow-md" : ""
          }`}
      >
        <div className="max-w-container-max mx-auto w-full flex items-center justify-between gap-gutter">
          {/* Brand Logo */}
          <a
            className="font-display-lg text-headline-md text-primary tracking-tighter shrink-0"
            href="/"
          >
            IhaveComputer
          </a>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setActiveNav(item)}
                className={`font-label-caps text-label-caps transition-colors duration-200 cursor-pointer ${activeNav === item
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-xl">
            <div className="relative w-full hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Search premium tech..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                state={{ activeTab: "wishlist" }}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 relative group cursor-pointer"
              >
                <span className="material-symbols-outlined">favorite</span>
                {favoriteCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {favoriteCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  const currentUser = localStorage.getItem("currentUser");
                  if (!currentUser) {
                    navigate("/login");
                  } else {
                    setIsCartOpen(true);
                  }
                }}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 relative group cursor-pointer"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              {isLogin ? (
                <>
                  <Link to="/profile" className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-90">
                    <span className="material-symbols-outlined">person</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-on-surface-variant hover:text-error duration-200 active:scale-90 font-label-md cursor-pointer bg-transparent border-none"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="p-2 text-on-surface-variant hover:text-primary duration-200 active:scale-90 font-label-md">
                    Login
                  </Link>

                  <Link to="/register" className="p-2 text-on-surface-variant hover:text-primary duration-200 active:scale-90 font-label-md">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
      <footer className="bg-surface-container-lowest border-t border-outline-variant pt-24 pb-12">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <a
              className="font-display-lg text-headline-md font-bold text-primary tracking-tighter"
              href="/"
            >
              IhaveComputer
            </a>
            <p className="font-body-md text-on-surface-variant pr-8">
              Premium electronics marketplace for professionals and enthusiasts.
              Quality gear, expert support, global delivery.
            </p>
            <div className="flex items-center gap-4">
              <a
                className="p-2 bg-surface-container rounded-full text-primary hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">face_nod</span>
              </a>
              <a
                className="p-2 bg-surface-container rounded-full text-primary hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">terminal</span>
              </a>
              <a
                className="p-2 bg-surface-container rounded-full text-primary hover:bg-primary hover:text-white transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-6 uppercase tracking-[0.2em]">
              Shop
            </h4>
            <ul className="space-y-4 font-body-md text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Audio &amp; Sound
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  PC Components
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Gaming Gear
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Smart Home
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-6 uppercase tracking-[0.2em]">
              Support
            </h4>
            <ul className="space-y-4 font-body-md text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Help Center
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Order Tracking
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Returns &amp; Refunds
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-6 uppercase tracking-[0.2em]">
              Company
            </h4>
            <ul className="space-y-4 font-body-md text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  About IhaveComputer
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Sustainability
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-container-max mx-auto px-margin-desktop pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">
            © 2026 IhaveComputer. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-outline-variant hover:text-primary transition-colors cursor-pointer">
              payments
            </span>
            <span className="material-symbols-outlined text-outline-variant hover:text-primary transition-colors cursor-pointer">
              credit_card
            </span>
            <span className="material-symbols-outlined text-outline-variant hover:text-primary transition-colors cursor-pointer">
              account_balance_wallet
            </span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${isCartOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              <h3 className="text-lg font-bold text-on-surface font-headline-lg">ตะกร้าสินค้าของคุณ</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant space-y-4">
                <span className="material-symbols-outlined text-6xl text-outline-variant">
                  shopping_cart_off
                </span>
                <p className="text-body-lg font-medium">ไม่มีสินค้าในตะกร้าของคุณ</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  เลือกสินค้าต่อ
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/60 hover:border-outline transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover bg-surface rounded-lg border border-outline-variant/30"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <h4 className="text-body-md font-bold text-on-surface truncate">
                        {item.name}
                      </h4>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-body-md font-bold text-primary">
                        {(item.price * item.quantity).toLocaleString()}฿
                      </span>
                      <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer text-sm font-bold border-none bg-transparent"
                        >
                          -
                        </button>
                        <span className="text-body-sm font-semibold w-6 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer text-sm font-bold border-none bg-transparent"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-on-surface-variant hover:text-error self-start p-1 cursor-pointer border-none bg-transparent"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-outline-variant bg-surface-container-lowest space-y-4">
              <div className="flex justify-between items-center text-headline-sm font-bold text-on-surface">
                <span>ยอดรวมทั้งหมด:</span>
                <span className="text-primary">{cartTotal.toLocaleString()}฿</span>
              </div>
              <div className="grid gap-2">
                <button
                  onClick={() => {
                    const currentUser = localStorage.getItem("currentUser");
                    if (!currentUser) {
                      alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า");
                      setIsCartOpen(false);
                      navigate("/login");
                      return;
                    }
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-sm">payment</span>
                  ดำเนินการชำระเงิน
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full border border-outline-variant text-on-surface py-3 rounded-xl font-medium hover:bg-surface-container active:scale-95 transition-all text-center cursor-pointer bg-transparent"
                >
                  เลือกสินค้าต่อ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
