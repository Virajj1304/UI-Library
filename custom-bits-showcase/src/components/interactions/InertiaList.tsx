import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { lerp, clamp } from '../../utils/math';

export interface InertiaListProps {
  items?: string[];
}

export const InertiaList: React.FC<InertiaListProps> = ({
  items = [
    "Design Engineering Systems",
    "WebGL Shader Programming",
    "Hardware Accelerated Compilers",
    "Logarithmic Scale Physics",
    "Trigonometric Orbit Canvas",
    "High-Performance Direct DOM Hooks"
  ],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollY = container.scrollTop;
    let scrollVelocity = 0;
    let currentSkew = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      const delta = currentScroll - lastScrollY;
      scrollVelocity = delta;
      lastScrollY = currentScroll;
    };

    const updateInertia = () => {
      // Damping velocity and LERP skew
      scrollVelocity = lerp(scrollVelocity, 0, 0.1);
      // Map velocity to target skew (limit between -12 and 12 deg)
      const targetSkew = clamp(scrollVelocity * 0.08, -12, 12);
      currentSkew = lerp(currentSkew, targetSkew, 0.15);

      // Direct style updates on DOM elements to prevent React virtual DOM lag
      itemsRef.current.forEach((item) => {
        if (item) {
          // Keep a subtle translation on hover plus scroll skew
          item.style.transform = `skewY(${currentSkew}deg)`;
        }
      });

      animationFrameId = requestAnimationFrame(updateInertia);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updateInertia);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md select-none">
      <span className="text-xs text-zinc-500 mb-2 font-mono">Scroll the list below to observe vertical skew inertia</span>
      
      <div 
        ref={containerRef}
        className="w-full h-80 overflow-y-auto border border-dark-border bg-dark-200 rounded-2xl p-4 space-y-3 relative"
        style={{ scrollBehavior: 'auto' }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            className="group flex items-center justify-between p-4 bg-dark-300 border border-dark-border/40 rounded-xl hover:border-purple-500/30 hover:bg-dark-100 transition-colors duration-200 cursor-pointer transform-gpu will-change-transform"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-purple-400 font-mono">0{index + 1}.</span>
              <span className="text-sm font-semibold tracking-wide text-zinc-200 group-hover:text-white transition-colors">
                {item}
              </span>
            </div>
            <div className="text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1.5 transition-all duration-300">
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InertiaList;
