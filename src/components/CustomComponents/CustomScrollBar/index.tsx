import React, { useEffect, useCallback } from 'react';

interface ICustomScrollbar {
  height?: string;
  scrollbarWidth?: string;
  scrollbarColor?: string;
  scrollbarHoverColor?: string;
  children: React.ReactNode;
}

function CustomScrollbar({
  height,
  scrollbarWidth,
  scrollbarColor,
  scrollbarHoverColor,
  children
}: ICustomScrollbar) {
  const createStyle = useCallback(() => {
    const styleElement = document.createElement('style');
    const pseudoStyles = document.createTextNode(`
            .dynamic_custom__scroll__bar {
                height: ${height || '90vh'};
                overflow-y: auto;
            }
            
            .dynamic_custom__scroll__bar::-webkit-scrollbar {
                width: ${scrollbarWidth || '7px'};
                -webkit-appearance: none;
            }

            .dynamic_custom__scroll__bar::-webkit-scrollbar-track {
            }

            .dynamic_custom__scroll__bar::-webkit-scrollbar-thumb {
                border-radius: 10px;
                box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
                background-color: ${scrollbarColor || '#ccc'};
            }

            .dynamic_custom__scroll__bar::-webkit-scrollbar-thumb:hover {
                background: ${scrollbarHoverColor || scrollbarColor || '#ccc'};
                cursor: pointer;
              }
        `);
    styleElement.appendChild(pseudoStyles);
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  }, [height, scrollbarColor, scrollbarHoverColor, scrollbarWidth]);

  useEffect(() => {
    createStyle();
  }, [createStyle]);

  return <section className="dynamic_custom__scroll__bar">{children}</section>;
}

export default CustomScrollbar;
