import React from 'react';
import { useTilt } from '../../hooks/useTilt';
import { Layers } from 'lucide-react';

export interface TiltCardProps {
  title?: string;
  category?: string;
  description?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  title = "3D Parallax Space",
  category = "Interactive Frame",
  description = "Move your mouse over this card to feel the multi-layered spatial depth shift.",
}) => {
  const cardRef = useTilt<HTMLDivElement>({
    max: 18,
    perspective: 1200,
    scale: 1.04,
  });

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-sm h-80 rounded-2xl border border-dark-border bg-dark-200 p-8 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-lg shadow-black/40 hover:border-purple-500/50 select-none transform-gpu"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Floating Sparkle Particles */}
      <div 
        data-tilt-parallax="-12"
        className="absolute top-10 right-10 w-24 h-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none transform-gpu"
      />

      <div className="flex items-center justify-between">
        <span 
          data-tilt-parallax="-6"
          className="text-xs font-semibold tracking-widest text-purple-400 uppercase transform-gpu"
        >
          {category}
        </span>
        <div 
          data-tilt-parallax="-15"
          className="p-2.5 rounded-xl bg-dark-300 border border-dark-border text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors transform-gpu"
        >
          <Layers size={18} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 
          data-tilt-parallax="12"
          className="text-2xl font-bold tracking-tight text-white font-sans transform-gpu"
        >
          {title}
        </h3>
        <p 
          data-tilt-parallax="6"
          className="text-sm leading-relaxed text-zinc-400 transform-gpu"
        >
          {description}
        </p>
      </div>

      <div className="flex items-center text-xs text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors">
        <span>Hover context enabled</span>
        <div className="ml-2 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
      </div>
    </div>
  );
};

export default TiltCard;
