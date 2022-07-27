onconnect = function(e) {
  var port = e.ports[0];
  console.log(e, "e")
  console.log(port, "port")

  port.onmessage = function(e) {
    var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    port.postMessage(workerResult);
  }

}