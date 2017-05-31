var SENSE = A8;
var counter = 0;
function onChanged(e) {
  counter++;
  if (counter&1) // remove this if your fan only flashes once per revolution
    digitalPulse(LED2, 1 , 2/*ms*/);
}

pinMode(SENSE, "input_pullup");
setWatch(onChanged, SENSE, { edge:"rising", repeat:true });
