var motors = [0,0];
function updateServos() {
  // Left
  digitalPulse(B3, 1, E.clip(1.5+motors[0], 1, 2));
  // Right
  digitalPulse(B4, 1, E.clip(1.5-motors[1], 1, 2));
}
setInterval(updateServos, 20);

// the names of our movements
var FWD = [1,1];
var BACK = [0,0];
var LEFT = [-1,1];
var RIGHT = [1,-1];
var STOP = [0,0];

function go(moves) {
  // take the first command off our array
  var move = moves.shift();

  if (move) {
    // Move the motors
    motors = move;
    // Call ourselves again in half a second, with the remaining list of moves
    setTimeout(go, 500, moves);
  } else
    motors = STOP;
}

setWatch(function() {
  go([FWD,LEFT,FWD,BACK]);
}, BTN, {repeat:true, edge:"rising", debounce:50});
