import { Github, Linkedin, Twitter, Mail, FileText } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50,
        behavior: 'smooth',
      });
    }
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/kokatesaurabh/kokatesaurabh', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/saurabh-kokate-b839b921a', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/SaurabhKokate20', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' },
    { icon: FileText, href: 'https://drive.google.com/file/d/1NZ17gYQopgoQMTNSHoJhJ5vilG8vUEwm/view', label: 'Resume' },
  ];

  const navItems = [
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer className="py-8 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-purple-900/20 to-gray-950 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center md:flex-row md:justify-between gap-6">
          {/* Left Section - Name and Title */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-purple-300 tracking-tight">
              Saurabh Kokate
            </h3>
            <p className="text-gray-400 text-sm">
              Cybersecurity Enthusiast & AI Innovator
            </p>
          </div>

          {/* Center Section - Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                aria-label={`Scroll to ${label} section`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right Section - Social Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-gray-400 hover:text-purple-400 transition-all duration-300"
                onMouseEnter={() => setIsHovered(label)}
                onMouseLeave={() => setIsHovered(null)}
                aria-label={label}
              >
                <Icon className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity ${isHovered === label ? 'opacity-100' : ''}`}>
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-purple-900/30 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <span>© {new Date().getFullYear()} All rights reserved</span>
          <span className="mt-2 md:mt-0">Built with ♥ using React & Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}