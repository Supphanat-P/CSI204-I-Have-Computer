import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const navItems = [];
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      {/* TopNavBar */}
      <nav
        className={`flex flex-col w-full sticky top-0 z-50 px-margin-desktop py-4 bg-surface/90 border-b border-outline-variant backdrop-blur-md transition-shadow${
          isScrolled ? " shadow-md" : ""
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
                className={`font-label-caps text-label-caps transition-colors duration-200 cursor-pointer ${
                  activeNav === item
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
                placeholder="Search "
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 relative group">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full">
                  {/* {cartCount} */} 1
                </span>
              </button>
              {isLogin ? (
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-90">
                  <span className="material-symbols-outlined">person</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="p-2 text-on-surface-variant hover:text-primary duration-200 active:scale-90 font-label-md"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="p-2 text-on-surface-variant hover:text-primary duration-200 active:scale-90 font-label-md"
                  >
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
    </>
  );
}
