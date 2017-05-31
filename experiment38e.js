// Drawing a sin r/r pattern

var StepperMotor = require("StepperMotor");
var motorx = new StepperMotor({
  pins:[B3,B4,B5,A6]
});
var motory = new StepperMotor({
  pins:[B10,B13,B14,B15]
});

function moveTo(x,y,callback) {
  var dx = x - motorx.getPosition();
  var dy = y - motory.getPosition();
  var d = Math.sqrt(dx*dx + dy*dy);
  var time = d * 1000 / motorx.stepsPerSec;
  motorx.moveTo(x, time);
  motory.moveTo(y, time, callback);
}

function sinrr(step, once) {
  // 'step' is going to keep increasing
  // make it 'scan' out in x and y
  var x = step % 100;
  var y = (step-x) / 100;
  if (y>=100) return;
  if (y&1) x = 100-x;
  // now center the coordinates on 0,0
  x -= 50;
  y -= 50;
  // Work out `r` - the radius
  //  - but add a bit to `r` to avoid a divide by 0 below
  var r = Math.sqrt(x*x + y*y) + 0.1;
  // Make 'z' a fun mathematical formula - (sin r)/r in this case
  var z = 100 * Math.sin(-r/2) / r;
  // now work out some 3D coordinates
  var a = 0.4; // rotation in 'y' axis
  var b = 0.5; // rotation in 'x' axis
  var rx = Math.cos(a)*x + Math.sin(a)*y;
  var ry = Math.cos(a)*y - Math.sin(a)*x;
  var rz = Math.cos(b)*z + Math.sin(b)*ry;
  ry = Math.cos(b)*ry - Math.sin(b)*z;
  // and project into 2d
  var px = rx * 2000 / (100-ry);
  var py = rz * 2000 / (100-ry);

  moveTo(px, py, function() {
    if (!once) sinrr(step+1);
  });
}

sinrr(0, true);
