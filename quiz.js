<<<<<<< HEAD
let questions = [];
let currentIndex = 0;
let num = [0,1,2,3,4,5,6,7,8,9];

async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple');
=======
// quiz.js07
let questions = [];
let currentIndex = 0;[]
let num = [0,1,2,3,4,5,6,7,8,9];
let badanswer = 0;
let score = 0;
let badcheck = 0;


async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&#39;');
>>>>>>> 28c6244a279dfc29f9c988ac3b5e89ef8b19d07b
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
  if (currentIndex >= num.length) {
      document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
      return;
  } else {
    const q = questions[num[currentIndex]];
    const questionText = decodeHTMLEntities(q.question);
    const options = [...q.incorrect_answers, q.correct_answer];
    shuffleArray(options);

    document.getElementById('question').textContent = questionText;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = decodeHTMLEntities(option);
      btn.onclick = () => {
        if (option === q.correct_answer) {
          alert('正解！');
        } else {
          alert('不正解！正解は「' + decodeHTMLEntities(q.correct_answer) + '」です');
        }
        currentIndex++;
        showQuestion();
      };
      optionsContainer.appendChild(btn);
    });
  }
  if (currentIndex > 9){
    procrastinate.style.display="block";
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const back_button = document.getElementById("button");

back_button.addEventListener('click',() => {
  num.push(currentIndex%10);
  currentIndex++;
  showQuestion();
  console.log(num);
});

fetchQuestions();