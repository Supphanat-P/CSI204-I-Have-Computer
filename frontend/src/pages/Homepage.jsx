import { useState, useEffect } from "react";

export default function Homepage() {
  const [activeNav, setActiveNav] = useState("Electronics");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [email, setEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = ["Electronics", "Audio", "Gaming", "Lifestyle"];

  const categories = [
    { icon: "headphones", label: "Headphones" },
    { icon: "keyboard", label: "Keyboards" },
    { icon: "mouse", label: "Mice" },
    { icon: "speaker", label: "Speakers" },
    { icon: "monitor", label: "Monitors" },
    { icon: "mic", label: "Microphones" },
  ];

  const brands = [
    { name: "Razer", url: "/img/razer.jpg" },
    { name: "Logitech", url: "/img/Logitech.png" },
    { name: "Corsair", url: "/img/Corsair.jpg" },
    { name: "HyperX", url: "/img/hyperX.jpg" },
    { name: "Steelseries", url: "/img/steelseries.jpg" },
  ];

  const products = [
    {
      id: 1,
      name: "Apex Pro Keyboard",
      type: "Wired Mechanical RGB",
      price: 1500,
      oldPrice: 2000,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMiJUdCMuExhllGBrlYBeUctKNy-luV6HFu33cxyuOb6xnlyAIiZBpKQwzArQ5zpdUto-P-4RRYydLsY1YNuPscvLxf6cec6zCdlhmeJTyLhfjN2bUCWZ4JIe3qwgmfwpHehNY0ZiRZvO96ykBUrBAWdQ4HIs54zuGIe3oCgkFGJ-PFRDrjkmcBvwJhYcrV-PY1dBTasWih-L-XFOR_p4W4XRoGx68HyYbi8jxlD3pD0TGXVJgesMzdg",
      badge: "Hot Deal",
    },
    {
      id: 2,
      name: "Vector X Precision",
      type: "Wireless Optical Mouse",
      price: 790,
      oldPrice: 1500,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA-SSchc4qA1D03bhL_VDRor2hP2k4R_l9PyHgrmRF4mBkTLgzMVlnWVn2n6KGEX-E-lv-87f23EYM329YkKQxmDXmM5734OBUttqt_TSXoMXIMeTdVukg4giJtoPepZ8xfMspkv7sDT_gV0OEUsPx5lMOPTG_hWS6WVNGlDK6KbOB2DPSAjaaI8gwVZwzDNtvhpuAe76cX3mCPuNMyd8QKIKrIHge-uVUmgMhgULvYUvpnjVqQL-d1Zg",
      badge: "Hot Deal",
    },
    {
      id: 3,
      name: "Sonic Wood Bookshelf",
      type: "Active Bluetooth Pair",
      price: 300,
      oldPrice: 500,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCy9r-z139CXv9Sn7RMahKSuya_RYQzhMVjl__8TmnzQf-Jf1UmNb2odhPEOXqupO9yf_MzGetGmm4uJ00A9K9mV9QohiWzdEzB8CuCpowPhmldQjmnSYNxihQfqs-xSlINHSEUSuTBK7dELUxJqbuWKfkWhpDgS6qG0dQYqqIHlWArGZGZb1XR5zanROSsE72yVOQBKBbuFaNr5D5288AoSPax2YZg4vIxBwiGecB0dxuGUhn9rYSkpA",
      badge: "Hot Deal",
    },
    {
      id: 4,
      name: "UltraView 4K Pro",
      type: '27" IPS HDR 600',
      price: 500,
      oldPrice: 750,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDTSrkz0kTV7kBxqZS0zDQQO1AjAAJhBVH8qaTBgwW3wJzZMeXRRT1FAcUZnocWJpCxwIPk5qlo_EiXNdC5ATwkpt-eYONxJ5v8tT_EG7O-iInhgxEzuk1ttNMzb26hNqS24pZ3t5JH3-AtUnmh5D1biYqwoslj5DGox4pYd-rTQ8zCvsru9rr-U3lrCkMSXZxozEybuFOGgY_crdelIoYQKkDjVOs9K_tVuds3UdIgsSewb3sTbv6ZUA",
      badge: "Hot Deal",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = (e) => {
    if (e) e.preventDefault();
    setCartCount((prev) => prev + 1);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with: ${email}`);
      setEmail("");
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">

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
                placeholder="Search premium tech..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 relative group">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200">
                <span className="material-symbols-outlined">person</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full">

        {/* Hero Section */}
        <section className="relative w-full h-[600px] bg-surface-container-low overflow-hidden">
          <div className="max-w-container-max mx-auto h-full px-margin-desktop flex items-center relative z-10">
            <div className="w-full md:w-1/2 space-y-6">
              <span className="inline-block px-3 py-1 bg-primary text-white font-label-caps text-label-caps rounded-full tracking-widest uppercase">
                New Arrival
              </span>
              <h1 className="font-display-lg text-display-lg md:text-[64px] text-on-surface leading-none">
                Premium Audio Experience
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Shop the latest collection of noise-canceling headphones
                designed for pure sonic immersion and comfort.
              </p>
              <div className="pt-4">
                <button
                  onClick={addToCart}
                  className="bg-secondary text-white px-10 py-4 rounded-full font-label-caps text-label-caps hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-secondary/20 uppercase"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
          {/* Hero Image */}
          <div className="absolute inset-0 flex justify-end items-center pointer-events-none">
            <div className="w-full md:w-[60%] h-full relative">
              <img
                className="w-full h-full object-cover"
                alt="Premium noise-canceling headphones with sleek matte black finish and brushed aluminum accents"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwSWJ3NfWx13dyU4wadgSUL1l2xZiXR9J-USB-YOqD0sm6_RQVu-XGZUbkA9rET96IlGK8YgkIqhp2uJnbiazrh55mgiLHl_oO7WMX5WpubplejI5Hhf6FGwrfM-HW4z0EpT113DKpcBaNFs5T8TcDD1pZ87ZO686dpNeaFuYT3WOccjdd7YjxOpoR4wuUJfDaHNNgdpesl_YAjwKMGzYRtaJXUFCCKyx_0BpEa_hZn3r_KwXUViyx3g"
              />
              {/* Atmospheric light effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="py-20 px-margin-desktop max-w-container-max mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-headline-md text-display-lg-mobile text-on-surface">
              Browse Categories
            </h2>
            <a
              className="text-primary font-label-caps text-label-caps hover:underline flex items-center gap-1 uppercase"
              href="#"
            >
              View all{" "}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-gutter">
            {categories.map((cat, index) => (
              <a
                key={index}
                className="group flex flex-col items-center gap-3 text-center"
                href="#"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:bg-primary-fixed group-hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {cat.icon}
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                  {cat.label}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Brand Section */}
 <section className="bg-surface-container-low py-12 border-y border-outline-variant">
  <div className="max-w-container-max mx-auto px-margin-desktop overflow-hidden">
    <p className="text-center font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em] mb-8">
      Authorized Global Retailer
    </p>

    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
      {brands.map((brand, index) => (
        <img
          key={index}
          src={brand.url}
          alt={`${brand.name} Logo`}
          className="h-8 md:h-10 object-contain"
        />
      ))}
    </div>
  </div>
</section>
        {/* Featured Products */}
        <section className="py-20 px-margin-desktop max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-headline-md text-display-lg-mobile text-on-surface mb-2">
                Featured Products
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Curated high-performance gear for your setup.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-outline-variant rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 border border-outline-variant rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-surface-container-lowest rounded-2xl border border-outline-variant hover:border-primary hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-secondary text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="aspect-square w-full overflow-hidden bg-surface-container-low relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={product.name}
                    src={product.image}
                  />
                  <button
                    onClick={addToCart}
                    className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <span className="material-symbols-outlined">
                      shopping_cart
                    </span>
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-body-lg font-semibold text-primary line-clamp-1 group-hover:text-surface-tint">
                    {product.name}
                  </h3>
                  <p className="font-label-caps text-[12px] text-on-surface-variant uppercase">
                    {product.type}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-headline-md text-on-surface">
                      {product.price.toFixed(2)}฿
                    </span>
                    {product.oldPrice && (
                      <span className="font-label-caps text-outline line-through">
                        {product.oldPrice.toFixed(2)}฿
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter / CTA มันจะส่งเมลไปหาเราตามเมลที่กรอก}
        <section className="py-24 bg-primary text-white text-center px-margin-desktop overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  height="60"
                  id="grid"
                  patternUnits="userSpaceOnUse"
                  width="60"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  ></path>
                </pattern>
              </defs>
              <rect fill="url(#grid)" height="100%" width="100%"></rect>
            </svg>
          </div>
          <div className="max-w-xl mx-auto relative z-10 space-y-6">
            <h2 className="font-display-lg text-display-lg">
              Stay Ahead of the Curve
            </h2>
            <p className="font-body-lg text-primary-fixed-dim">
              Subscribe to get exclusive early access to drops, tech reviews,
              and members-only pricing.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <input
                className="flex-1 rounded-full px-8 py-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary border-none"
                placeholder="Enter your email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary text-white px-10 py-4 rounded-full font-label-caps text-label-caps hover:brightness-110 transition-all uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
            <p className="font-label-caps text-[10px] text-primary-fixed-dim/60 uppercase tracking-widest">
              By subscribing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </section> */}

      </main>

      {/* Footer */}
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

    </div>
  );
}
