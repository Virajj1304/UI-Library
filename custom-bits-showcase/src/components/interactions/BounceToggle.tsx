import React, { useState, useRef } from 'react';

export interface BounceToggleProps {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const BounceToggle: React.FC<BounceToggleProps> = ({
  initialChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(initialChecked);
  const containerRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const nextState = !checked;
    setChecked(nextState);
    if (onChange) onChange(nextState);

    const container = containerRef.current;
    if (!container) return;

    // Trigger physical squash-stretch collision animation based on direction of slide
    const origin = nextState ? 'right center' : 'left center';

    const keyframes = [
      { transform: 'scale3d(1, 1, 1)', transformOrigin: origin },
      { transform: 'scale3d(1.22, 0.82, 1)', transformOrigin: origin },
      { transform: 'scale3d(0.9, 1.08, 1)', transformOrigin: origin },
      { transform: 'scale3d(1.05, 0.96, 1)', transformOrigin: origin },
      { transform: 'scale3d(1, 1, 1)', transformOrigin: origin }
    ];

    container.animate(keyframes, {
      duration: 320,
      easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      fill: 'forwards'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 select-none">
      <span className="text-xs text-zinc-500 mb-4 font-mono">Toggle to trigger side-collision impact squash</span>
      
      <button
        ref={containerRef}
        onClick={handleToggle}
        className={`relative w-20 h-10 rounded-full border transition-all duration-300 outline-none transform-gpu will-change-transform ${
          checked 
            ? 'bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/20' 
            : 'bg-dark-300 border-dark-border hover:border-zinc-700'
        }`}
      >
        {/* Toggle Knob */}
        <div
          className={`absolute top-1 w-7.5 h-7.5 rounded-full bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            checked 
              ? 'left-11 translate-x-0 bg-white' 
              : 'left-1 translate-x-0 bg-zinc-400'
          }`}
          style={{ width: '30px', height: '30px' }}
        />
      </button>

      <span className="text-xs font-semibold mt-3 text-zinc-400 font-sans tracking-wide">
        State: {checked ? 'ACTIVE' : 'MUTED'}
      </span>
    </div>
  );
};

export default BounceToggle;
