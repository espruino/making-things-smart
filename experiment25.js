function transmit(txt) {
  // Ensure we're dealing with a string
  txt = txt.toString();
  // Work out what to send
  // Initial 5ms pulse
  var d = [5];
  // data for each character
  for (var i=0;i<txt.length;i++) {
    var ch = txt.charCodeAt(i);
    for (var j=0;j<8;j++) {
      d.push(1, (ch&128)?1.5:0.5);
      ch<<=1;
    }
  }
  // Finally add a 3ms 'finish' pulse
  d.push(1,3);
  // Send it
  digitalPulse(B3,1,d);
}

// now type transmit("Hello")
