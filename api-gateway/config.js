require("dotenv").config();

const formatUrl = (url, fallback) => {
  let target = (url || fallback).trim();
  if (!target.startsWith("http://") && !target.startsWith("https://")) {
    target = "https://" + target;
  }
  return target.replace(/\/+$/, "");
};

const config = {
  PORT: process.env.PORT || 8000,
  services: [
    {
      id: "users",
      name: "User Service",
      prefix: "/users",
      url: formatUrl(process.env.USER_SERVICE_URL, "http://localhost:3001"),
    },
    {
      id: "products",
      name: "Product Service",
      prefix: "/products",
      url: formatUrl(process.env.PRODUCT_SERVICE_URL, "http://localhost:3002"),
    },
    {
      id: "orders",
      name: "Order Service",
      prefix: "/orders",
      url: formatUrl(process.env.ORDER_SERVICE_URL, "http://localhost:3003"),
    },
  ],
};

module.exports = config;

