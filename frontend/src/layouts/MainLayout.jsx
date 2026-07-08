import { Outlet } from "react-router-dom";
import { useState } from "react";
export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [];
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  return (
    <>
      <nav
        className={`flex flex-col w-full sticky top-0 z-50 px-margin-desktop py-stack-md bg-surface bg-opacity-90 border-b border-outline-variant backdrop-blur-md transition-shadow duration-200 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-container-max mx-auto w-full flex items-center justify-between gap-gutter">
          <a
            className="font-display text-display text-primary tracking-tighter shrink-0"
            href="/"
          >
            IHaveComputer
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item);
                }}
                className={`font-label-md text-label-md transition-colors duration-200 ${
                  activeNav === item
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-stack-md flex-1 justify-end max-w-xl">
            <div className="relative w-full hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Search ..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-stack-sm">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 relative group active:scale-90">
                <span className="material-symbols-outlined">shopping_cart</span>
              </button>
              {isLogin ? (
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-90">
                  <span className="material-symbols-outlined">person</span>
                </button>
              ) : (
                <>
                  <button className="p-2 text-on-surface-variant hover:text-primary duration-200 active:scale-90">
                    Login
                  </button>

                  <button className="p-2 text-on-surface-variant hover:text-primary duration-200 active:scale-90">
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
