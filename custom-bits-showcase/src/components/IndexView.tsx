import React from 'react';
import { registry } from '../data/registry';
import { ArrowRight, Sparkles } from 'lucide-react';

// Import all components to render them live in the dashboard index grid
import TiltCard from './interactions/TiltCard';
import MagneticButton from './interactions/MagneticButton';
import LiquidTabs from './interactions/LiquidTabs';
import InertiaList from './interactions/InertiaList';
import GripSheet from './interactions/GripSheet';
import BounceToggle from './interactions/BounceToggle';
import EyeTrackInput from './interactions/EyeTrackInput';
import KineticFAB from './interactions/KineticFAB';
import RevealMenu from './interactions/RevealMenu';
import ElasticProgress from './interactions/ElasticProgress';
import BentoGravity from './interactions/BentoGravity';
import SonicInput from './interactions/SonicInput';
import BubbleBurst from './interactions/BubbleBurst';

export interface IndexViewProps {
  activeCategory: string;
  onSelectComponent: (id: string) => void;
}

export const IndexView: React.FC<IndexViewProps> = ({
  activeCategory,
  onSelectComponent,
}) => {
  // Dynamically map registry IDs to their corresponding React component instances
  const renderLiveComponent = (id: string) => {
    switch (id) {
      case 'tilt-card':
        return <TiltCard title="3D Card Depth" category="Tilt Effect" description="Rotate card vectors on hover." />;
      case 'magnetic-button':
        return <MagneticButton label="Pull Vector Action" />;
      case 'liquid-tabs':
        return <LiquidTabs tabs={["Core", "API", "Logs"]} />;
      case 'inertia-list':
        return <InertiaList items={["Inertial List Item A", "Inertial List Item B", "Inertial List Item C"]} />;
      case 'grip-sheet':
        return <GripSheet />;
      case 'bounce-toggle':
        return <BounceToggle />;
      case 'eyetrack-input':
        return <EyeTrackInput />;
      case 'kinetic-fab':
        return <KineticFAB />;
      case 'reveal-menu':
        return <RevealMenu />;
      case 'elastic-progress':
        return <ElasticProgress />;
      case 'bento-gravity':
        return <BentoGravity />;
      case 'sonic-input':
        return <SonicInput />;
      case 'bubble-burst':
        return <BubbleBurst />;
      default:
        return <div className="text-zinc-500 text-xs">Sandbox component template</div>;
    }
  };

  // Filter registry items by active category
  const filteredItems = activeCategory === "All"
    ? registry
    : registry.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-8 select-none">
      
      {/* Intro Hero Section */}
      <div className="space-y-3.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1e1f20] border border-[#303030] text-[#a8c7fa] rounded-full text-xs font-medium">
          <Sparkles size={12} />
          <span>React UI Workspace</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white font-sans">
          Micro-Interaction Showcase
        </h1>
        <p className="text-sm text-[#c4c7c5] max-w-2xl leading-relaxed">
          A modular collection of hardware-accelerated, zero-dependency visual components built with standard pointer vectors, native Web Animations API (WAAPI), and mathematical springs.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-2xl bg-[#1e1f20] border border-[#303030] overflow-hidden hover:border-[#444746] hover:bg-[#202124] transition-all duration-200 group"
          >
            {/* Live Component Sandbox Preview Box */}
            <div className="h-56 bg-[#131314]/40 border-b border-[#303030] relative flex items-center justify-center overflow-hidden p-4">
              {renderLiveComponent(item.id)}
            </div>

            {/* Info and Navigation bar */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans text-[#a8c7fa] bg-[#004a77]/30 px-2.5 py-0.5 rounded-full border border-[#004a77]/50">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-sans text-[#8e918f]">60 FPS</span>
                </div>
                <h3 className="text-base font-medium text-white tracking-wide">{item.name}</h3>
                <p className="text-xs leading-relaxed text-[#c4c7c5] line-clamp-2">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => onSelectComponent(item.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-[#131314] border border-[#303030] hover:bg-[#2d2f31] hover:border-[#444746] rounded-full text-xs font-medium text-[#a8c7fa] hover:text-[#c2e7ff] transition-all duration-200"
              >
                <span>Details & Source Code</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default IndexView;
