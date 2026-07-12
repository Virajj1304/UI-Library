import { useRef, useEffect } from 'react';
import { getDistance, Point2D } from '../utils/math';

interface MagneticOptions {
  range?: number;
  strength?: number;
  labelStrength?: number;
  speed?: number;
}

export const useMagnetic = <T extends HTMLElement>(options: MagneticOptions = {}) => {
  const elementRef = useRef<T | null>(null);

  const {
    range = 80,
    strength = 0.35,
    labelStrength = 0.15,
    speed = 300,
  } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let activeAnimation: Animation | null = null;
    let isAttracted = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const cursor: Point2D = { x: e.clientX, y: e.clientY };
      const center: Point2D = { x: centerX, y: centerY };

      const distance = getDistance(cursor, center);

      if (distance < range) {
        isAttracted = true;
        if (activeAnimation) {
          activeAnimation.cancel();
          activeAnimation = null;
        }

        // Vector pull calculations
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        // Direct style mutation for 60fps translation
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
        
        // Tilt/shift inner label if available to create depth (nested magnetic effect)
        const label = el.querySelector<HTMLElement>('[data-magnetic-label]');
        if (label) {
          label.style.transform = `translate3d(${dx * labelStrength}px, ${dy * labelStrength}px, 0)`;
        }
      } else if (isAttracted) {
        handleRelease();
      }
    };

    const handleRelease = () => {
      isAttracted = false;

      // Animate parent frame back to center using Web Animations API
      const keyframes = [
        { transform: el.style.transform },
        { transform: 'translate3d(0px, 0px, 0px)' }
      ];

      activeAnimation = el.animate(keyframes, {
        duration: speed,
        easing: 'elastic.out(1, 0.4)' as string || 'ease-out',
        fill: 'forwards'
      });

      activeAnimation.onfinish = () => {
        el.style.transform = '';
        activeAnimation = null;
      };

      // Animate inner label back to center
      const label = el.querySelector<HTMLElement>('[data-magnetic-label]');
      if (label) {
        const labelKeyframes = [
          { transform: label.style.transform },
          { transform: 'translate3d(0px, 0px, 0px)' }
        ];
        label.animate(labelKeyframes, {
          duration: speed,
          easing: 'elastic.out(1, 0.4)' as string || 'ease-out',
          fill: 'forwards'
        }).onfinish = () => {
          label.style.transform = '';
        };
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handleRelease);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handleRelease);
      if (activeAnimation) activeAnimation.cancel();
    };
  }, [range, strength, labelStrength, speed]);

  return elementRef;
};
