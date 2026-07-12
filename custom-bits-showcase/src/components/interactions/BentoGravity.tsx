import React, { useRef, useEffect } from 'react';
import { Shield, Sparkles, Activity } from 'lucide-react';

export const BentoGravity: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let activeAnimations: Animation[] = [];

    const handlePointerMove = (e: PointerEvent) => {
      const containerRect = container.getBoundingClientRect();
      const cursorX = e.clientX;
      const cursorY = e.clientY;

      cardRefs.current.forEach((card) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;

        const dx = cursorX - centerX;
        const dy = cursorY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Proximity configuration
        const pullRadius = 240;
        const localX = cursorX - cardRect.left;
        const localY = cursorY - cardRect.top;

        // 1. Dynamic border spotlight mask
        card.style.setProperty('--mouse-x', `${localX}px`);
        card.style.setProperty('--mouse-y', `${localY}px`);

        // 2. Gravitational translation pull vector (pull toward cursor elastically)
        if (dist < pullRadius) {
          const strength = (1 - dist / pullRadius) * 12; // pull limit 12px
          const angle = Math.atan2(dy, dx);
          const tx = Math.cos(angle) * strength;
          const ty = Math.sin(angle) * strength;
          
          card.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale3d(1.015, 1.015, 1.015)`;
          card.style.borderColor = 'rgba(168, 85, 247, 0.3)';
        } else {
          card.style.transform = '';
          card.style.borderColor = '';
        }
      });
    };

    const handlePointerLeave = () => {
      // Return all cards smoothly to zero translation
      cardRefs.current.forEach((card) => {
        if (!card) return;
        
        const keyframes = [
          { transform: card.style.transform || 'translate3d(0, 0, 0)' },
          { transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)' }
        ];

        const anim = card.animate(keyframes, {
          duration: 350,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards'
        });

        anim.onfinish = () => {
          card.style.transform = '';
          card.style.borderColor = '';
        };

        activeAnimations.push(anim);
      });
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      activeAnimations.forEach(anim => anim.cancel());
    };
  }, []);

  const bentoCards = [
    {
      title: "Kernel Encryption",
      subtitle: "LOGARITHMIC SYSTEM SECURITY",
      icon: <Shield size={18} />,
      desc: "Hardware keys encrypted inside low-latency vectors.",
      gridClass: "col-span-2 row-span-1"
    },
    {
      title: "Acoustic Nodes",
      subtitle: "REAL-TIME SPEECH SIGNALS",
      icon: <Activity size={18} />,
      desc: "Node frequencies calculated at 60fps.",
      gridClass: "col-span-1 row-span-2"
    },
    {
      title: "Generative Shaders",
      subtitle: "MATRICES IN WEBGL",
      icon: <Sparkles size={18} />,
      desc: "Interpolating colors across physical points.",
      gridClass: "col-span-2 row-span-1"
    }
  ];

  return (
    <div className="w-full max-w-xl p-4 select-none">
      <span className="text-[10px] text-zinc-500 font-mono block mb-4 text-center">MOVE CURSOR ACROSS CARDS TO SEE GRAVITY PULL & SPOTLIGHTS</span>
      
      <div 
        ref={containerRef} 
        className="grid grid-cols-3 grid-rows-2 gap-4 h-80"
      >
        {bentoCards.map((card, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`relative flex flex-col justify-between p-6 bg-dark-200 border border-dark-border rounded-2xl overflow-hidden group transition-[border-color] duration-300 transform-gpu will-change-transform ${card.gridClass}`}
            style={{
              // Spotlight radial variables
              backgroundImage: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.08), transparent 80%)'
            }}
          >
            {/* Spotlight border glow layer */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl border border-transparent transition-opacity group-hover:opacity-100"
              style={{
                backgroundImage: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.4), transparent 60%)',
                WebkitMaskImage: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '1px'
              }}
            />

            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase">{card.subtitle}</span>
              <div className="p-2 rounded-xl bg-dark-300 border border-dark-border text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/20 transition-all">
                {card.icon}
              </div>
            </div>

            <div className="space-y-1.5 mt-4">
              <h4 className="text-base font-bold text-white tracking-wide">{card.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BentoGravity;
