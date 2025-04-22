import React, { useState, useRef, useEffect, TouchEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Target, 
  Wind,
  Maximize2,
  Scissors
} from 'lucide-react';

// Constants for physics
const GRAVITY = 9.8;
const AIR_RESISTANCE_FACTOR = 0.02;
const WIND_STRENGTH_RANGE = 2.0;

// Rocket states
type RocketState = 'page' | 'tearing' | 'folding' | 'ready' | 'flying' | 'landed';
type FoldingStep = 'start' | 'half' | 'corners' | 'sides' | 'complete';

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

interface TearPoint {
  x: number;
  y: number;
  progress: number; // 0 to 1 for tear animation
}

const PaperRocket: React.FC = () => {
  // State for the rocket's progression
  const [rocketState, setRocketState] = useState<RocketState>('page');
  const [foldingStep, setFoldingStep] = useState<FoldingStep>('start');
  
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
  
  // Tearing interaction state
  const [tearStart, setTearStart] = useState<Point | null>(null);
  const [tearCurrent, setTearCurrent] = useState<Point | null>(null);
  const [tearComplete, setTearComplete] = useState(false);
  const [tearProgress, setTearProgress] = useState(0);
  const [tearPoints, setTearPoints] = useState<TearPoint[]>([]);
  
  // Folding interaction state
  const [foldProgress, setFoldProgress] = useState(0);
  const [doubleTapStart, setDoubleTapStart] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tearCanvasRef = useRef<HTMLCanvasElement>(null);
  const foldCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Target position
  const [targetPosition, setTargetPosition] = useState<Point>({ x: 750, y: 500 });
  
  // Handle double tap detection
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTapTime;
    
    if (timeDiff < 300) { // Double tap detected
      // Get position of the tap
      const clientX = 'touches' in e 
        ? e.touches[0].clientX 
        : e.clientX;
      const clientY = 'touches' in e 
        ? e.touches[0].clientY 
        : e.clientY;
      
      if (rocketState === 'page') {
        // Start the tear at the double tap position
        const rect = pageRef.current?.getBoundingClientRect();
        if (rect) {
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          setTearStart({ x, y });
          setTearPoints([{ x, y, progress: 0 }]);
          setRocketState('tearing');
        }
      } else if (rocketState === 'tearing' && tearComplete) {
        // Move to folding state
        setRocketState('folding');
        setFoldingStep('start');
        setFoldProgress(0);
      } else if (rocketState === 'folding') {
        // Progress through folding steps
        advanceFoldingStep();
      }
    }
    
    setLastTapTime(now);
  };
  
  // Handle tear dragging
  const handleTearDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (rocketState !== 'tearing' || tearComplete) return;
    
    // Get position of the drag
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : e.clientX;
    const clientY = 'touches' in e 
      ? e.touches[0].clientY 
      : e.clientY;
    
    const rect = pageRef.current?.getBoundingClientRect();
    if (rect && tearStart) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setTearCurrent({ x, y });
      
      // Calculate tear progress
      const totalDistance = Math.sqrt(
        Math.pow(rect.width, 2) + Math.pow(rect.height, 2)
      );
      const currentDistance = Math.sqrt(
        Math.pow(x - tearStart.x, 2) + Math.pow(y - tearStart.y, 2)
      );
      const progress = Math.min(1, currentDistance / (totalDistance * 0.6));
      setTearProgress(progress);
      
      // Add tear point if we've moved enough
      const lastPoint = tearPoints[tearPoints.length - 1];
      const distFromLast = Math.sqrt(
        Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2)
      );
      
      if (distFromLast > 10) {
        setTearPoints([...tearPoints, { x, y, progress }]);
      }
      
      // Check if tear is complete
      if (progress >= 0.95) {
        setTearComplete(true);
      }
    }
  };
  
  // Advance folding step
  const advanceFoldingStep = () => {
    setFoldProgress(0);
    
    switch (foldingStep) {
      case 'start':
        setFoldingStep('half');
        break;
      case 'half':
        setFoldingStep('corners');
        break;
      case 'corners':
        setFoldingStep('sides');
        break;
      case 'sides':
        setFoldingStep('complete');
        // When folding is complete, go to ready state
        setRocketState('ready');
        break;
      default:
        break;
    }
  };
  
  // Handle folding animation
  useEffect(() => {
    if (rocketState !== 'folding') return;
    
    const foldAnimationInterval = setInterval(() => {
      setFoldProgress((prev) => {
        const newProgress = prev + 0.01;
        if (newProgress >= 1) {
          clearInterval(foldAnimationInterval);
          // Wait a moment before advancing to next fold
          setTimeout(() => {
            advanceFoldingStep();
          }, 300);
          return 1;
        }
        return newProgress;
      });
    }, 20);
    
    return () => {
      clearInterval(foldAnimationInterval);
    };
  }, [rocketState, foldingStep]);
  
  // Draw tear guidelines and tear
  useEffect(() => {
    if (rocketState !== 'tearing' || !tearCanvasRef.current) return;
    
    const canvas = tearCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw dashed line as guide for tearing
    if (tearStart && !tearComplete) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tearStart.x, tearStart.y);
      ctx.lineTo(canvas.width, canvas.height * 0.8);
      ctx.stroke();
      
      // Instructions
      ctx.setLineDash([]);
      ctx.font = '14px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Drag to tear along the dotted line', tearStart.x + 10, tearStart.y + 30);
    }
    
    // Draw tear
    if (tearPoints.length > 1) {
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tearPoints[0].x, tearPoints[0].y);
      
      for (let i = 1; i < tearPoints.length; i++) {
        ctx.lineTo(tearPoints[i].x, tearPoints[i].y);
      }
      
      ctx.stroke();
      
      // Draw jagged edges
      ctx.beginPath();
      for (let i = 0; i < tearPoints.length - 1; i++) {
        const p1 = tearPoints[i];
        const p2 = tearPoints[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(2, Math.floor(dist / 5));
        
        for (let j = 0; j < steps; j++) {
          const t = j / steps;
          const x = p1.x + dx * t;
          const y = p1.y + dy * t;
          const jitter = (Math.random() - 0.5) * 3;
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y + jitter);
          }
        }
      }
      ctx.stroke();
    }
    
    // Indicate completion
    if (tearComplete) {
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = 'green';
      ctx.fillText('Page torn! Double-tap to continue', canvas.width / 2 - 120, 30);
    }
  }, [rocketState, tearStart, tearCurrent, tearPoints, tearComplete]);
  
  // Draw folding guidel ines and animation
  useEffect(() => {
    if (rocketState !== 'folding' || !foldCanvasRef.current) return;
    
    const canvas = foldCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Draw folding animations based on current step
    ctx.save();
    switch (foldingStep) {
      case 'start':
        // Torn paper
        ctx.fillStyle = '#f5f5dc'; // Beige paper color
        ctx.fillRect(centerX - 100, centerY - 150, 200, 300);
        
        // Draw fold guidelines
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 150);
        ctx.lineTo(centerX, centerY + 150);
        ctx.stroke();
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Step 1: Double-tap to fold in half lengthwise', centerX - 120, centerY - 170);
        break;
        
      case 'half':
        // Draw half-folded paper with animation
        const halfFoldWidth = 100 * (1 - foldProgress);
        
        // Left half stays in place
        ctx.fillStyle = '#f5f5dc';
        ctx.fillRect(centerX - 100, centerY - 150, halfFoldWidth, 300);
        
        // Right half folds over (with perspective effect)
        ctx.fillStyle = '#e6e6c9'; // Slightly darker to show shadow
        
        // Draw right half (folding)
        ctx.beginPath();
        ctx.moveTo(centerX - 100 + halfFoldWidth, centerY - 150);
        ctx.lineTo(centerX - 100 + halfFoldWidth + (100 - halfFoldWidth) * 2, centerY - 150);
        ctx.lineTo(centerX - 100 + halfFoldWidth + (100 - halfFoldWidth) * 2, centerY + 150);
        ctx.lineTo(centerX - 100 + halfFoldWidth, centerY + 150);
        ctx.closePath();
        ctx.fill();
        
        // Draw fold line
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 100 + halfFoldWidth, centerY - 150);
        ctx.lineTo(centerX - 100 + halfFoldWidth, centerY + 150);
        ctx.stroke();
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Step 2: Double-tap to fold top corners to center', centerX - 130, centerY - 170);
        break;
        
      case 'corners':
        // Paper folded in half
        ctx.fillStyle = '#e6e6c9';
        ctx.fillRect(centerX - 100, centerY - 150, 100, 300);
        
        // Top corners folding animation
        const cornerFoldProgress = foldProgress;
        
        // Draw top left corner folding
        ctx.fillStyle = '#d5d5b5'; // Even darker for double fold
        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY - 150);
        ctx.lineTo(centerX - 100 + 100 * (1 - cornerFoldProgress), centerY - 150 + 75 * cornerFoldProgress);
        ctx.lineTo(centerX - 50, centerY - 150 + 75);
        ctx.closePath();
        ctx.fill();
        
        // Draw top right corner folding
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 150);
        ctx.lineTo(centerX - 50, centerY - 150 + 75);
        ctx.lineTo(centerX - 100 + 100 * cornerFoldProgress, centerY - 150 + 75 * cornerFoldProgress);
        ctx.closePath();
        ctx.fill();
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Step 3: Double-tap to fold sides inward', centerX - 100, centerY - 170);
        break;
        
      case 'sides':
        // Paper with corners folded
        ctx.fillStyle = '#e6e6c9';
        ctx.fillRect(centerX - 100, centerY - 75, 100, 225);
        
        // Draw folded top corners
        ctx.fillStyle = '#d5d5b5';
        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY - 75);
        ctx.lineTo(centerX - 50, centerY - 75);
        ctx.lineTo(centerX - 100, centerY - 150);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 75);
        ctx.lineTo(centerX - 50, centerY - 75);
        ctx.lineTo(centerX, centerY - 150);
        ctx.closePath();
        ctx.fill();
        
        // Side folds animation
        const sideFoldProgress = foldProgress;
        const sideFoldWidth = 25 * sideFoldProgress;
        
        // Left side fold
        ctx.fillStyle = '#c0c0a0';
        ctx.fillRect(centerX - 100, centerY - 75, sideFoldWidth, 225);
        
        // Right side fold
        ctx.fillRect(centerX - sideFoldWidth, centerY - 75, sideFoldWidth, 225);
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Step 4: Double-tap to complete your rocket', centerX - 120, centerY - 170);
        break;
        
      case 'complete':
        // Draw completed rocket
        drawCompletedRocket(ctx, centerX, centerY);
        
        // Instructions
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Rocket complete! Getting ready for launch...', centerX - 130, centerY - 170);
        break;
    }
    ctx.restore();
    
  }, [rocketState, foldingStep, foldProgress]);
  
  // Draw completed rocket
  const drawCompletedRocket = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const rocketHeight = 200;
    const rocketWidth = 50;
    
    // Rocket body
    ctx.fillStyle = '#e6e6c9';
    ctx.beginPath();
    ctx.moveTo(x, y - rocketHeight / 2); // Nose
    ctx.lineTo(x - rocketWidth / 2, y + rocketHeight / 2); // Bottom left
    ctx.lineTo(x + rocketWidth / 2, y + rocketHeight / 2); // Bottom right
    ctx.closePath();
    ctx.fill();
    
    // Fold lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(x, y - rocketHeight / 2);
    ctx.lineTo(x, y + rocketHeight / 2);
    ctx.stroke();
    
    // Fin folds
    ctx.beginPath();
    ctx.moveTo(x, y + rocketHeight / 4);
    ctx.lineTo(x - rocketWidth / 2, y + rocketHeight / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y + rocketHeight / 4);
    ctx.lineTo(x + rocketWidth / 2, y + rocketHeight / 2);
    ctx.stroke();
    
    // Wing details
    ctx.fillStyle = '#d5d5b5';
    ctx.beginPath();
    ctx.moveTo(x - rocketWidth / 2, y + rocketHeight / 2);
    ctx.lineTo(x - rocketWidth / 1.2, y + rocketHeight / 3);
    ctx.lineTo(x - rocketWidth / 4, y + rocketHeight / 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + rocketWidth / 2, y + rocketHeight / 2);
    ctx.lineTo(x + rocketWidth / 1.2, y + rocketHeight / 3);
    ctx.lineTo(x + rocketWidth / 4, y + rocketHeight / 3);
    ctx.closePath();
    ctx.fill();
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
  };
  
  // Handle resetting the game
  const handleReset = () => {
    setRocketState('page');
    setGameOver(false);
    setTearComplete(false);
    setTearStart(null);
    setTearCurrent(null);
    setTearPoints([]);
    setTearProgress(0);
    setFoldingStep('start');
    setFoldProgress(0);
    setPhysics({
      position: { x: 50, y: 500 },
      velocity: { x: 0, y: 0 },
      angle: 45,
      power: 50,
      windStrength: (Math.random() * 2 - 1) * WIND_STRENGTH_RANGE
    });
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
  };
  
  // Handle out of bounds
  const handleOutOfBounds = () => {
    cancelAnimationFrame(animationRef.current);
    setRocketState('landed');
    setScore(0);
    setGameOver(true);
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center"
      onMouseDown={handleTap}
      onTouchStart={handleTap}
      onMouseMove={(e) => rocketState === 'tearing' && handleTearDrag(e)}
      onTouchMove={(e) => rocketState === 'tearing' && handleTearDrag(e)}
    >
      <div className="mb-4 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">Paper Rocket Challenge</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Double-tap and tear the last page, fold it into a rocket, and hit the target!
        </p>
      </div>

      {/* Canvas for the game */}
      <div 
        ref={pageRef}
        className="relative w-full max-w-4xl h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        {/* Canvas for rocket physics */}
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className={`absolute top-0 left-0 w-full h-full ${rocketState === 'flying' ? 'block' : 'hidden'}`}
        />
        
        {/* Canvas for page tearing */}
        <canvas 
          ref={tearCanvasRef} 
          width={800} 
          height={600} 
          className={`absolute top-0 left-0 w-full h-full ${rocketState === 'tearing' ? 'block' : 'hidden'}`}
        />
        
        {/* Canvas for folding animation */}
        <canvas 
          ref={foldCanvasRef} 
          width={800} 
          height={600} 
          className={`absolute top-0 left-0 w-full h-full ${rocketState === 'folding' ? 'block' : 'hidden'}`}
        />
        
        {/* Untorn page */}
        {rocketState === 'page' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-amber-50 dark:bg-amber-900 w-3/4 h-4/5 rounded-lg shadow-lg flex flex-col items-center justify-center p-6">
              <h3 className="text-xl font-bold mb-4">Thank You for Viewing My Portfolio!</h3>
              <p className="text-center max-w-md mb-8">
                This final page can be torn off and folded into a paper rocket. Try it out!
              </p>
              
              <div className="relative w-full max-w-sm h-64 mb-8 bg-white dark:bg-gray-700 rounded flex items-center justify-center">
                <div className="transform -rotate-6">
                  <Maximize2 size={60} className="text-amber-500 mb-4" />
                  <p className="text-center font-bold">Double-tap anywhere on this page</p>
                  <p className="text-center text-sm text-gray-500">Then drag to tear it off</p>
                </div>
                
                {/* Dotted lines showing where to tear */}
                <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-red-400 opacity-40"></div>
                  <div className="absolute top-1/4 right-0">
                    <Scissors className="text-red-500 animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Ready state - launch controls */}
        {rocketState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-full h-full">
              {/* Top section with rocket preview */}
              <div className="h-2/3 flex items-center justify-center">
                <div className="relative w-40 h-60">
                  {drawCompletedRocket(
                    foldCanvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
                    foldCanvasRef.current?.width ? foldCanvasRef.current.width / 2 : 400,
                    foldCanvasRef.current?.height ? foldCanvasRef.current.height / 2 : 300
                  )}
                </div>
              </div>
              
              {/* Bottom section with controls */}
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
      
      {/* Help text */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        <p className="mb-2">
          {rocketState === 'page' && "Double-tap on the page to start tearing it off"}
          {rocketState === 'tearing' && "Drag to tear along the dotted line, then double-tap to continue"}
          {rocketState === 'folding' && "Follow the folding guide, double-tap for each fold"}
          {rocketState === 'ready' && "Adjust angle and power, then launch your rocket!"}
          {rocketState === 'flying' && "Watch your rocket fly through the air!"}
          {rocketState === 'landed' && "Try again with different settings to improve your score"}
        </p>
      </div>
    </div>
  );
};

export default PaperRocket;