import { recordPlayerResult } from "./playerStats.js";

const cells = Array.from(document.querySelectorAll(".cell"));
const turnSymbol = document.getElementById("turnSymbol");
const roundLabel = document.getElementById("roundLabel");
const statusText = document.getElementById("statusText");
const statusDetail = document.getElementById("statusDetail");
const roundBtn = document.getElementById("roundBtn");
const resetScoresBtn = document.getElementById("resetScoresBtn");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");

const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let board = Array(9).fill("");
let turn = "X";
let round = 1;
let gameOver = false;
const scores = { X: 0, O: 0, draw: 0 };

function getWinner() {
    for (const line of wins) {
        const [a, b, c] = line;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { mark: board[a], line };
        }
    }

    return null;
}

function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;
}

function updateTurn() {
    turnSymbol.textContent = turn;
    turnSymbol.classList.toggle("mark-x", turn === "X");
    turnSymbol.classList.toggle("mark-o", turn === "O");
    statusText.textContent = `Player ${turn}'s turn`;
    statusDetail.textContent = `Player ${turn}, choose an empty square.`;
}

function finishRound(winner) {
    gameOver = true;
    cells.forEach((cell) => {
        cell.disabled = true;
    });

    const playerResult = winner
        ? (winner.mark === "X" ? "win" : "loss")
        : "draw";
    let statsSaveFailed = false;

    try {
        recordPlayerResult(playerResult);
    } catch (error) {
        console.error("Failed to save player statistics.", error);
        statsSaveFailed = true;
    }

    if (winner) {
        scores[winner.mark] += 1;
        winner.line.forEach((index) => cells[index].classList.add("winning-cell"));
        turnSymbol.textContent = winner.mark;
        turnSymbol.classList.toggle("mark-x", winner.mark === "X");
        turnSymbol.classList.toggle("mark-o", winner.mark === "O");
        statusText.textContent = `Player ${winner.mark} wins!`;
        if (statsSaveFailed) {
            statusDetail.textContent = "This result could not be saved to your statistics.";
        } else {
            statusDetail.textContent = "Nice game. Start another round when you're ready.";
        }
    } else {
        scores.draw += 1;
        turnSymbol.textContent = "=";
        turnSymbol.classList.remove("mark-x", "mark-o");
        statusText.textContent = "It's a draw!";
        if (statsSaveFailed) {
            statusDetail.textContent = "This result could not be saved to your statistics.";
        } else {
            statusDetail.textContent = "No spaces left this round. Try again!";
        }
    }

    roundBtn.textContent = "Play again";
    updateScores();
}

function playMove(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (gameOver || board[index] !== "") return;

    board[index] = turn;
    cell.textContent = turn;
    cell.classList.add(turn === "X" ? "mark-x" : "mark-o");
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${turn}`);

    const winner = getWinner();

    if (winner) {
        finishRound(winner);
        return;
    }

    if (board.every((value) => value !== "")) {
        finishRound(null);
        return;
    }

    turn = turn === "X" ? "O" : "X";
    updateTurn();
}

function startRound() {
    board = Array(9).fill("");
    turn = "X";
    gameOver = false;

    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("mark-x", "mark-o", "winning-cell");
        cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`);
    });

    roundLabel.textContent = `ROUND ${round}`;
    roundBtn.textContent = "New round";
    updateTurn();
}

function resetScores() {
    scores.X = 0;
    scores.O = 0;
    scores.draw = 0;
    round = 1;
    updateScores();
    startRound();
}

cells.forEach((cell) => cell.addEventListener("click", playMove));

roundBtn.addEventListener("click", () => {
    round += 1;
    startRound();
});

resetScoresBtn.addEventListener("click", resetScores);

updateScores();
startRound();
