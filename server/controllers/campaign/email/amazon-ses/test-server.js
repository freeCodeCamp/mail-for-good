const http = require('http');

const server = http.createServer((req, res) => {
  // Mock latency
  setTimeout(() => {
    res.writeHead({'Content-Type': 'application/json'});
    res.end({
      ResponseMetadata: {
        RequestId: 'e8a3d6b4-94fd-11z6-afac-757cax279ap5'
      },
      MessageId: '01020157a1261241-90a5e1cd-3a5z-4sb7-1r41-957a4cae8e58-000000'
    });

  }, 150);
});

const port = 9999;
const host = 'localhost';

server.listen(port, host, () => { console.log(`Amazon test server running at http://${host}:${port}`) });
