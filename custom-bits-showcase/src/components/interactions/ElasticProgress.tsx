import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

export const ElasticProgress: React.FC = () => {
  const [progress, setProgress] = useState(35); // progress in percentage (0 - 100)
  
  // Physics references
  const yOffset = useRef(50); // initial middle control point Y
  const targetY = 50; // default straight line value
  const velocity = useRef(0);
  const pathRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);

  const k = 0.085; // Spring stiffness constant
  const c = 0.12; // Damping constant

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      // Hooke's Law: F = -kx - cv
      const displacement = yOffset.current - targetY;
      const springForce = -k * displacement;
      const dampingForce = -c * velocity.current;
      const acceleration = springForce + dampingForce;

      velocity.current += acceleration;
      yOffset.current += velocity.current;

      const path = pathRef.current;
      const fill = fillRef.current;

      if (path && fill) {
        // Construct the curved SVG path string using quadratic bezier
        // Width of SVG is 320, padding is 10. Left is 10, right is 310.
        const width = 300;
        const progressX = 10 + (progress / 100) * width;
        
        // Target path curve (wobbles on progress change)
        const controlY = yOffset.current;
        
        // Base track curve path: M 10 50 Q 160 controlY 310 50
        path.setAttribute('d', `M 10 50 Q 160 ${controlY} 310 50`);
        
        // For the active fill, we crop it at progressX
        // Since it's a curve, we compute point on quadratic curve at t = progress/100
        const t = progress / 100;
        const startX = 10, startY = 50;
        const endX = 310, endY = 50;
        const cx = 160, cy = controlY;

        // Bezier formula: B(t) = (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
        const bx = (1-t)*(1-t)*startX + 2*(1-t)*t*cx + t*t*endX;
        const by = (1-t)*(1-t)*startY + 2*(1-t)*t*cy + t*t*endY;

        // Midpoint of current progress is bx / by
        fill.setAttribute('d', `M 10 50 Q ${(10 + bx) / 2} ${(50 + by) / 2} ${bx} ${by}`);
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  const handleProgressChange = (newVal: number) => {
    const diff = Math.abs(newVal - progress);
    setProgress(newVal);

    // Apply physical kinetic impulse proportional to change speed
    // If progress jumps, it sags the line downwards
    velocity.current += diff * 0.85; // impulse modifier
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-sm select-none">
      <span className="text-xs text-zinc-500 mb-6 font-mono">Click options to induce physical spring impulses</span>
      
      {/* SVG Canvas for path rendering */}
      <div className="w-full relative h-20 flex items-center justify-center bg-dark-300 border border-dark-border rounded-2xl mb-6">
        <svg className="w-80 h-20" viewBox="0 0 320 100" fill="none">
          {/* Muted background track */}
          <path
            ref={pathRef}
            d="M 10 50 Q 160 50 310 50"
            stroke="#1f1f23"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Active progress track */}
          <path
            ref={fillRef}
            d="M 10 50 Q 85 50 160 50"
            stroke="url(#progress-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Indicator Bubble */}
        <div 
          className="absolute text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-400"
          style={{
            left: `${10 + (progress / 100) * 82}%`, // offset adjustment
            top: '12%',
            transform: 'translateX(-50%)',
            transition: 'left 250ms cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2.5 w-full">
        <button
          onClick={() => handleProgressChange(25)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl bg-dark-200 border border-dark-border hover:border-purple-500/30 text-zinc-300 hover:text-white transition-colors"
        >
          25%
        </button>
        <button
          onClick={() => handleProgressChange(55)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl bg-dark-200 border border-dark-border hover:border-purple-500/30 text-zinc-300 hover:text-white transition-colors"
        >
          55%
        </button>
        <button
          onClick={() => handleProgressChange(85)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl bg-dark-200 border border-dark-border hover:border-purple-500/30 text-zinc-300 hover:text-white transition-colors"
        >
          85%
        </button>
        <button
          onClick={() => handleProgressChange(100)}
          className="flex-1 py-2 text-xs font-semibold rounded-xl bg-dark-200 border border-dark-border hover:border-purple-500/30 text-zinc-300 hover:text-white transition-colors"
        >
          100%
        </button>
      </div>

      <button
        onClick={() => handleProgressChange(0)}
        className="mt-3.5 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-dark-300/40 rounded-lg transition-colors border border-transparent hover:border-dark-border"
      >
        <Play size={12} className="rotate-180" />
        <span>RESET CORE</span>
      </button>
    </div>
  );
};

export default ElasticProgress;
