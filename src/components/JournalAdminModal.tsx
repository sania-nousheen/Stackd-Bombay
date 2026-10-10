import { safeLocalStorageSet } from '../utils/mediaStorage';
import React, { useState } from 'react';
import { JOURNAL_POSTS, JournalPost } from '../data/journal';
import { X, Save, Edit3, Image, Calendar, Trash2, Plus, Lock } from 'lucide-react';

interface JournalAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostsUpdated: (posts: JournalPost[]) => void;
}

export const JournalAdminModal: React.FC<JournalAdminModalProps> = ({
  isOpen,
  onClose,
  onPostsUpdated
}) => {
  const [posts, setPosts] = useState<JournalPost[]>(() => {
    try {
      const saved = localStorage.getItem('stackd_journal_posts_custom');
      if (saved) return JSON.parse(saved);
    } catch {}
    return JOURNAL_POSTS;
  });

  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id || '');
  const [successMsg, setSuccessMsg] = useState(false);

  const currentPost = posts.find((p) => p.id === selectedPostId) || posts[0];

  const handleFieldChange = (field: keyof JournalPost, value: any) => {
    if (!currentPost) return;
    const updated = posts.map((p) => {
      if (p.id === currentPost.id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setPosts(updated);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentPost) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        handleFieldChange('image', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    try {
      safeLocalStorageSet('stackd_journal_posts_custom', JSON.stringify(posts));
      onPostsUpdated(posts);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-[#FAF7F0] text-[#6C1929] max-w-4xl w-full max-h-[92vh] overflow-hidden rounded-2xl border border-[#6C1929]/25 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#6C1929]/15 flex items-center justify-between bg-[#F5F0E5]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#6C1929]" />
            <h2 className="font-editorial text-xl font-bold text-[#6C1929]">
              Bhavya's Journal Admin Portal
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#6C1929]/10 text-[#6C1929]">
              {posts.length} Entries
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6C1929] text-[#F5F0E5] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#52111E] transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{successMsg ? 'Saved!' : 'Save Changes'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 text-[#6C1929] transition-colors cursor-pointer"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Columns: Left list of posts, Right editor */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#6C1929]/15">
          
          {/* Post Selector Sidebar */}
          <div className="md:col-span-4 p-4 overflow-y-auto max-h-[380px] md:max-h-full space-y-1.5 bg-[#FAF7F0]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6C1929]/60 px-2 mb-2">
              Select Post To Edit:
            </p>
            {posts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPostId(p.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors block ${
                  p.id === currentPost?.id
                    ? 'bg-[#6C1929] text-[#F5F0E5] font-semibold shadow-sm'
                    : 'hover:bg-[#EAE1CF] text-[#6C1929]'
                }`}
              >
                <div className="text-[10px] opacity-75 font-mono">{p.date}</div>
                <div className="truncate font-editorial text-sm mt-0.5">{p.title}</div>
              </button>
            ))}
          </div>

          {/* Editor Form Area */}
          <div className="md:col-span-8 p-6 overflow-y-auto max-h-[500px] md:max-h-full space-y-4 bg-white/70">
            {currentPost && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C1929]/80 mb-1">
                      Publication Date
                    </label>
                    <input
                      type="text"
                      value={currentPost.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      placeholder="e.g. 26 MAY 2026"
                      className="w-full px-3 py-2 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#6C1929]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C1929]/80 mb-1">
                      Category
                    </label>
                    <select
                      value={currentPost.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#6C1929]"
                    >
                      <option value="origins">origins</option>
                      <option value="recipes">recipes</option>
                      <option value="ingredients">ingredients</option>
                      <option value="milestones">milestones</option>
                      <option value="economics">economics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C1929]/80 mb-1">
                    Article Title / Heading
                  </label>
                  <input
                    type="text"
                    value={currentPost.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 font-editorial text-base focus:outline-none focus:border-[#6C1929]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C1929]/80 mb-1">
                    Card Short Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={currentPost.excerpt}
                    onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#6C1929]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C1929]/80 mb-1">
                    Post Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 shrink-0">
                      <img
                        src={currentPost.image}
                        alt="Current post thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="px-3 py-2 rounded-lg bg-[#EAE1CF] hover:bg-[#E2D6BF] text-[#6C1929] text-xs font-semibold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFile}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6C1929]/80 mb-1">
                    Full Content (Paragraphs)
                  </label>
                  <textarea
                    rows={6}
                    value={currentPost.content.join('\n\n')}
                    onChange={(e) =>
                      handleFieldChange('content', e.target.value.split('\n\n').filter(Boolean))
                    }
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 focus:outline-none focus:border-[#6C1929]"
                  />
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
