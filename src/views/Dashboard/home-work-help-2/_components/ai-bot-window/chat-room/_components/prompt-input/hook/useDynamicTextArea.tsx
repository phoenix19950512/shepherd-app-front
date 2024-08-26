import { useEffect } from 'react';
const useDynamicTextareaSize = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  textContent: string,
  // optional maximum height after which textarea becomes scrollable
  maxHeight?: number
): void => {
  useEffect(() => {
    const currentTextarea = textareaRef.current;
    if (currentTextarea) {
      // Temporarily collapse the textarea to calculate the required height
      currentTextarea.style.height = '0px';
      const contentHeight = currentTextarea.scrollHeight;

      if (maxHeight) {
        // Set max-height and adjust overflow behavior if maxHeight is provided
        currentTextarea.style.maxHeight = `${maxHeight}px`;
        currentTextarea.style.overflowY =
          contentHeight > maxHeight ? 'scroll' : 'hidden';
        currentTextarea.style.height = `${Math.min(
          contentHeight,
          maxHeight
        )}px`;
      } else {
        // Adjust height without max height constraint
        currentTextarea.style.height = `${contentHeight}px`;
      }
    }
  }, [textareaRef, textContent, maxHeight]);
};

export default useDynamicTextareaSize;
