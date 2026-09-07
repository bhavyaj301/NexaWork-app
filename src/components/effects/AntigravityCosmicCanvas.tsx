import React, { useEffect, useRef } from 'react';

export const AntigravityCosmicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes interface
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      alpha: number;
      color: string;
      glowColor: string;
      pulseSpeed: number;
      pulsePhase: number;
      size: number;
    }

    // Shooting meteors interface
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
      color: string;
    }

    // Modern SaaS color palette
    const colorThemes = [
      { color: 'rgba(56, 189, 248,', glow: 'rgba(56, 189, 248, 0.7)' }, // Sky Cyan
      { color: 'rgba(99, 102, 241,', glow: 'rgba(99, 102, 241, 0.7)' }, // Royal Indigo
      { color: 'rgba(168, 85, 247,', glow: 'rgba(168, 85, 247, 0.7)' }, // Neon Purple
      { color: 'rgba(52, 211, 153,', glow: 'rgba(52, 211, 153, 0.6)' }, // Emerald
      { color: 'rgba(236, 72, 153,', glow: 'rgba(236, 72, 153, 0.5)' }, // Pink Glow
    ];

    // Responsive particle count
    const count = Math.min(Math.floor((width * height) / 9500), 125);
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55 - 0.22, // Upward floating anti-gravity drift
        radius: Math.random() * 2.2 + 0.8,
        baseAlpha: Math.random() * 0.55 + 0.35,
        alpha: Math.random() * 0.55 + 0.35,
        color: theme.color,
        glowColor: theme.glow,
        pulseSpeed: Math.random() * 0.03 + 0.012,
        pulsePhase: Math.random() * Math.PI * 2,
        size: Math.random() * 2 + 1
      });
    }

    const meteors: Meteor[] = [];
    const createMeteor = (): Meteor => ({
      x: Math.random() * width * 1.3,
      y: Math.random() * (height * 0.5),
      length: Math.random() * 110 + 60,
      speed: Math.random() * 9 + 8,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.15, // 45 deg diagonal
      opacity: 1,
      active: true,
      color: Math.random() > 0.5 ? 'rgba(56, 189, 248,' : 'rgba(168, 85, 247,'
    });

    let lastMeteorTime = 0;
    let mouse = { x: -1000, y: -1000, radius: 180 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Periodic Shooting Meteors every 2-4 seconds
      if (time - lastMeteorTime > 130 + Math.random() * 120) {
        meteors.push(createMeteor());
        lastMeteorTime = time;
      }

      // ── 1. Constellation Network Connections ──
      const maxDistance = 135;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.25 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // ── 2. Render & Animate Particles ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Breathing alpha pulse
        p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.35;
        p.alpha = Math.max(0.2, Math.min(0.95, p.alpha));

        p.x += p.vx;
        p.y += p.vy;

        // Smooth viewport wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          // Draw energy beam to cursor
          const beamAlpha = (1 - dist / mouse.radius) * 0.55;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${beamAlpha})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Magnetic gentle cursor push
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.9;
          p.y -= (dy / dist) * force * 1.9;
        }

        // Particle radial aura glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.8);
        glow.addColorStop(0, `${p.color} ${p.alpha})`);
        glow.addColorStop(0.5, p.glowColor);
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.8, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Inner glowing star spark core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // ── 3. Render Shooting Meteors ──
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) continue;

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
        grad.addColorStop(0.25, `${m.color} ${m.opacity * 0.85})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Sparkle head
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.fill();

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= 0.015;

        if (m.opacity <= 0 || m.x > width + 100 || m.y > height + 100) {
          m.active = false;
          meteors.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85 transition-opacity duration-700"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
