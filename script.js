let puzzles = [];
let currentPuzzle;

function loadPuzzles() {
    fetch('puzzles.json')
        .then(response => response.json())
        .then(data => {
            puzzles = data;
            loadDailyPuzzle();
        });
}

function loadDailyPuzzle() {
    const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
    currentPuzzle = puzzles.find(p => p.date === today) || puzzles[0]; // fallback to first puzzle
    document.getElementById('date').textContent = `Puzzle for ${currentPuzzle.date}`;
    renderBoard();
}

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    currentPuzzle.board.forEach(word => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = word;
        tile.onclick = () => selectTile(word);
        boardDiv.appendChild(tile);
    });
    document.getElementById('feedback').textContent = "";
    document.getElementById('revealRuleBtn').style.display = "none";
}

function selectTile(word) {
    const feedback = document.getElementById('feedback');
    if(word === currentPuzzle.outlier) {
        feedback.textContent = "✅ Correct! Now try to write the rule.";
        document.getElementById('revealRuleBtn').style.display = "inline";
        promptRule();
    } else {
        feedback.textContent = "❌ Nope, try again.";
    }
}

function promptRule() {
    const userRule = prompt("Describe the pattern or rule for the other words:");
    const feedback = document.getElementById('feedback');
    if(userRule) {
        feedback.textContent += `\nYou wrote: "${userRule}"`;
    }
}

document.getElementById('revealRuleBtn').onclick = () => {
    alert(currentPuzzle.rule);
}

loadPuzzles();
