"use client";

/**
 * Sound effects utility using Web Audio API
 * Generates synthetic sounds without external audio files
 */

class SoundEffects {
  // No-op implementation to disable sounds globally
  // Keeping the class/API to avoid breaking imports/calls.

  /**
   * Play a blow/whoosh sound effect
   */
  playBlow() {
    // intentionally empty
  }

  /**
   * Play a celebration sound effect
   */
  playCelebration() {
    // intentionally empty
  }
}

// Export singleton instance
let soundEffects: SoundEffects | null = null;

export function getSoundEffects(): SoundEffects {
  if (!soundEffects) {
    soundEffects = new SoundEffects();
  }
  return soundEffects;
}
