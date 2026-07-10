const filterConfig = {
  ALL: {
    title: "ALL",
    categories: ["Monitor", "GPU", "CPU", "RAM", "Headphones", "Keyboard"],
    brands: ["ASUS", "LG", "Dell", "Acer"],
  },
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
    socket: [
      "AMD AM4",
      "AMD AM5",
      "INTEL 1150",
      "INTEL 1151",
      "INTEL 1200",
      "INTEL 1700",
    ],
    brands: ["Intel", "AMD"],
    priceMax: "40,000฿+",
  },
  RAM: {
    title: "RAM",
    categories: ["8GB", "16GB", "32GB", "64GB"],
    ddr: ["DDR3", "DDR4", "DDR5"],
    bus: ["2400", "2666", "3200", "3600", "4000"],
    brands: ["Corsair", "Kingston", "G.Skill", "ADATA"],
    priceMax: "15,000฿+",
  },
  Headphones: {
    title: "Headphones",
    categories: ["IEM", "HEADSET", "WIRELESS", "WIRED"],
    brands: ["Razer", "Cozoy", "HyperX"],
    priceMax: "30,000฿+",
  },
  Keyboard: {
    title: "Keyboard",
    categories: ["HALL EFFECT", "MECHANICAL", "WIRELESS", "WIRED"],
    brands: [
      "AULA",
      "VGN",
      "WOOTING",
      "VENOM",
      "IROK",
      "NUBWO",
      "FANTECH",
      "LOGA",
      "EGA",
      "DEAKY",
      "MARVO",
    ],
    priceMax: "30,000฿+",
  },
};

function formatPrice(value) {
  return `${value.toLocaleString("th-TH")}฿`;
}

export default function AsideFilterProducts({
  productType = "ALL",
  selectedCategories = [],
  onCategoryChange,
  selectedBrands = [],
  onBrandChange,
  selectedExtras = {},
  onExtraChange,
  maxPrice = 0,
  priceMaxLimit = 0,
  onPriceChange,
}) {
  const config = filterConfig[productType] || filterConfig.GPU;
  const { title, categories = [], brands = [], priceMax } = config;
  const extraFilters = Object.entries(config).filter(
    ([key, value]) =>
      Array.isArray(value) &&
      !["categories", "brands", "title", "priceMax"].includes(key),
  );

  const sectionLabelMap = {
    categories: "หมวดหมู่",
    brands: "แบรนด์",
    socket: "Socket",
    ddr: "DDR",
    bus: "Bus Speed",
  };

  const renderFilterSection = (key, label, items, icon) => {
    const selectedValues =
      key === "categories"
        ? selectedCategories
        : key === "brands"
          ? selectedBrands
          : selectedExtras[key] || [];

    return (
      <div key={key} className="flex flex-col gap-stack-sm mt-3">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">{icon}</span>
          <span className="font-label-md text-label-md">{label}</span>
        </div>
        <div className="flex flex-col gap-2 pl-8">
          {items.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 text-body-sm cursor-pointer hover:text-primary"
            >
              <input
                className="rounded text-primary border-outline-variant"
                type="checkbox"
                checked={selectedValues.includes(item)}
                onChange={() => {
                  if (key === "categories") {
                    onCategoryChange?.(item);
                  } else if (key === "brands") {
                    onBrandChange?.(item);
                  } else {
                    onExtraChange?.(key, item);
                  }
                }}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const sliderMax = Math.max(priceMaxLimit, 1);

  return (
    <aside className="hidden md:flex flex-col bg-white p-4 rounded-lg w-64 shrink-0 sticky top-24 h-fit overflow-y-auto no-scrollbar gap-stack-lg border-r pr-stack-md shadow-md">
      <div className="flex flex-col gap-1">
        <h2 className="text-headline-sm font-headline-sm text-on-surface">
          ตัวกรอง
        </h2>
        <p className="text-sm text-on-surface-variant">ประเภท: {title}</p>
      </div>

      {categories.length > 0 &&
        renderFilterSection(
          "categories",
          sectionLabelMap.categories,
          categories,
          "category",
        )}

      {extraFilters.map(([key, items]) =>
        renderFilterSection(key, sectionLabelMap[key] || key, items, "tune"),
      )}

      <div className="flex flex-col gap-stack-sm mt-3">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label-md text-label-md">ช่วงราคา</span>
        </div>
        <div className="px-8 mt-2">
          <input
            className="w-full accent-primary"
            type="range"
            min="0"
            max={sliderMax}
            value={Math.min(maxPrice, sliderMax)}
            onChange={(event) => onPriceChange?.(Number(event.target.value))}
          />
          <input
            className="w-full accent-primary rounded-xl h-10"
            onChange={(event) => onPriceChange?.(Number(event.target.value))}
          />
          <div className="flex justify-between mt-2 text-label-sm text-on-surface-variant">
            <span>0฿</span>
            <span>{formatPrice(Math.min(maxPrice, sliderMax))}</span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            สูงสุด {priceMax || priceMaxLimit}
          </p>
        </div>
      </div>

      {brands.length > 0 &&
        renderFilterSection(
          "brands",
          sectionLabelMap.brands,
          brands,
          "verified",
        )}
    </aside>
  );
}
