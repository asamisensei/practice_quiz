let questions = [];
let currentIndex = 0;
let score = 10;
let isBonus = false;
let actiontext = "";
let endpoint = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";

let badanswer = 0;
let badcheck = 0;

async function fetchQuestions() {
  const res = await fetch(endpoint);
  const data = await res.json();
  questions = data.results;
  showQuestion();
}

function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    if (!isBonus) {
      if (score >= questions.length) {
        isBonus = true;
        currentIndex = 0;
        score = 0;
        actiontext = "ボーナス";
        window.alert('クイズ終了！あなたの不正解を押した数は' + badanswer + '回でした！あなたの正解数は' + score + '回でした！');
        alert("ノーマルクイズ終了！\n全問正解！条件を達成したのでボーナスステージにご招待！");
        endpoint = "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple";
        fetchQuestions();
        return;
      } else {
        window.alert('クイズ終了！あなたの不正解を押した数は' + badanswer + '回でした！あなたの正解数は' + score + '回でした！');
        document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
        return;
      }
    } else {
      document.getElementById('quiz').innerHTML = "<h2>" + actiontext + 'クイズ終了！</h2><p>score: ' + score + '/' + questions.length;
      return;
    }
  }

  const q = questions[currentIndex];
  const questionText = decodeHTMLEntities(q.question);
  const options = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(options);

  document.getElementById('question').textContent = actiontext + (currentIndex + 1) + "問目 : " + questionText;

  const optionsContainer = document.getElementById('options');
  const resultContainer = document.getElementById('result');
  optionsContainer.innerHTML = '';
  resultContainer.textContent = '';

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = decodeHTMLEntities(option);
    btn.onclick = () => {
      if (option === q.correct_answer) {
        if (badcheck === 0) {
          score++;
        }
        resultContainer.textContent = '〇';
        resultContainer.style.color = 'green';
        setTimeout(() => {
          currentIndex++;
          badcheck = 0;
          showQuestion();
        }, 1000);
      } else {
        resultContainer.textContent = '✕';
        resultContainer.style.color = 'red';
        alert('不正解! もう一度選んでください');
        badanswer++;
        if (badcheck === 0) {
          badcheck = 1;
        }
      }
    };
    optionsContainer.appendChild(btn);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ページリロード用ボタン
const button = document.getElementById("reloadButton");
if (button) {
  button.addEventListener("click", function () {
    location.reload();
  });
}

// ダークモード切り替え対応
const btn = document.getElementById("btn-dark-mode");
if (btn) {
  btn.addEventListener("change", () => {
    if (btn.checked === true) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  });
}

fetchQuestions();
