var boxes = document.querySelectorAll(".box");
var cells = [...boxes];
var human = [];
var machine = [];
var timers = [];

var winningSet = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];
var game = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// The board can contain: 1:human, 2:machine, 0:not occupied
var state = cells.map(box => {
  return box.innerHTML;
});

//console.log(state);

/* Draw horizontal lines */
for (let i = 3; i < 6; i++) {
  cells[i].style.borderTop = "solid";
  cells[i].style.borderBottom = "solid";
  //  console.log(cells[i].style.border);
}

/* Draw vertical lines */
for (let i = 1; i < 9; i = i + 3) {
  cells[i].style.borderLeft = "solid";
  cells[i].style.borderRight = "solid";
}
resetBoard = () => {
  for (timer of timers) {
    clearTimeout(timer);
  }
  timers = [];
  game = new Array(9).fill(0);
  human = [];
  machine = [];

  for (box of cells) {
    box.innerHTML = "";
  }
  console.log("Game reset!");
};
checkWinner = player => {
  for (let i = 0; i < winningSet.length; i++) {
    if (
      player.includes(winningSet[i][0]) &&
      player.includes(winningSet[i][1]) &&
      player.includes(winningSet[i][2])
    ) {
      return true;
    }
  }
  return false;
};
findBlockingMove = () => {
  //
  //
  //
  for (let j = 0; j < winningSet.length; j++) {
    let winSet = winningSet[j];
    let matchSet = [];
    // If two out of three then shortlist
    if (human.includes(winSet[0])) {
      matchSet.push(winSet[0]);
    }
    if (human.includes(winSet[1])) {
      matchSet.push(winSet[1]);
    }
    if (human.includes(winSet[2])) {
      matchSet.push(winSet[2]);
    }
    if (matchSet.length === 2) {
      const result = winSet.map(element => matchSet.includes(element));
      const indexBlock = result.indexOf(false);
      const indexGame = winSet[indexBlock] - 1;
      if (game[indexGame] === 0) {
        // pos contains the index for 1..9 format
        // alert("Available blocking position " + indexGame);
        return indexGame;
      }
    }
  }
  return -1;
};

findWinningMove = () => {
  console.log("searching winning position");
  console.log(game);

  for (let j = 0; j < winningSet.length; j++) {
    let winSet = winningSet[j];
    //    console.log("scanning :" + winSet);
    let matchSet = [];
    // If two out of three then shortlist
    if (game[winSet[0] - 1] === 2) {
      matchSet.push(winSet[0]);
      //      console.log("matchset " + matchSet + " winset" + winSet);
    }
    if (game[winSet[1] - 1] === 2) {
      matchSet.push(winSet[1]);
      //      console.log("matchset " + matchSet + " winset" + winSet);
    }
    if (game[winSet[2] - 1] === 2) {
      matchSet.push(winSet[2]);
      //      console.log("matchset " + matchSet + " winset" + winSet);
    }
    // Confirm the third is not a human position
    if (matchSet.length === 2) {
      // Identify available position e.g. true,true, false
      //   console.log(winSet);
      // E.g. winSet[j] = 1,2,3,
      //      matchSet = 1,2
      //      result = true, true, false;
      // This means that: winning position = result.indexOf(false)
      const result = winSet.map(element => matchSet.includes(element));
      // result contains : position holding the winning index (in 1...9 format)
      // The index of winning move
      const indexWin = result.indexOf(false);
      //      alert("Two matches found!" + winSet);
      //      console.log(game);
      const indexGame = winSet[indexWin] - 1;
      //      console.log("Index game =" + indexGame);
      if (game[indexGame] === 0) {
        // pos contains the index for 1..9 format
        //        console.log("Available winning position " + indexGame);
        return indexGame;
      }
    }
  }

  return -1;
};
checkEndGame = () => {
  if (game.includes(0) === false) {
    alert("Game over");
    resetBoard();
  }
};
findRandomPos = () => {
  // Pick a random move
  let freeCells = game.filter(x => x === 0).length;
  //  console.log("Freecells " + freeCells);
  let randomPos = Math.floor(Math.random() * freeCells);
  //let randomPos = 0;

  let newPos = 0;
  // Find first available position
  //  console.log("Game: " + game);
  // Scan game for open positions: if it's the n'th open position (randomPos)
  // That is the next move
  for (let i = 0; i < game.length; i++) {
    //    console.log("Random pos: " + randomPos);
    //    console.log("i=" + i + " game[i]=" + game[i]);
    if (game[i] === 0) {
      //      console.log("found!");
      if (randomPos === 0) {
        newPos = i;
        //        console.log("break! i = " + i);
        break;
      } else {
        randomPos--;
      }
    }
  }
  return newPos;
};
machineFn = () => {
  // 1. find winning move
  // 2. find blocking move
  // 3. find random move
  var test = "O";
  newPos = findWinningMove();
  if (newPos === -1) {
    newPos = findBlockingMove();
    if (newPos === -1) {
      newPos = findRandomPos();
    } else {
      test = "O";
    }
  } else {
    t = setTimeout(() => {
      alert("machine wins");
      resetBoard();
    }, 500);
    timers.push(t);
  }
  //  alert("new pos " + newPos);
  //  console.log("new pos " + game);
  this.cells[newPos].innerHTML = test;
  game[newPos] = 2;
};
clickHandler = event => {
  let i = parseInt(event.target.dataset.index, 10);
  event.target.innerHTML = "X";
  human.push(1 + i);
  game[i] = 1;
  //   console.log(human);
  if (checkWinner(human)) {
    alert("human wins");
    resetBoard();
  } else {
    t = setTimeout(() => {
      machineFn();
      checkEndGame();
    }, 500);
    timers.push(t);
  }
};

/* Attach event handlers */
for (let i = 0; i < 9; i++) {
  cells[i].setAttribute("data-index", i);
  cells[i].addEventListener("click", clickHandler);
}
