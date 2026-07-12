import React, { useState, useEffect, useRef } from 'react';

export const SonicInput: React.FC = () => {
  const [text, setText] = useState('');
  const pathRef = useRef<SVGPathElement>(null);
  
  // Wave physics parameters
  const amplitude = useRef(0);
  const time = useRef(0);
  const typingTimer = useRef<any>(null);

  useEffect(() => {
    let animationFrameId: number;

    const renderWave = () => {
      time.current += 0.16; // speed of wave travel
      
      // Decay amplitude towards 0 elastically
      amplitude.current = amplitude.current * 0.94; // friction decay

      const path = pathRef.current;
      if (path) {
        const width = 300;
        const segments = 32;
        let d = `M 10 50`;

        for (let i = 0; i <= segments; i++) {
          const ratio = i / segments;
          const x = 10 + ratio * width;
          
          // Generate wave ripples using combination of sine waves for complex natural oscillation
          const angle = ratio * Math.PI * 6 - time.current;
          const secondaryAngle = ratio * Math.PI * 2.5 + time.current * 0.5;
          
          const yOffset = (Math.sin(angle) * 0.7 + Math.sin(secondaryAngle) * 0.3) * amplitude.current;
          const y = 50 + yOffset;

          d += ` L ${x} ${y}`;
        }

        path.setAttribute('d', d);
      }

      animationFrameId = requestAnimationFrame(renderWave);
    };

    animationFrameId = requestAnimationFrame(renderWave);
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    
    // Inject a kinetic impact impulse to wave amplitude
    amplitude.current = Math.min(22, amplitude.current + 4.5);

    if (typingTimer.current) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      // Typing stopped placeholder/hook
    }, 450);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-sm select-none">
      <span className="text-[10px] text-zinc-500 mb-4 font-mono uppercase tracking-wider">Type below to feed kinetic soundwave frequencies</span>

      <div className="w-full relative bg-dark-200 border border-dark-border rounded-2xl p-6 overflow-hidden">
        
        {/* Monospaced Input field */}
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Awaiting text frequencies..."
          className="relative z-10 w-full bg-transparent text-white font-mono text-sm placeholder-zinc-600 focus:outline-none"
        />

        {/* SVG Baseline Wave Canvas */}
        <div className="w-full h-12 flex items-center justify-center mt-2">
          <svg className="w-full h-12" viewBox="0 0 320 100" fill="none">
            {/* Wave glow filter */}
            <defs>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing wave path */}
            <path
              ref={pathRef}
              d="M 10 50 L 310 50"
              stroke={text.length > 0 ? "url(#sonic-grad)" : "#1f1f23"}
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#neon-glow)"
              className="transition-[stroke] duration-300"
            />

            {/* Linear gradients */}
            <defs>
              <linearGradient id="sonic-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Activity tracking display */}
        <div className="flex justify-between items-center mt-2 text-[9px] font-mono text-zinc-500">
          <span>FREQ: {text.length > 0 ? `${Math.round(amplitude.current * 8)} Hz` : "0 Hz"}</span>
          <span className={text.length > 0 ? 'text-purple-400 animate-pulse' : ''}>
            {text.length > 0 ? "MODULATION: ON" : "STATUS: IDLE"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SonicInput;
