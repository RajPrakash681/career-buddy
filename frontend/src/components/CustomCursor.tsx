import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && cursorRingRef.current) {
        requestAnimationFrame(() => {
          if (cursorRef.current && cursorRingRef.current) {
            cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorRingRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
          }
        });
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={cursorRingRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;
