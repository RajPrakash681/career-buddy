import React, { useEffect, useRef } from 'react';

const ParticlesTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          life: 20
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life--;

        const opacity = particle.life / 20;
        ctx.fillStyle = `rgba(166, 127, 93, ${opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        return particle.life > 0;
      });

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <canvas ref={canvasRef} className="particles-trail" />;
};

export default ParticlesTrail;
