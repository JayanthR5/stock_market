require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routers
const userRouter = require("./routes/UserRouter");
const productRouter = require("./routes/ProductRouter");
const stockRouter = require("./routes/StockRouter");
const reportRouter = require("./routes/ReportRouter");
const exportRouter = require("./routes/ExportRouter");

// Error handler
const globalErrorHandler = require("./middlewares/GlobalErrorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

//////////////////////////////
// 🔐 Security Middlewares
//////////////////////////////
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

//////////////////////////////
// 🌐 Middlewares
//////////////////////////////
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use(express.json());

//////////////////////////////
// 🩺 Health Check Route
//////////////////////////////
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Stock Market API running 🚀"
  });
});

//////////////////////////////
// 📌 API Routes
//////////////////////////////
app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/stock", stockRouter);
app.use("/api/reports", reportRouter);
app.use("/api/export", exportRouter);

//////////////////////////////
// ❌ Global Error Handler
//////////////////////////////
app.use(globalErrorHandler);

//////////////////////////////
// 🍃 MongoDB Connection
//////////////////////////////
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });