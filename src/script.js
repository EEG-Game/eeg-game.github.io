import {
    initQuiz, submitAnswer, nextQuestion
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

class EEGGame {
  constructor(doc = document) {
    this.doc = doc;
    this.waveformBank = {};
    this.categories = [];
  }

  async init(dataPath = "../data/waveforms.tsv") {
    this.waveformBank = await loadWaveformBankFromTSV(dataPath);
    this.captureUi()
        .renderCategoryPicker()
        .bindEvents();
    return this;
  }

  captureUi() {
    const waveformCanvas = this.doc.getElementById('waveform');
    state.ui = {
      questionText: this.doc.getElementById('question-text'),
      optionsContainer: this.doc.getElementById('options-container'),
      progressBar: this.doc.getElementById('progress'),
      currentQuestionElement: this.doc.getElementById('current-question'),
      totalQuestionsElement: this.doc.getElementById('total-questions'),
      submitBtn: this.doc.getElementById('submit-btn'),
      nextBtn: this.doc.getElementById('next-btn'),
      restartBtn: this.doc.getElementById('restart-btn'),
      resultsContainer: this.doc.getElementById('results'),
      scoreValue: this.doc.getElementById('score-value'),
      totalQuestionsResult: this.doc.getElementById('total-questions-result'),
      performanceMessage: this.doc.getElementById('performance-message'),
      waveInfo: this.doc.getElementById('wave-info'),
      waveDescription: this.doc.getElementById('wave-description'),
      waveformCanvas,
      ctx: waveformCanvas ? waveformCanvas.getContext('2d') : null,
      categoryPicker: this.doc.getElementById('category-picker'),
      categoryLabel: this.doc.getElementById('category-label'),
      quizContainer: this.doc.querySelector('.quiz-container')
    };
    return this;
  }

  renderCategoryPicker() {
    const { categoryPicker } = state.ui;
    const categories = Object.keys(this.waveformBank)
      .filter(cat => Array.isArray(this.waveformBank[cat]) && this.waveformBank[cat].length > 0);

    this.categories = categories;

    if (!categoryPicker) return this;

    categoryPicker.innerHTML = '';

    categories.forEach((category, idx) => {
      const button = this.doc.createElement('button');
      button.className = `chip${idx === 0 ? ' active' : ''}`;
      button.dataset.category = category;
      button.textContent = formatCategoryLabel(category);
      categoryPicker.appendChild(button);
    });

    return this;
  }

  bindEvents() {
    const { categoryPicker, submitBtn, nextBtn, restartBtn } = state.ui;
    categoryPicker?.addEventListener('click', (event) => {
      const target = event.target.closest('.chip');
      if (!target) return;
      this.setCategory(target.dataset.category);
    });
    submitBtn?.addEventListener('click', () => submitAnswer());
    nextBtn?.addEventListener('click', () => nextQuestion());
    restartBtn?.addEventListener('click', () => this.restart());
    return this;
  }

  setCategory(newCategory) {
    if (!this.waveformBank[newCategory] || this.waveformBank[newCategory].length === 0) {
      console.warn(`Unknown or empty category "${newCategory}" requested.`);
      return this;
    }

    state.category = newCategory;
    state.waveforms = [...this.waveformBank[state.category]];
    shuffleArray(state.waveforms);
    initQuiz();

    const { categoryLabel, categoryPicker } = state.ui;
    if (categoryLabel) {
      categoryLabel.textContent = ` | Category: ${formatCategoryLabel(state.category)}`;
    }
    if (categoryPicker) {
      [...categoryPicker.querySelectorAll('.chip')].forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === state.category);
      });
    }

    return this;
  }

  restart() {
    return this.setCategory(state.category);
  }

  start(preferredCategory) {
    const fallback = preferredCategory && this.categories.includes(preferredCategory)
      ? preferredCategory
      : (this.categories.includes('normal') ? 'normal' : this.categories[0]);

    if (!fallback) {
      console.warn('No categories available in waveform bank.');
      return this;
    }

    return this.setCategory(fallback);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const game = await new EEGGame().init();
  window.eegGame = game.start();
});
