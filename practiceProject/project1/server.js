const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });

  const data = {
    message: "Hello from server",
    method: req.method,
    url: req.url
  };

  res.end(JSON.stringify(data));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//jab  /api/datapath par get request aayagi tab hame file ko read 
// karke us data ko response  me bhejna hai.
