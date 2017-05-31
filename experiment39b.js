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


// Everything above here is the same
// ====================================

/* We're using an ES6 templated string here so
we can store the whole webpage verbatim, otherwise
we'd have to escape every single newline in the string. */
var mainPageContents = `<html>
<head><title>WiFi Plotter</title></head>
<body>
Load image <input type="file" id="imageLoader" name="imageLoader"/>
<br/><canvas id="canv" style="border:1px solid black"></canvas>
<script>
// display the canvas
var canvas = document.getElementById("canv");
var imageWidth = 200;
var imageHeight = 100;
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var midx = canvas.width/2, midy = canvas.height/2;
var lastPos;
// list of x,y,x,y points for the plotter
var plotPoints = [];

function sendToEspruino() {
  var points = [];
  var pointCount = 40; // amount of plot data to send at once
  if (pointCount>plotPoints.length)
    pointCount = plotPoints.length;
  if (pointCount==0) {
    console.log("Done!");
    return;
  }
  // Get the data to send
  points = plotPoints.slice(0, pointCount);
  // send the data to Espruino
  httpRequest = new XMLHttpRequest();
  httpRequest.open('POST', 'push?pts='+points.join(","), true);
  httpRequest.timeout = 1000; // timeout in milliseconds
  httpRequest.onreadystatechange = function(){
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var response = httpRequest.responseText;
        console.log("Got response "+response);
        if (response=="busy") {
          // try again after a delay
          setTimeout(function() {
            sendToEspruino();
          }, 2000);
        } else {
          // we sent it! Delete these points from our list
          plotPoints.splice(0, pointCount);
          // wait a little and carry on with sending
          setTimeout(function() {
            sendToEspruino();
          }, 500);
        }
      } else {
        console.log('There was a problem with the request.');
        // try again after a delay
        setTimeout(function() {
          sendToEspruino();
        }, 2000);
      }
    }
  };
  console.log("Sending "+pointCount+" points");
  httpRequest.send(null);
}

function moveTo(x,y,callback) {
  plotPoints.push(x,y);
  var pos = [x/4+midx, y/4+midy];
  if (lastPos)
    ctx.lineTo(pos[0], pos[1]);
  else
    ctx.moveTo(pos[0], pos[1]);
  lastPos = pos;
  setTimeout(callback,0);
}

function startDraw() {
  lastPos = undefined;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
}

function endDraw() {
  ctx.stroke();
  ctx.closePath();

  sendToEspruino();
}

// Handle loading of the image
var imgData; // the raw RGBA image data
var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', function (e) {
  // This is called when you've chosen a file
  // First we read the file
  var reader = new FileReader();
  reader.onload = function(event) {
    // Then we load it into an image
    var img = new Image();
    img.onload = function() {
      // we draw that image on to our canvas
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
      // read back the image data into an array
      imgData = ctx.getImageData(0, 0, imageWidth, imageHeight).data;
      // and finally we start converting it to a line drawing
      startDraw();
      scanImage();
     }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}, false);

// Output the image as lines
function scanImage() {
  var step = 0;
  for (var y=0;y<imageHeight;y++) {
    for (var x=0;x<imageWidth;x++) {
      // get color from image - work out where (we want to zig-zag)
      var imagex = (y&1) ? x : imageWidth-x;
      var imagey = y;
      // the image is in RGBA format, so we take the average of
      // red, green and blue channels
      var col = (
        imgData[(imagey*imageWidth + imagex)*4] +
        imgData[(imagey*imageWidth + imagex)*4 + 1] +
        imgData[(imagey*imageWidth + imagex)*4 + 2]) / 3;
      // now work out where on the page to draw the line
      // and work out what
      var px = (imagex - imageWidth/2)*7.5;
      var py = (imagey - imageHeight/2)*15 +
            Math.sin(step)*(col-255)/15;
      step++;
      // and move to the location
      moveTo(px, py);
    }
  }
  endDraw();
}
</script>
</body>`;

// Called when a page is requested
function pageHandler(req, res) {
  var info = url.parse(req.url, true);
  if (info.pathname == "/") {
    res.writeHead(200);
    res.end(mainPageContents);
  } else if (info.pathname == "/push") {
    // we got
    res.writeHead(200);
    var accepted = queueMove(info.query.pts.split(","));
    res.end(accepted ? "ok" : "busy");
  } else {
    console.log("Page "+info.path+" not found");
    res.writeHead(404);
    res.end("Not found");
  }
}

// Stepper motor handling
var StepperMotor = require("StepperMotor");
var motorx = new StepperMotor({
  pins:[B3,B4,B5,A6]
});
var motory = new StepperMotor({
  pins:[B10,B13,B14,B15]
});

function moveTo(x,y,callback) {
  var dx = x - motorx.getPosition();
  var dy = y - motory.getPosition();
  var d = Math.sqrt(dx*dx + dy*dy);
  var time = d * 1000 / motorx.stepsPerSec;
  motorx.moveTo(x, time);
  motory.moveTo(y, time, callback);
}

var busy = false;
var nextPositions = [];
function queueMove(positions) {
  if (nextPositions.length>40) {
    // we already have a lot of positions queued
    console.log("Rejected positions");
    return false; // don't take any more
  } else {
    // add something else onto the queue
    console.log("Queued "+(positions.length/2)+" positions");
    for (var i=0;i<positions.length;i+=2)
      nextPositions.push([positions[i],positions[i+1]]);
  }
  // not busy moving - start!
  if (!busy) {
    busy = true;
    moveFinished();
  }
  // return true to show the position was accepted
  return true;
}
function moveFinished() {
  // we just finished - see if there's anything else
  if (nextPositions.length>0) {
    // there is - get a new position off our queue
    var nextPos = nextPositions.shift();
    // go there
    moveTo(nextPos[0], nextPos[1], moveFinished);
  } else {
    // no - we're no longer busy
    busy = false;
  }
}
