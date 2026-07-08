const filterConfig = {
  Monitor: {
    title: "Monitor",
    categories: ["24 นิ้ว", "27 นิ้ว", "32 นิ้ว", "Ultrawide"],
    brands: ["ASUS", "LG", "Dell", "Acer"],
    priceMax: "80,000฿+",
  },
  GPU: {
    title: "GPU",
    categories: ["RTX 4060", "RTX 4070", "RTX 4080", "RX 7600"],
    brands: ["NVIDIA", "AMD", "MSI", "ASUS"],
    priceMax: "80,000฿+",
  },
  CPU: {
    title: "CPU",
    categories: ["Intel Core i5", "Intel Core i7", "Ryzen 5", "Ryzen 7"],
    brands: ["Intel", "AMD", "Cooler Master", "Noctua"],
    priceMax: "40,000฿+",
  },
  RAM: {
    title: "RAM",
    categories: ["8GB", "16GB", "32GB", "64GB"],
    brands: ["Corsair", "Kingston", "G.Skill", "ADATA"],
    priceMax: "15,000฿+",
  },
};

export default function AsideFilterProducts({ productType = "GPU" }) {
  const config = filterConfig[productType] || filterConfig.GPU;
  const { title, categories, brands, priceMax } = config;

  return (
    <aside className="hidden md:flex flex-col bg-white p-4 rounded-lg w-64 flex-shrink-0 sticky top-24 h-fit overflow-y-auto no-scrollbar gap-stack-lg border-r pr-stack-md shadow-md">
      <div className="flex flex-col gap-1">
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          ตัวกรอง
        </h2>
        <p className="text-sm text-on-surface-variant">ประเภท: {title}</p>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">category</span>
          <span className="font-label-md text-label-md">หมวดหมู่</span>
        </div>
        <div className="flex flex-col gap-2 pl-8">
          {categories.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 text-body-sm cursor-pointer hover:text-primary"
            >
              <input
                className="rounded text-primary border-outline-variant"
                type="checkbox"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-label-md">ช่วงราคา</span>
        </div>
        <div className="px-8 mt-2">
          <input className="w-full accent-primary" type="range" />
          <div className="flex justify-between mt-2 text-label-sm text-on-surface-variant">
            <span>0฿</span>
            <span>{priceMax}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">verified</span>
          <span className="font-label-md text-label-md">แบรนด์</span>
        </div>
        <div className="flex flex-col gap-2 pl-8">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-body-sm cursor-pointer hover:text-primary"
            >
              <input
                className="rounded text-primary border-outline-variant"
                type="checkbox"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
