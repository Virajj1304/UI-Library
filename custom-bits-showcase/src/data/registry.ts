export interface RegistryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string;
  code: string;
}

export const registry: RegistryItem[] = [
  {
    id: "tilt-card",
    name: "3D Parallax Tilt Card",
    category: "Cards",
    description: "Hardware accelerated 3D rotating cards calculating local pointer vectors, shifting internal layers dynamically to build spatial depth.",
    instructions: "Attach the `useTilt` hook to any container. Add `data-tilt-parallax=\"factor\"` to elements inside that container to make them shift independently on mouse hover.",
    code: `import React from 'react';
import { useTilt } from '../../hooks/useTilt';
import { Layers } from 'lucide-react';

export const TiltCard = () => {
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div data-tilt-parallax="-12" className="absolute top-10 right-10 w-24 h-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none transform-gpu" />

      <div className="flex items-center justify-between">
        <span data-tilt-parallax="-6" className="text-xs font-semibold tracking-widest text-purple-400 uppercase transform-gpu">
          Interactive Frame
        </span>
        <div data-tilt-parallax="-15" className="p-2.5 rounded-xl bg-dark-300 border border-dark-border text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors transform-gpu">
          <Layers size={18} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 data-tilt-parallax="12" className="text-2xl font-bold tracking-tight text-white transform-gpu">
          3D Parallax Space
        </h3>
        <p data-tilt-parallax="6" className="text-sm leading-relaxed text-zinc-400 transform-gpu">
          Move your mouse over this card to feel the multi-layered spatial depth shift.
        </p>
      </div>

      <div className="flex items-center text-xs text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors">
        <span>Hover context enabled</span>
        <div className="ml-2 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
      </div>
    </div>
  );
};`
  },
  {
    id: "magnetic-button",
    name: "Elastic Magnetic Button",
    category: "Buttons",
    description: "Elastic trigger that tracks pointer coordinate proximity and pulls the container towards the mouse. Inner labels translate slower to simulate magnetic drag.",
    instructions: "Apply `useMagnetic` to a button wrapper. Mark inner labels or elements with `data-magnetic-label` to give them a slower magnetic offset.",
    code: `import React from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { ArrowUpRight } from 'lucide-react';

export const MagneticButton = () => {
  const buttonRef = useMagnetic<HTMLButtonElement>({
    range: 90,
    strength: 0.35,
    labelStrength: 0.18,
    speed: 350,
  });

  return (
    <button
      ref={buttonRef}
      className="relative group px-8 py-4 bg-gradient-to-r from-purple-600 to-accent-purpleDark text-white font-semibold rounded-full flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-purple-500/20 active:scale-95 transform-gpu outline-none"
    >
      <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span data-magnetic-label className="flex items-center gap-2 tracking-wide transform-gpu pointer-events-none">
        <span>Connect Wallet</span>
        <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-300 ease-out" />
      </span>
    </button>
  );
};`
  },
  {
    id: "liquid-tabs",
    name: "Fluid Bubble Morphing Tabs",
    category: "Tabs",
    description: "Clean sliding tabs utilizing an SVG gooey visual filter overlay to merge, morph, and elastically stretch the active indicator background between tab states.",
    instructions: "The indicator uses standard CSS translations coupled with a custom SVG gooey filter `<feColorMatrix>` applied on the background wrapper. Labels are layered on top to remain sharp.",
    code: `import React, { useState, useRef, useEffect } from 'react';

export const LiquidTabs = () => {
  const tabs = ["Profile", "Integrations", "Security", "Billing"];
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

  return (
    <div className="relative">
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div ref={containerRef} className="relative flex items-center p-1.5 bg-dark-300 rounded-full border border-dark-border">
        <div className="absolute inset-0 pointer-events-none gooey-filter w-full h-full p-1.5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-accent-purpleDark rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ transform: \`translate3d(\${pillStyle.left}px, 0, 0)\`, width: \`\${pillStyle.width}px\` }}
          />
        </div>

        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => setActiveIndex(index)}
            className={\`relative z-10 px-6 py-2 text-sm font-semibold rounded-full focus:outline-none transition-colors duration-200 \${
              activeIndex === index ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }\`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};`
  },
  {
    id: "inertia-list",
    name: "Velocity Skew/Tilt List Links",
    category: "Lists",
    description: "Vertical index links that track list scroll displacement velocity and warp themselves through real-time CSS skewY properties, LERPing back to zero.",
    instructions: "Binds a scroll listener inside the container, evaluates velocity directly via math LERP, and triggers a direct layout skew update without triggering React cycles.",
    code: `import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { lerp, clamp } from '../../utils/math';

export const InertiaList = () => {
  const items = ["Design Engineering Systems", "WebGL Shader Programming", "Hardware Accelerated Compilers"];
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollY = container.scrollTop;
    let scrollVelocity = 0;
    let currentSkew = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      scrollVelocity = currentScroll - lastScrollY;
      lastScrollY = currentScroll;
    };

    const updateInertia = () => {
      scrollVelocity = lerp(scrollVelocity, 0, 0.1);
      const targetSkew = clamp(scrollVelocity * 0.08, -12, 12);
      currentSkew = lerp(currentSkew, targetSkew, 0.15);

      itemsRef.current.forEach((item) => {
        if (item) item.style.transform = \`skewY(\${currentSkew}deg)\`;
      });
      animationFrameId = requestAnimationFrame(updateInertia);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updateInertia);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-80 overflow-y-auto border border-dark-border bg-dark-200 rounded-2xl p-4 space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          ref={(el) => (itemsRef.current[index] = el)}
          className="group flex items-center justify-between p-4 bg-dark-300 border border-dark-border/40 rounded-xl hover:border-purple-500/30 hover:bg-dark-100 transition-colors duration-200 cursor-pointer transform-gpu"
        >
          <span>{item}</span>
          <ArrowRight size={16} />
        </div>
      ))}
    </div>
  );
};`
  },
  {
    id: "grip-sheet",
    name: "Logarithmic Drag Rebound Sheet",
    category: "Drawers",
    description: "Draggable bottom sheet utilizing PointerEvents and friction mechanics. Dragging beyond the top height introduces logarithmic resistance, snapping back using WAAPI.",
    instructions: "Attach `onPointerDown`, `onPointerMove`, and `onPointerUp` to a grip handle bar. Apply standard vector calculations and boundary resistance using `Math.log10` scaling.",
    code: `import React, { useState, useRef } from 'react';
import { Menu } from 'lucide-react';

export const GripSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY - currentY.current;
    sheetRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    const deltaY = e.clientY - dragStartY.current;

    if (deltaY < 0) {
      currentY.current = -Math.log10(1 + Math.abs(deltaY)) * 45; // Log resistance
    } else {
      currentY.current = deltaY;
    }
    sheetRef.current.style.transform = \`translate3d(0, \${currentY.current}px, 0)\`;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    isDragging.current = false;
    sheetRef.current.releasePointerCapture(e.pointerId);

    if (currentY.current > 80) closeSheet();
    else openSheet();
  };

  const openSheet = () => {
    setIsOpen(true);
    sheetRef.current?.animate([
      { transform: sheetRef.current.style.transform },
      { transform: 'translate3d(0, 0px, 0)' }
    ], { duration: 350, easing: 'elastic.out(1, 0.65)' as string }).onfinish = () => {
      if (sheetRef.current) sheetRef.current.style.transform = 'translate3d(0, 0px, 0)';
      currentY.current = 0;
    };
  };

  const closeSheet = () => {
    sheetRef.current?.animate([
      { transform: sheetRef.current.style.transform },
      { transform: 'translate3d(0, 100%, 0)' }
    ], { duration: 250, easing: 'ease-out' }).onfinish = () => {
      if (sheetRef.current) sheetRef.current.style.transform = 'translate3d(0, 100%, 0)';
      currentY.current = 280;
      setIsOpen(false);
    };
  };

  return (
    <div className="relative overflow-hidden w-full h-80 bg-dark-100 flex items-center justify-center">
      <button onClick={openSheet} className="px-4 py-2 bg-dark-200 border border-dark-border rounded-xl">Toggle Sheet</button>
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 h-72 bg-dark-200 border-t border-dark-border rounded-t-3xl"
        style={{ transform: 'translate3d(0, 100%, 0)' }}
      >
        <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} className="w-full flex justify-center py-4 cursor-grab">
          <div className="w-12 h-1.5 rounded-full bg-zinc-600" />
        </div>
        <div className="p-8">Drawer Content</div>
      </div>
    </div>
  );
};`
  },
  {
    id: "bounce-toggle",
    name: "Collision Impact Toggle Switch",
    category: "Inputs",
    description: "Physical collision simulation on checkboxes. Sliding the active toggle knob triggers directional squash-and-stretch borders using WAAPI transform scaling.",
    instructions: "Attach a state change listener that applies an animation using variable transform origins (`left center` or `right center`) to squish the switch based on direction.",
    code: `import React, { useState, useRef } from 'react';

export const BounceToggle = () => {
  const [checked, setChecked] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const nextState = !checked;
    setChecked(nextState);

    const container = containerRef.current;
    if (!container) return;

    const origin = nextState ? 'right center' : 'left center';
    container.animate([
      { transform: 'scale3d(1, 1, 1)', transformOrigin: origin },
      { transform: 'scale3d(1.22, 0.82, 1)', transformOrigin: origin },
      { transform: 'scale3d(0.9, 1.08, 1)', transformOrigin: origin },
      { transform: 'scale3d(1, 1, 1)', transformOrigin: origin }
    ], { duration: 320, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)' });
  };

  return (
    <button
      ref={containerRef}
      onClick={handleToggle}
      className={\`relative w-20 h-10 rounded-full border transition-all duration-300 outline-none \${
        checked ? 'bg-purple-500 border-purple-400' : 'bg-dark-300 border-dark-border'
      }\`}
    >
      <div
        className={\`absolute top-1 w-7.5 h-7.5 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] \${
          checked ? 'left-11' : 'left-1'
        }\`}
        style={{ width: '30px', height: '30px' }}
      />
    </button>
  );
};`
  },
  {
    id: "eyetrack-input",
    name: "Trigonometric Radian Eye-Tracking Input",
    category: "Inputs",
    description: "Input panel featuring a pair of vector eyes that follow the user's cursor when idle, and lock on the text caret via text-width trigonometry as they type.",
    instructions: "Track mouse coordinate offsets using trigonometric `Math.atan2(dy, dx)` for normal vector movement, and estimate character sizing (`length * charWidth`) to track the focused caret.",
    code: `import React, { useState, useRef, useEffect } from 'react';

export const EyeTrackInput = () => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updatePupils = (targetX: number, targetY: number) => {
    const pupils = [
      { pupil: leftPupilRef.current, eye: leftEyeRef.current },
      { pupil: rightPupilRef.current, eye: rightEyeRef.current },
    ];

    pupils.forEach((item) => {
      const { pupil, eye } = item;
      if (!pupil || !eye) return;

      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = targetX - centerX;
      const dy = targetY - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(6, Math.sqrt(dx * dx + dy * dy) * 0.05);

      pupil.style.transform = \`translate3d(\${Math.cos(angle) * dist}px, \${Math.sin(angle) * dist}px, 0)\`;
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isFocused) updatePupils(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    const input = inputRef.current;
    if (input) {
      const rect = input.getBoundingClientRect();
      const caretX = rect.left + 16 + Math.min(rect.width - 32, val.length * 8.2);
      updatePupils(caretX, rect.top + rect.height / 2);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-6 mb-6">
        <div ref={leftEyeRef} className="w-14 h-10 rounded-full border border-dark-border bg-dark-300 flex items-center justify-center overflow-hidden">
          <svg className="w-8 h-8"><ellipse cx="12" cy="12" rx="10" ry="6" stroke="#27272a" /><circle ref={leftPupilRef} cx="12" cy="12" r="3.5" fill="#a855f7" /></svg>
        </div>
        <div ref={rightEyeRef} className="w-14 h-10 rounded-full border border-dark-border bg-dark-300 flex items-center justify-center overflow-hidden">
          <svg className="w-8 h-8"><ellipse cx="12" cy="12" rx="10" ry="6" stroke="#27272a" /><circle ref={rightPupilRef} cx="12" cy="12" r="3.5" fill="#a855f7" /></svg>
        </div>
      </div>
      <input ref={inputRef} type="text" value={text} onChange={handleInputChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="w-full px-4 py-3 bg-dark-200 border border-dark-border rounded-xl font-mono text-sm" />
    </div>
  );
};`
  },
  {
    id: "kinetic-fab",
    name: "Cursor-Deflection Floating Action Button",
    category: "Buttons",
    description: "A floating action button implementing cursor repulsion. Approaching cursors push the FAB away with magnet dynamics. Hovering directly attracts it and unfolds satellites.",
    instructions: "Calculates distance vector from FAB center to pointer position. Within range, apply a deflection transform, transitioning back using WAAPI spring interpolation.",
    code: `import React, { useState, useRef, useEffect } from 'react';
import { Plus, Settings, MessageSquare, Share2 } from 'lucide-react';
import { getDistance } from '../../utils/math';

export const KineticFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;

    let activeAnimation: Animation | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      const dist = getDistance({ x: e.clientX, y: e.clientY }, btnCenter);

      if (dist < 110) {
        activeAnimation?.cancel();
        const dx = btnCenter.x - e.clientX;
        const dy = btnCenter.y - e.clientY;

        if (dist < 40) {
          btn.style.transform = \`translate3d(\${-dx * 0.28}px, \${-dy * 0.28}px, 0)\`; // snap pull
        } else {
          const pushStrength = (1 - dist / 110) * 20; // push deflection
          const angle = Math.atan2(dy, dx);
          btn.style.transform = \`translate3d(\${Math.cos(angle) * pushStrength}px, \${Math.sin(angle) * pushStrength}px, 0)\`;
        }
      } else {
        resetPosition();
      }
    };

    const resetPosition = () => {
      if (!btn.style.transform) return;
      activeAnimation = btn.animate([{ transform: btn.style.transform }, { transform: 'translate3d(0px,0px,0px)' }], {
        duration: 300, easing: 'elastic.out(1, 0.5)' as string, fill: 'forwards'
      });
      activeAnimation.onfinish = () => btn.style.transform = '';
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', resetPosition);
    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', resetPosition);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="relative">
        <div ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center">
          <Plus size={24} className={isOpen ? 'rotate-45' : ''} />
        </div>
      </div>
    </div>
  );
};`
  },
  {
    id: "reveal-menu",
    name: "Smooth LERP Image Follow Menu Link",
    category: "Lists",
    description: "Interactive index row revealing a custom image card that follows pointer trajectories with a smooth LERP damping frame and rotation offsets.",
    instructions: "Track pointer coordinates inside a parent container relative bounding frame. Map coordinates to the hover element inside a `requestAnimationFrame` LERP loop.",
    code: `import React, { useState, useRef, useEffect } from 'react';
import { lerp } from '../../utils/math';

export const RevealMenu = () => {
  const [activeItem, setActiveItem] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const preview = previewRef.current;
    if (!container || !preview) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };

    const renderLoop = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.08);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.08);

      const dx = mousePos.current.x - currentPos.current.x;
      preview.style.transform = \`translate3d(\${currentPos.current.x - 90}px, \${currentPos.current.y - 60}px, 0) rotate(\${dx * 0.12}deg)\`;
      requestAnimationFrame(renderLoop);
    };

    container.addEventListener('mousemove', handleMouseMove);
    const id = requestAnimationFrame(renderLoop);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full p-6">
      <div ref={previewRef} className="absolute w-44 h-28 pointer-events-none opacity-0" />
      {/* Menu items list here */}
    </div>
  );
};`
  },
  {
    id: "elastic-progress",
    name: "SVG Stroke-Dash Elastic Progress",
    category: "Drawers",
    description: "An SVG progress track implementing physical spring models. Altering progress sags the curved stroke via Hooke's Law equations, settling with custom elastic oscillations.",
    instructions: "Run spring equations `Force = -kx - cv` in a rendering loop, updating the quadratic control point of the SVG path when progress is adjusted.",
    code: `import React, { useState, useEffect, useRef } from 'react';

export const ElasticProgress = () => {
  const [progress, setProgress] = useState(35);
  const yOffset = useRef(50);
  const targetY = 50;
  const velocity = useRef(0);
  const pathRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      const springForce = -0.085 * (yOffset.current - targetY);
      const dampingForce = -0.12 * velocity.current;
      velocity.current += springForce + dampingForce;
      yOffset.current += velocity.current;

      const path = pathRef.current;
      const fill = fillRef.current;

      if (path && fill) {
        path.setAttribute('d', \`M 10 50 Q 160 \${yOffset.current} 310 50\`);
        const t = progress / 100;
        const bx = (1-t)*(1-t)*10 + 2*(1-t)*t*160 + t*t*310;
        const by = (1-t)*(1-t)*50 + 2*(1-t)*t*yOffset.current + t*t*50;
        fill.setAttribute('d', \`M 10 50 Q \${(10 + bx) / 2} \${(50 + by) / 2} \${bx} \${by}\`);
      }
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  return (
    <div>
      <svg className="w-80 h-20" viewBox="0 0 320 100">
        <path ref={pathRef} d="M 10 50 Q 160 50 310 50" stroke="#1f1f23" strokeWidth="4" />
        <path ref={fillRef} d="M 10 50 Q 85 50 160 50" stroke="#a855f7" strokeWidth="4" />
      </svg>
      <button onClick={() => { setProgress(60); velocity.current += 30; }}>Update Progress</button>
    </div>
  );
};`
  },
  {
    id: "bento-gravity",
    name: "Ferrofluid Bento Gravity Grid",
    category: "Cards",
    description: "Bento grid item blocks that calculate pointer vectors and pull layout dimensions towards cursor coordinates at 60fps, projecting custom radial spotlight border filters.",
    instructions: "Attach a pointermove listener to the grid. Compute vector distance from cursor to each card's center. Update CSS translation transforms and set local `--mouse-x` and `--mouse-y` border gradient highlight variables directly.",
    code: `import React, { useRef, useEffect } from 'react';
import { Shield, Activity, Sparkles } from 'lucide-react';

export const BentoGravity = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        card.style.setProperty('--mouse-x', \`\${e.clientX - rect.left}px\`);
        card.style.setProperty('--mouse-y', \`\${e.clientY - rect.top}px\`);

        if (dist < 240) {
          const strength = (1 - dist / 240) * 12;
          const angle = Math.atan2(dy, dx);
          card.style.transform = \`translate3d(\${Math.cos(angle) * strength}px, \${Math.sin(angle) * strength}px, 0) scale3d(1.015, 1.015, 1.015)\`;
          card.style.borderColor = 'rgba(168, 85, 247, 0.3)';
        } else {
          card.style.transform = '';
          card.style.borderColor = '';
        }
      });
    };

    container.addEventListener('pointermove', handlePointerMove);
    return () => container.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-4 h-80 w-full">
      <div ref={el => cardRefs.current[0] = el} className="col-span-2 bg-dark-200 border rounded-2xl p-6" style={{ backgroundImage: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.08), transparent 80%)' }}>Card 1</div>
      <div ref={el => cardRefs.current[1] = el} className="col-span-1 bg-dark-200 border rounded-2xl p-6" style={{ backgroundImage: 'radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.08), transparent 80%)' }}>Card 2</div>
    </div>
  );
};`
  },
  {
    id: "sonic-input",
    name: "Acoustic Waveform Input",
    category: "Inputs",
    description: "A neon input line built from an SVG quadratic baseline that ripples into soundwaves as you type, decaying back to idle vectors.",
    instructions: "Track keystroke input changes. Add a dynamic impulse value to the wave amplitude. Decay the amplitude inside a requestAnimationFrame rendering loop, recalculating path vertices based on time-based sine math.",
    code: `import React, { useState, useEffect, useRef } from 'react';

export const SonicInput = () => {
  const [text, setText] = useState('');
  const pathRef = useRef<SVGPathElement>(null);
  const amplitude = useRef(0);
  const time = useRef(0);

  useEffect(() => {
    const renderWave = () => {
      time.current += 0.16;
      amplitude.current *= 0.94;
      const path = pathRef.current;
      if (path) {
        let d = 'M 10 50';
        for (let i = 0; i <= 32; i++) {
          const ratio = i / 32;
          const angle = ratio * Math.PI * 6 - time.current;
          const y = 50 + Math.sin(angle) * amplitude.current;
          d += \` L \${10 + ratio * 300} \${y}\`;
        }
        path.setAttribute('d', d);
      }
      requestAnimationFrame(renderWave);
    };
    const id = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="bg-dark-200 p-6 border rounded-2xl w-full">
      <input type="text" value={text} onChange={(e) => { setText(e.target.value); amplitude.current = Math.min(22, amplitude.current + 5.5); }} className="bg-transparent text-white focus:outline-none" />
      <svg className="w-full h-12"><path ref={pathRef} d="M 10 50 L 310 50" stroke="#7c3aed" strokeWidth="2.5" /></svg>
    </div>
  );
};`
  },
  {
    id: "bubble-burst",
    name: "Gooey Mitosis CTA Button",
    category: "Buttons",
    description: "Premium call-to-action button implementing cell division. Clicking the action divides the pill elastically into three separate satellite actions, linked by a visual gooey filter.",
    instructions: "Apply an SVG gooey filter definitions block inside the DOM. Translate 3 backing circle elements outwards when active, mapping interactive icons on top to remain sharp.",
    code: `import React, { useState } from 'react';
import { Link, Share, Copy, Plus } from 'lucide-react';

export const BubbleBurst = () => {
  const [isOpen, setIsOpen] = useState(false);
  const nodes = [
    { icon: <Link size={14} />, tx: -68, ty: -35 },
    { icon: <Share size={14} />, tx: 0, ty: -75 },
    { icon: <Copy size={14} />, tx: 68, ty: -35 }
  ];

  return (
    <div className="relative">
      <svg className="absolute w-0 h-0"><defs><filter id="bubble-goo"><feGaussianBlur stdDeviation="8" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" /><feComposite operator="atop" /></filter></defs></svg>
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 flex items-center justify-center" style={{ filter: 'url(#bubble-goo)' }}>
          <div className="w-32 h-12 bg-purple-600 rounded-full" />
          {nodes.map((node, i) => (
            <div key={i} className="absolute w-10 h-10 bg-purple-600 rounded-full transition-transform duration-300" style={{ transform: isOpen ? \`translate3d(\${node.tx}px, \${node.ty}px, 0)\` : 'translate3d(0,0,0)' }} />
          ))}
        </div>
      </div>
    </div>
  );
};`
  }
];

export const categories = ["All", "Cards", "Buttons", "Tabs", "Lists", "Drawers", "Inputs"];
export const getRegistryItemById = (id: string) => registry.find(item => item.id === id);
