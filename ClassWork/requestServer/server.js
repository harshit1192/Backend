const http = require("http");
const fs = require("fs");
const path = require("path");
const logFilePath = path.join(__dirname, "log.txt");

const server = http.createServer((req, res) => {

  const newLog =
    new Date().toISOString() +
    " - " +
    req.method +
    " - " +
    req.url +
    "\n";

  fs.appendFile(logFilePath, newLog, (err) => {
    if (err) {
      console.log("Error writing log:", err);
    }
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("Request logged successfully");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});