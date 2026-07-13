import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import ProductCard from "../component/Products/ProductCard";
import AsideFilterProducts from "../component/Products/AsideFilterProducts";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productType = searchParams.get("productType") || "ALL";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get("/api/products");
        console.log(data)

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("ไม่สามารถโหลดข้อมูลสินค้าได้ในขณะนี้");
        }
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

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
    return [...new Set(availableProducts.map((p) => p.brand))].sort();
  }, [availableProducts]);

  const types = useMemo(() => {
    return [...new Set(products.map((p) => p.type))].sort();
  }, [products]);

  const priceMaxLimit = useMemo(() => {
    if (!availableProducts.length) return 0;

    return Math.max(
      ...availableProducts.map((p) => p.price)
    );
  }, [availableProducts]);

  useEffect(() => {
    setSelectedType("");
    setSelectedBrands([]);
    setSelectedExtras({});
  }, [productType]);

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
      ]),
    );
  }, [availableProducts]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product) => {
      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand);

      const matchAttributes = Object.entries(selectedExtras).every(
        ([key, selected]) => {
          if (!selected.length) return true;

          const value = product.attributes?.[key];

          if (Array.isArray(value)) {
            return selected.some((item) => value.includes(item));
          }

          return selected.includes(value);
        },
      );

      const matchPrice = product.price <= maxPrice;

      return matchBrand && matchAttributes && matchPrice;
    });
  }, [
    availableProducts,
    selectedBrands,
    selectedExtras,
    maxPrice,
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
  return (
    <div>
      <main
        className={`mt-20 mx-40 px-margin-desktop py-stack-lg ${productType === "ALL"
          ? ""
          : "flex gap-gutter"
          }`}
      >        {productType !== "ALL" && (
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
          <div className="flex flex-wrap gap-3 mt-5 mb-6">
            <button
              onClick={() =>
                setSearchParams({ productType: "ALL" })
              } className={`px-4 py-2 rounded-full border transition
                        ${selectedType === ""
                  ? "bg-primary text-white border-primary"
                  : "bg-white hover:bg-gray-100"
                }`}
            >
              ทั้งหมด
            </button>

            {types.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSearchParams({ productType: type })
                } className={`px-4 py-2 rounded-full border transition
                          ${selectedType === type
                    ? "bg-primary text-white border-primary"
                    : "bg-white hover:bg-gray-100"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
        <section className="flex-1 bg-white rounded-lg p-4 h-fit shadow-md mb-5">
          <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-outline-variant pb-4 gap-5">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-on-surface">
                {productType === "ALL"
                  ? "แสดงสินค้าทั้งหมด"
                  : `แสดงผลการค้นหาสำหรับ ${productType}`}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                พบสินค้าทั้งหมด {filteredProducts.length} รายการ
              </p>
            </div>
            {/* <div className="flex items-center gap-stack-md">
              <span className="text-label-md text-on-surface-variant">
                เรียงตาม:
              </span>
              <select className="bg-surface-container rounded-lg border-none text-body-sm py-2 px-4 focus:ring-2 focus:ring-primary">
                <option>ยอดนิยม</option>
                <option>ราคา: ต่ำ-สูง</option>
                <option>ราคา: สูง-ต่ำ</option>
                <option>มาใหม่</option>
              </select>
            </div> */}
            {productType != "ALL" && (
              <button
                className="px-4 py-2 rounded-full shadow border transition hover:bg-primary hover:shadow-md"
                onClick={() => setSearchParams({ productType: "ALL" })}
              >
                X
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-16 mt-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
