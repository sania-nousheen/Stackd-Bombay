import React, { useState, useEffect, useRef } from "react";
import { Link2, Volume2, VolumeX, Sparkles, Upload } from "lucide-react";
import { idbGet, idbSet, safeLocalStorageSet } from "../utils/mediaStorage";

export interface ReelItem {
  id: string;
  name: string;
  reviewer?: string;
  quote?: string;
  instagramUrl: string;
  videoUrl: string;
  poster?: string;
}

export const extractInstagramShortcode = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
};

export const isInstagramUrl = (url?: string): boolean => {
  if (!url) return false;
  return /instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i.test(url);
};

export const DEFAULT_FALLBACK_VIDEOS = [
  "/videos/cookie_pull.mp4",
  "/videos/cookie_unboxing.mp4",
  "/videos/cookie_crumb.mp4"
];

export const DEFAULT_REELS: ReelItem[] = [
  {
    id: "reel-1",
    name: "The Holy Trinity Pull",
    reviewer: "Devour Bombay",
    quote: "“The molten Belgian chocolate core is completely insane. 10/10 gooeyness.”",
    instagramUrl: "https://instagram.com/reel/C2g7Z-yP3Z0",
    videoUrl: "/videos/cookie_pull.mp4",
    poster: "/src/assets/images/cookie_holy_trinity_1791484027979.jpg"
  },
  {
    id: "reel-2",
    name: "Nutella Tin Unboxing",
    reviewer: "Mumbai Food Files",
    quote: "“Heaviest cookie tin in town. Warm it up for 20 seconds and thank me later.”",
    instagramUrl: "https://instagram.com/reel/C4h9xL1P0aB",
    videoUrl: "/videos/cookie_unboxing.mp4",
    poster: "/src/assets/images/cookie_nutella_tin_1791484044384.jpg"
  },
  {
    id: "reel-3",
    name: "NYC Style Crumb Break",
    reviewer: "Karan B. (Bandra)",
    quote: "“Pure French butter aroma. Crisp outer edge with that deep chewy centre.”",
    instagramUrl: "https://instagram.com/reel/C1m9kLkP4qR",
    videoUrl: "/videos/cookie_crumb.mp4",
    poster: "/src/assets/images/hero_cookie_macro_1791484018264.jpg"
  }
];

export const isDirectPlayableVideo = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.includes(".mp4?") ||
    clean.includes(".webm?") ||
    clean.includes("/videos/") ||
    clean.startsWith("blob:") ||
    clean.startsWith("data:video/")
  );
};

export const resolvePlayableVideo = (url?: string, index: number = 0): string => {
  if (url && isDirectPlayableVideo(url)) {
    return url;
  }
  return DEFAULT_FALLBACK_VIDEOS[index % DEFAULT_FALLBACK_VIDEOS.length];
};

/**
 * Strips huge base64/data URLs before saving to localStorage so it never exceeds quota.
 * Full data is safely persisted in IndexedDB.
 */
export function sanitizeReelsForLocalStorage(reels: ReelItem[]): ReelItem[] {
  return reels.map((r) => ({
    ...r,
    videoUrl: r.videoUrl?.startsWith("data:") ? "" : r.videoUrl,
    poster: r.poster?.startsWith("data:") ? "" : r.poster
  }));
}

export const ReelWallSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Load stored reels state
  const [reels, setReels] = useState<ReelItem[]>(() => {
    try {
      const saved = localStorage.getItem("stackd_reels_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => {
            const defaultItem = DEFAULT_REELS[idx % DEFAULT_REELS.length];
            return {
              ...defaultItem,
              ...item
            };
          });
        }
      }
    } catch {}
    return DEFAULT_REELS;
  });

  const [isMuted, setIsMuted] = useState(true);
  const [editingReelId, setEditingReelId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState("");

  // Hydrate high-res videos/photos from IndexedDB if saved
  useEffect(() => {
    let isMounted = true;
    const hydrateFromIdb = async () => {
      const stored = await idbGet<ReelItem[]>("stackd_reels_full");
      if (stored && Array.isArray(stored) && isMounted) {
        setReels(stored);
      }
    };
    hydrateFromIdb();

    const handleDataUpdate = async () => {
      // First check IndexedDB for heavy media
      const stored = await idbGet<ReelItem[]>("stackd_reels_full");
      if (stored && Array.isArray(stored) && isMounted) {
        setReels(stored);
        return;
      }
      try {
        const saved = localStorage.getItem("stackd_reels_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setReels(
              parsed.map((item, idx) => {
                const defaultItem = DEFAULT_REELS[idx % DEFAULT_REELS.length];
                return {
                  ...defaultItem,
                  ...item
                };
              })
            );
          }
        }
      } catch {}
    };

    window.addEventListener("stackd_data_updated", handleDataUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("stackd_data_updated", handleDataUpdate);
    };
  }, []);

  // Guarantee all videos start playing automatically on mount and whenever reels change
  useEffect(() => {
    const playAll = () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.muted = isMuted;
          const promise = video.play();
          if (promise !== undefined) {
            promise.catch(() => {});
          }
        }
      });
    };
    playAll();
  }, [reels, isMuted]);

  // IntersectionObserver to guarantee videos play automatically as soon as section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRefs.current.forEach((video) => {
              if (video) {
                video.muted = isMuted;
                video.play().catch(() => {});
              }
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isMuted]);

  const saveReelsState = async (updated: ReelItem[]) => {
    setReels(updated);
    // 1. Save full data with any dataURL video in IndexedDB
    await idbSet("stackd_reels_full", updated);
    // 2. Save metadata & lightweight URLs to localStorage safely
    const sanitized = sanitizeReelsForLocalStorage(updated);
    safeLocalStorageSet("stackd_reels_data", JSON.stringify(sanitized));
    window.dispatchEvent(new Event("stackd_data_updated"));
  };

  const handleSaveUrl = async (id: string, index: number) => {
    if (!inputUrl.trim()) {
      setEditingReelId(null);
      return;
    }
    const trimmed = inputUrl.trim();
    const updated = reels.map((r, idx) => {
      if (r.id === id) {
        const isInsta = isInstagramUrl(trimmed);
        return {
          ...r,
          instagramUrl: isInsta ? trimmed : r.instagramUrl,
          videoUrl: isInsta ? r.videoUrl : trimmed
        };
      }
      return r;
    });

    await saveReelsState(updated);
    setEditingReelId(null);
    setInputUrl("");
  };

  const setPresetVideo = async (id: string, presetVideo: string) => {
    const updated = reels.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          videoUrl: presetVideo
        };
      }
      return r;
    });

    await saveReelsState(updated);
    setEditingReelId(null);
  };

  const handleFileUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const updated = reels.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              videoUrl: dataUrl
            };
          }
          return r;
        });
        await saveReelsState(updated);
        setEditingReelId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-[#F5F0E5] text-[#6C1929] relative overflow-hidden"
    >
      {/* Background paper grain texture */}
      <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#6C1929]/8 border border-[#6C1929]/15 text-[11px] uppercase tracking-[0.22em] text-[#6C1929] font-bold mb-3 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#6C1929]" />
            <span>Customer Reviews and Unboxings</span>
          </div>
          <h2 className="font-[Cormorant_Garamond,Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[46px] text-[#6C1929] leading-tight tracking-[-0.4px]">
            Cookie Reviews Hit Different
          </h2>
          <p className="font-editorial italic text-base sm:text-lg text-[#6C1929]/80 mt-1.5">
            Real reactions from the people who devoured Stackd in Mumbai.
          </p>
        </div>

        {/* 3 Reel Cards Grid - Pure Edge-to-Edge Autoplaying Looping Videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reels.map((reel, index) => {
            const playableUrl = resolvePlayableVideo(reel.videoUrl, index);

            return (
              <div
                key={reel.id}
                className="flex flex-col items-center group w-full"
              >
                {/* Vertical Reel Video Container (Edge-to-edge pure video, no text top/bottom, no buttons) */}
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-[#6C1929]/20 transition-all duration-300 group-hover:scale-[1.015] group-hover:shadow-2xl flex items-center justify-center">
                  
                  {/* HTML5 Native High-Definition Video - Guaranteed Autoplay Loop */}
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={playableUrl}
                    poster={reel.poster}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      const fallback = DEFAULT_FALLBACK_VIDEOS[index % DEFAULT_FALLBACK_VIDEOS.length];
                      if (e.currentTarget.src !== window.location.origin + fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {/* Audio Toggle Button - Subtle minimal top-right control */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-black/85 text-white/95 transition-all backdrop-blur-md cursor-pointer shadow-md border border-white/15 active:scale-95"
                      title={isMuted ? "Unmute audio" : "Mute audio"}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>

                    {/* Quick edit button on hover */}
                    <button
                      onClick={() => {
                        setEditingReelId(reel.id);
                        setInputUrl(reel.videoUrl || reel.instagramUrl || "");
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white transition-opacity backdrop-blur-md opacity-0 group-hover:opacity-100 cursor-pointer shadow-md border border-white/15"
                      title="Change video or upload video"
                      aria-label="Change video or upload video"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* In-Card Quick URL / Upload Editor (when editing) */}
                {editingReelId === reel.id && (
                  <div className="w-full mt-3 p-3.5 bg-white rounded-xl border border-[#6C1929]/20 shadow-xl text-xs z-30 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C1929]">
                        Change Video For This Card:
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditingReelId(null)}
                        className="text-[10px] text-[#6C1929]/60 hover:text-[#6C1929] cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Paste direct .mp4 video URL..."
                        className="flex-1 px-3 py-1.5 border border-[#6C1929]/30 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                      <button
                        onClick={() => handleSaveUrl(reel.id, index)}
                        className="px-3.5 py-1.5 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] font-bold rounded-lg text-xs cursor-pointer shadow-sm"
                      >
                        Save
                      </button>
                    </div>

                    {/* Direct Upload button */}
                    <div className="pt-1 flex items-center justify-between border-t border-[#6C1929]/10">
                      <span className="text-[10px] text-[#6C1929]/70 font-medium">Or upload your video:</span>
                      <label className="px-2.5 py-1 bg-[#6C1929]/10 hover:bg-[#6C1929]/20 text-[#6C1929] rounded-md text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload .mp4</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(reel.id, file);
                          }}
                        />
                      </label>
                    </div>

                    {/* Instant Cookie Video Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#6C1929]/10">
                      <span className="text-[10px] text-[#6C1929]/70 w-full font-medium">Choose a preset video:</span>
                      <button
                        type="button"
                        onClick={() => setPresetVideo(reel.id, "/videos/cookie_pull.mp4")}
                        className="px-2 py-0.5 rounded bg-[#F5F0E5] hover:bg-[#EAE1CF] text-[#6C1929] text-[10px] font-semibold border border-[#6C1929]/15 cursor-pointer"
                      >
                        Cookie Pull
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetVideo(reel.id, "/videos/cookie_unboxing.mp4")}
                        className="px-2 py-0.5 rounded bg-[#F5F0E5] hover:bg-[#EAE1CF] text-[#6C1929] text-[10px] font-semibold border border-[#6C1929]/15 cursor-pointer"
                      >
                        Nutella Tin
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetVideo(reel.id, "/videos/cookie_crumb.mp4")}
                        className="px-2 py-0.5 rounded bg-[#F5F0E5] hover:bg-[#EAE1CF] text-[#6C1929] text-[10px] font-semibold border border-[#6C1929]/15 cursor-pointer"
                      >
                        NYC Crumb
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
