export type SoundPreset =
  | "Default"
  | "Chime"
  | "Click"
  | "Whoosh"
  | "Pop"
  | "None";

export interface SoundConfig {
  preset?: SoundPreset;
  volume?: number;
  openSoundUrl?: string;
  closeSoundUrl?: string;
}

function playAudioUrl(url: string, volume: number) {
  try {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (_) {
    // Audio not available
  }
}

function playDefault(isOpen: boolean, volume: number) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    if (isOpen) {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    }
    osc.onended = () => ctx.close();
  } catch (_) {}
}

function playChime(isOpen: boolean, volume: number) {
  try {
    const ctx = new AudioContext();
    const freqs = isOpen ? [523, 659, 784] : [784, 659, 523];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.1;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(volume * 0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
      osc.onended = () => {
        if (i === freqs.length - 1) ctx.close();
      };
    });
  } catch (_) {}
}

function playClick(volume: number) {
  try {
    const ctx = new AudioContext();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] =
        (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
    }
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    src.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume * 2, ctx.currentTime);
    src.start(ctx.currentTime);
    src.onended = () => ctx.close();
  } catch (_) {}
}

function playWhoosh(isOpen: boolean, volume: number) {
  try {
    const ctx = new AudioContext();
    const dur = 0.3;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    src.buffer = buf;
    filter.type = "bandpass";
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    filter.frequency.setValueAtTime(isOpen ? 200 : 2000, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(
      isOpen ? 2000 : 200,
      ctx.currentTime + dur,
    );
    filter.Q.value = 0.5;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
    src.start(ctx.currentTime);
    src.onended = () => ctx.close();
  } catch (_) {}
}

function playPop(isOpen: boolean, volume: number) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const dur = 0.08;
    osc.frequency.setValueAtTime(isOpen ? 100 : 400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(
      isOpen ? 400 : 100,
      ctx.currentTime + dur,
    );
    gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
    osc.onended = () => ctx.close();
  } catch (_) {}
}

export function usePopupSound(soundConfig?: SoundConfig) {
  const preset = soundConfig?.preset ?? "Default";
  const volume = (soundConfig?.volume ?? 50) / 100;
  const openUrl = soundConfig?.openSoundUrl;
  const closeUrl = soundConfig?.closeSoundUrl;

  function playOpenSound() {
    if (openUrl) {
      playAudioUrl(openUrl, volume);
      return;
    }
    if (preset === "None") return;
    if (preset === "Chime") {
      playChime(true, volume);
      return;
    }
    if (preset === "Click") {
      playClick(volume);
      return;
    }
    if (preset === "Whoosh") {
      playWhoosh(true, volume);
      return;
    }
    if (preset === "Pop") {
      playPop(true, volume);
      return;
    }
    playDefault(true, volume);
  }

  function playCloseSound() {
    if (closeUrl) {
      playAudioUrl(closeUrl, volume);
      return;
    }
    if (preset === "None") return;
    if (preset === "Chime") {
      playChime(false, volume);
      return;
    }
    if (preset === "Click") {
      playClick(volume);
      return;
    }
    if (preset === "Whoosh") {
      playWhoosh(false, volume);
      return;
    }
    if (preset === "Pop") {
      playPop(false, volume);
      return;
    }
    playDefault(false, volume);
  }

  return { playOpenSound, playCloseSound };
}
