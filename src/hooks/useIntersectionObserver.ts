// src/hooks/useIntersectionObserver.ts
import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions
): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const frozen = useRef<boolean>(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element || (freezeOnceVisible && frozen.current)) return;

    const observerCallback: IntersectionObserverCallback = ([entry]) => {
      const isIntersecting = entry.isIntersecting;
      setIsVisible(isIntersecting);

      if (freezeOnceVisible && isIntersecting) {
        frozen.current = true;
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible]);

  return isVisible;
}