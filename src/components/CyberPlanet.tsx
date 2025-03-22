import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CyberPlanet() {
  const planetRef = useRef<THREE.Mesh>(null);
  const energyFieldRef = useRef<THREE.Mesh>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  // Enhanced Planet Shader - More vibrant circuits and glow
  const planetMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0x0a0022) }, // Deeper cosmic purple
        glowColor: { value: new THREE.Color(0xcc33ff) }, // Brighter neon glow
        secondaryGlow: { value: new THREE.Color(0x00ccff) }, // Cyan accent
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float time;
        void main() {
          vUv = uv;
          vNormal = normalize(normal);
          vec3 pos = position;
          float distortion = sin(pos.x * 15.0 + time * 3.0) * 0.08 + cos(pos.y * 10.0 + time * 2.0) * 0.05;
          pos += normal * distortion;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform vec3 baseColor;
        uniform vec3 glowColor;
        uniform vec3 secondaryGlow;
        uniform float time;
        void main() {
          float circuit1 = abs(fract(vUv.x * 30.0 + sin(time * 1.5)) - 0.5) + abs(fract(vUv.y * 30.0 + cos(time * 1.5))) - 0.5;
          circuit1 = step(0.42, circuit1);
          float circuit2 = abs(fract(vUv.x * 20.0 + cos(time * 0.8)) - 0.5) + abs(fract(vUv.y * 20.0 + sin(time * 0.8))) - 0.5;
          circuit2 = step(0.38, circuit2);
          float circuit = max(circuit1 * 0.8, circuit2 * 0.6);
          float pulse = sin(time * 6.0 + vUv.x * 25.0) * 0.5 + 0.5;
          pulse *= circuit;
          float glow = sin(time * 4.0 + vUv.x * 15.0 + vUv.y * 10.0) * 0.5 + 0.7;
          vec3 finalColor = mix(baseColor, glowColor, circuit * glow);
          finalColor += secondaryGlow * pulse * 0.9;
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          finalColor += mix(glowColor, secondaryGlow, sin(time)) * fresnel * 0.6;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, []);

  // Enhanced Energy Field - Cosmic aurora effect
  const energyFieldMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        float noise(vec2 p) {
          return sin(p.x * 12.0 + time * 1.5) * cos(p.y * 12.0 + time * 1.2);
        }
        float fbm(vec2 p) {
          float v = 0.0;
          v += 0.5 * noise(p); p *= 2.2;
          v += 0.25 * noise(p); p *= 2.2;
          v += 0.125 * noise(p); p *= 2.2;
          v += 0.0625 * noise(p);
          return v;
        }
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float n = fbm(p * 4.0 + time * 0.7);
          float glow = pow(abs(n) * 0.6 + 0.4, 2.5);
          vec3 color = mix(vec3(0.2, 0.0, 1.0), vec3(1.0, 0.7, 1.0), glow);
          color += vec3(0.0, 0.5, 1.0) * sin(time + vPosition.y * 2.0) * 0.3;
          gl_FragColor = vec4(color, glow * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Enhanced Rings - Multi-layered and glowing
  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        ringColor: { value: new THREE.Color(0xcc33ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec3 ringColor;
        void main() {
          float glow = sin(vUv.x * 20.0 + time * 3.0) * 0.5 + 0.5;
          vec3 color = ringColor * (0.6 + glow * 0.4);
          gl_FragColor = vec4(color, 0.5 * (1.0 - vUv.y));
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Enhanced Core - Pulsating cosmic heart
  const coreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        emissiveColor: { value: new THREE.Color(0xff66ff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        uniform float time;
        void main() {
          vNormal = normalize(normal);
          vec3 pos = position;
          pos += normal * sin(time * 5.0) * 0.05;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        uniform vec3 emissiveColor;
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 color = emissiveColor * (1.5 + sin(time * 3.0) * 0.5);
          gl_FragColor = vec4(color, 0.95 - fresnel * 0.3);
        }
      `,
      transparent: true,
    });
  }, []);

  // Enhanced Particles - Star-like sparkle
  const particleCount = 1500;
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 4.0 + Math.random() * 2.0;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      colors[i * 3] = Math.random() * 0.5 + 0.5;
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.5;
      colors[i * 3 + 2] = 1.0;
      sizes[i] = 0.03 + Math.random() * 0.07;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, []);

  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos += sin(time + position.x * 5.0) * 0.1;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float time;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float twinkle = sin(time * 10.0 + vColor.r * 20.0) * 0.3 + 0.7;
          gl_FragColor = vec4(vColor * twinkle, 1.0 - dist * 2.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, []);

  // Aura - Subtle outer glow
  const auraMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        auraColor: { value: new THREE.Color(0x9933ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec3 auraColor;
        void main() {
          float dist = length(vUv - 0.5);
          float alpha = smoothstep(0.5, 0.2, dist) * (sin(time * 2.0) * 0.2 + 0.3);
          gl_FragColor = vec4(auraColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Enhanced Satellite Component
  function Satellite({ radius, speed, size = 0.15 }) {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime() * speed;
      if (ref.current) {
        ref.current.position.set(radius * Math.cos(t), radius * Math.sin(t) * 0.2, radius * Math.sin(t));
        ref.current.rotation.y = t;
      }
    });
    return (
      <mesh ref={ref}>
        <tetrahedronGeometry args={[size, 2]} />
        <meshStandardMaterial 
          color={0xffffff} 
          emissive={0xcc33ff} 
          emissiveIntensity={1.5} 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
    );
  }

  // Animation Loop
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (planetRef.current) {
      planetRef.current.rotation.y = elapsedTime * 0.04;
      planetMaterial.uniforms.time.value = elapsedTime;
    }
    if (energyFieldRef.current) {
      energyFieldRef.current.rotation.y = elapsedTime * 0.07;
      energyFieldMaterial.uniforms.time.value = elapsedTime;
    }
    if (ringsGroupRef.current) {
      ringsGroupRef.current.rotation.z = elapsedTime * 0.06;
      ringMaterial.uniforms.time.value = elapsedTime;
      ringsGroupRef.current.scale.setScalar(1.0 + Math.sin(elapsedTime * 1.5) * 0.25);
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(0.4 + Math.sin(elapsedTime * 3.0) * 0.1);
      coreMaterial.uniforms.time.value = elapsedTime;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = elapsedTime * 0.03;
      particleMaterial.uniforms.time.value = elapsedTime;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = elapsedTime * 0.02;
      auraMaterial.uniforms.time.value = elapsedTime;
    }
  });

  return (
    <group>
      <mesh ref={planetRef} material={planetMaterial}>
        <sphereGeometry args={[2.2, 128, 128]} />
      </mesh>
      <mesh ref={energyFieldRef} material={energyFieldMaterial}>
        <sphereGeometry args={[2.8, 64, 64]} />
      </mesh>
      <group ref={ringsGroupRef} rotation={[Math.PI / 2.2, 0.1, 0]}>
        {[2.7, 3.0, 3.3, 3.6].map((radius, i) => (
          <mesh key={radius} material={ringMaterial} rotation={[0, 0, i * 0.2]}>
            <torusGeometry args={[radius, 0.05 + i * 0.02, 16, 128]} />
          </mesh>
        ))}
      </group>
      <mesh ref={coreRef} material={coreMaterial}>
        <sphereGeometry args={[0.4, 64, 64]} />
      </mesh>
      <points ref={particlesRef} geometry={particlesGeometry} material={particleMaterial} />
      <mesh ref={auraRef} material={auraMaterial}>
        <sphereGeometry args={[5.0, 32, 32]} />
      </mesh>
      {/* Enhanced Satellites */}
      <Satellite radius={3.8} speed={0.6} size={0.12} />
      <Satellite radius={4.2} speed={-0.4} size={0.18} />
      <Satellite radius={4.8} speed={0.25} size={0.15} />
    </group>
  );
}