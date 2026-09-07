import {
  StartupPhase,
  BusinessModel,
  BusinessPlanSection,
  SOPItem,
  GrantOpportunity,
  NasdaqTicker,
  DriverScores,
} from '../types';

export function calculateStepValuation(scores: DriverScores): { score: number; gate: 'GO' | 'REVISE' | 'STOP' } {
  // formula: round((0.25*revenue_impact)+(0.20*risk_reduction)+(0.20*strategic_fit)+(0.15*time_to_value)+(0.10*operational_leverage)-(0.10*cost_to_complete), 2)
  const raw =
    0.25 * scores.revenue_impact +
    0.2 * scores.risk_reduction +
    0.2 * scores.strategic_fit +
    0.15 * scores.time_to_value +
    0.1 * scores.operational_leverage -
    0.1 * scores.cost_to_complete;

  const score = Math.max(0, Math.min(10, Math.round(raw * 100) / 100));

  let gate: 'GO' | 'REVISE' | 'STOP' = 'GO';
  if (score >= 7.0) {
    gate = 'GO';
  } else if (score >= 5.0) {
    gate = 'REVISE';
  } else {
    gate = 'STOP';
  }

  return { score, gate };
}

// Full 145 Steps in 10 Phases
export const INITIAL_PHASES: StartupPhase[] = [
  {
    phase_id: 'phase_01_idea_and_validation',
    phase_name: 'Phase 1: Idea Development & Validation',
    description: 'Initial market discovery, problem identification, competitor analysis, and customer interviews.',
    steps: [
      { step: 1, name: 'Identify a problem to solve', frequency: 'one_time', loop: false, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'completed', driverScores: { revenue_impact: 8, risk_reduction: 7, strategic_fit: 9, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 2, name: 'Define the target customer', frequency: 'one_time', loop: false, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'completed', driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 8, time_to_value: 7, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 3, name: 'Research industry trends', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'in_progress', driverScores: { revenue_impact: 7, risk_reduction: 8, strategic_fit: 9, time_to_value: 6, operational_leverage: 7, cost_to_complete: 3 } },
      { step: 4, name: 'Analyze competitors', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'in_progress', driverScores: { revenue_impact: 8, risk_reduction: 9, strategic_fit: 8, time_to_value: 7, operational_leverage: 7, cost_to_complete: 3 } },
      { step: 5, name: 'Identify market gaps', frequency: 'one_time', loop: false, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 7, strategic_fit: 9, time_to_value: 6, operational_leverage: 8, cost_to_complete: 3 } },
      { step: 6, name: 'Create value proposition', frequency: 'one_time', loop: false, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 9, time_to_value: 8, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 7, name: 'Develop customer personas', frequency: 'one_time', loop: false, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 7, strategic_fit: 8, time_to_value: 7, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 8, name: 'Conduct customer interviews', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 9, strategic_fit: 8, time_to_value: 6, operational_leverage: 6, cost_to_complete: 3 } },
      { step: 9, name: 'Survey potential customers', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 8, strategic_fit: 8, time_to_value: 7, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 10, name: 'Validate willingness to pay', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 10, risk_reduction: 9, strategic_fit: 9, time_to_value: 7, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 11, name: 'Estimate market size', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 8, time_to_value: 7, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 12, name: 'Perform SWOT analysis', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 9, strategic_fit: 9, time_to_value: 8, operational_leverage: 7, cost_to_complete: 1 } },
      { step: 13, name: 'Determine revenue opportunities', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 9, time_to_value: 7, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 14, name: 'Identify startup risks', frequency: 'recurring', loop: true, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 8, time_to_value: 7, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 15, name: 'Decide whether to proceed', frequency: 'one_time', loop: false, phase_id: 'phase_01_idea_and_validation', phase_name: 'Idea Development & Validation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 9, strategic_fit: 10, time_to_value: 8, operational_leverage: 8, cost_to_complete: 1 } },
    ],
  },
  {
    phase_id: 'phase_02_business_planning',
    phase_name: 'Phase 2: Business Planning',
    description: 'Mission, vision, value propositions, pricing strategy, unit economics, and formal business plan document.',
    steps: [
      { step: 16, name: 'Define mission statement', frequency: 'one_time', loop: false, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 6, risk_reduction: 7, strategic_fit: 10, time_to_value: 8, operational_leverage: 6, cost_to_complete: 1 } },
      { step: 17, name: 'Define vision statement', frequency: 'one_time', loop: false, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 6, risk_reduction: 7, strategic_fit: 10, time_to_value: 8, operational_leverage: 6, cost_to_complete: 1 } },
      { step: 18, name: 'Establish company values', frequency: 'one_time', loop: false, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 6, risk_reduction: 8, strategic_fit: 9, time_to_value: 8, operational_leverage: 6, cost_to_complete: 1 } },
      { step: 19, name: 'Set business objectives', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 8, strategic_fit: 9, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 20, name: 'Select business model', frequency: 'one_time', loop: false, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 10, time_to_value: 7, operational_leverage: 9, cost_to_complete: 2 } },
      { step: 21, name: 'Define products and services', frequency: 'one_time', loop: false, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'operational_leverage', decision_focus: 'Prioritize operational leverage for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 7, strategic_fit: 9, time_to_value: 7, operational_leverage: 9, cost_to_complete: 2 } },
      { step: 22, name: 'Create pricing strategy', frequency: 'one_time', loop: false, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 10, risk_reduction: 8, strategic_fit: 9, time_to_value: 8, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 23, name: 'Develop go-to-market strategy', frequency: 'one_time', loop: false, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 10, risk_reduction: 8, strategic_fit: 9, time_to_value: 7, operational_leverage: 8, cost_to_complete: 3 } },
      { step: 24, name: 'Define sales strategy', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 7, strategic_fit: 8, time_to_value: 7, operational_leverage: 8, cost_to_complete: 3 } },
      { step: 25, name: 'Define marketing strategy', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'revenue_impact', decision_focus: 'Prioritize revenue impact for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 7, strategic_fit: 8, time_to_value: 7, operational_leverage: 8, cost_to_complete: 3 } },
      { step: 26, name: 'Estimate startup costs', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 9, strategic_fit: 8, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 27, name: 'Estimate operating expenses', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 9, strategic_fit: 8, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 28, name: 'Create revenue projections', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 8, time_to_value: 7, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 29, name: 'Create cash flow projections', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize cash flow quality for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 10, strategic_fit: 9, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 30, name: 'Write business plan', frequency: 'recurring', loop: true, phase_id: 'phase_02_business_planning', phase_name: 'Business Planning', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 9, strategic_fit: 10, time_to_value: 7, operational_leverage: 8, cost_to_complete: 3 } },
    ],
  },
  {
    phase_id: 'phase_03_business_structure_and_legal',
    phase_name: 'Phase 3: Legal Formation & Structure',
    description: 'Entity registration, EIN, state/local tax accounts, trademark, operating agreement, and licensing.',
    steps: [
      { step: 31, name: 'Choose business name', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 8, strategic_fit: 10, time_to_value: 9, operational_leverage: 7, cost_to_complete: 1 } },
      { step: 32, name: 'Check trademark availability', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize risk reduction for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 9, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 33, name: 'Reserve business name', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 6, risk_reduction: 9, strategic_fit: 8, time_to_value: 9, operational_leverage: 6, cost_to_complete: 1 } },
      { step: 34, name: 'Select business structure', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 10, strategic_fit: 9, time_to_value: 8, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 35, name: 'Prepare formation documents', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 8, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 36, name: 'Register business entity', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 10, strategic_fit: 9, time_to_value: 8, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 37, name: 'Obtain EIN', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 8, risk_reduction: 10, strategic_fit: 9, time_to_value: 9, operational_leverage: 8, cost_to_complete: 1 } },
      { step: 38, name: 'Register state tax accounts', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize cash flow quality for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 9, strategic_fit: 8, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 39, name: 'Register local tax accounts', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize cash flow quality for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 9, strategic_fit: 8, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 40, name: 'Apply for licenses', frequency: 'recurring', loop: true, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize risk reduction for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 8, time_to_value: 7, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 41, name: 'Apply for permits', frequency: 'recurring', loop: true, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize risk reduction for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 8, time_to_value: 7, operational_leverage: 7, cost_to_complete: 2 } },
      { step: 42, name: 'Draft operating agreement', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 9, time_to_value: 8, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 43, name: 'Create shareholder agreements', frequency: 'one_time', loop: false, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'strategic_fit', decision_focus: 'Prioritize strategic fit for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 9, time_to_value: 8, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 44, name: 'Establish compliance procedures', frequency: 'recurring', loop: true, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize risk reduction for this step.', status: 'pending', driverScores: { revenue_impact: 7, risk_reduction: 10, strategic_fit: 8, time_to_value: 7, operational_leverage: 8, cost_to_complete: 2 } },
      { step: 45, name: 'Purchase business insurance', frequency: 'recurring', loop: true, phase_id: 'phase_03_business_structure_and_legal', phase_name: 'Legal Formation', valuation_driver: 'risk_reduction', decision_focus: 'Prioritize risk reduction for this step.', status: 'pending', driverScores: { revenue_impact: 6, risk_reduction: 10, strategic_fit: 8, time_to_value: 8, operational_leverage: 7, cost_to_complete: 2 } },
    ],
  },
  {
    phase_id: 'phase_04_finance_and_funding',
    phase_name: 'Phase 4: Finance & Funding',
    description: 'Capital assessment, pitch deck, grants search, bank account, bookkeeping, and financial controls.',
    steps: Array.from({ length: 15 }, (_, i) => {
      const step = 46 + i;
      const names = [
        'Determine capital requirements', 'Assess funding options', 'Prepare funding pitch', 'Create investor materials',
        'Seek grants', 'Apply for loans', 'Raise investment capital', 'Open business bank account', 'Set up accounting system',
        'Select bookkeeping method', 'Create chart of accounts', 'Set financial controls', 'Establish budgets',
        'Define reporting procedures', 'Establish tax procedures'
      ];
      return {
        step,
        name: names[i],
        frequency: step === 53 ? 'one_time' : 'recurring',
        loop: step !== 53,
        phase_id: 'phase_04_finance_and_funding',
        phase_name: 'Finance & Funding',
        valuation_driver: 'risk_reduction' as const,
        decision_focus: 'Prioritize financial strength & cash flow.',
        status: 'pending' as const,
        driverScores: { revenue_impact: 8, risk_reduction: 9, strategic_fit: 8, time_to_value: 7, operational_leverage: 8, cost_to_complete: 2 },
      };
    }),
  },
  {
    phase_id: 'phase_05_product_and_service_development',
    phase_name: 'Phase 5: Product & Service Development',
    description: 'MVP design, development, quality assurance, customer feedback loops, and launch-ready deliverables.',
    steps: Array.from({ length: 15 }, (_, i) => {
      const step = 61 + i;
      const names = [
        'Define product requirements', 'Design MVP', 'Build MVP', 'Test MVP', 'Collect user feedback',
        'Improve MVP', 'Develop production version', 'Create documentation', 'Create support materials',
        'Define quality standards', 'Implement quality assurance', 'Establish fulfillment process',
        'Develop service procedures', 'Finalize offerings', 'Prepare launch-ready product'
      ];
      return {
        step,
        name: names[i],
        frequency: [61, 62, 63, 70, 74].includes(step) ? 'one_time' : 'recurring',
        loop: ![61, 62, 63, 70, 74].includes(step),
        phase_id: 'phase_05_product_and_service_development',
        phase_name: 'Product Development',
        valuation_driver: 'operational_leverage' as const,
        decision_focus: 'Prioritize operational leverage and user value.',
        status: 'pending' as const,
        driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 9, time_to_value: 7, operational_leverage: 9, cost_to_complete: 3 },
      };
    }),
  },
  {
    phase_id: 'phase_06_operations_setup',
    phase_name: 'Phase 6: Operations & Infrastructure',
    description: 'Facility leasing, IT infrastructure, software suite, SOPs, vendor contracts, and logistics.',
    steps: Array.from({ length: 15 }, (_, i) => {
      const step = 76 + i;
      const names = [
        'Select business location', 'Lease or purchase facility', 'Set up utilities', 'Acquire equipment',
        'Purchase software', 'Set up IT infrastructure', 'Implement cybersecurity controls', 'Establish SOPs',
        'Develop workflow processes', 'Create inventory procedures', 'Establish vendor relationships',
        'Negotiate supplier contracts', 'Create logistics procedures', 'Create business continuity plan',
        'Complete operational readiness review'
      ];
      return {
        step,
        name: names[i],
        frequency: [76, 77, 78, 79, 80, 81, 90].includes(step) ? 'one_time' : 'recurring',
        loop: ![76, 77, 78, 79, 80, 81, 90].includes(step),
        phase_id: 'phase_06_operations_setup',
        phase_name: 'Operations & Infrastructure',
        valuation_driver: 'operational_leverage' as const,
        decision_focus: 'Prioritize operational leverage.',
        status: 'pending' as const,
        driverScores: { revenue_impact: 7, risk_reduction: 9, strategic_fit: 8, time_to_value: 8, operational_leverage: 9, cost_to_complete: 2 },
      };
    }),
  },
  {
    phase_id: 'phase_07_branding_and_marketing',
    phase_name: 'Phase 7: Branding & Marketing',
    description: 'Brand identity, logo specs, website build, SEO, social channels, ad campaigns, and pre-launch hype.',
    steps: Array.from({ length: 15 }, (_, i) => {
      const step = 91 + i;
      const names = [
        'Create brand identity', 'Design logo', 'Develop brand guidelines', 'Register domain name', 'Build website',
        'Set up analytics', 'Create social media accounts', 'Create content strategy', 'Develop advertising strategy',
        'Develop SEO strategy', 'Create email marketing system', 'Develop sales collateral', 'Launch pre-marketing campaign',
        'Generate leads', 'Prepare launch campaign'
      ];
      return {
        step,
        name: names[i],
        frequency: [91, 92, 93, 94, 95].includes(step) ? 'one_time' : 'recurring',
        loop: ![91, 92, 93, 94, 95].includes(step),
        phase_id: 'phase_07_branding_and_marketing',
        phase_name: 'Branding & Marketing',
        valuation_driver: 'revenue_impact' as const,
        decision_focus: 'Prioritize brand impact and customer reach.',
        status: 'pending' as const,
        driverScores: { revenue_impact: 9, risk_reduction: 7, strategic_fit: 9, time_to_value: 8, operational_leverage: 8, cost_to_complete: 2 },
      };
    }),
  },
  {
    phase_id: 'phase_08_hiring_and_human_resources',
    phase_name: 'Phase 8: Hiring & HR',
    description: 'Organizational chart, job descriptions, recruiting, compensation, handbook, payroll, and benefits.',
    steps: Array.from({ length: 15 }, (_, i) => {
      const step = 106 + i;
      const names = [
        'Define organizational structure', 'Identify staffing needs', 'Create job descriptions', 'Establish compensation plans',
        'Recruit candidates', 'Interview candidates', 'Perform background checks', 'Hire employees', 'Create employee handbook',
        'Implement payroll system', 'Set up benefits administration', 'Conduct onboarding', 'Provide training',
        'Establish performance management', 'Ensure HR compliance'
      ];
      return {
        step,
        name: names[i],
        frequency: [106, 107, 108, 109, 113, 114, 115, 116, 120].includes(step) ? 'one_time' : 'recurring',
        loop: ![106, 107, 108, 109, 113, 114, 115, 116, 120].includes(step),
        phase_id: 'phase_08_hiring_and_human_resources',
        phase_name: 'Hiring & HR',
        valuation_driver: 'strategic_fit' as const,
        decision_focus: 'Prioritize execution capacity.',
        status: 'pending' as const,
        driverScores: { revenue_impact: 7, risk_reduction: 9, strategic_fit: 9, time_to_value: 7, operational_leverage: 8, cost_to_complete: 2 },
      };
    }),
  },
  {
    phase_id: 'phase_09_launch',
    phase_name: 'Phase 9: Official Launch',
    description: 'Final readiness reviews, legal/financial verification, website launch, marketing push, and customer support.',
    steps: Array.from({ length: 10 }, (_, i) => {
      const step = 121 + i;
      const names = [
        'Conduct final readiness review', 'Verify legal compliance', 'Verify operational readiness', 'Verify financial readiness',
        'Verify staffing readiness', 'Launch website', 'Launch marketing campaign', 'Begin sales operations',
        'Begin customer support operations', 'Officially launch business'
      ];
      return {
        step,
        name: names[i],
        frequency: 'one_time' as const,
        loop: false,
        phase_id: 'phase_09_launch',
        phase_name: 'Official Launch',
        valuation_driver: 'revenue_impact' as const,
        decision_focus: 'Prioritize revenue impact and brand execution.',
        status: 'pending' as const,
        driverScores: { revenue_impact: 10, risk_reduction: 9, strategic_fit: 9, time_to_value: 9, operational_leverage: 9, cost_to_complete: 2 },
      };
    }),
  },
  {
    phase_id: 'phase_10_growth_and_scaling',
    phase_name: 'Phase 10: Growth & Scaling',
    description: 'KPI tracking, customer retention, operational automation, market expansion, line extensions, long-term plan.',
    steps: Array.from({ length: 15 }, (_, i) => {
      const step = 131 + i;
      const names = [
        'Track KPIs', 'Monitor customer satisfaction', 'Optimize operations', 'Improve products and services',
        'Expand marketing efforts', 'Increase sales channels', 'Expand partnerships', 'Hire additional staff',
        'Enter new markets', 'Develop scaling strategy', 'Automate business processes', 'Strengthen financial controls',
        'Raise additional capital if needed', 'Expand product lines', 'Build long-term strategic plan'
      ];
      return {
        step,
        name: names[i],
        frequency: 'recurring' as const,
        loop: true,
        phase_id: 'phase_10_growth_and_scaling',
        phase_name: 'Growth & Scaling',
        valuation_driver: 'strategic_fit' as const,
        decision_focus: 'Prioritize operational leverage and enterprise scale.',
        status: 'pending' as const,
        driverScores: { revenue_impact: 9, risk_reduction: 8, strategic_fit: 9, time_to_value: 8, operational_leverage: 10, cost_to_complete: 2 },
      };
    }),
  },
];

// Preset Business Models (Standard, Municipal & Build-to-Sale)
export const BUSINESS_MODELS: BusinessModel[] = [
  {
    model_id: 'BM-001',
    model_name: 'SaaS Platform (Software as a Service)',
    definition: 'A subscription-based model providing centrally hosted multi-tenant software over the web with recurring billing tiers.',
    when_to_use: 'High digital scalability, predictable monthly recurring revenue (MRR), and low marginal cost per user.',
    advantages: [
      'Predictable recurring monthly/annual revenue',
      'High gross margins (75%-85%+)',
      'Global distribution with low incremental cost',
      'Continuous product improvement and analytics feedback',
    ],
    risks: [
      'High initial Customer Acquisition Cost (CAC)',
      'Churn rate risk if product velocity slows',
      'Multi-tenant cloud security liabilities',
    ],
    components: ['Tiered Subscription Engine', 'Multi-tenant Auth & Roles', 'Usage Analytics Core', 'Automated Provisioning Pipeline'],
    workflow: [
      'User selects tier & registers on corporate portal',
      'Payment processor authenticates token',
      'Automated script provisions user environment',
      'Usage tracking feeds monthly billing cycle',
    ],
    sop_references: ['SOP-001', 'SOP-004'],
  },
  {
    model_id: 'BM-002',
    model_name: 'Enterprise B2B Professional Services Marketplace',
    definition: 'An aggregation platform matching pre-vetted specialists with corporate buyers using escrow commissions and SOW contracts.',
    when_to_use: 'Fragmented high-skilled talent markets requiring rigorous compliance, procurement alignment, and milestone payments.',
    advantages: [
      'Zero inventory and balance sheet risk',
      'Network effects as buyer/seller volume grows',
      'High Gross Merchandise Value (GMV) per contract',
    ],
    risks: [
      'Platform disintermediation (transacting off-platform)',
      'Vetting and quality control consistency across talent',
      'Long enterprise sales cycles',
    ],
    components: ['Expert Vetting Portal', 'SOW Proposal Matcher', 'Milestone Escrow Router', 'Governance & Audit Logger'],
    workflow: [
      'Buyer submits Statement of Work (SOW)',
      'Matching algorithm routes SOW to pre-vetted experts',
      'Escrow funds locked upon contract signature',
      'Milestone verification releases payouts',
    ],
    sop_references: ['SOP-002'],
  },
  {
    model_id: 'BM-003',
    model_name: 'Direct-to-Consumer (D2C) E-Commerce Brand',
    definition: 'Manufacturing and selling proprietary physical products directly to consumers through owned web storefronts.',
    when_to_use: 'Distinctive physical product innovation, high gross margins (>60%), and strong brand storytelling appeal.',
    advantages: ['Full ownership of customer relationship and data', 'Higher margins than wholesale distribution', 'Agile product iteration based on direct feedback'],
    risks: ['Inventory holding costs and supply chain delays', 'High ad spend for consumer acquisition', 'Shipping and returns logistics burden'],
    components: ['Storefront Checkout Engine', 'Inventory Management System', '3PL Fulfillment Integration', 'Customer Care & CRM Portal'],
    workflow: ['Customer places order on storefront', 'Payment processed and 3PL warehouse notified', 'Order picked, packed, and tracked', 'Post-purchase follow-up and review prompt'],
    sop_references: ['SOP-003'],
  },
  {
    model_id: 'BM-004',
    model_name: 'Strategic Advisory & Managed Agency',
    definition: 'High-touch consulting, custom engineering, and retainer-based agency services for enterprise clients.',
    when_to_use: 'Immediate cash flow generation, high ticket contract sizes ($10k-$100k+), and deep domain expertise.',
    advantages: ['Low upfront capital required to start', 'Immediate profitability from Day 1', 'Builds strong corporate relationship networks'],
    risks: ['Difficult to scale linearly without hiring staff', 'Revenue tied directly to labor hours', 'Key-person dependency'],
    components: ['CRM Lead Pipeline', 'Proposal & SOW Generator', 'Project Tracking Workspace', 'Retainer & Hourly Billing Portal'],
    workflow: ['Discovery call and requirements gathering', 'Custom proposal and SOW presented', 'Retainer deposit collected', 'Deliverable milestones executed'],
    sop_references: ['SOP-002'],
  },
  {
    model_id: 'BM-005',
    model_name: 'Municipal SaaS & Smart City Infrastructure Concession (GovTech)',
    definition: 'Long-term enterprise contracts with city/county governments providing automated civic infrastructure, permit processing, utilities management, and sensor telemetry.',
    when_to_use: 'B2G government procurement, high contract retention (>98%), multi-year appropriations, and regulatory monopolies.',
    advantages: [
      'Multi-year locked government appropriations ($100k-$5M+ ACV)',
      'Virtually zero churn once embedded in municipal workflows',
      'Sole-source expansion opportunities across neighboring municipalities',
      'Qualifies for Federal State & Local Cybersecurity Grants (SLFRF/ARPA)',
    ],
    risks: [
      '6-18 month municipal RFP and public bidding approval cycles',
      'Rigorous compliance: CJIS, FedRAMP, SOC2 Type II, ADA Section 508',
      'Political election cycle leadership transitions',
    ],
    components: ['Civic Portal & Resident ID Gateway', 'Municipal ERP/GIS Integrations', 'Council Audit & Transparency Vault', 'SLA Uptime Monitor (99.99%)'],
    workflow: [
      'City Council approves digital modernization RFP / Sole-source pilot',
      'GovCloud secure enclave provisioned with CJIS encryption',
      'Inter-agency data ingestion and legacy system synchronization',
      'Annual tax-exempt municipal warrant or ACH direct disbursement',
    ],
    sop_references: ['SOP-002', 'SOP-001'],
  },
  {
    model_id: 'BM-006',
    model_name: 'Public-Private Partnership (P3) Enterprise Operator',
    definition: 'Joint concession structure where the company designs, finances, builds, and operates public infrastructure or high-tech public services in exchange for revenue shares or availability payments.',
    when_to_use: 'Capital-intensive municipal tech deployments (EV fleets, smart grid, civic broadband, automated transit, waste-to-energy).',
    advantages: [
      'Substantial government risk-sharing and sovereign guarantees',
      'Access to tax-exempt municipal bonds and green infrastructure grants',
      'Exclusive 10 to 30 year operating exclusivity rights',
    ],
    risks: [
      'Complex multi-stakeholder legal framework (Concession Agreement)',
      'Public regulatory oversight and rate-cap stipulations',
      'High upfront capital expenditure and performance bond requirements',
    ],
    components: ['P3 Special Purpose Vehicle (SPV) Entity', 'Asset Lifecycle Maintenance Engine', 'Tariff & Fee Collection Gateway', 'Public Oversight Dashboard'],
    workflow: [
      'Feasibility study submitted to Municipal Regional Authority',
      'P3 Concession Agreement drafted with performance benchmarks',
      'SPV entity capitalized with matching private equity and municipal grants',
      'Automated revenue-share split between company and municipal treasury',
    ],
    sop_references: ['SOP-001', 'SOP-003'],
  },
  {
    model_id: 'BM-007',
    model_name: 'County & Municipal Revenue-Sharing Franchise',
    definition: 'Zero-cost deployment to municipalities where the platform monetizes consumer convenience fees, transaction processing, or regulatory compliance enforcement, sharing a percentage back to the city.',
    when_to_use: 'Parking telemetry, automated citation validation, digital business licensing, permitting, and civic court fee payments.',
    advantages: [
      'Frictionless municipal adoption with $0 line-item budget requirement',
      'Immediate recurring daily transaction volume',
      'High gross margins with high citizen payment compliance',
    ],
    risks: [
      'State-level fee ceiling statutes and transparency scrutiny',
      'Merchant processing chargeback and fraud liability',
    ],
    components: ['PCI-DSS Level 1 Payment Gateway', 'Court/City Treasury Ledger Sync', 'Citizen Mobile SMS/App Notification Engine', 'Automated Daily Sweep Router'],
    workflow: [
      'City passes ordinance authorizing digital convenience fee structure',
      'API integrated with county court and municipal finance database',
      'Citizens pay through platform; convenience fee retained automatically',
      'Net fine/tax revenue swept daily to municipal general fund',
    ],
    sop_references: ['SOP-001'],
  },
  {
    model_id: 'BM-008',
    model_name: 'Build-to-Sale (M&A / Strategic Acquisition Exit Operator)',
    definition: 'Engineering the startup from Day 1 to maximize acquisition value multiples by prospective strategic acquirers (Big Tech, Private Equity, Defense Primes), focusing on clean IP, Rule of 40, and zero key-person dependency.',
    when_to_use: '3-to-5 year targeted exit window, high strategic consolidation market, acquisition targets between $50M - $250M+.',
    advantages: [
      'Maximized enterprise value multiples (8x - 15x ARR / 20x EBITDA)',
      'Pre-negotiated clean room data room and transferable SOPs',
      'Strategic buyer bidding competition driving valuation premiums',
    ],
    risks: [
      'M&A market macro shifts or interest rate fluctuations',
      'Due diligence re-trading if IP or cap table is disorganized',
      'Earnout escrow contingencies requiring milestone achievement',
    ],
    components: ['M&A Virtual Data Room (VDR)', 'Clean Room IP Chain-of-Title Vault', 'Transferable Automated SOP Matrix', 'Cap Table Waterfall Simulator'],
    workflow: [
      'Strategic acquirer criteria matrix established (TAM overlap & tech gap)',
      'Quarterly Rule of 40 audit and automated transferable SOP validation',
      'Investment bank / M&A advisor confidentiality agreement & teaser distribution',
      'Definitive Acquisition Agreement (APA/SPA) execution and escrow closing',
    ],
    sop_references: ['SOP-001', 'SOP-002', 'SOP-004'],
  },
];

// Preset Business Plan Sections (Expanded with Municipal & Build-to-Sale)
export const BUSINESS_PLAN_SECTIONS: BusinessPlanSection[] = [
  {
    section_id: 'BP-001',
    section_name: 'Executive Summary & Strategic Vision',
    purpose: 'Synthesize the entire initiative into a high-impact narrative for investors, municipal leaders, and key stakeholders.',
    description: 'Executive narrative defining the market opportunity, value proposition, proprietary moats, financial highlights, and ROI goals.',
    required_inputs: ['Mission & Vision', 'Target Problem & Solution', 'Market Opportunity', 'Financial Highlights'],
  },
  {
    section_id: 'BP-002',
    section_name: 'Market Analysis & Competitive Intelligence',
    purpose: 'Empirical validation of market size, customer personas, industry growth trends, and competitor weaknesses.',
    description: 'Data-driven TAM/SAM/SOM breakdown, competitor vulnerability matrix, Porter\'s Five Forces, and SWOT analysis.',
    required_inputs: ['Industry Statistics', 'Target Demographics', 'Direct Competitors List', 'SWOT Breakdown'],
  },
  {
    section_id: 'BP-003',
    section_name: 'Product Architecture & Value Proposition',
    purpose: 'Detailed specification of core products/services, MVP feature set, tech stack, and IP/trademarks.',
    description: 'Product roadmap, functional specifications, competitive differentiation, technology stack, and IP strategy.',
    required_inputs: ['MVP Features List', 'Technology Stack', 'IP/Trademarks', 'Development Roadmap'],
  },
  {
    section_id: 'BP-004',
    section_name: 'Go-To-Market & Sales Strategy',
    purpose: 'Clear blueprint for customer acquisition, pricing tiers, marketing channels, and sales pipeline.',
    description: 'Marketing campaign channels, conversion funnel design, CAC targets, LTV expectations, and pricing models.',
    required_inputs: ['Pricing Structure', 'Customer Acquisition Channels', 'Sales Funnel Steps', 'CAC/LTV Targets'],
  },
  {
    section_id: 'BP-005',
    section_name: 'Municipal & Public-Private Integration Blueprint',
    purpose: 'Comprehensive public-sector framework detailing municipal procurement, city council approvals, civic compliance, and grant alignment.',
    description: 'B2G municipal RFP strategy, inter-governmental data security (CJIS/FedRAMP), P3 concession frameworks, and local economic development impact.',
    required_inputs: ['Target Municipalities/Counties', 'RFP & Sole-Source Justification', 'GovCloud Compliance', 'Community ROI Metrics'],
  },
  {
    section_id: 'BP-006',
    section_name: 'Operations, Legal Structure & HR',
    purpose: 'Organizational hierarchy, facility/software infrastructure, compliance protocols, and key team roles.',
    description: 'Entity formation details, SOP overview, software/hardware tool stack, staffing plan, and risk management.',
    required_inputs: ['Entity Type (LLC/S-Corp/C-Corp)', 'Core Executive Roles', 'Key Vendor Stack', 'Compliance Checklist'],
  },
  {
    section_id: 'BP-007',
    section_name: 'Financial Projections & Capital Requirements',
    purpose: '3-year P&L forecasts, cash flow statement, break-even analysis, and funding requirements.',
    description: 'Revenue projections, COGS, operating expenses, gross margins, cash burn rate, runway, and funding pitch details.',
    required_inputs: ['Startup Capital Needed', 'Monthly Expenses', 'Unit Pricing & Volume', 'Target Gross Margin'],
  },
  {
    section_id: 'BP-008',
    section_name: 'Build-to-Sale (M&A / Strategic Exit) Playbook',
    purpose: 'Targeted exit blueprint engineering the business for a 10x-20x valuation buyout by strategic acquirers or private equity.',
    description: 'Strategic acquirer profiling, clean room IP documentation, Rule of 40 optimization, key-person risk mitigation, and M&A data room checklist.',
    required_inputs: ['Target Strategic Acquirers', 'Target Exit Multiple (ARR/EBITDA)', 'Transferable SOP Matrix', 'Clean IP Chain of Title'],
  },
];

// Preset SOPs
export const INITIAL_SOPS: SOPItem[] = [
  {
    sop_id: 'SOP-001',
    title: 'Automated Financial Analysis & Market Feasibility Validation',
    category: 'Finance & Strategy Automation',
    objective: 'Provide explicit instructions for extracting financial metrics, normalizing spreadsheets, and auditing economic feasibility.',
    prerequisites: ['Financial Inputs JSON', 'Monthly Expense Ledger', 'Ollama or Gemini AI API Key'],
    tools: ['Python 3.11', 'Gemini API', 'jq JSON Parser', 'cURL'],
    detailed_steps: [
      {
        step_number: 1,
        step_name: 'Environment Setup & Key Validation',
        instructions: ['Verify GEMINI_API_KEY environment variable is configured.', 'Test connectivity to /api/health endpoint.'],
      },
      {
        step_number: 2,
        step_name: 'Unit Economics & LTV:CAC Ratio Audit',
        instructions: ['Calculate Customer Lifetime Value (LTV = ARPU / Churn).', 'Calculate Customer Acquisition Cost (CAC = Total Marketing Spend / New Customers).', 'Assert LTV:CAC is greater than 3.0.'],
      },
      {
        step_number: 3,
        step_name: 'Automated Feasibility Scoring',
        instructions: ['Pass financial variables into Valuation Rubric formula.', 'Export feasibility report as structured JSON.'],
      },
    ],
    outputs: ['financial_feasibility_report.json', 'system_audit_log.txt'],
  },
  {
    sop_id: 'SOP-002',
    title: 'SOW Evaluation & Compliance Audit Automation',
    category: 'Legal & Contract Governance',
    objective: 'Standardized rules for filtering incoming enterprise Statements of Work, identifying liability risks, and checking compliance.',
    prerequisites: ['SOW Draft Document', 'Corporate Legal Matrix JSON'],
    tools: ['Gemini API', 'RegEx String Parser', 'Bash CLI'],
    detailed_steps: [
      {
        step_number: 1,
        step_name: 'Document Text Normalization',
        instructions: ['Ingest raw contract text file.', 'Strip non-standard characters and preserve clause headings.'],
      },
      {
        step_number: 2,
        step_name: 'AI Liability & Non-Compliant Clause Extraction',
        instructions: ['Transmit text chunks to Gemini model.', 'Flag indemnification, payment terms > 60 days, and IP assignment issues.'],
      },
      {
        step_number: 3,
        step_name: 'Remediation Report Generation',
        instructions: ['Output structured JSON containing risk tier (LOW/MEDIUM/HIGH) and suggested legal revisions.'],
      },
    ],
    outputs: ['sow_compliance_audit.json', 'legal_risk_incident_log.json'],
  },
  {
    sop_id: 'SOP-003',
    title: 'Brand Identity & Print Asset Generation Pipeline',
    category: 'Marketing & Design Automation',
    objective: 'Produce vector logo guidelines, print-ready business card text, website specifications, and ad storyboards.',
    prerequisites: ['Brand Name', 'Industry Vertical', 'Target Audience Persona'],
    tools: ['Gemini AI Studio', 'Image Generation Engine', 'Tailwind CSS Sandbox'],
    detailed_steps: [
      {
        step_number: 1,
        step_name: 'Brand Vision & Voice Definition',
        instructions: ['Input brand values and target demographic into Creative Asset Studio.', 'Select color palette hex codes.'],
      },
      {
        step_number: 2,
        step_name: 'Asset Generation',
        instructions: ['Generate Business Card Specs.', 'Generate 5 Logo Concepts.', 'Build Landing Page HTML/Tailwind mockup.'],
      },
      {
        step_number: 3,
        step_name: 'Export & Print Specs',
        instructions: ['Download color palettes, trim/bleed settings, and video scripts.'],
      },
    ],
    outputs: ['brand_guide.pdf', 'business_cards_spec.json', 'landing_page.html'],
  },
  {
    sop_id: 'SOP-004',
    title: 'Auto Business Intelligence & Grants.gov Ingestion Pipeline',
    category: 'Market Intelligence & Automated Web Crawling',
    objective: 'Ingest NASDAQ market tickers, extract daily stock gainers/decliners, crawl Grants.gov opportunities, parse IRS business master files, and extract USA Spending records.',
    prerequisites: ['Bash Shell', 'curl', 'ifconfig', 'python3', 'espeak', 'streamlit'],
    tools: ['Bash CLI Script', 'Python pandas/tickers', 'Streamlit Web UI', 'IRS BMF Unzipper'],
    detailed_steps: [
      {
        step_number: 1,
        step_name: 'Environment Cleanup & NASDAQ Ingestion',
        instructions: [
          'Purge stale grants-gov and nasdaq CSV files from Downloads and auto business workspace.',
          'Crawl NASDAQ market screener for daily price, volume, and sector changes.'
        ],
      },
      {
        step_number: 2,
        step_name: 'Ticker of Day, Inc of Day & Sector Analytics',
        instructions: [
          'Sort nasdaq.csv by market cap and volume to extract incofday, tikofday, and secofday.',
          'Synthesize daily stock audio announcements via espeak.',
          'Compile US and EU stock tickers into tickers master list.'
        ],
      },
      {
        step_number: 3,
        step_name: 'IRS Business Data, USA Spending & Grants Extract',
        instructions: [
          'Fetch IRS business sites (bisites.txt) and parse NAICS XLS tables into database.',
          'Download USA Spending database extract and GrantsDBExtract archive.',
          'Launch Streamlit BI dashboard (myapp2.py) on port 8501.'
        ],
      },
    ],
    outputs: ['incofday', 'tikofday', 'secofday', 'grants.csv', 'nasdaq.csv', 'tickers.csv', 'usaspending_db.sql'],
  },
];

// Grant Opportunities Data (Grants.gov & Federal Funding Sources)
export const GRANT_OPPORTUNITIES: GrantOpportunity[] = [
  {
    id: 'GRANT-001',
    title: 'SBIR Phase I: Small Business Innovation Research in AI & Software',
    agency: 'National Science Foundation (NSF)',
    amount: '$275,000',
    deadline: 'Rolling / Nov 2026',
    category: 'Technology & AI',
    industryId: 'tech_ai',
    cfdaNumber: '47.084',
    fundingType: 'SBIR Phase I',
    eligibility: 'US-based small business (<500 employees), R&D focused',
    description: 'Provides non-dilutive seed funding to transform AI agentic software and scientific discovery into scalable commercial products.',
    url: 'https://www.grants.gov/search-grants.html?keywords=SBIR%20AI',
  },
  {
    id: 'GRANT-002',
    title: 'STTR Phase I: Dual-Use AI & Autonomous Decision Systems',
    agency: 'DARPA / Department of Defense (DoD)',
    amount: '$300,000',
    deadline: 'Oct 2026',
    category: 'Technology & AI',
    industryId: 'tech_ai',
    cfdaNumber: '12.910',
    fundingType: 'STTR Phase I',
    eligibility: 'Small business partnered with a research university',
    description: 'Funding for LLM edge deployment, multi-modal decision intelligence, and enterprise multi-agent coordination systems.',
    url: 'https://www.grants.gov/search-grants.html?keywords=DARPA%20AI',
  },
  {
    id: 'GRANT-003',
    title: 'NIH SBIR: Digital Health Solutions & Telemedicine AI Platforms',
    agency: 'National Institutes of Health (NIH)',
    amount: '$400,000',
    deadline: 'Dec 2026',
    category: 'Healthcare & MedTech',
    industryId: 'healthcare',
    cfdaNumber: '93.837',
    fundingType: 'SBIR Phase I',
    eligibility: 'US MedTech startups with HIPAA compliance roadmap',
    description: 'Grants for patient outcome optimization, automated EHR charting assistants, and remote clinical monitoring hardware.',
    url: 'https://www.grants.gov/search-grants.html?keywords=NIH%20Digital%20Health',
  },
  {
    id: 'GRANT-004',
    title: 'BARDA Drive: Next-Gen Health Security & Diagnostics Accelerator',
    agency: 'HHS / BARDA',
    amount: '$750,000',
    deadline: 'Jan 2027',
    category: 'Healthcare & MedTech',
    industryId: 'healthcare',
    cfdaNumber: '93.360',
    fundingType: 'Contract Award',
    eligibility: 'Early-stage medical device and rapid diagnostics companies',
    description: 'Non-dilutive capital and accelerator support for pandemic preparedness, biosensors, and rapid point-of-care diagnostics.',
    url: 'https://www.grants.gov/search-grants.html?keywords=BARDA%20Drive',
  },
  {
    id: 'GRANT-005',
    title: 'ARPA-E SCALEUP: Clean Energy Grid Storage & Battery Innovation',
    agency: 'Department of Energy (DOE)',
    amount: '$1,500,000',
    deadline: 'Feb 2027',
    category: 'Clean Energy & ClimateTech',
    industryId: 'clean_energy',
    cfdaNumber: '81.135',
    fundingType: 'ARPA-E Cooperative Agreement',
    eligibility: 'CleanTech startups scaling zero-emission grid tech',
    description: 'Scale-up grants for long-duration energy storage, microgrid controllers, carbon capture software, and battery manufacturing.',
    url: 'https://www.grants.gov/search-grants.html?keywords=ARPA-E%20Clean%20Energy',
  },
  {
    id: 'GRANT-006',
    title: 'DOE SBIR: Renewable Energy Microgrids & EV Charging Optimization',
    agency: 'Office of Energy Efficiency (EERE)',
    amount: '$200,000',
    deadline: 'Nov 2026',
    category: 'Clean Energy & ClimateTech',
    industryId: 'clean_energy',
    cfdaNumber: '81.086',
    fundingType: 'SBIR Phase I',
    eligibility: 'US clean energy tech developers',
    description: 'Seed funding to prototype smart grid software, DER management platforms, and V2G (Vehicle-to-Grid) load balancing.',
    url: 'https://www.grants.gov/search-grants.html?keywords=EERE%20Microgrid',
  },
  {
    id: 'GRANT-007',
    title: 'DoD xTechSearch: Defense Modernization & Tactical Autonomous Hardware',
    agency: 'US Army xTech / DoD',
    amount: '$500,000',
    deadline: 'Rolling 2026',
    category: 'Defense & Aerospace',
    industryId: 'defense_gov',
    cfdaNumber: '12.000',
    fundingType: 'xTech Award',
    eligibility: 'Commercial startups with dual-use military & enterprise tech',
    description: 'Prize competitions and direct SBIR fast-tracks for uncrewed vehicle systems, tactical mesh networks, and counter-UAS software.',
    url: 'https://www.grants.gov/search-grants.html?keywords=xTechSearch',
  },
  {
    id: 'GRANT-008',
    title: 'AFWERX Open Topic: Tactical C4ISR & Satellite Communications',
    agency: 'Department of the Air Force / AFWERX',
    amount: '$1,250,000',
    deadline: 'Sep 2026',
    category: 'Defense & Aerospace',
    industryId: 'defense_gov',
    cfdaNumber: '12.800',
    fundingType: 'SBIR Direct-to-Phase-II',
    eligibility: 'Small business with working dual-use prototype',
    description: 'Commercial solution opening for satellite data analytics, autonomous drone swarms, and low-latency encryption.',
    url: 'https://www.grants.gov/search-grants.html?keywords=AFWERX',
  },
  {
    id: 'GRANT-009',
    title: 'NSF Convergence Accelerator: Financial Inclusion & Crypto Risk Governance',
    agency: 'National Science Foundation (NSF)',
    amount: '$750,000',
    deadline: 'Jan 2027',
    category: 'FinTech & Payments',
    industryId: 'fintech',
    cfdaNumber: '47.083',
    fundingType: 'Convergence Grant',
    eligibility: 'Multi-disciplinary teams in financial technology and fraud prevention',
    description: 'Accelerates AI-powered AML/KYC automated audits, cross-border remittance reduction, and real-time fraud mitigation.',
    url: 'https://www.grants.gov/search-grants.html?keywords=NSF%20Fintech',
  },
  {
    id: 'GRANT-010',
    title: 'USDA Rural Business Development: Rural Micro-Lending & Agricultural Fintech',
    agency: 'USDA Rural Development',
    amount: '$150,000',
    deadline: 'Dec 2026',
    category: 'FinTech & Payments',
    industryId: 'fintech',
    cfdaNumber: '10.769',
    fundingType: 'Rural Business Grant',
    eligibility: 'Fintech startups supporting rural credit scoring and small farm financing',
    description: 'Targeted capital for automated crop loan underwriting platforms and rural digital payment infrastructure.',
    url: 'https://www.usaspending.gov',
  },
  {
    id: 'GRANT-011',
    title: 'DOT SBIR: Freight Logistics & Automated Corridor Efficiency',
    agency: 'Department of Transportation (DOT)',
    amount: '$350,000',
    deadline: 'Nov 2026',
    category: 'Supply Chain & Logistics',
    industryId: 'supply_chain',
    cfdaNumber: '20.200',
    fundingType: 'SBIR Phase I',
    eligibility: 'Logistics and transportation software/hardware startups',
    description: 'Funding for automated port yard operations, fleet electrification routing, and multimodal supply chain tracking.',
    url: 'https://www.grants.gov/search-grants.html?keywords=DOT%20Supply%20Chain',
  },
  {
    id: 'GRANT-012',
    title: 'DHS CISA: Critical Infrastructure Cybersecurity & Zero Trust Defense',
    agency: 'Department of Homeland Security (DHS) / CISA',
    amount: '$1,000,000',
    deadline: 'Jan 2027',
    category: 'Cybersecurity',
    industryId: 'cybersecurity',
    cfdaNumber: '97.108',
    fundingType: 'Security Innovation Grant',
    eligibility: 'US Cybersecurity firms protecting water, power, and telecom grids',
    description: 'Direct funding for AI anomaly detection, zero trust architecture deployment, and automated patch management in OT/ICS.',
    url: 'https://www.grants.gov/search-grants.html?keywords=CISA%20Cybersecurity',
  },
  {
    id: 'GRANT-013',
    title: 'Department of Education ED/IES SBIR: AI Personalized Learning & Workforce Upskilling',
    agency: 'Department of Education (ED / IES)',
    amount: '$250,000',
    deadline: 'Oct 2026',
    category: 'EdTech & Workforce',
    industryId: 'education',
    cfdaNumber: '84.305',
    fundingType: 'SBIR Phase I',
    eligibility: 'EdTech startups developing adaptive learning software',
    description: 'Grants to build AI tutoring assistants, vocational skill simulators, and accessible learning tools for K-12 and workforce training.',
    url: 'https://www.grants.gov/search-grants.html?keywords=IES%20EdTech',
  },
];

// NASDAQ Market Screener Data
export const NASDAQ_MARKET_DATA: NasdaqTicker[] = [
  { symbol: 'ASTRO', companyName: 'Astro Lab Fab Technologies Inc.', sector: 'Technology / AI Platforms', industry: 'Enterprise Software', marketCap: '$1.42B', lastSale: '$148.50', netChange: '+6.25', pctChange: '+4.39%', country: 'United States', isTickerOfDay: true, isIncOfDay: true, isSecOfDay: true },
  { symbol: 'SMCI', companyName: 'Super Micro Computer Inc.', sector: 'Technology', industry: 'Computer Hardware', marketCap: '$48.2B', lastSale: '$820.40', netChange: '+52.10', pctChange: '+6.80%', country: 'United States' },
  { symbol: 'PLTR', companyName: 'Palantir Technologies Inc.', sector: 'Technology', industry: 'Software Infrastructure', marketCap: '$62.5B', lastSale: '$28.40', netChange: '+1.38', pctChange: '+5.12%', country: 'United States' },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: '$3.10T', lastSale: '$126.40', netChange: '+3.50', pctChange: '+2.85%', country: 'United States' },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', sector: 'Consumer Discretionary', industry: 'Auto Manufacturers', marketCap: '$780.4B', lastSale: '$248.50', netChange: '+8.40', pctChange: '+3.50%', country: 'United States' },
  { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', marketCap: '$3.45T', lastSale: '$224.30', netChange: '+1.80', pctChange: '+0.81%', country: 'United States' },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Technology', industry: 'Software Infrastructure', marketCap: '$3.28T', lastSale: '$440.80', netChange: '+2.10', pctChange: '+0.48%', country: 'United States' },
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', sector: 'Consumer Discretionary', industry: 'Internet Retail', marketCap: '$1.98T', lastSale: '$186.20', netChange: '+1.15', pctChange: '+0.62%', country: 'United States' },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc. Class A', sector: 'Communication Services', industry: 'Internet Content & Search', marketCap: '$2.15T', lastSale: '$175.60', netChange: '+0.95', pctChange: '+0.54%', country: 'United States' },
  { symbol: 'META', companyName: 'Meta Platforms Inc.', sector: 'Communication Services', industry: 'Internet Content', marketCap: '$1.25T', lastSale: '$492.10', netChange: '+4.20', pctChange: '+0.86%', country: 'United States' },
  { symbol: 'DIS', companyName: 'The Walt Disney Company', sector: 'Communication Services', industry: 'Entertainment', marketCap: '$172.1B', lastSale: '$94.20', netChange: '-1.78', pctChange: '-1.85%', country: 'United States' },
  { symbol: 'PFE', companyName: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', marketCap: '$156.4B', lastSale: '$27.80', netChange: '-0.55', pctChange: '-1.95%', country: 'United States' },
  { symbol: 'PYPL', companyName: 'PayPal Holdings Inc.', sector: 'Financials', industry: 'Credit Services', marketCap: '$64.8B', lastSale: '$62.10', netChange: '-1.36', pctChange: '-2.15%', country: 'United States' },
  { symbol: 'BA', companyName: 'The Boeing Company', sector: 'Industrials', industry: 'Aerospace & Defense', marketCap: '$108.3B', lastSale: '$176.40', netChange: '-5.27', pctChange: '-2.90%', country: 'United States' },
  { symbol: 'INTC', companyName: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: '$128.5B', lastSale: '$30.15', netChange: '-1.06', pctChange: '-3.40%', country: 'United States' },
];

export interface IndustrySectorMetric {
  sector: string;
  changePct: string;
  isPositive: boolean;
  marketCapLeader: string;
  topStock: string;
  bottomStock: string;
  status: 'Bullish' | 'Bearish' | 'Neutral';
}

export const SECTOR_INDUSTRY_PERFORMANCE: IndustrySectorMetric[] = [
  { sector: 'Technology & AI Platforms', changePct: '+3.45%', isPositive: true, marketCapLeader: 'Apple Inc. ($3.45T)', topStock: '$SMCI (+6.80%)', bottomStock: '$INTC (-3.40%)', status: 'Bullish' },
  { sector: 'Semiconductors & Hardware', changePct: '+2.80%', isPositive: true, marketCapLeader: 'NVIDIA Corp ($3.10T)', topStock: '$NVDA (+2.85%)', bottomStock: '$INTC (-3.40%)', status: 'Bullish' },
  { sector: 'Consumer Discretionary & EV', changePct: '+1.62%', isPositive: true, marketCapLeader: 'Amazon.com ($1.98T)', topStock: '$TSLA (+3.50%)', bottomStock: '$DIS (-1.85%)', status: 'Bullish' },
  { sector: 'Communication Services', changePct: '+0.52%', isPositive: true, marketCapLeader: 'Alphabet Inc. ($2.15T)', topStock: '$META (+0.86%)', bottomStock: '$DIS (-1.85%)', status: 'Neutral' },
  { sector: 'Financials & Credit Services', changePct: '-1.20%', isPositive: false, marketCapLeader: 'JPMorgan Chase ($580B)', topStock: '$JPM (+0.12%)', bottomStock: '$PYPL (-2.15%)', status: 'Bearish' },
  { sector: 'Healthcare & Biotech', changePct: '-1.85%', isPositive: false, marketCapLeader: 'Eli Lilly ($820B)', topStock: '$LLY (+0.45%)', bottomStock: '$PFE (-1.95%)', status: 'Bearish' },
  { sector: 'Industrials & Aerospace', changePct: '-2.10%', isPositive: false, marketCapLeader: 'GE Aerospace ($180B)', topStock: '$GE (+0.20%)', bottomStock: '$BA (-2.90%)', status: 'Bearish' },
];

export interface EinRecord {
  ein: string;
  legalName: string;
  tradeName: string;
  naicsCode: string;
  naicsTitle: string;
  taxStatus: string;
  cityState: string;
  irsFilingStatus: 'Active / Verified' | 'Pending Review' | 'Exempt';
}

export const EIN_BUSINESS_DATABASE: EinRecord[] = [
  { ein: '88-3920192', legalName: 'ASTRO LAB FAB INC', tradeName: 'Astro Lab Fab', naicsCode: '541511', naicsTitle: 'Custom Computer Programming Services', taxStatus: 'C-Corporation (Form 1120)', cityState: 'San Francisco, CA', irsFilingStatus: 'Active / Verified' },
  { ein: '12-3456789', legalName: 'OPEN AI TECHNOLOGIES LLC', tradeName: 'OpenAI', naicsCode: '541512', naicsTitle: 'Computer Systems Design Services', taxStatus: 'Partnership / LLC (Form 1065)', cityState: 'San Francisco, CA', irsFilingStatus: 'Active / Verified' },
  { ein: '98-7654321', legalName: 'QUANTUM COMPUTE LABS INC', tradeName: 'Quantum Labs', naicsCode: '541715', naicsTitle: 'R&D in Physical & Engineering Sciences', taxStatus: 'C-Corporation (Form 1120)', cityState: 'Austin, TX', irsFilingStatus: 'Active / Verified' },
  { ein: '45-9871234', legalName: 'NEURAL GRID SYSTEMS INC', tradeName: 'Neural Grid', naicsCode: '334413', naicsTitle: 'Semiconductor & Microchip Manufacturing', taxStatus: 'C-Corporation (Form 1120)', cityState: 'San Jose, CA', irsFilingStatus: 'Active / Verified' },
  { ein: '27-1122334', legalName: 'BIO-SYNTHETIC DYNAMICS CORP', tradeName: 'BioSynth', naicsCode: '541714', naicsTitle: 'R&D in Biotechnology', taxStatus: 'C-Corporation (Form 1120)', cityState: 'Boston, MA', irsFilingStatus: 'Active / Verified' },
];

export interface UsaSpendingRecord {
  awardId: string;
  recipientName: string;
  amount: string;
  awardingAgency: string;
  awardType: 'Procurement Contract' | 'Grant' | 'Direct Payment';
  description: string;
  dateAwarded: string;
}

export const USA_SPENDING_DATA: UsaSpendingRecord[] = [
  { awardId: 'CONT_AWD_SPE4A624C0012', recipientName: 'ASTRO LAB FAB INC', amount: '$1,250,000', awardingAgency: 'Department of Defense (DoD)', awardType: 'Procurement Contract', description: 'Autonomous Enterprise Execution & AI Pipeline Software Suite', dateAwarded: '2026-03-15' },
  { awardId: 'ASST_NON_0012983', recipientName: 'QUANTUM COMPUTE LABS INC', amount: '$450,000', awardingAgency: 'National Science Foundation (NSF)', awardType: 'Grant', description: 'Fault-Tolerant Quantum Algorithm Optimization in Supply Chains', dateAwarded: '2026-02-10' },
  { awardId: 'ASST_NON_9823120', recipientName: 'NEURAL GRID SYSTEMS INC', amount: '$800,000', awardingAgency: 'Department of Energy (DOE)', awardType: 'Grant', description: 'Next-Generation Microgrid Controller & Energy Storage AI', dateAwarded: '2026-01-22' },
  { awardId: 'CONT_AWD_75FCMC22C0008', recipientName: 'BIO-SYNTHETIC DYNAMICS CORP', amount: '$2,100,000', awardingAgency: 'Health and Human Services (HHS)', awardType: 'Procurement Contract', description: 'AI-Driven Molecular Screening Platform for Vaccine R&D', dateAwarded: '2025-11-04' },
];
