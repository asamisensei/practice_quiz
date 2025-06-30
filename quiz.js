// クイズに関する変数の初期化
let questions = [];            // 問題リスト
let currentIndex = 0;          // 現在の問題のインデックス
let score = 10;                // 正解数（初期値10でスタート）
let currentScore = 0;          // 表示用スコア（ユーザーに見せる用）
let isBonus = false;           // ボーナスステージフラグ
let actiontext = "";           // 出題モードの表示テキスト
let endpoint = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";  // 問題API

let badanswer = 0;             // 不正解を押した累積回数
let badcheck = 0;              // 一問の中で1度だけ加算するためのフラグ
let incorrectAnswer = 0;       // 累積不正解数（ゲームオーバー判定に使用）

// BGMと効果音の準備
const BGM = new Audio('BGM.mp3');
BGM.preload = 'auto';
BGM.loop = true;
BGM.play();                    // ページ読み込みと同時にBGM開始

const Tsound = new Audio('正解.mp3');   // 正解音
Tsound.preload = 'auto';

const Fsound = new Audio('不正解.mp3'); // 不正解音
Fsound.preload = 'auto';

// APIからクイズ問題を取得する関数
async function fetchQuestions() {
  const res = await fetch(endpoint);
  const data = await res.json();
  questions = data.results;
  showQuestion();  // 最初の問題を表示
}

// HTMLエンティティ（例: &quot;）を文字に変換する関数
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// クイズの問題を表示する関数
function showQuestion() {
  // 問題がすべて終わったら
  if (currentIndex >= questions.length) {
    if (!isBonus) {
      if (score >= questions.length) {
        // 全問正解でボーナスステージへ
        isBonus = true;
        currentIndex = 0;
        score = 0;
        actiontext = "ボーナス";
        alert("ノーマルクイズ終了！\n全問正解！条件を達成したのでボーナスステージにご招待！");
        endpoint = "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple"; // ボーナス問題
        fetchQuestions();
        return;
      } else {
        // 全問正解でない → 終了
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

  // 現在の問題の準備
  const q = questions[currentIndex];
  const questionText = decodeHTMLEntities(q.question);
  const options = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(options);  // 選択肢をシャッフル

  // 問題文の表示
  document.getElementById('question').textContent = actiontext + (currentIndex + 1) + "問目 : " + questionText;

  // 選択肢の初期化と配置
  const optionsContainer = document.getElementById('options');
  const resultContainer = document.getElementById('result');
  optionsContainer.innerHTML = '';
  resultContainer.textContent = '';

  // 各選択肢ボタンの生成
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = decodeHTMLEntities(option);

    // 回答がクリックされたときの処理
    btn.onclick = () => {
      if (option === q.correct_answer) {
        // 正解時の処理
        if (badcheck === 0) {
          score++;
        }
        currentScore++;
        document.getElementById('score').textContent = currentScore;
        Tsound.play();
        resultContainer.textContent = '〇';
        resultContainer.style.color = 'green';
        document.body.style.backgroundColor = "#FFFFFF";

        // 次の問題へ
        setTimeout(() => {
          currentIndex++;
          badcheck = 0;
          showQuestion();
        }, 1000);
      } else {
        // 不正解時の処理
        incorrectAnswer++;
        badanswer++;
        Fsound.play();
        resultContainer.textContent = '✕';
        resultContainer.style.color = 'red';
        document.body.style.backgroundColor = "#FF0000";
        alert('不正解! もう一度選んでください');

        if (badcheck === 0) {
          badcheck = 1;  // 同じ問題で何度もbadanswerが加算されるのを防ぐ
        }

        if (incorrectAnswer === 5) {
          // ゲームオーバー判定
          alert('ゲームオーバー');
          document.getElementById('quiz').innerHTML = '<h2>ゲームオーバー</h2>';
        }
      }
    };
    optionsContainer.appendChild(btn);
  });
}

// 配列をシャッフルする関数（Fisher–Yatesアルゴリズム）
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ページリロードボタンの動作
const reloadBtn = document.getElementById("reloadButton");
if (reloadBtn) {
  reloadBtn.addEventListener("click", function () {
    location.reload();
  });
}

// ダークモードの切替処理
const darkModeBtn = document.getElementById("btn-dark-mode");
if (darkModeBtn) {
  darkModeBtn.addEventListener("change", () => {
    if (darkModeBtn.checked === true) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  });
}

// 最初の問題取得＆開始
fetchQuestions();
window.onload = function(){
  const countDown = document.getElementById('countdown'); 
  const targetTime = new Date().getTime() + 180000; 
}

window.onload = function(){
  const countDown = document.getElementById('countdown'); 
  const targetTime = new Date().getTime() + 180000; 

  function updateCountDown(){
      const now = new Date().getTime();
      const distance = targetTime - now;
     //ミリ秒の変換
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
//カウント表示
     countDown.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//カウントが0になったらクイズ終了を表示
      if(distance < 0){
          clearInterval(interval);
        document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
        return;
      }}
//カウントの間隔今回1000ミリ秒（1秒）

const interval = setInterval(updateCountDown, 1000);
 updateCountDown();

}

