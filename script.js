(function(){
  var canvasWidth = 16;
  var canvasHeight= 8;
  var pieceWidth = 60;
  var pieceHeight= 40;
  var width = 1 + (canvasWidth * pieceWidth);
  var height= 1 + (canvasHeight * pieceHeight);

  var canvas, context;
  var colors = ["#ff0000", "#00ff00", "#0000ff", "#555555"];

  function Cell(row, column, color) {
    this.row = row;
    this.column = column;
    this.color = color;
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    x = Math.min(x, canvasWidth * pieceWidth);
    y = Math.min(y, canvasHeight * pieceHeight);
    var c = context.getImageData(x+1,y+1,1,1).data;
    var cell = new Cell(Math.floor(y/pieceHeight), Math.floor(x/pieceWidth),
        "#"+("000000" + ((c[0] << 16) | (c[1] << 8) | c[2]).toString(16)).slice(-6));
    return cell;
}

  function canvasOnClick (e) {
    var cell = getCursorPosition(e);
    // var context = canvas.getContext("2d");
    context.fillStyle = colors[cell.row % colors.length];
    if (colors.indexOf(cell.color) == -1)
      context.fillRect(cell.column*pieceWidth+1, cell.row*pieceHeight+1, pieceWidth-1, pieceHeight-1);
    else
      context.clearRect(cell.column*pieceWidth+1, cell.row*pieceHeight+1, pieceWidth-1, pieceHeight-1);
  }

  function drawBoard() {
    // var context = canvas.getContext("2d");
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
    context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    canvas.addEventListener("click", canvasOnClick, false);
    drawBoard();
    var a = 1;
  }

  init();
})();
