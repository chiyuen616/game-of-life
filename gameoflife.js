const unitLength = 20;
let boxColor = 150;
const strokeColor = 50;
let columns;
let rows;
let currentBoard;
let nextBoard;
let speed;
let lifeColor;
let survival = 2;
let overpopulation = 3;
let nothingChanges = 2;
let reproduction = 3;
let cursorX;
let cursorY;





let isRunning = true;
let intervalId = null;
let nextStep = false;


const startStopButton = document.querySelector("#start-stop-button");
const resetButton = document.querySelector("#reset-button");
const nextButton = document.querySelector("#next-move");
const randomButton = document.querySelector("#random");
const patternButton = document.querySelector("#pattern");
const framerateInput = document.querySelector("#framerate");
const framerateValue = document.querySelector("#framerate-value");
const lifeColorInput = document.querySelector("#life-color");

//rules change
document.getElementById('survivebox').addEventListener('input', function() {
  survival = parseInt(this.value);
});

document.getElementById('overpopulationbox').addEventListener('input', function() {
  overpopulation = parseInt(this.value);
});

document.getElementById('Nothingchangesbox').addEventListener('input', function() {
  nothingChanges = parseInt(this.value);
});

document.getElementById('Reproductionbox').addEventListener('input', function() {
  reproduction = parseInt(this.value);
});



function setup() {
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.parent(document.querySelector('#canvas'));
  

  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  init();

  startStopButton.addEventListener("click", () => {
    if (isRunning) {
      stopGame();
    } else {
      startGame();
    }
  });
  nextButton.addEventListener("click", () => {
    nextStep = true; 
    generate();
  });


  resetButton.addEventListener("click", resetGame);

  randomButton.addEventListener("click", () => {
    generateRandom();
  });
  patternButton.addEventListener('click', generateRandomPattern);

  framerateInput.addEventListener("input", (event) => {
    framerateValue.textContent = event.target.value;
    speed = parseInt(framerateValue.textContent);
    frameRate(speed);
  });

  lifeColorInput.addEventListener("input", (event) => {
    lifeColor = event.target.value;
    document.querySelector("#color-value").textContent = lifeColor;
  });

  window.addEventListener('resize', () => {
    resizeCanvas(windowWidth, windowHeight - 100);
  });


}

function draw() {
  background(255);
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(lifeColor || color(0)); 
      } else {
        fill(255);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }

  noFill();
  stroke(0);
  rect(cursorX, cursorY, unitLength, unitLength);


}



function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  framerateValue.textContent = framerateInput.value; //set framerate
  speed = parseInt(framerateValue.textContent);
  frameRate(speed);
}

function generate() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            continue;
          }
          neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      if (currentBoard[x][y] == 1 && neighbors < survival) {
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > overpopulation) {
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == reproduction) {
        nextBoard[x][y] = 1;
      } else {
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
    if (nextStep) {           //stop game called when next move button add
    stopGame();
    }

    redraw();

}

function mouseDragged() {
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(lifeColor || color(0)) // default color is black
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function mousePressed() {
  noLoop();
  mouseDragged();
}

function mouseReleased() {
  loop();
}


//start
function startGame() {
  if (!isRunning) {
    isRunning = true;
    nextStep = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = setInterval(() => {
      generate();
    }, 1000 / speed);
    frameRate(speed);
    generate();
  }
}

//stop
function stopGame() {
  isRunning = false;
  clearInterval(intervalId);
  frameRate(0);
}


//reset
function resetGame() {
  stopGame();
  init();
}


//random
function generateRandom() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = (Math.random() < 0.5) ? 1 : 0;
      if (currentBoard[i][j] == 1) {
        fill(lifeColor || color(0)); 
      } else {
        fill(255);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}

//well-known pattern
function generateRandomPattern() {
  const patterns = [
    // Glider
    [[0, 1, 0], [0, 0, 1], [1, 1, 1]],
    // Blinker
    [[1, 1, 1]],
    // Toad
    [[0, 1, 1, 1], [1, 1, 1, 0]],
    // Beacon
    [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]],
    // Lightweight spaceship
    [[0, 1, 0, 0, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]]
  ];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)]; //randomly generate
  const patternWidth = pattern[0].length;
  const patternHeight = pattern.length;
  const startX = Math.floor((columns - patternWidth) / 2);
  const startY = Math.floor((rows - patternHeight) / 2);
  for (let i = 0; i < patternWidth; i++) {
    for (let j = 0; j < patternHeight; j++) {
      currentBoard[startX + i][startY + j] = pattern[j][i];
    }
  }
  redraw();
}


//resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 100);
}

//can't run
function keyPressed() {
  if (keyCode === UP_ARROW) {
    cursorY -= unitLength;
  } else if (keyCode === DOWN_ARROW) {
    cursorY += unitLength;
  } else if (keyCode === LEFT_ARROW) {
    cursorX -= unitLength;
  } else if (keyCode === RIGHT_ARROW) {
    cursorX += unitLength;
  }
}

//multicolor- set array?