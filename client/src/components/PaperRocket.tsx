import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, RefreshCw, Wind } from 'lucide-react';

// Constants for physics
const GRAVITY = 9.8;
const AIR_RESISTANCE_FACTOR = 0.02;
const WIND_STRENGTH_RANGE = 2.0;

// Game states
type GameState = 'setup' | 'playing' | 'gameover';

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

interface PinData {
  position: Point;
  hit: boolean;
  value: number;
}

const PaperRocket: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('setup');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  
  // Physics state
  const [physics, setPhysics] = useState<RocketPhysics>({
    position: { x: 50, y: 500 },
    velocity: { x: 0, y: 0 },
    angle: 45,
    power: 50,
    windStrength: (Math.random() * 2 - 1) * WIND_STRENGTH_RANGE
  });
  
  // Pins state
  const [pins, setPins] = useState<PinData[]>([]);
  
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // Generate pins
  useEffect(() => {
    // Create bowling-style pins arrangement
    const newPins: PinData[] = [];
    const lanes = 4; // Number of rows of pins
    const pinSize = 20;
    const spacing = 50;
    const startX = 600;
    const startY = 500 - pinSize;
    
    let totalValue = 0;
    
    for (let row = 0; row < lanes; row++) {
      for (let col = 0; col <= row; col++) {
        // Calculate pin position
        const x = startX + (col - row/2) * spacing;
        const y = startY - row * spacing;
        
        // Assign point value (pins at the back are worth more)
        const value = (row + 1) * 10;
        totalValue += value;
        
        newPins.push({
          position: { x, y },
          hit: false,
          value
        });
      }
    }
    
    setPins(newPins);
    setMaxScore(totalValue);
  }, [attempts]); // Regenerate pins when starting a new attempt
  
  // Handle launching the rocket
  const handleLaunchRocket = () => {
    setGameState('playing');
    setAttempts(prev => prev + 1);
    
    // Set initial velocity based on angle and power
    const radians = physics.angle * Math.PI / 180;
    const velocity = {
      x: Math.cos(radians) * physics.power / 5,
      y: -Math.sin(radians) * physics.power / 5
    };
    
    setPhysics(prev => ({
      ...prev,
      position: { x: 50, y: 500 },
      velocity
    }));
    
    // Reset score for this attempt
    setScore(0);
  };
  
  // Handle resetting the game
  const handleReset = () => {
    setGameState('setup');
    setPhysics(prev => ({
      ...prev,
      position: { x: 50, y: 500 },
      velocity: { x: 0, y: 0 },
      angle: 45,
      power: 50,
      windStrength: (Math.random() * 2 - 1) * WIND_STRENGTH_RANGE
    }));
  };

  // Animation loop for the game
  useEffect(() => {
    if (gameState !== 'playing') return;
    
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
      
      // Draw the pins
      drawPins(ctx);
      
      // Draw the rocket
      drawRocket(ctx);
      
      // Check for collisions with pins
      checkPinCollisions();
      
      // Check for collision with the ground or boundaries
      if (physics.position.y >= 500 || 
          physics.position.x < 0 || 
          physics.position.x > canvas.width || 
          physics.position.y < 0 || 
          physics.position.y > canvas.height) {
        // Game over
        setGameState('gameover');
        return;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState]);
  
  // Check for collisions with pins
  const checkPinCollisions = () => {
    const rocketRadius = 15; // Approximate rocket size for collision
    
    setPins(prevPins => {
      let scoreToAdd = 0;
      const newPins = prevPins.map(pin => {
        if (pin.hit) return pin; // Already hit
        
        // Calculate distance between rocket and pin
        const distance = Math.sqrt(
          Math.pow(physics.position.x - pin.position.x, 2) + 
          Math.pow(physics.position.y - pin.position.y, 2)
        );
        
        // Check for collision (pin radius is 20)
        if (distance < rocketRadius + 20) {
          scoreToAdd += pin.value;
          return { ...pin, hit: true };
        }
        
        return pin;
      });
      
      // Update score if any pins were hit
      if (scoreToAdd > 0) {
        setScore(prev => prev + scoreToAdd);
      }
      
      return newPins;
    });
  };
  
  // Draw the background
  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 500);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, 500);
    
    // Ground
    const groundGradient = ctx.createLinearGradient(0, 500, 0, 600);
    groundGradient.addColorStop(0, '#8B4513');
    groundGradient.addColorStop(1, '#654321');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, 500, ctx.canvas.width, 100);
    
    // Bowling lane
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 480, ctx.canvas.width, 20);
    
    // Lane stripes/markings
    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, 490);
    ctx.lineTo(ctx.canvas.width, 490);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw score in the top corner
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);
    
    // Wind indicator
    const centerX = ctx.canvas.width - 100;
    const centerY = 40;
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
  
  // Draw the bowling pins
  const drawPins = (ctx: CanvasRenderingContext2D) => {
    pins.forEach(pin => {
      const { x, y } = pin.position;
      
      // Pin body
      ctx.fillStyle = pin.hit ? 'rgba(255, 255, 255, 0.3)' : 'white';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Red stripes on pin if not hit
      if (!pin.hit) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Score value
      ctx.font = '12px Arial';
      ctx.fillStyle = pin.hit ? 'rgba(0, 0, 0, 0.3)' : 'black';
      ctx.textAlign = 'center';
      ctx.fillText(`${pin.value}`, x, y + 5);
    });
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
    ctx.fillStyle = '#e6e6c9';
    ctx.beginPath();
    ctx.moveTo(20, 0);  // Nose
    ctx.lineTo(-20, -10); // Bottom left
    ctx.lineTo(-15, 0);  // Middle indent
    ctx.lineTo(-20, 10);  // Bottom right
    ctx.closePath();
    ctx.fill();
    
    // Draw rocket fins
    ctx.fillStyle = '#d5d5b5';
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

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="mb-4 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">Paper Rocket Bowling Challenge</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Launch your paper rocket to knock down as many pins as possible! Aim carefully and watch for wind.
        </p>
      </div>

      {/* Canvas for the game */}
      <div className="relative w-full max-w-4xl h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="absolute top-0 left-0 w-full h-full"
        />
        
        {/* Setup controls */}
        {gameState === 'setup' && (
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
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-2xl font-bold mb-2 text-center">
                {score === maxScore ? '🎉 Perfect Game!' : 
                 score > maxScore * 0.7 ? '🎳 Great Roll!' : 
                 score > maxScore * 0.3 ? '👍 Nice Try!' : 
                 '🤔 Better Luck Next Time!'}
              </h3>
              
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-sm">points</p>
              </div>
              
              <div className="mb-4">
                <p className="text-center text-sm">
                  {score === maxScore 
                    ? "Incredible! You knocked down all the pins perfectly!"
                    : score > maxScore * 0.7
                      ? "Great accuracy! You're a natural at rocket bowling!"
                      : score > maxScore * 0.3 
                        ? "Good effort! Try adjusting for the wind next time."
                        : "The pins are tricky! Try a different angle and power."}
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
      
      {/* Help text */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        <p className="mb-2">
          {gameState === 'setup' && "Set your angle and power, then launch your rocket!"}
          {gameState === 'playing' && "Watch your rocket fly and knock down pins!"}
          {gameState === 'gameover' && "How many pins did you hit? Try again for a higher score!"}
        </p>
      </div>
    </div>
  );
};

export default PaperRocket;