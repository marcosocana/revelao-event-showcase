// Copia de los sonidos de tomorrow-snap-reveal/src/lib/carreteo.ts.
// Sonidos sintetizados con Web Audio: sin ficheros que descargar y con
// latencia mínima, lo que importa para que el clic coincida con el gesto.
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext
    ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
};

const noiseBuffer = (context: AudioContext, seconds: number) => {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * seconds), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  return buffer;
};

const click = (
  context: AudioContext,
  at: number,
  { frequency, q, gain, decay, type = "bandpass" }: { frequency: number; q: number; gain: number; decay: number; type?: BiquadFilterType },
) => {
  const source = context.createBufferSource();
  source.buffer = noiseBuffer(context, decay + 0.02);
  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(gain, at + 0.002);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  source.connect(filter).connect(envelope).connect(context.destination);
  source.start(at);
  source.stop(at + decay + 0.02);
};

const thump = (context: AudioContext, at: number, frequency: number, gain: number, decay: number) => {
  const oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, at);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.45, at + decay);
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, at);
  envelope.gain.exponentialRampToValueAtTime(gain, at + 0.003);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  oscillator.connect(envelope).connect(context.destination);
  oscillator.start(at);
  oscillator.stop(at + decay + 0.02);
};

export const unlockCarreteoAudio = () => {
  getAudioContext();
};

/** Diente del trinquete al girar la rueda de arrastre. */
export const playWindTick = () => {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  const detune = 0.85 + Math.random() * 0.3;
  click(context, now, { frequency: 3200 * detune, q: 6, gain: 0.35, decay: 0.018 });
  click(context, now + 0.004, { frequency: 1400 * detune, q: 3, gain: 0.12, decay: 0.025 });
};

/** Tope de la rueda: el carrete queda listo para disparar. */
export const playWindLock = () => {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  click(context, now, { frequency: 2600, q: 4, gain: 0.55, decay: 0.03 });
  click(context, now + 0.035, { frequency: 1800, q: 5, gain: 0.4, decay: 0.035 });
  thump(context, now + 0.035, 220, 0.25, 0.06);
};

/** Obturador de cámara desechable: apertura seca y cierre de la cortinilla. */
export const playShutter = () => {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  click(context, now, { frequency: 4200, q: 1.2, gain: 0.8, decay: 0.035, type: "highpass" });
  thump(context, now, 170, 0.5, 0.08);
  click(context, now + 0.06, { frequency: 2400, q: 2.5, gain: 0.55, decay: 0.045 });
  thump(context, now + 0.06, 120, 0.3, 0.07);
};
