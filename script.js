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
    currentPuzzle = puzzles.find(p => p.date === today) || puzzles[0]; // fallback
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
        tile.onclick = () => selectTile(tile, word);
        boardDiv.appendChild(tile);
    });

    document.getElementById('feedback').textContent = "";
    document.getElementById('ruleContainer').style.display = "none";
    document.getElementById('revealRuleBtn').style.display = "none";
}

function selectTile(tile, word) {
    const feedback = document.getElementById('feedback');

    // Reset previous animations
    Array.from(document.getElementsByClassName('tile')).forEach(t => {
        t.classList.remove('correct', 'incorrect');
    });

    if(word === currentPuzzle.outlier) {
        tile.classList.add('correct');
        feedback.textContent = "✅ Correct! Now describe the rule.";
        showRuleInput();
    } else {
        tile.classList.add('incorrect');
        feedback.textContent = "❌ Nope, try again.";
    }
}

function showRuleInput() {
    const container = document.getElementById('ruleContainer');
    container.style.display = "block";

    const input = document.getElementById('ruleInput');
    const feedback = document.getElementById('ruleFeedback');

    input.value = "";
    feedback.textContent = "";

    const fuse = new Fuse([currentPuzzle.rule], { includeScore: true, threshold: 0.4 });

    const submitBtn = document.getElementById('ruleSubmitBtn');
    submitBtn.onclick = () => {
        const userRule = input.value.trim();
        if (!userRule) return;

        const result = fuse.search(userRule);
        if (result.length > 0 && result[0].score < 0.35) {
            feedback.textContent = "✅ Nice! That looks correct!";
        } else {
            feedback.textContent = "❌ Hmm, that doesn’t match. Try again!";
        }
    };

    document.getElementById('revealRuleBtn').style.display = "inline";
}

document.getElementById('revealRuleBtn').onclick = () => {
    alert(currentPuzzle.rule);
}

loadPuzzles();
