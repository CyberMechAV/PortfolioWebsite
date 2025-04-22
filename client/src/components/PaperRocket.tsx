import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy } from 'lucide-react';

// Simple, fun memory card game
const PaperRocket: React.FC = () => {
  // Game state
  const [flipped, setFlipped] = useState<boolean[]>(Array(16).fill(false));
  const [matched, setMatched] = useState<boolean[]>(Array(16).fill(false));
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [firstSelection, setFirstSelection] = useState<number | null>(null);
  const [secondSelection, setSecondSelection] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Card emoji pairs (8 pairs for 16 cards)
  const cardEmojis = ['🚀', '🌟', '🌎', '🌈', '🎯', '🎁', '🎨', '🎮'];
  const cardValues = [...cardEmojis, ...cardEmojis];
  
  // Shuffle the cards
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  
  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('memoryGameBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    
    // Initial shuffle
    setShuffledCards([...cardValues].sort(() => Math.random() - 0.5));
  }, []);
  
  // Handle card click
  const handleCardClick = (index: number) => {
    // Ignore clicks if the game is locked or card is already matched/flipped
    if (isLocked || matched[index] || flipped[index]) return;
    
    // Flip the card
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);
    
    // Handle selection logic
    if (firstSelection === null) {
      // First card selection
      setFirstSelection(index);
    } else if (secondSelection === null && firstSelection !== index) {
      // Second card selection
      setSecondSelection(index);
      setMoves(moves + 1);
      
      // Check for a match
      const isMatch = shuffledCards[firstSelection] === shuffledCards[index];
      
      if (isMatch) {
        // Cards match - keep them flipped
        const newMatched = [...matched];
        newMatched[firstSelection] = true;
        newMatched[index] = true;
        setMatched(newMatched);
        
        // Reset selections
        setFirstSelection(null);
        setSecondSelection(null);
        
        // Check if all cards are matched
        if (newMatched.every(m => m)) {
          // Game complete!
          setGameComplete(true);
          
          // Update best score
          if (bestScore === null || moves + 1 < bestScore) {
            setBestScore(moves + 1);
            localStorage.setItem('memoryGameBestScore', (moves + 1).toString());
          }
        }
      } else {
        // Cards don't match - flip them back after a delay
        setIsLocked(true);
        setTimeout(() => {
          const newFlipped = [...flipped];
          newFlipped[firstSelection] = false;
          newFlipped[index] = false;
          setFlipped(newFlipped);
          
          // Reset selections
          setFirstSelection(null);
          setSecondSelection(null);
          setIsLocked(false);
        }, 1000);
      }
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setFlipped(Array(16).fill(false));
    setMatched(Array(16).fill(false));
    setMoves(0);
    setFirstSelection(null);
    setSecondSelection(null);
    setIsLocked(false);
    setGameComplete(false);
    setShuffledCards([...cardValues].sort(() => Math.random() - 0.5));
  };
  
  // Card color based on match state
  const getCardColor = (index: number) => {
    if (matched[index]) return 'bg-green-100 dark:bg-green-800 border-2 border-green-500';
    if (flipped[index]) return 'bg-amber-100 dark:bg-amber-800';
    return 'bg-blue-100 dark:bg-blue-900';
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <div className="mb-4 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Memory Card Game</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Find all matching pairs with the fewest moves.
        </p>
        
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{moves}</span>
            <span className="text-xs text-gray-500">Moves</span>
          </div>
          
          {bestScore !== null && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 font-bold text-lg text-amber-600 dark:text-amber-400">
                <Trophy size={16} />
                <span>{bestScore}</span>
              </div>
              <span className="text-xs text-gray-500">Best</span>
            </div>
          )}
          
          <Button onClick={resetGame} size="sm" className="flex items-center gap-1">
            <RefreshCw size={14} /> Reset
          </Button>
        </div>
      </div>
      
      {/* Card Grid */}
      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {shuffledCards.map((card, index) => (
          <div 
            key={index}
            className={`
              aspect-square rounded-lg cursor-pointer shadow-md
              transition-all duration-300 transform
              ${getCardColor(index)}
              hover:scale-105 hover:shadow-lg
              perspective-500
            `}
            onClick={() => handleCardClick(index)}
          >
            <div className={`
              w-full h-full flex items-center justify-center text-4xl
              transition-transform duration-300
              ${flipped[index] || matched[index] ? 'rotate-y-180' : ''}
            `}>
              {(flipped[index] || matched[index]) ? (
                <div className="flex items-center justify-center w-full h-full">
                  {card}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-2xl font-bold text-blue-500 dark:text-blue-300">?</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Game Complete Message */}
      {gameComplete && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm animate-fadeIn">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
          <p className="mb-2">You completed the game in {moves} moves.</p>
          
          {bestScore === moves && (
            <div className="text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-1 mb-4">
              <Trophy size={18} />
              <span>New Best Score!</span>
            </div>
          )}
          
          <Button onClick={resetGame} className="mt-2 w-full">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaperRocket;