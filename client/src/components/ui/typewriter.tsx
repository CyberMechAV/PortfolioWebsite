import { useState, useEffect } from "react";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export default function Typewriter({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1000,
  className = ""
}: TypewriterProps) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    const tick = () => {
      if (isDeleting) {
        // Deleting text
        setText(currentPhrase.substring(0, text.length - 1));
        
        // When deleted completely, start typing the next phrase
        if (text.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
          return deletingSpeed * 2; // A little pause before typing the next word
        }
        
        return deletingSpeed;
      } else {
        // Typing text
        setText(currentPhrase.substring(0, text.length + 1));
        
        // When typed completely, start deleting after a pause
        if (text.length === currentPhrase.length) {
          setIsDeleting(true);
          return pauseTime; // Pause at the end before deleting
        }
        
        return typingSpeed;
      }
    };
    
    const timeout = setTimeout(() => {
      const nextDelay = tick();
      clearTimeout(timeout);
      setTimeout(() => {}, nextDelay);
    }, isDeleting ? deletingSpeed : text.length === currentPhrase.length ? pauseTime : typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [text, phraseIndex, isDeleting, phrases, typingSpeed, deletingSpeed, pauseTime]);
  
  return <div className={className}>{text}</div>;
}
