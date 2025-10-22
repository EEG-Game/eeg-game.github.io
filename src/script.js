import {
    initQuiz, loadQuestion, submitAnswer, nextQuestion, showResults
} from './quiz.js';
import { state } from './state.js';
import { shuffleArray } from './utils.js';
import { waveformBank } from './wavebank.js';

/* -----------------------------
   STATE
--------------------------------*/

/* -----------------------------
   INIT / CATEGORY SWITCH
--------------------------------*/
function setCategory(newCat, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker) {
  state.category = newCat;
  // shallow copy so we can shuffle without affecting bank
  state.waveforms = [...waveformBank[state.category]];
  shuffleArray(state.waveforms);
  initQuiz(resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx);
  categoryLabel.textContent = ` | Category: ${state.category[0].toUpperCase()+state.category.slice(1)}`;
  // update chips UI
  [...categoryPicker.querySelectorAll('.chip')].forEach(ch=>{
    ch.classList.toggle('active', ch.dataset.category===state.category);
  });
}

document.addEventListener("DOMContentLoaded", () => {
    /* -----------------------------
       DOM
    --------------------------------*/
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressBar = document.getElementById('progress');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const resultsContainer = document.getElementById('results');
    const scoreValue = document.getElementById('score-value');
    const totalQuestionsResult = document.getElementById('total-questions-result');
    const performanceMessage = document.getElementById('performance-message');
    const waveInfo = document.getElementById('wave-info');
    const waveDescription = document.getElementById('wave-description');
    const waveformCanvas = document.getElementById('waveform');
    const ctx = waveformCanvas.getContext('2d');
    const categoryPicker = document.getElementById('category-picker');
    const categoryLabel = document.getElementById('category-label');

    /* -----------------------------
       EVENTS
    --------------------------------*/
    categoryPicker.addEventListener('click', (e)=>{
      const target = e.target.closest('.chip');
          if(!target) return;
          setCategory(target.dataset.category, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker);
    });
    submitBtn.addEventListener('click', () => submitAnswer(waveDescription, waveInfo, submitBtn, nextBtn));
    nextBtn.addEventListener('click', () => nextQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, nextBtn, resultsContainer, scoreValue, performanceMessage));
    restartBtn.addEventListener('click', ()=> setCategory(state.category, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker));

    /* -----------------------------
       START
    --------------------------------*/
    setCategory('normal', resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker); // default

});


