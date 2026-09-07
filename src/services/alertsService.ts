import { StatusAlert, StatusAlertCategory, StatusAlertSeverity, TabId } from '../types';

export const INITIAL_STATUS_ALERTS: StatusAlert[] = [
  {
    id: 'alert-grants-1',
    title: 'SBIR Phase I Grant Submission Window Active',
    message: 'National Science Foundation (NSF) Seed Fund solicitation open. $275,000 ceiling, 48 days remaining before closing cutoff.',
    severity: 'warning',
    category: 'grants',
    timestamp: '2 mins ago',
    isRead: false,
    actionTab: 'grants',
    actionLabel: 'Open Grants Engine',
    metric: '$275,000 Award Ceiling',
    details: 'NSF SBIR Phase I focuses on high-risk, high-impact scientific and technological innovations with strong commercialization potential.',
  },
  {
    id: 'alert-pipeline-1',
    title: 'Self-Healing Data Pipeline: Schema Check Passed',
    message: 'Continuous data contract audit completed with 0 drift errors. Automated lakehouse tables verified across ETL pipelines.',
    severity: 'success',
    category: 'data_pipeline',
    timestamp: '14 mins ago',
    isRead: false,
    actionTab: 'upgrades',
    actionLabel: 'Inspect Pipeline Health',
    metric: '99.98% Data Quality Score',
    details: 'Automated schema validators verified 12 upstream tables and 4 downstream dbt models with zero breaking field modifications.',
  },
  {
    id: 'alert-tax-1',
    title: 'IRS Section 179 Tech Depreciation Shield Validated',
    message: 'Section 179 first-year expense deduction limit verified ($1,220,000 statutory cap). S-Corp Reasonable Salary test passed.',
    severity: 'info',
    category: 'tax_legal',
    timestamp: '1 hour ago',
    isRead: false,
    actionTab: 'tax',
    actionLabel: 'View Tax Blueprint',
    metric: '$22,185 Est. SE Tax Shield',
    details: 'Operating entity LLC electing Form 2553 S-Corp status avoids 15.3% Self-Employment tax on K-1 distributions above reasonable W-2 baseline.',
  },
  {
    id: 'alert-bot-1',
    title: 'Playwright Headless Apply Bot Queued',
    message: '5 Federal Grants.gov application packages compiled with cryptographic Form 8821 verification. Ready for simulated or real dispatch.',
    severity: 'info',
    category: 'mlops_bot',
    timestamp: '2 hours ago',
    isRead: true,
    actionTab: 'grants',
    actionLabel: 'Configure Bot',
    metric: '5 Packages Ready',
    details: 'Headless Chromium bot will execute encrypted applicant payload submission with automated CSV audit logging.',
  },
  {
    id: 'alert-vault-1',
    title: 'SAM.gov & IRS Form 8821 Cryptographic Binding',
    message: 'AES-256 GCM token binding established for corporate credentials, SAM.gov UEI-ASTRO-2026-X89, and CAGE 8K9F2.',
    severity: 'success',
    category: 'security_vault',
    timestamp: '3 hours ago',
    isRead: true,
    actionTab: 'grants',
    actionLabel: 'View Document Vault',
    metric: 'SHA-256 Validated',
    details: 'Legal business credentials locked in secure local encrypted enclave. Ready for federal contract bidding.',
  },
  {
    id: 'alert-milestone-1',
    title: 'Critical Lifecycle Milestone Gate Approaching',
    message: 'Phase 1: Legal Entity & Operating Agreement deliverable pending final signature before bank account underwriting.',
    severity: 'warning',
    category: 'lifecycle_milestones',
    timestamp: '5 hours ago',
    isRead: true,
    actionTab: 'lifecycle',
    actionLabel: 'Review Milestones',
    metric: 'Step 3 Critical Path',
    details: 'Completing Phase 1 unlocks non-dilutive grant eligibility and S-Corporation tax status elections.',
  },
];

export function playAlertSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // Audio might be blocked by browser autoplay policy until user gesture
  }
}

export function generateDynamicAlert(businessName: string, activeModel: string): StatusAlert {
  const safeName = businessName || 'ASTRO LAB FAB';
  const templates: Array<{
    title: string;
    message: string;
    severity: StatusAlertSeverity;
    category: StatusAlertCategory;
    actionTab: TabId;
    actionLabel: string;
    metric: string;
    details: string;
  }> = [
    {
      title: 'ARPA-E Energy & DeepTech Solicitation Detected',
      message: `New federal grant matched to ${safeName}'s industrial classification. Award range: $500,000 to $3,500,000.`,
      severity: 'warning',
      category: 'grants',
      actionTab: 'grants',
      actionLabel: 'Inspect Grant',
      metric: '$3.5M Ceiling',
      details: 'Department of Energy ARPA-E open solicitation for autonomous systems and high-efficiency computational hardware.',
    },
    {
      title: 'Data Pipeline Anomaly Prevented',
      message: 'Automated repair script patched downstream schema mismatch in sales reporting pipeline.',
      severity: 'success',
      category: 'data_pipeline',
      actionTab: 'upgrades',
      actionLabel: 'View Telemetry',
      metric: 'Auto-Fixed 1 Anomaly',
      details: 'Self-healing engine detected column type conversion and generated backwards-compatible migration in 1.4s.',
    },
    {
      title: 'Quarterly Estimated Tax Reserve Calculated',
      message: `Recommended Q3 estimated tax deposit calculated for ${safeName} based on trailing 90-day gross receipts.`,
      severity: 'info',
      category: 'tax_legal',
      actionTab: 'tax',
      actionLabel: 'Open Tax Optimizer',
      metric: 'IRC Section 6654 Safe Harbor',
      details: 'Applying 110% prior-year safe harbor payment avoids IRS underpayment penalties while maximizing working capital.',
    },
    {
      title: 'Autonomous M&A Exit Multiple Calibrated',
      message: `Valuation multiple benchmarked at 14.5x ARR based on current ${activeModel} revenue predictability.`,
      severity: 'success',
      category: 'lifecycle_milestones',
      actionTab: 'valuation',
      actionLabel: 'Open War Room',
      metric: '14.5x Multiple Arbitrage',
      details: 'Target strategic acquirers identified in defense tech and cloud automation sectors.',
    },
    {
      title: 'Playwright Bot Batch Verification Completed',
      message: 'Cryptographic SHA-256 checks on SAM.gov credentials and IRS Form 8821 verified 100% valid.',
      severity: 'success',
      category: 'mlops_bot',
      actionTab: 'grants',
      actionLabel: 'View Bot Log',
      metric: 'AES-256 Encrypted',
      details: 'Automated audit log exported to encrypted storage enclave.',
    },
  ];

  const chosen = templates[Math.floor(Math.random() * templates.length)];
  return {
    id: `alert-dyn-${Date.now()}`,
    ...chosen,
    timestamp: 'Just now',
    isRead: false,
  };
}
