import React, { useState, useEffect } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { JOURNAL_POSTS, JournalPost } from '../data/journal';

import holyTrinityImage from '../assets/images/cookie_holy_trinity_1791484027979.jpg';
import nutellaTinImage from '../assets/images/cookie_nutella_tin_1791484044384.jpg';
import heroCookieImage from '../assets/images/hero_cookie_macro_1791484018264.jpg';
import ingredientsImage from '../assets/images/ingredients_couverture_butter_1791484056180.jpg';

import {
  X,
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Cookie,
  Film,
  BookOpen,
  Check,
  Lock,
  LogOut,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Instagram,
  Image as ImageIcon,
  Camera,
  Upload
} from 'lucide-react';
import { DEFAULT_REELS, ReelItem, extractInstagramShortcode, isInstagramUrl, sanitizeReelsForLocalStorage } from './ReelWallSection';
import { idbGet, idbSet, idbDel, safeLocalStorageSet } from '../utils/mediaStorage';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('stackd_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [username, setUsername] = useState('stackdbombay');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active section tab: 4 header categories in left panel
  const [activeTab, setActiveTab] = useState<'menu' | 'reels' | 'journal' | 'photos'>('menu');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Menu State
  const [menuItems, setMenuItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('stackd_menu_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return PRODUCTS;
  });
  const [selectedProductId, setSelectedProductId] = useState<string>(menuItems[0]?.id || '');

  // 2. Reels State (with guaranteed real videoUrl loop)
  const [reels, setReels] = useState<ReelItem[]>(() => {
    try {
      const saved = localStorage.getItem('stackd_reels_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: ReelItem, idx: number) => ({
            ...DEFAULT_REELS[idx % DEFAULT_REELS.length],
            ...item,
            videoUrl: item.videoUrl || DEFAULT_REELS[idx % DEFAULT_REELS.length]?.videoUrl || '/videos/cookie_pull.mp4'
          }));
        }
      }
    } catch {}
    return DEFAULT_REELS;
  });
  const [selectedReelId, setSelectedReelId] = useState<string>(reels[0]?.id || '');
  // Hydrate full reels (including custom high-res video data) from IndexedDB whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    const loadFullReels = async () => {
      const stored = await idbGet<ReelItem[]>("stackd_reels_full");
      if (stored && Array.isArray(stored) && stored.length > 0) {
        setReels(stored);
      }
    };
    loadFullReels();
  }, [isOpen]);


  // 3. Journal State
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>(() => {
    try {
      const saved = localStorage.getItem('stackd_journal_posts_custom');
      if (saved) return JSON.parse(saved);
    } catch {}
    return JOURNAL_POSTS;
  });
  const [selectedPostId, setSelectedPostId] = useState<string>(journalPosts[0]?.id || '');

  // 4. Website Photos State (Founder, Tin, Ingredients)
  const [founderPhoto, setFounderPhoto] = useState<string>(() => {
    try {
      return localStorage.getItem('stackd_founder_photo') || localStorage.getItem('stackd_bhavya_photo') || '';
    } catch {
      return '';
    }
  });

  const [tinPhoto, setTinPhoto] = useState<string>(() => {
  try {
    return localStorage.getItem('stackd_tin_photo') || nutellaTinImage;
  } catch {
    return nutellaTinImage;
  }
});

const [ingredientsPhoto, setIngredientsPhoto] = useState<string>(() => {
  try {
    return localStorage.getItem('stackd_ingredients_photo') || ingredientsImage;
  } catch {
    return ingredientsImage;
  }
});

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
    window.dispatchEvent(new Event('stackd_data_updated'));
  };

  // Auth Submit Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'bhavyasbcookie') {
      try {
        sessionStorage.setItem('stackd_admin_auth', 'true');
      } catch {}
      setIsAuthenticated(true);
      setAuthError(null);
      setPassword('');
    } else {
      setAuthError('Incorrect password. Please enter the valid admin password.');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('stackd_admin_auth');
    } catch {}
    setIsAuthenticated(false);
    setPassword('');
    setAuthError(null);
  };

  // ===================== MENU ACTIONS =====================
  const currentProduct = menuItems.find((p) => p.id === selectedProductId) || menuItems[0];

  const handleUpdateProduct = (field: keyof Product, value: any) => {
    if (!currentProduct) return;
    setMenuItems((prev) =>
      prev.map((item) => (item.id === currentProduct.id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddNewProduct = () => {
  const newId = `cookie-${Date.now()}`;
  const newProd: Product = {
    id: newId,
    name: 'New Custom Cookie',
    tagline: 'Freshly Baked in Worli',
    category: 'cookie',
    availability: '24hr Pre-Order',
    description: 'Loaded with premium Belgian chocolate and European French butter.',
    founderNote: 'Tested and perfected in the South Bombay test kitchen.',
    ingredientsHighlight: ['Belgian Couverture', 'French Butter'],
    texture: 'Crisp perimeter with molten centre',
    image: heroCookieImage
    };
    setMenuItems((prev) => [newProd, ...prev]);
    setSelectedProductId(newId);
  };

  const handleDeleteProduct = (id: string) => {
    if (menuItems.length <= 1) return;
    const filtered = menuItems.filter((p) => p.id !== id);
    setMenuItems(filtered);
    setSelectedProductId(filtered[0]?.id || '');
  };

  const handleSaveMenu = () => {
    safeLocalStorageSet('stackd_menu_products', JSON.stringify(menuItems));
    showNotification('Menu changes saved successfully!');
  };

  const handleResetMenu = () => {
    if (window.confirm('Reset menu back to brand default offerings?')) {
      localStorage.removeItem('stackd_menu_products');
      setMenuItems(PRODUCTS);
      setSelectedProductId(PRODUCTS[0].id);
      showNotification('Menu reset to defaults!');
    }
  };

  // ===================== REELS ACTIONS =====================
  const currentReel = reels.find((r) => r.id === selectedReelId) || reels[0];

  const handleUpdateReel = (field: keyof ReelItem, value: any) => {
    if (!currentReel) return;
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== currentReel.id) return r;
        const updated = { ...r, [field]: value };
        if (field === 'instagramUrl' && isInstagramUrl(value)) {
          updated.instagramUrl = value;
        }
        if (field === 'videoUrl') {
          updated.videoUrl = value;
        }
        return updated;
      })
    );
  };

  const handleAddNewReel = () => {
  const newId = `reel-${Date.now()}`;
  const newReel: ReelItem = {
    id: newId,
    name: 'New Kitchen Moment',
    instagramUrl: 'https://instagram.com/reel/C2g7Z-yP3Z0',
    videoUrl: '/videos/cookie_pull.mp4',
    poster: holyTrinityImage
  };
    setReels((prev) => [...prev, newReel]);
    setSelectedReelId(newId);
  };

  const handleDeleteReel = (id: string) => {
    if (reels.length <= 1) return;
    const filtered = reels.filter((r) => r.id !== id);
    setReels(filtered);
    setSelectedReelId(filtered[0]?.id || '');
  };

  const handleSaveReels = async () => {
    try {
      // 1. Store full high-definition video/media data in IndexedDB (no 5MB quota limitation)
      await idbSet('stackd_reels_full', reels);
      // 2. Store lightweight metadata into localStorage without heavy base64 blobs
      const sanitized = sanitizeReelsForLocalStorage(reels);
      safeLocalStorageSet('stackd_reels_data', JSON.stringify(sanitized));
      window.dispatchEvent(new Event('stackd_data_updated'));
      showNotification('Reviews & reels saved successfully!');
    } catch (err) {
      console.error('Error saving reels:', err);
      showNotification('Error saving reels. Please try again.');
    }
  };

  const handleResetReels = async () => {
    if (window.confirm('Reset Instagram reels back to default videos?')) {
      try {
        localStorage.removeItem('stackd_reels_data');
        await idbDel('stackd_reels_full');
      } catch {}
      setReels(DEFAULT_REELS);
      setSelectedReelId('reel-1');
      window.dispatchEvent(new Event('stackd_data_updated'));
      showNotification('Reels reset to defaults!');
    }
  };

  // ===================== JOURNAL ACTIONS =====================
  const currentPost = journalPosts.find((p) => p.id === selectedPostId) || journalPosts[0];

  const handleUpdatePost = (field: keyof JournalPost, value: any) => {
    if (!currentPost) return;
    setJournalPosts((prev) =>
      prev.map((p) => (p.id === currentPost.id ? { ...p, [field]: value } : p))
    );
  };

  const handleAddNewPost = () => {
    const newId = `post-${Date.now()}`;
    const newPost: JournalPost = {
      id: newId,
      date: `${new Date().getDate()} ${new Date().toLocaleString('default', { month: 'short' }).toUpperCase()} ${new Date().getFullYear()}`,
      rawDate: new Date().toISOString().split('T')[0],
      title: 'New Story from the Worli Kitchen',
      category: 'recipes',
      excerpt: 'Notes on new recipe trials, flour hydrations, and baking science from Bhavya.',
      image: ingredientsImage,
      readTime: '3 min read',
      content: [
        'Every day in the kitchen is an opportunity to obsess over details.',
        'We continue testing small variations in butter caramelization and oven temperature.'
      ]
    };
    setJournalPosts((prev) => [newPost, ...prev]);
    setSelectedPostId(newId);
  };

  const handleDeletePost = (id: string) => {
    if (journalPosts.length <= 1) return;
    const filtered = journalPosts.filter((p) => p.id !== id);
    setJournalPosts(filtered);
    setSelectedPostId(filtered[0]?.id || '');
  };

  const handleSaveJournal = () => {
    safeLocalStorageSet('stackd_journal_posts_custom', JSON.stringify(journalPosts));
    showNotification('Journal stories saved successfully!');
  };

  const handleResetJournal = () => {
    if (window.confirm('Reset journal stories to default archives?')) {
      localStorage.removeItem('stackd_journal_posts_custom');
      setJournalPosts(JOURNAL_POSTS);
      setSelectedPostId(JOURNAL_POSTS[0].id);
      showNotification('Journal reset to defaults!');
    }
  };

  // ===================== PHOTOS ACTIONS =====================
  const handleSavePhotos = () => {
    try {
      if (founderPhoto) {
        safeLocalStorageSet('stackd_founder_photo', founderPhoto);
        safeLocalStorageSet('stackd_bhavya_photo', founderPhoto);
      }
      if (tinPhoto) {
        safeLocalStorageSet('stackd_tin_photo', tinPhoto);
      }
      if (ingredientsPhoto) {
        safeLocalStorageSet('stackd_ingredients_photo', ingredientsPhoto);
      }
      showNotification('Website photos saved and updated successfully!');
    } catch {
      showNotification('Photos saved!');
    }
  };

  const handleResetPhotos = () => {
  if (window.confirm('Reset all website photos back to original defaults?')) {
    localStorage.removeItem('stackd_founder_photo');
    localStorage.removeItem('stackd_bhavya_photo');
    localStorage.removeItem('stackd_tin_photo');
    localStorage.removeItem('stackd_ingredients_photo');

    setFounderPhoto('');
    setTinPhoto(nutellaTinImage);
    setIngredientsPhoto(ingredientsImage);

    showNotification('Photos reset to brand defaults!');
    }
  };

  // =========================================================================
  // VIEW 1: LOGIN SCREEN (SHOWN BEFORE ADMIN PANEL OPENS)
  // Username: stackdbombay (pre-filled), Password: bhavyasbcookie
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative bg-[#FAF7F0] text-[#6C1929] max-w-md w-full rounded-2xl border border-[#6C1929]/25 shadow-2xl p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#6C1929]/10 text-[#6C1929] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-7">
            <span className="font-['Alex_Brush',cursive] text-4xl text-[#6C1929] block leading-none mb-1">
              Stackd
            </span>
            <span className="font-sans-clean text-[9px] tracking-[0.32em] uppercase font-bold text-[#6C1929]/80 block mb-4">
              BOMBAY
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C1929]/10 text-[#6C1929] text-xs font-semibold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal Access</span>
            </div>
            <p className="text-xs text-[#6C1929]/70 font-sans-clean">
              Sign in with your founder credentials to manage menu offerings, reviews, and stories.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#6C1929] mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-[#6C1929]/20 bg-[#EAE1CF]/70 text-[#6C1929] text-sm font-semibold cursor-not-allowed select-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#6C1929]/15 text-[#6C1929]">
                  Verified
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#6C1929] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  autoFocus
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#6C1929]/25 bg-white text-[#6C1929] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C1929]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6C1929]/60 hover:text-[#6C1929] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-xl bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] text-xs font-bold uppercase tracking-[0.18em] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer"
            >
              <span>Unlock Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-[#6C1929]/10 text-center">
            <span className="text-[10px] text-[#6C1929]/60 font-sans-clean">
              Authorized Worli kitchen team & founder session
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL SCREEN ADMIN PORTAL WITH 3 HEADER NAMES IN LEFT PANEL
  // 1. Curated Baked Offerings
  // 2. Customer Reviews
  // 3. From The Stackd Journal
  // =========================================================================
  return (
    <div className="fixed inset-0 z-[120] bg-[#FAF7F0] text-[#6C1929] w-screen h-screen flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200">
      
      {/* ================= LEFT PANEL (SIDEBAR) ================= */}
      <aside className="w-full md:w-72 lg:w-80 bg-[#3D0A14] text-[#F5F0E5] flex flex-col shrink-0 border-r border-[#6C1929]/30 select-none shadow-2xl">
        
        {/* Brand identity header in left panel */}
        <div className="p-5 sm:p-6 border-b border-[#F5F0E5]/15 flex items-center justify-between">
          <div>
            <div className="flex items-baseline leading-none">
              <span className="font-['Alex_Brush',cursive] text-3xl sm:text-4xl text-[#F5F0E5] leading-none">
                Stackd
              </span>
            </div>
            <span className="font-sans-clean text-[9px] tracking-[0.34em] uppercase font-bold text-[#F5F0E5]/75 block pl-0.5 mt-0.5">
              BOMBAY · ADMIN
            </span>
          </div>

          <div className="md:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5F0E5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Header Names in Left Panel */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#F5F0E5]/45 px-3 py-1 mb-1">
            Portal Sections
          </div>

          {/* 1st Header Name: Curated Baked Offerings */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start gap-3 cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#6C1929] text-[#F5F0E5] shadow-lg ring-1 ring-[#F5F0E5]/25 font-semibold'
                : 'text-[#F5F0E5]/75 hover:bg-white/5 hover:text-[#F5F0E5]'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${activeTab === 'menu' ? 'bg-[#F5F0E5] text-[#6C1929]' : 'bg-white/10 text-[#F5F0E5]'}`}>
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <span className="font-['DM_Sans',sans-serif] text-xs font-bold uppercase tracking-wider block">
                Curated Baked Offerings
              </span>
              <span className="text-[11px] text-[#F5F0E5]/65 block mt-0.5 font-normal">
                {menuItems.length} Signature Products & Tins
              </span>
            </div>
          </button>

          {/* 2nd Header Name: Customer Reviews */}
          <button
            onClick={() => setActiveTab('reels')}
            className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start gap-3 cursor-pointer ${
              activeTab === 'reels'
                ? 'bg-[#6C1929] text-[#F5F0E5] shadow-lg ring-1 ring-[#F5F0E5]/25 font-semibold'
                : 'text-[#F5F0E5]/75 hover:bg-white/5 hover:text-[#F5F0E5]'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${activeTab === 'reels' ? 'bg-[#F5F0E5] text-[#6C1929]' : 'bg-white/10 text-[#F5F0E5]'}`}>
              <Film className="w-4 h-4" />
            </div>
            <div>
              <span className="font-['DM_Sans',sans-serif] text-xs font-bold uppercase tracking-wider block">
                Customer Reviews
              </span>
              <span className="text-[11px] text-[#F5F0E5]/65 block mt-0.5 font-normal">
                {reels.length} Instagram Reel Features
              </span>
            </div>
          </button>

          {/* 3rd Header Name: From The Stackd Journal */}
          <button
            onClick={() => setActiveTab('journal')}
            className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start gap-3 cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-[#6C1929] text-[#F5F0E5] shadow-lg ring-1 ring-[#F5F0E5]/25 font-semibold'
                : 'text-[#F5F0E5]/75 hover:bg-white/5 hover:text-[#F5F0E5]'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${activeTab === 'journal' ? 'bg-[#F5F0E5] text-[#6C1929]' : 'bg-white/10 text-[#F5F0E5]'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-['DM_Sans',sans-serif] text-xs font-bold uppercase tracking-wider block">
                From The Stackd Journal
              </span>
              <span className="text-[11px] text-[#F5F0E5]/65 block mt-0.5 font-normal">
                {journalPosts.length} Founder Articles & Stories
              </span>
            </div>
          </button>

          {/* 4th Header Name: Website Photos & Media */}
          <button
            onClick={() => setActiveTab('photos')}
            className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start gap-3 cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-[#6C1929] text-[#F5F0E5] shadow-lg ring-1 ring-[#F5F0E5]/25 font-semibold'
                : 'text-[#F5F0E5]/75 hover:bg-white/5 hover:text-[#F5F0E5]'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${activeTab === 'photos' ? 'bg-[#F5F0E5] text-[#6C1929]' : 'bg-white/10 text-[#F5F0E5]'}`}>
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-['DM_Sans',sans-serif] text-xs font-bold uppercase tracking-wider block">
                Website Photos & Media
              </span>
              <span className="text-[11px] text-[#F5F0E5]/65 block mt-0.5 font-normal">
                Founder, Tin & Ingredients Images
              </span>
            </div>
          </button>
        </nav>

        {/* Bottom panel user session & actions */}
        <div className="p-4 border-t border-[#F5F0E5]/15 bg-black/20 space-y-3">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#F5F0E5]/80 font-mono">stackdbombay</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[11px] text-[#F5F0E5]/60 hover:text-white flex items-center gap-1 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#F5F0E5] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Close Fullscreen Portal
          </button>
        </div>

      </aside>

      {/* ================= RIGHT MAIN WORKSPACE ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAF7F0]">
        
        {/* Workspace Top Bar */}
        <header className="px-6 py-4 border-b border-[#6C1929]/15 bg-[#F5F0E5] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6C1929]/65">
              <span>Admin Portal</span>
              <span>/</span>
              <span className="text-[#6C1929]">
                {activeTab === 'menu' && 'Curated Baked Offerings'}
                {activeTab === 'reels' && 'Customer Reviews'}
                {activeTab === 'journal' && 'From The Stackd Journal'}
                {activeTab === 'photos' && 'Website Photos & Media'}
              </span>
            </div>
            <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-2xl font-medium text-[#6C1929]">
              {activeTab === 'menu' && 'Manage Curated Baked Offerings'}
              {activeTab === 'reels' && 'Manage Customer Reviews & Reel Wall'}
              {activeTab === 'journal' && 'Manage From The Stackd Journal Stories'}
              {activeTab === 'photos' && 'Manage Website Photos & Media'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {successMsg && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="hidden md:flex p-2 rounded-full hover:bg-[#6C1929]/10 text-[#6C1929] transition-colors cursor-pointer"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Workspace Content Viewport */}
        <div className="flex-1 overflow-hidden">
          
          {/* TAB 1: CURATED BAKED OFFERINGS */}
          {activeTab === 'menu' && (
            <div className="h-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Product List Sidebar */}
              <div className="md:col-span-4 lg:col-span-3 border-r border-[#6C1929]/15 overflow-y-auto p-4 space-y-2 bg-[#F1EAD9]/40">
                <button
                  onClick={handleAddNewProduct}
                  className="w-full py-2.5 px-3 mb-2 rounded-xl bg-[#6C1929] text-[#F5F0E5] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#53121F] transition-colors cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Offering</span>
                </button>

                {menuItems.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedProductId === prod.id
                        ? 'bg-[#6C1929] text-[#F5F0E5] border-[#6C1929] shadow'
                        : 'bg-white text-[#6C1929] border-[#6C1929]/15 hover:border-[#6C1929]/40'
                    }`}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold truncate">{prod.name}</p>
                      <p className={`text-[10px] truncate ${selectedProductId === prod.id ? 'text-[#F5F0E5]/75' : 'text-[#6C1929]/65'}`}>
                        {prod.category.toUpperCase()} · {prod.availability}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Editor Area */}
              {currentProduct && (
                <div className="md:col-span-8 lg:col-span-9 overflow-y-auto p-6 sm:p-8 space-y-5 bg-[#FAF7F0]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#6C1929]/15">
                    <div>
                      <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-2xl font-medium text-[#6C1929]">
                        Editing Offering: {currentProduct.name}
                      </h3>
                      <p className="text-xs text-[#6C1929]/70 font-sans-clean">
                        ID: {currentProduct.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteProduct(currentProduct.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                        Offering Name
                      </label>
                      <input
                        type="text"
                        value={currentProduct.name}
                        onChange={(e) => handleUpdateProduct('name', e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={currentProduct.tagline}
                        onChange={(e) => handleUpdateProduct('tagline', e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                        Category
                      </label>
                      <select
                        value={currentProduct.category}
                        onChange={(e) => handleUpdateProduct('category', e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      >
                        <option value="cookie">Cookie (Individual NYC Chunk)</option>
                        <option value="tin">Loaded Cookie Tin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                        Availability Notice
                      </label>
                      <input
                        type="text"
                        value={currentProduct.availability}
                        onChange={(e) => handleUpdateProduct('availability', e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Editorial Description
                    </label>
                    <textarea
                      rows={3}
                      value={currentProduct.description}
                      onChange={(e) => handleUpdateProduct('description', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Founder's Note / Testing Story
                    </label>
                    <textarea
                      rows={2}
                      value={currentProduct.founderNote}
                      onChange={(e) => handleUpdateProduct('founderNote', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Cookie Photography Image URL or Upload
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentProduct.image}
                        onChange={(e) => handleUpdateProduct('image', e.target.value)}
                        className="flex-1 p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                      <label className="px-4 py-2.5 bg-[#EAE1CF] hover:bg-[#DDD2BE] text-[#6C1929] rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                handleUpdateProduct('image', ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Live Card Fit Preview */}
                    <div className="mt-3 p-3 bg-[#EAE1CF]/50 rounded-xl border border-[#6C1929]/15 flex items-center gap-4">
                      <div className="w-24 aspect-[4/3] rounded-lg overflow-hidden bg-[#2D0B12] shrink-0 border border-[#6C1929]/20 shadow-sm flex items-center justify-center">
                        <img
                          src={currentProduct.image}
                          alt={currentProduct.name}
                          className="w-full h-full object-cover object-center block"
                        />
                      </div>
                      <div className="text-xs text-[#6C1929] space-y-0.5">
                        <p className="font-bold flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Locked 4:3 Card Fit Preview</span>
                        </p>
                        <p className="text-[11px] text-[#6C1929]/70">
                          Fits into the card cleanly without zooming distortion. Card dimensions stay firmly locked.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-[#6C1929]/10 flex items-center justify-between">
                    <button
                      onClick={handleResetMenu}
                      className="text-xs text-[#6C1929]/70 hover:text-[#6C1929] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Menu Defaults</span>
                    </button>
                    <button
                      onClick={handleSaveMenu}
                      className="px-6 py-2.5 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Menu Offerings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOMER REVIEWS (REELS) */}
          {activeTab === 'reels' && (
            <div className="h-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Reels List Sidebar */}
              <div className="md:col-span-4 lg:col-span-3 border-r border-[#6C1929]/15 overflow-y-auto p-4 space-y-2 bg-[#F1EAD9]/40">
                <button
                  onClick={handleAddNewReel}
                  className="w-full py-2.5 px-3 mb-2 rounded-xl bg-[#6C1929] text-[#F5F0E5] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#53121F] transition-colors cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Reel</span>
                </button>

                {reels.map((reel) => (
                  <div
                    key={reel.id}
                    onClick={() => setSelectedReelId(reel.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedReelId === reel.id
                        ? 'bg-[#6C1929] text-[#F5F0E5] border-[#6C1929] shadow'
                        : 'bg-white text-[#6C1929] border-[#6C1929]/15 hover:border-[#6C1929]/40'
                    }`}
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative flex items-center justify-center">
                      {isInstagramUrl(reel.videoUrl || reel.instagramUrl) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white">
                          <Instagram className="w-4 h-4" />
                          <span className="text-[8px] font-bold uppercase mt-0.5">Reel</span>
                        </div>
                      ) : reel.videoUrl ? (
                        <video
                          src={reel.videoUrl}
                          muted
                          playsInline
                          className="w-full h-full object-cover pointer-events-none"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_REELS[0].videoUrl;
                          }}
                        />
                      ) : (
                        <Film className="w-5 h-5 text-white/70" />
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold truncate">{reel.name}</p>
                      <p className={`text-[10px] truncate ${selectedReelId === reel.id ? 'text-[#F5F0E5]/75' : 'text-[#6C1929]/65'}`}>
                        {reel.instagramUrl.replace('https://', '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reel Editor Area */}
              {currentReel && (
                <div className="md:col-span-8 lg:col-span-9 overflow-y-auto p-6 sm:p-8 space-y-5 bg-[#FAF7F0]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#6C1929]/15">
                    <div>
                      <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-2xl font-medium text-[#6C1929]">
                        Editing Reel: {currentReel.name}
                      </h3>
                      <p className="text-xs text-[#6C1929]/70 font-sans-clean">
                        ID: {currentReel.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteReel(currentReel.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Delete reel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Reel Title
                    </label>
                    <input
                      type="text"
                      value={currentReel.name}
                      onChange={(e) => handleUpdateReel('name', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Reviewer / Channel Name
                    </label>
                    <input
                      type="text"
                      value={currentReel.reviewer || ''}
                      onChange={(e) => handleUpdateReel('reviewer', e.target.value)}
                      placeholder="e.g. Devour Bombay"
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Review Quote / Caption
                    </label>
                    <input
                      type="text"
                      value={currentReel.quote || ''}
                      onChange={(e) => handleUpdateReel('quote', e.target.value)}
                      placeholder="e.g. “The molten Belgian chocolate core is completely insane.”"
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                    />
                  </div>

                  {/* Dedicated "Cover Video Instagram Link" field as requested */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929]">
                        Cover Video Instagram Link / Video File
                      </label>
                      <span className="text-[10px] text-[#6C1929]/70">
                        Plays in website reviews section
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentReel.videoUrl || currentReel.instagramUrl || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateReel("videoUrl", val);
                          if (isInstagramUrl(val)) {
                            handleUpdateReel("instagramUrl", val);
                          }
                        }}
                        placeholder="Paste video URL (.mp4) or Instagram reel link..."
                        className="flex-1 p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                      <label
                        className="px-3.5 py-2.5 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors shadow-sm"
                        title="Upload a video file (.mp4)"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Video (.mp4)</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const dataUrl = ev.target?.result as string;
                                if (dataUrl) {
                                  handleUpdateReel("videoUrl", dataUrl);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Explanatory helper box */}
                    <div className="mt-2 p-2.5 rounded-lg bg-[#6C1929]/5 border border-[#6C1929]/15 text-[11px] text-[#6C1929]/80 space-y-1">
                      <p className="font-medium text-[#6C1929]">
                        💡 Tip: Direct video files (.mp4) play automatically edge-to-edge.
                      </p>
                      <p className="text-[10px] leading-relaxed">
                        Instagram reel web pages (instagram.com/reel/...) restrict direct cross-domain video streaming in third-party browsers. To play your exact reel on the website card, tap <strong>Upload Video</strong> above to select the .mp4 file or choose a preset video below.
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-semibold text-[#6C1929]">Cookie Video Presets:</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateReel("videoUrl", "/videos/cookie_pull.mp4")}
                          className="px-2 py-0.5 rounded bg-white hover:bg-[#EAE1CF] text-[#6C1929] text-[10px] font-medium border border-[#6C1929]/20 cursor-pointer"
                        >
                          Cookie Pull (.mp4)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateReel("videoUrl", "/videos/cookie_unboxing.mp4")}
                          className="px-2 py-0.5 rounded bg-white hover:bg-[#EAE1CF] text-[#6C1929] text-[10px] font-medium border border-[#6C1929]/20 cursor-pointer"
                        >
                          Nutella Tin (.mp4)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateReel("videoUrl", "/videos/cookie_crumb.mp4")}
                          className="px-2 py-0.5 rounded bg-white hover:bg-[#EAE1CF] text-[#6C1929] text-[10px] font-medium border border-[#6C1929]/20 cursor-pointer"
                        >
                          NYC Crumb (.mp4)
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Optional Custom Cover Photo for Review Card */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Custom Review Card Image (Optional Poster)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentReel.poster || ''}
                        onChange={(e) => handleUpdateReel('poster', e.target.value)}
                        placeholder="Paste image link or upload photo..."
                        className="flex-1 p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                      <label className="px-3.5 py-2.5 bg-[#EAE1CF] hover:bg-[#DDD2BE] text-[#6C1929] rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                handleUpdateReel('poster', ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-[#6C1929]/10 flex items-center justify-between">
                    <button
                      onClick={handleResetReels}
                      className="text-xs text-[#6C1929]/70 hover:text-[#6C1929] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Reels Defaults</span>
                    </button>
                    <button
                      onClick={handleSaveReels}
                      className="px-6 py-2.5 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Customer Reviews</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FROM THE STACKD JOURNAL */}
          {activeTab === 'journal' && (
            <div className="h-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Journal Posts List Sidebar */}
              <div className="md:col-span-4 lg:col-span-3 border-r border-[#6C1929]/15 overflow-y-auto p-4 space-y-2 bg-[#F1EAD9]/40">
                <button
                  onClick={handleAddNewPost}
                  className="w-full py-2.5 px-3 mb-2 rounded-xl bg-[#6C1929] text-[#F5F0E5] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#53121F] transition-colors cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Journal Story</span>
                </button>

                {journalPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedPostId === post.id
                        ? 'bg-[#6C1929] text-[#F5F0E5] border-[#6C1929] shadow'
                        : 'bg-white text-[#6C1929] border-[#6C1929]/15 hover:border-[#6C1929]/40'
                    }`}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold truncate">{post.title}</p>
                      <p className={`text-[10px] truncate ${selectedPostId === post.id ? 'text-[#F5F0E5]/75' : 'text-[#6C1929]/65'}`}>
                        {post.date} · {post.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Journal Post Editor Area */}
              {currentPost && (
                <div className="md:col-span-8 lg:col-span-9 overflow-y-auto p-6 sm:p-8 space-y-5 bg-[#FAF7F0]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#6C1929]/15">
                    <div>
                      <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-2xl font-medium text-[#6C1929]">
                        Editing Article: {currentPost.title}
                      </h3>
                      <p className="text-xs text-[#6C1929]/70 font-sans-clean">
                        {currentPost.date} · {currentPost.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeletePost(currentPost.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                        Article Headline
                      </label>
                      <input
                        type="text"
                        value={currentPost.title}
                        onChange={(e) => handleUpdatePost('title', e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                        Publication Date
                      </label>
                      <input
                        type="text"
                        value={currentPost.date}
                        onChange={(e) => handleUpdatePost('date', e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Category Tag
                    </label>
                    <select
                      value={currentPost.category}
                      onChange={(e) => handleUpdatePost('category', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                    >
                      <option value="origins">Origins & Age 19</option>
                      <option value="recipes">100+ Trials & Baking Science</option>
                      <option value="milestones">Orders & Growth</option>
                      <option value="economics">The Economics & Quality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Short Excerpt / Hook
                    </label>
                    <textarea
                      rows={2}
                      value={currentPost.excerpt}
                      onChange={(e) => handleUpdatePost('excerpt', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Full Article Paragraphs (Each line becomes a paragraph)
                    </label>
                    <textarea
                      rows={6}
                      value={currentPost.content.join('\n\n')}
                      onChange={(e) =>
                        handleUpdatePost(
                          'content',
                          e.target.value.split('\n\n').filter((p) => p.trim().length > 0)
                        )
                      }
                      className="w-full p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6C1929] mb-1">
                      Hero Journal Image URL or Upload
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentPost.image}
                        onChange={(e) => handleUpdatePost('image', e.target.value)}
                        className="flex-1 p-2.5 rounded-lg border border-[#6C1929]/20 bg-white text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                      />
                      <label className="px-4 py-2.5 bg-[#EAE1CF] hover:bg-[#DDD2BE] text-[#6C1929] rounded-lg text-xs font-semibold cursor-pointer shrink-0">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                handleUpdatePost('image', ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-[#6C1929]/10 flex items-center justify-between">
                    <button
                      onClick={handleResetJournal}
                      className="text-xs text-[#6C1929]/70 hover:text-[#6C1929] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Journal Defaults</span>
                    </button>
                    <button
                      onClick={handleSaveJournal}
                      className="px-6 py-2.5 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Journal Stories</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WEBSITE PHOTOS & MEDIA */}
          {activeTab === 'photos' && (
            <div className="h-full overflow-y-auto p-6 sm:p-8 bg-[#FAF7F0] space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#6C1929]/15">
                <div>
                  <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-2xl font-medium text-[#6C1929]">
                    Website Photography & Media Manager
                  </h3>
                  <p className="text-xs text-[#6C1929]/70 font-sans-clean mt-0.5">
                    Upload or replace photography across website sections. All preview frames have locked dimensions so cards never shift and pictures fit cleanly without zooming distortion.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Founder Portrait Photo */}
                <div className="bg-white rounded-2xl border border-[#6C1929]/15 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider font-bold text-[#6C1929]">
                        Founder Portrait (About Bhavya)
                      </span>
                      <span className="text-[10px] text-[#6C1929]/65 font-mono">
                        4:5 Aspect Ratio
                      </span>
                    </div>

                    <div className="flex gap-4 items-start mb-4">
                      {/* Fixed card preview (locked 4:5) */}
                      <div className="w-28 aspect-[4/5] rounded-xl overflow-hidden bg-[#350A13] shrink-0 border border-[#6C1929]/20 shadow-md flex items-center justify-center">
                        {founderPhoto ? (
                          <img
                            src={founderPhoto}
                            alt="Founder preview"
                            className="w-full h-full object-cover object-center block"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-[#F5F0E5]/70 bg-gradient-to-b from-[#4A0E1B] to-[#2B0710]">
                            <span className="text-[10px] uppercase font-bold">Default Card</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#6C1929] mb-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={founderPhoto}
                            onChange={(e) => setFounderPhoto(e.target.value)}
                            placeholder="Paste image link or upload below..."
                            className="w-full p-2 rounded-lg border border-[#6C1929]/20 bg-[#FAF7F0] text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <label className="px-3.5 py-2 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setFounderPhoto(ev.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          {founderPhoto && (
                            <button
                              type="button"
                              onClick={() => setFounderPhoto('')}
                              className="px-3 py-2 border border-[#6C1929]/20 hover:bg-[#6C1929]/5 text-[#6C1929] rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6C1929]/70 pt-2 border-t border-[#6C1929]/10">
                    Displayed in the Founder Section on homepage. Card keeps exact 4:5 shape and fits cleanly without zooming.
                  </p>
                </div>

                {/* 2. Keepsake Cookie Tin Photo */}
                <div className="bg-white rounded-2xl border border-[#6C1929]/15 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider font-bold text-[#6C1929]">
                        Signature Loaded Cookie Tin
                      </span>
                      <span className="text-[10px] text-[#6C1929]/65 font-mono">
                        4:3 Aspect Ratio
                      </span>
                    </div>

                    <div className="flex gap-4 items-start mb-4">
                      {/* Fixed card preview (locked 4:3) */}
                      <div className="w-32 aspect-[4/3] rounded-xl overflow-hidden bg-[#1C0509] shrink-0 border border-[#6C1929]/20 shadow-md">
                        <img
                          src={tinPhoto}
                          alt="Tin preview"
                          className="w-full h-full object-cover object-center block"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#6C1929] mb-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={tinPhoto}
                            onChange={(e) => setTinPhoto(e.target.value)}
                            className="w-full p-2 rounded-lg border border-[#6C1929]/20 bg-[#FAF7F0] text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <label className="px-3.5 py-2 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setTinPhoto(ev.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
onClick={() => setTinPhoto(nutellaTinImage)}
className="px-3 py-2 border border-[#6C1929]/20 hover:bg-[#6C1929]/5 text-[#6C1929] rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Default
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6C1929]/70 pt-2 border-t border-[#6C1929]/10">
                    Displayed in the Keepsake Tin Story section. Fits edge-to-edge without zooming.
                  </p>
                </div>

                {/* 3. Artisanal Ingredients Feature Photo */}
                <div className="bg-white rounded-2xl border border-[#6C1929]/15 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider font-bold text-[#6C1929]">
                        Artisanal Ingredients Feature
                      </span>
                      <span className="text-[10px] text-[#6C1929]/65 font-mono">
                        16:10 Aspect Ratio
                      </span>
                    </div>

                    <div className="flex gap-4 items-start mb-4">
                      {/* Fixed card preview (locked 16:10) */}
                      <div className="w-32 aspect-[16/10] rounded-xl overflow-hidden bg-[#170508] shrink-0 border border-[#6C1929]/20 shadow-md">
                        <img
                          src={ingredientsPhoto}
                          alt="Ingredients preview"
                          className="w-full h-full object-cover object-center block"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#6C1929] mb-1">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={ingredientsPhoto}
                            onChange={(e) => setIngredientsPhoto(e.target.value)}
                            className="w-full p-2 rounded-lg border border-[#6C1929]/20 bg-[#FAF7F0] text-xs text-[#6C1929] focus:outline-none focus:ring-1 focus:ring-[#6C1929]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <label className="px-3.5 py-2 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setIngredientsPhoto(ev.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
onClick={() => setIngredientsPhoto(ingredientsImage)}
className="px-3 py-2 border border-[#6C1929]/20 hover:bg-[#6C1929]/5 text-[#6C1929] rounded-lg text-xs font-semibold cursor-pointer"
>
  Default
</button>
</div>
</div>
</div>
</div>
                  <p className="text-[11px] text-[#6C1929]/70 pt-2 border-t border-[#6C1929]/10">
                    Displayed in the Philosophy of Flavour section showing butter and couverture chocolate.
                  </p>
                </div>
              </div>

              {/* Action Bar for Photos */}
              <div className="pt-6 border-t border-[#6C1929]/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetPhotos}
                  className="text-xs text-[#6C1929]/70 hover:text-[#6C1929] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Website Photos</span>
                </button>
                <button
                  type="button"
                  onClick={handleSavePhotos}
                  className="px-6 py-2.5 bg-[#6C1929] hover:bg-[#52111E] text-[#F5F0E5] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Website Photos</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
};
