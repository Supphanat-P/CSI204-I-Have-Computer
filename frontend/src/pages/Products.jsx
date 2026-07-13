import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../component/Products/ProductCard";
import AsideFilterProducts from "../component/Products/AsideFilterProducts";

export default function Products() {
  const [searchParams] = useSearchParams();
  const productType = searchParams.get("productType") || "ALL";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to load products");

        const data = await response.json();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("ไม่สามารถโหลดข้อมูลสินค้าได้ในขณะนี้");
        }
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
    if (productType === "ALL") return products;
    return products.filter((item) => item.productType === productType);
  }, [productType, products]);

  useEffect(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedExtras({});
    setMaxPrice(
      Math.max(...availableProducts.map((product) => product.price), 0),
    );
  }, [availableProducts, productType]);

  const priceMaxLimit = useMemo(
    () => Math.max(...availableProducts.map((product) => product.price), 0),
    [availableProducts],
  );

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        (productType === "ALL"
          ? selectedCategories.includes(product.productType)
          : selectedCategories.includes(product.category));

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      const matchesExtras = Object.entries(selectedExtras).every(
        ([key, values]) => {
          if (!values.length) return true;

          const productValue = product[key];
          
          console.log("-------------")
          console.log("Product", values)
          console.log("Key", key)
          console.log("ProductKey", productValue)
          console.log("-------------")

          if (Array.isArray(productValue)) {
            return values.some((selectedValue) =>
              productValue.includes(selectedValue),
            );
          }

          return values.includes(productValue);
        },
      );

      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesBrand && matchesExtras && matchesPrice;
    });
  }, [
    availableProducts,
    productType,
    selectedCategories,
    selectedBrands,
    selectedExtras,
    maxPrice,
  ]);

  const toggleValue = (currentValues, value) =>
    currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

  const handleCategoryChange = (category) => {
    setSelectedCategories((current) => toggleValue(current, category));
  };

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
      <main className="mt-20 mx-40 px-margin-desktop py-stack-lg flex gap-gutter">
        <AsideFilterProducts
          productType={productType}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          selectedBrands={selectedBrands}
          onBrandChange={handleBrandChange}
          selectedExtras={selectedExtras}
          onExtraChange={handleExtraChange}
          maxPrice={maxPrice}
          priceMaxLimit={priceMaxLimit}
          onPriceChange={setMaxPrice}
        />
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
