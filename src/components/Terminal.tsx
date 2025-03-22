import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const messages = [
  'Initializing secure connection...',
  'Loading exploit database...',
  'Scanning network vulnerabilities...',
  'Accessing mainframe...',
  'Connection established.',
];

export default function Terminal() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (currentMessage >= messages.length) return;

    let currentText = '';
    const message = messages[currentMessage];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < message.length) {
        currentText += message[charIndex];
        setText(currentText);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentMessage(prev => prev + 1);
        }, 1000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentMessage]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 font-mono text-sm text-purple-300 w-full max-w-md"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="space-y-1">
        {messages.slice(0, currentMessage).map((msg, index) => (
          <div key={index} className="text-green-400">
            <span className="text-purple-400">$</span> {msg}
          </div>
        ))}
        {currentMessage < messages.length && (
          <div>
            <span className="text-purple-400">$</span> {text}
            {cursor && <span className="animate-pulse">_</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}