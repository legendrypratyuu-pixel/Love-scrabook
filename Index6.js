import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeartMusicSection = ({ message, photoSrc }) => {
  const [hearts, setHearts] = useState([]);
  const musicRef = useRef(null);

  // Spawn hearts in sync with music
  useEffect(() => {
    if (!musicRef.current) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioSrc = audioCtx.createMediaElementSource(musicRef.current);
    const analyser = audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animateHearts = () => {
      requestAnimationFrame(animateHearts);
      analyser.getByteFrequencyData(dataArray);

      const avg = dataArray.reduce((a, b) => a + b) / bufferLength;

      // Threshold to spawn hearts
      if (avg > 100) {
        setHearts(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            left: Math.random() * 80 + 10,
            size: Math.random() * 20 + 15,
            sizeScale: 0.8 + Math.random() * 0.6,
            sway: Math.random() * 10 + 5,
            rotateAngle: Math.random() * 15 + 5,
            color: ['#e91e63', '#ff4081', '#ff80ab', '#f48fb1', '#f06292'][Math.floor(Math.random() * 5)]
          }
        ]);
      }
    };

    animateHearts();

    return () => {
      audioCtx.close();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg bg-pink-50 overflow-hidden">
      {/* Display photo */}
      {photoSrc && (
        <img src={photoSrc} alt="Your memory" className="w-64 h-64 object-cover rounded-lg mb-4 shadow-md" />
      )}

      {/* Your message */}
      <p className="text-center text-2xl font-semibold text-pink-600 mb-4">{message}</p>

      {/* Music player */}
      <audio ref={musicRef} controls className="mb-4 w-full">
        Your browser does not support the audio element.
      </audio>

      {/* Heart shower */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.span
            key={h.id}
            initial={{ opacity: 0, y: 0, scale: 0.8, rotate: 0 }}
            animate={{
              opacity: 1,
              y: -120,
              scale: h.sizeScale,
              rotate: [0, h.rotateAngle, -h.rotateAngle, 0],
              x: [0, h.sway, -h.sway, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2 + Math.random(),
              ease: 'easeOut',
              rotate: { repeat: Infinity, repeatType: 'loop', duration: 2 + Math.random() },
              x: { repeat: Infinity, repeatType: 'loop', duration: 2 + Math.random() }
            }}
            style={{
              position: 'absolute',
              left: `${h.left}%`,
              bottom: 10,
              fontSize: h.size,
              color: h.color,
            }}
          >
            ❤️
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HeartMusicSection;
