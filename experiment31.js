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
  setInterval(getDweet, 10000);
}

function onDweetData(data) {
  try {
    json = JSON.parse(data);
    console.log("DWEET> ", json);
    var d = json.with[0].content.on;
    digitalWrite([LED2,LED1], d);
  } catch (e) {
    console.log(e.toString());
  }
}

function getDweet() {
  var url = "http://dweet.io/get/latest/dweet/for/espruino_led";
  require("http").get(url, function(res) {
    var data = "";
    res.on('data', function(d) { data+=d; });
    res.on('close', function() {
      onDweetData(data);
    });
  });
}
