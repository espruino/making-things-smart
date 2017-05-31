var WIFI_NAME = "";
var WIFI_KEY = "";
var wifi;

// Initialisation for Espruino WiFi ONLY
function onInit() {
  wifi = require("EspruinoWiFi");
  wifi.connect(WIFI_NAME, { password : WIFI_KEY }, function(err) {
    if (err) {
      console.log("Connection error: "+err);
      return;
    }
    console.log("Connected!");
    wifi.getIP(function(err,ip) {
      console.log("IP address is http://"+ip.ip);
      createServer();
    });
  });
}

// Initialisation for Espruino Pico + ESP8266 ONLY
function onInit() {
  Serial1.setup(115200, { tx: B6, rx : B7 });
  wifi = require("ESP8266WiFi_0v25").connect(Serial1, function(err) {
    if (err) throw err;
    console.log("Connecting to WiFi");
    wifi.connect(WIFI_NAME, WIFI_KEY, function(err) {
      if (err) {
        console.log("Connection error: "+err);
        return;
      }
      console.log("Connected!");
      wifi.getIP(function(err,ip) {
        console.log("IP address is http://"+ip.ip);
        createServer();
      });
    });
  });
}

// Create a web server on Port 80
function createServer() {
  var http = require("http");
  http.createServer(pageHandler).listen(80);
}

var mainPageContents = "Hello World";

// Called when a page is requested
function pageHandler(req, res) {
  var info = url.parse(req.url, true);
  //print(info);
  if (info.path == "/") {
    res.writeHead(200);
    res.end(mainPageContents);
  } else {
    console.log("Page "+info.path+" not found");
    res.writeHead(404);
    res.end("Not found");
  }
}
