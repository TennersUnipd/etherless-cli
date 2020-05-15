const http = require('http');
// create a server object:
http.createServer((req, res) => {
  if (req.url === '/createFunction') {
    res.setHeader('Content-Type', 'application/json');
    res.write('{"FunctionArn":"superduperARN"}');
    res.statusCode = 200;
    res.end();
  }
  if (req.url === '/deleteFunction') {
    res.setHeader('Content-Type', 'application/json');
    res.write('{"FunctionArn":"superduperARN"}');
    res.statusCode = 200;
    res.end();
  }
  if (req.url === '/updateFunction') {
    res.setHeader('Content-Type', 'application/json');
    res.write('{"FunctionArn":"superduperARN"}');
    res.statusCode = 200;
    res.end();
  }
}).listen(8080); // the server object listens on port 8080
