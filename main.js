import net from "net"

const createHttpServer = handler => {
    const server = net.createServer();
    const handleConnection = (socket) => {
        socket.once("readable", () => {
            const req = {
                method: null,
                version: null,
                resource: null,
                headers: {},
                body: {},
                parse(buffer) {
                    const bufferStr = buffer.toString();
                    const lines = bufferStr.split("\r\n");

                    for (const line of lines) {
                        if (line.includes("HTTP")) {
                            const [method, resource, version] = line.split(" ");
                            this.method = method;
                            this.version = version;
                            this.resource = resource;
                        } else if (line.includes(":")) {
                            const [key, value] = line.split(": ");
                            this.headers[key] = value;
                        } else if (line.length === 0) {
                        } else {
                            this.body = line;
                        }
                    }
                }
            };
            const res = {
                version: "HTTP/1.1",
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
                    socket.write(`${this.version} ${this.statusCode} ${this.statusText}\r\n`)

                    this.setHeader("Content-Length", data.length)
                    
                    for (const [key, value] of Object.entries(this.headers)) {
                        socket.write(`${key}: ${value}\r\n`);
                    }
                    
                    socket.write(`\r\n`)
                    socket.end(data)
                }
            };
            
            req.parse(socket.read())
            
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
};

createHttpServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200)
    res.send(Buffer.from(JSON.stringify({ ok: true })));
}).listen(7474)
