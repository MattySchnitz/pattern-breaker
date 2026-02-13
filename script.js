let puzzles = [];
let currentPuzzle;
let incorrectGuesses = 0; // cumulative across tile + rule selection

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
    incorrectGuesses = 0;
    document.getElementById('revealRuleBtn').style.display = "none";
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

    document.getElementById('tileFeedback').textContent = "";
    document.getElementById('ruleFeedbackLine').textContent = "";
    document.getElementById('ruleContainer').style.display = "none";
}

function selectTile(tile, word) {
    const feedback = document.getElementById('tileFeedback');

    Array.from(document.getElementsByClassName('tile')).forEach(t => {
        t.classList.remove('correct', 'incorrect');
    });

    if(word === currentPuzzle.outlier) {
        tile.classList.add('correct');
        feedback.textContent = "✅ You found the outlier!";
        showRuleOptions();
    } else {
        tile.classList.add('incorrect');
        feedback.textContent = "❌ Not the outlier, try again!";
        incrementIncorrect();
    }
}

function showRuleOptions() {
    const container = document.getElementById('ruleContainer');
    const optionsDiv = document.getElementById('ruleOptions');

    container.style.display = "block";
    optionsDiv.innerHTML = "";

    const allOptions = [currentPuzzle.rule, ...currentPuzzle.distractors];
    shuffleArray(allOptions);

    allOptions.forEach(option => {
        const btn = document.createElement("div");
        btn.className = "ruleOption";
        btn.textContent = option;
        btn.onclick = () => checkRule(btn, option);
        optionsDiv.appendChild(btn);
    });
}

function checkRule(btn, option) {
    Array.from(document.getElementsByClassName('ruleOption')).forEach(o => {
        o.classList.remove('correct', 'incorrect');
    });

    const ruleFeedback = document.getElementById('ruleFeedbackLine');

    if(option === currentPuzzle.rule) {
        btn.classList.add('correct');
        ruleFeedback.textContent = "✅ Correct rule!";
    } else {
        btn.classList.add('incorrect');
        ruleFeedback.textContent = "❌ Wrong rule, try again!";
        incrementIncorrect();
    }
}

function incrementIncorrect() {
    incorrectGuesses++;
    if(incorrectGuesses >= 2) {
        document.getElementById('revealRuleBtn').style.display = "inline";
    }
}

function shuffleArray(arr) {
    for(let i = arr.length -1; i >0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

document.getElementById('revealRuleBtn').onclick = () => {
    alert(currentPuzzle.rule);
}

loadPuzzles();
