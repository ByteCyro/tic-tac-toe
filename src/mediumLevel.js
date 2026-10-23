

import { recordPlayerResult } from "./playerStats.js";

const grids = document.querySelectorAll(".gridParent div");
const gridParent = document.querySelector(".gridParent");
const decisionPanel = document.getElementById("decisionPanel");
const message = document.getElementById("message");
document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
});
let move = Math.random() > 0.5 ? 'user':'bot'
if(move == 'user'){
    showPanel('Your turn! Make your move')
}
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

const center = 4
const corner = [0,2,6,8]

function availableMoves () {
    const avlMoves = []
    grids.forEach(e=>{
        let trimmed = e.textContent.trim()
        if(trimmed == "") avlMoves.push(Number(e.className))
    })
return avlMoves
}

function checkDraw () {
    let avlMoves = availableMoves()
    if(avlMoves.length == 0) return 'Draw'
}

function checkWinner () {
    for(let combination of winningCombination){
        const [a ,b ,c] = combination
        let first = grids[a].textContent.trim()
        if(
            first != "" && first == grids[b].textContent.trim() && first == grids[c].textContent.trim()
        ){
            return first == "X"? 'X win':'O win'
        }
    }
    return null

}

function showPanel(text) {
    message.textContent = text;
    decisionPanel.style.display = "flex";
}

function finishGame(text) {
    let finalMessage = text;
    const result = text === "X win" ? "win" : text === "O win" ? "loss" : "draw";

    try {
        recordPlayerResult(result);
    } catch (error) {
        console.error("Failed to save player statistics.", error);
        finalMessage += ". Your statistics could not be saved.";
    }

    showPanel(finalMessage);
    gridParent.removeEventListener("click", clickHandler);
}



function findWinningMove (player) {
     let avlMoves = availableMoves()
   for(let items of winningCombination){
    let [ a , b , c ] = items
    if(grids[a].textContent == player  && grids[b].textContent == player && avlMoves.includes(Number(grids[c].className))) return Number(grids[c].className)
    else if(grids[b].textContent == player && grids[c].textContent == player && avlMoves.includes(Number(grids[a].className))) return Number(grids[a].className)
    else if(grids[a].textContent == player && grids[c].textContent == player && avlMoves.includes(Number(grids[b].className))) return Number(grids[b].className)
   }
   return null
}

function findCorner () {
    let avlMoves = availableMoves()
    for(let items of corner){
        if(avlMoves.includes(items)) return items
    }
    return null
}

function checkCenter () {
    if(availableMoves().includes(center)) return center
    else{
        return null
    }
}

function makeBotMove () {
    let botWinningMove = findWinningMove('O')
    let userWinningMove = findWinningMove('X')
    let avlCenter = checkCenter()
    let avlCorners = findCorner()
    if( botWinningMove != null) {
        grids[botWinningMove].textContent = 'O'
        grids[botWinningMove].classList.add("mark-o");
        if(checkWinner() == 'O win'){
            finishGame('O win')
            return
        }
        else if (checkDraw() == 'Draw'){
            finishGame("Draw")
            return
        }
    }
    else if (userWinningMove != null){
        grids[userWinningMove].textContent = 'O'
        grids[userWinningMove].classList.add("mark-o");
        if(checkWinner() == 'O win'){
            finishGame('O win')
            return
        }
        else if (checkDraw() == 'Draw'){
            finishGame("Draw")
            return
        }
    }
    else if (avlCenter != null){
        grids[avlCenter].textContent = 'O'
        grids[avlCenter].classList.add("mark-o");
        if(checkWinner() == 'O win'){
            finishGame('O win')
            return
        }
        else if (checkDraw() == 'Draw'){
            finishGame("Draw")
            return
        }
    }
    else if (avlCorners != null) {
        grids[avlCorners].textContent = 'O'
        grids[avlCorners].classList.add("mark-o");
        if(checkWinner() == 'O win'){
            finishGame('O win')
            return
        }
        else if (checkDraw() == 'Draw'){
            finishGame("Draw")
            return
        }
    }
    else{
        console.log('fallback')
    const avlMoves = availableMoves()
    const random = Math.floor(Math.random() * avlMoves.length)
    grids[avlMoves[random]].textContent = 'O'
    grids[avlMoves[random]].classList.add("mark-o");
    console.log(checkWinner() == 'O win')
    if(checkWinner() == 'O win'){
            finishGame('O win')
            return
        }
        else if (checkDraw() == 'Draw'){
            finishGame("Draw")
            return
        }
    
    
    }
    move = 'user'
}

if(move == 'bot') makeBotMove()
    
function clickHandler (event) {
    const target = event.target
    let avlMoves = availableMoves()
    if(move == 'user'){
        let userMove = Number(target.className)
        if(!avlMoves.includes(userMove)){
            showPanel('Already Filled')
            return
        }
        grids[Number(target.className)].textContent = 'X'
        grids[Number(target.className)].classList.add("mark-x");
        if(checkWinner() == 'X win'){
            finishGame('X win')
            return
        }
        else if (checkDraw() == 'Draw'){
            finishGame("Draw")
            return
        }
        move = 'bot'
        setTimeout(makeBotMove,1000)
    }
}

gridParent.addEventListener('click',clickHandler)