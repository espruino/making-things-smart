var WIFI_NAME = "";
var WIFI_KEY = "";
var wifi;

// This code is for Espruino Pico + ESP8266
function onInit() {
  USB.setConsole(true);
  Serial1.setup(115200, { tx: B6, rx : B7 });
  wifi = require("ESP8266WiFi_0v25").connect(Serial1, function(err) {
    if (err) throw err;
    console.log("Connecting to WiFi");
    wifi.connect(WIFI_NAME, WIFI_KEY, function(err) {
      if (err) throw err;
      onConnected();
    });
  });
}
/*
// For Espruino WiFi, use the following code
function onInit() {
  wifi = require("EspruinoWiFi");
  console.log("Connecting to WiFi");
  wifi.connect(WIFI_NAME, { password : WIFI_KEY }, function(err) {
    if (err) {
      console.log("Connection error: "+err);
      return;
    }
    onConnected();
  });
}
*/


function onConnected() {
  console.log("Connected");
  require("http").createServer(onPageRequest).listen(80);
  wifi.getIP(function(err,ip) {
    console.log("Your IP address is http://"+ip);
  });
}

var homePage = '<html><body>'+
 '<h1>My Espruino</h1>'+
 '<a href="/getTemp">Temperature</a><br>'+
 '<form action="/?led=1" method="post">'+
 '<input type="submit" value="On"/></form>'+
 '<form action="/?led=0" method="post">'+
 '<input type="submit" value="Off"/></form>'+
'</body></html>';

function onPageRequest(req, res) {
  console.log("Serving "+req.url, req);
  var r = url.parse(req.url, true);
  if (r.pathname == "/") {
    // if an argument is given, set the LED state
    if (req.method=="POST" && r.query && r.query.led)
      digitalWrite(LED1, r.query.led);
    // serve up the page
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(homePage);
  } else if (r.pathname == "/getTemp") {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end('<html><head>'+
      '<meta http-equiv="refresh" content="2">'+
      '</head><body>'+E.getTemperature().toFixed(2)+
      '</body></html>');
  } else {
    res.writeHead(404);
    res.end("404 - Not Found!");
  }
}
