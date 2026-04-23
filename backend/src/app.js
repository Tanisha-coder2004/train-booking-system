const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const logger = require("./shared/utils/logger");

const app = express();

// Load OpenAPI spec
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/openapi.yaml"));

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (VERY IMPORTANT in production)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler (basic for now)
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;