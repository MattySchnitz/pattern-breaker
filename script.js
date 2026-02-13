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
    const today = new Date();
    const todayStr = formatDate(today);
    currentPuzzle = puzzles.find(p => p.date === today.toISOString().slice(0,10)) || puzzles[0];
    document.getElementById('date').textContent = `Puzzle for ${todayStr}`;
    renderBoard();
    incorrectGuesses = 0;
    document.getElementById('revealRuleBtn').style.display = "none";
}

// Format date as "February 13th, 2026"
function formatDate(d) {
    const monthNames = ["January","February","March","April","May","June",
                        "July","August","September","October","November","December"];
    const day = d.getDate();
    const daySuffix = (day) => {
        if(day>=11 && day<=13) return 'th';
        switch(day%10){
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }
    return `${monthNames[d.getMonth()]} ${day}${daySuffix(day)}, ${d.getFullYear()}`;
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
    document.getElementById('ruleFeedbackLine').textContent = "";

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
