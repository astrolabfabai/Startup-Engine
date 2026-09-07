import { StartupPhase, StartupStep, StepStatus } from '../types';

export interface StepDependencyRule {
  prerequisites: number[]; // Step numbers that MUST be completed before this step
  type: 'hard_blocker' | 'data_flow' | 'regulatory_prereq';
  description?: string;
}

export interface DependencyLink {
  source: number; // prerequisite step number
  target: number; // dependent step number
  type: 'hard_blocker' | 'data_flow' | 'regulatory_prereq';
  isSatisfied: boolean; // is source completed?
}

export interface StepBlockStatus {
  stepNumber: number;
  isBlocked: boolean;
  totalPrereqs: number;
  completedPrereqs: number;
  unmetPrereqs: { step: number; name: string; phase: string; status: StepStatus }[];
  metPrereqs: { step: number; name: string; phase: string; status: StepStatus }[];
  downstreamSteps: { step: number; name: string; phase: string; status: StepStatus }[];
  downstreamCount: number;
  isBottleneck: boolean;
  bottleneckScore: number;
}

/**
 * Explicit domain-driven startup dependencies covering the 145 steps.
 * Rules ensure authentic enterprise data-science and startup lifecycle progression:
 * - Legal/Entity gates
 * - Product/MVP tech progression
 * - Finance/Banking/Grants pipeline
 * - Marketing/GTM launch readiness
 * - Operations, hiring & scaling
 */
export const STEP_DEPENDENCIES_MAP: Record<number, number[]> = {
  // Phase 1: Idea & Validation (1 - 15)
  2: [1], // Target customer requires Problem definition
  5: [1, 2, 4], // Market gaps requires Problem, Target Customer, Competitors
  6: [1, 2, 5], // Value proposition requires Market Gaps & Target Customer
  7: [2, 6], // Personas requires Target customer & Value proposition
  8: [2, 7], // Interviews requires Personas
  9: [2, 8], // Surveys requires Interviews
  10: [6, 8, 9], // Willingness to pay requires Interviews & Value Prop
  11: [2, 5, 10], // Market size requires Target customer & Willingness to pay
  12: [4, 5, 11], // SWOT requires Competitor analysis & Market gaps
  13: [10, 11], // Revenue opportunities requires Willingness to pay & Market size
  14: [12, 13], // Risks requires SWOT & Revenue opps
  15: [1, 6, 10, 14], // Proceed decision requires Problem, Value Prop, Pay willingness, Risks

  // Phase 2: Business Planning (16 - 30)
  16: [15], // Mission requires Proceed decision
  17: [16], // Vision requires Mission
  18: [16, 17], // Values requires Mission & Vision
  19: [16, 17], // Objectives requires Mission & Vision
  20: [6, 13, 19], // Business model requires Value Prop & Objectives
  21: [20], // Products/Services requires Business Model
  22: [10, 20, 21], // Pricing requires Willingness to pay & Products
  23: [2, 20, 22], // GTM requires Target Customer & Pricing
  24: [22, 23], // Sales strategy requires GTM & Pricing
  25: [22, 23], // Marketing strategy requires GTM & Pricing
  26: [21, 24, 25], // Startup costs requires Products, Sales & Marketing
  27: [21, 26], // Operating expenses requires Startup costs
  28: [22, 24, 27], // Revenue projections requires Pricing & Sales strategy
  29: [26, 27, 28], // Cash flow projections requires Expenses & Revenue
  30: [15, 20, 23, 29], // Business plan requires Plan components

  // Phase 3: Legal & Entity Formation (31 - 45)
  31: [15], // Business name requires Proceed decision
  32: [31], // Trademark check requires Business name
  33: [31, 32], // Reserve name requires Trademark check
  34: [30, 31], // Business structure requires Business plan & Name
  35: [33, 34], // Formation docs requires Structure & Reserved name
  36: [35], // Entity registration requires Formation docs
  37: [36], // EIN requires Entity Registration
  38: [36, 37], // State tax accounts requires Entity & EIN
  39: [36, 37], // Local tax accounts requires Entity & EIN
  40: [36, 38], // Licenses requires Entity & State tax
  41: [36, 39, 40], // Permits requires Licenses
  42: [34, 36], // Operating agreement requires Structure & Entity
  43: [34, 42], // Shareholder agreement requires Operating agreement
  44: [36, 40, 42], // Compliance procedures requires Entity & Licenses
  45: [36, 44], // Business insurance requires Entity & Compliance

  // Phase 4: Finance & Funding (46 - 60)
  46: [26, 29], // Capital requirements requires Startup costs & Cash flow
  47: [46], // Assess funding options requires Capital reqs
  48: [30, 46], // Funding pitch requires Business plan & Capital reqs
  49: [30, 48], // Investor materials requires Pitch & Business plan
  50: [36, 37, 46], // Seek grants requires Entity, EIN & Capital reqs
  51: [36, 37, 46, 53], // Apply for loans requires Entity, EIN & Bank Account
  52: [48, 49, 53], // Raise investment requires Pitch, Materials & Bank
  53: [36, 37], // Open Bank Account requires Entity Registration & EIN
  54: [53], // Accounting system setup requires Bank Account
  55: [54], // Bookkeeping method requires Accounting system
  56: [54, 55], // Chart of accounts requires Accounting system
  57: [54, 56], // Financial controls requires Accounting & Chart of Accounts
  58: [29, 46, 57], // Budgets requires Cash flow, Capital reqs & Controls
  59: [54, 57], // Reporting procedures requires Accounting & Controls
  60: [37, 38, 54], // Tax procedures requires EIN, State Tax & Accounting

  // Phase 5: Product & MVP Development (61 - 75)
  61: [21, 30], // Product requirements requires Products definition & Business plan
  62: [61], // Design MVP requires Product requirements
  63: [62], // Build MVP requires Design MVP
  64: [63], // Test MVP requires Build MVP
  65: [64], // Collect user feedback requires Test MVP
  66: [65], // Improve MVP requires User feedback
  67: [66], // Develop production version requires Improved MVP
  68: [67], // Documentation requires Production version
  69: [67, 68], // Support materials requires Documentation
  70: [61, 67], // Quality standards requires Product reqs & Production version
  71: [70], // Quality assurance requires Quality standards
  72: [67, 71], // Fulfillment process requires Production version & QA
  73: [67, 72], // Service procedures requires Fulfillment
  74: [67, 70, 73], // Finalize offerings requires QA & Procedures
  75: [64, 67, 71, 74], // Launch-ready product requires QA, Feedback & Testing

  // Phase 6: Operations & Infrastructure (76 - 90)
  76: [36], // Business location requires Entity
  77: [76], // Lease facility requires Location
  78: [77], // Utilities requires Facility lease
  79: [77, 78], // Equipment requires Facility & Utilities
  80: [53, 54], // Purchase software requires Bank account & Accounting
  81: [78, 79, 80], // IT Infrastructure requires Equipment & Software
  82: [81], // Cybersecurity controls requires IT Infrastructure
  83: [72, 73, 81], // SOPs requires Fulfillment, Service & IT
  84: [83], // Workflow processes requires SOPs
  85: [72, 83], // Inventory procedures requires SOPs & Fulfillment
  86: [72, 80], // Vendor relationships requires Fulfillment & Software
  87: [86], // Supplier contracts requires Vendor relationships
  88: [72, 85, 87], // Logistics procedures requires Supplier contracts & Inventory
  89: [82, 83, 88], // Business continuity plan requires Cyber, SOPs & Logistics
  90: [81, 83, 89], // Readiness review requires Operations setup

  // Phase 7: Branding & Marketing (91 - 105)
  91: [6, 31], // Brand identity requires Value Prop & Business Name
  92: [91], // Design logo requires Brand identity
  93: [91, 92], // Brand guidelines requires Logo & Brand identity
  94: [31, 33], // Register domain requires Business Name
  95: [91, 92, 94], // Build website requires Brand, Logo & Domain
  96: [95], // Setup analytics requires Website
  97: [91, 92], // Social media accounts requires Brand & Logo
  98: [25, 91], // Content strategy requires Marketing strategy & Brand
  99: [25, 98], // Advertising strategy requires Marketing & Content
  100: [95, 98], // SEO strategy requires Website & Content strategy
  101: [95, 96], // Email marketing system requires Website & Analytics
  102: [91, 93], // Sales collateral requires Brand guidelines & Logo
  103: [95, 98, 99], // Pre-marketing campaign requires Website, Content & Ads
  104: [96, 101, 103], // Generate leads requires Pre-marketing & Email
  105: [95, 103, 104], // Prepare launch campaign requires Leads & Pre-marketing

  // Phase 8: Hiring & HR (106 - 120)
  106: [30, 36], // Org structure requires Business plan & Entity
  107: [106], // Staffing needs requires Org structure
  108: [107], // Job descriptions requires Staffing needs
  109: [107, 108], // Compensation plans requires Job descriptions
  110: [108, 109], // Recruit candidates requires Job descriptions & Comp
  111: [110], // Interview candidates requires Recruiting
  112: [111], // Background checks requires Interviews
  113: [111, 112], // Hire employees requires Background checks
  114: [44, 106], // Employee handbook requires Compliance & Org structure
  115: [37, 38, 53, 113], // Payroll system requires EIN, State Tax, Bank & Hires
  116: [45, 113], // Benefits administration requires Insurance & Hires
  117: [113, 114], // Onboarding requires Hires & Handbook
  118: [117], // Training requires Onboarding
  119: [106, 108], // Performance management requires Org structure & Job descriptions
  120: [44, 114, 115], // HR compliance requires Compliance, Handbook & Payroll

  // Phase 9: Official Launch (121 - 130)
  121: [75, 90, 105, 120], // Final readiness review requires Product, Ops, Mktg & HR
  122: [44, 120, 121], // Verify legal compliance requires Compliance & Review
  123: [90, 121], // Verify operational readiness requires Ops review
  124: [57, 58, 121], // Verify financial readiness requires Controls & Budgets
  125: [113, 120, 121], // Verify staffing readiness requires Hires & HR compliance
  126: [95, 121, 122], // Launch website requires Website, Review & Legal
  127: [105, 126], // Launch marketing campaign requires Campaign prep & Website
  128: [24, 126, 127], // Begin sales operations requires Sales strategy & Marketing launch
  129: [69, 126, 128], // Begin customer support requires Support materials & Sales
  130: [121, 122, 123, 124, 125, 126, 127, 128, 129], // Officially launch business

  // Phase 10: Growth & Scaling (131 - 145)
  131: [130], // Monitor performance requires Official launch
  132: [131], // Analyze customer data requires Performance monitoring
  133: [131, 132], // Refine marketing strategy requires Customer data
  134: [131, 132], // Optimize sales process requires Customer data & Performance
  135: [131, 132], // Improve product requires Customer data
  136: [131, 132], // Expand product line requires Customer data & Product improvement
  137: [133, 134], // Enter new markets requires Refined marketing & Sales
  138: [130, 134], // Develop strategic partnerships requires Launch & Sales
  139: [131, 134], // Scale operations requires Performance & Sales
  140: [139], // Automate processes requires Scaling operations
  141: [139, 140], // Secure growth capital requires Scaled operations & Metrics
  142: [141], // Expand team requires Growth capital
  143: [139, 140], // Enhance infrastructure requires Automation & Scaling
  144: [131, 139], // Maintain company culture requires Team expansion & Scaling
  145: [130, 139, 141, 145], // Pursue long-term vision requires Growth milestones
};

/**
 * Fallback generator for steps: if not in map, depend on immediate previous step in same phase
 */
export function getStepPrerequisites(stepNumber: number): number[] {
  if (STEP_DEPENDENCIES_MAP[stepNumber]) {
    return STEP_DEPENDENCIES_MAP[stepNumber].filter((s) => s !== stepNumber);
  }
  return stepNumber > 1 ? [stepNumber - 1] : [];
}

/**
 * Compute all downstream steps that directly depend on a given step
 */
export function getStepDownstreamDependents(stepNumber: number): number[] {
  const downstream: number[] = [];
  for (let s = 1; s <= 145; s++) {
    const prereqs = getStepPrerequisites(s);
    if (prereqs.includes(stepNumber)) {
      downstream.push(s);
    }
  }
  return downstream;
}

/**
 * Full Step Block Status calculation based on live state
 */
export function computeStepBlockStatus(
  stepNumber: number,
  allSteps: StartupStep[]
): StepBlockStatus {
  const stepMap = new Map<number, StartupStep>();
  allSteps.forEach((s) => stepMap.set(s.step, s));

  const prereqNumbers = getStepPrerequisites(stepNumber);
  const downstreamNumbers = getStepDownstreamDependents(stepNumber);

  const unmetPrereqs: { step: number; name: string; phase: string; status: StepStatus }[] = [];
  const metPrereqs: { step: number; name: string; phase: string; status: StepStatus }[] = [];

  prereqNumbers.forEach((pNum) => {
    const pStep = stepMap.get(pNum);
    if (pStep) {
      if (pStep.status === 'completed') {
        metPrereqs.push({
          step: pStep.step,
          name: pStep.name,
          phase: pStep.phase_name,
          status: pStep.status,
        });
      } else {
        unmetPrereqs.push({
          step: pStep.step,
          name: pStep.name,
          phase: pStep.phase_name,
          status: pStep.status,
        });
      }
    }
  });

  const downstreamSteps: { step: number; name: string; phase: string; status: StepStatus }[] = [];
  downstreamNumbers.forEach((dNum) => {
    const dStep = stepMap.get(dNum);
    if (dStep) {
      downstreamSteps.push({
        step: dStep.step,
        name: dStep.name,
        phase: dStep.phase_name,
        status: dStep.status,
      });
    }
  });

  const totalPrereqs = prereqNumbers.length;
  const completedPrereqs = metPrereqs.length;
  const isBlocked = unmetPrereqs.length > 0;

  // Bottleneck score is high if it has many downstream dependents and is not completed
  const currentStep = stepMap.get(stepNumber);
  const isCompleted = currentStep?.status === 'completed';
  const bottleneckScore = isCompleted ? 0 : downstreamNumbers.length * (isBlocked ? 1.5 : 2.5);
  const isBottleneck = !isCompleted && downstreamNumbers.length >= 3;

  return {
    stepNumber,
    isBlocked,
    totalPrereqs,
    completedPrereqs,
    unmetPrereqs,
    metPrereqs,
    downstreamSteps,
    downstreamCount: downstreamNumbers.length,
    isBottleneck,
    bottleneckScore,
  };
}

/**
 * Get all graph links with live satisfaction status
 */
export function getAllDependencyLinks(allSteps: StartupStep[]): DependencyLink[] {
  const stepMap = new Map<number, StartupStep>();
  allSteps.forEach((s) => stepMap.set(s.step, s));

  const links: DependencyLink[] = [];

  for (let s = 1; s <= 145; s++) {
    const prereqs = getStepPrerequisites(s);
    prereqs.forEach((src) => {
      const srcStep = stepMap.get(src);
      const isSatisfied = srcStep?.status === 'completed';
      links.push({
        source: src,
        target: s,
        type: 'hard_blocker',
        isSatisfied: Boolean(isSatisfied),
      });
    });
  }

  return links;
}

/**
 * Top bottlenecks in the lifecycle
 */
export function getTopBottlenecks(
  allSteps: StartupStep[],
  limit: number = 6
): { step: StartupStep; blockStatus: StepBlockStatus }[] {
  const list = allSteps.map((step) => ({
    step,
    blockStatus: computeStepBlockStatus(step.step, allSteps),
  }));

  return list
    .filter((item) => item.step.status !== 'completed' && item.blockStatus.downstreamCount > 0)
    .sort((a, b) => b.blockStatus.bottleneckScore - a.blockStatus.bottleneckScore)
    .slice(0, limit);
}
