import { getAssetUrl } from "../utils/assets";
import React, { useState, useEffect, useRef } from "react";
import { Link2, Volume2, VolumeX, Sparkles, Upload, Loader2 } from "lucide-react";
import { idbGet, idbSet, safeLocalStorageSet } from "../utils/mediaStorage";
import {
  subscribeReels,
  saveReel,
  uploadMediaFile,
  fetchChunkedVideo,
  ReelRecord
} from "../services/firebase";

import holyTrinityImage from '../assets/images/cookie_holy_trinity_1791484027979.jpg';
import nutellaTinImage from '../assets/images/cookie_nutella_tin_1791484044384.jpg';
import heroCookieImage from '../assets/images/hero_cookie_macro_1791484018264.jpg';

export interface ReelItem {
  id: string;
  name: string;
  reviewer?: string;
  quote?: string;
  instagramUrl: string;
  videoUrl: string;
  poster?: string;
  order?: number;
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
    poster: holyTrinityImage
  },
  {
    id: "reel-2",
    name: "Nutella Tin Unboxing",
    reviewer: "Mumbai Food Files",
    quote: "“Heaviest cookie tin in town. Warm it up for 20 seconds and thank me later.”",
    instagramUrl: "https://instagram.com/reel/C4h9xL1P0aB",
    videoUrl: "/videos/cookie_unboxing.mp4",
    poster: nutellaTinImage
  },
  {
    id: "reel-3",
    name: "NYC Style Crumb Break",
    reviewer: "Karan B. (Bandra)",
    quote: "“Pure French butter aroma. Crisp outer edge with that deep chewy centre.”",
    instagramUrl: "https://instagram.com/reel/C1m9kLkP4qR",
    videoUrl: "/videos/cookie_crumb.mp4",
    poster: heroCookieImage
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
    clean.startsWith("data:video/") ||
    clean.includes("firebasestorage.googleapis.com")
  );
};

export const resolvePlayableVideo = (url?: string, index: number = 0): string => {
  if (url && (isDirectPlayableVideo(url) || url.startsWith("blob:"))) {
    return url;
  }
  return DEFAULT_FALLBACK_VIDEOS[index % DEFAULT_FALLBACK_VIDEOS.length];
};

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

  const [resolvedVideoUrls, setResolvedVideoUrls] = useState<Record<string, string>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [editingReelId, setEditingReelId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Subscribe to real-time shared Firestore reels
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeReels((remoteReels) => {
      if (remoteReels && remoteReels.length > 0 && isMounted) {
        const merged = remoteReels.map((item, idx) => {
          const defaultItem = DEFAULT_REELS[idx % DEFAULT_REELS.length];
          return {
            ...defaultItem,
            ...item,
            instagramUrl: item.instagramUrl || defaultItem.instagramUrl
          };
        });
        setReels(merged);
        const sanitized = sanitizeReelsForLocalStorage(merged);
        safeLocalStorageSet("stackd_reels_data", JSON.stringify(sanitized));
      }
    });

    // Also hydrate from IndexedDB for local offline support
    const hydrateFromIdb = async () => {
      const stored = await idbGet<ReelItem[]>("stackd_reels_full");
      if (stored && Array.isArray(stored) && isMounted) {
        setReels(stored);
      }
    };
    hydrateFromIdb();

    const handleDataUpdate = async () => {
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
      unsubscribe();
      window.removeEventListener("stackd_data_updated", handleDataUpdate);
    };
  }, []);

  // Resolve any chunked Firestore videos
  useEffect(() => {
    let isMounted = true;
    reels.forEach(async (reel) => {
      if (reel.videoUrl?.startsWith("firestore-chunk:")) {
        const reelId = reel.videoUrl.replace("firestore-chunk:", "");
        const blobUrl = await fetchChunkedVideo(reelId);
        if (blobUrl && isMounted) {
          setResolvedVideoUrls((prev) => ({
            ...prev,
            [reel.id]: blobUrl
          }));
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [reels]);

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
  }, [reels, resolvedVideoUrls, isMuted]);

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

    // 3. Persist to shared Firestore so all devices see the changes
    for (let i = 0; i < updated.length; i++) {
      const r = updated[i];
      try {
        await saveReel({
          ...r,
          order: i
        });
      } catch (err) {
        console.warn(`Failed to sync reel ${r.id} to Firestore:`, err);
      }
    }

    window.dispatchEvent(new Event("stackd_data_updated"));
  };

  const handleSaveUrl = async (id: string) => {
    if (!inputUrl.trim()) {
      setEditingReelId(null);
      return;
    }
    const trimmed = inputUrl.trim();
    const updated = reels.map((r) => {
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

  const handleFileUpload = async (id: string, file: File) => {
    setIsUploading(true);
    try {
      // Upload to shared cloud storage or Firestore chunks
      const uploadedUrl = await uploadMediaFile(file, 'videos', id);
      const updated = reels.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            videoUrl: uploadedUrl
          };
        }
        return r;
      });
      await saveReelsState(updated);
      setEditingReelId(null);
    } catch (err) {
      console.warn("Video upload error:", err);
    } finally {
      setIsUploading(false);
    }
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
            const resolvedUrl = resolvedVideoUrls[reel.id] || reel.videoUrl;
            const playableUrl = resolvePlayableVideo(resolvedUrl, index);

            return (
              <div
                key={reel.id}
                className="flex flex-col items-center group w-full"
              >
                {/* Vertical Reel Video Container */}
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-[#6C1929]/20 transition-all duration-300 group-hover:scale-[1.015] group-hover:shadow-2xl flex items-center justify-center">
                  
                  {/* HTML5 Native High-Definition Video - Guaranteed Autoplay Loop */}
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={getAssetUrl(playableUrl)}
                    poster={getAssetUrl(reel.poster)}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      const fallback = getAssetUrl(DEFAULT_FALLBACK_VIDEOS[index % DEFAULT_FALLBACK_VIDEOS.length]);
                      if (!e.currentTarget.src.endsWith(fallback.replace(/^\.\//, ''))) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {/* Audio Toggle Button */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#F5F0E5] transition-all hover:scale-110 active:scale-95 shadow-md cursor-pointer"
                      title={isMuted ? "Unmute audio" : "Mute audio"}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-[#F5F0E5]" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#F5F0E5]" />
                      )}
                    </button>
                  </div>

                  {/* Loading Overlay when uploading */}
                  {isUploading && editingReelId === reel.id && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-2 z-30">
                      <Loader2 className="w-7 h-7 animate-spin text-[#F5F0E5]" />
                      <span className="text-xs uppercase font-mono tracking-wider">Syncing video...</span>
                    </div>
                  )}

                  {/* Inline URL/Upload Edit Overlay (Admin only triggerable) */}
                  {editingReelId === reel.id && !isUploading && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 p-4 flex flex-col justify-center gap-3 text-[#F5F0E5]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F5F0E5]/90">
                        Update Review Video
                      </span>
                      <input
                        type="text"
                        placeholder="Paste MP4 link or Instagram URL"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 rounded-lg text-xs text-[#F5F0E5] border border-white/20 focus:outline-hidden focus:border-white/50"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveUrl(reel.id)}
                          className="flex-1 py-1.5 bg-[#6C1929] hover:bg-[#852134] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Save Link
                        </button>
                        <button
                          onClick={() => setEditingReelId(null)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                        <label className="w-full py-1.5 px-2 bg-white/10 hover:bg-white/15 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload MP4 from Device</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload(reel.id, f);
                            }}
                          />
                        </label>
                        <div className="flex gap-1 justify-center">
                          {DEFAULT_FALLBACK_VIDEOS.map((vid, vIdx) => (
                            <button
                              key={vid}
                              onClick={() => setPresetVideo(reel.id, vid)}
                              className="px-2 py-1 text-[10px] bg-white/5 hover:bg-white/15 rounded text-white/70"
                            >
                              Preset {vIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
