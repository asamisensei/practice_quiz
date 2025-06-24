let questions = [];
let currentIndex = 0;
let score = 10;
let isBonus = false;
let actiontext="";
let endpoint = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&#39"

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
    if (!isBonus){
    if (score >= questions.length) {
        isBonus = true;
        currentIndex = 0;
        score=0;
        actiontext = "ボーナス";
        alert("ノーマルクイズ終了！\n全問正解！条件を達成したのでボーナスステージにご招待！");
        endpoint = "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple&#38";
        fetchQuestions();
      }
    }else{
      document.getElementById('quiz').innerHTML = "<h2>"+actiontext+'クイズ終了！</h2><p>score: ' + score + '/' + questions.length;
      return;
    }     
  }

  const q = questions[currentIndex];
  const questionText = decodeHTMLEntities(q.question);
  const options = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(options);

  document.getElementById('question').textContent = actiontext+ "" + (currentIndex+1)+"問目 : "+questionText;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = decodeHTMLEntities(option);
    btn.onclick = () => {
      if (option === q.correct_answer) {
        score++;
        currentIndex++;
        alert('正解！ score: '+score+"/"+questions.length);     
        showQuestion();
      } else {
        alert('不正解! もう一度選んでください');
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


fetchQuestions(endpoint);
