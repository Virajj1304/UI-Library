import React from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { ArrowUpRight } from 'lucide-react';

export interface MagneticButtonProps {
  label?: string;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  label = "Connect Wallet",
  onClick,
}) => {
  // Use our custom magnetic hook to track mouse pull
  const buttonRef = useMagnetic<HTMLButtonElement>({
    range: 90,
    strength: 0.35,
    labelStrength: 0.18,
    speed: 350,
  });

  return (
    <div className="flex items-center justify-center p-8 select-none">
      <button
        ref={buttonRef}
        onClick={onClick}
        className="relative group px-8 py-4 bg-gradient-to-r from-purple-600 to-accent-purpleDark text-white font-semibold rounded-full flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-purple-500/20 active:scale-95 transform-gpu outline-none"
        style={{ willChange: 'transform' }}
      >
        {/* Hover Radial Sheen */}
        <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Magnetic inner container */}
        <span
          data-magnetic-label
          className="flex items-center gap-2 tracking-wide font-sans transform-gpu pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          <span>{label}</span>
          <ArrowUpRight 
            size={18} 
            className="group-hover:rotate-45 transition-transform duration-300 ease-out" 
          />
        </span>
      </button>
    </div>
  );
};

export default MagneticButton;
