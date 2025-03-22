import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Planet() {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const dataStreamRef = useRef<THREE.Mesh>(null);

  // Create custom geometry for data streams
  const dataStreamGeometry = useMemo(() => {
    const geometry = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
    return geometry;
  }, []);

  // Create animated shader material for the planet
  const planetMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x6b21a8) }, // Purple color
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          vUv = uv;
          vNormal = normal;
          
          // Add subtle vertex displacement
          vec3 pos = position;
          pos += normal * sin(pos.x * 10.0 + time) * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform vec3 color;
        uniform float time;
        
        void main() {
          // Create grid pattern
          float grid = abs(fract(vUv.x * 20.0) - 0.5) + abs(fract(vUv.y * 20.0) - 0.5);
          grid = step(0.4, grid);
          
          // Create pulse effect
          float pulse = sin(time + vUv.x * 10.0) * 0.5 + 0.5;
          
          // Combine effects
          vec3 finalColor = mix(color, vec3(1.0), grid * 0.3 * pulse);
          
          // Add fresnel effect
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          finalColor += vec3(0.5, 0.0, 1.0) * fresnel * 0.5;
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Create animated material for data streams
  const dataStreamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Add flowing animation
          pos.y += sin(pos.x * 10.0 + time * 2.0) * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          // Create flowing data effect
          float flow = fract(vUv.x * 10.0 - time);
          float intensity = smoothstep(0.0, 0.1, flow) * smoothstep(1.0, 0.9, flow);
          
          vec3 color = vec3(0.5, 0.0, 1.0); // Purple color
          gl_FragColor = vec4(color, intensity * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      planetMaterial.uniforms.time.value = clock.getElapsedTime();
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (dataStreamRef.current) {
      dataStreamRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      dataStreamRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      dataStreamMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <group>
      {/* Planet core with custom shader */}
      <mesh ref={planetRef} material={planetMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>

      {/* Atmosphere layer */}
      <Sphere ref={atmosphereRef} args={[2.2, 32, 32]}>
        <MeshDistortMaterial
          color="#6b21a8"
          transparent
          opacity={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>

      {/* Data streams */}
      <group rotation={[Math.PI / 4, 0, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            ref={i === 0 ? dataStreamRef : undefined}
            geometry={dataStreamGeometry}
            material={dataStreamMaterial}
            rotation={[0, (Math.PI * 2 * i) / 8, 0]}
          />
        ))}
      </group>

      {/* Additional orbital rings */}
      {[2.4, 2.6, 2.8].map((radius, i) => (
        <Sphere key={i} args={[radius, 32, 32]}>
          <meshBasicMaterial
            color="#9333ea"
            transparent
            opacity={0.05}
            wireframe
          />
        </Sphere>
      ))}
    </group>
  );
}