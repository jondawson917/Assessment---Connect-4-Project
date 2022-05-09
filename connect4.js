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
//Board set to HEIGHT and WIDTH values. Board's elements set to undefined to prevent triggering a win in checkWin() 
function makeBoard() {
  board = Array(HEIGHT)
    .fill(undefined)
    .map(function () {
      return Array(WIDTH).fill(undefined);
    });
}



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
  /*Spot to equal array of all td elements  */
  let spot = [...document.getElementsByTagName("td")];
  /*Filter td elements matching desired id X AND empty */
  let col = spot.filter(function (currVal) {
     
    if (currVal.getAttribute("id")[2] == x && currVal.innerHTML == "") {
      return currVal;
    } else {
      return undefined;
    }
  });
  /*After filter creates col, an array of empty td's matching the id X, return the bottom td for column x */
  return col[col.length - 1];
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
//div is created, the class "piece" is added, and the id of the current player is assigned to the piece.
  const piece = document.createElement("div");
  piece.setAttribute("class", "piece");
  piece.setAttribute("id", currPlayer);
  //Set the piece color depending on the current player value
  if (piece.getAttribute("id") == 1) {
    piece.style.backgroundColor = "red";
  } else {
    piece.style.backgroundColor = "blue";
  }
  /*Set the current "array board" value to the player number 1 or 2 for the desired piece*/
  board[y][x] = currPlayer;
  /*Attach the piece to the to the "html board" location y,x */
  document.getElementById(`${y}-${x}`).append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  //msg can be win or tie
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  evt.preventDefault();/*Prevent Page Refresh*/
  let x = +evt.target.getAttribute("id");

  // get next spot in column (if none, ignore click). table row y is converted from string to integer
  let y = parseInt(findSpotForCol(x).getAttribute("id")[0]);

  //If y has a value, run placeInTable for board location x,y.
  board[y][x] = currPlayer;
  if (y) {
    placeInTable(y, x);
  }
/*Run checkfor win to display the endGame message if returned true */
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
/*Search every element on the board if it has a value without four in a row, it is a tie */
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("Tie!");
  }
  currPlayer = currPlayer === 1 ? 2 : 1;
}


function checkForWin() {
/*First declare the function to check piece combinations */
/*This is nested inside the checkforwin function*/
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
/*For each y,x for loop, the four possible winning piece arrangements are initialized*/
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
      } //End of single iteration If true, the loop stops
    }
  }
}
//Run the functions that form the board array and htmlboard in the DOM
makeBoard();
makeHtmlBoard();
