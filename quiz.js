let questions = [];
let currentIndex = 0;
let badanswer = 0;
let score = 0;
let badcheck = 0;

async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple');
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
    window.alert('クイズ終了！あなたの不正解を押した数は' + badanswer + '回でした！あなたの正解数は' + score + '回でした！');
    document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
    return;
  }

  const q = questions[currentIndex];
  const questionText = decodeHTMLEntities(q.question);
  const options = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(options);

  document.getElementById('question').textContent = questionText;
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
        resultContainer.textContent = '〇';
        resultContainer.style.color = 'green';
        score++;
        setTimeout(() => {
          currentIndex++;
          badcheck = 0;
          showQuestion();
        }, 1000);
      } else {
        resultContainer.textContent = '✕';
        resultContainer.style.color = 'red';
        alert('不正解!もう一度選んでください');
        badanswer++;
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
const btn = document.querySelector("#btn-dark-mode");

//チェックボックス切り替え判定
btn.addEventListener("change", () => {
  if (btn.checked === true) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  }else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  }
});
fetchQuestions()