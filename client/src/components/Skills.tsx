import { SectionAnimate } from "@/components/ui/section-animate";
import { ProgressSkill } from "@/components/ui/progress-skill";
import { 
  FaGitAlt, 
  FaDocker, 
  FaFigma, 
  FaJenkins, 
  FaAws, 
  FaJira 
} from "react-icons/fa";

export default function Skills() {
  const frontendSkills = [
    { name: "JavaScript/TypeScript", percentage: 95 },
    { name: "React/Next.js", percentage: 90 },
    { name: "HTML5/CSS3", percentage: 90 },
    { name: "Tailwind/SCSS", percentage: 85 },
    { name: "Vue.js", percentage: 75 }
  ];

  const backendSkills = [
    { name: "Node.js/Express", percentage: 85 },
    { name: "Database Design", percentage: 80 },
    { name: "RESTful APIs", percentage: 90 },
    { name: "GraphQL", percentage: 75 },
    { name: "AWS/Cloud Services", percentage: 70 }
  ];

  const tools = [
    { name: "Git", icon: <FaGitAlt className="text-3xl text-red-500 mb-2" /> },
    { name: "Docker", icon: <FaDocker className="text-3xl text-blue-500 mb-2" /> },
    { name: "Figma", icon: <FaFigma className="text-3xl text-purple-500 mb-2" /> },
    { name: "Jenkins", icon: <FaJenkins className="text-3xl text-orange-500 mb-2" /> },
    { name: "AWS", icon: <FaAws className="text-3xl text-yellow-500 mb-2" /> },
    { name: "Jira", icon: <FaJira className="text-3xl text-blue-500 mb-2" /> }
  ];

  return (
    <SectionAnimate id="skills" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">My Skills</h2>
          <div className="w-20 h-1 bg-primary-600 dark:bg-primary-400 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of technologies and tools I've worked with throughout my career.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-6">Frontend Development</h3>
            
            {frontendSkills.map((skill, index) => (
              <ProgressSkill 
                key={index}
                name={skill.name}
                percentage={skill.percentage}
                colorClass="bg-primary-600"
                delay={index * 0.1}
              />
            ))}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Backend Development</h3>
            
            {backendSkills.map((skill, index) => (
              <ProgressSkill 
                key={index}
                name={skill.name}
                percentage={skill.percentage}
                colorClass="bg-accent-500"
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6 text-center">Tools & Technologies</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {tools.map((tool, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg w-28"
              >
                {tool.icon}
                <span className="text-gray-700 dark:text-gray-300 text-sm text-center">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionAnimate>
  );
}
