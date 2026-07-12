import React, { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';

export const GripSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartY.current = e.clientY - currentY.current;
    
    const sheet = sheetRef.current;
    if (sheet) {
      sheet.style.transition = 'none';
      sheet.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    const deltaY = e.clientY - dragStartY.current;

    if (deltaY < 0) {
      // Logarithmic resistance for pulling upwards beyond full height
      const absDelta = Math.abs(deltaY);
      // Math.log10(1 + x) * scale creates a smooth logarithmic dampening curve
      const resistance = -Math.log10(1 + absDelta) * 45;
      currentY.current = resistance;
    } else {
      // Normal linear drag downwards (closing direction)
      currentY.current = deltaY;
    }

    sheet.style.transform = `translate3d(0, ${currentY.current}px, 0)`;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const sheet = sheetRef.current;
    if (!sheet) return;

    sheet.releasePointerCapture(e.pointerId);

    // If dragged down by more than 80px, close it
    if (currentY.current > 80) {
      closeSheet();
    } else {
      // Bounce back to open state (translateY(0))
      openSheet();
    }
  };

  const openSheet = () => {
    setIsOpen(true);
    const sheet = sheetRef.current;
    if (!sheet) return;

    const keyframes = [
      { transform: sheet.style.transform || 'translate3d(0, 100%, 0)' },
      { transform: 'translate3d(0, 0px, 0)' }
    ];

    sheet.animate(keyframes, {
      duration: 350,
      easing: 'elastic.out(1, 0.65)' as string || 'ease-out',
      fill: 'forwards'
    }).onfinish = () => {
      sheet.style.transform = 'translate3d(0, 0px, 0)';
      currentY.current = 0;
    };
  };

  const closeSheet = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const keyframes = [
      { transform: sheet.style.transform || 'translate3d(0, 0px, 0)' },
      { transform: 'translate3d(0, 100%, 0)' }
    ];

    sheet.animate(keyframes, {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    }).onfinish = () => {
      sheet.style.transform = 'translate3d(0, 100%, 0)';
      currentY.current = 280; // height offset
      setIsOpen(false);
    };
  };

  return (
    <div className="relative w-full h-80 bg-dark-100 rounded-2xl border border-dark-border overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Grid inside viewport */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <button
        onClick={() => {
          if (isOpen) closeSheet();
          else openSheet();
        }}
        className="z-10 flex items-center gap-2 px-5 py-2.5 bg-dark-200 border border-dark-border hover:border-purple-500/30 text-sm font-semibold rounded-xl text-zinc-200 hover:text-white transition-all glow-hover"
      >
        <Menu size={16} />
        <span>Toggle Bottom Sheet</span>
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={closeSheet}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 z-20"
        />
      )}

      {/* Bottom Sheet Drawer */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 h-72 bg-dark-200 border-t border-dark-border rounded-t-3xl z-30 touch-none flex flex-col"
        style={{
          transform: 'translate3d(0, 100%, 0)',
          willChange: 'transform',
        }}
      >
        {/* Grip Handle bar */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing group"
        >
          <div className="w-12 h-1.5 rounded-full bg-zinc-600 group-hover:bg-zinc-400 group-active:bg-purple-500 transition-colors duration-200" />
        </div>

        {/* Content Box */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto select-none">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">System Properties</h4>
              <p className="text-xs text-zinc-500 font-mono">DAMPING: Log10 Resistance Vector</p>
            </div>
            <button 
              onClick={closeSheet}
              className="p-1 rounded-lg hover:bg-dark-300 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3 bg-dark-300 rounded-xl border border-dark-border/40">
              <span className="text-xs font-semibold text-zinc-400">Pointer Capture</span>
              <span className="text-xs font-mono text-purple-400">active.device</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-300 rounded-xl border border-dark-border/40">
              <span className="text-xs font-semibold text-zinc-400">Frictional Coefficient</span>
              <span className="text-xs font-mono text-purple-400">Log10(1 + dy)</span>
            </div>
            <p className="text-xs text-zinc-500 leading-normal text-center pt-2">
              Try dragging the top handle bar up or down. Dragging downward passes the threshold of 80px to close the sheet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GripSheet;
