// Note: Google has now disabled Eddystone notifications because of abuse
// by advertisers, so Eddystone devices will no longer appear as Android Notifications .
// See https://android-developers.googleblog.com/2018/10/discontinuing-support-for-android.html
// Google also shut down goo.gl, so you'll need to use bit.ly for new links instead

// magnetism measured when nothing around
var zeroMag = Puck.mag();
var wasDoorOpen = false;
var doorOpenings = 0;

function doorOpened() {
  doorOpenings++;
  require("ble_eddystone").advertise("goo.gl/D8sjLK#"+doorOpenings);
}

// Called when new magnetic field information is found
function onMag(xyz) {
  // work out the distance from zero
  var x = xyz.x - zeroMag.x;
  var y = xyz.y - zeroMag.y;
  var z = xyz.z - zeroMag.z;
  // Work out the magnitude of the field
  var d = Math.sqrt(x*x + y*y + z*z);
  // check door open state
  var isDoorOpen = d<500;
  if (isDoorOpen != wasDoorOpen) {
    if (isDoorOpen) {
      doorOpened();
      // flash green LED for open
      digitalPulse(LED2,1,100);
    } else {
      // flash red LED for close
      digitalPulse(LED1,1,100);
    }
    wasDoorOpen = isDoorOpen;
  }
}

// Set callback when magnetic field info is found
Puck.on('mag', onMag);
// Turn on magnetometer
Puck.magOn();
