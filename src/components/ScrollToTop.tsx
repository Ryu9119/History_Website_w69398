import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const prevPathnameRef = useRef<string>('');

  useEffect(() => {
    // Only scroll to top when pathname actually changes, not query parameters
    if (location.pathname !== prevPathnameRef.current) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname, location.search]); // Monitor both but only act on pathname changes

  return null;
};

export default ScrollToTop;
