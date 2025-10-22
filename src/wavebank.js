import { 
    drawAlpha, drawBeta, drawMu,
    drawSpindle, drawKComplex, drawVertex,
    drawPOSTS, drawSpikeAndWave, drawPolyspikeWaves,
    drawChaoticPattern, drawSlowSpikeAndWave, drawFastActivity,
    drawPhoticResponsePattern, drawFocalSharpWaves, drawDipoleSpikes,
    drawPeriodicDischarges, drawWaveform, drawRandomSpikes
} from './waves.js';

/* -----------------------------
   DATA: grouped by category
--------------------------------*/
export const waveformBank = {
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


