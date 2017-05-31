// drawing a square

var StepperMotor = require("StepperMotor");
var motorx = new StepperMotor({
  pins:[B3,B4,B5,A6]
});
var motory = new StepperMotor({
  pins:[B10,B13,B14,B15]
});

motorx.moveTo(100, 1000, function() {
  motory.moveTo(100, 1000, function() {
    motorx.moveTo(0, 1000, function() {
      motory.moveTo(0, 1000, function() {
        console.log("Done!");
      });
    });
  });
});
