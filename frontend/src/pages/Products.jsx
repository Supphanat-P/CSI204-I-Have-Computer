import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../component/Products/ProductCard";
import AsideFilterProducts from "../component/Products/AsideFilterProducts";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productType = searchParams.get("productType") || "ALL";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam && products.length > 0) {
      const matchedBrand = [...new Set(products.map((p) => p.brand))].find(
        (b) => b && b.toLowerCase() === brandParam.toLowerCase()
      );
      setSelectedBrands(matchedBrand ? [matchedBrand] : [brandParam]);
    } else if (!brandParam) {
      setSelectedBrands([]);
    }
  }, [searchParams, products]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get("/api/products");
        if (isMounted) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) {
          setError("ไม่สามารถโหลดข้อมูลสินค้าได้ในขณะนี้");
        }
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedType("");
    setSelectedBrands([]);
    setSelectedExtras({});
    setOnlyInStock(false);
    setSortBy("featured");
  }, [productType]);

  const availableProducts = useMemo(() => {
    if (productType !== "ALL") {
      return products.filter((p) => p.type === productType);
    }

    if (selectedType) {
      return products.filter((p) => p.type === selectedType);
    }

    return products;
  }, [products, productType, selectedType]);

  const brands = useMemo(() => {
    return [...new Set(availableProducts.map((p) => p.brand).filter(Boolean))].sort();
  }, [availableProducts]);

  const types = useMemo(() => {
    return [...new Set(products.map((p) => p.type).filter(Boolean))].sort();
  }, [products]);

  const priceMaxLimit = useMemo(() => {
    if (!availableProducts.length) return 0;
    return Math.max(...availableProducts.map((p) => Number(p.price || 0)));
  }, [availableProducts]);

  useEffect(() => {
    setMaxPrice(priceMaxLimit);
  }, [priceMaxLimit]);

  const filters = useMemo(() => {
    const result = {};

    availableProducts.forEach((product) => {
      Object.entries(product.attributes || {}).forEach(([key, value]) => {
        if (!result[key]) {
          result[key] = new Set();
        }

        if (Array.isArray(value)) {
          value.forEach((item) => result[key].add(item));
        } else {
          result[key].add(value);
        }
      });
    });

    return Object.fromEntries(
      Object.entries(result).map(([key, values]) => [
        key,
        [...values].sort((a, b) => {
          const na = Number(a);
          const nb = Number(b);
          if (!Number.isNaN(na) && !Number.isNaN(nb)) {
            return na - nb;
          }
          return String(a).localeCompare(String(b));
        }),
      ])
    );
  }, [availableProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const result = availableProducts.filter((product) => {
      const matchBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      const matchAttributes = Object.entries(selectedExtras).every(
        ([key, selected]) => {
          if (!selected.length) return true;

          const value = product.attributes?.[key];

          if (Array.isArray(value)) {
            return selected.some((item) => value.includes(item));
          }

          return selected.includes(value);
        }
      );

      const matchPrice = Number(product.price || 0) <= maxPrice;
      const matchStock = !onlyInStock || Number(product.stock || 0) > 0;
      const matchSearch =
        !normalizedSearch ||
        [product.name, product.brand, product.category, product.type]
          .filter(Boolean)
          .some((field) => field.toString().toLowerCase().includes(normalizedSearch));

      return matchBrand && matchAttributes && matchPrice && matchStock && matchSearch;
    });

    if (sortBy === "price_asc") {
      return result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }
    if (sortBy === "price_desc") {
      return result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }
    if (sortBy === "name") {
      return result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    }
    if (sortBy === "stock_asc") {
      return result.sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
    }
    if (sortBy === "stock_desc") {
      return result.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    }

    return result.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
  }, [
    availableProducts,
    selectedBrands,
    selectedExtras,
    maxPrice,
    onlyInStock,
    searchQuery,
    sortBy,
  ]);

  const toggleValue = (currentValues, value) =>
    currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

  const handleBrandChange = (brand) => {
    setSelectedBrands((current) => toggleValue(current, brand));
  };

  const handleExtraChange = (groupKey, value) => {
    setSelectedExtras((current) => {
      const currentValues = current[groupKey] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        [groupKey]: nextValues,
      };
    });
  };

  const resetBasicFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedExtras({});
    setMaxPrice(priceMaxLimit);
    setOnlyInStock(false);
    setSortBy("featured");
    setSelectedType("");
    setSearchParams({ productType: "ALL" });
  };

  const displayedType = productType === "ALL" ? selectedType || "ทั้งหมด" : productType;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-container-max mx-auto px-margin-desktop pt-6">
        <nav className="flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">
            หน้าหลัก
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            สินค้า
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface">{displayedType}</span>
        </nav>

        <main className={`mt-6 pb-10 ${productType === "ALL" ? "" : "flex gap-gutter"}`}>
          {productType !== "ALL" && (
            <AsideFilterProducts
              productType={productType}
              brands={brands}
              filters={filters}
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
              selectedExtras={selectedExtras}
              onExtraChange={handleExtraChange}
              maxPrice={maxPrice}
              priceMaxLimit={priceMaxLimit}
              onPriceChange={setMaxPrice}
            />
          )}

          {productType === "ALL" && (
            <div className="mb-5 rounded-3xl border border-outline-variant bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-outline-variant pb-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-headline-lg font-headline-lg text-on-surface">
                    ค้นหาสินค้า
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={resetBasicFilters}
                    className="rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-sm font-medium transition hover:bg-surface-container"
                  >
                    รีเซ็ตฟิลเตอร์
                  </button>

                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <label className="mb-2 block text-sm font-medium text-on-surface">ค้นหาสินค้า</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                      search
                    </span>
                    <input
                      className="w-full rounded-2xl border border-outline-variant bg-surface-container-low py-3 pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="พิมพ์ชื่อสินค้า, แบรนด์, หมวดหมู่..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <label className="mb-2 block text-sm font-medium text-on-surface">แบรนด์</label>
                  <select
                    value={selectedBrands[0] || ""}
                    onChange={(e) => setSelectedBrands(e.target.value ? [e.target.value] : [])}
                    className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">ทุกแบรนด์</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-on-surface">เรียงลำดับ</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="featured">แนะนำ</option>
                    <option value="name">ชื่อ A-Z</option>
                    <option value="price_asc">ราคาต่ำ - สูง</option>
                    <option value="price_desc">ราคาสูง - ต่ำ</option>
                    <option value="stock_desc">สต็อกมาก - น้อย</option>
                    <option value="stock_asc">สต็อกน้อย - มาก</option>
                  </select>
                </div>

                {/* <div className="lg:col-span-2 flex items-end">
                  <label className="flex h-full w-full items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-medium text-on-surface">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    เฉพาะสินค้าที่มีสต็อก
                  </label>
                </div> */}
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-on-surface">ช่วงราคา</span>
                  <span className="text-on-surface-variant">
                    สูงสุด ฿{Number.isFinite(maxPrice) ? maxPrice.toLocaleString() : 0}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={priceMaxLimit || 0}
                  value={Number.isFinite(maxPrice) ? maxPrice : priceMaxLimit}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
                <div className="mt-1 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>฿0</span>
                  <span>฿{priceMaxLimit.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType("")}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedType === ""
                    ? "border-primary bg-primary text-white"
                    : "border-outline-variant bg-white hover:bg-surface-container-low"
                    }`}
                >
                  ทุกประเภท
                </button>
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setSearchParams({ productType: type })
                    } className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedType === type
                      ? "border-primary bg-primary text-white"
                      : "border-outline-variant bg-white hover:bg-surface-container-low"
                      }`}
                  >
                    {type}
                  </button>
                ))}

              </div>
            </div>
          )}

          <section className="flex-1 bg-white rounded-lg p-4 h-fit shadow-md mb-5">
            <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-outline-variant pb-4 gap-5">
              <div>
                <h2 className="text-headline-lg font-headline-lg text-on-surface">
                  {productType === "ALL"
                    ? "แสดงสินค้าทั้งหมด"
                    : `${productType}`}
                </h2>

              </div>

              <div className="relative w-full md:w-[50%]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Search ..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {productType !== "ALL" && (
                <button
                  className="px-4 py-2 rounded-full shadow border transition hover:bg-primary hover:text-white hover:shadow-md"
                  onClick={() => setSearchParams({ productType: "ALL" })}
                >
                  กลับไปดูทั้งหมด
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-16 text-center text-on-surface-variant">
                กำลังโหลดสินค้า...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-600">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant">
                ไม่พบสินค้าที่ตรงกับตัวกรองที่เลือก
              </div>
            ) : productType === "ALL" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-16 mt-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter mb-16 mt-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div >
  );
}
