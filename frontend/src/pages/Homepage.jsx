import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Homepage() {
  const [activeNav, setActiveNav] = useState("Electronics");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [email, setEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = ["Electronics", "Audio", "Gaming", "Lifestyle"];

  const categories = [
    { icon: "monitor", label: "Monitor", productType: "Monitor" },
    { icon: "developer_board", label: "GPU", productType: "GPU" },
    { icon: "memory", label: "CPU", productType: "CPU" },
    { icon: "memory_alt", label: "RAM", productType: "RAM" },
    { icon: "headphones", label: "Headphones", productType: "Headphones" },
    { icon: "keyboard", label: "Keyboard", productType: "Keyboard" },
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
              href="/Products?productType=ALL"
            >
              View all
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-gutter">
            {categories.map((cat, index) => (
              <Link
                key={index}
                className="group flex flex-col items-center gap-3 text-center"
                to={`/Products?productType=${encodeURIComponent(cat.productType)}`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:bg-primary-fixed group-hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {cat.icon}
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                  {cat.label}
                </span>
              </Link>
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
    </div>
  );
}
