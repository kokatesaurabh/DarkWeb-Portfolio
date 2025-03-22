import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    name: 'MAK-75-Framework',
    description: 'The most advanced keylogger framework designed to work across multiple platforms with real-time monitoring capabilities.',
    github: 'https://github.com/yourusername/MAK-75-Framework',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    technologies: ['Python', 'C++', 'Networking', 'Encryption']
  },
  {
    name: 'Cyber-Jarvis',
    description: 'An advanced AI-based system designed to assist hackers by providing real-time support and solutions.',
    github: 'https://github.com/yourusername/Cyber-Jarvis',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    technologies: ['Python', 'TensorFlow', 'NLP', 'Machine Learning']
  },
  {
    name: 'VulnHawk',
    description: 'Advanced vulnerability scanner and exploitation tool for automated security assessment.',
    github: 'https://github.com/yourusername/VulnHawk',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    technologies: ['Go', 'Docker', 'Security', 'Automation']
  }
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300"
        >
          Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg"
            >
              {/* Project Image with Overlay */}
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-black/30 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              </div>
              
              {/* Content */}
              <div className="relative p-6 backdrop-blur-sm bg-purple-900/20 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">{project.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-purple-800/30 rounded-full text-purple-300 text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Links */}
                <div className="flex justify-between items-center">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-400 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                  
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-purple-700 transition-colors"
                  >
                    <span>Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a 
            href="https://github.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-900/30 text-purple-300 rounded-lg font-semibold hover:bg-purple-900/50 transition-colors border border-purple-500/30"
          >
            <Github className="w-5 h-5" />
            <span>View More on GitHub</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}