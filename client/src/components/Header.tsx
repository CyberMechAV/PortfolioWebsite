import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to handle resume download
  const handleDownloadResume = () => {
    // In a real implementation, this would be linked to an actual file
    alert("Resume download would start here in a real implementation");
  };

  // Close mobile menu when clicking on a link
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 transition-shadow duration-300 ${scrolled ? "shadow-md dark:shadow-gray-800/20" : ""}`}>
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/#home" className="text-primary-600 dark:text-primary-400 font-bold text-xl tracking-tight flex items-center gap-2">
          <span className="bg-primary-600 dark:bg-primary-400 text-white dark:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full">JD</span>
          <span>John Doe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a>
          <a href="#projects" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Projects</a>
          <a href="#skills" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Skills</a>
          <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a>
          <Button onClick={handleDownloadResume} variant="default">
            Resume
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-2">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <a 
              href="#about" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
              onClick={handleNavLinkClick}
            >
              About
            </a>
            <a 
              href="#projects" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
              onClick={handleNavLinkClick}
            >
              Projects
            </a>
            <a 
              href="#skills" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
              onClick={handleNavLinkClick}
            >
              Skills
            </a>
            <a 
              href="#contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
              onClick={handleNavLinkClick}
            >
              Contact
            </a>
            <Button onClick={handleDownloadResume} className="w-full justify-center">
              Resume
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
