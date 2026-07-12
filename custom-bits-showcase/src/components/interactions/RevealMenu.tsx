import React, { useState, useRef, useEffect } from 'react';
import { lerp } from '../../utils/math';

interface MenuItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  gradient: string;
}

export const RevealMenu: React.FC = () => {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Position variables
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  const menuItems: MenuItem[] = [
    {
      id: "venus",
      num: "01",
      title: "PROJECT NEBULA",
      subtitle: "Generative Cosmic Shader Space",
      gradient: "from-purple-600 via-fuchsia-600 to-pink-500",
    },
    {
      id: "cyber",
      num: "02",
      title: "CYBERNETIC CODES",
      subtitle: "Hardware-level Kernel Modules",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
    },
    {
      id: "liquid",
      num: "03",
      title: "LIQUID FLOWS",
      subtitle: "Gooey Vector Fluid Field System",
      gradient: "from-emerald-500 via-teal-600 to-indigo-600",
    },
    {
      id: "kinetic",
      num: "04",
      title: "KINETIC COLLIDER",
      subtitle: "Logarithmic Boundary Physical Rebound",
      gradient: "from-orange-500 via-amber-600 to-red-500",
    }
  ];

  useEffect(() => {
    const container = containerRef.current;
    const preview = previewRef.current;
    if (!container || !preview) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Mouse coordinates relative to menu container
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };

    const renderLoop = () => {
      // Calculate LERP position
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.08);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.08);

      if (preview) {
        // Translate preview card with LERP offsets (centering card: offsetWidth/2, offsetHeight/2)
        const offsetX = currentPos.current.x - 90; // width is 180px
        const offsetY = currentPos.current.y - 60; // height is 120px
        
        // Add subtle rotation based on horizontal travel speed (inertia)
        const dx = mousePos.current.x - currentPos.current.x;
        const angle = dx * 0.12; // tilt angle proportional to movement speed
        
        preview.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${angle}deg)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    container.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseEnterItem = (item: MenuItem) => {
    setActiveItem(item);
    isHovering.current = true;
    
    const preview = previewRef.current;
    if (preview) {
      preview.style.opacity = '1';
      preview.style.transform += ' scale(1)';
    }
  };

  const handleMouseLeaveItem = () => {
    isHovering.current = false;
    
    const preview = previewRef.current;
    if (preview) {
      preview.style.opacity = '0';
      preview.style.transform += ' scale(0.65)';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-lg bg-dark-200 border border-dark-border rounded-2xl p-6 overflow-hidden select-none"
    >
      <span className="text-xs text-zinc-500 font-mono block mb-4">Hover items to trigger the smooth LERP thumbnail preview</span>

      {/* List Container */}
      <div className="flex flex-col relative z-10 divide-y divide-dark-border/40">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => handleMouseEnterItem(item)}
            onMouseLeave={handleMouseLeaveItem}
            className="flex items-center justify-between py-5 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-purple-500 font-mono tracking-widest">
                {item.num}
              </span>
              <h3 className="text-lg font-bold tracking-wider text-zinc-300 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300">
                {item.title}
              </h3>
            </div>
            <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
              {item.subtitle}
            </span>
          </div>
        ))}
      </div>

      {/* Floating Preview Card Layer */}
      <div
        ref={previewRef}
        className="absolute top-0 left-0 w-44 h-28 rounded-xl bg-dark-300 border border-dark-border overflow-hidden pointer-events-none z-20 opacity-0 transition-[opacity,scale] duration-300 ease-out shadow-2xl shadow-black/80 transform-gpu"
        style={{ 
          transform: 'translate3d(0px, 0px, 0px) scale(0.65)',
          willChange: 'transform, opacity'
        }}
      >
        {/* Dynamic Gradient preview element */}
        {activeItem && (
          <div className={`w-full h-full bg-gradient-to-tr ${activeItem.gradient} flex items-center justify-center p-4 relative`}>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
            <div className="relative text-center">
              <span className="text-[10px] font-bold text-white/60 font-mono tracking-widest block uppercase">
                {activeItem.id} space
              </span>
              <span className="text-xs font-extrabold text-white mt-1 block tracking-wider uppercase">
                {activeItem.title.split(' ')[1]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevealMenu;
