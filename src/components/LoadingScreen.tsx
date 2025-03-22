import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, Text, MeshDistortMaterial } from '@react-three/drei';
import { Howl } from 'howler';

// Sound effects with additional cues
const soundEffects = {
  hover: new Howl({ src: ['https://assets.codepen.io/439000/hover.mp3'], volume: 0.1 }),
  success: new Howl({ src: ['https://assets.codepen.io/439000/success.mp3'], volume: 0.2 }),
  ambient: new Howl({
    src: ['https://assets.codepen.io/439000/ambient.mp3'],
    volume: 0.05,
    loop: true
  }),
  phaseChange: new Howl({ src: ['https://assets.codepen.io/439000/phaseChange.mp3'], volume: 0.1 }),
  progressTick: new Howl({ src: ['https://assets.codepen.io/439000/progressTick.mp3'], volume: 0.05 })
};

// Loading phases with narrative elements
const phases = [
  'INITIALIZING SYSTEMS...',
  'LOADING NEURAL NETWORKS...',
  'CALIBRATING QUANTUM MATRIX...',
  'ESTABLISHING SECURE CONNECTION...',
  'SYNCHRONIZING DATA STREAMS...'
];

function LoadingText() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Text
        fontSize={0.5}
        color="#9333EA"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
        font="/fonts/cyberpunk.woff"
        material-toneMapped={false}
      >
        INITIALIZING...
        <meshStandardMaterial
          color="#9333EA"
          emissive="#9333EA"
          emissiveIntensity={2}
        />
      </Text>
      <mesh position={[0, 0, -1]} scale={[4, 1, 1]}>
        <planeGeometry />
        <MeshDistortMaterial
          color="#9333EA"
          speed={5}
          distort={0.5}
          radius={1}
        />
      </mesh>
    </Canvas>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="relative w-64 h-2 bg-purple-900/30 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600"
        initial={{ x: '-100%' }}
        animate={{ x: `${progress - 100}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      {/* Glow effect */}
      <div className="absolute inset-0 bg-purple-500/20 blur-sm" />
      {/* Scanning line */}
      <motion.div
        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

function GlitchText({ text }) {
  const [glitchText, setGlitchText] = useState(text);
  
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    let interval;

    const startGlitch = () => {
      let iterations = 0;
      const maxIterations = 3;
      
      interval = setInterval(() => {
        setGlitchText(
          text
            .split('')
            .map((char, index) => {
              if (index < iterations) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        
        iterations += 1/3;
        
        if (iterations >= maxIterations) {
          clearInterval(interval);
          setTimeout(startGlitch, Math.random() * 2000 + 1000);
        }
      }, 50);
    };
    
    startGlitch();
    return () => clearInterval(interval);
  }, [text]);
  
  return (
    <span className="font-mono tracking-wider">{glitchText}</span>
  );
}

function HexagonGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div className="relative w-full h-full">
        {Array.from({ length: 20 }).map((_, i) => (
          Array.from({ length: 20 }).map((_, j) => (
            <motion.div
              key={`${i}-${j}`}
              className="absolute w-16 h-16 border-2 border-purple-500/30"
              style={{
                left: `${j * 60}px`,
                top: `${i * 60}px`,
                transform: 'rotate(45deg)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                delay: (i + j) * 0.05,
                ease: "easeOut"
              }}
            />
          ))
        ))}
      </div>
    </div>
  );
}

function LoadingCube() {
  return (
    <div className="w-32 h-32 relative">
      <motion.div
        className="absolute inset-0 border-4 border-purple-500"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-2 border-4 border-purple-400"
        animate={{
          rotate: [360, 270, 180, 90, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-4 border-4 border-purple-300"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    soundEffects.ambient.play();
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            soundEffects.success.play();
            soundEffects.ambient.fade(0.05, 0, 1000);
            setTimeout(() => {
              soundEffects.ambient.stop();
              onComplete();
            }, 1000);
          }, 500);
          return 100;
        }
        if (prev % 10 === 0) soundEffects.progressTick.play();
        return prev + 1;
      });
    }, 50);
    
    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => {
        const nextPhase = (prev + 1) % phases.length;
        soundEffects.phaseChange.play();
        return nextPhase;
      });
    }, 2000);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <HexagonGrid />
      
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="w-64 h-64 flex items-center justify-center">
          <LoadingCube />
        </div>
        
        <div className="h-40 w-full">
          <LoadingText />
        </div>
        
        <div className="text-purple-400 text-xl font-mono mb-4">
          <GlitchText text={phases[loadingPhase]} />
        </div>
        
        <ProgressBar progress={progress} />
        
        <div className="text-purple-400 font-mono">
          {progress}% COMPLETE
        </div>
        
        {/* Cyber circuits animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-circuit-pattern" />
        </motion.div>
        
        {/* Pulse rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-purple-500/20"
              initial={{ width: 100, height: 100, opacity: 0.5 }}
              animate={{
                width: [100, 500],
                height: [100, 500],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 4,
                delay: i * 0.8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Mouse-following glow effect */}
        <motion.div
          className="absolute w-20 h-20 bg-purple-500/20 rounded-full blur-xl pointer-events-none"
          style={{
            left: mousePosition.x - 40,
            top: mousePosition.y - 40,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}