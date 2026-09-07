import React, { useEffect, useRef } from 'react';

/**
 * QuantumMeshBackground - Full-page interactive fluid mesh & flowing wave ribons
 * Features:
 * 1. 3D undulating wave ribbons with gradient spectrum
 * 2. Floating glowing energy orbs with trail dissipation
 * 3. Interactive cursor magnetic distortion & interactive ripple waves
 * 4. Crisp full-viewport canvas fixed behind all scrolling content
 */
export const QuantumMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with easing
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 260
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Floating Quantum Nodes
    interface Orb {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      glow: string;
      phase: number;
      speed: number;
    }

    const orbs: Orb[] = [
      { x: width * 0.2, y: height * 0.25, vx: 0.3, vy: 0.2, radius: 180, color: 'rgba(56, 189, 248, 0.16)', glow: 'rgba(0, 120, 212, 0.35)', phase: 0, speed: 0.012 },
      { x: width * 0.75, y: height * 0.35, vx: -0.25, vy: 0.3, radius: 220, color: 'rgba(147, 51, 234, 0.14)', glow: 'rgba(168, 85, 247, 0.3)', phase: 2, speed: 0.009 },
      { x: width * 0.45, y: height * 0.7, vx: 0.2, vy: -0.25, radius: 200, color: 'rgba(16, 185, 129, 0.12)', glow: 'rgba(52, 211, 153, 0.25)', phase: 4, speed: 0.01 },
      { x: width * 0.85, y: height * 0.8, vx: -0.3, vy: -0.2, radius: 190, color: 'rgba(236, 72, 153, 0.12)', glow: 'rgba(244, 114, 182, 0.25)', phase: 1, speed: 0.014 }
    ];

    // Flowing undulating wave lines
    const waveCount = 5;
    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Render Floating Ambient Energy Orbs ──
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];

        orb.x += orb.vx + Math.sin(time * orb.speed + orb.phase) * 0.8;
        orb.y += orb.vy + Math.cos(time * orb.speed + orb.phase) * 0.8;

        // Bounce off edges smoothly
        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        // Interactive mouse distortion on orbs
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          orb.x -= (dx / dist) * force * 2.5;
          orb.y -= (dy / dist) * force * 2.5;
        }

        const radGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        radGrad.addColorStop(0, orb.color);
        radGrad.addColorStop(0.5, orb.glow);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 2. Render Undulating Fluid Wave Ribbons ──
      const waveGradients = [
        { c1: '#0078d4', c2: '#38bdf8', yOffset: height * 0.35, amp: 55, freq: 0.0022 },
        { c1: '#6366f1', c2: '#a855f7', yOffset: height * 0.5, amp: 70, freq: 0.0018 },
        { c1: '#8b5cf6', c2: '#ec4899', yOffset: height * 0.65, amp: 60, freq: 0.002 },
        { c1: '#06b6d4', c2: '#10b981', yOffset: height * 0.8, amp: 50, freq: 0.0025 }
      ];

      for (let w = 0; w < waveGradients.length; w++) {
        const wave = waveGradients[w];
        ctx.beginPath();

        const points: { x: number; y: number }[] = [];
        const step = 14;

        for (let x = 0; x <= width + step; x += step) {
          // Compound sinusoidal waves
          const wave1 = Math.sin(x * wave.freq + time * (1.2 + w * 0.2)) * wave.amp;
          const wave2 = Math.cos(x * (wave.freq * 0.6) - time * 0.8) * (wave.amp * 0.5);

          // Mouse ripple displacement
          const mdx = x - mouse.x;
          const mdy = (wave.yOffset + wave1 + wave2) - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          let mouseDisplacement = 0;

          if (mdist < mouse.radius) {
            mouseDisplacement = Math.cos((mdist / mouse.radius) * Math.PI * 0.5) * 65 * (mdy > 0 ? 1 : -1);
          }

          const y = wave.yOffset + wave1 + wave2 + mouseDisplacement;
          points.push({ x, y });
        }

        // Draw smooth bezier curve through points
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        // Create sleek gradient stroke
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, wave.c1);
        grad.addColorStop(0.5, wave.c2);
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.2)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8 + w * 0.4;
        ctx.globalAlpha = 0.35 + (w === 1 || w === 2 ? 0.15 : 0);
        ctx.shadowColor = wave.c2;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // ── 3. Subtle Hexagonal Particle Grid Light Accents ──
      const hexSpacing = 85;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      for (let x = (time * 10) % hexSpacing; x < width; x += hexSpacing) {
        for (let y = (time * 8) % hexSpacing; y < height; y += hexSpacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.4;
            ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90 transition-opacity duration-1000"
      style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
    />
  );
};
