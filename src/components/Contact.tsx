import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Send, Github, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replace these with your actual EmailJS service, template, and public key
    emailjs.sendForm(/* YOUR_SERVICE_ID */, /* YOUR_TEMPLATE_ID */, formRef.current, /* YOUR_PUBLIC_KEY */)
        .then((result) => {
          console.log('Success:', result.text);
          setIsSubmitting(false);
          setSubmitSuccess(true);
          setFormData({ name: '', email: '', message: '' });
          setTimeout(() => setSubmitSuccess(false), 5000);
        }, (error) => {
          console.error('Error:', error.text);
          setIsSubmitting(false);
      });
  };

  return (
    <section id="contact" className="min-h-screen py-20 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300"
        >
          Contact Me
        </motion.h2>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: 3D Animation and Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* 3D Animation Card */}
            <Card className="w-full h-[400px] bg-black/[0.96] relative overflow-hidden">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" // Replace with your Spline scene URL
                className="w-full h-full"
              />
            </Card>
            {/* Social Links */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Connect with me</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/" // Replace with your GitHub URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-purple-900/20 rounded-lg hover:bg-purple-900/40 transition-colors"
                >
                  <Github className="w-6 h-6 text-purple-400" />
                </a>
                <a
                  href="https://linkedin.com/" // Replace with your LinkedIn URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-purple-900/20 rounded-lg hover:bg-purple-900/40 transition-colors"
                >
                  <Linkedin className="w-6 h-6 text-purple-400" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-purple-900/20 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
              <h3 className="text-2xl font-semibold text-purple-300 mb-6">Send a Message</h3>
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6"
                >
                  <p className="text-green-300">Your message has been sent successfully! I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-purple-300 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-purple-300 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-purple-300 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2 bg-purple-900/20 border border-purple-500/20 rounded-lg focus:outline-none focus:border-purple-500 text-white backdrop-blur-sm"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 bg-purple-600 text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}