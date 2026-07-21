import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../component/Products/ProductCard";
import AsideFilterProducts from "../component/Products/AsideFilterProducts";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productType, setProductType] = useState("ALL")

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
  console.log("product", productType)

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

    // การจัดเรียง (Sort)
    if (sortBy === "price_asc") {
      return result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }
    if (sortBy === "price_desc") {
      return result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }
    if (sortBy === "name") {
      return result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
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

  const displayedType = productType === "ALL" ? selectedType || "ทั้งหมด" : productType;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-container-max mx-auto px-margin-desktop pt-6">
        {/* Breadcrumbs Nav */}
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

        <main className="mt-6 pb-10 flex gap-gutter">
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

          <section className="flex-1 min-w-0">
            <div className="mb-5 rounded-xl border border-outline-variant bg-white p-4 shadow-sm">
              <span className="font-semibold text-sm text-on-surface">ประเภทสินค้า</span>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setProductType("ALL")}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${productType === "ALL"
                    ? "border-primary bg-primary text-white"
                    : "border-outline-variant bg-white hover:bg-surface-container-low"
                    }`}
                >
                  ทุกประเภท
                </button>
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setProductType(type);
                      setSelectedType(type);
                    }}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${(productType === type || selectedType === type)
                      ? "border-primary bg-primary text-white"
                      : "border-outline-variant bg-white hover:bg-surface-container-low"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>


            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center border-b border-outline-variant pb-4 gap-4">
                <h2 className="text-headline-sm lg:text-headline-md font-bold text-on-surface shrink-0">
                  {productType === "ALL" ? "สินค้าทั้งหมด" : `ผลการค้นหา ${productType}`}
                </h2>

                <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 justify-end">
                  <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                      search
                    </span>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="ค้นหาสินค้า..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <div className="relative w-full sm:w-auto">
                      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                        sort
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto bg-surface-container-low border border-outline-variant rounded-lg pl-8 pr-8 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none"
                      >
                        <option value="price_asc">ราคา: น้อย ไป มาก</option>
                        <option value="price_desc">ราคา: มาก ไป น้อย</option>
                        <option value="name">ชื่อสินค้า (A - Z)</option>
                      </select>
                    </div>
                  </div>
                </div>
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
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter mb-6 mt-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div >
  );
}