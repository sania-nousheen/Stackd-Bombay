export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'cookie' | 'tin';
  description: string;
  availability: '24hr Pre-Order' | 'Available Daily' | 'Limited Batch';
  price?: string; // Optional: As per founder journal, ₹250 for single cookie & ₹1,200 for signature tin
  founderNote?: string;
  trialCount?: string;
  ingredientsHighlight: string[];
  ingredients?: string[];
  texture: string;
  image: string;
  badge?: string;
  orderLink?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'holy-trinity',
    name: 'THE HOLY TRINITY',
    tagline: 'Triple Couverture Chocolate Chunk',
    category: 'cookie',
    availability: '24hr Pre-Order',
    price: '₹250',
    description: 'Our triple chocolate cookie loaded with dark, milk & white chocolate.',
    founderNote: 'This is the signature cookie Bhavya spent over 100 trials developing to achieve the impossible: crispy golden edges, a soft pillowy centre, and pools of melted Belgian couverture in every single bite.',
    trialCount: '100+ recipe trials',
    ingredientsHighlight: ['3 Types of Belgian Couverture', 'French Président Butter', 'Flaky Sea Salt'],
    ingredients: ['Belgian Dark Couverture (Callebaut)', 'Belgian Milk Couverture', 'Belgian White Couverture', 'French Président Butter', 'Unrefined Brown Sugar', 'Organic Flour', 'Flaky Sea Salt'],
    texture: 'Crispy edges · Soft centre · Melted chocolate pools',
    image: '/src/assets/images/cookie_holy_trinity_1791484027979.jpg',
    badge: 'Signature Obsession'
  },
  {
    id: 'love-child',
    name: 'LOVE CHILD',
    tagline: 'Signature Dark Chocolate Chip',
    category: 'cookie',
    availability: '24hr Pre-Order',
    price: '₹250',
    description: 'A dark chocolate chip cookie with crisp edges, a soft centre and plenty of chocolate in every bite.',
    founderNote: 'Pure, uncompromising New York-style chunky dough made 100% eggless without losing an ounce of moisture, chew, or richness.',
    ingredientsHighlight: ['Belgian Dark Couverture', 'French Président Butter', 'Madagascar Vanilla'],
    ingredients: ['Dark Couverture Chocolate', 'French Butter', 'Brown Sugar', 'Pure Vanilla'],
    texture: 'Deep cocoa crumb · Gooey centre · Golden ring',
    image: '/src/assets/images/hero_cookie_macro_1791484018264.jpg',
    badge: 'NYC Style'
  },
  {
    id: 'dark-chocolate-nutella',
    name: 'DARK CHOCOLATE NUTELLA',
    tagline: 'Molten Nutella Stuffed Dark Cookie',
    category: 'cookie',
    availability: '24hr Pre-Order',
    price: '₹250',
    description: 'A dark chocolate cookie with a gooey Nutella centre.',
    founderNote: 'Each cookie is hand-stuffed with a frozen heart of pure hazelnut spread that turns into a warm molten lava core when baked.',
    ingredientsHighlight: ['Pure Nutella Core', 'Dutch Cocoa Dough', 'French Butter Crumb'],
    ingredients: ['Pure Nutella', 'Dutch Process Cocoa', 'Belgian Chocolate', 'French Butter'],
    texture: 'Crisp cocoa exterior · Warm molten core',
    image: '/src/assets/images/cookie_nutella_tin_1791484044384.jpg',
    badge: 'Molten Core'
  },
  {
    id: 'nutella-cookie-tin',
    name: 'NUTELLA COOKIE TIN',
    tagline: "Mumbai's Most Loaded Nutella Tin",
    category: 'tin',
    availability: '24hr Pre-Order',
    price: '₹1,200',
    description: 'A cookie tin built around the Nutella cookie. Packed generously for sharing (or not).',
    founderNote: 'Bhavya originally started with smaller 250g tins, but upgraded to this generous deep-drawn keepsake tin. Mumbai customers fell in love with having a full loaded tin on their kitchen counter.',
    ingredientsHighlight: ['Freshly Baked Nutella Cookies', 'Airtight Keepsake Tin', 'Bespoke Wax Paper Wrap'],
    ingredients: ['Loaded Nutella Stuffed Cookies', 'French Butter Dough', 'Airtight Keepsake Tin'],
    texture: 'Layers of warm, loaded cookies in an airtight tin',
    image: '/src/assets/images/cookie_nutella_tin_1791484044384.jpg',
    badge: 'Bestselling Tin'
  },
  {
    id: 'kinder-bueno-tin',
    name: 'KINDER BUENO TIN',
    tagline: 'Hazelnut Wafer Cream Infused Tin',
    category: 'tin',
    availability: '24hr Pre-Order',
    price: '₹1,200',
    description: 'A cookie tin featuring Kinder Bueno-inspired cookies.',
    founderNote: 'Loaded with creamy hazelnut spread, white chocolate chunks, and crispy wafer crunch baked into heavy New York cookies.',
    ingredientsHighlight: ['Kinder Bueno Cream', 'Crisp Wafer Inclusions', 'White Belgian Couverture'],
    ingredients: ['Roasted Hazelnut Cream', 'Crushed Crispy Wafers', 'White Belgian Couverture', 'French Butter'],
    texture: 'Crispy wafer contrast · Silky hazelnut cream',
    image: '/src/assets/images/hero_cookie_macro_1791484018264.jpg',
    badge: 'Collector Tin'
  },
  {
    id: 'kinder-bueno-cookie',
    name: 'KINDER BUENO COOKIE',
    tagline: 'Individual Chunky Kinder Stuffed',
    category: 'cookie',
    availability: '24hr Pre-Order',
    price: '₹250',
    description: 'Individual cookie loaded with hazelnut wafer cream and melted Belgian chocolate.',
    founderNote: 'A childhood favourite elevated with French butter and roasted hazelnut praline notes.',
    ingredientsHighlight: ['Italian Hazelnut Cream', 'Crushed Wafer', 'French Butter'],
    ingredients: ['Italian Hazelnut Spread', 'Milk & White Couverture', 'French Butter'],
    texture: 'Chewy cookie dough · Wafer crunch · Cream centre',
    image: '/src/assets/images/cookie_holy_trinity_1791484027979.jpg',
    badge: 'Fan Favourite'
  },
  {
    id: 'red-velvet-oreo',
    name: 'RED VELVET OREO COOKIE',
    tagline: 'Molten White Chocolate & Oreo Chunks',
    category: 'cookie',
    availability: '24hr Pre-Order',
    price: '₹250',
    description: 'Red velvet cookie with a gooey white chocolate centre, Oreo chunks and white chocolate chunks.',
    founderNote: 'Bhavya rejected more than 10 test versions before approving this exact recipe—ensuring the buttermilk tang and cocoa notes shine through without being overly sweet.',
    trialCount: '10+ rejected batches',
    ingredientsHighlight: ['Gooey White Couverture Core', 'Hand-crushed Oreo Chunks', 'Dutch Cocoa'],
    ingredients: ['Dutch Cocoa Red Velvet Crumb', 'White Chocolate Core', 'Oreo Biscuit Chunks', 'French Butter'],
    texture: 'Velvety red crumb · Molten white chocolate · Oreo crunch',
    image: '/src/assets/images/cookie_holy_trinity_1791484027979.jpg',
    badge: '10+ Recipe Trials'
  },
  {
    id: 'half-and-half-tin',
    name: 'HALF & HALF COOKIE TIN',
    tagline: 'Signature Nutella & Kinder Split Tin',
    category: 'tin',
    availability: '24hr Pre-Order',
    price: '₹1,200',
    description: 'Showcase signature cookie tin option featuring our two most obsessed-over loaded recipes.',
    founderNote: 'Created when customers couldn’t pick between Dark Nutella and Kinder Bueno. The ultimate gift tin in Mumbai.',
    ingredientsHighlight: ['Nutella Molten Cookies', 'Kinder Bueno Cookies', 'Premium Stackd Tin'],
    ingredients: ['Nutella Molten Cookies', 'Kinder Bueno Hazelnut Cookies', 'Keepsake Metal Tin'],
    texture: 'The complete dual-flavour loaded experience',
    image: '/src/assets/images/cookie_nutella_tin_1791484044384.jpg',
    badge: 'Signature Dual Tin'
  }
];
