var l="";
Serial1.on('data', function(d) {l+=d;});
Serial1.setup(115200, { tx: B6, rx : B7 });
Serial1.write("AT+GMR\r\n");
setTimeout(function(){console.log(l);},1000);
