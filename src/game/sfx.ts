// Lightweight procedural SFX via WebAudio.
// Kept as simple single-oscillator blips — no external audio files.

type Kind = 'shoot' | 'hit' | 'explosion' | 'pickup' | 'repair' | 'alarm' | 'win' | 'stage';

class SFX {
  ctx: AudioContext | null = null;
  muted = false;

  private ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { /* noop */ }
    }
    // User-gesture resume
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  play(kind: Kind) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);

    const tone = (freq: number, dur: number, type: OscillatorType = 'square', vol = 0.2, slideTo?: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + dur);
    };
    const noise = (dur: number, vol = 0.3) => {
      const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = vol;
      src.connect(gain).connect(master);
      src.start(t);
      src.stop(t + dur);
    };

    switch (kind) {
      case 'shoot':    tone(880, 0.06, 'square', 0.15, 440); break;
      case 'hit':      tone(180, 0.08, 'sawtooth', 0.25, 80); break;
      case 'explosion': noise(0.35, 0.4); tone(80, 0.4, 'triangle', 0.25, 30); break;
      case 'pickup':   tone(660, 0.07, 'square', 0.2); setTimeout(() => tone(990, 0.08, 'square', 0.18), 70); break;
      case 'repair':   tone(523, 0.08, 'sine', 0.2); setTimeout(() => tone(784, 0.12, 'sine', 0.2), 80); break;
      case 'alarm':    tone(1200, 0.08, 'square', 0.22, 800); break;
      case 'stage':    tone(440, 0.12, 'square', 0.2); setTimeout(() => tone(660, 0.12, 'square', 0.2), 120); setTimeout(() => tone(880, 0.18, 'square', 0.22), 240); break;
      case 'win':      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle', 0.25), i * 140)); break;
    }
  }
}

export const sfx = new SFX();
