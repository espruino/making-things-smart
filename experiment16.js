function forward() {
  analogWrite(B3, 1/20, {freq:50});
}

function back() {
  analogWrite(B3, 2/20, {freq:50});
}

function stop() {
  digitalWrite(B3, 0);
}

function penUp() {
  analogWrite(B4, 1.45/20, {freq:50});
}

function penDown() {
  analogWrite(B4, 1.55/20, {freq:50});
}

var lightAverage = analogRead(A5);
var hasFoundMarker = false;
var lastMarkerTime = getTime();
var pixelInterval;
var x = 0, y = 0;

function foundMarker() {
  // work out how long it's been since the last marker
  var t = getTime();
  var d = t - lastMarkerTime;
  lastMarkerTime = t;
  console.log("Found marker, "+d+" sec, line "+y);

  if (pixelInterval)
    clearTimeout(pixelInterval);

  // move on to next line
  y++;
  x=0;
  // Execute for each 'pixel'
  pixelInterval = setInterval(function() {
    if (g.getPixel(x,y))
      penDown();
    else
      penUp();
    x++;
  }, d*1000*0.75/g.getWidth());
}

function lightChecker() {
  // work out how much light is reflected
  // from the paper
  var light = analogRead(A5);
  if (light < lightAverage-0.05) {
    // If the light is significantly less
    // than the average, we've found the marker.
    if (!hasFoundMarker) {
      hasFoundMarker = true;
      foundMarker();
    }
  } else if (light > lightAverage-0.03) {
    // If it jumps back up, we've passed it
    hasFoundMarker = false;
  }
  // update the average
  lightAverage = lightAverage*0.99 + light*0.01;
}

setInterval(lightChecker, 10);

var g = Graphics.createArrayBuffer(96,48,1);
g.setFontVector(48);
g.drawString("=P",0,0);

function draw() {
  for (var y=0;y<g.getHeight();y++) {
    var s = "|";
    for (var x=0;x<g.getWidth();x++)
      s += g.getPixel(x,y) ? "#" : " ";
    console.log(s+"|");
  }
}
