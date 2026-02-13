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
        feedback.textContent = "✅ Correct! Now select the rule.";
        showRuleOptions();
    } else {
        tile.classList.add('incorrect');
        feedback.textContent = "❌ Nope, try again.";
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

    document.getElementById('revealRuleBtn').style.display = "inline";
}

function checkRule(btn, option) {
    Array.from(document.getElementsByClassName('ruleOption')).forEach(o => {
        o.classList.remove('correct', 'incorrect');
    });

    if(option === currentPuzzle.rule) {
        btn.classList.add('correct');
        document.getElementById('feedback').textContent = "✅ Correct rule!";
    } else {
        btn.classList.add('incorrect');
        document.getElementById('feedback').textContent = "❌ Wrong rule, try again.";
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
