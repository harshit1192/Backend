const user = {
    username : "Harshit Singh",
    age : 19
}
const http =require("node:http");
const server = http.createServer((req, res) => {
    const method = req.method;
    const url =new URL(req.url,'http://${req.headers.host}');
    const query = url.searchParams;
    if(method === "GET" && url.pathname.startsWith("/users")){
        res.writeHead(200,{"content-type": "application/json"})
        res.end(JSON.stringify(user));
    }
    else if(method === "post" && url.pathname.startsWith("/data")){
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            fs.writeFileSync("./todo.json",body,() =>{
                const parsedData = JSON.parse(body);
                res.writeHead(201,{"content-type": "application/json"});
                res.end(JSON.stringify({
                    message: "Data received successfully",data: parsedData,}));
            })
        });
    }
   
});
    server.listen(3000,() => {console.log("server running on port 3000");
    });