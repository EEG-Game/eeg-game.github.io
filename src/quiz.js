import { state } from './state.js';
import {
    selectOption,
    resetOptions,
    getShuffledOptions
} from './utils.js';
import { drawWaveform } from './waves.js';
/* -----------------------------
   QUIZ FLOW
--------------------------------*/

export function initQuiz(resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx) {
  state.currentQuestion = 0;
  state.score = 0;
  state.selectedOption = null;
  state.quizCompleted = false;

  document.querySelector('.quiz-container').style.display = 'block';
  resultsContainer.style.display = 'none';
  waveInfo.style.display = 'none';
  submitBtn.style.display = 'block';
  nextBtn.style.display = 'none';

  loadQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx);
}

export function loadQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx) {
  resetOptions(optionsContainer, submitBtn);
  waveInfo.style.display = 'none';

  const progress = (state.currentQuestion / state.waveforms.length) * 100;
  progressBar.style.width = `${progress}%`;

  currentQuestionElement.textContent = state.currentQuestion + 1;
  totalQuestionsElement.textContent = state.waveforms.length;
  totalQuestionsResult.textContent = state.waveforms.length;

  const waveform = state.waveforms[state.currentQuestion];

  drawWaveform(waveform, waveformCanvas, ctx);

  const options = getShuffledOptions(waveform.name);

  options.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.textContent = option;
    optionElement.addEventListener('click', () => selectOption(optionElement, option, submitBtn));
    optionsContainer.appendChild(optionElement);
  });

  submitBtn.style.display = 'block';
  submitBtn.disabled = true;
}

export function submitAnswer(waveDescription, waveInfo, submitBtn, nextBtn) {
  if (state.selectedOption === null) return;

  const correctAnswer = state.waveforms[state.currentQuestion].name;
  const options = document.querySelectorAll('.option');

  options.forEach(opt => { opt.style.pointerEvents = 'none'; });

  options.forEach(opt => {
    if (opt.textContent === correctAnswer) {
      opt.classList.add('correct');
    } else if (opt.textContent === state.selectedOption) {
      opt.classList.add('incorrect');
    }
  });

  if (state.selectedOption === correctAnswer) state.score++;

  waveDescription.textContent = state.waveforms[state.currentQuestion].description;
  waveInfo.style.display = 'block';

  submitBtn.style.display = 'none';
  nextBtn.style.display = 'block';
}

export function nextQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, nextBtn, resultsContainer, scoreValue, performanceMessage) {
  nextBtn.style.display = 'none';
  state.currentQuestion++;
  if (state.currentQuestion < state.waveforms.length) {
    loadQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx);
  } else {
    showResults(resultsContainer, scoreValue, totalQuestionsResult, performanceMessage);
  }
}

export function showResults(resultsContainer, scoreValue, totalQuestionsResult, performanceMessage) {
  state.quizCompleted = true;
  document.querySelector('.quiz-container').style.display = 'none';
  resultsContainer.style.display = 'block';

  scoreValue.textContent = state.score;
  totalQuestionsResult.textContent = state.waveforms.length;

  const percentage = (state.score / state.waveforms.length) * 100;
  performanceMessage.textContent =
    percentage >= 90 ? "Excellent! You’re sharp."
    : percentage >= 70 ? "Solid work—keep drilling."
    : percentage >= 50 ? "Not bad—review key features and try again."
    : "Keep practicing—focus on core features of each pattern.";
}
