(function(){
  var canvasWidth = 16;
  var canvasHeight= 7;
  var pieceWidth = 60;
  var pieceHeight= 40;
  var width = 1 + (canvasWidth * pieceWidth);
  var height= 1 + (canvasHeight * pieceHeight);

  var canvas, note_canvas, context;
  var colors = ["#ff0000", "#00ff00", "#0000ff", "#555555"];

  var notes;
  var loop, matrix;
  var keys;

  var started = false;

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
    context.fillStyle = colors[cell.row % colors.length];
    if (colors.indexOf(cell.color) == -1) {
      context.fillRect(cell.column*pieceWidth+1, cell.row*pieceHeight+1, pieceWidth-1, pieceHeight-1);
      if (!started)
        keys.get(notes[cell.row % notes.length]).start();
      matrix[cell.column][cell.row] = 1;
    } else {
      context.clearRect(cell.column*pieceWidth+1, cell.row*pieceHeight+1, pieceWidth-1, pieceHeight-1);
      matrix[cell.column][cell.row] = 0;
    }
  }

  function drawBoard() {
     var note_context = note_canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

      context.beginPath();
      note_context.beginPath();

      /* vertical lines */
      for (var x = 0; x <= width; x += pieceWidth) {
  	     context.moveTo(0.5 + x, 0);
  	     context.lineTo(0.5 + x, height);
      }
      /* horizontal lines */
      for (var y = 0; y <= height; y += pieceHeight) {
  	     context.moveTo(0, 0.5 + y);
  	     context.lineTo(width, 0.5 +  y);

         note_context.moveTo(0, 0.5 + y);
         note_context.lineTo(pieceWidth, 0.5 +  y);
      }
      note_context.font = "20px Arial";
      for (var k = 0; k < canvasHeight; k++) {
        note_context.fillText(notes[k], pieceWidth * 0.4, (k + 0.7) * pieceHeight);
      }
      /* draw it! */
      context.strokeStyle = "#ccc";
      context.stroke();
      note_context.strokeStyle = "#ccc";
      note_context.stroke();

      for (var i = 0; i < canvasWidth; i++)
        for (var j = 0; j < canvasHeight; j++) {
          if (matrix[i][j] === 1) {
            context.fillStyle = colors[j % colors.length];
            context.fillRect(i*pieceWidth+1, j*pieceHeight+1, pieceWidth-1, pieceHeight-1);
          }
        }
  }
  function moveRect (col) {

    var prCol = (col > 0) ? col - 1 : canvasWidth - 1;

    context.clearRect(prCol*pieceWidth+1, 1, pieceWidth-1, height-1);

    context.beginPath();
    for (var j = 0; j < canvasHeight; j++) {
      context.moveTo(prCol * pieceWidth, 0.5 + (j + 1) * pieceHeight);
      context.lineTo((prCol + 1) * pieceWidth, 0.5 +  (j + 1) * pieceHeight);
      if (matrix[prCol][j] === 1) {
        context.fillStyle = colors[j % colors.length];
        context.fillRect(prCol*pieceWidth+1, j*pieceHeight+1, pieceWidth-1, pieceHeight-1);
      }
    }

    context.strokeStyle = "#ccc";
    context.stroke();

    context.fillStyle = "rgba(255, 255, 0, 0.2)";
    context.fillRect(col*pieceWidth+1, 1, pieceWidth-1, height-1);
  }

  function init () {
    note_canvas = document.getElementById("notes");
    note_canvas.width = pieceWidth;
    note_canvas.height = height;
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    canvas.addEventListener("click", canvasOnClick, false);

    matrix = new Array(canvasWidth);
    for (var i = 0; i < canvasWidth; i++) {
      matrix[i] = new Array(canvasHeight);
      matrix[i].fill(0);
    }

    notes = ["B", "C", "D", "E", "F", "G", "A"];
    keys = new Tone.Players({
			"A" : "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/casio/A2.[mp3|ogg]",
      "B" : "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/casio/B1.[mp3|ogg]",
      "C" : "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/casio/C2.[mp3|ogg]",
      "D" : "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/casio/D2.[mp3|ogg]",
      "E" : "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/casio/E2.[mp3|ogg]",
      "F" : "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/casio/F2.[mp3|ogg]",
      "G" : "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/casio/G2.[mp3|ogg]"
		}).toMaster();
    loop = new Tone.Sequence(function (time, col) {
      var column = matrix[col];
      moveRect(col);
      for (var j = 0; j < canvasHeight; j++) {
        if (column[j] === 1)
          keys.get(notes[j % notes.length]).start();
      }
    }, Array.apply(null, {length: canvasWidth}).map(Function.call, Number));

    Tone.Transport.start();
    //Tone.Transport.bpm.value = 60;

    drawBoard();

    $( "#startStopBtn" ).click(function() {
      if (started) {
          loop.stop();
          $( "#startStopBtn" ).text("Start");
          started = false;
          drawBoard();
      } else {
          loop.start();
          $( "#startStopBtn" ).text("Stop");
          started = true;
      }
    });
  }

  init();
})();
