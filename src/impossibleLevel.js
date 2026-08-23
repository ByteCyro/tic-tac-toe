import { data } from "./RL_data.js";

const grids = document.querySelectorAll(".gridParent div");
const gridParent = document.querySelector(".gridParent");
const decisionPanel = document.getElementById("decisionPanel");
const message = document.getElementById("message");

document
    .getElementById("restartBtn")
    .addEventListener("click", () => {
        location.reload();
    });

const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let move = "bot";

function showPanel(text) {
    message.textContent = text;
    decisionPanel.style.display = "flex";
}

function getGridIndex(grid) {
    return Number(grid.dataset.index);
}

function checkAvailableMoves() {

    const moves = [];

    grids.forEach((grid) => {

        if (grid.textContent.trim() === "") {
            moves.push(getGridIndex(grid));
        }

    });

    return moves;
}

function checkDraw() {
    return checkAvailableMoves().length === 0;
}

function checkWinner() {

    for (const [a, b, c] of winningCombination) {

        const first = grids[a].textContent.trim();

        if (
            first !== "" &&
            first === grids[b].textContent.trim() &&
            first === grids[c].textContent.trim()
        ) {
            return first === "X" ? "X win" : "O win";
        }
    }

    return null;
}

function createState() {

    const state = [];

    grids.forEach((grid) => {

        const value = grid.textContent.trim();

        if (value === "X") {
            state.push("X");
        }
        else if (value === "O") {
            state.push("O");
        }
        else {
            state.push("");
        }

    });

    return JSON.stringify(state);
}

function getRandomMove() {

    const availableMoves = checkAvailableMoves();

    if (availableMoves.length === 0) {
        return null;
    }

    const randomIndex =
        Math.floor(
            Math.random() * availableMoves.length
        );

    return availableMoves[randomIndex];
}

function getBestAction(state) {

    const actions = data[state];

    if (!actions) {
        return null;
    }

    const availableMoves = checkAvailableMoves();

    let bestAction = null;
    let bestValue = -Infinity;

    for (const action of availableMoves) {

        if (actions[action] === undefined) {
            continue;
        }

        const value = Number(actions[action]);

        if (!Number.isFinite(value)) {
            continue;
        }

        if (value > bestValue) {
            bestValue = value;
            bestAction = Number(action);
        }
    }

    return bestAction;
}

function makeBotMove() {

    let action;

    const isFirstMove =
        checkAvailableMoves().length === 9;

    if (isFirstMove) {

        action = getRandomMove();

    }
    else {

        const state = createState();

        action = getBestAction(state);

        if (action === null) {
            action = getRandomMove();
        }
    }

    if (
        action === null ||
        !Number.isInteger(action) ||
        action < 0 ||
        action > 8
    ) {
        console.error(
            "Invalid bot action:",
            action
        );

        return;
    }

    if (
        !checkAvailableMoves().includes(action)
    ) {
        console.error(
            "Bot selected occupied cell:",
            action
        );

        action = getRandomMove();

        if (action === null) {
            return;
        }
    }

    grids[action].textContent = "O";
    grids[action].style.color = 'red'

    if (checkWinner() === "O win") {

        showPanel(
            "O win"
        );

        gridParent.removeEventListener(
            "click",
            clickHandler
        );

        return;
    }

    if (checkDraw()) {

        showPanel(
            "Draw"
        );

        gridParent.removeEventListener(
            "click",
            clickHandler
        );

        return;
    }

    move = "user";

    showPanel(
        "Your turn! Make your move"
    );
}

function clickHandler(event) {

    if (move !== "user") {
        return;
    }

    const target = event.target;

    if (!target.classList.contains("grid")) {
        return;
    }

    const userMove =
        getGridIndex(target);

    if (
        !Number.isInteger(userMove) ||
        userMove < 0 ||
        userMove > 8
    ) {
        return;
    }

    const availableMoves =
        checkAvailableMoves();

    if (!availableMoves.includes(userMove)) {

        showPanel(
            "Already Filled"
        );

        return;
    }

    grids[userMove].textContent = "X";
    grids[userMove].style.color = 'green'
    if (checkWinner() === "X win") {

        showPanel(
            "X win"
        );

        gridParent.removeEventListener(
            "click",
            clickHandler
        );

        return;
    }

    if (checkDraw()) {

        showPanel(
            "Draw"
        );

        gridParent.removeEventListener(
            "click",
            clickHandler
        );

        return;
    }

    move = "bot";

    showPanel(
        "AI is thinking..."
    );

    setTimeout(() => {
        makeBotMove();
    }, 700);
}

gridParent.addEventListener(
    "click",
    clickHandler
);

showPanel(
    "AI is thinking..."
);

setTimeout(() => {
    makeBotMove();
}, 700);