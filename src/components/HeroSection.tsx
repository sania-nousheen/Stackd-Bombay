import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { StackdLogo } from './StackdLogo';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onOpenOrder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenOrder }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden bg-[#150508] text-[#F5F0E5] flex flex-col justify-between items-center select-none">
      
      {/* 1. FULL-SCREEN BACKGROUND CINEMATIC MEDIA (EDGE-TO-EDGE, OBJECT-FIT: COVER) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Cinematic Video Layer */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08] transform scale-105"
        >
          {/* Mr Crumble style high-definition slow-motion cookie background video */}
          <source src="/hero_cookie.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/12400/12400-720.mp4" type="video/mp4" />
        </video>

        {/* Dark chocolate-brown, deep burgundy & warm toasted-cookie colour grading scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#150508]/90 via-[#2B0810]/35 to-[#120407]/75 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#25080E]/20 to-[#100306]/80 pointer-events-none" />
      </div>

      {/* Top spacing pad */}
      <div className="w-full pt-20 sm:pt-24 z-10" />

      {/* 2. EXACT CENTER: PROMINENT STACKD BOMBAY LOGO */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Stackd Bombay logo with cursive Stackd and lighter weight */}
          <StackdLogo color="#F5F0E5" size="hero" className="drop-shadow-[0_8px_25px_rgba(0,0,0,0.7)]" />
        </motion.div>
      </div>

      {/* 3. MINIMAL BOTTOM SECTION: SIMPLE WHITE DOWN ARROW ONLY (NO BUTTON, NO TEXT) */}
      <div className="relative z-10 pb-8 sm:pb-12 flex flex-col items-center">
        <a
          href="#collection"
          aria-label="Scroll to collection"
          className="text-white/80 hover:text-white transition-all duration-300 animate-bounce cursor-pointer p-2 group"
        >
          <ArrowDown className="w-5 h-5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:translate-y-1 transition-transform stroke-[2]" />
        </a>
      </div>

    </section>
  );
};
