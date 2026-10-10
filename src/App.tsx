import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FounderSection } from './components/FounderSection';
import { ScrapbookSection } from './components/ScrapbookSection';
import { IngredientsFeature } from './components/IngredientsFeature';
import { CookieCollection } from './components/CookieCollection';
import { TransparentCookieStory } from './components/TransparentCookieStory';
import { MenuSection } from './components/MenuSection';
import { CookieTinStory } from './components/CookieTinStory';
import { ReelWallSection } from './components/ReelWallSection';
import { MilestonesSection } from './components/MilestonesSection';
import { FounderJournal } from './components/FounderJournal';
import { ContactSection } from './components/ContactSection';
import { OrderDrawer } from './components/OrderDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { AdminPortalModal } from './components/AdminPortalModal';
import { Product } from './data/products';

export default function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenOrder = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
    }
    setIsOrderOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E5] text-[#2D0B12] selection:bg-[#6C1929] selection:text-[#F5F0E5]">

      {/* 25. Sticky Top Navigation */}
      <Navbar onOpenOrder={() => handleOpenOrder()} cartCount={0} />

      <main>
        {/* 1. Cinematic Hero Section */}
        <HeroSection onOpenOrder={() => handleOpenOrder()} />

        {/* 2. Founder / About Bhavya */}
        <FounderSection />

        {/* 3. The Story Behind Stackd / Scrapbook */}
        <ScrapbookSection />

        {/* 3b. Premium Ingredients Story */}
        <IngredientsFeature />

        {/* 4. Moving Cookie Collection with Packaging Sleeve Hover Effect */}
        <CookieCollection
          onSelectProduct={(prod) => handleOpenOrder(prod)}
          onOpenOrder={() => handleOpenOrder()}
        />

        {/* 5. Cinematic Transparent Cookie Story Section */}
        <TransparentCookieStory />

        {/* 6. Full Mumbai Menu */}
        <MenuSection
          onSelectProduct={(prod) => handleOpenOrder(prod)}
          onOpenOrder={() => handleOpenOrder()}
        />

        {/* 6b. Cookie Tin Keepsake Evolution Story */}
        <CookieTinStory onOpenOrder={() => handleOpenOrder()} />

        {/* 7. Customer Reviews / Vertical Reel Wall */}
        <ReelWallSection />

        {/* 7b. Founder Milestones & Social Proof */}
        <MilestonesSection />

        {/* 8. 20 & 21. Founder Blog / Journal (All 20 Chronological Stories) */}
        <FounderJournal />

        {/* 9. 23. Contact / Order Final CTA */}
        <ContactSection onOpenOrder={() => handleOpenOrder()} />
      </main>

      {/* 35. Burgundy Editorial Footer */}
      <Footer
        onOpenOrder={() => handleOpenOrder()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Portal Modal (Menu, Reels, Journal) */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Interactive 24hr Pre-Order Drawer */}
      <OrderDrawer
        isOpen={isOrderOpen}
        onClose={handleCloseOrder}
        selectedProduct={selectedProduct}
      />

      {/* 24. Floating WhatsApp Button */}
      <FloatingWhatsApp onOpenOrder={() => handleOpenOrder()} />
    </div>
  );
}
