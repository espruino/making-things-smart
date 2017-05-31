// drawing a spiral

var StepperMotor = require("StepperMotor");
var motorx = new StepperMotor({
  pins:[B3,B4,B5,A6]
});
var motory = new StepperMotor({
  pins:[B10,B13,B14,B15]
});

function moveTo(x,y,callback) {
  // Work out the distance in X and Y
  var dx = x - motorx.getPosition();
  var dy = y - motory.getPosition();
  // Work out the diagonal distance with pythagoras
  var d = Math.sqrt(dx*dx + dy*dy);
  // Work out how much time we've got to move
  var time = d * 1000 / motorx.stepsPerSec;
  // Set both motors moving
  motorx.moveTo(x, time);
  motory.moveTo(y, time, callback);
}

function spiral(r,ang) {
  if (ang>=Math.PI*24) return;
  moveTo(Math.sin(ang)*r, Math.cos(ang)*r, function() {
    spiral(r+0.2, ang+Math.PI/40);
  });
}
spiral(0,0)
