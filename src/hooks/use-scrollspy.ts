'use client';

import { useState, useEffect, RefObject } from 'react';

interface ScrollspyOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useScrollspy(
  ids: string[],
  onUpdate: (id: string | null) => void,
  options?: ScrollspyOptions
) {
  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

        if (intersectingEntries.length > 0) {
          // Prioritize the entry that is most visible
          intersectingEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          onUpdate(intersectingEntries[0].target.id);
        } else {
          // If nothing is intersecting, check scroll position to find the nearest element above
          const allElements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
          const topElement = allElements
            .filter(el => el.getBoundingClientRect().top < (options?.root?.clientHeight || window.innerHeight))
            .sort((a,b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
          
          onUpdate(topElement ? topElement.id : null);
        }
      },
      {
        root: options?.root || null,
        rootMargin: options?.rootMargin || '0px 0px -80% 0px',
        threshold: options?.threshold || [0, 0.5, 1],
      }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [ids, onUpdate, options?.root, options?.rootMargin, options?.threshold]);
}
