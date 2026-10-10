import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';

export const TransparentCookieStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Layered vertical and horizontal parallax drift for background cookies
  const cookie1Y = useTransform(scrollYProgress, [0, 1], [-80, 120]);
  const cookie1Rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const cookie2Y = useTransform(scrollYProgress, [0, 1], [100, -110]);
  const cookie2Rotate = useTransform(scrollYProgress, [0, 1], [-20, 25]);

  const cookie3Y = useTransform(scrollYProgress, [0, 1], [-40, 90]);
  const cookie3Scale = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] py-28 sm:py-36 bg-[#F5F0E5] text-[#6C1929] overflow-hidden flex items-center justify-center"
    >
      {/* Background paper texture */}
      <div className="absolute inset-0 paper-grain opacity-50 pointer-events-none" />

      {/* Floating semi-transparent cookies drifting in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Floating Cookie 1 */}
        <motion.div
          style={{
            y: cookie1Y,
            rotate: cookie1Rotate
          }}
          className="absolute -top-16 -left-20 w-80 sm:w-[450px] aspect-square rounded-full overflow-hidden opacity-25 mix-blend-multiply filter blur-[1px]"
        >
          <img
            src="/src/assets/images/cookie_holy_trinity_1791484027979.jpg"
            alt="Artisanal cookie drifting in background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Floating Cookie 2 */}
        <motion.div
          style={{
            y: cookie2Y,
            rotate: cookie2Rotate
          }}
          className="absolute -bottom-24 -right-16 w-96 sm:w-[520px] aspect-square rounded-full overflow-hidden opacity-20 mix-blend-multiply filter blur-[0.5px]"
        >
          <img
            src="/src/assets/images/hero_cookie_macro_1791484018264.jpg"
            alt="Artisanal cookie drifting in background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Floating Cookie 3 */}
        <motion.div
          style={{
            y: cookie3Y,
            scale: cookie3Scale
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[380px] aspect-square rounded-full overflow-hidden opacity-10 mix-blend-multiply"
        >
          <img
            src="/src/assets/images/cookie_nutella_tin_1791484044384.jpg"
            alt="Cookie tin drifting in background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Foreground Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10 text-center sm:text-left">
        
        {/* Small heading in left side with NO Gemini/AI icon */}
        <div className="inline-block px-3.5 py-1 rounded-full bg-[#6C1929]/10 border border-[#6C1929]/15 text-xs font-semibold tracking-wider text-[#6C1929] mb-4">
          The stackd promise
        </div>

        {/* Big Editorial Headline in Cormorant Garamond Medium (500), single line */}
        <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[46px] tracking-[-0.4px] text-[#6C1929] whitespace-nowrap overflow-hidden text-ellipsis leading-tight mb-4">
          Not Your Average Cookie
        </h2>

        {/* Supporting Copy */}
        <p className="font-editorial italic text-xl sm:text-2xl lg:text-2.5xl text-[#54121F] leading-snug mb-4 max-w-2xl">
          “Chunky, eggless, freshly baked and made with ingredients worth obsessing over.”
        </p>

        <p className="font-sans-clean text-xs sm:text-sm text-[#6C1929]/80 max-w-xl leading-relaxed mb-8 font-normal">
          Every cookie that leaves Bhavya's oven in Worli is loaded with molten Belgian chocolate pools and French Président butter. No industrial shortcuts. No compromises.
        </p>

        {/* Primary CTA */}
        <div>
          <a
            href="#menu"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#6C1929] hover:bg-[#50101D] text-[#F5F0E5] text-xs font-semibold tracking-[0.18em] uppercase rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <span>Explore The Menu</span>
            <ArrowDownRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
