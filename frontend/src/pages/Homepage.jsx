import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

export default function Homepage() {
  const { addToCart } = useCart();
  const { showAlert } = useAlert();
  const [activeNav, setActiveNav] = useState("Electronics");
  const [searchQuery, setSearchQuery] = useState("");
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
    { name: "ASUS", url: "/img/ASUS.png" },
    { name: "MSI", url: "/img/MSI.png" },
    { name: "Gigabyte", url: "/img/Gigabyte.png" },
    { name: "Intel", url: "/img/Intel.png" },
    { name: "AMD", url: "/img/AMD.jpg" },
  ];

  const duplicatedBrands = [...brands, ...brands, ...brands];
  const brandScrollRef = useRef(null);

  useEffect(() => {
    if (brandScrollRef.current) {
      const container = brandScrollRef.current;
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, []);

  const handleBrandScroll = () => {
    const container = brandScrollRef.current;
    if (!container) return;
    const segmentWidth = container.scrollWidth / 3;
    if (container.scrollLeft < segmentWidth / 2) {
      container.scrollLeft += segmentWidth;
    } else if (container.scrollLeft > segmentWidth * 2) {
      container.scrollLeft -= segmentWidth;
    }
  };

  const scrollBrands = (direction) => {
    if (brandScrollRef.current) {
      const scrollAmount = 300;
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      await showAlert({
        title: "สมัครสมาชิกสำเร็จ",
        message: `สมัครรับข่าวสารสำเร็จด้วยอีเมล: ${email}`
      });
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
                Premium IT Gear for the Modern Tech Enthusiast
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                shop the latest in high-performance IT gear, from cutting-edge graphics cards to immersive audio solutions, all designed to elevate your tech experience.
              </p>
              <div className="pt-4">
                <Link
                  to="/Products?productType=ALL"
                  className="inline-block bg-secondary text-white px-10 py-4 rounded-full font-label-caps text-label-caps hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-secondary/20 uppercase"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          {/* Hero Image */}
          <div className="absolute inset-0 flex justify-end items-center pointer-events-none">
            <div className="w-full md:w-[60%] h-full relative">
              <img
                className="w-full h-full object-cover"
                alt="Premium IT gear and computer hardware display for high-performance builds."
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
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

        

        {/* Brand Section — Auto-scroll, pause on hover */}
        <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(180deg,#faf8ff 0%,#f0ebff 100%)" }}>
          <style>{`
            /* ── keyframes ── */
            @keyframes bs-run {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }

            /* ── outer wrapper ── */
            .bs-root { position: relative; }

            /* gradient edges */
            .bs-root::before,
            .bs-root::after {
              content: '';
              position: absolute;
              top: 0; bottom: 0;
              width: 140px;
              z-index: 10;
              pointer-events: none;
            }
            .bs-root::before {
              left: 0;
              background: linear-gradient(to right, #faf8ff 0%, transparent 100%);
            }
            .bs-root::after {
              right: 0;
              background: linear-gradient(to left, #f0ebff 0%, transparent 100%);
            }

            /* ── track ── */
            .bs-track {
              display: flex;
              width: max-content;
              animation: bs-run 30s linear infinite;
              gap: 16px;
              padding: 12px 0;
            }
            /* pause the whole track when ANY card is hovered */
            .bs-track:has(.bs-card:hover) {
              animation-play-state: paused;
            }

            /* ── single card ── */
            .bs-card {
              position: relative;
              flex-shrink: 0;
              width: 168px;
              height: 110px;
              border-radius: 22px;
              background: #fff;
              border: 1.5px solid rgba(124,58,237,0.12);
              box-shadow: 0 2px 12px rgba(103,80,164,0.07);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 10px;
              text-decoration: none;
              cursor: pointer;
              overflow: hidden;
              transition:
                transform   0.32s cubic-bezier(.34,1.56,.64,1),
                box-shadow  0.28s ease,
                border-color 0.22s ease;
            }
            .bs-card:hover {
              transform: translateY(-8px) scale(1.05);
              border-color: var(--bs-accent, #7c3aed);
              box-shadow:
                0 20px 48px rgba(103,80,164,0.18),
                0 0 0 3px rgba(124,58,237,0.10);
            }

            /* shimmer sweep on hover */
            .bs-card::after {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(
                110deg,
                transparent 30%,
                rgba(255,255,255,0.55) 50%,
                transparent 70%
              );
              transform: translateX(-100%);
              transition: transform 0s;
            }
            .bs-card:hover::after {
              transform: translateX(200%);
              transition: transform 0.55s ease;
            }

            /* accent strip at top */
            .bs-card-strip {
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 3px;
              background: var(--bs-accent, #7c3aed);
              transform: scaleX(0);
              transform-origin: left;
              border-radius: 2px 2px 0 0;
              transition: transform 0.3s ease;
            }
            .bs-card:hover .bs-card-strip { transform: scaleX(1); }

            /* logo */
            .bs-card img {
              max-height: 46px;
              max-width: 80%;
              object-fit: contain;
              filter: grayscale(35%) opacity(.72);
              transition: filter 0.3s ease, transform 0.3s ease;
              position: relative;
              z-index: 1;
              user-select: none;
              -webkit-user-drag: none;
            }
            .bs-card:hover img {
              filter: grayscale(0%) opacity(1);
              transform: scale(1.08);
            }

            /* name label */
            .bs-card-name {
              position: relative;
              z-index: 1;
              font-size: 0.65rem;
              font-weight: 800;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              color: #6f5b98;
              font-family: 'Inter','Outfit',sans-serif;
              margin-top: 8px;
              transition: color 0.25s ease;
              opacity: 1;
              transform: translateY(0);
            }
            .bs-card:hover .bs-card-name {
              color: var(--bs-accent, #7c3aed);
            }
          `}</style>

          {/* ── Header ── */}
          <div className="text-center mb-12 px-4">
            <p style={{
              fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#7c3aed",
              fontFamily: "'Inter','Outfit',sans-serif", marginBottom: 8
            }}>
              Trusted Partners
            </p>
            <h2 style={{
              fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900,
              color: "#130d2e", letterSpacing: "-0.03em",
              fontFamily: "'Inter','Outfit',sans-serif", margin: "0 0 6px"
            }}>
              แบรนด์แนะนำ
            </h2>
          </div>

          {/* ── Scrolling Track ── */}
          <div className="bs-root" style={{ overflow: "hidden" }}>
            <div className="bs-track">
              {[
                ...brands.map((b, i) => ({ ...b, accent: ["#00c853","#0057d9","#f5c400","#c8001e","#e65100","#0077c8","#b71c1c","#1565c0","#0071c5","#e20023"][i] })),
                ...brands.map((b, i) => ({ ...b, accent: ["#00c853","#0057d9","#f5c400","#c8001e","#e65100","#0077c8","#b71c1c","#1565c0","#0071c5","#e20023"][i] })),
                ...brands.map((b, i) => ({ ...b, accent: ["#00c853","#0057d9","#f5c400","#c8001e","#e65100","#0077c8","#b71c1c","#1565c0","#0071c5","#e20023"][i] })),
                ...brands.map((b, i) => ({ ...b, accent: ["#00c853","#0057d9","#f5c400","#c8001e","#e65100","#0077c8","#b71c1c","#1565c0","#0071c5","#e20023"][i] })),
              ].map((brand, idx) => (
                <Link
                  key={idx}
                  to={`/Products?brand=${encodeURIComponent(brand.name)}`}
                  className="bs-card"
                  style={{ "--bs-accent": brand.accent }}
                >
                  <div className="bs-card-strip" />
                  <img src={brand.url} alt={`${brand.name} Logo`} draggable="false" />
                  <span className="bs-card-name">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-margin-desktop max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <p className="font-label-caps text-label-caps text-primary uppercase tracking-[0.3em]">
              Why Choose Us
            </p>
            <h2 className="font-headline-md text-display-lg-mobile text-on-surface mt-4">
              Trusted IT gear for every build
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mt-4">
              เราคัดสรรอุปกรณ์คอมพิวเตอร์คุณภาพสูง พร้อมบริการที่ตอบโจทย์ทั้งสายเกมเมอร์และสายทำงาน
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-outline-variant bg-surface-container-high p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 inline-block">
                local_shipping
              </span>
              <h3 className="font-body-lg font-semibold text-on-surface mb-3">
                ส่งเร็วถึงบ้าน
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                บริการจัดส่งไว พร้อม tracking อัพเดตสถานะทุกขั้นตอน.
              </p>
            </div>

            <div className="rounded-3xl border border-outline-variant bg-surface-container-high p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 inline-block">
                verified
              </span>
              <h3 className="font-body-lg font-semibold text-on-surface mb-3">
                ของแท้รับประกัน
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                สินค้าทุกชิ้นเป็นของแท้ พร้อมรับประกันคุณภาพและบริการหลังการขาย.
              </p>
            </div>

            <div className="rounded-3xl border border-outline-variant bg-surface-container-high p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 inline-block">
                support_agent
              </span>
              <h3 className="font-body-lg font-semibold text-on-surface mb-3">
                บริการช่วยเหลือตลอด
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                ทีมงานพร้อมตอบคำถามและออกแบบชุดคอมให้ตรงกับงบประมาณของคุณ.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {/* <section className="py-20 px-margin-desktop max-w-container-max mx-auto">
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
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
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
        </section> */}
      </main>
    </div>
  );
}
