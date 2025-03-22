import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'competitions', 'contact'];
      const scrollPosition = window.scrollY + 300; // Offset to trigger earlier
      
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Competitions', id: 'competitions' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              onClick={() => scrollToSection('home')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Terminal className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-white">Saurabh.K</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`cursor-pointer transition-colors ${
                    activeSection === link.id 
                      ? 'text-purple-400 font-medium' 
                      : 'text-gray-300 hover:text-purple-400'
                  }`}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="h-0.5 bg-purple-400 mt-1"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-black/95 pt-20 md:hidden"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-6 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-xl cursor-pointer ${
                    activeSection === link.id 
                      ? 'text-purple-400 font-medium' 
                      : 'text-gray-300 hover:text-purple-400'
                  } transition-colors`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}