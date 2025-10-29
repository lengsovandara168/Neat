"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, PartyPopper, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });
      const audioContext = new AudioContext();
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
    if (microphoneRef.current && microphoneRef.current.mediaStream) {
      microphoneRef.current.mediaStream
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
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

      // Realistic blow threshold - adjust for sensitivity
      const blowThreshold = 35;
      const currentTime = Date.now();

      if (
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
    }
  }, [allCandlesOut, hasBlownCandles]);

  const blowCandle = (index: number) => {
    if (candlesLit[index]) {
      const newCandles = [...candlesLit];
      newCandles[index] = false;
      setCandlesLit(newCandles);
    }
  };

  const relightCandles = () => {
    setCandlesLit([true]); // Relight one candle
    setShowCelebration(false);
    setHasBlownCandles(false);
    if (isListening) {
      stopListening();
    }
  };

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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Make a Wish! 🎂
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
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
              <p className="text-sm text-gray-400 mb-2">
                💨 Take a deep breath and blow steadily!
              </p>
              <div className="relative">
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  <motion.div
                    className={`h-full transition-colors duration-300 ${
                      audioLevel > 35
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
                <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-yellow-400 opacity-50">
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Volume: {Math.round(audioLevel)}</span>
                <span
                  className={audioLevel > 35 ? "text-green-400 font-bold" : ""}
                >
                  {audioLevel > 35 ? "🔥 Blowing!" : "Blow harder →"}
                </span>
              </div>
            </motion.div>
          )}
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
                      scale: [1, 1.02, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.8, repeat: Infinity }}
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
                      scale: [1, 1.03, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.7, repeat: Infinity }}
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
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0,
                      y: -30,
                      x: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 0.4 }}
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
                        scale: [1, 1.1, 1],
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{ transformOrigin: "200px 175px" }}
                    />

                    {/* Inner flame */}
                    <motion.ellipse
                      cx="200"
                      cy="175"
                      rx="8"
                      ry="15"
                      fill="url(#flameGradient2)"
                      animate={{
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                      }}
                    />
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
