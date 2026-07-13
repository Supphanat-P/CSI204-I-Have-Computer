import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Homepage from "./pages/Homepage";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profiles from "./pages/Profiles";
import Checkout from "./pages/Checkout";
import AdminProducts from "./pages/AdminProducts";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/productsDetails/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profiles />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminProducts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
