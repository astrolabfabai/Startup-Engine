import { IndustryData, IndustryNeed, IndustryProduct, IndustryService } from './industryDecisionData';
import { GrantOpportunity } from '../types';

export interface ViabilityWeights {
  numbers: number; // default e.g. 25
  funding: number; // default e.g. 25
  products: number; // default e.g. 25
  needs: number;   // default e.g. 25
}

export interface ViabilityScoreBreakdown {
  totalScore: number; // 0 - 100
  rank?: number;
  
  // Pillar 1: Numbers
  numbersScore: number; // 0 - 25
  marketSizeVal: number; // in Millions/Billions
  growthRatePct: number; // e.g. 37.2
  avgMarginPct: number; // e.g. 85

  // Pillar 2: Funding
  fundingScore: number; // 0 - 25
  grantCount: number;
  totalGrantPoolDollars: number;
  activeFederalTailwind: string;

  // Pillar 3: Products
  productsScore: number; // 0 - 25
  productCount: number;
  avgLaunchCostEst: number; // in dollars
  avgPricePerMonth: number;

  // Pillar 4: Needs
  needsScore: number; // 0 - 25
  criticalCount: number;
  highCount: number;
  totalNeedsCount: number;

  explanation: string[];
}

// ---------------------------------------------------------------------
// LEAN STARTUP EXECUTION MATRIX (From User Dataset)
// ---------------------------------------------------------------------
export interface LeanStartupTask {
  startupName: string;
  mainTask: string;
  subTask: string;
  subSubTask: string;
}

export const LEAN_STARTUP_TASK_MATRIX: LeanStartupTask[] = [
  { startupName: 'Affiliate Marketing', mainTask: 'Set up website or blog', subTask: 'Choose a niche', subSubTask: 'Research high-demand niches' },
  { startupName: 'Affiliate Marketing', mainTask: 'Set up website or blog', subTask: 'Create content strategy', subSubTask: 'Write blog posts for SEO' },
  { startupName: 'Affiliate Marketing', mainTask: 'Find affiliate programs', subTask: 'Sign up for affiliate networks', subSubTask: 'Amazon Associates, ShareASale, etc.' },
  { startupName: 'Affiliate Marketing', mainTask: 'Promote affiliate links', subTask: 'Add affiliate links to content', subSubTask: 'Embed within blog posts, social media, or email lists' },
  { startupName: 'Freelancing', mainTask: 'Create online portfolio', subTask: 'Set up portfolio website', subSubTask: 'Use WordPress, Wix, or free portfolio platforms' },
  { startupName: 'Freelancing', mainTask: 'Register on freelancing platforms', subTask: 'Create a profile on Upwork or Fiverr', subSubTask: 'Complete your bio, list skills, set rates' },
  { startupName: 'Freelancing', mainTask: 'Apply for gigs', subTask: 'Research job postings', subSubTask: 'Search based on skills and expertise' },
  { startupName: 'Freelancing', mainTask: 'Deliver quality work', subTask: 'Complete tasks on time', subSubTask: 'Ensure clear communication and meet deadlines' },
  { startupName: 'Blogging', mainTask: 'Set up blog', subTask: 'Choose blogging platform', subSubTask: 'Install WordPress, Blogger, or Medium' },
  { startupName: 'Blogging', mainTask: 'Create content plan', subTask: 'Research topics', subSubTask: 'Check trends and keyword tools' },
  { startupName: 'Blogging', mainTask: 'Monetize blog', subTask: 'Join ad networks', subSubTask: 'Apply for Google AdSense, Mediavine, or Ezoic' },
  { startupName: 'Blogging', mainTask: 'Monetize blog', subTask: 'Offer digital products', subSubTask: 'Sell eBooks, printables, or courses' },
  { startupName: 'Digital Products', mainTask: 'Create a digital product', subTask: 'Design digital product', subSubTask: 'Use Canva, Adobe Suite, or Figma for design' },
  { startupName: 'Digital Products', mainTask: 'Set up product sales page', subTask: 'Choose platform', subSubTask: 'Use Gumroad, Shopify (free plan), or Etsy' },
  { startupName: 'Digital Products', mainTask: 'Market product', subTask: 'Social media promotion', subSubTask: 'Create Instagram, TikTok, or Pinterest content' },
  { startupName: 'Print-on-Demand', mainTask: 'Set up online store', subTask: 'Create account on print-on-demand platforms', subSubTask: 'Sign up on Printful, Teespring, or Redbubble' },
  { startupName: 'Print-on-Demand', mainTask: 'Design products', subTask: 'Create designs', subSubTask: 'Use Canva or Adobe Illustrator for designing' },
  { startupName: 'Print-on-Demand', mainTask: 'Integrate store with platform', subTask: 'Link store to Shopify or Etsy', subSubTask: 'Set up payment gateways' },
  { startupName: 'Online Course Creation', mainTask: 'Create course outline', subTask: 'Research topics', subSubTask: 'Survey your audience for pain points' },
  { startupName: 'Online Course Creation', mainTask: 'Create course content', subTask: 'Record videos', subSubTask: 'Use free tools like OBS Studio or Loom for recording' },
  { startupName: 'Online Course Creation', mainTask: 'Launch course', subTask: 'Set up course platform', subSubTask: 'Use Teachable, Thinkific, or Gumroad' },
  { startupName: 'Online Course Creation', mainTask: 'Market course', subTask: 'Email marketing', subSubTask: 'Build a mailing list using MailChimp or ConvertKit' },
  { startupName: 'Dropshipping', mainTask: 'Create an eCommerce store', subTask: 'Set up Shopify or WooCommerce', subSubTask: 'Create a store on the free trial or open-source platform' },
  { startupName: 'Dropshipping', mainTask: 'Find suppliers', subTask: 'Use AliExpress or Oberlo', subSubTask: 'Find reliable suppliers with good reviews' },
  { startupName: 'Dropshipping', mainTask: 'List products on the store', subTask: 'Add product details', subSubTask: 'Write compelling product descriptions' },
  { startupName: 'Social Media Management', mainTask: 'Create service offer', subTask: 'Define services', subSubTask: 'Offer Instagram, Facebook, or Twitter management' },
  { startupName: 'Social Media Management', mainTask: 'Find clients', subTask: 'Outreach to businesses', subSubTask: 'Send cold emails or direct messages to potential clients' },
  { startupName: 'Social Media Management', mainTask: 'Create content for clients', subTask: 'Content planning', subSubTask: 'Create social media posts, schedule with Buffer or Later' },
  { startupName: 'Content Writing', mainTask: 'Set up writing profile', subTask: 'Create account on freelancing platforms', subSubTask: 'Upwork, Freelancer, Fiverr' },
  { startupName: 'Content Writing', mainTask: 'Find writing gigs', subTask: 'Apply for writing jobs', subSubTask: 'Pitch directly to businesses or agencies' },
  { startupName: 'Content Writing', mainTask: 'Deliver writing work', subTask: 'Research topics', subSubTask: 'Use tools like Google Scholar or Buzzsumo for content ideas' },
  { startupName: 'Virtual Assistant', mainTask: 'Set up VA services', subTask: 'Define services offered', subSubTask: 'Admin tasks, email management, customer support' },
  { startupName: 'Virtual Assistant', mainTask: 'Find clients', subTask: 'Outreach to entrepreneurs', subSubTask: 'Email small business owners or join VA groups' },
  { startupName: 'Virtual Assistant', mainTask: 'Complete tasks for clients', subTask: 'Time management', subSubTask: 'Prioritize tasks and communicate deadlines' },
];

// ---------------------------------------------------------------------
// FORTUNE 500 BENCHMARK REFERENCE DATASET (From User Dataset)
// ---------------------------------------------------------------------
export interface Fortune500Company {
  rank: number;
  company: string;
  industry: string;
  ticker: string;
  revenueMillions: number;
  profitsMillions: number;
  valuationMillions: number;
  ceo: string;
  employees: string;
}

export const FORTUNE_500_REFERENCE: Fortune500Company[] = [
  { rank: 1, company: 'Walmart', industry: 'General Merchandisers', ticker: 'WMT', revenueMillions: 648125, profitsMillions: 15511, valuationMillions: 484853, ceo: 'Douglas Mcmillon', employees: '2,100,000' },
  { rank: 2, company: 'Amazon', industry: 'Internet Services and Retailing', ticker: 'AMZN', revenueMillions: 574785, profitsMillions: 30425, valuationMillions: 1873676, ceo: 'Andrew R. Jassy', employees: '1,525,000' },
  { rank: 3, company: 'Apple', industry: 'Computers, Office Equipment', ticker: 'AAPL', revenueMillions: 383285, profitsMillions: 96995, valuationMillions: 2647974, ceo: 'Timothy D. Cook', employees: '161,000' },
  { rank: 4, company: 'UnitedHealth Group', industry: 'Health Care: Insurance', ticker: 'UNH', revenueMillions: 371622, profitsMillions: 22381, valuationMillions: 456081, ceo: 'Andrew P. Witty', employees: '440,000' },
  { rank: 5, company: 'Berkshire Hathaway', industry: 'Insurance & Investments', ticker: 'BRKA', revenueMillions: 364482, profitsMillions: 96223, valuationMillions: 908920, ceo: 'Warren E. Buffett', employees: '396,500' },
  { rank: 6, company: 'CVS Health', industry: 'Health Care: Pharmacy', ticker: 'CVS', revenueMillions: 357776, profitsMillions: 8344, valuationMillions: 100374, ceo: 'Karen S. Lynch', employees: '259,500' },
  { rank: 7, company: 'Exxon Mobil', industry: 'Petroleum Refining', ticker: 'XOM', revenueMillions: 344582, profitsMillions: 36010, valuationMillions: 461222, ceo: 'Darren W. Woods', employees: '61,500' },
  { rank: 8, company: 'Alphabet', industry: 'Internet Services & AI', ticker: 'GOOGL', revenueMillions: 307394, profitsMillions: 73795, valuationMillions: 1884633, ceo: 'Sundar Pichai', employees: '182,502' },
  { rank: 9, company: 'McKesson', industry: 'Wholesalers: Health Care', ticker: 'MCK', revenueMillions: 276711, profitsMillions: 3560, valuationMillions: 70547, ceo: 'Brian S. Tyler', employees: '48,000' },
  { rank: 11, company: 'Costco', industry: 'General Merchandisers', ticker: 'COST', revenueMillions: 242290, profitsMillions: 6292, valuationMillions: 324924, ceo: 'Ron M. Vachris', employees: '316,000' },
  { rank: 12, company: 'JPMorgan Chase', industry: 'Commercial Banks', ticker: 'JPM', revenueMillions: 239425, profitsMillions: 49552, valuationMillions: 576938, ceo: 'Jamie Dimon', employees: '309,926' },
  { rank: 13, company: 'Microsoft', industry: 'Computer Software & AI', ticker: 'MSFT', revenueMillions: 211915, profitsMillions: 72361, valuationMillions: 3126133, ceo: 'Satya Nadella', employees: '221,000' },
  { rank: 15, company: 'Chevron', industry: 'Petroleum Refining', ticker: 'CVX', revenueMillions: 200949, profitsMillions: 21369, valuationMillions: 292966, ceo: 'Michael K. Wirth', employees: '45,600' },
  { rank: 17, company: 'Ford Motor', industry: 'Motor Vehicles & Parts', ticker: 'F', revenueMillions: 176191, profitsMillions: 4347, valuationMillions: 53018, ceo: 'Jim Farley', employees: '177,000' },
  { rank: 19, company: 'General Motors', industry: 'Motor Vehicles & Parts', ticker: 'GM', revenueMillions: 171842, profitsMillions: 10127, valuationMillions: 52354, ceo: 'Mary T. Barra', employees: '163,000' },
  { rank: 23, company: 'Home Depot', industry: 'Specialty Retailers', ticker: 'HD', revenueMillions: 152669, profitsMillions: 15143, valuationMillions: 380154, ceo: 'Edward P. Decker', employees: '463,100' },
  { rank: 30, company: 'Meta Platforms', industry: 'Internet Services and AI', ticker: 'META', revenueMillions: 134902, profitsMillions: 39098, valuationMillions: 1237940, ceo: 'Mark Zuckerberg', employees: '67,317' },
  { rank: 40, company: 'Tesla', industry: 'Motor Vehicles & Energy', ticker: 'TSLA', revenueMillions: 96773, profitsMillions: 14997, valuationMillions: 559854, ceo: 'Elon Musk', employees: '140,473' },
  { rank: 65, company: 'Nvidia', industry: 'Semiconductors & AI Hardware', ticker: 'NVDA', revenueMillions: 60922, profitsMillions: 29760, valuationMillions: 2258900, ceo: 'Jen-Hsun Huang', employees: '29,600' },
];

// Helper to parse market size dollar value from string like "$184 Billion" -> 184000 (in Millions)
export function parseMarketSizeInMillions(sizeStr: string): number {
  if (!sizeStr) return 1000;
  const cleaned = sizeStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned) || 10;
  if (sizeStr.toLowerCase().includes('trillion')) return num * 1000000;
  if (sizeStr.toLowerCase().includes('billion')) return num * 1000;
  return num;
}

// Helper to parse growth rate from string like "+37.2% YoY" -> 37.2
export function parseGrowthRatePct(growthStr: string): number {
  if (!growthStr) return 5;
  const num = parseFloat(growthStr.replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 5 : num;
}

// Helper to parse dollar value from string like "$1.4 Billion" -> 1400000000
export function parseGrantPoolDollars(grantStr: string): number {
  if (!grantStr) return 10000000;
  const cleaned = grantStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned) || 1;
  if (grantStr.toLowerCase().includes('billion')) return num * 1000000000;
  if (grantStr.toLowerCase().includes('million')) return num * 1000000;
  return num * 10000;
}

// ---------------------------------------------------------------------
// DYNAMIC BUSINESS VIABILITY CALCULATOR [Numbers, Funding, Products, Needs]
// ---------------------------------------------------------------------
export function calculateBusinessViabilityScore(
  industry: IndustryData,
  allGrants: GrantOpportunity[],
  weights: ViabilityWeights = { numbers: 25, funding: 25, products: 25, needs: 25 }
): ViabilityScoreBreakdown {
  const explanation: string[] = [];

  // 1. NUMBERS SCORE (0 to weights.numbers)
  const marketSizeM = parseMarketSizeInMillions(industry.marketSize);
  const growthRate = parseGrowthRatePct(industry.growthRate);
  
  // Calculate average margin across products & services
  const productMargins = industry.products.map(p => parseFloat(p.marginPct.replace('%', '')) || 70);
  const serviceMargins = industry.services.map(s => parseFloat(s.marginPct.replace('%', '')) || 75);
  const allMargins = [...productMargins, ...serviceMargins];
  const avgMarginPct = allMargins.length > 0 ? allMargins.reduce((a, b) => a + b, 0) / allMargins.length : 75;

  // Numbers sub-components:
  // Market Size factor (capped at 8 pts)
  const marketFactor = Math.min(8, (marketSizeM / 200000) * 8);
  // Growth Rate factor (capped at 9 pts)
  const growthFactor = Math.min(9, Math.max(1, (growthRate / 40) * 9));
  // Margin factor (capped at 8 pts)
  const marginFactor = Math.min(8, (avgMarginPct / 100) * 8);

  const rawNumbers = Math.min(25, marketFactor + growthFactor + marginFactor);
  const numbersScore = Math.round((rawNumbers / 25) * weights.numbers * 10) / 10;

  explanation.push(
    `Numbers (${numbersScore}/${weights.numbers} pts): Market size ${industry.marketSize} (${marketFactor.toFixed(1)}pts), Growth ${industry.growthRate} (${growthFactor.toFixed(1)}pts), Avg Margin ${avgMarginPct.toFixed(0)}% (${marginFactor.toFixed(1)}pts).`
  );

  // 2. FUNDING SCORE (0 to weights.funding)
  const matchedGrants = allGrants.filter(g => 
    g.industryId === industry.id || 
    g.category.toLowerCase().includes(industry.name.toLowerCase().split(' ')[0])
  );
  const grantCount = matchedGrants.length;
  
  // Calculate total grant dollars from matching solicitations
  let matchedDollarsSum = 0;
  matchedGrants.forEach(g => {
    const rawVal = parseFloat(g.amount.replace(/[^0-9.]/g, '')) || 250000;
    matchedDollarsSum += g.amount.includes('Million') ? rawVal * 1000000 : rawVal;
  });

  const activeFundingDollars = parseGrantPoolDollars(industry.activeGrantFunding);
  const combinedGrantPool = Math.max(activeFundingDollars, matchedDollarsSum);

  // Funding sub-components:
  const poolFactor = Math.min(10, (combinedGrantPool / 1000000000) * 10);
  const countFactor = Math.min(8, (grantCount / 10) * 8);
  const agencyTailwindFactor = industry.activeGrantFunding.includes('NSF') || industry.activeGrantFunding.includes('DARPA') || industry.activeGrantFunding.includes('NIH') ? 7 : 4;

  const rawFunding = Math.min(25, poolFactor + countFactor + agencyTailwindFactor);
  const fundingScore = Math.round((rawFunding / 25) * weights.funding * 10) / 10;

  explanation.push(
    `Funding (${fundingScore}/${weights.funding} pts): Active federal funding pool ${industry.activeGrantFunding} (${poolFactor.toFixed(1)}pts), ${grantCount} matched Grants.gov awards (${countFactor.toFixed(1)}pts).`
  );

  // 3. PRODUCTS SCORE (0 to weights.products)
  const productCount = industry.products.length;
  const serviceCount = industry.services.length;
  
  // Average Launch Cost
  const launchCosts = industry.products.map(p => parseFloat(p.launchCostEst.replace(/[^0-9.]/g, '')) || 2000);
  const avgLaunchCostEst = launchCosts.length > 0 ? launchCosts.reduce((a, b) => a + b, 0) / launchCosts.length : 2000;

  // Products sub-components:
  const catalogDepthFactor = Math.min(8, ((productCount + serviceCount) / 20) * 8);
  // Lower launch cost is better for accessible startup launch!
  const costAccessibilityFactor = Math.min(8.5, Math.max(2, 8.5 - (avgLaunchCostEst / 5000) * 4));
  const aiLeverageFactor = industry.products.some(p => p.aiEnhancement) ? 8.5 : 5;

  const rawProducts = Math.min(25, catalogDepthFactor + costAccessibilityFactor + aiLeverageFactor);
  const productsScore = Math.round((rawProducts / 25) * weights.products * 10) / 10;

  explanation.push(
    `Products (${productsScore}/${weights.products} pts): ${productCount} products & ${serviceCount} services ready (${catalogDepthFactor.toFixed(1)}pts), Avg launch cost $${avgLaunchCostEst.toFixed(0)} (${costAccessibilityFactor.toFixed(1)}pts).`
  );

  // 4. NEEDS SCORE (0 to weights.needs)
  const criticalCount = industry.industryNeeds.filter(n => n.urgency === 'Critical').length;
  const highCount = industry.industryNeeds.filter(n => n.urgency === 'High').length;
  const totalNeedsCount = industry.industryNeeds.length;

  // Needs sub-components:
  const urgencyFactor = Math.min(12, (criticalCount * 3 + highCount * 1.5));
  const marketGapFactor = Math.min(13, totalNeedsCount * 2.6);

  const rawNeeds = Math.min(25, urgencyFactor + marketGapFactor);
  const needsScore = Math.round((rawNeeds / 25) * weights.needs * 10) / 10;

  explanation.push(
    `Needs (${needsScore}/${weights.needs} pts): ${criticalCount} Critical & ${highCount} High urgency market gaps (${urgencyFactor.toFixed(1)}pts).`
  );

  // TOTAL COMPOSITE SCORE
  const totalScore = Math.min(100, Math.round((numbersScore + fundingScore + productsScore + needsScore) * 10) / 10);

  return {
    totalScore,
    numbersScore,
    marketSizeVal: marketSizeM,
    growthRatePct: growthRate,
    avgMarginPct: Math.round(avgMarginPct),

    fundingScore,
    grantCount,
    totalGrantPoolDollars: combinedGrantPool,
    activeFederalTailwind: industry.activeGrantFunding,

    productsScore,
    productCount,
    avgLaunchCostEst: Math.round(avgLaunchCostEst),
    avgPricePerMonth: 299,

    needsScore,
    criticalCount,
    highCount,
    totalNeedsCount,

    explanation,
  };
}
