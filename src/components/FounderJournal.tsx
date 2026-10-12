import { getAssetUrl } from "../utils/assets";
import React, { useState } from 'react';
import { JOURNAL_POSTS, JournalPost } from '../data/journal';
import { JournalAdminModal } from './JournalAdminModal';
import { ArrowRight, X, Calendar, ChevronDown, Edit3 } from 'lucide-react';

interface FounderJournalProps {
  isAdminOpen?: boolean;
  onCloseAdmin?: () => void;
}

export const FounderJournal: React.FC<FounderJournalProps> = ({
  isAdminOpen = false,
  onCloseAdmin
}) => {
  // Load custom saved posts if available
  const [posts, setPosts] = useState<JournalPost[]>(() => {
    try {
      const saved = localStorage.getItem('stackd_journal_posts_custom');
      if (saved) return JSON.parse(saved);
    } catch {}
    return JOURNAL_POSTS;
  });

  const [selectedPost, setSelectedPost] = useState<JournalPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAllPosts, setShowAllPosts] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState(isAdminOpen);

  // Sync external admin prop and live updates
  React.useEffect(() => {
    if (isAdminOpen) setAdminModalOpen(true);
  }, [isAdminOpen]);

  React.useEffect(() => {
    const handleDataUpdate = () => {
      try {
        const saved = localStorage.getItem('stackd_journal_posts_custom');
        if (saved) setPosts(JSON.parse(saved));
        else setPosts(JOURNAL_POSTS);
      } catch {}
    };
    window.addEventListener('stackd_data_updated', handleDataUpdate);
    return () => window.removeEventListener('stackd_data_updated', handleDataUpdate);
  }, []);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (activeCategory === 'all') return true;
    return post.category === activeCategory;
  });

  // Display subset or all
  const displayedPosts = showAllPosts ? filteredPosts : filteredPosts.slice(0, 6);

  return (
    <section id="journal" className="py-24 sm:py-32 bg-[#F5F0E5] text-[#6C1929] relative overflow-hidden">
      {/* Editorial paper grain texture */}
      <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header: Smaller single-line heading, centered filter boxes above the divider */}
        <div className="flex flex-col items-center text-center mb-14 border-b border-[#6C1929]/15 pb-8">
          
          {/* Small Heading */}
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#6C1929]/5 border border-[#6C1929]/15 text-[11px] uppercase tracking-[0.25em] text-[#6C1929] font-semibold mb-2">
            Bhavya's Journal · From The Stackd Kitchen
          </div>

          {/* Big Heading: Cormorant Garamond Medium (500) and in single line */}
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] font-medium not-italic text-3xl sm:text-4xl lg:text-[46px] text-[#6C1929] leading-tight tracking-[-0.4px] whitespace-nowrap overflow-hidden text-ellipsis mb-2">
            From The Stackd Journal
          </h2>
          
          <p className="font-editorial italic text-base sm:text-lg text-[#6C1929]/80 mb-6 max-w-xl">
            Chronicles of a 19-year-old student building India's most loaded eggless cookie brand in Worli.
          </p>

          {/* Centered Filter Boxes Above the Line as requested */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: `All Entries (${posts.length})` },
              { id: 'origins', label: 'Origins & Age 19' },
              { id: 'recipes', label: '100+ Trials' },
              { id: 'milestones', label: 'Orders & Growth' },
              { id: 'economics', label: 'The Economics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setShowAllPosts(true);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#6C1929] text-[#F5F0E5] shadow-sm'
                    : 'bg-[#EAE1CF]/80 text-[#6C1929]/75 hover:text-[#6C1929] hover:bg-[#EAE1CF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Chronological Editorial Grid (Section 22 Card Design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {displayedPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-[#FAF7F0] rounded-2xl border border-[#6C1929]/15 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Card Image with Hover Zoom Animation */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#24080F]">
                  <img
                    src={getAssetUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = getAssetUrl('/images/hero_cookie_macro.jpg');
                      if (e.currentTarget.src !== fallback && e.currentTarget.src !== window.location.origin + fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-7">
                  {/* Date with natural spacing between date, month, and year */}
                  <div className="flex items-center justify-between text-xs text-[#6C1929]/75 mb-3 font-sans-clean font-medium">
                    <span className="tracking-normal">{post.date}</span>
                    <span className="capitalize text-[10px] bg-[#6C1929]/10 text-[#6C1929] px-2 py-0.5 rounded font-sans-clean font-bold tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  {/* Title in Elegant Serif with Subtle Shift Animation */}
                  <h3 className="font-editorial text-2xl font-bold text-[#6C1929] leading-snug mb-3 group-hover:text-[#4A0E1B] group-hover:translate-x-0.5 transition-all duration-200">
                    {post.title}
                  </h3>

                  {/* Burgundy Accent Line on Hover */}
                  <div className="h-[2px] w-0 bg-[#6C1929] group-hover:w-16 transition-all duration-300 mb-3" />

                  {/* Short Excerpt in Clean Sans-Serif */}
                  <p className="font-sans-clean text-xs sm:text-[13px] text-[#4A111E]/80 leading-relaxed font-normal line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer: Read More with Moving Arrow */}
              <div className="px-6 pb-6 pt-2 border-t border-[#6C1929]/10 flex items-center justify-between text-xs font-bold text-[#6C1929] tracking-wider uppercase">
                <span className="group-hover:text-[#4A0E1B] transition-colors">
                  Read More
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200" />
              </div>
            </article>
          ))}
        </div>

        {/* Explore All Toggle (Removed subtext as requested) */}
        {!showAllPosts && filteredPosts.length > 6 && (
          <div className="mt-14 text-center">
            <button
              onClick={() => setShowAllPosts(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FAF7F0] hover:bg-white border border-[#6C1929]/25 hover:border-[#6C1929] text-[#6C1929] text-xs font-semibold tracking-wider uppercase rounded-full shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span>Explore All {filteredPosts.length} Journal Entries</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Reading Article Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative bg-[#FAF7F0] text-[#6C1929] max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-[#6C1929]/20 shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#6C1929]/10 hover:bg-[#6C1929]/20 text-[#6C1929] transition-colors cursor-pointer"
                aria-label="Close journal post"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Date & Metadata */}
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#6C1929]/70 mb-3 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedPost.date}</span>
              </div>

              {/* Title */}
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#6C1929] leading-tight mb-4">
                {selectedPost.title}
              </h2>

              {/* Featured Quote / Key Takeaway */}
              {selectedPost.keyHighlight && (
                <div className="p-4 rounded-xl bg-[#EAE1CF]/80 border-l-3 border-[#6C1929] mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#6C1929]/70 block mb-0.5">
                    Journal Insight:
                  </span>
                  <p className="font-editorial italic text-base sm:text-lg text-[#6C1929]">
                    “{selectedPost.keyHighlight}”
                  </p>
                </div>
              )}

              {/* Image banner inside reader */}
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6 border border-[#6C1929]/15">
                <img
                  src={getAssetUrl(selectedPost.image)}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const fallback = getAssetUrl('/images/hero_cookie_macro.jpg');
                    if (e.currentTarget.src !== fallback && e.currentTarget.src !== window.location.origin + fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Full Article Content */}
              <div className="space-y-4 text-sm sm:text-base text-[#46111C] leading-relaxed font-normal">
                {selectedPost.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Author Footer */}
              <div className="mt-10 pt-6 border-t border-[#6C1929]/15 flex items-center justify-between">
                <div>
                  <span className="font-script text-4xl text-[#6C1929] block leading-none">
                    Bhavya
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#6C1929]/65 font-mono">
                    Founder, Stackd Bombay · Worli Kitchen
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 bg-[#6C1929] text-[#F5F0E5] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#52111E] transition-colors cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Portal Modal */}
        <JournalAdminModal
          isOpen={adminModalOpen}
          onClose={() => {
            setAdminModalOpen(false);
            if (onCloseAdmin) onCloseAdmin();
          }}
          onPostsUpdated={(updated) => setPosts(updated)}
        />

      </div>
    </section>
  );
};
