import React, { useState, useRef, useEffect } from 'react';
import { Plus, Settings, MessageSquare, Share2 } from 'lucide-react';
import { getDistance, Point2D } from '../../utils/math';

export const KineticFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const btn = buttonRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;

    let activeAnimation: Animation | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnCenter: Point2D = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      const cursor: Point2D = { x: e.clientX, y: e.clientY };
      const dist = getDistance(cursor, btnCenter);

      const detectionRadius = 110;
      const snapRadius = 40;

      if (dist < detectionRadius) {
        if (activeAnimation) {
          activeAnimation.cancel();
          activeAnimation = null;
        }

        const dx = btnCenter.x - cursor.x;
        const dy = btnCenter.y - cursor.y;

        if (dist < snapRadius) {
          // Snap/pull toward cursor (magnetic attract)
          isHovered.current = true;
          const pullStrength = 0.28;
          btn.style.transform = `translate3d(${-dx * pullStrength}px, ${-dy * pullStrength}px, 0)`;
        } else {
          // Deflect away from cursor (magnetic push)
          isHovered.current = false;
          const pushStrength = (1 - dist / detectionRadius) * 20; // max deflection 20px
          const angle = Math.atan2(dy, dx);
          const px = Math.cos(angle) * pushStrength;
          const py = Math.sin(angle) * pushStrength;
          btn.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        }
      } else {
        // Reset to normal center state
        if (btn.style.transform !== '') {
          resetPosition();
        }
      }
    };

    const resetPosition = () => {
      const keyframes = [
        { transform: btn.style.transform },
        { transform: 'translate3d(0px, 0px, 0px)' }
      ];

      activeAnimation = btn.animate(keyframes, {
        duration: 300,
        easing: 'elastic.out(1, 0.5)' as string || 'ease-out',
        fill: 'forwards'
      });

      activeAnimation.onfinish = () => {
        btn.style.transform = '';
        activeAnimation = null;
      };
    };

    const handlePointerLeave = () => {
      isHovered.current = false;
      resetPosition();
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      if (activeAnimation) activeAnimation.cancel();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Satellite configurations: angle in degrees, position offset, icon
  const satellites = [
    { icon: <Settings size={16} />, angle: 220, label: "Settings" },
    { icon: <MessageSquare size={16} />, angle: 270, label: "Chat" },
    { icon: <Share2 size={16} />, angle: 320, label: "Share" },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-80 bg-dark-100 rounded-2xl border border-dark-border overflow-hidden flex flex-col items-center justify-center p-4"
    >
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <span className="absolute top-4 text-xs text-zinc-500 font-mono">Move cursor close to deflecting button</span>

      <div className="relative">
        {/* Satellite Sub-options */}
        {satellites.map((sat, index) => {
          const rad = (sat.angle * Math.PI) / 180;
          const radius = isOpen ? 70 : 0;
          const tx = Math.cos(rad) * radius;
          const ty = Math.sin(rad) * radius;

          return (
            <button
              key={index}
              title={sat.label}
              className={`absolute top-2 left-2 w-10 h-10 rounded-full bg-dark-300 border border-dark-border text-zinc-400 hover:text-purple-400 hover:border-purple-500/40 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none transform-gpu ${
                isOpen 
                  ? 'opacity-100 scale-100 pointer-events-auto' 
                  : 'opacity-0 scale-50 pointer-events-none'
              }`}
              style={{
                transform: `translate3d(${tx}px, ${ty}px, 0)`,
                transitionDelay: `${index * 40}ms`,
              }}
            >
              {sat.icon}
            </button>
          );
        })}

        {/* Main Floating Button */}
        <div
          ref={buttonRef}
          onClick={toggleMenu}
          className={`relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-accent-purpleDark text-white flex items-center justify-center cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95 transition-shadow transform-gpu will-change-transform ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
          style={{ transition: 'transform 0.15s ease-out, rotate 0.3s ease-in-out' }}
        >
          <Plus size={24} />
        </div>
      </div>
    </div>
  );
};

export default KineticFAB;
