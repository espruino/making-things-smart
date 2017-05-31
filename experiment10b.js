var SENSE = A8;
var LIGHT = B6;
var counter = 0;

var blades = 7; // number of fan blades
var t = 1000 / blades;
var pulses = [ // ensure one line per fan blade
50, t-50,
5, 40, 5, t-50, 
5, 40, 5, t-50,
5, 40, 5, t-50,
5, 40, 5, t-50,
5, 40, 5, t-50,
50];

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
