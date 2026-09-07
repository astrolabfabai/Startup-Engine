export interface ApiCallSpec {
  endpoint: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface RetrySpec {
  max_attempts: number;
  backoff_seconds: number;
  action: string;
}

export interface FrameworkSubstep {
  id: string;
  title: string;
  description: string;
  objective: string;
  prerequisites: string[];
  dependencies: string[];
  inputs: string[];
  outputs: string[];
  required_files: string[];
  generated_files: string[];
  estimated_time: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  automation_level: 'Fully Automated' | 'Semi-Automated' | 'Manual' | string;
  ai_required: boolean;
  human_required: boolean;
  primary_model: string;
  fallback_model: string;
  prompt: string;
  context: string;
  validation_prompt: string;
  python_script: string;
  bash_script: string;
  sql_script: string;
  n8n_workflow: string;
  docker_container: string;
  api_calls: ApiCallSpec[];
  verification: string;
  expected_output: string;
  quality_checklist: string[];
  rollback: string;
  retry: RetrySpec | string;
  next_substep: string | null;
  references: string[];
}

export interface BusinessFrameworkIndex {
  framework_version: string;
  framework_name: string;
  description: string;
  last_updated: string;
  modules: {
    '00_schema': string;
    '01_business_plan': string;
    '02_business_models': string;
    '03_pipeline': string;
    '04_sops': string;
    '05_prompts': string;
    '06_scripts': string;
    '07_workflows': string;
    '08_validation': string;
    '09_assets': string;
    '10_outputs': string;
  };
}

export type ValuationDriver =
  | 'revenue_impact'
  | 'risk_reduction'
  | 'strategic_fit'
  | 'time_to_value'
  | 'operational_leverage'
  | 'cost_to_complete';

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface DriverScores {
  revenue_impact: number; // 0 - 10
  risk_reduction: number; // 0 - 10
  strategic_fit: number; // 0 - 10
  time_to_value: number; // 0 - 10
  operational_leverage: number; // 0 - 10
  cost_to_complete: number; // 0 - 10
}

export interface StartupStep {
  step: number;
  name: string;
  frequency: 'one_time' | 'recurring';
  loop: boolean;
  phase_id: string;
  phase_name: string;
  ollama_model?: string;
  valuation_driver: ValuationDriver;
  decision_focus: string;
  status: StepStatus;
  driverScores: DriverScores;
  calculatedScore?: number;
  decisionGate?: 'GO' | 'REVISE' | 'STOP';
  userNotes?: string;
  aiOutput?: string;
}

export interface StartupPhase {
  phase_id: string;
  phase_name: string;
  description: string;
  steps: StartupStep[];
}

export interface PhaseMilestone {
  id: string;
  phase_id: string;
  phase_name: string;
  title: string;
  deliverable_name: string;
  description: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: 'Strategic' | 'Legal/Compliance' | 'Product/Tech' | 'Financial' | 'Go-to-Market' | 'Operational';
  status: 'pending' | 'in_progress' | 'completed';
  target_deadline?: string;
  owner_lead?: string;
  verification_evidence?: string;
  completed_at?: string;
  is_custom?: boolean;
}

export interface CreativeAssetConfig {
  assetType: 'business_cards' | 'logo' | 'website' | 'ad_15s' | 'ad_30s' | 'ad_60s';
  brandName: string;
  tagline: string;
  industry: string;
  targetAudience: string;
  extraPrompt?: string;
}

export interface BusinessModel {
  model_id: string;
  model_name: string;
  definition: string;
  when_to_use: string;
  advantages: string[];
  risks: string[];
  components: string[];
  workflow: string[];
  sop_references: string[];
}

export interface BusinessPlanSection {
  section_id: string;
  section_name: string;
  purpose: string;
  description: string;
  required_inputs: string[];
  content?: string;
}

export interface TaxExpenses {
  advertising: number;
  businessMeals: number;
  insurance: number;
  bankFees: number;
  vehicleMileage: number; // in miles
  contractorLabor: number;
  depreciableAssets: number; // Section 179 / De Minimis
  homeOfficeSqFt: number;
  legalProfessional: number;
  officeRent: number;
  employeeSalaries: number;
  taxesLicenses: number;
  phoneInternet: number;
  travelExpenses: number;
  retirementContributions: number;
  healthInsurance: number;
}

export interface GrantOpportunity {
  id: string;
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  category: string;
  eligibility: string;
  description: string;
  url: string;
  industryId?: string;
  cfdaNumber?: string;
  fundingType?: string;
  matchScore?: number;
}

export interface NasdaqTicker {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  marketCap: string;
  lastSale: string;
  netChange: string;
  pctChange: string;
  country: string;
  isTickerOfDay?: boolean;
  isIncOfDay?: boolean;
  isSecOfDay?: boolean;
}

export interface SOPItem {
  sop_id: string;
  title: string;
  category: string;
  objective: string;
  prerequisites: string[];
  tools: string[];
  detailed_steps: {
    step_number: number;
    step_name: string;
    instructions: string[];
  }[];
  outputs: string[];
}

export type TabId =
  | 'upgrades'
  | 'lifecycle'
  | 'valuation'
  | 'creative'
  | 'plan'
  | 'tax'
  | 'grants'
  | 'sops'
  | 'framework'
  | 'master_templates';

export type QuickNoteType = 'note' | 'reminder' | 'decision' | 'risk' | 'question';
export type QuickNotePriority = 'low' | 'medium' | 'high';


export type QuickNote = {
  id: string;
  title: string;
  content: string;
  type: QuickNoteType;
  priority: QuickNotePriority;
  contextTab: string;
  contextTabLabel: string;
  contextStepNumber?: number;
  contextStepName?: string;
  isPinned?: boolean;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
};

export type ThemeMode = 'dark' | 'light' | 'emerald_cyber';

export type StatusAlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export type StatusAlertCategory =
  | 'grants'
  | 'tax_legal'
  | 'data_pipeline'
  | 'mlops_bot'
  | 'lifecycle_milestones'
  | 'security_vault';

export interface StatusAlert {
  id: string;
  title: string;
  message: string;
  severity: StatusAlertSeverity;
  category: StatusAlertCategory;
  timestamp: string;
  isRead: boolean;
  actionTab?: TabId;
  actionLabel?: string;
  metric?: string;
  details?: string;
}

