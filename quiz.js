// クイズに関する変数の初期化
let questions = [];
let currentIndex = 0;
let score = 10;                  // 内部スコア
let currentScore = 0;            // 表示用スコア
let isBonus = false;             // ボーナスステージ判定
let actiontext = "";
let endpoint = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";

let badanswer = 0;               // 不正解を押した累積数
let badcheck = 0;                // 同一問題で1度だけ加算
let incorrectAnswer = 0;         // ゲームオーバー用の間違い回数

// BGMと効果音の準備
const BGM = new Audio('BGM.mp3');
BGM.preload = 'auto';
BGM.loop = true;
BGM.play();                      // ページ読み込み時に再生

const Tsound = new Audio('正解.mp3');
Tsound.preload = 'auto';

const Fsound = new Audio('不正解.mp3');
Fsound.preload = 'auto';

// クイズ問題を取得
async function fetchQuestions() {
  const res = await fetch(endpoint);
  const data = await res.json();
  questions = data.results;
  showQuestion();
}

// HTMLエンティティを通常の文字に変換
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// クイズを表示する関数
function showQuestion() {
  if (currentIndex >= questions.length) {
    if (!isBonus) {
      if (score >= questions.length) {
        // ボーナスステージへ移行
        isBonus = true;
        currentIndex = 0;
        score = 0;
        actiontext = "ボーナス";
        alert("ノーマルクイズ終了！\n全問正解！条件を達成したのでボーナスステージにご招待！");
        endpoint = "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple";
        fetchQuestions();
        return;
      } else {
        // 通常の終了
        alert('クイズ終了！あなたの不正解を押した数は' + badanswer + '回でした！あなたの正解数は' + score + '回でした！');
        document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
        return;
      }
    } else {
      // ボーナスステージ終了
      document.getElementById('quiz').innerHTML = "<h2>" + actiontext + 'クイズ終了！</h2><p>score: ' + score + '/' + questions.length;
      return;
    }
  }

  // 問題の取得と選択肢の表示
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

        if (badcheck === 0) {
          badcheck = 1;
        }

        if (incorrectAnswer === 5) {
          alert('ゲームオーバー');
          document.getElementById('quiz').innerHTML = '<h2>ゲームオーバー</h2>';
        }
      }
    };

    optionsContainer.appendChild(btn);
  });
}

// 選択肢をシャッフル
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ページリロードボタン
const reloadBtn = document.getElementById("reloadButton");
if (reloadBtn) {
  reloadBtn.addEventListener("click", function () {
    location.reload();
  });
}

// ダークモード切替
const darkModeBtn = document.getElementById("btn-dark-mode");
if (darkModeBtn) {
  darkModeBtn.addEventListener("change", () => {
    if (darkModeBtn.checked) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  });
}

// クイズを開始
fetchQuestions();

function buttonClick1() {
  let txt_input1 = document.getElementById("textbox1").value;
  document.documentElement.style.setProperty('--main-bg',txt_input1);
}

let button1 = document.getElementById('btn1');
button1.addEventListener('click', buttonClick1);

function buttonClick2() {
  let txt_input2 = document.getElementById("textbox2").value;
  document.documentElement.style.setProperty('--main-text',txt_input2);
}

let button2 = document.getElementById('btn2');
button2.addEventListener('click', buttonClick2);