import React, { useEffect, useRef } from 'react';

/**
 * ModernVibrantBackground - Clean, clearly visible, elegant SaaS background animation
 * Features:
 * 1. Fluid, clearly visible glowing Aurora energy clouds moving softly
 * 2. Floating interactive glowing energy nodes connected by fine constellation lines
 * 3. Dynamic interactive mouse attraction beam that responds to cursor movement
 * 4. High-contrast ambient gradient depth that looks stunning on dark, light & midnight modes
 */
export const ModernVibrantBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Mouse coordinates with easing
    const mouse = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
      radius: 220
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Floating glowing energy particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      glow: string;
      phase: number;
      pulseSpeed: number;
    }

    const count = Math.min(Math.floor((width * height) / 13000), 85);
    const particles: Particle[] = [];

    const palettes = [
      { color: 'rgba(56, 189, 248,', glow: 'rgba(56, 189, 248, 0.85)' }, // Vibrant Sky Blue
      { color: 'rgba(99, 102, 241,', glow: 'rgba(99, 102, 241, 0.85)' }, // Royal Indigo
      { color: 'rgba(168, 85, 247,', glow: 'rgba(168, 85, 247, 0.85)' }, // Vivid Purple
      { color: 'rgba(52, 211, 153,', glow: 'rgba(52, 211, 153, 0.75)' }, // Bright Emerald
    ];

    for (let i = 0; i < count; i++) {
      const p = palettes[Math.floor(Math.random() * palettes.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65 - 0.15,
        radius: Math.random() * 2.8 + 1.2,
        color: p.color,
        glow: p.glow,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Render Floating Constellation Lines (Clearly Visible) ──
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      // ── 2. Render Glowing Energy Particles ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Viewport wrapping
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Mouse interactive beam
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const beamAlpha = (1 - dist / mouse.radius) * 0.65;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${beamAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Smooth gentle cursor attraction
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 1.6;
          p.y += (dy / dist) * force * 1.6;
        }

        const alpha = 0.5 + Math.sin(time * p.pulseSpeed * 60 + p.phase) * 0.35;

        // Radial bloom glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4.5);
        glow.addColorStop(0, `${p.color} ${alpha})`);
        glow.addColorStop(0.5, p.glow);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Inner bright spark core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* ── 1. Vibrant Soft Atmospheric Aurora Orbs (Clearly Visible) ── */}
      <div className="absolute -top-24 -left-20 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-sky-500/25 via-blue-600/15 to-transparent blur-[110px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-40 -right-20 w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-purple-600/22 via-indigo-500/15 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1.5s' }} />
      <div className="absolute top-[48%] left-1/3 w-[650px] h-[550px] rounded-full bg-gradient-to-br from-emerald-500/18 via-teal-500/12 to-transparent blur-[130px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }} />
      <div className="absolute -bottom-24 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-500/18 via-purple-500/12 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }} />

      {/* ── 2. Crisp Grid Matrix Overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 40%, black 50%, transparent 100%)'
        }}
      />

      {/* ── 3. High-Performance Particle & Constellation Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100vw', height: '100vh' }}
      />

    </div>
  );
};
