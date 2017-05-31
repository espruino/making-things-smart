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
  setInterval(sendDweet, 10000);
}


function sendDweet() {
  var str = E.getTemperature().toFixed(2);
  console.log("Sending "+str);
  var url = "http://dweet.io/dweet/for/espruino_tmp?temp="+str;
  require("http").get(url, function(res) { });
}
