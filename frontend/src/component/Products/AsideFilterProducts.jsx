import { useState } from "react";
function formatPrice(value) {
  return `${value.toLocaleString("th-TH")}฿`;
}
const filterLabel = {
  socket: "Socket",
  chipset: "Chipset",
  cores: "Cores",
  size: "Size",
  resolution: "Resolution",
  panel: "Panel",
  refreshRate: "Refresh Rate",
  memory: "Memory",
  architecture: "Architecture",
  capacity: "Capacity",
  ddr: "DDR",
  speed: "Speed",
  interface: "Interface",
  rpm: "RPM",
  watt: "Power",
  efficiency: "Efficiency",
  type: "Type",
  formFactor: "Form Factor",
  motherboardSupport: "Motherboard Support",
  color: "Color",
  layout: "Layout",
  switch: "Switch",
  connection: "Connection",
  weight: "Weight",
  rgb: "RGB",
  microphone: "Microphone",
  fps: "FPS",
  gpuSeries: "GPU Series",
  memorySize: "Memory Size",
  powerRequirement: "Power Requirement",
  threads: "Threads",
  boostClock: "Boost Clock"
};

export default function AsideFilterProducts({
  productType,
  brands,
  filters,
  types,

  selectedType,
  onTypeChange,

  selectedBrands,
  onBrandChange,

  selectedExtras,
  onExtraChange,

  maxPrice,
  priceMaxLimit,
  onPriceChange,
}) {
  const [collapsed, setCollapsed] = useState({});
  const toggleSection = (key) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const renderSection = (
    key,
    title,
    items,
    selectedValues,
    onChange,
    icon = "tune",
  ) => (
    <div className="flex flex-col gap-stack-sm mt-3" key={key}>
      <button
        type="button"
        onClick={() => toggleSection(key)}
        className="flex items-center justify-between w-full text-primary"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">{icon}</span>
          <span className="font-label-md">{title}</span>
        </div>

        <span className="material-symbols-outlined">
          {collapsed[key] ? "expand_more" : "expand_less"}
        </span>
      </button>

      {!collapsed[key] && (
        <div className="flex flex-col gap-2 pl-8">
          {items.map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="rounded accent-primary"
                checked={selectedValues.includes(item)}
                onChange={() => onChange(item)}
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
  return (
    <aside className="hidden md:flex flex-col bg-white p-4 rounded-lg w-64 shrink-0 sticky top-24 h-fit overflow-y-auto no-scrollbar gap-stack-lg border-r shadow-md">
      <div>
        <h2 className="text-headline-sm font-headline-sm text-on-surface-variant text-primary">
          ตัวกรอง
        </h2>

        <p className="text-sm text-on-surface-variant">
          ประเภท : {productType}
        </p>
      </div>
      {Object.entries(filters).map(([key, values]) =>
        renderSection(
          key,
          filterLabel[key] || key,
          values,
          selectedExtras[key] || [],
          (value) => onExtraChange(key, value),
        ),
      )}

      <div className="flex flex-col gap-stack-sm mt-3">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">
            payments
          </span>

          <span className="font-label-md">
            ช่วงราคา
          </span>
        </div>

        <div className="px-8 mt-2">
          <input
            type="range"
            min={0}
            max={priceMaxLimit}
            value={maxPrice}
            className="w-full accent-primary"
            onChange={(e) =>
              onPriceChange(Number(e.target.value))
            }
          />

          <div className="flex justify-between mt-2 text-sm">
            <span>0฿</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </div>
      </div>

      {brands.length > 0 &&
        renderSection(
          "brands",
          "แบรนด์",
          brands,
          selectedBrands,
          onBrandChange,
          "verified",
        )}
    </aside>
  );
}