import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Typewriter from "@/components/ui/typewriter";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaArrowRight } from "react-icons/fa";

export default function Hero() {
  const socialLinks = [
    { icon: <FaGithub className="text-xl" />, href: "https://github.com", label: "GitHub" },
    { icon: <FaLinkedin className="text-xl" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaTwitter className="text-xl" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaEnvelope className="text-xl" />, href: "mailto:hello@johndoe.com", label: "Email" },
  ];

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="order-2 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">Hi there! I'm</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">John Doe</h1>
            <div className="h-8 overflow-hidden">
              <Typewriter 
                phrases={[
                  'Full Stack Developer',
                  'UI/UX Enthusiast',
                  'Problem Solver',
                  'JavaScript Expert'
                ]} 
                typingSpeed={100}
                deletingSpeed={50}
                pauseTime={1000}
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium"
              />
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
              I build exceptional digital experiences with clean code and creative solutions. 
              Passionate about crafting intuitive and high-performance web applications.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <a href="#projects" className="inline-flex items-center">
                  View My Work
                  <FaArrowRight className="ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="#contact">Get In Touch</a>
              </Button>
            </div>
            <div className="mt-8 flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                alt="John Doe" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
