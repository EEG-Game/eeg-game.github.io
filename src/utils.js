import { state } from './state.js';

/* -----------------------------
   HELPERS
--------------------------------*/
export function getShuffledOptions(correct){
  // Pull names from the active category set
  const names = state.waveforms.map(w=>w.name);
  const others = names.filter(n=>n!==correct);
  const picks = [];
  while (picks.length<3 && others.length){
    const i = Math.floor(Math.random()*others.length);
    picks.push(others.splice(i,1)[0]);
  }
  picks.push(correct);
  shuffleArray(picks);
  return picks;
}
export function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

export function selectOption(el, option){
  const { submitBtn } = state.ui;
  if (state.quizCompleted) return;
  document.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedOption = option;
  submitBtn.disabled = false;
}

export function resetOptions(){
  const { optionsContainer, submitBtn } = state.ui;
  optionsContainer.innerHTML = '';
  state.selectedOption = null;
  submitBtn.disabled = true;
}

