let questions = [];
let current = 0;
let score = 0;
let html = "";

function initQuiz() {
  fetch('data/quiz.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      loadQuestion();
    });
}

function loadQuestion() {
  const q = questions[current];
  if (current < questions.length) {
    document.getElementById("question").innerText =
      `Soal ${current + 1}: ${q.question}`;
    let html = "";
    q.options.forEach((opt, i) => {
      html += `
    <div class="option-item" onclick="selectOption(this, ${i})">
      <input type="radio" name="answer" value="${i}" id="opt${i}">
      <label for="opt${i}">${opt}</label>
    </div>
  `;
    });
    document.getElementById("options").innerHTML = html;
    let saved = JSON.parse(localStorage.getItem("tempAnswers")) || {};
    if (saved[current] !== undefined) {
      const selectedIndex = saved[current];

      const options = document.querySelectorAll('.option-item');
      options[selectedIndex].classList.add('selected');
      options[selectedIndex].querySelector("input").checked = true;
    }
    if (current === questions.length - 1) {
      document.getElementById('btn-next').innerHTML = 'Selesai'
    }
  } else {
    document.getElementById("question").innerHTML = `
      <div class="alert alert-success">
        Skor: ${score} / ${questions.length}
      </div>
    `;
    document.getElementById("options").innerHTML = ''
    // localStorage.setItem("tempAnswers", "");
  }
}

function nextQuestion() {
  if (current < questions.length) {
    const selected = document.querySelector('input[name="answer"]:checked');
    //if (!selected) return alert("Pilih jawaban!");

    const answer = parseInt(selected.value);

    if (answer === questions[current].answer) {
      score++;
    }

    current++;


    loadQuestion();
  } else {
    document.getElementById("question").innerHTML = `
      <div class="alert alert-success">
        Skor: ${score} / ${questions.length}
      </div>
    `;
    document.getElementById("options").innerHTML = ''
  }
}

function selectOption(el, index) {
  document.querySelectorAll('.option-item').forEach(item => {
    item.classList.remove('selected');
  });

  el.classList.add('selected');

  const radio = el.querySelector("input");
  radio.checked = true;
    // ambil data lama
   let answers = JSON.parse(localStorage.getItem("tempAnswers")) || {};
  // simpan jawaban berdasarkan nomor soal
  answers[current] = index;

  localStorage.setItem("tempAnswers", JSON.stringify(answers));
}