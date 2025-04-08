import React, { useEffect, useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const centerX = width / 2;
      const centerY = height / 2;
      
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      
      if (distance < 100) {
        const moveX = (x - centerX) * 0.3;
        const moveY = (y - centerY) * 0.3;
        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} className={`magnetic-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default MagneticButton;
