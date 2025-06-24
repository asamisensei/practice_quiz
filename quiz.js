<<<<<<< HEAD
let questions = [];
let questionsB = [];
let currentIndex = 0;
let score = 0;
let actiontext="";
let endpoint = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&#39"

async function fetchQuestions() {
  const res = await fetch(endpoint);
  const data = await res.json();
  questions = data.results;
  showQuestion();
}
=======
// quiz.js
    let questions = [];
let currentIndex = 0;
const BGM = new Audio('BGM.mp3')
BGM.prereload = 'auto';
BGM.loop = true;
BGM.play();
const Tsound = new Audio('正解.mp3');
Tsound.preroad = 'auto';
const Fsound = new Audio('不正解.mp3');
Fsound.prereload = 'auto';

    async function fetchQuestions() {
      const res = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&#39;');
      const data = await res.json();
      questions = data.results;
      showQuestion();
    }
>>>>>>> 2e2f7de4ef82c0a4a7cc34fb484c7a56fc45f2f5

function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    if (score >= questions.length) {
      currentIndex = 0;
      score=0;
      actiontext = "ボーナス";
      alert("ノーマルクイズ終了！\n全問正解！条件を達成したのでボーナスステージにご招待！");
      endpoint = "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple&#38";
      fetchQuestions();
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

<<<<<<< HEAD
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
=======
      document.getElementById('question').textContent = questionText;
      const optionsContainer = document.getElementById('options');
      optionsContainer.innerHTML = '';

      options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = decodeHTMLEntities(option);
        btn.onclick = () => {
            if (option === q.correct_answer) {
            Tsound.play();
            alert('正解！');
            currentIndex++;
            showQuestion();
            } else {
            Fsound.play();
            alert('不正解!もう一度選んでください');
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
 
>>>>>>> 2e2f7de4ef82c0a4a7cc34fb484c7a56fc45f2f5


fetchQuestions(endpoint);
