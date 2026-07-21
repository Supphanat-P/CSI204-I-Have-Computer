const { readJsonFile, writeJsonFile } = require("../utils/fileHandler");

// Utility to parse request JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Handler to create a new order
async function createOrder(req, res) {
  try {
    const orderData = req.body;
    const orders = readJsonFile("orders.json");
    const products = readJsonFile("products.json");
    const userId = req.user ? req.user.id : orderData.userId || "guest";

    const items = Array.isArray(orderData.items) ? orderData.items : [];
    if (items.length === 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "คำสั่งซื้อจะต้องมีสินค้าอย่างน้อยหนึ่งรายการ",
        }),
      );
      return;
    }

    for (const item of items) {
      const product = products.find((p) => Number(p.id) === Number(item.id));
      console.log(product);
      if (!product) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: `ไม่พบสินค้าที่มีรหัส ${item.id}` }));
        return;
      }

      const quantity = Number(item.quantity) || 0;
      if (quantity <= 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `จำนวนสินค้าสำหรับ ${product.name} ต้องมากกว่า 0`,
          }),
        );
        return;
      }

      if (product.stock < quantity) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `สินค้ารายการ "${product.name}" มีสต็อกไม่เพียงพอ (คงเหลือ ${product.stock} ชิ้น)`,
          }),
        );
        return;
      }
    }

    // Reduce stock once order is confirmed.
    const updatedProducts = products.map((product) => {
      const orderedItem = items.find(
        (item) => Number(item.id) === Number(product.id),
      );
      if (orderedItem) {
        return {
          ...product,
          stock: Number(product.stock) - Number(orderedItem.quantity),
          sold: Number(product.stock) + Number(orderedItem.quantity),
        };
      }
      return product;
    });
    writeJsonFile("products.json", updatedProducts);

    const newOrder = {
      ...orderData,
      userId,
      id: orderData.id || `IHC-${Math.floor(10000 + Math.random() * 90000)}`,
      date: orderData.date || new Date().toISOString().split("T")[0],
    };

    orders.push(newOrder);
    writeJsonFile("orders.json", orders);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, order: newOrder }));
  } catch (error) {
    console.error("Create order error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ" }));
  }
}

// Handler to get order history for authenticated user
function getOrders(req, res) {
  try {
    const orders = readJsonFile("orders.json");
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ไม่มีสิทธิ์เข้าถึงข้อมูล" }));
      return;
    }

    const userOrders = orders.filter((o) => o.userId === userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(userOrders));
  } catch (error) {
    console.error("Get orders error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" }),
    );
  }
}

// Handler to get all orders (for managers and admins)
function getAllOrdersForManager(req, res) {
  try {
    const orders = readJsonFile("orders.json");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(orders));
  } catch (error) {
    console.error("Get all orders error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อทั้งหมด",
      }),
    );
  }
}

// Handler to update an order's status
async function updateOrderStatus(req, res) {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "กรุณาระบุรหัสใบสั่งซื้อและสถานะ" }));
      return;
    }

    const orders = readJsonFile("orders.json");
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "ไม่พบใบสั่งซื้อนี้ในระบบ" }));
      return;
    }

    orders[orderIndex].status = status;
    writeJsonFile("orders.json", orders);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, order: orders[orderIndex] }));
  } catch (error) {
    console.error("Update order status error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะการจัดส่ง" }),
    );
  }
}

module.exports = {
  createOrder,
  getOrders,
  getAllOrdersForManager,
  updateOrderStatus,
};
