import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!product) return;
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const favoritesKey = currentUser ? `favorites_${currentUser.id}` : "favorites_guest";
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    setIsLiked(favorites.includes(product.id));
  }, [product]);

  useEffect(() => {
    const handleSyncFavorites = () => {
      if (!product) return;
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      const favoritesKey = currentUser ? `favorites_${currentUser.id}` : "favorites_guest";
      const favorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
      setIsLiked(favorites.includes(product.id));
    };

    window.addEventListener("favoritesUpdated", handleSyncFavorites);
    return () => {
      window.removeEventListener("favoritesUpdated", handleSyncFavorites);
    };
  }, [product]);

  if (!product) return null;

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const favoritesKey = currentUser ? `favorites_${currentUser.id}` : "favorites_guest";
    let favorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");

    if (favorites.includes(product.id)) {
      favorites = favorites.filter((id) => id !== product.id);
      setIsLiked(false);
    } else {
      favorites.push(product.id);
      setIsLiked(true);
    }

    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <div className="group bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col relative mt-5 p-4 max-w-2xs max-w-[320px] max-h-[500px]">
      <div className="absolute top-5 left-2 z-10">
        {product.stock <= 0 && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-label-sm font-bold">
            สินค้าหมด
          </span>
        )}
      </div>
      <button
        onClick={handleToggleLike}
        className={`absolute top-4 right-6 z-10 py-0.5 px-2 bg-surface-container-lowest/90 hover:bg-surface-container-low text-on-surface-variant hover:text-error rounded-full shadow-md backdrop-blur-sm transition-all duration-300 cursor-pointer active:scale-90 flex items-center justify-center border border-outline-variant/30 ${isLiked
          ? "opacity-100 scale-100"
          : "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
          }`}
      >
        <span
          className="mt-0.5 material-symbols-outlined text-lg transition-colors duration-200"
          style={isLiked ? { fontVariationSettings: "'FILL' 1", color: "var(--color-error, #ba1a1a)" } : {}}
        >
          favorite
        </span>
      </button>

      <Link to={`/productsDetails/${product.id}`} className="flex flex-col flex-1">
        <div className="aspect-square bg-surface overflow-hidden">

          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-sm"
            alt={product.name}
            src={product.image}
          />
        </div>
        <div className="p-stack-md flex flex-col flex-1">
          <span className="text-label-sm text-outline font-bold uppercase tracking-wider">
            {product.brand}
          </span>

          <h3 className="text-body-md font-bold text-on-surface line-clamp-1 mt-1 mb-2">
            {product.name}
          </h3>
          <span className="text-sm text-on-surface-variant line-clamp-1">
            {product.description || "สินค้าที่พร้อมส่งและให้บริการหลังการขาย"}
          </span>
          <div className="mt-auto pt-3 flex flex-col gap-1">
            {product.stock > 0 ? (
              <span className="text-headline-sm font-bold text-primary">
                {product.price.toLocaleString()}$
              </span>
            ) : (
              <span className="text-headline-sm font-bold text-gray-500 line-through">
                {product.price.toLocaleString()}$
              </span>)}
          </div>
        </div>
      </Link>
      {product.stock > 0 && (
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-4 right-4 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined">
            add_shopping_cart
          </span>
        </button>
      )}
    </div>
  );
}