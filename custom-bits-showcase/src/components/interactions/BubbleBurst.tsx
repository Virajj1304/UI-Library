import React, { useState } from 'react';
import { Share, Link, Copy, Plus } from 'lucide-react';

export const BubbleBurst: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Satellite options
  const nodes = [
    { icon: <Link size={14} />, tx: -68, ty: -35, delay: '0ms', label: "Link" },
    { icon: <Share size={14} />, tx: 0, ty: -75, delay: '50ms', label: "Share" },
    { icon: <Copy size={14} />, tx: 68, ty: -35, delay: '100ms', label: "Copy" }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center p-8 select-none">
      <span className="text-[10px] text-zinc-500 mb-6 font-mono uppercase tracking-wider">Click to trigger liquid gooey mitosis</span>
      
      {/* Hidden SVG Gooey Filter definitions */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="bubble-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main Sandbox Frame */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* GOOEY BACKING CANVAS LAYER (Applied goo filter, no text/sharp content here) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none" style={{ filter: 'url(#bubble-goo)' }}>
          {/* Main button backing pill */}
          <div className="w-32 h-12 bg-gradient-to-r from-purple-600 to-accent-purpleDark rounded-full transition-all duration-300 transform-gpu" />

          {/* Sub-node backing circles (translate outwards when open) */}
          {nodes.map((node, i) => (
            <div
              key={i}
              className="absolute w-10 h-10 bg-purple-600 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu"
              style={{
                transform: isOpen 
                  ? `translate3d(${node.tx}px, ${node.ty}px, 0)` 
                  : 'translate3d(0px, 0px, 0px)',
                transitionDelay: node.delay
              }}
            />
          ))}
        </div>

        {/* SHARP FOREGROUND LAYER (Text & Icons rendered on top, not blurred) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          {/* Main click button wrapper */}
          <button
            onClick={toggleOpen}
            className="pointer-events-auto w-32 h-12 flex items-center justify-center gap-1.5 text-xs font-extrabold text-white tracking-widest uppercase focus:outline-none transition-transform active:scale-95"
          >
            <span>Actions</span>
            <Plus size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-45 text-purple-200' : 'text-white'}`} />
          </button>

          {/* Sub-node icons (clickable, translated to sit exactly on top of backing circles) */}
          {nodes.map((node, i) => (
            <button
              key={i}
              title={node.label}
              className={`absolute pointer-events-auto w-10 h-10 flex items-center justify-center text-white hover:text-purple-200 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none transform-gpu ${
                isOpen 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-50 pointer-events-none'
              }`}
              style={{
                transform: isOpen 
                  ? `translate3d(${node.tx}px, ${node.ty}px, 0)` 
                  : 'translate3d(0px, 0px, 0px)',
                transitionDelay: node.delay
              }}
            >
              {node.icon}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BubbleBurst;
