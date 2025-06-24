// quiz.js
let score  = 0
let questions = [];
let currentIndex = 0;

async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&#39;');
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
    document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
    window.alert ('クイズ終了！あなたの不正解回数は' + score  + '回です！') 
    return;
  }

  const q = questions[currentIndex];
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
        currentIndex++;
        showQuestion();
      } else {
        alert('不正解!もう一度選んでください');
        score++;
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

var alertmsg = function(){
  alert("タイムオーバー");
}
setTimeout(alertmsg, 61000);

var reset = function(){
  window.location.reload();
}
setTimeout(reset, 61000);



window.onload = function(){
    const countDown = document.getElementById('countdown'); 
    const targetTime = new Date().getTime() + 60000; 

    function updateCountDown(){
        const now = new Date().getTime();
        const distance = targetTime - now;
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

       countDown.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if(distance < 0){
            clearInterval(interval);
            countDown.textContent = '終了しました';
        }
     }

    const interval = setInterval(updateCountDown, 1000);
     updateCountDown();

}

fetchQuestions();
