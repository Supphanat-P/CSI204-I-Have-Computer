import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";

const CartContext = createContext();

function getMaxQuantity(item) {
  if (item?.stock === undefined || item?.stock === null || item?.stock === "") {
    return Infinity;
  }

  const stock = Number(item.stock);
  if (!Number.isFinite(stock)) {
    return Infinity;
  }

  return stock > 0 ? stock : 0;
}

function clampQuantity(quantity, maxQuantity) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  if (!Number.isFinite(maxQuantity)) {
    return safeQuantity;
  }
  return Math.min(safeQuantity, maxQuantity);
}

function normalizeCartItems(items) {
  return items.flatMap((item) => {
    const maxQuantity = getMaxQuantity(item);
    if (Number.isFinite(maxQuantity) && maxQuantity <= 0) {
      return [];
    }

    return [
      {
        ...item,
        quantity: clampQuantity(item.quantity, maxQuantity),
      },
    ];
  });
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? normalizeCartItems(JSON.parse(savedCart)) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  const { showAlert } = useAlert();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      await showAlert({
        title: "ต้องเข้าสู่ระบบ",
        message: "กรุณาเข้าสู่ระบบก่อนทำการเพิ่มสินค้าลงตะกร้า"
      });
      window.location.href = "/login";
      return;
    }

    const maxQuantity = getMaxQuantity(product);
    if (Number.isFinite(maxQuantity) && maxQuantity <= 0) {
      await showAlert({
        title: "สินค้าหมด",
        message: "สินค้านี้ไม่มีสต็อกให้เพิ่มในตะกร้าแล้ว"
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (maxQuantity <= 0) {
          return prevCart.filter((item) => item.id !== product.id);
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: clampQuantity(item.quantity + 1, getMaxQuantity(item)) }
            : item
        );
      }
      if (maxQuantity <= 0) {
        return prevCart;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.flatMap((item) => {
        if (item.id !== productId) {
          return [item];
        }

        const maxQuantity = getMaxQuantity(item);
        if (maxQuantity <= 0) {
          return [];
        }

        return [
          {
            ...item,
            quantity: clampQuantity(quantity, maxQuantity),
          },
        ];
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
