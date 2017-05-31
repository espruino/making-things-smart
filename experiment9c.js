var SENSE = A8;
var LIGHT = B6;
var counter = 0;
var pulses = [0.5, 2, 0.5, 2, 0.5];/*ms*/
var lastPulseTime;

function onChanged(e) {
  counter++;
  if (counter&1) {
    var d = e.time - lastPulseTime;
    lastPulseTime = e.time;
    var p = pulses.map(function(t) { return t*d; });
    digitalPulse(LIGHT, 1 , p);
  }
}

function animate() {
  var l = 50 + 40*Math.sin(getTime());
  pulses = [5, l, 5, 100-l, 5];
}


digitalWrite(LIGHT, 0);
pinMode(SENSE, "input_pullup");
setWatch(onChanged, SENSE, { edge:"rising", repeat:true });
setInterval(animate,100)
