const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Home route
  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Hi my name is Harshit singh");
  }

  // Get all notes OR note by id
  if (req.method === "GET" && pathname === "/notes") {
    fs.readFile("notes.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error reading notes");
      }

      const notes = JSON.parse(data);
      const id = url.searchParams.get("id");

      if (id) {
        const note = notes.find((n) => n.id == id);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(note || {}));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(notes));
    });
  }

  // Add new note
  else if (req.method === "POST" && pathname === "/notes") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const newNote = JSON.parse(body);

      fs.readFile("notes.json", "utf8", (err, data) => {
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile("notes.json", JSON.stringify(notes), () => {
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Note added" }));
        });
      });
    });
  }

  // Route not found
  else {
    res.writeHead(404);
    res.end("Route Not Found");
  }

});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
