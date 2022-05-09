/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  board = Array(HEIGHT)
    .fill(undefined)
    .map(function () {
      return Array(WIDTH).fill(undefined);
    });
}

// TODO: set "board" to empty HEIGHT x WIDTH matrix array

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // Create row elements, assign ID, and add click event listener
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //Create a td element for each cell in the TOP row. Assign each td an ID of x. Insert td for WIDTH number of cells.
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  //Append tr to the main board with its appended td elements
  htmlBoard.append(top);

  // Create a new row while creating an element for each cell in every row.
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      //Assign ID by cell location(0-0, 0-1, 0-2). Both iteration variables x and y become each cell's ID.
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}
/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  let spot = [...document.getElementsByTagName("td")];
  let col = spot.filter(function (currVal) {
    if (currVal.getAttribute("id")[2] == x && currVal.innerHTML == "") {
      return currVal;
    } else {
      return undefined;
    }
  });
  return col[col.length - 1];
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.setAttribute("class", "piece");
  piece.setAttribute("id", currPlayer);
  if (piece.getAttribute("id") == 1) {
    piece.style.backgroundColor = "red";
  } else {
    piece.style.backgroundColor = "blue";
  }
  board[y][x] = currPlayer;
  document.getElementById(`${y}-${x}`).append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  evt.preventDefault();
  let x = +evt.target.getAttribute("id");

  // get next spot in column (if none, ignore click)
  let y = parseInt(findSpotForCol(x).getAttribute("id")[0]);

  //If y has a value, run placeInTable for board location x,y.
  board[y][x] = currPlayer;
  if (y) {
    placeInTable(y, x);
  }

  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("Tie!");
  }
  currPlayer = currPlayer === 1 ? 2 : 1;
}

// place piece in board and add to HTML table
// TODO: add line to update in-memory board

// check for win

// check for tie
// TODO: check if all cells in board are filled; if so call, call endGame

// switch players
// TODO: switch currPlayer 1 <-> 2

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    // Conditional statement sets range of variables in "cells.every" function 0-HEIGHT 0-WIDTH
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //For a fixed row position y, the column x is checked 3 places to the right.
      //Each subArray horiz[0], horiz[1], horiz[2], and horiz[3] are board positions of "board array" to observe.
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      // each four conditions becomes the "cells" parameter of the _win() function
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      } //End of single iteration
    }
  }
}
makeBoard();
makeHtmlBoard();
