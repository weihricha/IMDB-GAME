// Import the WORDS and IMAGES arrays
import { WORDS, IMAGES, HINT1, HINT2, HINT3 } from './words.js';

// Randomly select a word and find its corresponding image
const randomIndex = Math.floor(Math.random() * WORDS.length);
const rightGuessString = WORDS[randomIndex];
const correspondingImage = IMAGES[randomIndex];
const hint1 = HINT1[randomIndex];
const hint2 = HINT2[randomIndex];
const hint3 = HINT3[randomIndex];

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let answerLength = rightGuessString.length;
let WithoutSpaces = rightGuessString.replace(/\s/g, '');
let stringWithoutSpaces = WithoutSpaces.replace(/'/g, '');
let lengthWithoutSpaces = stringWithoutSpaces.length;

console.log(rightGuessString);

function initBoard() {
    let board = document.getElementById("game-board");
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";
        for (let j = 0; j < answerLength; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            if (rightGuessString[j] === ' ') {
                box.classList.add("space-box");
                box.textContent = ' ';
            } else if (rightGuessString[j] === "'") {
                box.classList.add("apostrophe-box");
                box.textContent = "'";
            }
            row.appendChild(box);
        }
        board.appendChild(row);
    }
    setGameImage();
}

function setGameImage() {
    let gameImage = document.getElementById("game-image");
    gameImage.src = correspondingImage;
    gameImage.style.display = 'block';
}

initBoard();

document.addEventListener('keyup', (e) => {
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z0-9]/gi);
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
});

const keyboardContainer = document.getElementById("keyboard-cont");
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
keys.forEach(key => {
    const button = document.createElement("div");
    button.className = "keyboard-button";
    button.textContent = key;
    keyboardContainer.appendChild(button);
});

keyboardContainer.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("keyboard-button")) {
        const key = target.textContent;
        document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
    }
});


function insertLetter(pressedKey) {
    if (currentGuess.length === lengthWithoutSpaces) {
        return;
    }

    pressedKey = pressedKey.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    while (row.children[nextLetter].classList.contains("space-box") || row.children[nextLetter].classList.contains("apostrophe-box")) {
        nextLetter += 1;
    }

    let box = row.children[nextLetter];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    do {
        nextLetter -= 1;
    } while ((row.children[nextLetter].classList.contains("space-box") || row.children[nextLetter].classList.contains("apostrophe-box")) && nextLetter > 0);

    let box = row.children[nextLetter];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = '';
    let rightGuess = Array.from(rightGuessString);
    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != lengthWithoutSpaces) {
        alert("Not enough letters!");
        return;
    }

    for (let i = 0; i < answerLength; i++) {
        if (rightGuess[i] === ' ' || rightGuess[i] === "'") {
            continue;
        }

        let letterColor = '';
        let box = row.children[i];
        let letter = currentGuess[i];
        let letterPosition = rightGuess.indexOf(currentGuess[i]);

        if (letterPosition === -1) {
            letterColor = 'grey';
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green';
            } else {
                letterColor = 'yellow';
            }
            rightGuess[letterPosition] = "#";
        }

        let delay = 250 * i;
        setTimeout(() => {
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }

    if (guessString === rightGuessString.replace(/\s/g, '')) {
        alert("You guessed right! Game over!");
        guessesRemaining = 0;
        return;
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;
        if (guessesRemaining === 0) {
            alert("You've run out of guesses! Game over!");
            alert(`The right word was: "${rightGuessString}"`);
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === 'green') {
                return;
            }
            if (oldColor === 'yellow' && color !== 'green') {
                return;
            }
            elem.style.backgroundColor = color;
            break;
        }
    }
}

const hints = [
    "This movie's genre is: ",
    "This movie has this actpr in it: ",
    "This movie has this plot detail: "
];
const hintDetails = [hint1, hint2, hint3];
let hintIndex = 0;
document.getElementById("hint-button").addEventListener("click", () => {
    // Display the current hint
    document.getElementById("hint-text").textContent = hints[hintIndex] + hintDetails[hintIndex];
    
    // Move to the next hint, or loop back to the first hint
    hintIndex = (hintIndex + 1) % hints.length;
});
