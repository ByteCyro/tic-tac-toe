const STORAGE_KEY = "tic-tac-toe.player-stats.v1";

const emptyStats = () => ({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    currentWinningStreak: 0,
    bestWinningStreak: 0
});

function isValidStats(value) {
    return value !== null &&
        typeof value === "object" &&
        ["totalGames", "wins", "losses", "draws", "currentWinningStreak", "bestWinningStreak"]
            .every(key => Number.isSafeInteger(value[key]) && value[key] >= 0) &&
        value.totalGames === value.wins + value.losses + value.draws &&
        value.bestWinningStreak >= value.currentWinningStreak;
}

export function loadPlayerStats() {
    const savedStats = localStorage.getItem(STORAGE_KEY);

    if (savedStats === null) {
        return emptyStats();
    }

    let stats;

    try {
        stats = JSON.parse(savedStats);
    } catch (error) {
        throw new Error("Saved player statistics are not valid JSON.", { cause: error });
    }

    if (!isValidStats(stats)) {
        throw new Error("Saved player statistics have an invalid format.");
    }

    return stats;
}

export function recordPlayerResult(result) {
    if (!["win", "loss", "draw"].includes(result)) {
        throw new Error(`Unsupported player result: ${result}`);
    }

    const stats = loadPlayerStats();
    stats.totalGames += 1;

    if (result === "win") {
        stats.wins += 1;
        stats.currentWinningStreak += 1;
        stats.bestWinningStreak = Math.max(stats.bestWinningStreak, stats.currentWinningStreak);
    } else {
        stats[result === "loss" ? "losses" : "draws"] += 1;
        stats.currentWinningStreak = 0;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return stats;
}

export function resetPlayerStats() {
    const stats = emptyStats();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return stats;
}

export function getWinRate(stats) {
    return stats.totalGames === 0 ? 0 : (stats.wins / stats.totalGames) * 100;
}
