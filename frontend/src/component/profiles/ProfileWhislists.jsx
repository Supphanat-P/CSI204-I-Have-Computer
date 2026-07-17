
import { useNavigate, useLocation, Link } from "react-router-dom";
export default function ProfileWhistlists(
    { wishlist, handleUnlike, addToCart }
) {
    const navigate = useNavigate();

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
                    <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
                    <h2 className="text-2xl font-bold text-on-surface">สินค้าที่ถูกใจ</h2>
                </div>

                {wishlist.length === 0 ? (
                    <div className="py-16 text-center text-on-surface-variant flex flex-col items-center">
                        <div className="w-16 h-16 bg-error/5 rounded-full flex items-center justify-center text-error mb-4 shadow-inner">
                            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                                favorite
                            </span>
                        </div>
                        <h3 className="font-bold text-lg text-on-surface mb-1">ยังไม่มีสินค้าที่ถูกใจ</h3>
                        <p className="text-sm text-on-surface-variant max-w-xs mb-6">คุณสามารถกดปุ่มรูปหัวใจบนหน้าสินค้าที่คุณชื่นชอบเพื่อเก็บไว้ดูได้ที่นี่</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl text-body-sm font-semibold hover:bg-primary-fixed-dim hover:text-primary-fixed transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                        >
                            ไปเลือกช็อปสินค้า
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {wishlist.map((item) => (
                            <div key={item.id} className="border border-outline-variant rounded-2xl p-4 bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative">
                                <div>
                                    <div className="aspect-square w-full bg-surface-container rounded-xl overflow-hidden mb-3 relative flex items-center justify-center">
                                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain p-2" />
                                        <button
                                            onClick={() => handleUnlike(item.id)}
                                            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-on-surface text-body-md line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-on-surface-variant mb-2">{item.brand} | {item.category || item.productType}</p>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant">
                                    <span className="font-bold text-primary">{item.price.toLocaleString()}฿</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="bg-primary text-white text-xs px-3.5 py-1.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container font-semibold transition-all cursor-pointer"
                                    >
                                        ใส่รถเข็น
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div></>
    )
}