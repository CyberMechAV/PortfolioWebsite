import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Scissors, 
  Target, 
  Wind 
} from 'lucide-react';

// Constants for physics
const GRAVITY = 9.8;
const AIR_RESISTANCE_FACTOR = 0.02;
const WIND_STRENGTH_RANGE = 2.0;

// Rocket states
type RocketState = 'page' | 'torn' | 'folded' | 'ready' | 'flying' | 'landed';

interface Point {
  x: number;
  y: number;
}

interface RocketPhysics {
  position: Point;
  velocity: Point;
  angle: number;
  power: number;
  windStrength: number;
}

const PaperRocket: React.FC = () => {
  // State for the rocket's progression
  const [rocketState, setRocketState] = useState<RocketState>('page');
  const [tutorial, setTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Game state
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  
  // Physics state
  const [physics, setPhysics] = useState<RocketPhysics>({
    position: { x: 50, y: 500 },
    velocity: { x: 0, y: 0 },
    angle: 45,
    power: 50,
    windStrength: (Math.random() * 2 - 1) * WIND_STRENGTH_RANGE
  });
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // Target position
  const [targetPosition, setTargetPosition] = useState<Point>({ x: 750, y: 500 });
  
  // Handle tearing the page
  const handleTearPage = () => {
    setRocketState('torn');
    if (tutorial) {
      setTutorialStep(1);
    }
  };
  
  // Handle folding the rocket
  const handleFoldRocket = () => {
    setRocketState('folded');
    if (tutorial) {
      setTutorialStep(2);
    }
  };
  
  // Handle setting up the launch
  const handlePrepareRocket = () => {
    setRocketState('ready');
    if (tutorial) {
      setTutorialStep(3);
    }
  };
  
  // Handle launching the rocket
  const handleLaunchRocket = () => {
    setRocketState('flying');
    setAttempts(attempts + 1);
    
    // Set initial velocity based on angle and power
    const radians = physics.angle * Math.PI / 180;
    const velocity = {
      x: Math.cos(radians) * physics.power / 5,
      y: -Math.sin(radians) * physics.power / 5
    };
    
    setPhysics(prev => ({
      ...prev,
      velocity
    }));
    
    if (tutorial) {
      setTutorialStep(4);
    }
  };
  
  // Handle resetting the game
  const handleReset = () => {
    setRocketState('page');
    setGameOver(false);
    setPhysics({
      position: { x: 50, y: 500 },
      velocity: { x: 0, y: 0 },
      angle: 45,
      power: 50,
      windStrength: (Math.random() * 2 - 1) * WIND_STRENGTH_RANGE
    });
    if (tutorial) {
      setTutorialStep(0);
    }
  };
  
  // Skip tutorial
  const skipTutorial = () => {
    setTutorial(false);
  };

  // Animation loop for the flying rocket
  useEffect(() => {
    if (rocketState !== 'flying') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const deltaTime = (time - lastTime) / 1000; // Convert to seconds
      lastTime = time;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update physics
      setPhysics(prev => {
        const newPos = {
          x: prev.position.x + prev.velocity.x * deltaTime * 60,
          y: prev.position.y + prev.velocity.y * deltaTime * 60
        };
        
        // Apply gravity
        const gravityEffect = GRAVITY * deltaTime;
        
        // Apply air resistance (proportional to velocity squared)
        const airResistanceX = Math.sign(prev.velocity.x) * Math.pow(Math.abs(prev.velocity.x), 2) * AIR_RESISTANCE_FACTOR;
        const airResistanceY = Math.sign(prev.velocity.y) * Math.pow(Math.abs(prev.velocity.y), 2) * AIR_RESISTANCE_FACTOR;
        
        // Apply wind effect
        const windEffect = prev.windStrength * deltaTime;
        
        const newVelocity = {
          x: prev.velocity.x - airResistanceX + windEffect,
          y: prev.velocity.y + gravityEffect - airResistanceY
        };
        
        return {
          ...prev,
          position: newPos,
          velocity: newVelocity
        };
      });
      
      // Draw the background
      drawBackground(ctx);
      
      // Draw the target
      drawTarget(ctx);
      
      // Draw the rocket
      drawRocket(ctx);
      
      // Check for collision with the ground
      if (physics.position.y >= 500) {
        handleLanding();
        return;
      }
      
      // Check if rocket is out of bounds
      if (physics.position.x < 0 || physics.position.x > canvas.width || physics.position.y > canvas.height) {
        handleOutOfBounds();
        return;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [rocketState]);
  
  // Draw the background
  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, ctx.canvas.width, 500);
    
    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 500, ctx.canvas.width, 100);
    
    // Wind indicator
    const centerX = 100;
    const centerY = 100;
    const windLength = 30 * Math.abs(physics.windStrength) / WIND_STRENGTH_RANGE;
    const direction = physics.windStrength > 0 ? 0 : Math.PI;
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(direction) * windLength, centerY + Math.sin(direction) * windLength);
    ctx.stroke();
    
    // Wind text
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Wind: ${physics.windStrength.toFixed(1)}`, centerX, centerY - 15);
  };
  
  // Draw the target
  const drawTarget = (ctx: CanvasRenderingContext2D) => {
    const { x, y } = targetPosition;
    
    // Target pole
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 5, y - 80, 10, 80);
    
    // Target circle
    ctx.beginPath();
    ctx.arc(x, y - 80, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y - 80, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y - 80, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y - 80, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  };
  
  // Draw the rocket
  const drawRocket = (ctx: CanvasRenderingContext2D) => {
    const { x, y } = physics.position;
    const angle = Math.atan2(physics.velocity.y, physics.velocity.x);
    
    // Save context
    ctx.save();
    
    // Translate and rotate
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Draw rocket body
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(20, 0);  // Nose
    ctx.lineTo(-20, -10); // Bottom left
    ctx.lineTo(-15, 0);  // Middle indent
    ctx.lineTo(-20, 10);  // Bottom right
    ctx.closePath();
    ctx.fill();
    
    // Draw rocket fins
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-30, -15);
    ctx.lineTo(-20, -10);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-30, 15);
    ctx.lineTo(-20, 10);
    ctx.closePath();
    ctx.fill();
    
    // Restore context
    ctx.restore();
  };
  
  // Handle landing
  const handleLanding = () => {
    cancelAnimationFrame(animationRef.current);
    setRocketState('landed');
    
    // Calculate distance to target
    const distance = Math.sqrt(
      Math.pow(physics.position.x - targetPosition.x, 2) + 
      Math.pow(physics.position.y - (targetPosition.y - 80), 2)
    );
    
    // Calculate score (max 100 points)
    const newScore = Math.max(0, Math.floor(100 - distance / 5));
    setScore(newScore);
    
    // Set game over
    setGameOver(true);
    
    if (tutorial && tutorialStep === 4) {
      setTutorialStep(5);
    }
  };
  
  // Handle out of bounds
  const handleOutOfBounds = () => {
    cancelAnimationFrame(animationRef.current);
    setRocketState('landed');
    setScore(0);
    setGameOver(true);
    
    if (tutorial && tutorialStep === 4) {
      setTutorialStep(5);
    }
  };
  
  // Tutorial content
  const tutorialContent = [
    "First, tear the page off the book by clicking the scissors button.",
    "Now, fold the paper into a rocket by clicking the fold button.",
    "Set up your rocket for launch by adjusting the angle and power.",
    "Click 'Launch Rocket' to send your creation flying!",
    "Watch your rocket fly! Wind and gravity will affect its path.",
    "Game over! Click 'Try Again' to restart or skip the tutorial to play freely."
  ];

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="mb-4 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">Paper Rocket Challenge</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tear the last page of the book, fold it into a rocket, and hit the target!
        </p>
      </div>

      {/* Tutorial overlay */}
      {tutorial && (
        <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Tutorial: Step {tutorialStep + 1}/6</h3>
            <Button variant="outline" size="sm" onClick={skipTutorial}>
              Skip Tutorial
            </Button>
          </div>
          <p className="mt-2">{tutorialContent[tutorialStep]}</p>
        </div>
      )}

      {/* Canvas for the game */}
      <div className="relative w-full max-w-4xl h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Canvas for rocket physics */}
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="absolute top-0 left-0 w-full h-full"
        />
        
        {/* Rocket build stages */}
        {rocketState === 'page' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-amber-50 dark:bg-amber-900 w-3/4 h-4/5 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-4">Thank You for Viewing My Portfolio!</h3>
              <p className="text-center max-w-md mb-8">
                This final page can be torn off and folded into a paper rocket. Let's try it!
              </p>
              <Button onClick={handleTearPage} className="gap-2">
                <Scissors size={16} /> Tear this page
              </Button>
            </div>
          </div>
        )}
        
        {rocketState === 'torn' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-amber-50 dark:bg-amber-900 w-3/4 h-4/5 rounded-lg shadow-lg flex flex-col items-center justify-center transform rotate-3">
              <h3 className="text-xl font-bold mb-4">Nice! Now Let's Fold It</h3>
              <p className="text-center max-w-md mb-8">
                Follow these steps to fold this page into a paper rocket:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-center">1. Fold in half lengthwise</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-center">2. Fold corners to center</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-center">3. Fold sides inward twice</p>
                </div>
              </div>
              <Button onClick={handleFoldRocket} className="gap-2">
                <ArrowRight size={16} /> Continue
              </Button>
            </div>
          </div>
        )}
        
        {rocketState === 'folded' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center p-4 mb-4">
                <h3 className="text-xl font-bold mb-2">Your Paper Rocket is Ready!</h3>
                <p className="text-center max-w-md mb-4">
                  Let's prepare for launch. Set your angle and power.
                </p>
              </div>
              
              <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-8">
                {/* Rocket illustration */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-40 h-60">
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="w-16 h-40 bg-amber-50 dark:bg-amber-900 transform rotate-3 origin-bottom" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="transform -rotate-3 text-xs text-center">Paper Rocket</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handlePrepareRocket} className="w-full gap-2">
                  <Target size={16} /> Prepare for Launch
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {rocketState === 'ready' && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span>Launch Angle: {physics.angle.toFixed(0)}°</span>
                <Slider
                  value={[physics.angle]}
                  min={10}
                  max={80}
                  step={1}
                  className="w-64"
                  onValueChange={(value) => setPhysics(prev => ({ ...prev, angle: value[0] }))}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span>Power: {physics.power.toFixed(0)}%</span>
                <Slider
                  value={[physics.power]}
                  min={10}
                  max={100}
                  step={1}
                  className="w-64"
                  onValueChange={(value) => setPhysics(prev => ({ ...prev, power: value[0] }))}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Wind size={16} /> Wind: {physics.windStrength > 0 ? 'Right' : 'Left'} ({Math.abs(physics.windStrength).toFixed(1)})
                </span>
              </div>
              
              <Button onClick={handleLaunchRocket} className="w-full gap-2">
                <Play size={16} /> Launch Rocket
              </Button>
            </div>
          </div>
        )}
        
        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-2xl font-bold mb-2 text-center">
                {score > 70 ? '🎉 Great Shot!' : score > 30 ? '👍 Not Bad!' : '🤔 Try Again!'}
              </h3>
              
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-sm">points</p>
              </div>
              
              <div className="mb-4">
                <p className="text-center text-sm">
                  {score > 70 
                    ? "Amazing accuracy! You're a natural rocket engineer!"
                    : score > 30 
                      ? "Getting closer to the target. Adjust for the wind!"
                      : "The target is tricky! Try a different angle and power."}
                </p>
              </div>
              
              <p className="text-center text-xs mb-4">
                Attempts: {attempts}
              </p>
              
              <Button onClick={handleReset} className="w-full gap-2">
                <RefreshCw size={16} /> Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperRocket;