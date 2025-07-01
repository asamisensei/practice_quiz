// クイズに関する変数の初期化
let questions = [];
let currentIndex = 0;
let score = 10;                  // 内部スコア（ボーナス判定用）
let currentScore = 0;            // 表示用スコア
let isBonus = false;             // ボーナスステージ判定
let actiontext = "";
let endpoint = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";

let badanswer = 0;               // 累積不正解クリック数
let badcheck = 0;                // 一問中の誤答カウント防止
let incorrectAnswer = 0;         // ゲームオーバー用間違い数

// BGMと効果音
const BGM = new Audio('BGM.mp3');
BGM.preload = 'auto';
BGM.loop = true;
BGM.play();

const Tsound = new Audio('正解.mp3');
Tsound.preload = 'auto';

const Fsound = new Audio('不正解.mp3');
Fsound.preload = 'auto';

// クイズAPIから問題を取得
async function fetchQuestions() {
  const res = await fetch(endpoint);
  const data = await res.json();
  questions = data.results;
  showQuestion();
}

// HTMLエンティティを文字列に変換
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// クイズの表示処理
function showQuestion() {
  if (currentIndex >= questions.length) {
    if (!isBonus) {
      if (score >= questions.length) {
        isBonus = true;
        currentIndex = 0;
        score = 0;
        actiontext = "ボーナス";
        alert("ノーマルクイズ終了！\n全問正解！条件を達成したのでボーナスステージにご招待！");
        endpoint = "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple";
        fetchQuestions();
        return;
      } else {
        alert('クイズ終了！あなたの不正解を押した数は' + badanswer + '回でした！あなたの正解数は' + score + '回でした！');
        document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
        return;
      }
    } else {
      document.getElementById('quiz').innerHTML =
        "<h2>" + actiontext + 'クイズ終了！</h2><p>score: ' + score + '/' + questions.length;
      return;
    }
  }

  const q = questions[currentIndex];
  const questionText = decodeHTMLEntities(q.question);
  const options = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(options);

  document.getElementById('question').textContent =
    actiontext + (currentIndex + 1) + "問目 : " + questionText;

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
        if (badcheck === 0) score++;
        currentScore++;
        document.getElementById('score').textContent = currentScore;
        Tsound.play();
        resultContainer.textContent = '〇';
        resultContainer.style.color = 'green';
        document.body.style.backgroundColor = "#FFFFFF";
        setTimeout(() => {
          currentIndex++;
          badcheck = 0;
          showQuestion();
        }, 1000);
      } else {
        incorrectAnswer++;
        badanswer++;
        Fsound.play();
        resultContainer.textContent = '✕';
        resultContainer.style.color = 'red';
        document.body.style.backgroundColor = "#FF0000";
        alert('不正解! もう一度選んでください');
        if (badcheck === 0) badcheck = 1;

        if (incorrectAnswer === 5) {
          alert('ゲームオーバー');
          document.getElementById('quiz').innerHTML = '<h2>ゲームオーバー</h2>';
        }
      }
    };
    optionsContainer.appendChild(btn);
  });
}

// 選択肢のシャッフル処理
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ページリロードボタン
const reloadBtn = document.getElementById("reloadButton");
if (reloadBtn) {
  reloadBtn.addEventListener("click", () => location.reload());
}

// ダークモード切替処理
const darkModeBtn = document.getElementById("btn-dark-mode");
if (darkModeBtn) {
  darkModeBtn.addEventListener("change", () => {
    document.body.classList.toggle('dark-mode', darkModeBtn.checked);
    document.body.classList.toggle('light-mode', !darkModeBtn.checked);
  });
}

// カウントダウンタイマー（3分）
window.onload = function () {
  const countDown = document.getElementById('countdown');
  const targetTime = new Date().getTime() + 180000;

  function updateCountDown() {
    const now = new Date().getTime();
    const distance = targetTime - now;
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countDown.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (distance < 0) {
      clearInterval(interval);
      document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
    }
  }

  const interval = setInterval(updateCountDown, 1000);
  updateCountDown();
};

// 背景色変更ボタン処理
const button1 = document.getElementById('btn1');
if (button1) {
  button1.addEventListener('click', () => {
    const color = document.getElementById('textbox1').value;
    document.documentElement.style.setProperty('--main-bg', color);
  });
}

// 文字色変更ボタン処理
const button2 = document.getElementById('btn2');
if (button2) {
  button2.addEventListener('click', () => {
    const color = document.getElementById('textbox2').value;
    document.documentElement.style.setProperty('--main-text', color);
  });
}

// クイズ開始
fetchQuestions();
