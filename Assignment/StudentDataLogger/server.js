const http = require("http");
const fs = require("fs");
const { URL } = require("url");

const PORT = 3000;
const FILE_PATH = "./students.json";

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  console.log(`${method} ${pathname}`);

  // Only handle /students route
  if (pathname === "/students") {

    // ==========================
    // GET (Fetch All or One)
    // ==========================
    if (method === "GET") {
      fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end("Internal Server Error");
        }

        const students = JSON.parse(data || "[]");
        const id = searchParams.get("id");

        if (id) {
          const student = students.find(s => s.id === Number(id));

          if (!student) {
            res.writeHead(404);
            return res.end("Student not found");
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(student));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(students));
      });
    }

    // ==========================
    // POST (Add Student)
    // ==========================
    else if (method === "POST") {
      let body = "";

      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          const parsedBody = JSON.parse(body);

          if (!parsedBody.name || !parsedBody.age || !parsedBody.course) {
            res.writeHead(400);
            return res.end("Missing required fields");
          }

          fs.readFile(FILE_PATH, "utf8", (err, data) => {
            if (err) {
              res.writeHead(500);
              return res.end("Internal Server Error");
            }

            const students = JSON.parse(data || "[]");

            const newId =
              students.length > 0
                ? students[students.length - 1].id + 1
                : 1;

            const newStudent = {
              id: newId,
              name: parsedBody.name,
              age: parsedBody.age,
              course: parsedBody.course
            };

            students.push(newStudent);

            fs.writeFile(FILE_PATH, JSON.stringify(students, null, 2), err => {
              if (err) {
                res.writeHead(500);
                return res.end("Error saving data");
              }

              res.writeHead(201, { "Content-Type": "application/json" });
              res.end(JSON.stringify(newStudent));
            });
          });

        } catch (error) {
          res.writeHead(400);
          res.end("Invalid JSON");
        }
      });
    }

    // ==========================
    // PUT (Update Student)
    // ==========================
    else if (method === "PUT") {
      const id = searchParams.get("id");

      if (!id) {
        res.writeHead(400);
        return res.end("Student ID is required");
      }

      let body = "";

      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          const parsedBody = JSON.parse(body);

          fs.readFile(FILE_PATH, "utf8", (err, data) => {
            if (err) {
              res.writeHead(500);
              return res.end("Internal Server Error");
            }

            const students = JSON.parse(data || "[]");
            const student = students.find(s => s.id === Number(id));

            if (!student) {
              res.writeHead(404);
              return res.end("Student not found");
            }

            // Partial update
            if (parsedBody.name) student.name = parsedBody.name;
            if (parsedBody.age) student.age = parsedBody.age;
            if (parsedBody.course) student.course = parsedBody.course;

            fs.writeFile(FILE_PATH, JSON.stringify(students, null, 2), err => {
              if (err) {
                res.writeHead(500);
                return res.end("Error saving data");
              }

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(student));
            });
          });

        } catch (error) {
          res.writeHead(400);
          res.end("Invalid JSON");
        }
      });
    }

    // ==========================
    // DELETE (Remove Student)
    // ==========================
    else if (method === "DELETE") {
      const id = searchParams.get("id");

      if (!id) {
        res.writeHead(400);
        return res.end("Student ID is required");
      }

      fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end("Internal Server Error");
        }

        const students = JSON.parse(data || "[]");
        const updatedStudents = students.filter(s => s.id !== Number(id));

        if (students.length === updatedStudents.length) {
          res.writeHead(404);
          return res.end("Student not found");
        }

        fs.writeFile(FILE_PATH, JSON.stringify(updatedStudents, null, 2), err => {
          if (err) {
            res.writeHead(500);
            return res.end("Error saving data");
          }

          res.writeHead(200);
          res.end("Student deleted successfully");
        });
      });
    }

    else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  }

  // ==========================
  // Route Not Found
  // ==========================
  else {
    res.writeHead(404);
    res.end("Route Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
