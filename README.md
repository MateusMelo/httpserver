# httpserver

A Node.js HTTP server implemented from scratch using native [net](https://nodejs.org/api/net.html) library. The server just parse request lines and write a response.

### Quick start
```console
$ node main.js
```
Once the server is listening, requests can be made as follows: 
```console
$ curl http://localhost:7474 \
-H "Content-Type: application/json"
```
