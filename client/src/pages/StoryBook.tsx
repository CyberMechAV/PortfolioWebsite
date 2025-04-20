import React, { useState } from 'react';
import Book from '@/components/Book';
import { 
  CoverPage,
  IntroductionPage,
  BeginningsPage,
  EarlyProjectsPage,
  EducationPage,
  FirstRolePage,
  AchievementsPage,
  ProjectAlphaPage,
  ProjectBetaPage,
  SkillsPage,
  PhilosophyPage,
  CurrentPage,
  FuturePage,
  PersonalPage,
  ContactPage
} from '@/components/BookPages';
import { ThemeProvider, ThemeToggle } from '@/components/ui/theme-toggle';
import ImageUploader from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';

export default function StoryBook() {
  const [customImages, setCustomImages] = useState<Array<{id: string; url: string; caption: string}>>([]);
  
  const handleImageUploaded = (imageData: {id: string; url: string; caption: string}) => {
    setCustomImages(prevImages => [...prevImages, imageData]);
  };

  // Default pages to display in the book
  const bookPages = [
    <CoverPage key="cover" />,
    <IntroductionPage key="intro" />,
    <BeginningsPage key="beginnings" />,
    <EarlyProjectsPage key="early" />,
    <EducationPage key="education" />,
    <FirstRolePage key="first-role" />,
    <AchievementsPage key="achievements" />,
    <ProjectAlphaPage key="project-alpha" />,
    <ProjectBetaPage key="project-beta" />,
    <SkillsPage key="skills" />,
    <PhilosophyPage key="philosophy" />,
    <CurrentPage key="current" />,
    <FuturePage key="future" />,
    <PersonalPage key="personal" />,
    <ContactPage key="contact" />
  ];
  
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 flex flex-col items-center">
        <header className="w-full py-4 px-6 flex justify-end items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <ImageUploader onImageUploaded={handleImageUploaded} />
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">My Digital Storybook</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Flip through the pages to explore my journey
            </p>
          </div>
          
          {/* Book Component */}
          <div className="flex-1 flex items-center justify-center">
            <Book pages={bookPages} />
          </div>
          
          {/* User uploaded images section */}
          {customImages.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Your Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {customImages.map((image) => (
                  <div key={image.id} className="bg-white p-2 shadow-md">
                    <img src={image.url} alt={image.caption} className="w-full h-32 object-cover" />
                    {image.caption && (
                      <p className="mt-2 text-center text-sm font-handwriting">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        
        <footer className="w-full py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} My Digital Storybook Portfolio
        </footer>
      </div>
    </ThemeProvider>
  );
}