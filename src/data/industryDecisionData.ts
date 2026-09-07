import { TOP_10_INDUSTRIES as TOP_10_INDUSTRIES_PART_1 } from './industriesTop10';
import { TOP_10_INDUSTRIES_PART_2 } from './industriesTop10_part2';
import { TOP_10_INDUSTRIES_PART_3 } from './industriesTop10_part3';
import { BOTTOM_5_INDUSTRIES } from './industriesBottom5';

export interface IndustryProduct {
  id: string;
  name: string;
  type: 'SaaS' | 'Hardware' | 'Data Asset' | 'API' | 'Physical Product' | 'Fintech';
  valueProp: string;
  solvesNeed: string;
  targetBuyer: string;
  pricingModel: string;
  launchCostEst: string;
  marginPct: string;
  aiEnhancement: string;
  externalUrl?: string;
  paperworkRequired?: string[];
  day1AutoApplyEligible?: boolean;
}

export interface IndustryService {
  id: string;
  name: string;
  type: 'Advisory' | 'Managed Service' | 'Implementation' | 'Compliance Audit' | 'Custom Dev';
  valueProp: string;
  solvesNeed: string;
  targetBuyer: string;
  billingRate: string;
  setupTime: string;
  marginPct: string;
  aiEnhancement: string;
  externalUrl?: string;
  paperworkRequired?: string[];
  day1AutoApplyEligible?: boolean;
}

export interface IndustryNeed {
  id: string;
  title: string;
  urgency: 'Critical' | 'High' | 'Moderate';
  description: string;
  marketGap: string;
  federalGrantTailwind: string;
  targetProductOpportunity: string;
  targetServiceOpportunity: string;
  externalUrl?: string;
}

export interface IndustryData {
  id: string;
  rank?: number;
  tier?: 'top10' | 'bottom5';
  tierLabel?: string;
  name: string;
  category: string;
  tagline: string;
  marketSize: string;
  growthRate: string;
  description: string;
  keyStats: { label: string; value: string }[];
  industryNeeds: IndustryNeed[];
  products: IndustryProduct[];
  services: IndustryService[];
  topTickers: string[];
  activeGrantFunding: string;
  externalUrl?: string;
}

export const TOP_10_SECTORS: IndustryData[] = [
  ...TOP_10_INDUSTRIES_PART_1,
  ...TOP_10_INDUSTRIES_PART_2,
  ...TOP_10_INDUSTRIES_PART_3,
];

export const BOTTOM_5_SECTORS: IndustryData[] = [
  ...BOTTOM_5_INDUSTRIES,
];

export const INDUSTRY_DECISION_DATABASE: IndustryData[] = [
  ...TOP_10_SECTORS,
  ...BOTTOM_5_SECTORS,
];

export function getIndustryById(id: string): IndustryData | undefined {
  return INDUSTRY_DECISION_DATABASE.find(ind => ind.id === id);
}

export function getIndustriesByTier(tier: 'top10' | 'bottom5' | 'all'): IndustryData[] {
  if (tier === 'top10') return TOP_10_SECTORS;
  if (tier === 'bottom5') return BOTTOM_5_SECTORS;
  return INDUSTRY_DECISION_DATABASE;
}
