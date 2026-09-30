require("dotenv").config();

const config = {
  PORT: process.env.PORT || 8000,
  services: [
    {
      id: "users",
      name: "User Service",
      prefix: "/users",
      url: process.env.USER_SERVICE_URL || "http://localhost:3001",
    },
    {
      id: "products",
      name: "Product Service",
      prefix: "/products",
      url: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
    },
    {
      id: "orders",
      name: "Order Service",
      prefix: "/orders",
      url: process.env.ORDER_SERVICE_URL || "http://localhost:3003",
    },
  ],
};

module.exports = config;
