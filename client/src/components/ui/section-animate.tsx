import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionAnimateProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function SectionAnimate({ children, id, className = "" }: SectionAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section id={id} className={className} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
