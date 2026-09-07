import React, { useEffect, useRef } from 'react';

/**
 * FullPageAuroraWavesBackground - Ultra-immersive full-page background animation
 * Features:
 * 1. Multi-layered undulating 3D sine wave ribbons flowing from top to bottom
 * 2. Floating interactive cosmic particle mesh & glowing energy auras across the entire page
 * 3. Dynamic magnetic mouse attraction & fluid ripple reaction on cursor movement
 * 4. Fixed viewport canvas filling 100vw × 100vh with high-DPI retina sharpness
 */
export const FullPageAuroraWavesBackground: React.FC = () => {
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

    // Mouse coordinates with smooth spring easing
    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      radius: 280
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Floating Quantum Nodes distributed across entire page height
    interface NodeParticle {
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

    const particleCount = Math.min(Math.floor((width * height) / 11000), 120);
    const particles: NodeParticle[] = [];

    const colorPalettes = [
      { color: 'rgba(56, 189, 248,', glow: 'rgba(56, 189, 248, 0.65)' }, // Sky Cyan
      { color: 'rgba(99, 102, 241,', glow: 'rgba(99, 102, 241, 0.65)' }, // Indigo
      { color: 'rgba(168, 85, 247,', glow: 'rgba(168, 85, 247, 0.65)' }, // Purple
      { color: 'rgba(52, 211, 153,', glow: 'rgba(52, 211, 153, 0.55)' }, // Emerald
      { color: 'rgba(244, 114, 182,', glow: 'rgba(244, 114, 182, 0.55)' }, // Pink
    ];

    for (let i = 0; i < particleCount; i++) {
      const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.15,
        radius: Math.random() * 2.4 + 1.0,
        color: palette.color,
        glow: palette.glow,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.025 + 0.01
      });
    }

    // 7 Undulating Fluid Wave Ribbons spanning entire page from top to bottom
    const waveRibbons = [
      { c1: '#0078d4', c2: '#38bdf8', yRatio: 0.15, amp: 45, freq: 0.002, speed: 1.1, lineWidth: 2.2, alpha: 0.45 },
      { c1: '#0284c7', c2: '#818cf8', yRatio: 0.28, amp: 55, freq: 0.0018, speed: 0.9, lineWidth: 2.5, alpha: 0.5 },
      { c1: '#6366f1', c2: '#a855f7', yRatio: 0.42, amp: 65, freq: 0.0022, speed: 1.2, lineWidth: 2.8, alpha: 0.55 },
      { c1: '#8b5cf6', c2: '#c084fc', yRatio: 0.56, amp: 60, freq: 0.0019, speed: 1.0, lineWidth: 2.5, alpha: 0.5 },
      { c1: '#a855f7', c2: '#ec4899', yRatio: 0.70, amp: 55, freq: 0.0023, speed: 1.3, lineWidth: 2.2, alpha: 0.45 },
      { c1: '#06b6d4', c2: '#10b981', yRatio: 0.84, amp: 50, freq: 0.0021, speed: 1.15, lineWidth: 2.0, alpha: 0.4 },
      { c1: '#10b981', c2: '#38bdf8', yRatio: 0.95, amp: 40, freq: 0.0025, speed: 1.0, lineWidth: 1.8, alpha: 0.35 }
    ];

    let time = 0;

    const render = () => {
      time += 0.014;

      // Spring mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.065;
      mouse.y += (mouse.targetY - mouse.y) * 0.065;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Render Undulating Fluid Wave Ribbons across the entire height ──
      for (let w = 0; w < waveRibbons.length; w++) {
        const wave = waveRibbons[w];
        const baseY = height * wave.yRatio;

        ctx.beginPath();
        const points: { x: number; y: number }[] = [];
        const step = 12;

        for (let x = 0; x <= width + step; x += step) {
          const wave1 = Math.sin(x * wave.freq + time * wave.speed + w * 0.8) * wave.amp;
          const wave2 = Math.cos(x * (wave.freq * 0.55) - time * (wave.speed * 0.7)) * (wave.amp * 0.45);

          // Magnetic mouse wave displacement
          const dx = x - mouse.x;
          const dy = (baseY + wave1 + wave2) - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let mouseDistortion = 0;

          if (dist < mouse.radius) {
            mouseDistortion = Math.cos((dist / mouse.radius) * Math.PI * 0.5) * 75 * (dy > 0 ? 1 : -1);
          }

          const y = baseY + wave1 + wave2 + mouseDistortion;
          points.push({ x, y });
        }

        // Draw smooth bezier curvature
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, wave.c1);
        grad.addColorStop(0.5, wave.c2);
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.3)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = wave.lineWidth;
        ctx.globalAlpha = wave.alpha;
        ctx.shadowColor = wave.c2;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // ── 2. Render Constellation Network Lines ──
      const maxDist = 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // ── 3. Render Floating Nodes with Radial Glow Auras ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Viewport wrapping
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive mouse connection
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const beamAlpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${beamAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        const currentAlpha = 0.35 + Math.sin(time * p.pulseSpeed * 60 + p.phase) * 0.25;

        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
        glowGrad.addColorStop(0, `${p.color} ${currentAlpha})`);
        glowGrad.addColorStop(0.5, p.glow);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0
      }}
    />
  );
};
