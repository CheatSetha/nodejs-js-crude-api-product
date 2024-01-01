const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
let { products } = require("./data/products.json");
const { parse } = require("url");

const server = http.createServer(async (req, res) => {
  const { pathname, query } = parse(req.url, true);
  console.log(pathname, query);

  if (pathname === "/api/products" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));
  } else if (pathname.startsWith("/api/products/") && req.method === "GET") {
    const id = parseInt(pathname.split("/").pop()); // Get ID from URL and parse it as an integer
    const product = products.find((product) => product.id === id);
    if (product) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product not found" }));
    }
  } else if (pathname === "/api/products" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const { title, description, price } = JSON.parse(body);
      const product = {
        id: products.length + 1,
        title,
        description,
        price,
      };
      products.push(product);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(product));
    });
  } else if (pathname.startsWith("/api/products/") && req.method === "PUT") {
    const id = parseInt(pathname.split("/").pop());
    const product = products.find((product) => product.id === id);
    if (product) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const { title, description, price } = JSON.parse(body);
        const product = {
          id,
          title,
          description,
          price,
        };
        products = products.map((p) => (p.id === id ? product : p));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(product));
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product not found" }));
    }
  } else if (pathname.startsWith("/api/products/") && req.method === "DELETE") {
    const id = parseInt(pathname.split("/").pop());
    const product = products.find((product) => product.id === id);
    if (product) {
      products = products.filter((p) => p.id !== id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product removed" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product not found" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
