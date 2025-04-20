import React from 'react';
import { Page, Polaroid } from './Book';
import { Button } from '@/components/ui/button';
import { 
  FaGithub, 
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa';

// Cover Page
export const CoverPage: React.FC = () => (
  <Page pageNumber={1}>
    <div className="flex flex-col h-full items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-16">My Story</h1>
      <h2 className="text-xl md:text-2xl mb-8 text-primary-600 dark:text-primary-400">A Personal Journey</h2>
      <div className="my-8 relative w-1/2 mx-auto">
        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary-400 dark:border-primary-600"></div>
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2030&q=80" 
          alt="Book Cover" 
          className="w-full shadow-lg"
        />
      </div>
      <p className="text-sm mt-8 text-gray-600 dark:text-gray-400">Tap the corner to turn the page</p>
    </div>
  </Page>
);

// Introduction Page
export const IntroductionPage: React.FC = () => (
  <Page pageNumber={2}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Hello!</h2>
      <p className="mb-6">Welcome to my digital storybook. This is where I share my journey, projects, and experiences.</p>
      
      <Polaroid 
        src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        alt="Introduction Image"
        caption="Where it all began..."
        rotation={-2}
      />
      
      <p className="mb-4">
        In the following pages, you'll discover my professional path, the projects I've worked on, and the skills I've developed along the way.
      </p>
      
      <div className="flex justify-end">
        <Button variant="link" className="text-primary-600 dark:text-primary-400 flex items-center gap-2">
          Turn the page to begin <FaArrowRight />
        </Button>
      </div>
    </div>
  </Page>
);

// Beginnings Page
export const BeginningsPage: React.FC = () => (
  <Page pageNumber={3}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">My Beginnings</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="First Computer"
          caption="My first coding project"
          rotation={2}
        />
      </div>
      
      <p className="mb-4">
        It all started when I was young. I discovered my passion for creating and building things that live on screens.
      </p>
      
      <p>
        My first project was a simple website, but it opened up a world of possibilities that I continue to explore today.
      </p>
    </div>
  </Page>
);

// Early Projects Page
export const EarlyProjectsPage: React.FC = () => (
  <Page pageNumber={4}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Early Projects</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Early Project"
          caption="My first team project"
          rotation={-3}
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-2">Learning by Building</h3>
        <p>
          These early projects taught me the fundamentals of software development and the joy of seeing my ideas come to life.
        </p>
      </div>
    </div>
  </Page>
);

// Education Page
export const EducationPage: React.FC = () => (
  <Page pageNumber={5}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Educational Journey</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Education"
          caption="Learning never stops"
          rotation={1}
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-medium">University of Technology</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Computer Science, 2015-2019</p>
        </div>
        
        <div>
          <h3 className="text-xl font-medium">Advanced Certifications</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Web Development, Data Structures, UI/UX Design</p>
        </div>
      </div>
    </div>
  </Page>
);

// First Role Page
export const FirstRolePage: React.FC = () => (
  <Page pageNumber={6}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">First Professional Role</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="First Job"
          caption="First day at work"
          rotation={-2}
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-2">Junior Developer</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">TechStart Inc., 2019-2020</p>
        <p className="mt-2">
          My first role taught me how to work in a professional environment and contribute to team projects with real-world impact.
        </p>
      </div>
    </div>
  </Page>
);

// Key Achievements Page
export const AchievementsPage: React.FC = () => (
  <Page pageNumber={7}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Key Achievements</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Achievement"
          caption="Award ceremony"
          rotation={2}
        />
      </div>
      
      <div className="space-y-4">
        <div className="border-l-4 border-primary-500 pl-4">
          <h3 className="text-xl font-medium">Innovation Award, 2020</h3>
          <p className="text-sm">Recognized for developing a novel solution that increased team productivity by 35%</p>
        </div>
        
        <div className="border-l-4 border-primary-500 pl-4">
          <h3 className="text-xl font-medium">Project Excellence, 2021</h3>
          <p className="text-sm">Led a project that delivered ahead of schedule and exceeded client expectations</p>
        </div>
      </div>
    </div>
  </Page>
);

// Project Alpha Page
export const ProjectAlphaPage: React.FC = () => (
  <Page pageNumber={8}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Major Project: Alpha</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80"
          alt="Project Alpha"
          caption="Project launch day"
          rotation={-1}
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-2">E-commerce Platform</h3>
        <p>
          A comprehensive solution for online retailers featuring inventory management, customer analytics, and secure payment processing.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FaGithub /> View Code
        </Button>
        <Button size="sm" className="flex items-center gap-2">
          Live Demo
        </Button>
      </div>
    </div>
  </Page>
);

// Project Beta Page
export const ProjectBetaPage: React.FC = () => (
  <Page pageNumber={9}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Major Project: Beta</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Project Beta"
          caption="Team collaboration"
          rotation={3}
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-2">Health Tracking App</h3>
        <p>
          A mobile application that helps users track fitness goals, nutrition intake, and health metrics with personalized insights.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FaGithub /> View Code
        </Button>
        <Button size="sm" className="flex items-center gap-2">
          App Store
        </Button>
      </div>
    </div>
  </Page>
);

// Skills Page
export const SkillsPage: React.FC = () => (
  <Page pageNumber={10}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Skills Developed</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Frontend</h3>
          <ul className="text-sm space-y-1">
            <li>React/Next.js</li>
            <li>TypeScript</li>
            <li>CSS/Tailwind</li>
            <li>Responsive Design</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Backend</h3>
          <ul className="text-sm space-y-1">
            <li>Node.js/Express</li>
            <li>API Development</li>
            <li>Database Design</li>
            <li>Authentication</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Tools</h3>
          <ul className="text-sm space-y-1">
            <li>Git/GitHub</li>
            <li>Docker</li>
            <li>AWS/Cloud</li>
            <li>CI/CD Pipelines</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Soft Skills</h3>
          <ul className="text-sm space-y-1">
            <li>Team Collaboration</li>
            <li>Problem Solving</li>
            <li>Project Management</li>
            <li>Communication</li>
          </ul>
        </div>
      </div>
    </div>
  </Page>
);

// Philosophy Page
export const PhilosophyPage: React.FC = () => (
  <Page pageNumber={11}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Philosophy & Approach</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80"
          alt="Philosophy"
          caption="Finding solutions"
          rotation={-2}
        />
      </div>
      
      <div className="space-y-4">
        <p className="italic text-center text-lg mb-6">
          "I believe in creating technology that solves real problems and enhances people's lives."
        </p>
        
        <p>
          My approach combines thoughtful design, robust engineering, and a commitment to continuous learning and improvement.
        </p>
      </div>
    </div>
  </Page>
);

// Current Endeavors Page
export const CurrentPage: React.FC = () => (
  <Page pageNumber={12}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Current Endeavors</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2025&q=80"
          alt="Current Work"
          caption="Building something new"
          rotation={2}
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-2">Senior Developer</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">InnovateTech, 2022-Present</p>
        <p className="mt-2">
          Currently leading development of a cutting-edge platform that will revolutionize how users interact with digital content.
        </p>
      </div>
    </div>
  </Page>
);

// Future Aspirations Page
export const FuturePage: React.FC = () => (
  <Page pageNumber={13}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Future Aspirations</h2>
      
      <div className="flex justify-center mb-6">
        <Polaroid 
          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2020&q=80"
          alt="Future Vision"
          caption="Looking ahead"
          rotation={-3}
        />
      </div>
      
      <div className="space-y-4">
        <p>
          I'm excited to continue growing as a developer and contributing to projects that make a meaningful impact in the world.
        </p>
        
        <p>
          My goals include mentoring new developers, exploring emerging technologies, and eventually leading my own development team.
        </p>
      </div>
    </div>
  </Page>
);

// Personal Interests Page
export const PersonalPage: React.FC = () => (
  <Page pageNumber={14}>
    <div className="h-full">
      <h2 className="text-3xl font-bold mb-6">Personal Interests</h2>
      
      <div className="flex justify-center mb-6">
        <div className="flex gap-4 flex-wrap justify-center">
          <Polaroid 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Hiking"
            caption="Weekend adventures"
            rotation={-2}
          />
          <Polaroid 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2022&q=80"
            alt="Music"
            caption="Playing guitar"
            rotation={3}
          />
        </div>
      </div>
      
      <p className="text-center">
        When I'm not coding, you'll find me hiking mountains, playing guitar, or exploring new coffee shops around the city.
      </p>
    </div>
  </Page>
);

// Contact Page
export const ContactPage: React.FC = () => (
  <Page pageNumber={15}>
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
      
      <div className="mb-6">
        <p className="mb-4">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-3">
            <FaEnvelope className="text-primary-600 dark:text-primary-400" />
            <a href="mailto:hello@example.com" className="hover:text-primary-600 dark:hover:text-primary-400">
              hello@example.com
            </a>
          </div>
          
          <div className="flex gap-4">
            <a href="https://github.com" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              <FaLinkedinIn size={20} />
            </a>
            <a href="https://twitter.com" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-auto text-center pb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Thank you for reading my story!
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} - All rights reserved
        </p>
      </div>
    </div>
  </Page>
);