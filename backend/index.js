require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const HoldingModel = require("./models/HoldingModel");
const PositionModel = require("./models/PositionModel");
const OrderModel = require("./models/OrderModel");

const authRoutes = require("./routes/authRoutes"); 
const auth = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URL;

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// -------------------- API ROUTES --------------------

// Auth routes
app.use("/api/auth", authRoutes);

// Protected example route
app.get("/protected", auth, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

// Holdings and positions
app.get("/allHoldings", async (req, res) => {
  try {
    const allHolding = await HoldingModel.find({});
    res.json(allHolding);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching holdings");
  }
});

app.get("/allPosition", async (req, res) => {
  try {
    const allPosition = await PositionModel.find({});
    res.json(allPosition);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching positions");
  }
});

// Orders
app.get("/orders", auth, async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const userOrders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});
// Inside POST /newOrder, ensure auth and userId
app.post("/newOrder", auth, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const newOrder = new OrderModel({
      name,
      qty,
      price,
      mode,
      userId: req.user.id, // associate order with logged-in user
    });

    await newOrder.save();
    res.json({ message: "Order successfully placed", order: newOrder });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Error saving order" });
  }
});

// GET /orders
app.get("/orders", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userOrders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});


// -------------------- START SERVER --------------------
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Backend started on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

startServer();
