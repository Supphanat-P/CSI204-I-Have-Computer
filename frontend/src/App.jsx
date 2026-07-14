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
import ManageProducts from "./pages/manager/ManageProducts";
import ManagerLayout from "./layouts/ManagerLayout";
import ShippingStatus from "./pages/manager/ShippingStatus";
import ManageUser from "./pages/admin/ManageUser";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext";

function App() {
  return (
    <AlertProvider>
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
            <Route path="manageProduct" element={<ManageProducts />} />
            <Route path="manageUser" element={<ManageUser />} />
            <Route path="shipping" element={<ShippingStatus />} />
          </Route>

          <Route path="/manager" element={<ManagerLayout />}>
            <Route path="manageProduct" element={<ManageProducts />} />
            <Route path="shipping" element={<ShippingStatus />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
    </AlertProvider>
  );
}

export default App;
