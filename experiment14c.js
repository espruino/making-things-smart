// Draws a square
var PEN_DOWN = PEN_DOWN_VALUE_HERE; // motors[2] when pen touches paper
var PEN_UP = PEN_UP_VALUE_HERE; // motors[2] when pen is away from paper
var OFFSET_LEFT = 0.1; // offset to make left servo horizontal
var OFFSET_RIGHT = -0.1; // offset to make right servo horizontal

var motors = [0,0,PEN_UP];

function updateServos() {
  getNewPosition();
  var x = motors[0];
  var y = motors[1];
  y = y * 3.5 / 6;
  var l = y + x;
  var r = y - x;
  digitalPulse(B3, 1, E.clip(1.5+(l+OFFSET_LEFT), 1, 2)); // Left
  digitalPulse(B3, 1, 0); // wait for pulse
  digitalPulse(B4, 1, E.clip(1.5-(r+OFFSET_RIGHT), 1, 2)); // Right
  digitalPulse(B4, 1, 0); // wait for pulse
  digitalPulse(B5, 1, E.clip(1.5+motors[2], 1, 2)); // Pen
}

var pos = 0;
var size = 0.1;

function getNewPosition() {
  // increment pos slowly between 0 and 1
  pos += 0.002;
  if (pos > 1) pos = 0;
  // Multiply by 4, for each edge of the square
  var sq = pos*4;
  // Now set the position for each edge:
  if (sq<1) { // top edge
    motors[0] = (sq-0.5)*2*size;
    motors[1] = -size;
  } else if (sq<2) { // right edge
    motors[0] = size;
    motors[1] = (sq-1.5)*2*size;
  } else if (sq<3) { // bottom edge
    motors[0] = (2.5-sq)*2*size;
    motors[1] = size;
  } else { // left edge
    motors[0] = -size;
    motors[1] = (3.5-sq)*2*size;
  }
}

setInterval(updateServos, 20);
