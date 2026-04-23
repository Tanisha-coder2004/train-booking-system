const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const logger = require("./shared/utils/logger");

const app = express();

// ======================
// Global Middlewares
// ======================
app.use(cors());
app.use(express.json());

// ======================
// Health Check
// ======================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ======================
// Routes
// ======================
app.use("/api/v1", routes);
// ======================
// 404 Handler (IMPORTANT)
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;