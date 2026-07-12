import { useRef, useEffect } from 'react';

interface TiltOptions {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

export const useTilt = <T extends HTMLElement>(options: TiltOptions = {}) => {
  const elementRef = useRef<T | null>(null);

  const {
    max = 15,
    perspective = 1000,
    scale = 1.02,
    speed = 300,
  } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let activeAnimation: Animation | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      
      // Calculate normalized mouse positions relative to element center (-0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const px = x - 0.5;
      const py = y - 0.5;

      // Compute rotations (X rotation corresponds to vertical mouse movement, Y to horizontal)
      const tiltX = -(py * max);
      const tiltY = px * max;

      // Apply transform directly to style node for 60fps frame updates
      el.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      el.style.transition = 'transform 100ms cubic-bezier(0.25, 1, 0.5, 1)';

      // Multi-layered parallax translation for elements inside
      const parallaxChildren = el.querySelectorAll<HTMLElement>('[data-tilt-parallax]');
      parallaxChildren.forEach((child) => {
        const factorAttr = child.getAttribute('data-tilt-parallax');
        const factor = factorAttr ? parseFloat(factorAttr) : 10;
        // Shift in opposite directions to simulate physical parallax depth
        const tx = px * factor;
        const ty = py * factor;
        child.style.transform = `translate3d(${tx}px, ${ty}px, 30px)`;
        child.style.transition = 'transform 100ms cubic-bezier(0.25, 1, 0.5, 1)';
      });
    };

    const handlePointerEnter = () => {
      if (activeAnimation) {
        activeAnimation.cancel();
        activeAnimation = null;
      }
    };

    const handlePointerLeave = () => {
      // Revert styles to default position smoothly using browser WAAPI
      const keyframes = [
        { transform: el.style.transform },
        { transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)` }
      ];

      activeAnimation = el.animate(keyframes, {
        duration: speed,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards'
      });

      activeAnimation.onfinish = () => {
        el.style.transform = '';
        el.style.transition = '';
        activeAnimation = null;
      };

      // Reset parallax children
      const parallaxChildren = el.querySelectorAll<HTMLElement>('[data-tilt-parallax]');
      parallaxChildren.forEach((child) => {
        const childKeyframes = [
          { transform: child.style.transform },
          { transform: 'translate3d(0, 0, 0)' }
        ];
        child.animate(childKeyframes, {
          duration: speed,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards'
        }).onfinish = () => {
          child.style.transform = '';
          child.style.transition = '';
        };
      });
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointerleave', handlePointerLeave);
      if (activeAnimation) activeAnimation.cancel();
    };
  }, [max, perspective, scale, speed]);

  return elementRef;
};
