const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./config");

const app = express();
const PORT = config.PORT;

app.use(cors());

// Request logging format
morgan.token("target-service", (req) => req._targetService || "Gateway");
app.use(
  morgan(
    ":date[iso] | :method :url | Status: :status | Time: :response-time ms | Target: :target-service"
  )
);

// GET /health - Gateway health-check reporting dynamic routing table
app.get("/health", (req, res) => {
  const routesSummary = {};
  config.services.forEach((service) => {
    routesSummary[service.id] = `${service.prefix} -> ${service.url}`;
  });

  res.status(200).json({
    status: "UP",
    service: "API Gateway",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    routes: routesSummary,
  });
});

// Welcome / Root endpoint
app.get("/", (req, res) => {
  const serviceRegistry = {};
  const endpoints = {};
  config.services.forEach((service) => {
    serviceRegistry[service.id] = service.url;
    endpoints[service.id] = service.prefix;
  });

  res.status(200).json({
    service: "CampusConnect API Gateway",
    version: "1.0.0",
    description: "Single Entry Point for CampusConnect Microservices",
    healthCheck: "/health",
    endpoints,
    serviceRegistry,
  });
});

// Centralized Reverse Proxy Generator
function createServiceProxy(service) {
  return createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        req._targetService = service.name;
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(
          `[Gateway Proxy] -> ${service.name} (${service.url}): ${req.method} ${req.originalUrl} responded with ${proxyRes.statusCode}`
        );
      },
      error: (err, req, res) => {
        console.error(
          `[Gateway Proxy Error] Target service unreachable: ${service.name} at ${service.url} for ${req.method} ${req.originalUrl}. Error: ${err.message}`
        );

        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            statusCode: 502,
            error: "Bad Gateway",
            message: `The upstream service '${service.name}' is unreachable or temporarily down.`,
            targetService: service.name,
            targetUrl: service.url,
            attemptedPath: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          });
        }
      },
    },
    onError: (err, req, res) => {
      console.error(
        `[Gateway Proxy Error - Fallback] Unreachable: ${service.name} (${service.url})`
      );
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          statusCode: 502,
          error: "Bad Gateway",
          message: `The upstream service '${service.name}' is unreachable or temporarily down.`,
          targetService: service.name,
          targetUrl: service.url,
          attemptedPath: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
        });
      }
    },
  });
}

// Dynamically attach proxy routes from externalized configuration
config.services.forEach((service) => {
  app.use(service.prefix, createServiceProxy(service));
});

// 404 Catch-All
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: "Not Found",
    message: `Route '${req.originalUrl}' does not exist on API Gateway.`,
    availableRoutes: ["/health", ...config.services.map((s) => s.prefix)],
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Gateway Unhandled Exception]", err.stack || err.message);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: "Internal Server Error",
      message: "An internal error occurred at the API Gateway.",
      detail: err.message,
    });
  }
});

// Start Gateway Server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("\n===========================================");
  console.log("  API Gateway is running!");
  console.log(`  Gateway URL:      http://localhost:${PORT}`);
  console.log(`  Health Check:     http://localhost:${PORT}/health`);
  console.log("  Routing Table (Built from Service Registry):");
  config.services.forEach((service) => {
    console.log(`    - ${service.prefix}/* -> ${service.url} (${service.name})`);
  });
  console.log("===========================================\n");
});

module.exports = { app, server };
