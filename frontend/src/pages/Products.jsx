import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../component/Products/ProductCard";
import AsideFilterProducts from "../component/Products/AsideFilterProducts";
import products from "../data/products";

export default function Products() {
  const [activeNav, setActiveNav] = useState("");
  const [searchParams] = useSearchParams();
  const productType = searchParams.get("productType") || "GPU";
  const filteredProducts = products.filter((item) => item.productType === productType);

  return (
    <div>
      <main className="mt-20 w-fit mx-40 px-margin-desktop py-stack-lg flex gap-gutter">
        <AsideFilterProducts productType={productType} />
        <section className="flex-1 bg-white rounded-lg p-4 h-fit shadow-md mb-5">
          <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-outline-variant pb-4 gap-5">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-on-surface">
                แสดงผลการค้นหาสำหรับ {productType}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                พบสินค้าทั้งหมด {filteredProducts.length} รายการ
              </p>
            </div>
            <div className="flex items-center gap-stack-md">
              <span className="text-label-md text-on-surface-variant">
                เรียงตาม:
              </span>
              <select className="bg-surface-container rounded-lg border-none text-body-sm py-2 px-4 focus:ring-2 focus:ring-primary">
                <option>ยอดนิยม</option>
                <option>ราคา: ต่ำ-สูง</option>
                <option>ราคา: สูง-ต่ำ</option>
                <option>มาใหม่</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <section className="w-full mb-16 relative group cursor-pointer overflow-hidden rounded-xl border border-outline-variant">
            <div className="absolute inset-0 from-primary/90 to-transparent z-10 flex flex-col justify-center px-12 pointer-events-none">
              <span className="text-on-primary font-bold text-label-md uppercase tracking-[0.2em] mb-2">
                Promotion
              </span>
              <h2 className="text-on-primary font-headline-lg text-headline-lg mb-4">
                คุ้มกว่าใคร! ลดสูงสุด 50%
                <br />
                อุปกรณ์ Gadget แบรนด์ดัง
              </h2>
              <button className="w-fit bg-secondary-container text-on-secondary-container px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform active:scale-95 pointer-events-auto">
                ช้อปเลย
              </button>
            </div>
            {/* <img
              className="w-full h-64 object-cover"
              alt="A wide cinematic banner showcasing an array of futuristic gadgets like drones, VR headsets, and wireless earbuds floating in a clean, brightly lit digital void with blue and orange accent light trails. The style is modern, energetic, and professional, perfectly fitting a high-velocity tech e-commerce campaign."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpuJj8Gt86_HGSjdWqLCbwooL2tA3o0AIZXhX6DGJW_B7Q0QE4XWtYZYQP0rIi65nBJDmKMr9n9yH-Spye_uoYIAfnrURiFOGOFfU7yKYQZFmaSbEMv-aZ7fM024vGbwJ4Oo8m25QbtMQYBICsuOPaX3QuSJcMSclaniYWbvT2nr6yA6qFSJ1_aSbC9crJ67Dacn8zDPUw3r1Kkm4vLO-g0QfYesiTPfJeDX4mr840Usv8dnZq-cJOHQ"
            /> */}
            <div className="absolute inset-y-0 left-4 z-20 flex items-center">
              <button className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-sm flex items-center justify-center text-on-surface hover:bg-surface transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 z-20 flex items-center">
              <button className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-sm flex items-center justify-center text-on-surface hover:bg-surface transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
