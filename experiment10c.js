var SENSE = A8;
var LIGHT = B6;
var counter = 0;

var blades = 7; // number of fan blades
var t = 1000 / blades;
var pulses = [50];

var lastPulseTime;

function onChanged(e) {
  counter++;
  if (counter&1) {
    var d = e.time - lastPulseTime;
    lastPulseTime = e.time;
    var p = pulses.map(function(t) { return t*d; });
    digitalPulse(LIGHT, 1, p);
  }
}

pinMode(SENSE, "input_pullup");
setWatch(onChanged, SENSE, { edge:"rising", repeat:true });

function toPulses(img) {
  pulses = [];
  // We're pulsing high at the start of the image
  var lastPixel = true;
  // the time the light will be on or off for
  var time = 0;
  // iterate over the image
  for (var y in img) {
    var line = img[y];
    for (var x in line) {
      var pixel = line[x]!=" ";
      if (pixel!=lastPixel) {
        // if this pixel is different, output the time
        pulses.push(time);
        time = 0;
        lastPixel = pixel;
      }
      time += 5;
    }
    // end of line, turn off
    if (lastPixel) {
      pulses.push(time);
      time = 0;
      lastPixel = false;
    }
    time += t - line.length*5;
  }
}

toPulses([
  "XX    XX",
  "XX    XX",
  "        ",
  "X      X",
  " X    X ",
  "  XXXX  "]);
  
  /* or... 

  toPulses([
    "XXXXX",
    "X   X",
    "X   X",
    "XXXXX",
    "X   X",
    "X   X",
    "XXXXX"]);
  */
