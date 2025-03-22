import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import { Code2, Database, Shield, Terminal } from 'lucide-react';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const highlights = [
    {
      icon: Terminal,
      title: "Advanced Red Teaming",
      description: "Specialized in developing custom exploitation frameworks and innovative security solutions."
    },
    {
      icon: Shield,
      title: "Zero-Day Development",
      description: "Expert in identifying and developing zero-day exploits with a focus on responsible disclosure."
    },
    {
      icon: Code2,
      title: "AI Innovation",
      description: "Building AI systems from scratch to revolutionize cybersecurity tooling and automation."
    },
    {
      icon: Database,
      title: "Custom Frameworks",
      description: "Creating sophisticated security frameworks for enhanced threat detection and response."
    }
  ];

  return (
    <section ref={containerRef} className="min-h-screen py-20 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Content */}
          <motion.div 
            style={{ opacity, y }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300">
              About Me
            </h2>

            <div className="prose prose-invert">
              <p className="text-lg text-gray-300">
                I'm passionate about pushing the boundaries of cybersecurity through innovation and technical excellence. My focus lies in developing cutting-edge solutions that challenge conventional security paradigms.
              </p>
              
              <p className="text-lg text-gray-300">
                Currently, I'm exploring the intersection of AI and cybersecurity, building systems from the ground up that assist security professionals without relying on existing tools or APIs.
              </p>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={highlight.title}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="p-6 bg-purple-900/20 rounded-lg backdrop-blur-sm border border-purple-500/20
                      hover:bg-purple-900/30 transition-all duration-300"
                  >
                    <Icon className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-400">
                      {highlight.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right column: 3D Planet */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-[600px] relative hidden lg:block"
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
              />
              <Planet />
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  );
}