import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo } from "react";
import CyberPlanet from "./CyberPlanet";

import {
  SiPython,
  SiCplusplus,
  SiJavascript,
  SiRust,
  SiGo,
  SiDocker,
  SiGit,
  SiLinux,
  SiReact,
  SiPytorch,
  SiTensorflow,
  SiNodedotjs,
  SiDjango,
  SiWireshark,
  SiMetasploit,
  SiBurpsuite,
} from "react-icons/si";

const skills = [
  { name: "Python", icon: <SiPython /> },
  { name: "C/C++", icon: <SiCplusplus /> },
  { name: "JavaScript", icon: <SiJavascript /> },
  { name: "Rust", icon: <SiRust /> },
  { name: "Go", icon: <SiGo /> },
  { name: "Docker", icon: <SiDocker /> },
  { name: "Git", icon: <SiGit /> },
  { name: "Linux", icon: <SiLinux /> },
  { name: "React", icon: <SiReact /> },
  { name: "PyTorch", icon: <SiPytorch /> },
  { name: "TensorFlow", icon: <SiTensorflow /> },
  { name: "Node.js", icon: <SiNodedotjs /> },
  { name: "Django", icon: <SiDjango /> },
  { name: "Wireshark", icon: <SiWireshark /> },
  { name: "Metasploit", icon: <SiMetasploit /> },
  { name: "Burp Suite", icon: <SiBurpsuite /> },
];

function getPositionsOnSphere(count: number, radius: number) {
  return useMemo(() => {
    const positions = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      positions.push([r * Math.cos(theta) * radius, y * radius, r * Math.sin(theta) * radius]);
    }
    return positions;
  }, [count, radius]);
}

function SkillIcons() {
  const positions = getPositionsOnSphere(skills.length, 2.7); // Adjusted radius to match planet scale
  return (
    <>
      {skills.map((skill, index) => (
        <Html key={index} position={positions[index]} center>
          <motion.div
            whileHover={{ scale: 1.3, rotateZ: 8 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="text-purple-300 text-4xl drop-shadow-lg transition-transform"
          >
            {skill.icon}
          </motion.div>
        </Html>
      ))}
    </>
  );
}

export default function Skills() {
  return (
    <section className="min-h-screen py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200"
        >
          Technical Expertise
        </motion.h2>
        <div className="w-full h-[650px] md:h-[750px]"> {/* Increased height for better visibility */}
          <Canvas
            camera={{
              fov: 50, // Wider field of view
              near: 0.1,
              far: 1000,
              position: [0, 0, 10], // Moved camera back to see the whole planet
            }}
            style={{ width: "100%", height: "100%" }} // Ensure canvas fills container
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 3, 5]} intensity={1.2} />
            <CyberPlanet />
            <SkillIcons />
            <OrbitControls
              enableZoom={false}
              autoRotate={true}
              autoRotateSpeed={0.7}
              minDistance={12} // Ensure camera can pull back enough
              maxDistance={15} // Allow further zoom-out
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
}