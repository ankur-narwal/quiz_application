let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let attempts = 0;
let timer;
let timeLeft = 60;
let bestScore = localStorage.getItem("bestScore") || 0;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const explanationEl = document.getElementById("explanation");
const finalScoreEl = document.getElementById("final-score");

const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");
const attemptsDisplay = document.getElementById("attempts");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");

const modeToggle = document.getElementById("mode-toggle");

modeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

function startQuiz() {
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 60;
  attempts++;

  updateHeader();
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  showQuestion();
  startTimer();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 60;
  updateTimer();

  const question = shuffledQuestions[currentQuestionIndex];
  questionEl.innerText = question.question;
  answersEl.innerHTML = "";
  explanationEl.innerText = "";

  question.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer.text;
    btn.classList.add("answer");
    btn.onclick = () => selectAnswer(btn, answer.correct);
    answersEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

function selectAnswer(button, correct) {
  clearInterval(timer);

  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    const isCorrect = btn.innerText === shuffledQuestions[currentQuestionIndex].answers.find(a => a.correct).text;
    btn.classList.add(isCorrect ? "correct" : "wrong");
  });

  if (correct) score++;
  explanationEl.innerText = shuffledQuestions[currentQuestionIndex].explanation;

  updateHeader();
}

function nextQuestion() {
  if (currentQuestionIndex < shuffledQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showResult();
  }
}

function skipQuestion() {
  nextQuestion();
}

function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScoreEl.innerText = `You scored ${score} out of ${shuffledQuestions.length}`;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }

  updateHeader();
}

function updateHeader() {
  scoreDisplay.innerText = `Score: ${score}`;
  bestScoreDisplay.innerText = `Best: ${bestScore}`;
  attemptsDisplay.innerText = `Attempts: ${attempts}`;
}

function updateProgress() {
  const percent = ((currentQuestionIndex) / questions.length) * 100;
  progressBar.style.width = `${percent}%`;
}

function updateTimer() {
  timerDisplay.innerText = `Time: ${timeLeft}s`;
}

function startTimer() {
  updateTimer();
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      skipQuestion();
    }
  }, 1000);
}

function goHome() {
  clearInterval(timer); // Stop the timer

  // Hide all sections first
  startScreen.classList.remove("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");

  // Reset progress bar and explanation
  progressBar.style.width = '0%';
  explanationEl.innerText = '';
  answersEl.innerHTML = '';
  questionEl.innerText = '';
}


