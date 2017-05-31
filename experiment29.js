var WIFI_NAME = "";
var WIFI_KEY = "";

function onConnected() {
  console.log("Connected");
}

// This code is for Espruino Pico + ESP8266
Serial1.setup(115200, { tx: B6, rx : B7 });
var wifi = require("ESP8266WiFi_0v25").connect(Serial1, function(err) {
  if (err) throw err;
  console.log("Connecting to WiFi");
  wifi.connect(WIFI_NAME, WIFI_KEY, function(err) {
    if (err) {
      console.log("Connection error: "+err);
      return;
    }
    onConnected();
  });
});

/*
// For Espruino WiFi, use the following code
var wifi = require("EspruinoWiFi");
console.log("Connecting to WiFi");
wifi.connect(WIFI_NAME, { password : WIFI_KEY }, function(err) {
  if (err) {
    console.log("Connection error: "+err);
    return;
  }
  onConnected();
});
*/

/* Now enter the following to get a webpage and print it:

require("http").get("http://www.pur3.co.uk/hello.txt", function(res) {
  res.on('data', print);
});

*/
