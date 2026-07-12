import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getDistance, lerp } from '../utils/math';

interface LandingViewProps {
  onBrowse: () => void;
}

interface ConstellationNode {
  id: number;
  name: string;
  label: string;
  cx: number; // percentage X position
  cy: number; // percentage Y position
  x: number;  // current actual X
  y: number;  // current actual Y
  vx: number;
  vy: number;
  icon: string;
  val: string;
}

export const LandingView: React.FC<LandingViewProps> = ({ onBrowse }) => {
  const pointerPos = useRef({ x: -1000, y: -1000 });
  const isPointerOver = useRef(false);

  // Monitor screen dimensions for responsive SVG curve alignments
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const [nodes, setNodes] = useState<ConstellationNode[]>([
    { id: 1, name: 'useTilt', label: 'Hardware 3D', cx: 0.15, cy: 0.32, x: 200, y: 250, vx: 0, vy: 0, icon: '▲', val: '60 FPS' },
    { id: 2, name: 'useMagnetic', label: 'Vector Proximity', cx: 0.13, cy: 0.72, x: 180, y: 550, vx: 0, vy: 0, icon: '⚙', val: '0ms Lag' },
    { id: 3, name: 'LiquidTabs', label: 'Gooey Morphing', cx: 0.83, cy: 0.28, x: 1000, y: 220, vx: 0, vy: 0, icon: '❖', val: 'SVG Mask' },
    { id: 4, name: 'ElasticProgress', label: 'Spring Physics', cx: 0.86, cy: 0.74, x: 1050, y: 580, vx: 0, vy: 0, icon: '✦', val: 'Hooke K' }
  ]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Proximity math + Float animation frame loop
  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const updatePhysics = () => {
      time += 0.015;

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // Slow floating drift target
          let targetX = dimensions.width * node.cx + Math.sin(time + node.id) * 22;
          let targetY = dimensions.height * node.cy + Math.cos(time * 0.8 + node.id * 1.3) * 18;

          // Pointer Magnetic Attraction
          if (isPointerOver.current) {
            const dist = getDistance(pointerPos.current, { x: node.x, y: node.y });
            const magnetRadius = 220;

            if (dist < magnetRadius) {
              const factor = 1 - dist / magnetRadius;
              // Pull node coordinates towards the mouse
              targetX = lerp(targetX, pointerPos.current.x, factor * 0.42);
              targetY = lerp(targetY, pointerPos.current.y, factor * 0.42);
            }
          }

          const stiffness = 0.06;
          const damping = 0.83;

          const dx = targetX - node.x;
          const dy = targetY - node.y;

          const ax = dx * stiffness;
          const ay = dy * stiffness;

          const vx = (node.vx + ax) * damping;
          const vy = (node.vy + ay) * damping;

          return {
            ...node,
            vx,
            vy,
            x: node.x + vx,
            y: node.y + vy
          };
        })
      );

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerPos.current = { x: e.clientX, y: e.clientY };
    isPointerOver.current = true;
  };

  const handlePointerLeave = () => {
    isPointerOver.current = false;
    pointerPos.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="min-h-screen bg-[#08070c] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden select-none text-[#e3e3e3] font-sans"
    >
      {/* Keyframe animation overlay style sheet */}
      <style>{`
        @keyframes streamFall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .stream-line {
          animation: streamFall 7s linear infinite;
        }
      `}</style>

      {/* Dynamic Grid Canvas background */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute inset-0 radial-mask pointer-events-none" />

      {/* Massive Glassmorphism Background Color Flares */}
      <div className="absolute top-[-10%] right-[-10%] w-[580px] h-[580px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[680px] h-[680px] rounded-full bg-blue-500/8 blur-[160px] pointer-events-none" />
      <div className="absolute top-[30%] left-[25%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      {/* Vertical Animated Falling Streams (Matrix rain style trails) */}
      <div className="absolute inset-0 flex justify-center gap-24 pointer-events-none overflow-hidden opacity-25">
        <div className="w-[1.2px] h-[140px] bg-gradient-to-b from-transparent via-[#a8c7fa]/60 to-transparent stream-line" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="w-[1.2px] h-[180px] bg-gradient-to-b from-transparent via-[#c2e7ff]/40 to-transparent stream-line" style={{ animationDelay: '3s', animationDuration: '10s', marginLeft: '50px' }} />
        <div className="w-[1.2px] h-[120px] bg-gradient-to-b from-transparent via-[#a8c7fa]/60 to-transparent stream-line" style={{ animationDelay: '5.5s', animationDuration: '7s', marginRight: '80px' }} />
      </div>

      {/* Curved SVG connector paths linking nodes to margins */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {nodes.map((node) => {
          let borderX = 0;
          let borderY = 0;

          // Align curves based on corner positions
          if (node.id === 1) { // top-left
            borderX = 0;
            borderY = dimensions.height * 0.20;
          } else if (node.id === 2) { // bottom-left
            borderX = 0;
            borderY = dimensions.height * 0.85;
          } else if (node.id === 3) { // top-right
            borderX = dimensions.width;
            borderY = dimensions.height * 0.16;
          } else { // bottom-right
            borderX = dimensions.width;
            borderY = dimensions.height * 0.80;
          }

          // Generate control points for curve layout
          const ctrlX = borderX === 0 ? node.x * 0.5 : borderX - (borderX - node.x) * 0.5;
          const ctrlY = borderY;

          return (
            <path
              key={`path-${node.id}`}
              d={`M ${borderX} ${borderY} Q ${ctrlX} ${ctrlY} ${node.x} ${node.y}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1.2"
            />
          );
        })}
      </svg>

      {/* Interactive Constellation Floating Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute z-20 flex items-center gap-3 select-none pointer-events-none transform-gpu"
          style={{
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)',
            willChange: 'left, top',
          }}
        >
          {/* Badge Icon circle */}
          <div className="w-7 h-7 rounded-full bg-[#1e1f20]/60 border border-white/10 flex items-center justify-center text-[10px] text-white/80 shadow-md">
            {node.icon}
          </div>

          {/* Labels layout */}
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-white/90 leading-none">
              • {node.name}
            </span>
            <span className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
              {node.label} ({node.val})
            </span>
          </div>
        </div>
      ))}

      {/* Centered Main Typographic hero block */}
      <div className="text-center z-30 max-w-2xl px-6 space-y-7">

        {/* Play Button visual decoration */}
        {/* <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 shadow-lg cursor-pointer hover:bg-white/15 transition-all">
            <span className="text-sm ml-0.5"></span>
          </div>
        </div> */}

        {/* Small capsule tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1e1f20]/60 border border-[#303030] text-[#a8c7fa] rounded-full text-xs font-medium tracking-wide">
          <Sparkles size={11} />
          <span>Unlock Your Interface Spark! →</span>
        </div>

        {/* Spacious centered sentence-case header */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1] font-sans">
          One-click for
          <br />
          <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            Micro-Interactions
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
          Dive into performance-focused visual components, where native browser engineering meets design excellence.
        </p>

        {/* Centered Side-by-Side buttons */}
        <div className="flex items-center justify-center gap-3 pt-6">

          <button
            onClick={onBrowse}
            className="flex items-center gap-2 px-7 py-3 bg-[#1e1f20] hover:bg-[#252959] border border-[#303030] text-[#c4c7c5] hover:text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
          >
            <span>Browse Showcase</span>
            <ArrowRight size={50} className="group-hover:translate-x-0.9 transition-transform" />
          </button>

          {/* <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="px-7 py-3 bg-white hover:bg-zinc-100 text-black font-semibold rounded-full text-xs tracking-wide transition-all shadow-md"
          >
            GitHub Repository
          </a> */}

        </div>

      </div>

      {/* Bottom Indicators */}
      <div className="absolute bottom-8 left-8 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 z-30">
        <span>↓ Click Browse to Start</span>
      </div>

      <div className="absolute bottom-8 right-8 text-[10px] font-mono text-zinc-500 flex items-center gap-2 z-30">
        <span className="text-[#a8c7fa]">•</span>
        <span>Wrap Engine</span>
      </div>

    </div>
  );
};

export default LandingView;
