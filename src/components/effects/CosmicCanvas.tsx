import React, { useEffect, useRef } from 'react';

interface CosmicCanvasProps {
  interactive?: boolean;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes definition
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
    }

    // Shooting star definition
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }

    const colors = [
      { color: 'rgba(56, 189, 248,', glow: 'rgba(56, 189, 248, 0.6)' }, // Sky Blue
      { color: 'rgba(99, 102, 241,', glow: 'rgba(99, 102, 241, 0.6)' }, // Indigo
      { color: 'rgba(168, 85, 247,', glow: 'rgba(168, 85, 247, 0.6)' }, // Purple
      { color: 'rgba(52, 211, 153,', glow: 'rgba(52, 211, 153, 0.5)' }, // Emerald
      { color: 'rgba(236, 72, 153,', glow: 'rgba(236, 72, 153, 0.4)' }, // Pink/Rose
    ];

    // Responsive particle count
    const particleCount = Math.min(Math.floor((width * height) / 10000), 110);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const palette = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.2, // Subtle anti-gravity upward drift
        radius: Math.random() * 2.5 + 1.0,
        baseAlpha: Math.random() * 0.6 + 0.35,
        alpha: Math.random() * 0.6 + 0.35,
        color: palette.color,
        glowColor: palette.glow,
        pulseSpeed: Math.random() * 0.025 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Shooting stars pool
    const shootingStars: ShootingStar[] = [];
    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * width * 1.2,
      y: Math.random() * (height * 0.45),
      length: Math.random() * 80 + 50,
      speed: Math.random() * 8 + 6,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 degrees diagonal
      opacity: 1,
      active: true,
    });

    let lastShootingStarTime = 0;

    // Interactive mouse attractor
    let mouse = { x: -1000, y: -1000, radius: 180 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Trigger periodic shooting stars every 2.5–4.5 seconds
      if (time - lastShootingStarTime > 160 + Math.random() * 120) {
        shootingStars.push(createShootingStar());
        lastShootingStarTime = time;
      }

      // ── 1. Draw connecting constellation lines ──
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.22 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // ── 2. Draw & update particles ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulsing breathing alpha
        p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.3;
        p.alpha = Math.max(0.15, Math.min(0.95, p.alpha));

        // Physics movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive cursor gravity & repulsion
        if (interactive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            // Draw active lightning/beam connection to cursor
            const mouseLineAlpha = (1 - dist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${mouseLineAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Gentle repulsion vector
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.8;
            p.y -= (dy / dist) * force * 1.8;
          }
        }

        // Render Particle Body with Radial Glow Bloom
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
        glowGrad.addColorStop(0, `${p.color} ${p.alpha})`);
        glowGrad.addColorStop(0.5, p.glowColor);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Inner bright spark core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // ── 3. Draw & update shooting stars ──
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        if (!star.active) continue;

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        const starGrad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        starGrad.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        starGrad.addColorStop(0.3, `rgba(56, 189, 248, ${star.opacity * 0.8})`);
        starGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Sparkle head
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Move star
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.014;

        if (star.opacity <= 0 || star.x > width + 100 || star.y > height + 100) {
          star.active = false;
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-700"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
