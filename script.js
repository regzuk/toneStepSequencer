(function(){
  var canvasWidth = 16;
  var canvasHeight= 7;
  var pieceWidth = 60;
  var pieceHeight= 40;
  var width = 1 + (canvasWidth * pieceWidth);
  var height= 1 + (canvasHeight * pieceHeight);

  var canvas, context;
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
      for (var j = 0; j < canvasHeight; j++) {
        if (column[j] === 1)
          keys.get(notes[j % notes.length]).start();
      }
    }, Array.apply(null, {length: canvasWidth}).map(Function.call, Number));

    Tone.Transport.start();
    //Tone.Transport.bpm.value = 60;

    $( "#startStopBtn" ).click(function() {
      if (started) {
          loop.stop();
          $( "#startStopBtn" ).text("Start");
          started = false;
      } else {
          loop.start();
          $( "#startStopBtn" ).text("Stop");
          started = true;
      }
    });
  }

  init();
})();
