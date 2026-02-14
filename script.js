<script>
let strikes = 0;
let outlierSelected = false;
let gameOver = false;
let tileResults = [];
let ruleResult = "";

fetch('puzzles.json')
.then(res => res.json())
.then(data => {

  const todayStr = new Date().toISOString().split('T')[0];
  let puzzle = data.find(p => p.date === todayStr) || data[0];

  const board = puzzle.board.slice();
  shuffle(board);

  const grid = document.getElementById("grid");

  board.forEach(item => {
    const div = document.createElement("div");
    div.className = "tile";
    div.innerText = item;

    div.onclick = () => {
      if (outlierSelected || gameOver) return;

      if (item === puzzle.outlier) {
        div.classList.add("correct");
        tileResults.push("🟩");
        outlierSelected = true;
        renderRules(puzzle);
      } else {
        div.classList.add("wrong");
        tileResults.push("🟥");
        strikes++;
        checkGameOver();
      }
    };

    grid.appendChild(div);
  });

});

function renderRules(puzzle) {

  const rulesDiv = document.getElementById("rules");
  rulesDiv.innerHTML = "<h3>Which statement correctly describes the pattern?</h3>";

  const allRules = [puzzle.rule, ...puzzle.distractors];
  shuffle(allRules);

  allRules.forEach(ruleText => {

    const div = document.createElement("div");
    div.className = "rule-option";
    div.innerText = ruleText;

    div.onclick = () => {
      if (gameOver) return;

      if (ruleText === puzzle.rule) {
        ruleResult = "🟦";
        endGame(true);
      } else {
        ruleResult = "🟧";
        strikes++;
        checkGameOver();
      }
    };

    rulesDiv.appendChild(div);
  });

  document.getElementById("ruleSection").style.display = "block";
}

function checkGameOver() {
  if (strikes >= 3) {
    endGame(false);
  }
}

function endGame(win) {
  gameOver = true;

  const modal = document.getElementById(win ? "winModal" : "loseModal");
  modal.style.display = "flex";

  addShareButton(win);
}

function addShareButton(win) {
  const modalBox = document.querySelector(".modal-box");

  const btn = document.createElement("button");
  btn.className = "share-btn";
  btn.innerText = "Share Results";

  btn.onclick = () => {
    const date = new Date().toISOString().split('T')[0];

    const shareText =
`9omoly ${date}

${tileResults.join("")}
${ruleResult}

${strikes}/3 mistakes`;

    navigator.clipboard.writeText(shareText);
    btn.innerText = "Copied!";
  };

  modalBox.appendChild(btn);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
</script>
