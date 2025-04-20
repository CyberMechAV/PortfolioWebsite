import { FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <a href="#home" className="text-white font-bold text-2xl tracking-tight flex items-center gap-2 mb-4">
              <span className="bg-primary-400 text-gray-900 w-8 h-8 flex items-center justify-center rounded-full">JD</span>
              <span>John Doe</span>
            </a>
            <p className="text-gray-400 mb-6 max-w-md">
              Creating innovative web solutions with a focus on user experience, performance, and clean code.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Email" className="text-gray-400 hover:text-white transition-colors">
                <FaEnvelope />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a></li>
                <li><a href="#skills" className="text-gray-400 hover:text-white transition-colors">Skills</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <p className="text-gray-500">
            &copy; {currentYear} John Doe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
