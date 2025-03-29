'use client';

import { useEffect, useState } from "react";

interface ScrollControllerProps {
  targetId?: string;
  behavior?: ScrollBehavior;
  autoScrollToTop?: boolean;
}

export default function ScrollController({ 
  targetId, 
  behavior = 'smooth',
  autoScrollToTop = false 
}: ScrollControllerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Disable browser's scroll restoration if auto scroll to top is enabled
    if (autoScrollToTop && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Handle scroll to specific element if targetId is provided
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior, block: 'start' });
      }
      return;
    }

    // Auto scroll to top if enabled
    if (autoScrollToTop) {
      window.scrollTo({ top: 0, behavior });
    }
  }, [mounted, targetId, behavior, autoScrollToTop]);

  return null;
} 