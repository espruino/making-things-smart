// the position of the motor
var pos = 0;

// To be called every so often to tell the servo where to go
function updateServo() {
  digitalPulse(B3, 1, E.clip(1.5+pos, 1, 2));
}

// Now make sure we call the function every 50ms
setInterval(updateServo, 50);

/*

// To move the servo around
function updateServo() {
  pos = Math.sin(getTime()) * 0.5;
  digitalPulse(B3, 1, E.clip(1.5+pos, 1, 2));
}

// Tomove the servo using PWM
function updateServo() {
  pos = Math.sin(getTime()) * 0.5;
  var len = E.clip(1.5+pos, 1, 2);
  analogWrite(B3, len/50, {freq:20})
}
*/
