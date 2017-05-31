// the 4 steps we're doing
var steps = [0b1000, 0b0010, 0b0100, 0b0001];
// the step we're going to output next
var step = 0;

function doStep() {
  // output the step from the array
  digitalWrite(MTR, steps[step]);
  // move on to the next step
  step++;
  // but if there are no more steps, we must go to the beginning
  if (step >= steps.length) step = 0;
}
