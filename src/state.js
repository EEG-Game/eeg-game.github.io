export let state = {
    selectedOption:  null,
    currentQuestion: 0,
    score: 0,
    quizCompleted: false,
    category: "normal",
    waveforms: [], // active list for current category
    ui: {} // runtime DOM references
};
