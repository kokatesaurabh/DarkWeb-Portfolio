import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Stars, Trail, Text, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei';
import { Howl } from 'howler';
import { easing } from 'maath';

// Sound effects with preloading
const soundEffects = {
  rocket: new Howl({
    src: ['https://assets.codepen.io/39255/rocket-thrust.mp3'],
    volume: 0.4,
    loop: true,
    preload: true
  }),
  explosion: new Howl({
    src: ['https://assets.codepen.io/39255/explosion.mp3'],
    volume: 0.3,
    preload: true
  }),
  whoosh: new Howl({
    src: ['https://assets.codepen.io/39255/whoosh.mp3'],
    volume: 0.2,
    preload: true
  }),
  ambient: new Howl({
    src: ['https://assets.codepen.io/39255/space-ambient.mp3'],
    volume: 0.1,
    loop: true,
    preload: true
  }),
  success: new Howl({
    src: ['https://assets.codepen.io/39255/success.mp3'],
    volume: 0.3,
    preload: true
  })
};

// Particle system for space dust
function SpaceDust() {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 500; i++) {
      const x = THREE.MathUtils.randFloatSpread(100);
      const y = THREE.MathUtils.randFloatSpread(100);
      const z = THREE.MathUtils.randFloatSpread(100);
      p.push(new THREE.Vector3(x, y, z));
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.02;
      pointsRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Enhanced rocket model component
function Rocket({ position, rotation, scale, isLaunched, setRocketReachedSpace }) {
  const rocketRef = useRef<THREE.Group>(null);
  const { scene: gltfScene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf');
  const [smokeParticles, setSmokeParticles] = useState<THREE.Mesh[]>([]);
  const smokeGroup = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const engineGlowRef = useRef<THREE.PointLight>(null);
  const { scene, camera } = useThree();

  // Fallback geometry and material in case GLTF fails
  const fallbackGeometry = new THREE.ConeGeometry(0.5, 2, 32);
  const fallbackMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2
  });

  // Create smoke particles with improved visuals
  useEffect(() => {
    if (!smokeGroup.current) return;
    
    const particles: THREE.Mesh[] = [];
    const smokeTexture = new THREE.TextureLoader().load(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    );
    
    const smokeMaterial = new THREE.MeshStandardMaterial({
      map: smokeTexture,
      transparent: true,
      emissive: new THREE.Color(0x9933ff),
      emissiveIntensity: 2,
    });
    
    for (let i = 0; i < 40; i++) {
      const particle = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        smokeMaterial.clone()
      );
      particle.position.set(0, 0, 0);
      particle.rotation.z = Math.random() * Math.PI * 2;
      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05 - 0.1,
          (Math.random() - 0.5) * 0.05
        ),
        size: Math.random() * 2 + 1,
        rotation: Math.random() * 0.1 - 0.05,
        alpha: 1,
        alphaDecay: Math.random() * 0.03 + 0.01,
        colorShift: Math.random() * 0.2
      };
      particle.scale.set(0, 0, 0);
      smokeGroup.current.add(particle);
      particles.push(particle);
    }
    
    setSmokeParticles(particles);
  }, [smokeGroup]);

  // Load flame texture with improved visuals
  const flameTexture = new THREE.TextureLoader().load(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  );

  // Enhanced animation for rocket launch
  useEffect(() => {
    if (!rocketRef.current || !isLaunched) return;
    
    // Start rocket sound
    soundEffects.rocket.play();
    
    // Launch sequence with more dynamic camera work
    const timeline = gsap.timeline({
      onComplete: () => {
        setRocketReachedSpace(true);
        soundEffects.rocket.fade(0.4, 0, 1000);
        setTimeout(() => soundEffects.rocket.stop(), 1000);
        soundEffects.success.play();
      }
    });
    
    // Initial shake with more intensity
    timeline.to(rocketRef.current.position, {
      x: '+=0.08',
      duration: 0.08,
      repeat: 8,
      yoyo: true,
      ease: 'power1.inOut'
    });
    
    // Takeoff with improved easing
    timeline.to(rocketRef.current.position, {
      y: 20,
      duration: 5,
      ease: 'power3.in'
    }, 0.5);
    
    // Camera follows rocket with dynamic movement
    timeline.to(camera.position, {
      y: 12,
      duration: 4.5,
      ease: 'power2.in'
    }, 1);
    
    // Camera shake during liftoff
    timeline.to(camera.position, {
      x: '+=0.03',
      z: '+=0.03',
      duration: 0.05,
      repeat: 20,
      yoyo: true,
      ease: 'none'
    }, 0.5);
    
    // Slight rotation during ascent
    timeline.to(rocketRef.current.rotation, {
      z: Math.PI * 0.05,
      duration: 2,
      ease: 'power1.inOut'
    }, 1);
    
    // Straighten out
    timeline.to(rocketRef.current.rotation, {
      z: 0,
      duration: 1.5,
      ease: 'power1.out'
    }, 3);
    
    // Camera pulls back slightly to show more of the scene
    timeline.to(camera.position, {
      z: 6,
      duration: 2,
      ease: 'power1.inOut'
    }, 3);
    
    return () => {
      timeline.kill();
      soundEffects.rocket.stop();
    };
  }, [isLaunched, camera, setRocketReachedSpace]);

  // Animate smoke particles and flame with improved effects
  useFrame((_, delta) => {
    if (!isLaunched || !smokeGroup.current) return;
    
    smokeParticles.forEach(particle => {
      if (particle.userData.alpha <= 0) {
        // Reset particle with more variation
        particle.position.set(
          (Math.random() - 0.5) * 0.3,
          -0.5,
          (Math.random() - 0.5) * 0.3
        );
        particle.userData.alpha = 1;
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08 - 0.15,
          (Math.random() - 0.5) * 0.08
        );
        particle.userData.colorShift = Math.random() * 0.2;
        particle.scale.set(0, 0, 0);
      }
      
      // Update position with turbulence
      particle.position.add(particle.userData.velocity);
      particle.position.x += Math.sin(Date.now() * 0.001 + particle.position.y) * 0.01;
      
      // Update rotation with variation
      particle.rotation.z += particle.userData.rotation;
      
      // Update alpha
      particle.userData.alpha -= particle.userData.alphaDecay;
      const material = particle.material as THREE.MeshStandardMaterial;
      material.opacity = particle.userData.alpha;
      
      // Update size (grow then shrink) with improved curve
      const sizeFactor = 1 - Math.pow(Math.abs(particle.userData.alpha - 0.5) * 2, 2);
      const size = particle.userData.size * sizeFactor;
      particle.scale.set(size, size, size);
      
      // Update emissive intensity and color based on alpha
      material.emissiveIntensity = 2 * particle.userData.alpha;
      
      // Shift color from purple to orange as particle ages
      const colorMix = particle.userData.alpha * (1 - particle.userData.colorShift);
      material.emissive.setRGB(
        0.6 + (1 - colorMix) * 0.4, // R: increase as alpha decreases
        0.2 + (1 - colorMix) * 0.1, // G: slight increase
        0.6 * colorMix               // B: decrease as alpha decreases
      );
    });

    // Enhanced flame animation
    if (flameRef.current) {
      // Pulsating flame effect
      const pulseScale = 1 + Math.sin(Date.now() * 0.02) * 0.2;
      flameRef.current.scale.y = pulseScale;
      flameRef.current.scale.x = 0.8 + Math.sin(Date.now() * 0.03) * 0.1;
      
      // Rotate flame slightly for more dynamic effect
      flameRef.current.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
    }
    
    // Engine glow pulsation
    if (engineGlowRef.current) {
      engineGlowRef.current.intensity = 2 + Math.sin(Date.now() * 0.02) * 0.5;
    }
    
    // Subtle rocket movement even during flight
    if (rocketRef.current && isLaunched) {
      rocketRef.current.position.x += Math.sin(Date.now() * 0.001) * 0.001;
      rocketRef.current.rotation.z = Math.sin(Date.now() * 0.0005) * 0.02;
    }
  });

  return (
    <group ref={rocketRef} position={position} rotation={rotation} scale={scale}>
      <group ref={smokeGroup} position={[0, -0.5, 0]} />
      
      {/* Multiple trails for more dramatic effect */}
      <Trail
        width={1.2}
        color={'#9933ff'}
        length={10}
        decay={1}
        local={false}
        stride={0}
        interval={1}
        attenuation={(width) => width}
        visible={isLaunched}
      >
        <primitive 
          object={gltfScene || new THREE.Mesh(fallbackGeometry, fallbackMaterial)} 
          scale={0.5}
          rotation={[0, Math.PI, 0]}
        />
      </Trail>
      
      {/* Secondary trail with different color */}
      <Trail
        width={0.8}
        color={'#ff6633'}
        length={6}
        decay={2}
        local={false}
        stride={0}
        interval={1}
        attenuation={(width) => width * 0.5}
        visible={isLaunched}
      >
        <mesh position={[0, -0.6, 0]} scale={[0.1, 0.1, 0.1]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
      
      {/* Enhanced flame effect */}
      <mesh ref={flameRef} position={[0, -0.7, 0]} visible={isLaunched}>
        <coneGeometry args={[0.25, 1.2, 16]} />
        <meshBasicMaterial 
          map={flameTexture} 
          transparent 
          color={0xff9933}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Engine glow */}
      <pointLight 
        ref={engineGlowRef} 
        position={[0, -0.7, 0]} 
        color="#ff6622" 
        intensity={2} 
        distance={3}
        visible={isLaunched}
      />
      
      {/* Sparkles around the engine */}
      <Sparkles 
        count={20} 
        scale={[0.5, 0.5, 0.5]} 
        size={0.4} 
        speed={0.3} 
        position={[0, -0.7, 0]} 
        color="#ff9933"
        visible={isLaunched}
      />
    </group>
  );
}

// Enhanced Planet component
function Planet({ position, rotation, scale }) {
  const planetRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  // Create textures procedurally instead of loading them
  const planetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a gradient for the planet
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, '#6b21a8');
      gradient.addColorStop(0.5, '#4c1d95');
      gradient.addColorStop(1, '#312e81');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add some noise/texture
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 2;
        const alpha = Math.random() * 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  const bumpMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 512, 512);
      
      // Create bump patterns
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 5 + 1;
        const alpha = Math.random() * 0.7 + 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  const atmosphereTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a radial gradient for the atmosphere
      const gradient = ctx.createRadialGradient(256, 256, 200, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(153, 51, 255, 0)');
      gradient.addColorStop(0.7, 'rgba(153, 51, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(153, 51, 255, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  useFrame((_, delta) => {
    if (planetRef.current) {
      // Rotate planet
      planetRef.current.rotation.y += delta * 0.1;
      
      // Added subtle wobble effect
      planetRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.1;
      planetRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.03;
    }
    
    // Rotate rings
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
    }
  });
  
  return (
    <group ref={planetRef} position={position} rotation={rotation} scale={scale}>
      {/* Main planet body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={planetTexture} 
          bumpMap={bumpMap}
          bumpScale={0.05}
          emissive="#6b21a8"
          emissiveIntensity={0.2}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Atmosphere layer */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={atmosphereTexture}
          transparent={true}
          opacity={0.4}
          emissive="#9933ff"
          emissiveIntensity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Glowing atmosphere */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1, 24, 24]} />
        <MeshDistortMaterial
          transparent
          opacity={0.1}
          distort={0.3}
          speed={0.5}
          color="#9933ff"
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Planet rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.2, 2, 64]} />
        <meshStandardMaterial 
          color="#9933ff" 
          transparent 
          opacity={0.6}
          emissive="#9933ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Ambient light around planet */}
      <pointLight position={[0, 0, 0]} color="#9933ff" intensity={0.5} distance={5} />
      
      {/* Sparkles around planet */}
      <Sparkles count={50} scale={[3, 3, 3]} size={0.3} speed={0.2} color="#ffffff" />
    </group>
  );
}

// Space environment with enhanced visuals
function SpaceEnvironment({ isVisible }) {
  const spaceRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (spaceRef.current) {
      spaceRef.current.rotation.y += delta * 0.01;
    }
  });
  
  return (
    <group ref={spaceRef} visible={isVisible}>
      {/* Enhanced stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={7000} 
        factor={5} 
        saturation={0.7}
        fade
        speed={0.5}
      />
      
      {/* Space dust particles */}
      <SpaceDust />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Distant stars as point lights */}
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9933ff" />
      <pointLight position={[0, -20, -30]} intensity={0.8} color="#3366ff" />
      
      {/* Environment map for reflections */}
      <Environment preset="night" />
      
      {/* Distant nebula - using a procedural texture instead of loading an image */}
      <mesh position={[0, 0, -50]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#120a1f" transparent opacity={0.6} />
      </mesh>
      
      {/* Add some distant nebula clouds */}
      <Sparkles 
        count={500} 
        scale={[100, 100, 10]} 
        size={10} 
        speed={0.1} 
        position={[0, 0, -40]} 
        color="#9933ff"
        opacity={0.2}
      />
    </group>
  );
}

// Dynamic 3D text with glow effect
function GlowingText({ text, position, visible, scale = 1 }) {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      // Subtle floating animation
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      
      // Subtle rotation
      textRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.02;
    }
  });
  
  return (
    <group visible={visible} position={position} scale={[scale, scale, scale]}>
      {/* Main text */}
      <Text
        ref={textRef}
        fontSize={1}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        lineHeight={1}
        material-toneMapped={false}
      >
        {text}
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#9933ff"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
        />
      </Text>
      
      {/* Glow effect */}
      <pointLight color="#9933ff" intensity={1} distance={3} position={[0, 0, 0.5]} />
    </group>
  );
}

// Main scene component with enhanced visuals and interactions
function Scene({ isLaunched, setRocketReachedSpace, rocketReachedSpace, setPortfolioReady }) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 5);
    
    // Start ambient sound
    soundEffects.ambient.play();
    
    return () => {
      soundEffects.ambient.stop();
    };
  }, [camera]);
  
  useEffect(() => {
    if (!rocketReachedSpace) return;
    
    // Play whoosh sound
    soundEffects.whoosh.play();
    
    // Transition to portfolio planet with enhanced camera movement
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setPortfolioReady(true);
        }, 1500);
      }
    });
    
    // Move camera back to see the planet with dynamic movement
    timeline.to(camera.position, {
      z: 10,
      y: 3,
      x: 2,
      duration: 3,
      ease: 'power2.inOut'
    });
    
    // Rotate camera to look at planet
    timeline.to(camera.rotation, {
      y: -0.2,
      duration: 2,
      ease: 'power1.inOut'
    }, "-=2");
    
    return () => {
      timeline.kill();
    };
  }, [rocketReachedSpace, camera, setPortfolioReady]);
  
  return (
    <>
      <SpaceEnvironment isVisible={true} />
      
      {/* 3D LAUNCH text visible before launch */}
      <GlowingText 
        text="LAUNCH" 
        position={[0, 0, 0]} 
        visible={!isLaunched}
        scale={1.5}
      />
      
      {/* Rocket */}
      <Rocket 
        position={[0, -2, 0]} 
        rotation={[0, 0, 0]} 
        scale={[0.5, 0.5, 0.5]}
        isLaunched={isLaunched}
        setRocketReachedSpace={setRocketReachedSpace}
      />
      
      {/* Planet - only visible after rocket reaches space */}
      {rocketReachedSpace && (
        <Planet 
          position={[0, -10, -8]} 
          rotation={[0.1, 0, 0]} 
          scale={[3, 3, 3]} 
        />
      )}
      
      {/* Welcome text that appears near the planet */}
      {rocketReachedSpace && (
        <GlowingText 
          text="WELCOME TO SAURABH'S PORTFOLIO" 
          position={[0, -5, -8]} 
          visible={true}
          scale={0.8}
        />
      )}
    </>
  );
}

// Enhanced LaunchScreen component with improved UI elements
export default function LaunchScreen({ onComplete }) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [rocketReachedSpace, setRocketReachedSpace] = useState(false);
  const [portfolioReady, setPortfolioReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  
  // Handle launch with enhanced effects
  const handleLaunch = () => {
    if (isLaunched) return;
    
    // Play explosion sound
    soundEffects.explosion.play();
    
    // Animate launch button
    controls.start({
      scale: [1, 1.2, 0],
      opacity: [1, 1, 0],
      transition: { duration: 0.5 }
    });
    
    // Set launch state after button animation
    setTimeout(() => {
      setIsLaunched(true);
    }, 300);
  };
  
  // Transition to portfolio
  useEffect(() => {
    if (portfolioReady) {
      const timer = setTimeout(() => {
        // Fade out all sounds
        Object.values(soundEffects).forEach(sound => {
          if (sound.playing()) {
            sound.fade(sound.volume(), 0, 1000);
            setTimeout(() => sound.stop(), 1000);
          }
        });
        
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [portfolioReady, onComplete]);
  
  return (
    <div className="fixed inset-0 bg-black z-50">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ 
          cursor: isLaunched ? 'default' : 'pointer',
          background: 'radial-gradient(circle at center, #0f0f1a 0%, #000000 100%)'
        }}
        onClick={handleLaunch}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
      >
        <Scene 
          isLaunched={isLaunched} 
          setRocketReachedSpace={setRocketReachedSpace}
          rocketReachedSpace={rocketReachedSpace}
          setPortfolioReady={setPortfolioReady}
        />
      </Canvas>
      
      {/* Dynamic Launch button with Grok-like color effect */}
      {!isLaunched && (
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={controls}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="relative cursor-pointer"
            whileHover="hover"
          >
            {/* Animated background glow */}
            <motion.div 
              className="absolute inset-0 rounded-full blur-xl"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(153,51,255,0.7) 0%, rgba(153,51,255,0) 70%)',
                  'radial-gradient(circle, rgba(51,102,255,0.7) 0%, rgba(51,102,255,0) 70%)',
                  'radial-gradient(circle, rgba(255,51,153,0.7) 0%, rgba(255,51,153,0) 70%)',
                  'radial-gradient(circle, rgba(153,51,255,0.7) 0%, rgba(153,51,255,0) 70%)'
                ]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear" 
              }}
            />
            
            {/* Text with dynamic gradient */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold tracking-wider cursor-pointer px-8 py-4"
              animate={{
                background: [
                  'linear-gradient(to right, #ffffff, #9933ff)',
                  'linear-gradient(to right, #ffffff, #3366ff)',
                  'linear-gradient(to right, #ffffff, #ff3399)',
                  'linear-gradient(to right, #ffffff, #9933ff)'
                ]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear" 
              }}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(153, 51, 255, 0.7)"
              }}
            >
              LAUNCH
            </motion.h1>
            
            {/* Pulsing border */}
            <motion.div 
              className="absolute inset-0 rounded-xl border-2 border-purple-500"
              animate={{
                boxShadow: [
                  '0 0 10px 2px rgba(153, 51, 255, 0.7)',
                  '0 0 20px 5px rgba(153, 51, 255, 0.5)',
                  '0 0 10px 2px rgba(153, 51, 255, 0.7)'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
      )}
      
      {/* Instruction text with animation */}
      {!isLaunched && (
        <motion.div 
          className="absolute bottom-10 left-0 right-0 text-center text-white text-opacity-70"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0.5, 1],
            y: [10, 0]
          }}
          transition={{ 
            opacity: { duration: 3, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 1 }
          }}
        >
          <span className="px-4 py-2 rounded-full bg-black bg-opacity-30 backdrop-blur-sm">
            Click to launch
          </span>
        </motion.div>
      )}
      
      {/* Loading indicator during launch */}
      {isLaunched && !rocketReachedSpace && (
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
      
      {/* Transition overlay with enhanced animation */}
      <AnimatePresence>
        {portfolioReady && (
          <motion.div 
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Welcome message with animated text */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{
                  background: "linear-gradient(to right, #ffffff, #9933ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 20px rgba(153, 51, 255, 0.5)"
                }}
              >
                Welcome to Saurabh's Portfolio
              </motion.h2>
              
              <motion.p
                className="text-purple-300 text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                Prepare for an extraordinary journey
              </motion.p>
              
              {/* Loading bar */}
              <motion.div 
                className="w-64 h-1 bg-gray-800 rounded-full mt-8 mx-auto overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}