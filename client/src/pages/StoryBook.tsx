import React, { useState, useEffect } from 'react';
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
import { Polaroid } from '@/components/Book';
import { useQuery } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the interface for polaroid image data
interface PolaroidImage {
  id: number;
  url: string;
  caption: string | null;
  rotation: number;
  createdAt: string;
}

export default function StoryBook() {
  const { toast } = useToast();
  
  // Fetch polaroid images from the database
  const { 
    data: polaroidImages = [], 
    isLoading,
    isError,
    refetch 
  } = useQuery<PolaroidImage[]>({
    queryKey: ['/api/polaroids'],
    staleTime: 1000 * 60, // 1 minute
  });
  
  const handleImageUploaded = (imageData: PolaroidImage) => {
    // The query will automatically refetch due to invalidation in the mutation
    toast({
      title: "Success!",
      description: "Your polaroid has been added to your collection.",
    });
  };

  const handleDeleteImage = async (id: number) => {
    try {
      await fetch(`/api/polaroids/${id}`, {
        method: 'DELETE',
      });
      
      // Refetch the polaroid images
      refetch();
      
      toast({
        title: "Image deleted",
        description: "The polaroid has been removed from your collection.",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the image. Please try again.",
        variant: "destructive"
      });
    }
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
          <div className="mt-20 mb-10 w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">My Polaroid Collection</h2>
            
            {isLoading ? (
              <div className="text-center py-10">Loading your polaroids...</div>
            ) : isError ? (
              <div className="text-center py-10 text-red-500">
                Error loading images. Please try again later.
              </div>
            ) : polaroidImages.length === 0 ? (
              <div className="text-center py-10 text-gray-600 dark:text-gray-400">
                No polaroids yet. Add your first photo using the "Add Photo" button.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {polaroidImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <Polaroid 
                      src={image.url} 
                      alt={image.caption || 'Polaroid photo'} 
                      caption={image.caption || ''} 
                      rotation={image.rotation} 
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <footer className="w-full py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} My Digital Storybook Portfolio
        </footer>
      </div>
    </ThemeProvider>
  );
}