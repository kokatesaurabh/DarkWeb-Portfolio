import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const experiences = [
  {
    company: 'JP Morgan Chase',
    title: 'Software Engineering Virtual Experience',
    period: 'August 2024',
    description: 'Completed a comprehensive software engineering virtual experience program, focusing on real-world financial technology applications and development practices.',
    skills: ['Python', 'Data Analysis', 'Financial Technology', 'API Integration'],
    certificateUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_yrFaq9KfM3C43ehcp_1737909473793_completion_certificate.pdf'
  },
  {
    company: 'Electronic Arts',
    title: 'Software Engineering Virtual Experience',
    period: 'July 2024',
    description: 'Participated in EA\'s software engineering program, working on game development concepts, optimization techniques, and software architecture for gaming applications.',
    skills: ['Game Development', 'C++', 'Software Architecture', 'Performance Optimization'],
    certificateUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/j43dGscQHtJJ57N54/a77WE3de8qrxWferQ_j43dGscQHtJJ57N54_yrFaq9KfM3C43ehcp_1736841547034_completion_certificate.pdf'
  },
  {
    company: 'Tata Group',
    title: 'Cybersecurity Virtual Experience',
    period: 'July 2024',
    description: 'Engaged in Tata\'s cybersecurity program, focusing on threat detection, vulnerability assessment, and implementing security measures for enterprise systems.',
    skills: ['Threat Analysis', 'Vulnerability Assessment', 'Security Implementation', 'Risk Management'],
    certificateUrl: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/ifobHAoMjQs9s6bKS/gmf3ypEXBj2wvfQWC_ifobHAoMjQs9s6bKS_yrFaq9KfM3C43ehcp_1736787474888_completion_certificate.pdf'
  }
];

export default function WorkExperience() {
  return (
    <section id="experience" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300"
        >
          Work Experience
        </motion.h2>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline connector */}
              {index < experiences.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-purple-900/20 h-full" />
              )}
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Timeline dot */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-purple-900/30 border-2 border-purple-500 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-grow bg-purple-900/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:bg-purple-900/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300">{exp.title}</h3>
                      <p className="text-lg text-white">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
                      {exp.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{exp.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-purple-800/30 rounded-full text-purple-300 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a 
                    href={exp.certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Certificate</span>
                  </a>
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
            href="https://drive.google.com/file/d/1NZ17gYQopgoQMTNSHoJhJ5vilG8vUEwm/view" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <span>View Full Resume</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}