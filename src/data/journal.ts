import holyTrinityImage from '../assets/images/cookie_holy_trinity_1791484027979.jpg';
import nutellaTinImage from '../assets/images/cookie_nutella_tin_1791484044384.jpg';
import heroCookieImage from '../assets/images/hero_cookie_macro_1791484018264.jpg';
import ingredientsImage from '../assets/images/ingredients_couverture_butter_1791484056180.jpg';

export interface JournalPost {
  id: string;
  date: string;
  rawDate: string;
  title: string;
  category: 'origins' | 'recipes' | 'ingredients' | 'milestones' | 'economics';
  excerpt: string;
  image: string;
  readTime: string;
  content: string[];
  keyHighlight?: string;
}

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: 'post-1',
    date: '26 MAY 2026',
    rawDate: '2026-05-26',
    title: 'I Spent ₹9,000 Testing Cookies Before Launching Stackd',
    category: 'origins',
    excerpt: 'As a first-year student, my life revolved around testing recipes and starting over. After months of failed batches, I finally made a cookie worth obsessing over.',
    image: heroCookieImage,
    readTime: '3 min read',
    keyHighlight: '₹9,000+ invested solely in recipe trials before launch.',
    content: [
      'Hi, I’m Bhavya. I’m 19, a college student in Mumbai, and for the past several months, my entire life has revolved around cookie dough, oven temperatures, and butterfat percentages.',
      'Before officially announcing Stackd, I spent more than ₹9,000 simply testing recipes. In college, that felt like an enormous amount of money to pour into flour, butter, and chocolate that often ended up in the bin.',
      'As a first-year student balancing classes, presentations, and submissions, I spent almost every evening testing recipes, adjusting moisture levels, failing, and starting completely over. Without eggs, getting that New York-style chunky chew without making a cakey or dry biscuit was a relentless puzzle.',
      'After countless failed trials, late-night bakes, and recipe tweaks, I finally pulled a tray from the oven that made me stop. Golden crisp perimeter, soft gooey centre, and melted chocolate rivers. Mumbai was our launch market, and Stackd was officially born.'
    ]
  },
  {
    id: 'post-2',
    date: '29 MAY 2026',
    rawDate: '2026-05-29',
    title: 'The Holy Trinity: 100+ Cookies Later',
    category: 'recipes',
    excerpt: 'Everyone claims their chocolate chip cookie is the best. I wanted Stackd’s version to be unmistakable. It took over 100 test bakes to arrive at three distinct couvertures.',
    image: holyTrinityImage,
    readTime: '4 min read',
    keyHighlight: 'Tested over 100 cookies to create our signature chocolate chip.',
    content: [
      'Everyone in the bakery world claims their chocolate chip cookie is the best. I knew if Stackd was going to stand out in Mumbai, our version couldn’t be basic, overly sweet, or like anything you could buy in a commercial bakery box.',
      'I tested more than 100 cookies for this single recipe alone. I tested resting the dough for 12 hours versus 36 hours. I tested brown sugars with different molasses depths. I tested different baking temperatures to get that elusive contrast: crispy golden edges, a soft pillowy centre, and molten chocolate in every bite.',
      'The final recipe is what we call The Holy Trinity: loaded with three different kinds of Belgian couverture chocolate—dark, milk, and white. Each melts at a slightly different rate, creating a layered chocolate experience in every mouthful.'
    ]
  },
  {
    id: 'post-3',
    date: '3 JUNE 2026',
    rawDate: '2026-06-03',
    title: "Why Our Cookie Doesn't Cost ₹50",
    category: 'ingredients',
    excerpt: 'We deliberately choose imported French Président butter and Belgian couverture chocolate over palm-oil compound fats. Here is what quality actually costs.',
    image: ingredientsImage,
    readTime: '3 min read',
    keyHighlight: 'Pure cocoa butter vs vegetable fat systems.',
    content: [
      'People often ask why artisanal cookies in Mumbai can’t be priced at ₹50 like commercial bakery biscuits. The answer lives entirely in the ingredient list.',
      'We use imported French Président butter—slow-churned European lactic butter with a high butterfat ratio that gives our cookies their signature caramelized edges and rich aroma without feeling greasy.',
      'More importantly, we use imported Belgian couverture chocolate rather than cheaper compound chocolate. Couverture chocolate contains authentic cocoa butter, which melts smoothly at body temperature. Compound chocolate, by contrast, relies on alternative fat systems and can often contain palm oil. That difference in melting point and mouthfeel is everything. Quality ingredients cost more, and we refuse to cut corners.'
    ]
  },
  {
    id: 'post-4',
    date: '9 JUNE 2026',
    rawDate: '2026-06-09',
    title: '92 Followers, One Very Big Dream',
    category: 'origins',
    excerpt: 'I had 92 followers on Instagram and a goal of building India’s next beloved cookie brand at 19. It sounded crazy until the first repeat orders arrived.',
    image: heroCookieImage,
    readTime: '3 min read',
    keyHighlight: 'From 92 followers in Worli to returning customers.',
    content: [
      'When I launched the Stackd Bombay Instagram page, I had 92 followers. Mostly friends, family, and classmates from college.',
      'My dream was to build India’s next big cookie brand. At 19, juggling assignments and carrying sacks of flour up to our kitchen in Worli, that goal sounded absurd to almost everyone around me.',
      'People told me Mumbai had enough bakeries. But I knew that very few places were offering genuinely loaded, chunky, 100% eggless New York cookies baked fresh to order. And then something incredible happened: strangers started ordering. And even better, they started coming back.'
    ]
  },
  {
    id: 'post-5',
    date: '16 JUNE 2026',
    rawDate: '2026-06-16',
    title: 'The First Order',
    category: 'milestones',
    excerpt: 'I checked the payment notification three times because I couldn’t believe it. For months my biggest fear was that nobody would order.',
    image: holyTrinityImage,
    readTime: '3 min read',
    keyHighlight: 'The moment a complete stranger trusted a 19-year-old’s bake.',
    content: [
      'For months before launch, my recurring nightmare was that I would prepare all the dough, buy the packaging, set up the Instagram page, and hear absolute silence.',
      'Then the first pre-order notification chimed on my phone. I checked the screen three times. I checked the banking app. Someone I had never met in my life had trusted me enough to order a batch of Stackd cookies.',
      'I hand-packed the box with trembling hands, placed the custom wax paper, sealed the tin, and sent it out. Then another order arrived. Then another. Pre-orders were officially live.'
    ]
  },
  {
    id: 'post-6',
    date: '26 JUNE 2026',
    rawDate: '2026-06-26',
    title: 'The Customer Who Was Willing to Wait',
    category: 'milestones',
    excerpt: 'A customer needed a Nutella tin within 30 minutes. We couldn’t rush the bake. Instead of cancelling, he chose to wait an hour for a fresh batch.',
    image: nutellaTinImage,
    readTime: '3 min read',
    keyHighlight: 'Patience over instant convenience for fresh baking.',
    content: [
      'In a city obsessed with 10-minute grocery delivery, artisanal baking runs on a completely different rhythm.',
      'A customer messaged asking for a Nutella cookie tin delivered within 30 minutes. Because our cookies are baked fresh to order from chilled dough and take time to bake, cool, and pack, I explained that it would take at least an hour.',
      'I fully expected him to cancel and order from a generic dessert brand on a food app. Instead, he replied: "Take your time. I want it fresh, I’ll wait." For a one-month-old brand run by a teenager, having someone value quality over instant gratification meant the world to me.'
    ]
  },
  {
    id: 'post-7',
    date: '28 JUNE 2026',
    rawDate: '2026-06-28',
    title: '30 Cookies In — And People Were Coming Back',
    category: 'milestones',
    excerpt: 'Stackd crossed 30 cookies sold since launch. But the real validation wasn’t the number; it was seeing the same names pop up in my DMs.',
    image: heroCookieImage,
    readTime: '2 min read',
    keyHighlight: 'The shift from novelty purchases to repeat lovers.',
    content: [
      'We crossed 30 cookies sold since our quiet launch. While 30 might sound modest to a large commercial chain, for a student baking from home in South Bombay, each cookie was a personal test.',
      'I had spent weeks obsessing over crumb hydration, packaging seals, and delivery transit across Mumbai heat. The truly exciting moment was when the same customers who ordered during week one messaged again in week two: "Hey Bhavya, can we pre-order two more boxes for the weekend?" That repeat trust was the real milestone.'
    ]
  },
  {
    id: 'post-8',
    date: '30 JUNE 2026',
    rawDate: '2026-06-30',
    title: '10+ Versions Later: The Red Velvet Oreo Cookie',
    category: 'recipes',
    excerpt: 'Some spread too much, some were cloyingly sweet, some didn’t taste like red velvet. I almost gave up on this recipe before hitting perfection.',
    image: holyTrinityImage,
    readTime: '3 min read',
    keyHighlight: 'Rejected over 10 test versions of Red Velvet Oreo.',
    content: [
      'Red Velvet is one of the easiest cookies to mess up. Too often, bakeries just add red food dye to plain dough with sugar. I wanted genuine cocoa depth, buttermilk tang, and a rich velvety texture.',
      'I rejected more than 10 full test versions. Batch 3 spread paper-thin. Batch 6 was so sweet that the Oreo flavor was completely drowned out. Batch 8 felt dry. At one point, I thought the recipe would simply never make the Stackd menu.',
      'And then, on trial 11, the proportions locked in: rich cocoa red velvet dough, hand-crushed Oreo chunks, white chocolate chunks, and a gooey molten white chocolate centre. It has become one of our most requested items.'
    ]
  },
  {
    id: 'post-9',
    date: '2 JULY 2026',
    rawDate: '2026-07-02',
    title: 'The Dream Started Two Years Ago',
    category: 'origins',
    excerpt: 'Stackd did not happen overnight. My family and I had been testing concepts and recipes for two years before finding the courage to launch.',
    image: heroCookieImage,
    readTime: '3 min read',
    keyHighlight: 'Two years of family experimentation before launch.',
    content: [
      'People looking at our Instagram page might think Stackd started one month ago. The truth is, my family and I have been chasing this dream for nearly two years.',
      'We tested different bakery concepts. We tried different formats. Many ideas didn’t work out, and there were times when pausing felt like the sensible thing to do.',
      'But baking remained the constant. When I turned 19, I made a commitment to myself: I was going to focus on one thing and do it with uncompromising quality—the thickest, most loaded eggless cookies in Mumbai. This time, I was determined to get it right.'
    ]
  },
  {
    id: 'post-10',
    date: '7 JULY 2026',
    rawDate: '2026-07-07',
    title: 'Why One Stackd Cookie Costs ₹250',
    category: 'economics',
    excerpt: 'Callebaut couverture chocolate is expensive. French butter is expensive. We don’t use premixes or cheap compound slabs. Here is the honest math.',
    image: ingredientsImage,
    readTime: '4 min read',
    keyHighlight: 'No premixes, no shortcuts, pure Callebaut & French butter.',
    content: [
      'I believe in total transparency. When people ask why a single Stackd cookie is priced at ₹250, I walk them through what is actually inside.',
      'We don’t use commercial cookie premix powders. We don’t buy bulk industrial margarine. We use Callebaut Belgian couverture callets and genuine French Président butter.',
      'When you bite into a Stackd cookie, you are eating pure cocoa butter, imported dairy, and dough that has rested for 24 hours. Not everyone will care about the nuance between compound chocolate and couverture, and that is completely okay. But for the people who do care, Stackd was built specifically for you.'
    ]
  },
  {
    id: 'post-11',
    date: '17 JULY 2026',
    rawDate: '2026-07-17',
    title: 'Why Your Cookie Order Starts 24 Hours Before You Eat It',
    category: 'recipes',
    excerpt: 'Our dough rests overnight in refrigeration to allow starches to hydrate and caramelized flavours to develop. Fresh baking can’t be rushed.',
    image: holyTrinityImage,
    readTime: '3 min read',
    keyHighlight: '24-hour dough maturation for complex flavor and texture.',
    content: [
      'People wonder why we enforce a strict 24-hour pre-order window instead of instant on-demand delivery.',
      'The secret to a chunky New York cookie is the cold rest. When you let dough rest refrigerated for 24 hours, the flour fully hydrates, the fats solidify, and the natural enzymes break down starches into rich caramelized sugars.',
      'Once your pre-order comes in, your cookies are baked fresh that morning, packed carefully into airtight tins or wax-lined boxes, and dispatched across Mumbai. Waiting for the customer’s review message after delivery is still the most nerve-wracking, thrilling part of my day.'
    ]
  },
  {
    id: 'post-12',
    date: '18 JULY 2026',
    rawDate: '2026-07-18',
    title: "You Don't Need Eggs to Make a Dessert That Slaps",
    category: 'recipes',
    excerpt: 'I never wanted "eggless" to be an excuse for a dry or flat cookie. I wanted customers to fall in love with the taste first, then realise it was egg-free.',
    image: heroCookieImage,
    readTime: '3 min read',
    keyHighlight: 'Eggless as a standard of decadence, not a compromise.',
    content: [
      'In Mumbai, so many eggless desserts feel like an afterthought—dry, overly crumbly, or lacking that unctuous chew that eggs provide.',
      'From day one, my goal was clear: I didn’t want "eggless" to be our only selling proposition. I wanted someone to take a bite, close their eyes, experience the molten chocolate pools and chewy centre, and say, "This is the best cookie I’ve had." Only then would they discover that it’s 100% eggless.',
      'Through precise moisture balancing and European butter, we proved that eggless baking can surpass traditional recipes in richness and indulgence.'
    ]
  },
  {
    id: 'post-13',
    date: '21 JULY 2026',
    rawDate: '2026-07-21',
    title: 'Building Stackd Between Classes',
    category: 'origins',
    excerpt: 'Assignments due at midnight, accounting lectures at 8 AM, and dough testing in between. A look into what being a 19-year-old student founder actually looks like.',
    image: heroCookieImage,
    readTime: '4 min read',
    keyHighlight: 'Juggling college assignments, exams, and 4 AM bakes.',
    content: [
      'My days right now are a whirlwind. I’m juggling college assignments, lecture attendance, group presentations, and running an emerging food brand.',
      'There are days when I’m studying macroeconomics on my phone while monitoring the oven timer in our kitchen in Worli. When I first launched, I had no idea whether people outside my immediate circle would actually buy.',
      'They did. Orders are growing, tins are being sent across the city, and even when I’m exhausted, I know we’re only getting started.'
    ]
  },
  {
    id: 'post-14',
    date: '25 JULY 2026',
    rawDate: '2026-07-25',
    title: 'The Birthday Gift That Made Me Stop Overthinking',
    category: 'milestones',
    excerpt: 'A customer ordered a cookie tin as a surprise birthday gift for her brother. I was terrified of letting them down. Her message changed my confidence forever.',
    image: nutellaTinImage,
    readTime: '3 min read',
    keyHighlight: 'When a customer called our tin "even better than the photos".',
    content: [
      'When an order came in for a birthday gift from a sister to her brother, imposter syndrome hit me hard. What if the courier jostled the tin? What if the cookies arrived cold? What if the molten centre wasn’t gooey enough?',
      'I double-wrapped the tin with extra wax paper and wrote a handwritten note. That evening, the sister messaged me back: "Bhavya, he was blown away. It looked exactly like your Instagram photos, but tasted even better."',
      'Reading that message was a turning point. It made me realise that all the hours spent obsessing over details were worth it.'
    ]
  },
  {
    id: 'post-15',
    date: '4 AUGUST 2026',
    rawDate: '2026-08-04',
    title: 'One Customer Ordered 8 Times',
    category: 'milestones',
    excerpt: 'A single Mumbai cookie lover placed 8 distinct orders in just 60 days. If someone trusts you 8 times, the 9th batch needs to be flawless.',
    image: holyTrinityImage,
    readTime: '3 min read',
    keyHighlight: '8 repeat orders from one customer in two months.',
    content: [
      'Anyone can sell a cookie once through flashy marketing. The real test of an artisan brand is whether people crave it a second, third, or eighth time.',
      'Within two months of launching, one customer in Mumbai placed more than eight separate orders. She ordered tins for herself, boxes for her family, and cookies for her colleagues.',
      'I built Stackd specifically to be the kind of treat people return to. When someone trusts your brand that deeply, you cannot get complacent. The ninth batch has to be just as fresh, loaded, and decadent as the first.'
    ]
  },
  {
    id: 'post-16',
    date: '14 AUGUST 2026',
    rawDate: '2026-08-14',
    title: "I Could Make Them Cheaper. I Don't Want To.",
    category: 'ingredients',
    excerpt: 'I could switch to margarine and compound chocolate to triple our margins. But selling an average cookie is not why I started Stackd.',
    image: ingredientsImage,
    readTime: '3 min read',
    keyHighlight: 'Refusing to compromise for higher margins.',
    content: [
      'Every advisor will tell a young founder: cut your ingredient costs, switch to cheaper fats, use compound chocolate, and boost your margins.',
      'I could easily make our cookies cheaper. I could use bulk industrial margarine instead of French Président butter. I could use cheap chocolate chips loaded with hydrogenated oils.',
      'But I don’t want to. I started Stackd because I wanted to create something I am genuinely proud to serve. Competing on being the cheapest cookie in Mumbai is a race to the bottom. We choose to compete on quality.'
    ]
  },
  {
    id: 'post-17',
    date: '17 AUGUST 2026',
    rawDate: '2026-08-17',
    title: '25+ Cookie Tins',
    category: 'milestones',
    excerpt: 'Over 25 keepsake tins sold across Mumbai. In a city with thousands of dessert options, people chose a brand built by a 19-year-old student.',
    image: nutellaTinImage,
    readTime: '2 min read',
    keyHighlight: '25+ loaded keepsake tins delivered to Mumbai doorsteps.',
    content: [
      'We crossed 25 loaded cookie tins sold across Mumbai! In a city where you can order from hundreds of established bakeries and luxury hotel patisseries in minutes, each tin represents someone choosing a tiny, founder-led brand run by a 19-year-old college student.',
      'Seeing our deep-drawn tins on living room tables and birthday parties across the city is the greatest reward.'
    ]
  },
  {
    id: 'post-18',
    date: '28 AUGUST 2026',
    rawDate: '2026-08-28',
    title: "We're Quitting Our 250g Tins",
    category: 'milestones',
    excerpt: 'When our smaller tins became difficult to source, I took a scary gamble on a larger, more expensive tin. Mumbai responded with love.',
    image: nutellaTinImage,
    readTime: '3 min read',
    keyHighlight: 'Retiring the 250g tin and upgrading to our signature keepsake tin.',
    content: [
      'We officially re
