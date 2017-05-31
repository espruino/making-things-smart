// the last speed we calculated
var rpm;

function onChanged(e) {
  if (e.state) {
    // when the pin changes state to be high
    var timeDiff = e.time - lastPulseTime;
    lastPulseTime = e.time;
    rpm = 60 / timeDiff;
    digitalWrite(LED2, rpm < 900);
  }
  counter++;
  digitalWrite(LED1, e.state);
}

function onSecond(e) {
  // only light the LED if it's been a whole second without any movement (we must be stationary!)
  if (counter==0) digitalWrite(LED2, 1);
  counter=0;
  console.log(rpm);
}

setWatch(onChanged, SENSE, { edge:"both", repeat:true });
setInterval(onSecond, 1000);
