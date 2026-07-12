import React, { useState, useRef, useEffect } from 'react';

export interface LiquidTabsProps {
  tabs?: string[];
  onChange?: (index: number) => void;
}

export const LiquidTabs: React.FC<LiquidTabsProps> = ({
  tabs = ["Profile", "Integrations", "Security", "Billing"],
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    const container = containerRef.current;
    if (activeTab && container) {
      const activeRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      setPillStyle({
        left: activeRect.left - containerRect.left,
        width: activeRect.width,
      });
    }
  }, [activeIndex]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    if (onChange) onChange(index);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8 select-none">
      {/* Hidden SVG Gooey Filter definitions */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Tabs Container */}
      <div 
        ref={containerRef}
        className="relative flex items-center p-1.5 bg-dark-300 rounded-full border border-dark-border"
      >
        {/* Liquid Background Canvas Layer (Gooey Filter Applied) */}
        <div className="absolute inset-0 pointer-events-none gooey-filter w-full h-full p-1.5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-accent-purpleDark rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              transform: `translate3d(${pillStyle.left}px, 0, 0)`,
              width: `${pillStyle.width}px`,
            }}
          />
        </div>

        {/* Sharp Foreground Labels Layer (No Filter, Clickable) */}
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleTabClick(index)}
            className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none ${
              activeIndex === index 
                ? 'text-white' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LiquidTabs;
