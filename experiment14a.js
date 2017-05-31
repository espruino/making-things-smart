// Draws a circle
var PEN_DOWN = PEN_DOWN_VALUE_HERE; // motors[2] when pen touches paper
var PEN_UP = PEN_UP_VALUE_HERE; // motors[2] when pen is away from paper
var OFFSET_LEFT = 0.1; // offset to make left servo horizontal
var OFFSET_RIGHT = -0.1; // offset to make right servo horizontal

var motors = [0,0,PEN_UP];

function updateServos() {
  getNewPosition();
  digitalPulse(B3, 1, E.clip(1.5+(motors[0]+OFFSET_LEFT), 1, 2));
  digitalPulse(B3, 1, 0); // wait for pulse
  digitalPulse(B4, 1, E.clip(1.5-(motors[1]+OFFSET_RIGHT), 1, 2));
  digitalPulse(B4, 1, 0); // wait for pulse
  digitalPulse(B5, 1, E.clip(1.5+motors[2], 1, 2)); // Pen
}

var pos = 0;
var size = 0.1;

function getNewPosition() {
  // increment pos slowly between 0 and 1
  pos += 0.002;
  if (pos > 1) pos = 0;
  // Work out an angle between 0 and 360 degrees, but in Radians
  var angle = pos * Math.PI * 2;
  // Now use sin and cos to move the servos in a circular motion
  motors[0] = Math.sin(angle)*size;
  motors[1] = Math.cos(angle)*size;
}

setInterval(updateServos, 20);
