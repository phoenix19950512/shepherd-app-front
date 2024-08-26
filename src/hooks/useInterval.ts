import React, { useEffect, useRef } from 'react';

function useInterval(callback = () => {}, delay = 1000) {
  const savedCallback: React.MutableRefObject<any> = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}

export default useInterval;
