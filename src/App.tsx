import React, { useState, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Competitions from './components/Competitions';
import WorkExperience from './components/WorkExperience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import LaunchScreen from './components/LaunchScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [launchComplete, setLaunchComplete] = useState(false);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (!launchComplete) {
    return <LaunchScreen onComplete={() => setLaunchComplete(true)} />;
  }

  return (
    <div className="bg-darkest text-white min-h-screen">
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <div className="relative">
          <Navbar />
          <div id="home">
            <Hero />
          </div>
          <div id="about">
            <About />
          </div>
          <div id="skills">
            <Skills />
          </div>
          <div id="projects">
            <Projects />
          </div>
          <div id="experience">
            <WorkExperience />
          </div>
          <div id="competitions">
            <Competitions />
          </div>
          <div id="contact">
            <Contact />
          </div>
          <Footer />
        </div>
      </Suspense>
    </div>
  );
}

export default App;