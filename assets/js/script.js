// List of all questions, choices, and answers

var questions = [
  {
    title: '1. Which collection object allows unique value to be inserted only once?',
    choices: ['Object', 'Set', 'Array', 'Map'],
    answer: 'Set',
  },
  {
    title: '2. Which method do you use to attach one DOM node to another?',
    choices: ['attachNode()', 'getNode()', 'querySelector()', 'appendChild()'],
    answer: 'appendChild()',
  },
  {
    title: '3. Which statement can be used to skip an iteration in a loop?',
    choices: ['break','skip','continue','pass'],
    answer: 'continue',
  },
  {
    title: '4. Which property references the DOM object that dispatched an event?',
    choices: ['target', 'self', 'object', 'source'],
    answer: 'target',
  },
  {
    title: '5. Which method converts JSON data to a JavaScript object?',
    choices: ['JSON.fromString()', 'JSON.parse()', 'JSON.toObject()', 'JSON.stringify()'],
    answer: 'JSON.parse()',
  },
  {
      title: '6. Which of the following methods can be used to display data in some form using Javascript?',
      choices: ['document.write()', 'console.log()', 'window.alert()', 'All of the above'],
      answer: 'All of the above',
    },
    {
      title: '7. What does the Javascript "debugger" statement do?',
      choices: ['It will debug all the errors in the program at runtime', 'It acts as a breakpoint in a program', 'It will debug error in the current statement if any', 'All of the above'],
      answer: 'It acts as a breakpoint in a program',
    },
    {
      title: '8. Which function is used to serialise an object into a JSON string in Javascript?',
      choices: ['stringify()','parse()','convert()','None of the above'],
      answer: 'stringify()',
    },
    {
      title: '9. How do you stop an interval timer in Javascript?',
      choices: ['clearTimer', 'clearInterval', 'intervalOver', 'None of the above'],
      answer: 'clearInterval',
    },
    {
      title: '10. The process in which an object or data structure is translated into a format suitable for transferral over a storage is called?',
      choices: ['Object Inheritance', 'Object Encapsulation', 'Object Serialisation', 'None of the above'],
      answer: 'Object Serialisation',
    },
];

// Constants for clarity and maintainability
const QUESTION_TIME_LIMIT = 15; // Time allotted per question

// Dynamically access DOM elements
const questionsContainer = document.querySelector('#questions');
const timerElement = document.querySelector('#time');
const choicesContainer = document.querySelector('#choices');
const submitButton = document.querySelector('#submit');
const startButton = document.querySelector('#start');
const initialsInput = document.querySelector('#initials');
const feedbackElement = document.querySelector('#feedback');

// Quiz state variables
let currentQuestionIndex = 0;
let remainingTime = 0; // Initialize time based on question count
let timerId;

function initiateQuiz() {
  // Calculate total time based on question count
  remainingTime = questions.length * QUESTION_TIME_LIMIT;

  // Hide start screen
  const startScreen = document.querySelector('#start-screen');
  startScreen.classList.add('hide');

  // Display questions section
  questionsContainer.classList.remove('hide');

  // Start countdown timer
  timerId = setInterval(handleCountdown, 1000);

  // Display initial timer value
  timerElement.textContent = remainingTime;

  // Present the first question
  displayCurrentQuestion();
}

function displayCurrentQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  // Update question title
  const questionTitleElement = document.querySelector('#question-title');
  questionTitleElement.textContent = currentQuestion.title;

  // Dynamically create choice buttons
  choicesContainer.innerHTML = '';
  currentQuestion.choices.forEach((choice, index) => {
    const choiceButton = document.createElement('button');
    choiceButton.classList.add('choice');
    choiceButton.value = choice;
    choiceButton.textContent = `${index + 1}. ${choice}`;
    choicesContainer.appendChild(choiceButton);
  });
}

function handleChoiceClick(event) {
  const selectedChoiceButton = event.target;

  // Ensure only choice buttons trigger events
  if (!selectedChoiceButton.matches('.choice')) {
    return;
  }

  const isCorrect = selectedChoiceButton.value === questions[currentQuestionIndex].answer;

  // Provide feedback
  feedbackElement.textContent = isCorrect ? 'Correct!' : 'Wrong!';
  feedbackElement.classList.remove('hide');
  setTimeout(() => {
    feedbackElement.classList.add('hide');
  }, 1000);

  // Navigate to the next question or end the quiz
  if (isCorrect) {
    currentQuestionIndex++;
  } else {
    remainingTime -= QUESTION_TIME_LIMIT;
  }

  if (remainingTime <= 0 || currentQuestionIndex === questions.length) {
    concludeQuiz();
  } else {
    displayCurrentQuestion();
  }
}

function concludeQuiz() {
  clearInterval(timerId);

  // Show end screen
  const endScreen = document.querySelector('#end-screen');
  endScreen.classList.remove('hide');

  // Display final score
  const finalScoreElement = document.querySelector('#final-score');
  finalScoreElement.textContent = remainingTime;

  // Hide questions section
  questionsContainer.classList.add('hide');
}

function handleCountdown() {
  remainingTime--;
  timerElement.textContent = remainingTime;

  if (remainingTime <= 0) {
    concludeQuiz();
  }
}

function saveHighScore() {
  const initials = initialsInput.value.trim();

  if (initials !== '') {
    const highScores = JSON.parse(localStorage.getItem('highscores')) || [];
    const newScore = { score: remainingTime, initials };
    highScores.push(newScore);
    localStorage.setItem('highscores', JSON.stringify(highScores));

    window.location.href = 'highscores.html';
  }
}

function handleEnterKey(event) {
  if (event.key === 'Enter') {
    saveHighScore();
  }
}

// Event listeners for user
submitButton.addEventListener('click', saveHighScore);
startButton.addEventListener('click', initiateQuiz);
choicesContainer.addEventListener('click', handleChoiceClick);
initialsInput.addEventListener('keyup', handleEnterKey);