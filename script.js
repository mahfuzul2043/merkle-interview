const moves = {
    f: 38, // forward
    b: 40, // backward
    l: 37, // left
    r: 39 // right
}

// keep track of grid dimensions and cow position
let gridInput1, // first dimension of grid
    gridInput2, // second dimension of grid
    xPosition,
    yPosition;


// initialize cow element
let cow = document.createElement('img');
cow.src = 'cow.png';
cow.height = 40;
cow.width = 40;

/**
 * Generate the board (field) for the cow to graze in
 */
const generateBoard = () => {
    gridInput1 = parseInt(document.querySelector('.grid-input-1').value);
    gridInput2 = parseInt(document.querySelector('.grid-input-2').value);

    // error checking grid dimensions
    if (isNaN(gridInput1) || isNaN(gridInput2) || gridInput1 < 1 || gridInput2 < 1) {
        alert('Invalid input for grid dimensions');
        return;
    }


    // generate board element with all rows and columns
    let board = document.createElement('div');
    board.classList.add('board');

    for (let i = 0; i < gridInput1; i++) {
        let row = document.createElement('div');
        row.classList.add(`row-${i}`, 'row');
        for (let y = 0; y < gridInput2; y++) {
            let col = document.createElement('div');
            col.classList.add(`row-${i}-col-${y}`, 'square');
            row.append(col);
        }
        board.append(row);
    }

    document.querySelector('main').prepend(board);
    document.querySelector('.starting-position-wrapper').style.display = 'block';
    document.querySelector('.generate-btn').setAttribute('disabled', true);
}

/**
 * Check if the cow position is valid
 * @param {number} xPos The x position
 * @param {number} yPos The y position
 * @returns A boolean indicating whether the cow position is invalid
 */
const cowPositionInvalid = (xPos, yPos) => isNaN(xPosition) || isNaN(yPosition) || xPos < 0 || xPos >= gridInput1 || yPos < 0 || yPos >= gridInput2;

/**
 * Move the cow to the specified x and y coordinates
 * @param {number} xPos The x position 
 * @param {number} yPos The y position
 */
const moveCow = (xPos, yPos) => {
    let currentSquare = document.querySelector(`.row-${xPosition}-col-${yPosition}`);
    currentSquare.removeChild(cow);
    let newSquare = document.querySelector(`.row-${xPos}-col-${yPos}`);
    newSquare.append(cow);

    xPosition = xPos;
    yPosition = yPos;
}

/**
 * Determine how to handle arrow key inputs
 * @param {number} code The key press keycode
 */
const handleCowMovement = code => {
    let newXPos, newYPos;
    switch (code) {
        case moves.f:
            newXPos = xPosition - 1;
            if (!cowPositionInvalid(newXPos, yPosition)) moveCow(newXPos, yPosition);
            break;
        case moves.b:
            newXPos = xPosition + 1;
            if (!cowPositionInvalid(newXPos, yPosition)) moveCow(newXPos, yPosition);
            break;
        case moves.l:
            newYPos = yPosition - 1;
            if (!cowPositionInvalid(xPosition, newYPos)) moveCow(xPosition, newYPos);
            break;
        case moves.r:
            newYPos = yPosition + 1;
            if (!cowPositionInvalid(xPosition, newYPos)) moveCow(xPosition, newYPos);
            break;
        default:
            break;
    }
}

/**
 * The key pressed event handler
 * @param {Object} e The key pressed event
 */
const onKeyPressed = e => {
    handleCowMovement(e.keyCode);
}

/**
 * Sets initial position of cow
 */
const setPosition = () => {
    xPosition = parseInt(document.querySelector('.position-input-x').value);
    yPosition = parseInt(document.querySelector('.position-input-y').value);

    if (cowPositionInvalid(xPosition, yPosition)) {
        alert('Initial cow position is invalid');
        return;
    }

    document.querySelector(`.row-${xPosition}-col-${yPosition}`).append(cow);
    document.addEventListener('keydown', onKeyPressed);
    document.querySelector('.instructions-wrapper').style.display = 'block';
    document.querySelector('.dimensions-wrapper').style.display = 'none';
    document.querySelector('.starting-position-wrapper').style.display = 'none';
    document.querySelector('main').style.flexDirection = 'row-reverse';
}

/**
 * Simulate a pause in the thread
 * @param {number} ms Number in milliseconds 
 * @returns a promise
 */
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute the cow instruction string
 */
const executeInstructions = async () => {
    // get all valid instructions
    const instructions = document.querySelector('.instructions').value.split('').filter(instruction => instruction === 'f' || instruction === 'b' || instruction === 'l' || instruction === 'r');
    
    for (let i = 0; i < instructions.length; i++) {
        handleCowMovement(moves[instructions[i]]);
        await sleep(500);
    }
}