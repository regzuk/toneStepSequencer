(function(){
  var canvasWidth = 16;
  var canvasHeight= 8;
  var pieceWidth = 60;
  var pieceHeight= 40;
  var width = 1 + (canvasWidth * pieceWidth);
  var height= 1 + (canvasHeight * pieceHeight);

  var canvas;

  function drawBoard() {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

      context.beginPath();

      /* vertical lines */
      for (var x = 0; x <= width; x += pieceWidth) {
  	context.moveTo(0.5 + x, 0);
  	context.lineTo(0.5 + x, height);
      }

      /* horizontal lines */
      for (var y = 0; y <= height; y += pieceHeight) {
  	context.moveTo(0, 0.5 + y);
  	context.lineTo(width, 0.5 +  y);
      }

      /* draw it! */
      context.strokeStyle = "#ccc";
      context.stroke();
  }
  function init () {
    canvas = document.getElementById("note_canvas");
    canvas.width = width;
    canvas.height = height;
    drawBoard();
    var a = 1;
  }

  init();
})();
