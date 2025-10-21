/* -----------------------------
   DATA: grouped by category
--------------------------------*/
const waveformBank = {
  normal: [
    {
      name: "Posterior Dominant Rhythm (Alpha)",
      description:
        "Normal relaxed-awake rhythm with eyes closed; posterior maximal ~8–13 Hz alpha attenuating with eye opening (‘alpha block’).",
      frequency: "8–13 Hz", amplitude: "Low–moderate", clinicalSignificance: "Normal awake",
      draw: drawAlpha
    },
    {
      name: "Low-Amplitude Beta",
      description:
        "Frontocentral-predominant, low-amplitude fast activity; increases with drowsiness or benzodiazepines.",
      frequency: "13–30+ Hz", amplitude: "Low", clinicalSignificance: "Normal variant / medication effect",
      draw: drawBeta
    },
    {
      name: "Mu Rhythm",
      description:
        "Arciform rhythm over sensorimotor cortex (central); ~8–10 Hz, blocked by contralateral movement or tactile input.",
      frequency: "8–10 Hz", amplitude: "Variable", clinicalSignificance: "Normal variant",
      draw: drawMu
    }
  ],
  sleep: [
    {
      name: "Vertex Sharp Waves",
      description:
        "Stage N1/N2 sleep; sharp monophasic waves maximal at Cz, often symmetric.",
      frequency: "Isolated/transient", amplitude: "Moderate", clinicalSignificance: "Normal sleep transients",
      draw: drawVertex
    },
    {
      name: "Sleep Spindles",
      description:
        "Waxing/waning 11–16 Hz spindles, maximal frontocentral, defining feature of N2 sleep.",
      frequency: "11–16 Hz", amplitude: "Low–moderate", clinicalSignificance: "Normal N2 sleep",
      draw: drawSpindle
    },
    {
      name: "K-Complex",
      description:
        "High-amplitude, biphasic negative–positive complex, often preceding a spindle; hallmark of N2 sleep.",
      frequency: "Isolated/transient", amplitude: "High", clinicalSignificance: "Normal N2 sleep",
      draw: drawKComplex
    },
    {
      name: "POSTS (Positive Occipital Sharp Transients of Sleep)",
      description:
        "Benign positive sharp transients in occipital regions during drowsiness/N2; often diphasic.",
      frequency: "Intermittent", amplitude: "Low–moderate", clinicalSignificance: "Benign sleep variant",
      draw: drawPOSTS
    }
  ],
  abnormal: [
    { name: "Spike-and-Wave Discharge",
      description: "Classic ~3 Hz spike-and-wave of typical absence seizures.",
      frequency: "≈3 Hz", amplitude: "High", clinicalSignificance: "Generalized absence epilepsy",
      draw: drawSpikeAndWave },
    { name: "Polyspike Waves",
      description: "Multiple spikes followed by a slow wave; juvenile myoclonic epilepsy.",
      frequency: "4–6 Hz", amplitude: "High", clinicalSignificance: "Generalized epilepsy syndromes",
      draw: drawPolyspikeWaves },
    { name: "Focal Spikes",
      description: "Localized spikes indicating focal cortical irritability.",
      frequency: "Variable", amplitude: "Variable", clinicalSignificance: "Focal epilepsy",
      draw: (w,h)=>drawRandomSpikes(w,h,5,60) },
    { name: "Hypsarrhythmia",
      description: "Chaotic, high-voltage slow waves with multifocal spikes; infantile spasms.",
      frequency: "Disorganized", amplitude: "High", clinicalSignificance: "Infantile spasms",
      draw: drawChaoticPattern },
    { name: "Slow Spike-and-Wave",
      description: "1.5–2.5 Hz slow spike-and-wave; Lennox–Gastaut syndrome.",
      frequency: "1.5–2.5 Hz", amplitude: "High", clinicalSignificance: "LGS",
      draw: drawSlowSpikeAndWave },
    { name: "Generalized Paroxysmal Fast Activity",
      description: "Bursts of 10–20 Hz spikes/polyspikes during sleep; LGS.",
      frequency: "10–20 Hz", amplitude: "Variable", clinicalSignificance: "LGS",
      draw: drawFastActivity },
    { name: "Photoparoxysmal Response",
      description: "Generalized spikes or spike–wave triggered by photic stimulation.",
      frequency: "Variable", amplitude: "Variable", clinicalSignificance: "Photosensitive epilepsy",
      draw: drawPhoticResponsePattern },
    { name: "Temporal Lobe Sharp Waves",
      description: "Sharp waves maximal at temporal electrodes; temporal lobe epilepsy.",
      frequency: "Variable", amplitude: "Med–high", clinicalSignificance: "Temporal lobe epilepsy",
      draw: (w,h)=>drawFocalSharpWaves(w,h,w*0.7) },
    { name: "Rolandic Spikes",
      description: "Centrotemporal spikes with horizontal dipole; BECTS/SeLECTS.",
      frequency: "Variable", amplitude: "High", clinicalSignificance: "Self-limited epilepsy with centrotemporal spikes",
      draw: drawDipoleSpikes },
    { name: "PLEDs (Lateralized Periodic Discharges)",
      description: "Periodic lateralized discharges; often acute structural lesion.",
      frequency: "0.5–2 Hz", amplitude: "High", clinicalSignificance: "Acute cerebral injury",
      draw: drawPeriodicDischarges }
  ]
};

/* -----------------------------
   STATE
--------------------------------*/
let category = "normal";
let waveforms = []; // active list for current category
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let quizCompleted = false;

/* -----------------------------
   INIT / CATEGORY SWITCH
--------------------------------*/
function setCategory(newCat, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker) {
  category = newCat;
  // shallow copy so we can shuffle without affecting bank
  waveforms = [...waveformBank[category]];
  shuffleArray(waveforms);
  initQuiz(resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx);
  categoryLabel.textContent = ` | Category: ${category[0].toUpperCase()+category.slice(1)}`;
  // update chips UI
  [...categoryPicker.querySelectorAll('.chip')].forEach(ch=>{
    ch.classList.toggle('active', ch.dataset.category===category);
  });
}

/* -----------------------------
   QUIZ FLOW
--------------------------------*/
function initQuiz(resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx) {
  currentQuestion = 0;
  score = 0;
  selectedOption = null;
  quizCompleted = false;

  document.querySelector('.quiz-container').style.display = 'block';
  resultsContainer.style.display = 'none';
  waveInfo.style.display = 'none';
  submitBtn.style.display = 'block';
  nextBtn.style.display = 'none';

  loadQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx);
}

function loadQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx) {
  resetOptions(optionsContainer, submitBtn);
  waveInfo.style.display = 'none';

  const progress = (currentQuestion / waveforms.length) * 100;
  progressBar.style.width = `${progress}%`;

  currentQuestionElement.textContent = currentQuestion + 1;
  totalQuestionsElement.textContent = waveforms.length;
  totalQuestionsResult.textContent = waveforms.length;

  const waveform = waveforms[currentQuestion];

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

function submitAnswer(waveDescription, waveInfo, submitBtn, nextBtn) {
  if (selectedOption === null) return;

  const correctAnswer = waveforms[currentQuestion].name;
  const options = document.querySelectorAll('.option');

  options.forEach(opt => { opt.style.pointerEvents = 'none'; });

  options.forEach(opt => {
    if (opt.textContent === correctAnswer) {
      opt.classList.add('correct');
    } else if (opt.textContent === selectedOption) {
      opt.classList.add('incorrect');
    }
  });

  if (selectedOption === correctAnswer) score++;

  waveDescription.textContent = waveforms[currentQuestion].description;
  waveInfo.style.display = 'block';

  submitBtn.style.display = 'none';
  nextBtn.style.display = 'block';
}

function nextQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, nextBtn) {
  nextBtn.style.display = 'none';
  currentQuestion++;
  if (currentQuestion < waveforms.length) {
    loadQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx);
  } else {
    showResults();
  }
}

function showResults() {
  quizCompleted = true;
  document.querySelector('.quiz-container').style.display = 'none';
  resultsContainer.style.display = 'block';

  scoreValue.textContent = score;
  totalQuestionsResult.textContent = waveforms.length;

  const percentage = (score / waveforms.length) * 100;
  performanceMessage.textContent =
    percentage >= 90 ? "Excellent! You’re sharp."
    : percentage >= 70 ? "Solid work—keep drilling."
    : percentage >= 50 ? "Not bad—review key features and try again."
    : "Keep practicing—focus on core features of each pattern.";
}

/* -----------------------------
   CANVAS DRAWING
--------------------------------*/
function drawWaveform(waveform, waveformCanvas, ctx) {
  const width = waveformCanvas.width = waveformCanvas.offsetWidth;
  const height = waveformCanvas.height = waveformCanvas.offsetHeight;

  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;

  ctx.beginPath();
  waveform.draw(ctx, width, height);
  ctx.stroke();
}

/* --- existing abnormal renderers from your version --- */
function drawSpikeAndWave(width, height) {
  const centerY = height/2, points = 200, spikeInterval = width/3;
  for (let i=0;i<points;i++){
    const x = (i/points)*width;
    const spikePos = Math.floor(x/spikeInterval);
    const rx = x - spikePos*spikeInterval;
    let y;
    if (rx < spikeInterval*0.2) y = centerY - (rx/(spikeInterval*0.2))*40;
    else if (rx < spikeInterval*0.4) y = centerY - 40 + ((rx-spikeInterval*0.2)/(spikeInterval*0.2))*80;
    else y = centerY + 40*Math.sin((rx - spikeInterval*0.4)/(spikeInterval*0.6)*Math.PI*2);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

function drawPolyspikeWaves(width, height) {
  const centerY = height/2, points = 200, waveInterval = width/2;
  for (let i=0;i<points;i++){
    const x = (i/points)*width;
    const wavePos = Math.floor(x/waveInterval);
    const rx = x - wavePos*waveInterval;
    let y;
    if (rx < waveInterval*0.3){
      const spikeCount = 3;
      const sw = waveInterval*0.3/spikeCount;
      const si = Math.floor(rx/sw);
      const srx = rx - si*sw;
      if (srx < sw*0.3) y = centerY - (srx/(sw*0.3))*50;
      else if (srx < sw*0.6) y = centerY - 50 + ((srx - sw*0.3)/(sw*0.3))*100;
      else y = centerY + 50*(srx - sw*0.6)/(sw*0.4);
    } else {
      y = centerY + 40*Math.sin((rx - waveInterval*0.3)/(waveInterval*0.7)*Math.PI*2);
    }
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawRandomSpikes(width, height, spikeCount, maxAmp){
  const centerY = height/2, points=200, intv = width/spikeCount;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y=centerY + (Math.random()-0.5)*10;
    if (rx<intv*0.2){ const h=maxAmp*(0.5+Math.random()*0.5); y -= (rx/(intv*0.2))*h;}
    else if (rx<intv*0.4){ const h=maxAmp*(0.5+Math.random()*0.5); y -= h - ((rx-intv*0.2)/(intv*0.2))*h*2;}
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawChaoticPattern(width, height){
  const centerY = height/2, points=200;
  for (let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 60*Math.sin(x/width*Math.PI*8);
    if (Math.random()<0.1) y -= 30 + Math.random()*40;
    y += (Math.random()-0.5)*40;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawSlowSpikeAndWave(width, height){
  const centerY=height/2, points=200, intv=width/2;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y;
    if (rx<intv*0.3) y = centerY - (rx/(intv*0.3))*40;
    else if (rx<intv*0.5) y = centerY - 40 + ((rx-intv*0.3)/(intv*0.2))*80;
    else y = centerY + 40*Math.sin((rx-intv*0.5)/(intv*0.5)*Math.PI);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawFastActivity(width, height){
  const centerY=height/2, points=200;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 30*Math.sin(x/width*Math.PI*30);
    if (x>width*0.2 && x<width*0.4) y += 20*Math.sin(x/width*Math.PI*40);
    if (x>width*0.6 && x<width*0.8) y += 20*Math.sin(x/width*Math.PI*40);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawPhoticResponsePattern(width, height){
  const centerY=height/2, points=200;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 10*Math.sin(x/width*Math.PI*15);
    if (x>width*0.3 && x<width*0.7){
      const flashF=10, flashIntv = width/flashF;
      const flashPos = Math.floor((x-width*0.3)/flashIntv);
      const rx = (x-width*0.3)-flashPos*flashIntv;
      if (rx < flashIntv*0.2) y -= 50*(rx/(flashIntv*0.2));
      else if (rx < flashIntv*0.4) y -= 50 - 50*((rx-flashIntv*0.2)/(flashIntv*0.2));
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawFocalSharpWaves(width, height, focusX){
  const centerY=height/2, points=200;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    y += 10*Math.sin(x/width*Math.PI*10);
    const d = Math.abs(x - focusX);
    if (d < width*0.2){
      const f = 1 - d/(width*0.2);
      y -= 40*f*Math.sin(x/width*Math.PI*5);
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawDipoleSpikes(width, height){
  const centerY=height/2, points=200, intv=width/3;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y=centerY;
    if (rx<intv*0.3) y -= (rx/(intv*0.3))*60;
    else if (rx<intv*0.6) y -= 60 - ((rx-intv*0.3)/(intv*0.3))*120;
    else y += 60*(rx - intv*0.6)/(intv*0.4);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawPeriodicDischarges(width, height){
  const centerY=height/2, points=200, intv=width/4;
  for(let i=0;i<points;i++){
    const x=(i/points)*width, pos=Math.floor(x/intv), rx=x-pos*intv;
    let y=centerY + 5*Math.sin(x/width*Math.PI*8);
    if (rx<intv*0.2) y -= 50*(rx/(intv*0.2));
    else if (rx<intv*0.4) y -= 50 - 50*((rx-intv*0.2)/(intv*0.2));
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

/* --- NEW normal/sleep renderers --- */
function drawAlpha(ctx, width, height){
  const centerY=height/2, points=600; // finer for smooth alpha
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    const envelope = 1 - 0.2*Math.cos(2*Math.PI*x/width); // slight posterior dominance feel
    const y = centerY + 20*envelope*Math.sin(2*Math.PI*10*x/width); // ~10Hz vis
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawBeta(ctx, width, height){
  const centerY=height/2, points=600;
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    const y = centerY + 6*Math.sin(2*Math.PI*25*x/width) + (Math.random()-0.5)*2;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawMu(ctx, width, height){
  const centerY=height/2, points=600;
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    // arciform, comb-like with flat tops
    const base = Math.sin(2*Math.PI*9*x/width);
    const shaped = Math.sign(base)*Math.pow(Math.abs(base),0.4); // flatten peaks
    const y = centerY + 14*shaped;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawSpindle(ctx, width, height){
  const centerY=height/2, points=800;
  const start=width*0.25, end=width*0.75;
  for(let i=0;i<points;i++){
    const x=(i/points)*width;
    const t = (x - (start+end)/2)/( (end-start)/2 );
    const envelope = Math.max(0, 1 - t*t); // simple triangular/gaussian-ish
    const y = centerY + 10*envelope*Math.sin(2*Math.PI*13*x/width);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawKComplex(ctx, width, height){
  const centerY=height/2, points=400;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    // negative sharp then positive slow
    if (x>width*0.45 && x<width*0.5){
      const rx = (x - width*0.45)/(width*0.05);
      y -= 60*rx; // sharp negative
    } else if (x>=width*0.5 && x<width*0.65){
      const rx = (x - width*0.5)/(width*0.15);
      y += 60*rx; // slow positive
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawVertex(ctx, width, height){
  const centerY=height/2, points=400;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    if (x>width*0.48 && x<width*0.52){
      const rx = (x - width*0.48)/(width*0.04);
      // narrow, symmetric sharp wave
      y -= 70*Math.sin(Math.PI*rx);
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}
function drawPOSTS(ctx, width, height){
  const centerY=height/2, points=600, occStart=width*0.35, occEnd=width*0.75;
  for(let i=0;i<points;i++){
    const x=(i/points)*width; let y=centerY;
    if (x>occStart && x<occEnd){
      // intermittent positive sharp transients
      if (Math.sin(2*Math.PI*3*x/width) > 0.95){
        y += 25; // positive deflection
      }
    }
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
}

/* -----------------------------
   HELPERS
--------------------------------*/
function getShuffledOptions(correct){
  // Pull names from the active category set
  const names = waveforms.map(w=>w.name);
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
function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

function selectOption(el, option, submitBtn){
  if (quizCompleted) return;
  document.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  selectedOption = option;
  submitBtn.disabled = false;
}

function resetOptions(optionsContainer, submitBtn){
  optionsContainer.innerHTML = '';
  selectedOption = null;
  submitBtn.disabled = true;
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
    nextBtn.addEventListener('click', () => nextQuestion(optionsContainer, submitBtn, waveInfo, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, nextBtn));
    restartBtn.addEventListener('click', ()=> setCategory(category, resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker));

    /* -----------------------------
       START
    --------------------------------*/
    setCategory('normal', resultsContainer, waveInfo, submitBtn, nextBtn, optionsContainer, progressBar, currentQuestionElement, totalQuestionsElement, totalQuestionsResult, waveformCanvas, ctx, categoryLabel, categoryPicker); // default

});


