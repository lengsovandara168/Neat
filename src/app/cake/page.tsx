"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, PartyPopper, Mic, MicOff, Music, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/ui/confetti";
import { getSoundEffects } from "@/lib/sound-effects";

// Seeded random for consistent particles
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function CakePage() {
  const [candlesLit, setCandlesLit] = useState([true]); // Just one candle
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasBlownCandles, setHasBlownCandles] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [flameIntensity, setFlameIntensity] = useState(1); // 1 = full flame, 0 = extinguished
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastCelebrateRef = useRef<number>(0);
  const musicTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      initialX: seededRandom(i * 123) * dimensions.width,
      initialY: seededRandom(i * 456) * dimensions.height,
      targetX: seededRandom(i * 789) * dimensions.width,
      targetY: seededRandom(i * 321) * dimensions.height,
      duration: seededRandom(i * 654) * 10 + 10,
    }));
  }, [dimensions]);

  const sprinkles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      color: ["#ff6b9d", "#c44569", "#ffa502", "#5f27cd"][i % 4],
      left: seededRandom(i * 111) * 100,
      top: seededRandom(i * 222) * 100,
    }));
  }, []);

  const allCandlesOut = candlesLit.every((lit) => !lit);

  // Voice/Audio detection setup
  const startListening = async () => {
    try {
      // Avoid creating multiple AudioContexts (can happen in React StrictMode/Turbopack fast refresh)
      if (
        isListening ||
        (audioContextRef.current && audioContextRef.current.state !== "closed")
      ) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });
      // Prefer vendor-prefixed AudioContext if needed (Safari)
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext ||
        AudioContext;
      const audioContext = new AudioCtx();
      if (audioContext.state === "suspended") {
        // Attempt to resume immediately after user gesture
        try {
          await audioContext.resume();
        } catch {
          // ignore
        }
      }
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.smoothingTimeConstant = 0.3; // More responsive
      analyser.fftSize = 512; // Faster processing

      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;

      setIsListening(true);
      detectBlow();
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Please allow microphone access to blow candles with your voice!");
    }
  };

  const stopListening = () => {
    // Stop mic tracks safely (idempotent)
    try {
      if (microphoneRef.current && microphoneRef.current.mediaStream) {
        microphoneRef.current.mediaStream.getTracks().forEach((track) => {
          if (track.readyState !== "ended") track.stop();
        });
      }
    } catch {
      // noop
    }

    // Close AudioContext only if not already closed
    try {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    } catch {
      // Some browsers may throw if already closed; ignore
    } finally {
      audioContextRef.current = null;
    }

    // Cancel animation frame if scheduled
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    analyserRef.current = null;
    microphoneRef.current = null;
    setIsListening(false);
    setAudioLevel(0);
  };

  const detectBlow = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let lastBlowTime = 0;
    const blowCooldown = 800; // milliseconds between blows

    const checkAudio = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Focus on lower frequencies (where breath/wind sounds are)
      const breathFreqRange = dataArray.slice(0, 50);
      const breathLevel =
        breathFreqRange.reduce((a, b) => a + b) / breathFreqRange.length;

      // Calculate overall volume
      const overallVolume = dataArray.reduce((a, b) => a + b) / bufferLength;

      // Combine both for better blow detection
      const blowScore = breathLevel * 0.7 + overallVolume * 0.3;

      setAudioLevel(blowScore);

      // Update flame intensity based on blow strength
      if (candlesLit[0]) {
        if (blowScore > 20) {
          // Fade flame as blowing increases
          const fadeAmount = Math.min((blowScore - 20) / 50, 1); // 0 to 1
          setFlameIntensity(1 - fadeAmount * 0.8); // reduce to 20% at max
        } else {
          // Restore flame when not blowing
          setFlameIntensity(Math.min(flameIntensity + 0.05, 1));
        }
      }

      // Realistic blow threshold - adjust for sensitivity
      const blowThreshold = 35;
      const celebrateThreshold = 70; // strong blow -> celebrate immediately
      const currentTime = Date.now();

      // High blow celebration shortcut
      if (
        blowScore > celebrateThreshold &&
        currentTime - lastCelebrateRef.current > 1200
      ) {
        lastCelebrateRef.current = currentTime;
        // Ensure candle is out and trigger celebration
        setCandlesLit([false]);
        setShowCelebration(true);
        setHasBlownCandles(true);
        stopListening();
      } else if (
        blowScore > blowThreshold &&
        currentTime - lastBlowTime > blowCooldown
      ) {
        lastBlowTime = currentTime;

        // Blow detected! Extinguish candles from left to right (more natural)
        const litIndices = candlesLit
          .map((lit, index) => (lit ? index : -1))
          .filter((index) => index !== -1);

        if (litIndices.length > 0) {
          // Blow out the leftmost candle for natural progression
          blowCandle(litIndices[0]);
        }
      }

      animationFrameRef.current = requestAnimationFrame(checkAudio);
    };

    checkAudio();
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (allCandlesOut && !hasBlownCandles) {
      setHasBlownCandles(true);
      setShowCelebration(true);
      stopListening();

      // Play celebration sound effect
      setTimeout(() => {
        try {
          getSoundEffects().playCelebration();
        } catch (error) {
          console.error("Failed to play celebration sound:", error);
        }
      }, 200); // Small delay for modal animation
    }
  }, [allCandlesOut, hasBlownCandles]);

  const blowCandle = (index: number) => {
    if (candlesLit[index]) {
      const newCandles = [...candlesLit];
      newCandles[index] = false;
      setCandlesLit(newCandles);
      setFlameIntensity(0);

      // Play blow sound effect
      try {
        getSoundEffects().playBlow();
      } catch (error) {
        console.error("Failed to play blow sound:", error);
      }
    }
  };

  const relightCandles = () => {
    setCandlesLit([true]); // Relight one candle
    setShowCelebration(false);
    setHasBlownCandles(false);
    setFlameIntensity(1);
    if (isListening) {
      stopListening();
    }
    stopMusic();
  };

  const playHappyBirthdaySong = () => {
    if (typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const audioContext = new AudioCtx();
      const now = audioContext.currentTime;

      // Happy Birthday melody notes (in Hz)
      // "Happy birthday to you" twice, "Happy birthday dear [name]", "Happy birthday to you"
      const melody = [
        // Happy birth-day to you
        { note: 262, duration: 0.4 }, // C4 - Hap
        { note: 262, duration: 0.2 }, // C4 - py
        { note: 294, duration: 0.6 }, // D4 - birth
        { note: 262, duration: 0.6 }, // C4 - day
        { note: 349, duration: 0.6 }, // F4 - to
        { note: 330, duration: 1.2 }, // E4 - you

        // Happy birth-day to you
        { note: 262, duration: 0.4 }, // C4
        { note: 262, duration: 0.2 }, // C4
        { note: 294, duration: 0.6 }, // D4
        { note: 262, duration: 0.6 }, // C4
        { note: 392, duration: 0.6 }, // G4
        { note: 349, duration: 1.2 }, // F4

        // Happy birth-day dear [name]
        { note: 262, duration: 0.4 }, // C4
        { note: 262, duration: 0.2 }, // C4
        { note: 523, duration: 0.6 }, // C5
        { note: 440, duration: 0.6 }, // A4
        { note: 349, duration: 0.6 }, // F4
        { note: 330, duration: 0.6 }, // E4
        { note: 294, duration: 1.2 }, // D4

        // Happy birth-day to you
        { note: 466, duration: 0.4 }, // Bb4
        { note: 466, duration: 0.2 }, // Bb4
        { note: 440, duration: 0.6 }, // A4
        { note: 349, duration: 0.6 }, // F4
        { note: 392, duration: 0.6 }, // G4
        { note: 349, duration: 1.2 }, // F4
      ];

      let currentTime = now + 0.1;

      melody.forEach((noteData) => {
        // Create oscillator for melody
        const osc = audioContext.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(noteData.note, currentTime);

        // Create gain for envelope
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0, currentTime);
        gain.gain.linearRampToValueAtTime(0.3, currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, currentTime + noteData.duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, currentTime + noteData.duration);

        // Connect nodes
        osc.connect(gain);
        gain.connect(audioContext.destination);

        // Play note
        osc.start(currentTime);
        osc.stop(currentTime + noteData.duration);

        currentTime += noteData.duration;
      });

      setIsMusicPlaying(true);

      // Stop music playing state after song finishes
      const songDuration = melody.reduce((sum, note) => sum + note.duration, 0) * 1000;
      musicTimeoutRef.current = setTimeout(() => {
        setIsMusicPlaying(false);
      }, songDuration);
    } catch (error) {
      console.error("Failed to play Happy Birthday song:", error);
    }
  };

  const stopMusic = () => {
    if (musicTimeoutRef.current) {
      clearTimeout(musicTimeoutRef.current);
      musicTimeoutRef.current = null;
    }
    setIsMusicPlaying(false);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      playHappyBirthdaySong();
    }
  };

  // Auto-play music when celebration starts
  useEffect(() => {
    if (showCelebration && !isMusicPlaying) {
      // Small delay before auto-playing
      const timer = setTimeout(() => {
        playHappyBirthdaySong();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCelebration]);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-950 via-purple-950 to-indigo-950 text-white overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-pink-400/30 rounded-full"
            initial={{
              x: particle.initialX,
              y: particle.initialY,
            }}
            animate={{
              y: particle.targetY,
              x: particle.targetX,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Music Control Button */}
      <motion.div 
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 group"
          aria-label={isMusicPlaying ? "Pause music" : "Play music"}
        >
          {isMusicPlaying ? (
            <>
              <Pause className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">Playing...</span>
            </>
          ) : (
            <>
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Play Song</span>
            </>
          )}
        </button>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Header - Fluid Glass */}
        <motion.div
          className="relative mb-12 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative max-w-3xl mx-auto overflow-hidden rounded-3xl border border-white/15 bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-xl">
            {/* Fluid gradient blobs (background) */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-16 -left-12 w-64 h-64 rounded-full bg-pink-500/30 blur-3xl"
              animate={{ x: [0, 20, -10, 0], y: [0, 10, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 rounded-full bg-purple-500/30 blur-3xl"
              animate={{ x: [0, -25, 10, 0], y: [0, -15, 25, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl"
              animate={{ scale: [0.9, 1.1, 0.95, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Content */}
            <div className="relative z-10 px-6 py-8 md:px-10 md:py-12 text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Make a Wish! 🎂
              </h1>
              <p className="text-xl text-gray-800/80 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                Click on the candle or use your voice to blow it out!
              </p>

              {/* Voice Control Toggle */}
              <div className="flex justify-center gap-4 mb-4">
                {!isListening ? (
                  <motion.button
                    onClick={startListening}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-purple-500 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic className="w-5 h-5" />
                    Enable Voice Blowing
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={stopListening}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <MicOff className="w-5 h-5" />
                    Stop Listening
                  </motion.button>
                )}
              </div>

              {/* Audio Level Indicator */}
              {isListening && (
                <motion.div
                  className="max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm text-gray-700/80 dark:text-gray-400 mb-2">
                    💨 Take a deep breath and blow steadily!
                  </p>
                  <div className="relative">
                    <div className="w-full h-4 bg-black/20 dark:bg-gray-800 rounded-full overflow-hidden border border-white/20 dark:border-gray-700">
                      <motion.div
                        className={`h-full transition-colors duration-300 ${
                          audioLevel > 70
                            ? "bg-linear-to-r from-yellow-400 via-pink-500 to-purple-600"
                            : audioLevel > 35
                            ? "bg-linear-to-r from-green-500 to-emerald-500"
                            : "bg-linear-to-r from-pink-500 to-purple-500"
                        }`}
                        style={{
                          width: `${Math.min((audioLevel / 100) * 100, 100)}%`,
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    {/* Threshold indicator */}
                    <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-yellow-400/70 opacity-70">
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full" />
                    </div>
                    {/* Celebrate indicator */}
                    <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-pink-400/80 opacity-80">
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-pink-400 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-700/80 dark:text-gray-500 mt-1">
                    <span>Volume: {Math.round(audioLevel)}</span>
                    <span
                      className={
                        audioLevel > 70
                          ? "text-pink-300 font-bold"
                          : audioLevel > 35
                          ? "text-green-400 font-bold"
                          : ""
                      }
                    >
                      {audioLevel > 100
                        ? "🎉 Celebration!"
                        : audioLevel > 35
                        ? "🔥 Blowing!"
                        : "Blow harder →"}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Subtle glass sheen */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/10 to-transparent" />
          </div>
        </motion.div>

        {/* Birthday Cake SVG */}
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <svg
            width="400"
            height="500"
            viewBox="0 0 400 500"
            className="drop-shadow-2xl"
            onClick={() => blowCandle(0)}
          >
            {/* Cake Plate */}
            <ellipse
              cx="200"
              cy="460"
              rx="180"
              ry="20"
              fill="url(#plateGradient)"
              stroke="#6b7280"
              strokeWidth="2"
            />

            {/* Bottom Cake Layer */}
            <motion.g
              animate={
                allCandlesOut
                  ? {
                      scale: [1, 1.08, 0.98, 1.05, 1],
                      y: [0, -10, 5, -3, 0],
                    }
                  : {}
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.3, 0.5, 0.7, 1],
              }}
              style={{ transformOrigin: "200px 400px" }}
            >
              {/* Base layer */}
              <rect
                x="50"
                y="350"
                width="300"
                height="110"
                rx="15"
                fill="url(#cakeGradient1)"
                stroke="#ec4899"
                strokeWidth="3"
              />

              {/* Decorative ribbon */}
              <rect
                x="50"
                y="395"
                width="300"
                height="25"
                fill="url(#ribbonGradient)"
                opacity="0.9"
              />

              {/* Decorative dots on base */}
              {[...Array(8)].map((_, i) => (
                <circle
                  key={`dot-${i}`}
                  cx={70 + i * 40}
                  cy="435"
                  r="8"
                  fill="#a855f7"
                  opacity="0.8"
                />
              ))}
            </motion.g>

            {/* Top Cake Layer */}
            <motion.g
              animate={
                allCandlesOut
                  ? {
                      scale: [1, 1.12, 0.96, 1.08, 1],
                      y: [0, -15, 8, -5, 0],
                      rotate: [0, -2, 2, -1, 0],
                    }
                  : {}
              }
              transition={{
                duration: 1.0,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
              style={{ transformOrigin: "200px 280px" }}
            >
              {/* Main top layer */}
              <rect
                x="80"
                y="250"
                width="240"
                height="100"
                rx="15"
                fill="url(#cakeGradient2)"
                stroke="#ec4899"
                strokeWidth="3"
              />

              {/* Frosting on top edge */}
              <g>
                {[...Array(12)].map((_, i) => (
                  <motion.ellipse
                    key={`frost-${i}`}
                    cx={90 + i * 20}
                    cy="250"
                    rx="12"
                    ry="10"
                    fill="#ffffff"
                    opacity="0.9"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </g>

              {/* Sprinkles */}
              {sprinkles.slice(0, 15).map((sprinkle) => (
                <motion.rect
                  key={`sprinkle-${sprinkle.id}`}
                  x={80 + sprinkle.left * 2.4}
                  y={260 + sprinkle.top * 0.8}
                  width="3"
                  height="8"
                  rx="1.5"
                  fill={sprinkle.color}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    delay: sprinkle.id * 0.1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    transformOrigin: `${82 + sprinkle.left * 2.4}px ${
                      264 + sprinkle.top * 0.8
                    }px`,
                  }}
                />
              ))}
            </motion.g>

            {/* Candle */}
            <g className="cursor-pointer">
              {/* Candle stick */}
              <rect
                x="185"
                y="200"
                width="30"
                height="50"
                rx="3"
                fill={
                  candlesLit[0]
                    ? "url(#candleGradient)"
                    : "url(#candleGradientOff)"
                }
                stroke={candlesLit[0] ? "#ec4899" : "#6b7280"}
                strokeWidth="2"
              />

              {/* Candle wick */}
              <line
                x1="200"
                y1="200"
                x2="200"
                y2="190"
                stroke="#4b5563"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Flame */}
              <AnimatePresence>
                {candlesLit[0] && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: flameIntensity,
                      scale: flameIntensity,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      y: -30,
                      x: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Outer flame */}
                    <motion.ellipse
                      cx="200"
                      cy="175"
                      rx="15"
                      ry="25"
                      fill="url(#flameGradient1)"
                      filter="url(#flameGlow)"
                      animate={{
                        scale: [1, 1.1 * flameIntensity, 1],
                        y: [0, -2 * flameIntensity, 0],
                        x: flameIntensity < 0.6 ? [0, 5, -5, 0] : [0, 0, 0, 0], // flicker when fading
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        transformOrigin: "200px 175px",
                        opacity: flameIntensity,
                      }}
                    />

                    {/* Inner flame */}
                    <motion.ellipse
                      cx="200"
                      cy="175"
                      rx="8"
                      ry="15"
                      fill="url(#flameGradient2)"
                      animate={{
                        opacity: [
                          0.8 * flameIntensity,
                          1 * flameIntensity,
                          0.8 * flameIntensity,
                        ],
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                      }}
                      style={{ opacity: flameIntensity }}
                    />

                    {/* Flame particles/embers - only visible when flame is lit */}
                    {[0, 1, 2, 3, 4].map((i) => {
                      const baseX = 200;
                      const baseY = 175;
                      const angle = seededRandom(i * 111) * Math.PI * 2;
                      const distance = seededRandom(i * 222) * 15 + 10;
                      const startX = baseX + Math.cos(angle) * (distance / 2);
                      const startY = baseY + Math.sin(angle) * (distance / 2);
                      const endX = baseX + Math.cos(angle) * distance;
                      const endY = baseY - 20 - seededRandom(i * 333) * 15;
                      const delay = seededRandom(i * 444) * 0.5;

                      return (
                        <motion.circle
                          key={i}
                          cx={startX}
                          cy={startY}
                          r="1.5"
                          fill="#fbbf24"
                          filter="url(#flameGlow)"
                          animate={{
                            cx: [startX, endX, startX],
                            cy: [startY, endY, startY],
                            opacity: [0, flameIntensity * 0.8, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5 + seededRandom(i * 555) * 0.5,
                            repeat: Infinity,
                            delay: delay,
                            ease: "easeOut",
                          }}
                          style={{ opacity: flameIntensity > 0.3 ? 1 : 0 }}
                        />
                      );
                    })}
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Smoke when blown */}
              <AnimatePresence>
                {!candlesLit[0] && (
                  <>
                    <motion.circle
                      cx="200"
                      cy="180"
                      r="8"
                      fill="#9ca3af"
                      opacity="0.6"
                      filter="blur(4px)"
                      initial={{ opacity: 0.6, y: 0 }}
                      animate={{ opacity: 0, y: -40, x: [0, -5, 5, 0] }}
                      transition={{ duration: 1.5 }}
                    />
                    <motion.circle
                      cx="200"
                      cy="185"
                      r="5"
                      fill="#d1d5db"
                      opacity="0.4"
                      filter="blur(3px)"
                      initial={{ opacity: 0.4, y: 0 }}
                      animate={{ opacity: 0, y: -35 }}
                      transition={{ duration: 1.2, delay: 0.1 }}
                    />
                  </>
                )}
              </AnimatePresence>
            </g>

            {/* SVG Gradients and Filters */}
            <defs>
              <linearGradient
                id="plateGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>

              <linearGradient
                id="cakeGradient1"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              <linearGradient
                id="cakeGradient2"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="50%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>

              <linearGradient
                id="ribbonGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>

              <linearGradient
                id="candleGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              <linearGradient
                id="candleGradientOff"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>

              <radialGradient id="flameGradient1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </radialGradient>

              <radialGradient id="flameGradient2">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#fbbf24" />
              </radialGradient>

              <filter id="flameGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>

        {/* Instructions */}
        {!allCandlesOut && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-lg text-gray-300 mb-2">
              Candle status:{" "}
              <span className="font-bold text-pink-300">
                {candlesLit.filter(Boolean).length ? "🔥 Lit" : "💨 Blown out"}
              </span>
            </p>
            <p className="text-sm text-gray-400">
              {isListening
                ? "💨 Blow steadily into your microphone to extinguish the candle!"
                : "👆 Click the candle or enable voice mode to blow it out"}
            </p>
            {isListening && (
              <motion.p
                className="text-xs text-purple-400 mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💡 Tip: A steady, continuous blow works best!
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Celebration Message */}
        <AnimatePresence>
          {showCelebration && (
            <>
              {/* Confetti Effect */}
              <Confetti count={80} />

              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-linear-to-br from-pink-500 via-purple-500 to-pink-500 p-12 rounded-3xl shadow-2xl text-center max-w-lg mx-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    <PartyPopper className="w-20 h-20 mx-auto mb-6 text-yellow-300" />
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4 text-white">
                    🎉 Happy Birthday! 🎉
                  </h2>
                  <p className="text-xl text-white/90 mb-6">
                    May all your wishes come true!
                  </p>

                  {/* Music Control Button */}
                  <motion.button
                    onClick={toggleMusic}
                    className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMusicPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        <span>Pause Song</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Play Song</span>
                      </>
                    )}
                  </motion.button>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={relightCandles}
                      className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition"
                    >
                      Blow Again
                    </button>
                    <Link
                      href="/"
                      className="px-6 py-3 bg-purple-700 text-white rounded-full font-bold hover:bg-purple-800 transition"
                    >
                      Back to Party
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
