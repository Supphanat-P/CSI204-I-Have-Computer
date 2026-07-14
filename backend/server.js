const express = require("express");
const cors = require("cors");

const { getProducts, getProductById, createProduct, updateProduct } = require("./routes/products");
const { registerUser, loginUser, updateProfile } = require("./routes/auth");
const { authMiddleware } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);
app.post("/api/products/create", authMiddleware, createProduct);
app.post("/api/products/update", authMiddleware, updateProduct);

app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.post("/api/profile/update", authMiddleware, updateProfile);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
