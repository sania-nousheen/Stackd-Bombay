import React from 'react';
import { MILESTONES } from '../data/story';
import { Clock, CheckCircle2, Award, Heart } from 'lucide-react';

export const MilestonesSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF7F0] text-[#6C1929] border-y border-[#6C1929]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#6C1929]/75 font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-[#6C1929]" />
            <span>Founder Milestones</span>
          </div>
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[46px] text-[#6C1929] tracking-[-0.4px] leading-tight">
            Built Order By Order In Mumbai
          </h2>
          <p className="font-editorial italic text-base sm:text-lg text-[#6C1929]/80 mt-2">
            Real proof from Bhavya’s kitchen journey—no vanity metrics.
          </p>
        </div>

        {/* 4 Quantitative Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MILESTONES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#F5F0E5] border border-[#6C1929]/15 shadow-sm text-center flex flex-col justify-between"
            >
              <div>
                <span className="font-editorial text-4xl sm:text-5xl font-bold text-[#6C1929] block mb-2">
                  {item.number}
                </span>
                <h3 className="font-editorial text-lg font-semibold text-[#3E0C17] leading-tight mb-2">
                  {item.label}
                </h3>
              </div>
              <p className="font-sans-clean text-xs text-[#541624] leading-relaxed pt-3 border-t border-[#6C1929]/10">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* The Special Customer Moment Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl bg-[#F1E9D8] border border-[#6C1929]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#6C1929] text-[#F5F0E5] flex items-center justify-center shrink-0 mt-1 shadow">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-xl font-semibold text-[#6C1929]">
                The Nutella Tin Story We Never Forget
              </h4>
              <p className="font-sans-clean text-xs sm:text-sm text-[#4E1320] leading-relaxed mt-1">
                A customer once waited 45 minutes longer in evening South Bombay traffic rather than cancelling when an oven batch was delayed for perfection. That patience is why we refuse to ever rush a single bake.
              </p>
            </div>
          </div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#6C1929]/75 shrink-0 px-4 py-2 rounded-full border border-[#6C1929]/20 bg-white/40">
            Worli Kitchen Truth
          </span>
        </div>

      </div>
    </section>
  );
};
