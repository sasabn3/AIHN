// Futuristic Procedural Audio Synthesizer using Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isInitialized: boolean = false;

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isInitialized = true;
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  public enableAudio() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.startAmbient();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(muted ? 0 : 0.05, this.ctx.currentTime, 0.5);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Subtle ambient cosmic drone
  private startAmbient() {
    if (!this.ctx || this.ambientGain) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A1

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, this.ctx.currentTime); // Low A2

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
    } catch (e) {
      console.warn("Could not start ambient audio", e);
    }
  }

  // Camera transition / warp sound
  public playWarp() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.8);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 1.4);

      filter.frequency.setValueAtTime(300, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.7);
      filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 1.4);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.5);
    } catch (e) {}
  }

  // Futuristic UI interface blip / click
  public playClick(pitch: number = 440) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  }

  // Core pulse resonance
  public playCorePulse() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.4);
    } catch (e) {}
  }

  // Speech output for Nexus Intelligence
  public speak(text: string) {
    if (this.isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      // Try to find an English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    }
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundEngine();
