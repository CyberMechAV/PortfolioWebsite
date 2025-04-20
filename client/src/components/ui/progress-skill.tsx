import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface ProgressSkillProps {
  name: string;
  percentage: number;
  colorClass: string;
  delay?: number;
}

export function ProgressSkill({ name, percentage, colorClass, delay = 0 }: ProgressSkillProps) {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimate(true);
      }, delay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  return (
    <div className="mb-5" ref={ref}>
      <div className="flex justify-between mb-1">
        <span className="text-gray-700 dark:text-gray-300">{name}</span>
        <span className="text-gray-600 dark:text-gray-400">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`${colorClass} h-full rounded-full transition-transform duration-1000 ease-out ${animate ? 'transform-none' : 'transform -translate-x-full'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
