import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useTheme } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Individual page component
interface PageProps {
  pageNumber: number;
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children, pageNumber }) => {
  return (
    <div className="page relative overflow-hidden h-full">
      <div className="page-content p-6 h-full overflow-hidden flex flex-col">
        {children}
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-gray-400 dark:text-gray-600">
        {pageNumber}
      </div>
    </div>
  );
};

// Polaroid image component
interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
}

export const Polaroid: React.FC<PolaroidProps> = ({ src, alt, caption, rotation = 0 }) => {
  return (
    <div 
      className="polaroid bg-white p-2 shadow-md inline-block max-w-[80%] mb-4 mx-auto transform transition-transform hover:scale-105"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="polaroid-image bg-gray-100 overflow-hidden">
        <img src={src} alt={alt} className="w-full object-cover" />
      </div>
      {caption && (
        <div className="text-center p-2 text-sm font-handwriting">
          {caption}
        </div>
      )}
    </div>
  );
};

// Book component props
interface BookProps {
  pages: React.ReactNode[];
}

// Book component
const Book: React.FC<BookProps> = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<any>(null);
  const { theme } = useTheme();
  
  const totalPages = pages.length;
  
  const handlePageFlip = (e: any) => {
    setCurrentPage(e.data);
  };
  
  const nextPage = () => {
    if (bookRef.current && currentPage < totalPages - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  };
  
  const prevPage = () => {
    if (bookRef.current && currentPage > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  };
  
  // Table of contents dialog
  const TableOfContents = () => {
    const contents = [
      { title: "Cover", page: 0 },
      { title: "Introduction", page: 1 },
      { title: "My Beginnings", page: 2 },
      { title: "Early Projects", page: 3 },
      { title: "Educational Journey", page: 4 },
      { title: "First Professional Role", page: 5 },
      { title: "Key Achievements", page: 6 },
      { title: "Major Project: Alpha", page: 7 },
      { title: "Major Project: Beta", page: 8 },
      { title: "Skills Developed", page: 9 },
      { title: "Philosophy & Approach", page: 10 },
      { title: "Current Endeavors", page: 11 },
      { title: "Future Aspirations", page: 12 },
      { title: "Personal Interests", page: 13 },
      { title: "Contact Information", page: 14 },
    ];
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="absolute top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mb-4">Table of Contents</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <ul className="space-y-2">
              {contents.map((item) => (
                <li key={item.page}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left"
                    onClick={() => {
                      bookRef.current.pageFlip().flip(item.page);
                    }}
                  >
                    <span className="mr-2 text-gray-500">{item.page}.</span>
                    {item.title}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  return (
    <div className="book-container relative flex flex-col items-center justify-center w-full">
      <TableOfContents />
      
      <div className="book-wrapper w-full max-w-5xl mx-auto">
        <HTMLFlipBook
          ref={bookRef}
          width={550}
          height={733}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          showCover={true}
          flippingTime={1000}
          usePortrait={true}
          startPage={0}
          drawShadow={true}
          maxShadowOpacity={0.5}
          useMouseEvents={true}
          swipeDistance={30}
          className={`${theme === 'dark' ? 'dark-book' : 'light-book'}`}
          onFlip={handlePageFlip}
          autoSize={true}
          mobileScrollSupport={true}
          clickEventForward={true}
          style={{ margin: "0 auto" }}
          startZIndex={0}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {pages.map((pageContent, index) => (
            <div key={index} className={`book-page ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-amber-50 text-gray-800'} h-full w-full`}>
              {pageContent}
            </div>
          ))}
        </HTMLFlipBook>
      </div>
      
      <div className="book-controls flex justify-center items-center mt-6 gap-4">
        <Button 
          onClick={prevPage} 
          disabled={currentPage === 0}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button 
          onClick={nextPage} 
          disabled={currentPage === totalPages - 1}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Book;