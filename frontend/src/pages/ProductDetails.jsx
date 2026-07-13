import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import ProductCard from "../component/Products/ProductCard";
import axios from "axios";

export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
        async function loadProduct() {
            try {
                setLoading(true);

                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);

                const res = await axios.get("/api/products");

                const related = res.data
                    .filter(
                        (p) =>
                            p.type === data.type &&
                            p.id !== data.id
                    )
                    .slice(0, 4);

                setRelatedProducts(related);
            } catch (err) {
                console.error(err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                กำลังโหลด...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <span className="material-symbols-outlined text-[64px] text-outline">error</span>
                <h2 className="text-headline-md font-bold text-on-surface">ไม่พบสินค้านี้</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-primary text-on-primary px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    กลับไปหน้าก่อนหน้า
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const productSpecs = product?.attributesDetails
        ? Object.entries(product.attributesDetails)
        : [];

    return (
        <div className="bg-background min-h-screen pt-5 pb-16 px-4 md:px-margin-desktop">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-label-md text-on-surface-variant mb-8">
                <Link to="/" className="hover:text-primary transition-colors">หน้าแรก</Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <Link to={`/Products?productType=${product.type}`}>
                    {product.type}
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-on-surface truncate max-w-[200px] md:max-w-none">{product.name}</span>
            </nav>

            {/* Main Product Section */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm w-[80%] justify-self-center border border-outline-variant p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Product Image */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="aspect-square bg-surface rounded-xl overflow-hidden relative border border-outline-variant/30 flex items-center justify-center p-2">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 rounded-xl"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <span className="text-primary font-bold tracking-widest uppercase text-label-md mb-2">
                        {product.brand}
                    </span>
                    <h1 className="text-display-lg-mobile md:text-[40px] font-bold text-on-surface mb-2 leading-tight">
                        {product.name}
                    </h1>
                    <p className="text-body-lg text-on-surface-variant mb-6">
                        หมวดหมู่: <span className="font-medium text-on-surface">{product.category}</span>
                    </p>

                    <div className="bg-surface-container rounded-xl p-6 mb-8 border border-outline-variant/50">
                        <div className="flex items-end gap-4 mb-2">
                            <span className="text-[32px] md:text-[48px] font-bold text-primary leading-none">
                                {product.price.toLocaleString()}฿
                            </span>
                        </div>
                        <p className="text-label-sm text-outline flex items-center gap-1 mt-2">
                            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                            จัดส่งฟรีทั่วประเทศเมื่อมียอดสั่งซื้อขั้นต่ำ 1,000฿
                        </p>
                    </div>



                    <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-outline-variant/50">
                        <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden h-[56px] w-full sm:w-[140px] shrink-0">
                            <button
                                className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                            <div className="flex-1 h-full flex items-center justify-center font-bold text-body-lg text-on-surface">
                                {quantity}
                            </div>
                            <button
                                className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex-1 h-[56px] bg-primary text-on-primary rounded-lg font-bold text-body-lg flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">shopping_cart_checkout</span>
                            เพิ่มลงรถเข็น
                        </button>
                    </div>
                </div>
            </div>
 
            {/* Product Full Specifications Section */}
            {productSpecs.length > 0 && (
                <div className="w-[80%] mx-auto mt-12">
                    <h2 className="text-headline-md font-bold text-on-surface mb-6">รายละเอียดข้อมูลจำเพาะ</h2>
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                        {productSpecs.map(([key, value]) => (
                            <div key={key} className="grid grid-cols-1 md:grid-cols-4 border-b border-outline-variant last:border-b-0 hover:bg-surface-container/30 transition-colors">
                                <div className="py-4 px-6 font-semibold text-on-surface capitalize border-r-0 md:border-r border-outline-variant/50">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="py-4 px-6 text-on-surface-variant md:col-span-3 whitespace-pre-line">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-4">
                        <h2 className="text-headline-md font-bold text-on-surface">สินค้าอื่นๆ ในหมวดหมู่เดียวกัน</h2>
                        <Link
                            to={`/Products?productType=${product.productType}`}
                            className="text-primary font-medium hover:underline flex items-center gap-1"
                        >
                            ดูทั้งหมด <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gutter">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
