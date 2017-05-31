var motors = [0,0];
function updateServos() {
  var left = darkValue - analogRead(A5);
  if (left < 0) left = 0;
  var right = darkValue - analogRead(A6);
  if (right < 0) right = 0;
  motors[0] = right;
  motors[1] = left;

  digitalPulse(B3, 1, E.clip(1.5+motors[0], 1, 2));
  digitalPulse(B4, 1, E.clip(1.5-motors[1], 1, 2));
}
setInterval(updateServos, 20);
