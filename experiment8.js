var SENSE = A8;
var LIGHT = B6;
var counter = 0;

function onChanged(e) {
  counter++;
  if (counter&1)
    digitalPulse(LIGHT, 1 , 2/*ms*/);
}

digitalWrite(LIGHT, 0);
pinMode(SENSE, "input_pullup");
setWatch(onChanged, SENSE, { edge:"rising", repeat:true });
