import { SectionAnimate } from "@/components/ui/section-animate";
import { FaUserGraduate, FaBriefcase, FaAward } from "react-icons/fa";

export default function About() {
  const education = [
    {
      degree: "BSc in Computer Science",
      institution: "University of Technology",
      period: "2014-2018"
    }
  ];

  const experience = [
    {
      role: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      period: "2020-Present"
    },
    {
      role: "Full Stack Developer",
      company: "WebDev Agency",
      period: "2018-2020"
    }
  ];

  const certificates = [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      year: "2022"
    }
  ];

  return (
    <SectionAnimate id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary-600 dark:bg-primary-400 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">My Journey</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              I'm a passionate Full Stack Developer with over 5 years of experience building web applications that deliver 
              exceptional user experiences. My journey began with a Computer Science degree, followed by working with 
              startups and established companies alike.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              I specialize in JavaScript/TypeScript ecosystems, with expertise in React for frontend and Node.js for backend development. I'm committed to writing clean, maintainable code and creating intuitive interfaces that users love.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
              or enjoying outdoor activities like hiking and photography.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaUserGraduate className="mr-2 text-primary-600 dark:text-primary-400" />
              Education
            </h3>
            {education.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{item.degree}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.institution} • {item.period}
                </p>
              </div>
            ))}
            
            <h3 className="text-xl font-semibold mb-4 flex items-center mt-6">
              <FaBriefcase className="mr-2 text-primary-600 dark:text-primary-400" />
              Work Experience
            </h3>
            {experience.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{item.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.company} • {item.period}
                </p>
              </div>
            ))}
            
            <h3 className="text-xl font-semibold mb-4 flex items-center mt-6">
              <FaAward className="mr-2 text-primary-600 dark:text-primary-400" />
              Certificates
            </h3>
            {certificates.map((item, index) => (
              <div key={index}>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.issuer} • {item.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionAnimate>
  );
}
