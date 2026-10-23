import { getWinRate, loadPlayerStats, resetPlayerStats } from "./playerStats.js";

const fields = {
    totalGames: document.getElementById("totalGames"),
    wins: document.getElementById("wins"),
    losses: document.getElementById("losses"),
    draws: document.getElementById("draws"),
    winRate: document.getElementById("winRate"),
    bestStreak: document.getElementById("bestStreak")
};
const message = document.getElementById("statsMessage");
const resetButton = document.getElementById("resetStats");

function displayStats(stats) {
    fields.totalGames.textContent = stats.totalGames;
    fields.wins.textContent = stats.wins;
    fields.losses.textContent = stats.losses;
    fields.draws.textContent = stats.draws;
    fields.winRate.textContent = `${getWinRate(stats).toFixed(1)}%`;
    fields.bestStreak.textContent = stats.bestWinningStreak;
}

function showStats() {
    try {
        displayStats(loadPlayerStats());
        message.textContent = "";
    } catch (error) {
        console.error("Failed to load player statistics.", error);
        message.textContent = "Statistics could not be loaded. You can reset them to start fresh.";
    }
}

resetButton.addEventListener("click", () => {
    if (!window.confirm("Reset all saved player statistics? This cannot be undone.")) {
        return;
    }

    try {
        displayStats(resetPlayerStats());
        message.textContent = "Statistics reset.";
    } catch (error) {
        console.error("Failed to reset player statistics.", error);
        message.textContent = "Statistics could not be reset. Check browser storage settings.";
    }
});

showStats();
