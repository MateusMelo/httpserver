import net from "net"

const createHttpServer = ((handler) => {
    const server = net.createServer();
    const handleConnection = (socket) => {
        socket.once("readable", () => {
            const buffer = socket.read().toString();
            const req = {};
            const res = {
                statusCode: 200,
                statusText: "OK",
                headers: {},
                setHeader(key, value) {
                    this.headers[key] = value; 
                },
                status(statusCode) {
                    this.statusText = "OK";
                    this.statusCode = statusCode;
                },
                send(data) {
                    socket.write(`HTTP/1.1 ${this.statusCode} ${this.statusText}\r\n`)
                    
                    for (const [key, value] of Object.entries(this.headers)) {
                        socket.write(`${key}: ${value}\r\n`);
                    }
                    
                    socket.write(`\r\n`)
                    socket.end(data)
                }
            };
            const lines = buffer.split("\r\n");

            for (const line of lines) {
                if (line.includes("HTTP")) {
                    const [method, resource, version] = line.split(" ");
                    req.method = method;
                    req.version = version;
                    req.resource = resource;
                } else if (line.includes(":")) {
                    const [key, value] = line.split(": ");
                    if (!("headers" in req))
                        req.headers = {};
                    req.headers[key] = value;
                } else if (line.length === 0) {
                } else {
                    req.body = line;
                }
            }
            
            handler(req, res);
        });
    };
    const handleError = (err) => {
        throw err
    };

    server.on("connection", handleConnection)
    server.on("error", handleError)
    return {
        listen: (port) => server.listen(port)
    }
});

createHttpServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200)
    res.send(Buffer.from(JSON.stringify({ ok: true })));
}).listen(7474)
