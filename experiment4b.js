// our pins
var MTR = [B1,A7,A6,A5];
// the 4 steps we're doing
var steps = [0b1000, 0b0010, 0b0100, 0b0001];
// the step we're going to output next
var step = 0;
// the interval we'll be using
var interval;

function start(rpm) {
  // just in case!
  stop();
  // start our interval
  interval = setInterval(function() {
    // output the step from the array
    digitalWrite(MTR, steps[step]);
    // move on to the next step
    step++;
    // but if there are no more steps, we must go to the beginning
    if (step >= steps.length) step = 0;
  }, 60000/rpm*(steps.length));
  /* revs per minute = 60*1000 seconds, but we have to call
  this function once for each step times to do a rev */
}

function stop() {
  // remove interval if there was one
  if (interval)
    clearInterval(interval);
  interval = undefined;
  // turn off coils
  digitalWrite(MTR, 0b0000);
}
