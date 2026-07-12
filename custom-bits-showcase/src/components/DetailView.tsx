import React, { useState } from 'react';
import { RegistryItem } from '../data/registry';
import { ArrowLeft, Play, Code, Copy, Check, Info } from 'lucide-react';

// Import all components to render inside the details workbench sandbox
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

export interface DetailViewProps {
  item: RegistryItem;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  item,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy operation failed", err);
    }
  };

  const renderLiveComponent = () => {
    switch (item.id) {
      case 'tilt-card':
        return <TiltCard />;
      case 'magnetic-button':
        return <MagneticButton />;
      case 'liquid-tabs':
        return <LiquidTabs />;
      case 'inertia-list':
        return <InertiaList />;
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
        return <div className="text-zinc-500 font-mono text-xs">Preview panel empty</div>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      
      {/* Back button and Meta block */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onBack}
          className="self-start flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1e1f20] border border-[#303030] hover:bg-[#2d2f31] hover:border-[#444746] rounded-full text-xs font-medium text-[#c4c7c5] hover:text-white transition-all"
        >
          <ArrowLeft size={12} />
          <span>Back to directory</span>
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4 mt-2">
          <div className="space-y-1">
            <span className="text-[10px] font-sans text-[#a8c7fa] bg-[#004a77]/30 px-2.5 py-0.5 rounded-full border border-[#004a77]/50">
              {item.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white font-sans mt-1">
              {item.name}
            </h2>
            <p className="text-sm text-[#c4c7c5] leading-relaxed max-w-2xl">
              {item.description}
            </p>
          </div>

          {/* Copy-paste prompt */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-[#004a77] hover:bg-[#384954] text-[#c2e7ff] hover:text-white font-semibold rounded-full text-xs transition-all duration-200 border border-[#004a77]"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "COPIED" : "COPY CODE"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Tab controller */}
      <div className="border-b border-[#303030] flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'preview'
                ? 'border-[#a8c7fa] text-[#a8c7fa] font-semibold'
                : 'border-transparent text-[#8e918f] hover:text-[#c4c7c5]'
            }`}
          >
            <Play size={12} />
            <span>SANDBOX WORKSPACE</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'code'
                ? 'border-[#a8c7fa] text-[#a8c7fa] font-semibold'
                : 'border-transparent text-[#8e918f] hover:text-[#c4c7c5]'
            }`}
          >
            <Code size={12} />
            <span>SOURCE CODE</span>
          </button>
        </div>
        <span className="text-[10px] text-[#8e918f] font-sans hidden sm:inline">ZERO THIRD-PARTY LIBS</span>
      </div>

      {/* Canvas workspace block */}
      <div className="bg-[#1e1f20] border border-[#303030] rounded-3xl overflow-hidden min-h-[380px] flex flex-col">
        {activeTab === 'preview' ? (
          <div className="flex-1 flex flex-col">
            {/* Live Interactive stage */}
            <div className="flex-1 bg-[#131314]/30 relative flex items-center justify-center p-8">
              {/* Interactive Grid Canvas background */}
              <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
              <div className="absolute inset-0 radial-mask pointer-events-none" />
              
              <div className="relative z-10 w-full flex justify-center">
                {renderLiveComponent()}
              </div>
            </div>

            {/* Instruction Footer panel */}
            <div className="p-4 bg-[#1e1f20] border-t border-[#303030] flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#3c4043] text-[#a8c7fa] shrink-0 mt-0.5">
                <Info size={14} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide">Implementation Hook Instructions</h4>
                <p className="text-xs text-[#c4c7c5] leading-relaxed mt-1">
                  {item.instructions}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative select-text">
            {/* Header toolbar */}
            <div className="px-5 py-3.5 bg-[#1a1b1c] border-b border-[#303030] flex justify-between items-center">
              <span className="text-xs font-mono text-zinc-500">src/components/interactions/{item.id.charAt(0).toUpperCase() + item.id.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}.tsx</span>
              <button 
                onClick={handleCopy}
                className="text-[#8e918f] hover:text-white transition-colors p-1"
                title="Copy source block"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Monospaced code layout view */}
            <div className="flex-1 overflow-x-auto p-6 font-mono text-xs text-[#c4c7c5] leading-relaxed bg-[#131314] focus:outline-none">
              <pre className="whitespace-pre">
                {item.code}
              </pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DetailView;
