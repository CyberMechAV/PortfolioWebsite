import { useState } from "react";
import { SectionAnimate } from "@/components/ui/section-animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGithub, 
  FaLinkedinIn, 
  FaTwitter, 
  FaInstagram, 
  FaDribbble, 
  FaDownload 
} from "react-icons/fa";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/contact", formData);
      
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: <FaGithub />, href: "https://github.com", label: "GitHub" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
    { icon: <FaDribbble />, href: "https://dribbble.com", label: "Dribbble" }
  ];

  return (
    <SectionAnimate id="contact" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary-600 dark:bg-primary-400 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? Let's connect!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Your Name</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email Address</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">Subject</Label>
                <Input 
                  type="text" 
                  id="subject" 
                  placeholder="Project Inquiry"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">Message</Label>
                <Textarea 
                  id="message" 
                  rows={5} 
                  placeholder="Tell me about your project or inquiry..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="flex items-start mb-6">
                <div className="text-primary-600 dark:text-primary-400 mr-4">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Email</p>
                  <a href="mailto:hello@johndoe.com" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    hello@johndoe.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="text-primary-600 dark:text-primary-400 mr-4">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Phone</p>
                  <a href="tel:+11234567890" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-primary-600 dark:text-primary-400 mr-4">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Location</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    San Francisco, California
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
              
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
              
              <div className="mt-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Want a copy of my resume?
                </p>
                <Button asChild className="inline-flex items-center">
                  <a href="#">
                    <FaDownload className="mr-2" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionAnimate>
  );
}
