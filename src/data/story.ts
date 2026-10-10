export interface ScrapbookCard {
  id: string;
  tag: string;
  headline: string;
  subhead: string;
  body: string;
  takeaway: string;
  rotation: string;
  tapePosition: 'top' | 'corner' | 'both';
  stickerText?: string;
}

export const SCRAPBOOK_CARDS: ScrapbookCard[] = [
  {
    id: 'scrapbook-1',
    tag: 'Note 01 / Age 19',
    headline: 'Things i learnt',
    subhead: 'While Building A Cookie Brand At 19',
    body: 'I started Stackd between college lectures, assignment submission deadlines, and campus presentations. Every spare hour between 7 AM classes and midnight study sessions went straight into the kitchen in Worli, testing dough hydration, oven hot-spots, and butter emulsification.',
    takeaway: 'Building something real is messy, tiring, and the most rewarding feeling in the world.',
    rotation: '-rotate-2',
    tapePosition: 'top',
    stickerText: 'Worli, Mumbai · Batch #01'
  },
  {
    id: 'scrapbook-2',
    tag: 'Note 02 / Recipes',
    headline: 'Good Ingredients',
    subhead: 'Are Expensive',
    body: 'I spent more than ₹9,000 simply testing recipes before launch. Over 100 trial cookies for the Holy Trinity alone. I rejected batch after batch because they spread too flat, or were overly sweet, or didn’t hold a molten core.',
    takeaway: 'I could make a cheaper cookie. But I refused to make an average cookie.',
    rotation: 'rotate-1',
    tapePosition: 'corner',
    stickerText: '₹9,000+ in Trial Bakes'
  },
  {
    id: 'scrapbook-3',
    tag: 'Note 03 / The Reality',
    headline: 'I thought I was starting',
    subhead: 'A Cookie Brand',
    body: 'Turns out, making cookies is only 20% of the job. In three months I had to teach myself professional food photography, video editing, sticker designing, cardboard tin sourcing, inventory forecasting, WhatsApp CRM, and delivery logistics across Mumbai traffic.',
    takeaway: 'You don’t just become a baker. You become every department at once.',
    rotation: '-rotate-1',
    tapePosition: 'top',
    stickerText: 'Self-Taught Everything'
  },
  {
    id: 'scrapbook-4',
    tag: 'Note 04 / Packaging',
    headline: 'people eat with',
    subhead: 'Their Eyes First',
    body: 'A loaded cookie shouldn’t arrive squashed in a flimsy plastic box. That is why we invested in heavy deep-drawn tins, custom burgundy tissue wraps, and wax-sealed note cards. The moment you unbox Stackd in your living room sets the stage for the first bite.',
    takeaway: 'Branding is not decoration. It is respect for the food.',
    rotation: 'rotate-2',
    tapePosition: 'both',
    stickerText: 'Deep-Drawn Tins'
  }
];

export interface Milestone {
  number: string;
  label: string;
  detail: string;
}

export const MILESTONES: Milestone[] = [
  {
    number: '100+',
    label: 'Recipe Trials Before Launch',
    detail: 'Over ₹9,000 invested solely in ingredient testing to engineer the ultimate eggless crumb.'
  },
  {
    number: '90+',
    label: 'Orders in First 3 Months',
    detail: 'Fulfilled by Bhavya alongside full-time college classes and exam submissions.'
  },
  {
    number: '8x',
    label: 'Repeat Orders from One Customer',
    detail: 'A single Mumbai cookie lover placed 8 distinct orders in just 60 days.'
  },
  {
    number: '25+',
    label: 'Signature Tins Gifted',
    detail: 'Ordered as birthday celebrations and surprise care packages across Mumbai.'
  }
];

export interface CustomerReel {
  id: string;
  name: string;
  location: string;
  quote: string;
  productTried: string;
  handle: string;
  timeAgo: string;
  tags: string[];
}

export const REELS: CustomerReel[] = [
  {
    id: 'reel-1',
    name: 'Ananya S.',
    location: 'Bandra West, Mumbai',
    quote: 'The way the molten dark chocolate pulls apart... hands down the thickest eggless cookie I have had in Bombay.',
    productTried: 'The Holy Trinity & Nutella Tin',
    handle: '@ananya_bites',
    timeAgo: '2 days ago',
    tags: ['#EgglessMumbai', '#LoadedTin']
  },
  {
    id: 'reel-2',
    name: 'Karan M.',
    location: 'Lower Parel, Mumbai',
    quote: 'Ordered the Nutella cookie tin for my sister’s birthday. Bhavya was so kind on WhatsApp and the packaging is literally luxury bakery level.',
    productTried: 'Nutella Cookie Tin',
    handle: '@karanmumbai',
    timeAgo: '1 week ago',
    tags: ['#BirthdayGift', '#WorliBakes']
  },
  {
    id: 'reel-3',
    name: 'Rhea D.',
    location: 'Juhu, Mumbai',
    quote: 'A customer once waited 45 mins rather than cancelling when delivery got delayed. Now I get why. You CANNOT rush this kind of freshness.',
    productTried: 'Love Child & Red Velvet Oreo',
    handle: '@rheadesigns',
    timeAgo: '2 weeks ago',
    tags: ['#WorthTheWait', '#BelgianCouverture']
  },
  {
    id: 'reel-4',
    name: 'Dev K.',
    location: 'Worli, Mumbai',
    quote: 'The Red Velvet Oreo has this soft, velvety centre with white chocolate oozing out. 10/10 crumb structure.',
    productTried: 'Red Velvet Oreo Cookie',
    handle: '@dev.worli',
    timeAgo: '3 weeks ago',
    tags: ['#RedVelvetOreo', '#LocalBakes']
  }
];
