import {
    initQuiz, loadQuestion, submitAnswer, nextQuestion, showResults
} from './quiz.js';
import { state } from './state.js';
import { shuffleArray } from './utils.js';
import { loadWaveformBankFromTSV } from './waves.js';

function formatCategoryLabel(category) {
  const presets = {
    normal: 'Normal (Awake)',
    sleep: 'Sleep Patterns',
    abnormal: 'Abnormal Patterns',
  };
  if (presets[category]) return presets[category];
  return category
    .split(/[_-]/g)
    .map(part => part ? part[0].toUpperCase() + part.slice(1) : part)
    .join(' ')
    .trim();
}

function renderCategoryPicker(categoryPicker, waveformBank) {
  const categories = Object.keys(waveformBank)
    .filter(cat => Array.isArray(waveformBank[cat]) && waveformBank[cat].length > 0);

  categoryPicker.innerHTML = '';

  categories.forEach((category, idx) => {
    const button = document.createElement('button');
    button.className = `chip${idx === 0 ? ' active' : ''}`;
    button.dataset.category = category;
    button.textContent = formatCategoryLabel(category);
    categoryPicker.appendChild(button);
  });

  return categories;
}

/* -----------------------------
   INIT / CATEGORY SWITCH
--------------------------------*/
function setCategory(newCat, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker, waveformBank) {
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

document.addEventListener("DOMContentLoaded", async () => {
    const waveformBank = await loadWaveformBankFromTSV("../data/waveforms.tsv");
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
    const availableCategories = renderCategoryPicker(categoryPicker, waveformBank);

    categoryPicker.addEventListener('click', (e)=>{
      const target = e.target.closest('.chip');
          if(!target) return;
          setCategory(target.dataset.category, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker, waveformBank);
    });
    submitBtn.addEventListener('click', () => submitAnswer(waveDescription, waveInfo, submitBtn, nextBtn));
    nextBtn.addEventListener('click', () => nextQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, nextBtn, resultsContainer, scoreValue, performanceMessage));
    restartBtn.addEventListener('click', ()=> setCategory(state.category, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker, waveformBank));

    /* -----------------------------
       START
    --------------------------------*/
    const initialCategory = availableCategories.includes('normal') ? 'normal' : availableCategories[0];
    if (initialCategory) {
      setCategory(initialCategory, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker, waveformBank); // default
    } else {
      console.warn('No categories available in waveform bank.');
    }

});

