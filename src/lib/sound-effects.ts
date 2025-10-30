"use client";

/**
 * Sound effects utility using Web Audio API
 * Generates synthetic sounds without external audio files
 */

class SoundEffects {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
  }

  /**
   * Play a blow/whoosh sound effect
   */
  playBlow() {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create noise for whoosh effect
    const bufferSize = ctx.sampleRate * 0.3; // 300ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Create filter for wind-like sound
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    // Volume envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); // Decay

    // Connect nodes
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Play
    noise.start(now);
    noise.stop(now + 0.3);
  }

  /**
   * Play a celebration sound effect
   */
  playCelebration() {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create ascending notes for celebration
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const noteDuration = 0.15;

    notes.forEach((frequency, index) => {
      const startTime = now + index * noteDuration;

      // Oscillator for the note
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, startTime);

      // Add some vibrato
      const vibrato = ctx.createOscillator();
      vibrato.frequency.value = 5;
      const vibratoGain = ctx.createGain();
      vibratoGain.gain.value = 10;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      // Volume envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      // Connect and play
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      vibrato.start(startTime);
      osc.stop(startTime + noteDuration);
      vibrato.stop(startTime + noteDuration);
    });

    // Add sparkle effect at the end
    const sparkleTime = now + notes.length * noteDuration;
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 2000 + Math.random() * 1000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, sparkleTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        sparkleTime + i * 0.05 + 0.2
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(sparkleTime + i * 0.05);
      osc.stop(sparkleTime + i * 0.05 + 0.2);
    }
  }
}

// Export singleton instance
let soundEffects: SoundEffects | null = null;

export function getSoundEffects(): SoundEffects {
  if (!soundEffects && typeof window !== "undefined") {
    soundEffects = new SoundEffects();
  }
  return soundEffects!;
}
