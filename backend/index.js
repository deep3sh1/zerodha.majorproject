require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const HoldingModel = require("./models/HoldingModel");
const PositionModel = require("./models/PositionModel");
const OrderModel = require("./models/OrderModel");

const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/authMiddleware");

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URL;

const app = express();

// -------------------- FIXED CORS --------------------
const allowedOrigins = [
  "https://zerodha-majorproject-fronted.onrender.com",
  "https://zerodha-majorproject-dashboard.onrender.com",
  "https://zerodha-majorproject-2.onrender.com", // backend itself
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// -------------------- API ROUTES --------------------
app.use("/api/auth", authRoutes);

app.get("/protected", auth, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

// Holdings
app.get("/allHoldings", async (req, res) => {
  try {
    const data = await HoldingModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching holdings");
  }
});

// Positions
app.get("/allPosition", async (req, res) => {
  try {
    const data = await PositionModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching positions");
  }
});

// Orders (protected)
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
      userId: req.user.id,
    });

    await newOrder.save();
    res.json({ message: "Order successfully placed", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Error saving order" });
  }
});

app.get("/orders", auth, async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// -------------------- START SERVER --------------------
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

startServer();
