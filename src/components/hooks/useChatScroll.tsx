import React from 'react';

export function useChatScroll<T>(
  dep: T
): React.MutableRefObject<HTMLDivElement> {
  const ref = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight + 1000;
    }
  }, [dep, ref?.current?.scrollHeight]);
  return ref as any;
}
