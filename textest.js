var ws = require("nodejs-websocket"),
    router = require('tiny-router'),
    rfidlib = require('rfid-pn532');
    tessel = require('tessel');

var port = 8000;

// Open connection to Tessel's RFID module
var rfid = rfidlib.use(tessel.port['A']); 
var lastRFID; 

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

  rfid.on('data', function(card) {
    var rfid_id = card.uid.toString('hex');
    lastRFID = {"rfid number":rfid_id, "timestamp":Date.now()};
  });
});

// Create the websocket server, provide connection callback
var server = ws.createServer(function (conn) {
  console.log("New connection");

  // If we get text from the client, and echo it  
  conn.on("text", function (str) {
    // print it out 
    console.log("Received "+str)
    // Send it back (but more excited)
    conn.sendText(str.toUpperCase()+"!!!")
  });

  // When the client closes the connection, notify us
  conn.on("close", function (code, reason) {
      console.log("Connection closed")
  });
}).listen(port);

console.log('Navigate to http://' + ip + ':' + port);
console.log(defaultPage);

router
    .use('defaultPage', 'default.html')

    .get('/', function(req, res){
        res.send(readTextFile());
    })

    .get('/rfid', function(req, res){
        res.send(lastRFID);
    })

router.listen(8080);






// var index = ["<html>", 
// "<body>",
// "<h1>poop</h1>",
// "<h2>" + lastRFID + "</h2>",
// "<script>",
// "var ws = require('nodejs-websocket');",
// "var port = 8000;",
// "// INSERT TESSEL IP ADDRESS HERE. Always prepend with 'ws://' to indicate websocket",
// "var connection = ws.connect('ws://10.1.10.181:' + port, function() {",
// "  // When we connect to the server, send some catchy text",
// "  connection.sendText('My milkshake brings all the boys to the yard')",
// "});",
// "// When we get text back",
// "connection.on('text', function(text) {",
// "  // print it out",
// "  console.log('Echoed back from server:', text);",
// "});",
// "</script>",
// "</body>",
// "</html>"].join('\n');