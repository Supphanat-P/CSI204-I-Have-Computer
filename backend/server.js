const express = require("express");
const cors = require("cors");

const { getProducts, getProductById, createProduct, updateProduct } = require("./routes/products");
const { registerUser, loginUser, updateProfile } = require("./routes/auth");
const { createOrder, getOrders, getAllOrdersForManager, updateOrderStatus } = require("./routes/orders");
const { authMiddleware, adminMiddleware, managerMiddleware } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);
// เช็ค สิทธิ์ Token ก่อนสร้างหรืออัปเดตสินค้า
app.post("/api/products/create", authMiddleware, adminMiddleware, createProduct);
app.post("/api/products/update", authMiddleware, adminMiddleware, updateProduct);

app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.post("/api/profile/update", authMiddleware, updateProfile);

app.post("/api/orders", authMiddleware, createOrder);
app.get("/api/orders", authMiddleware, getOrders);

// Manager order status management routes
app.get("/api/manager/orders", authMiddleware, managerMiddleware, getAllOrdersForManager);
app.post("/api/manager/orders/update-status", authMiddleware, managerMiddleware, updateOrderStatus);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
