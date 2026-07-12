import React, { useState, useRef, useEffect } from 'react';

export const EyeTrackInput: React.FC = () => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxPupilOffset = 6; // max distance pupil can move from center

  const updatePupils = (targetX: number, targetY: number) => {
    const pupils = [
      { pupil: leftPupilRef.current, eye: leftEyeRef.current },
      { pupils: rightPupilRef.current, eye: rightEyeRef.current },
    ];

    pupils.forEach((item) => {
      const pupil = item.pupil || (item as any).pupils; // handles rename/access
      const eye = item.eye;
      if (!pupil || !eye) return;

      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = targetX - centerX;
      const dy = targetY - centerY;
      const angle = Math.atan2(dy, dx);
      
      const dist = Math.min(maxPupilOffset, Math.sqrt(dx * dx + dy * dy) * 0.05);

      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;

      pupil.style.transform = `translate3d(${px}px, ${py}px, 0)`;
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isFocused) return;
      updatePupils(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    triggerCaretTracking(val);
  };

  const triggerCaretTracking = (currentVal: string) => {
    const input = inputRef.current;
    if (!input) return;

    // Estimate caret X position
    const rect = input.getBoundingClientRect();
    const charWidth = 8.2; // average pixel width of monospaced character
    const textWidth = Math.min(rect.width - 32, currentVal.length * charWidth);
    const caretX = rect.left + 16 + textWidth;
    const caretY = rect.top + rect.height / 2;

    updatePupils(caretX, caretY);
  };

  const handleFocus = () => {
    setIsFocused(true);
    triggerCaretTracking(text);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-sm select-none">
      {/* Dynamic Eye Icons Container */}
      <div className="flex gap-6 mb-6">
        {/* Left Eye */}
        <div 
          ref={leftEyeRef} 
          className="relative w-14 h-10 rounded-full border border-dark-border bg-dark-300 flex items-center justify-center overflow-hidden"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            {/* Eye Sclera Outline */}
            <ellipse cx="12" cy="12" rx="10" ry="6" stroke="#27272a" strokeWidth="1" />
            {/* Pupil Circle (Interactive Ref) */}
            <circle 
              ref={leftPupilRef} 
              cx="12" 
              cy="12" 
              r="3.5" 
              fill="#a855f7" 
              className="transition-transform duration-75 ease-out transform-gpu"
              style={{ transformOrigin: 'center' }}
            />
          </svg>
        </div>

        {/* Right Eye */}
        <div 
          ref={rightEyeRef} 
          className="relative w-14 h-10 rounded-full border border-dark-border bg-dark-300 flex items-center justify-center overflow-hidden"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="12" rx="10" ry="6" stroke="#27272a" strokeWidth="1" />
            <circle 
              ref={rightPupilRef} 
              cx="12" 
              cy="12" 
              r="3.5" 
              fill="#a855f7" 
              className="transition-transform duration-75 ease-out transform-gpu"
              style={{ transformOrigin: 'center' }}
            />
          </svg>
        </div>
      </div>

      {/* Input container */}
      <div className="w-full relative">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Type here to lead their gaze..."
          className="w-full px-4 py-3 bg-dark-200 border border-dark-border rounded-xl text-zinc-100 font-mono text-sm placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
        <div className="absolute right-3.5 top-3.5 flex items-center">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isFocused ? 'bg-purple-500 animate-pulse' : 'bg-zinc-600'}`} />
        </div>
      </div>
      <span className="text-[10px] text-zinc-500 font-mono mt-2 uppercase tracking-wider">
        Mode: {isFocused ? 'Typing Caret Tracking' : 'Mouse Vector Tracking'}
      </span>
    </div>
  );
};

export default EyeTrackInput;
