import { useState, useEffect } from 'react';

function useIsMobile({ defaultWidth = 992 }: { defaultWidth?: number } = {}) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= defaultWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= defaultWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [defaultWidth]);

  return isMobile;
}

export default useIsMobile;
