import React, { useEffect, useState } from 'react';

/**
 * ModernSimpleBackground - Clean, elegant, premium SaaS background animation
 * Features:
 * 1. Subtle, slow-drifting soft atmospheric aurora orbs (smooth blur)
 * 2. Elegant minimalist grid matrix with gentle radial vignette mask
 * 3. Soft ambient cursor follow spotlight (subtle, non-distracting glow)
 * 4. Micro floating particles (soft, tiny, organic ambient motion)
 */
export const ModernSimpleBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* ── 1. Interactive Cursor Glow Spotlight (Clean & Subtle) ── */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 80%)'
        }}
      />

      {/* ── 2. Atmospheric Ambient Aurora Glows (Slow & Gentle Breathing) ── */}
      {/* Top Left Cyan Glow */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-sky-500/10 blur-[130px] animate-pulse" style={{ animationDuration: '9s' }} />
      
      {/* Top Right Indigo/Purple Glow */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1.5s' }} />

      {/* Center Subtle Blue Accent */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-blue-600/6 blur-[160px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '3s' }} />

      {/* Bottom Emerald/Teal Glow */}
      <div className="absolute -bottom-20 left-1/4 w-[550px] h-[550px] rounded-full bg-emerald-500/7 blur-[140px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '2s' }} />

      {/* ── 3. Ultra-Clean Minimalist Grid Pattern with Vignette ── */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 40%, transparent 100%)'
        }}
      />

      {/* ── 4. Subtle Ambient Floating Micro-Glow Dust (Few & Gentle) ── */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[
          { top: '15%', left: '20%', size: 4, delay: '0s', duration: '6s', color: 'bg-sky-400' },
          { top: '25%', left: '75%', size: 3, delay: '2s', duration: '8s', color: 'bg-indigo-400' },
          { top: '48%', left: '15%', size: 3.5, delay: '1s', duration: '7s', color: 'bg-cyan-400' },
          { top: '65%', left: '80%', size: 4, delay: '3s', duration: '9s', color: 'bg-purple-400' },
          { top: '80%', left: '30%', size: 3, delay: '2.5s', duration: '7.5s', color: 'bg-emerald-400' },
          { top: '38%', left: '50%', size: 2.5, delay: '4s', duration: '8.5s', color: 'bg-sky-300' },
        ].map((dot, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full ${dot.color} shadow-sm blur-[0.5px] animate-float`}
            style={{
              top: dot.top,
              left: dot.left,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
              opacity: 0.6
            }}
          />
        ))}
      </div>

    </div>
  );
};
