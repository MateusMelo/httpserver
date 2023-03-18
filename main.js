import net from "net"

const server = net.createServer((stream) => {
    console.log("client connected.");
    const request = {
        method: '',
        version: '',
        resource: '',
        headers: {},
        body: ''
    };

    const response = {
        version: 'HTTP/1.1',
        statusCode: '200',
        statusText: 'OK',
        headers: {},
        body: ''
    };
    stream.on("data", (data) => {
        const buffer = data.toString();
        const lines = buffer.split("\r\n");
        for (const line of lines) {
            if (line.includes("HTTP")) {
                const [method, resource, version] = line.split(" ");

                console.log("firstline");
                console.log(method, resource, version);
            } else if (line.includes(":")) {''
                const [key, value] = line.split(": ");
                console.log("headers");
                console.log(key, value);
            } else if (line.length === 0) {
                console.log("emptyline")
            } else {
                const body = line;
                console.log("body");
                console.log(body);
            }
        }
    })

    stream.write("HTTP/1.1 200 OK\n\n")
    stream.end()
})

server.on("error", (err) => {
    throw err;
})

server.listen(8080, () => {
    console.log("opened server on", server.address());
})