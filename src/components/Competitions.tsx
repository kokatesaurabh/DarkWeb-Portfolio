import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, ExternalLink } from 'lucide-react';

const competitions = [
  {
    name: 'Pentathon (CTF)',
    result: 'Participated',
    team: 'Solo',
    date: '15/03/2024',
    description: 'Participated in this challenging Capture The Flag competition, solving various cybersecurity challenges across multiple domains including web exploitation, cryptography, and reverse engineering.'
  },
  {
    name: 'SIH\'24 (IIT Jammu)',
    result: 'Finalist',
    team: 'Team',
    date: '11-12 December 2024',
    description: 'Reached the finals of Smart India Hackathon 2024 held at IIT Jammu. Developed an innovative solution addressing real-world problems with cutting-edge technology integration.'
  }
];

export default function Competitions() {
  return (
    <section id="competitions" className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300"
        >
          Competitions
        </motion.h2>

        <div className="grid gap-8">
          {competitions.map((competition, index) => (
            <motion.div
              key={competition.name}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-purple-900/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 hover:bg-purple-900/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">{competition.name}</h3>
                  
                  <div className="flex flex-col space-y-3 mt-4">
                    <div className="flex items-center text-gray-400">
                      <Trophy className="w-5 h-5 mr-2 text-purple-400" />
                      <span>{competition.result}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      <Users className="w-5 h-5 mr-2 text-purple-400" />
                      <span>{competition.team}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                      <span>{competition.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <p className="text-gray-300">{competition.description}</p>
                  
                  {competition.name === 'SIH\'24 (IIT Jammu)' && (
                    <motion.div 
                      className="mt-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <a 
                        href="#" 
                        className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Project Details</span>
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 p-6 bg-purple-900/10 backdrop-blur-sm rounded-lg border border-purple-500/10"
        >
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Continuous Learning</h3>
          <p className="text-gray-300">
            Beyond formal competitions, I'm actively enhancing my cybersecurity skills through platforms like TryHackMe, HackTheBox, and various CTF events. These hands-on challenges help me stay current with the latest security techniques and vulnerabilities.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">TryHackMe</span>
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">HackTheBox</span>
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">CTF Events</span>
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300">Security Research</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}