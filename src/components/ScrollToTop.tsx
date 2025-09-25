import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const prevPathnameRef = useRef<string>(location.pathname);

  useEffect(() => {
    // Only scroll to top when pathname actually changes, not query parameters
    if (location.pathname !== prevPathnameRef.current) {
      // Use setTimeout to ensure it runs after all other scroll events
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' // Use instant instead of smooth for more reliable scroll
        });
      }, 0);
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname]); // Only monitor pathname changes

  return null;
};

export default ScrollToTop;
