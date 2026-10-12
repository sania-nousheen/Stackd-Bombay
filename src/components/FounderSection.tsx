import { getAssetUrl } from "../utils/assets";
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ArrowRight, Loader2 } from 'lucide-react';
import { safeLocalStorageSet } from '../utils/mediaStorage';
import { subscribeSiteMedia, saveSiteMedia, uploadMediaFile } from '../services/firebase';

export const FounderSection: React.FC = () => {
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('stackd_founder_photo') || localStorage.getItem('stackd_bhavya_photo');
    } catch {
      return null;
    }
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Subscribe to real-time shared Firestore site_media
    const unsubscribe = subscribeSiteMedia((mediaMap) => {
      if (mediaMap.founder) {
        setCustomPhoto(mediaMap.founder);
        safeLocalStorageSet('stackd_founder_photo', mediaMap.founder);
      }
    });

    // 2. Also listen for internal tab updates
    const handleUpdate = () => {
      try {
        const local = localStorage.getItem('stackd_founder_photo') || localStorage.getItem('stackd_bhavya_photo');
        if (local) setCustomPhoto(local);
      } catch {}
    };
    window.addEventListener('stackd_data_updated', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('stackd_data_updated', handleUpdate);
    };
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Upload to shared cloud storage or fallback data URL
        const mediaUrl = await uploadMediaFile(file, 'photos');
        setCustomPhoto(mediaUrl);
        safeLocalStorageSet('stackd_founder_photo', mediaUrl);
        safeLocalStorageSet('stackd_bhavya_photo', mediaUrl);
        // Persist to shared Firestore accessible to every public visitor
        await saveSiteMedia('founder', mediaUrl);
        window.dispatchEvent(new Event('stackd_data_updated'));
      } catch (err) {
        console.warn('Photo upload failed, using local preview:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <section id="story" className="py-24 sm:py-32 bg-[#F5F0E5] text-[#6C1929] relative overflow-hidden">
      {/* Editorial paper background accent */}
      <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Portrait Frame of Bhavya */}
          <div className="lg:col-span-5 relative">
            <div className="relative group max-w-md mx-auto lg:max-w-none">
              {/* Scrapbook washi tape visual at top */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#E8DEC7]/80 rotate-[-1.5deg] border-x border-[#6C1929]/20 shadow-sm z-30 pointer-events-none" />

              {/* Founder Frame with Double Border */}
              <div className="relative rounded-2xl bg-[#EDE5D3] p-3 shadow-xl border border-[#6C1929]/15 overflow-hidden transition-transform duration-300 group-hover:rotate-[0.5deg]">
                <div className="relative aspect-[4/5] w-full shrink-0 rounded-xl overflow-hidden bg-[#350A13] flex items-center justify-center text-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center text-[#F5F0E5] gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#F5F0E5]" />
                      <span className="text-xs uppercase tracking-widest font-mono">Syncing photo...</span>
                    </div>
                  ) : customPhoto ? (
                    <div className="relative w-full h-full group/photo">
                      <img
                        src={getAssetUrl(customPhoto)}
                        alt="Bhavya holding a Stackd cookie in her Stackd Bombay shirt"
                        className="w-full h-full object-cover object-center block"
                        referrerPolicy="no-referrer"
                      />
                      {/* Subtle admin change button on hover */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#F5F0E5] opacity-0 group-hover/photo:opacity-100 transition-opacity cursor-pointer shadow-md"
                        title="Update portrait photo"
                        aria-label="Update portrait photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* Default Editorial Founder Display Card honoring Bhavya */
                    <div className="w-full h-full relative flex flex-col justify-between p-6 bg-gradient-to-b from-[#4A0E1B] to-[#2B0710] text-[#F5F0E5]">
                      {/* Top Stamp */}
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] text-[#F5F0E5]/70 border-b border-[#F5F0E5]/15 pb-3">
                        <span>Founder Portrait</span>
                        <span>Worli, Mumbai</span>
                      </div>

                      {/* Center Founder Card Visual */}
                      <div className="my-auto py-8">
                        <div className="w-24 h-24 mx-auto mb-5 rounded-full border-2 border-[#F5F0E5]/30 flex items-center justify-center bg-[#6C1929]/50 shadow-inner">
                          <span className="font-script text-5xl text-[#F5F0E5]">B</span>
                        </div>
                        <h3 className="font-script text-4xl text-[#F5F0E5] mb-1">
                          Bhavya
                        </h3>
                        <p className="font-sans-clean text-xs uppercase tracking-widest text-[#F5F0E5]/75">
                          Founder & Baker · Age 19
                        </p>
                        <p className="text-[11px] text-[#F5F0E5]/60 mt-3 font-serif italic max-w-xs mx-auto">
                          “Stackd Bombay shirt · Freshly baked cookie in hand · Worli kitchen”
                        </p>
                      </div>

                      {/* Photo Upload affordance */}
                      <div className="pt-3 border-t border-[#F5F0E5]/15 flex items-center justify-between text-xs">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F0E5]/15 hover:bg-[#F5F0E5]/25 text-[#F5F0E5] text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload Founder Photo</span>
                        </button>
                        <span className="font-signature text-2xl text-[#F5F0E5]/80">
                          bhavya.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Hidden file input for uploading the real photo of Bhavya */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Bottom caption plate */}
                <div className="pt-3 pb-1 px-2 flex items-center justify-between text-xs text-[#6C1929]">
                  <span className="font-editorial italic text-sm">Bhavya in the Worli kitchen</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#6C1929]/70">Est. 2024</span>
                </div>
              </div>

              {/* Offset Handwritten Sticky Note */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#FAF7F0] p-4 rounded-lg shadow-lg border border-[#6C1929]/15 max-w-[210px] rotate-[3deg] z-20">
                <p className="font-script text-2xl leading-none text-[#6C1929] mb-1">
                  100+ recipe trials
                </p>
                <p className="font-sans-clean text-[11px] text-[#6C1929]/75 leading-tight">
                  before approving a single cookie for Mumbai.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Founder Story */}
          <div className="lg:col-span-7">
            {/* Section Tag */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#6C1929]/75 font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C1929]" />
              <span>The Founder</span>
              <span className="text-[#6C1929]/40">/</span>
              <span>Worli, Mumbai</span>
            </div>

            {/* Main Editorial Headline */}
            <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-[27px] sm:text-[32px] lg:text-[38px] leading-[1.15] tracking-[-0.4px] text-[#6C1929] text-left mb-5">
              19 Year Old College Student And Building A Cookie Brand
            </h2>

            {/* Emotional Story Narrative */}
            <div className="space-y-4 text-sm sm:text-base text-[#44101B] leading-relaxed font-normal text-left">
              <p>
                Bhavya didn’t wait for graduation to build something obsessive. Between early morning lectures, assignment submissions, group presentations, and exams, she spent months turning a Worli kitchen into a high-stakes test lab.
              </p>
              <p>
                She spent more than <strong>₹9,000 simply testing recipes</strong> before launch. Not on marketing. Not on ads. Just flour, French butter, Belgian couverture chocolate, and batch after batch. Over <strong>100 trial cookies</strong> were baked just to engineer the signature chocolate chip crumb.
              </p>
              <p>
                Batches were rejected without mercy: when they spread half an inch too flat, when they were slightly too sweet, when the red velvet lacked its signature cocoa depth. If it wasn’t the most loaded, melt-in-the-mouth bite in Mumbai, it didn’t make the cut.
              </p>
              <p className="italic font-editorial text-lg text-[#6C1929] pt-1">
                “I thought I was simply starting a cookie brand. I ended up learning recipe science, studio photography, video editing, branding, packaging, customer care, and operations—all at 19.”
              </p>
            </div>

            {/* Micro Stats / Proof row */}
            <div className="grid grid-cols-3 gap-4 pt-6 pb-6 border-y border-[#6C1929]/15 my-6">
              <div>
                <p className="font-editorial text-2xl sm:text-3xl font-semibold text-[#6C1929]">₹9,000+</p>
                <p className="text-xs text-[#6C1929]/70 uppercase tracking-wider font-medium mt-0.5">Pre-Launch Trials</p>
              </div>
              <div>
                <p className="font-editorial text-2xl sm:text-3xl font-semibold text-[#6C1929]">100+</p>
                <p className="text-xs text-[#6C1929]/70 uppercase tracking-wider font-medium mt-0.5">Tested Batches</p>
              </div>
              <div>
                <p className="font-editorial text-2xl sm:text-3xl font-semibold text-[#6C1929]">100%</p>
                <p className="text-xs text-[#6C1929]/70 uppercase tracking-wider font-medium mt-0.5">Eggless NYC Style</p>
              </div>
            </div>

            {/* CTA to Bhavya's Journal */}
            <div className="flex items-center gap-4">
              <a
                href="#journal"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#6C1929] hover:bg-[#50101D] text-[#F5F0E5] text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-200 shadow-sm hover:shadow"
              >
                <span>Bhavya's Journal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
