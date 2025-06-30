  let questions = [];
    let currentIndex = 0;
    let currentScore = 0;
    let incorrectAnswer = 0;
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
        document.getElementById('quiz').innerHTML = '<h2>クイズ終了！</h2>';
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
            document.getElementById('score').textContent = currentScore++;
            document.body.style.backgroundColor = "#FFFFFF";
            currentIndex++;
            showQuestion();
          } else {
            incorrectAnswer++;
            document.body.style.backgroundColor = "#FF0000";
            alert('不正解!もう一度選んでください');
            if(incorrectAnswer === 5) {
              alert('ゲームオーバー');
              document.getElementById('quiz').innerHTML = '<h2>ゲームオーバー</h2>';
            }
            //  while (option >= q.correct_answer)
            // document.getElementById('quiz').style.backgroundcolor = "#FF0000";
            //   // changebackgroundColor("#FF0000")
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

    fetchQuestions();