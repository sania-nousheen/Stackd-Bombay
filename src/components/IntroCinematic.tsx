import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StackdLogo } from './StackdLogo';

interface IntroCinematicProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

/**
 * STACKD BOMBAY — CINEMATIC 5–6 SECOND WEBSITE INTRO
 * 
 * 0.0–1.0s: Burgundy screen appears with emerging chunky chocolate cookie silhouette in centre.
 * 1.0–2.2s: Stackd Bombay logo gently reveals in centre with soft warm bloom.
 * 2.2–3.5s: The background cookie softly cracks and separates gently through its centre into two halves.
 * 3.5–4.7s: Symmetrical split screen opens from the middle like curtains, revealing the live hero video.
 * 4.7–6.0s: Homepage is fully revealed edge to edge with logo positioned over video.
 */
export const IntroCinematic: React.FC<IntroCinematicProps> = ({ onComplete, forcePlay = false }) => {
  // Phase 0 (0-1s): Burgundy screen + Cookie silhouette emerges
  // Phase 1 (1-2.2s): Logo reveals with soft light bloom
  // Phase 2 (2.2-3.5s): Cookie softly breaks into two halves
  // Phase 3 (3.5-4.7s): Symmetrical split screen opens from centre
  // Phase 4 (4.7-6.0s): Full transition completion into homepage
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forcePlay) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 1000); // 1.0s: Logo reveals
    const t2 = setTimeout(() => setPhase(2), 2200); // 2.2s: Cookie softly breaks
    const t3 = setTimeout(() => setPhase(3), 3500); // 3.5s: Split screen opens from middle
    const t4 = setTimeout(() => setPhase(4), 4700); // 4.7s: Reveal finishes
    const tEnd = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 5800); // ~5.8s: Sequence completes cleanly

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, [onComplete, forcePlay]);

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none select-none overflow-hidden"
      aria-label="Stackd Bombay Opening Cinematic"
      role="dialog"
      aria-modal="true"
    >
      {/* ======================================================== */}
      {/* LEFT SPLIT CURTAIN PANEL (Moves smoothly to the left) */}
      {/* ======================================================== */}
      <motion.div
        initial={{ x: 0 }}
        animate={{
          x: phase >= 3 ? '-100%' : '0%'
        }}
        transition={{
          duration: 1.45,
          ease: [0.76, 0, 0.24, 1] // Elegant, luxurious curtain easing
        }}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#6C1929] z-20 overflow-hidden pointer-events-auto"
        style={{
          boxShadow: phase >= 3 ? '28px 0 70px rgba(0,0,0,0.85)' : 'none'
        }}
      >
        {/* Left Half of Center Chunky Cookie Silhouette */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[520px] sm:w-[680px] lg:w-[780px] aspect-square rounded-full overflow-hidden translate-x-1/2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: phase >= 0 ? 0.32 : 0,
              scale: phase >= 1 ? 1 : 0.94,
              x: phase >= 2 ? -24 : 0,
              rotate: phase >= 2 ? -1.8 : 0
            }}
            transition={{
              opacity: { duration: 1.0, ease: 'easeOut' },
              scale: { duration: 1.2, ease: 'easeOut' },
              x: { duration: 1.3, ease: [0.25, 1, 0.5, 1] },
              rotate: { duration: 1.3, ease: [0.25, 1, 0.5, 1] }
            }}
            className="w-full h-full relative"
          >
            {/* Real chunky chocolate cookie imagery */}
            <img
              src="/src/assets/images/hero_cookie_macro_1791484018264.jpg"
              alt=""
              className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.25] mix-blend-soft-light"
            />
            {/* Subtle organic crack shadow and crumbs when parting */}
            {phase >= 2 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/85 via-black/40 to-transparent"
                />
                {/* Delicate restrained crumbs */}
                <div className="absolute top-[48%] right-2 w-1.5 h-1.5 rounded-full bg-[#3C0F17] opacity-80" />
                <div className="absolute top-[52%] right-3 w-1 h-1 rounded-full bg-[#2E0B12] opacity-70" />
                <div className="absolute top-[44%] right-4 w-1.5 h-1 rounded-sm bg-[#4A141D] opacity-60" />
              </>
            )}
          </motion.div>
        </div>

        {/* Soft edge ambient burgundy vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A101C]/80 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* ======================================================== */}
      {/* RIGHT SPLIT CURTAIN PANEL (Moves smoothly to the right) */}
      {/* ======================================================== */}
      <motion.div
        initial={{ x: 0 }}
        animate={{
          x: phase >= 3 ? '100%' : '0%'
        }}
        transition={{
          duration: 1.45,
          ease: [0.76, 0, 0.24, 1]
        }}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#6C1929] z-20 overflow-hidden pointer-events-auto"
        style={{
          boxShadow: phase >= 3 ? '-28px 0 70px rgba(0,0,0,0.85)' : 'none'
        }}
      >
        {/* Right Half of Center Chunky Cookie Silhouette */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[520px] sm:w-[680px] lg:w-[780px] aspect-square rounded-full overflow-hidden -translate-x-1/2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: phase >= 0 ? 0.32 : 0,
              scale: phase >= 1 ? 1 : 0.94,
              x: phase >= 2 ? 24 : 0,
              rotate: phase >= 2 ? 1.8 : 0
            }}
            transition={{
              opacity: { duration: 1.0, ease: 'easeOut' },
              scale: { duration: 1.2, ease: 'easeOut' },
              x: { duration: 1.3, ease: [0.25, 1, 0.5, 1] },
              rotate: { duration: 1.3, ease: [0.25, 1, 0.5, 1] }
            }}
            className="w-full h-full relative"
          >
            {/* Real chunky chocolate cookie imagery */}
            <img
              src="/src/assets/images/hero_cookie_macro_1791484018264.jpg"
              alt=""
              className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.25] mix-blend-soft-light"
            />
            {/* Subtle organic crack shadow and crumbs when parting */}
            {phase >= 2 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/85 via-black/40 to-transparent"
                />
                {/* Delicate restrained crumbs */}
                <div className="absolute top-[49%] left-2 w-1.5 h-1.5 rounded-full bg-[#3C0F17] opacity-80" />
                <div className="absolute top-[46%] left-3 w-1 h-1 rounded-full bg-[#2E0B12] opacity-70" />
                <div className="absolute top-[54%] left-4 w-1 h-1.5 rounded-sm bg-[#4A141D] opacity-60" />
              </>
            )}
          </motion.div>
        </div>

        {/* Soft edge ambient burgundy vignette */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#4A101C]/80 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* ======================================================== */}
      {/* LOGO & SOFT LIGHT BLOOM OVERLAY (Center of Screen) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        {/* Subtle, soft light bloom behind the logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: phase >= 1 && phase < 3 ? 0.38 : 0,
            scale: phase >= 1 ? 1.2 : 0.8
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#F5F0E5]/10 via-[#F5F0E5]/25 to-transparent blur-3xl pointer-events-none"
        />

        {/* Stackd Bombay Logo reveals in exact centre in warm ivory/cream */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{
            // Remains visible and readable, gently fading during final split into the hero
            opacity: phase >= 1 && phase < 4 ? 1 : 0,
            scale: phase >= 1 ? 1 : 0.94
          }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-6 z-10"
        >
          <StackdLogo color="#F5F0E5" size="xl" className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]" />
        </motion.div>
      </div>

      {/* Subtle Skip button for instantaneous access if desired */}
      <div className="absolute bottom-6 right-6 z-40 pointer-events-auto">
        <button
          onClick={handleSkip}
          className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#F5F0E5]/60 hover:text-[#F5F0E5] transition-colors py-2 px-3 rounded-full hover:bg-black/30 backdrop-blur-sm cursor-pointer"
          title="Skip intro to homepage"
        >
          Skip Intro →
        </button>
      </div>
    </div>
  );
};
