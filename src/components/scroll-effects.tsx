"use client";

import { useEffect } from 'react';

export function ScrollEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('main > section, main article'));

    revealTargets.forEach((element) => {
      element.dataset.reveal = 'true';
    });

    if (!reduceMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.setAttribute('data-visible', 'true');
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );

      revealTargets.forEach((element) => observer.observe(element));

      const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
      const onScroll = () => {
        const offset = window.scrollY * 0.12;
        parallaxTargets.forEach((element) => {
          element.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
      };

      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
      };
    }

    return undefined;
  }, []);

  return null;
}
