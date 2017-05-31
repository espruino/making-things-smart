// how detailed our picture will be
var WIDTH = 48;
var HEIGHT = 48;
var PIXELS = WIDTH*HEIGHT;

// The position in our scan
var px=0, py=0;

// Our pixel data
var data = new Float32Array(PIXELS);

function readPixel() {
  var light = analogRead(A5);
  // work out where in the array it should go
  var idx = px + (py*WIDTH);
  // save the data away
  data[idx] = light;
}

function updateServos() {
  readPixel();

  /* Bring px and py into the
  right range for the servo motors */
  var x = ((px/WIDTH) - 0.5) / 3;
  var y = ((py/HEIGHT) - 0.5) / 3;

  // And move the servos
  digitalPulse(B3, 1, E.clip(1.5+x, 1, 2));
  digitalPulse(B3, 1, 0);
  digitalPulse(B4, 1, E.clip(1.5+y, 1, 2));

  /* Move to the next position. Go right */
  px++;
  // or if we're at the end of the line,
  // go back to the start
  if (px>=WIDTH) {
    px=0;
    py++;
  }
  if (py>=HEIGHT) {
    /* If we got to the end, don't do anything
       else. stop calling updateServos */
    clearInterval(scanInterval);
  }
}

var scanInterval = setInterval(updateServos, 20);

// Draw our pixels out to the screen
function draw() {
  /* We have to use characters to represent
  each shade of color, so we're putting some
  characters in a string that get progressively
  more 'dense' */
  var shades = " .:;*@#";
  /* Work out the maximum and minimum
  values, so we can scale the image
  brightness properly */
  var min = data[0];
  var max = data[0];
  data.forEach(function(pixel) {
    if (pixel < min) min = pixel;
    if (pixel > max) max = pixel;
  });
  // Now we can print the data out, line by line
  var n = 0;
  for (var y=0;y<HEIGHT;y++) {
    var str = "";
    for (var x=0;x<WIDTH;x++) {
      var light = (data[n]-min)/(max-min);
      var shade = Math.floor(light*shades.length);
      str += shades[shade];
      n++;
    }
    console.log(str);
  }
}

function getData() {
  var min = data[0];
  var max = data[0];
  data.forEach(function(pixel) {
    if (pixel < min) min = pixel;
    if (pixel > max) max = pixel;
  });
  // Print the data out, line by line
  var n = 0;
  for (var y=0;y<HEIGHT;y++) {
    var str = "";
    for (var x=0;x<WIDTH;x++) {
      var light = Math.round((data[n]-min)*255/(max-min));
      str += light+",";
      n++;
    }
    console.log("["+str+"],");
  }
}

// You can now call draw() to draw the picture as ascii
// or getData() to output the data as an array
