// Draws a square, but using a function call and callbacks
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

function doNothing() {
  // do nothing
}

var getNewPosition = doNothing;

function move(x, y, callback) {
  // First, get the old positions
  var oldx = motors[0];
  var oldy = motors[1];
  // Now work out the distance using pythagoras
  var dx = oldx-x;
  var dy = oldy-y;
  var d = Math.sqrt(dx*dx + dy*dy);
  // Make sure we move at the right speed, not
  // too fast or slow!
  var speed = 0.002/d;
  // and now have 'pos', our position in the line
  var pos = 0;
  // finally, set the getNewPosition function to something
  // that will darw a line

  getNewPosition = function() {
    pos += speed;
    if (pos>1) {
      // If we've finished, stop and
      // call the callback
      pos = 1;
      getNewPosition = doNothing;
      if (callback) callback();
    }
    // Set the motor positions up by interpolating
    // between oldx and x, oldy and y
    motors[0] = oldx*(1-pos) + x*pos;
    motors[1] = oldy*(1-pos) + y*pos;
  };
}

setInterval(updateServos, 20);


function penDown(yes) {
  if (yes) motors[2] = PEN_DOWN;
  else motors[2] = PEN_UP;
}

function square(x,y,size, callback) {
  move(x-size, y-size, function() {
    penDown(true);
    move(x+size, y-size, function() {
      move(x+size, y+size, function() {
        move(x-size, y+size, function() {
          move(x-size, y-size, function() {
            penDown(false);
            if (callback) callback();
          });
        });
      });
    });
  });
}

// now type square(0, 0, 0.1)
