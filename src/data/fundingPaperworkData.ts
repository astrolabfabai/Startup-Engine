export interface FundingDocument {
  id: string;
  code: string;
  title: string;
  category: 'Federal Grant' | 'SBIR/STTR' | 'SBA Loan' | 'Tax & Entity' | 'Investor & GTM' | 'Compliance';
  agencyOrTarget: string;
  description: string;
  urgency: 'Day 1 Critical' | 'Standard Filing' | 'Post-Award';
  requiredFor: string[];
  filingPortal: string;
  externalUrl: string;
  estimatedPages: number;
  templateSections: {
    heading: string;
    description: string;
    sampleContent: string;
  }[];
}

export interface ProcessedPacketResult {
  industryId: string;
  industryName: string;
  totalDocuments: number;
  readyDocuments: number;
  autoApplyQueueEnabled: boolean;
  generatedDate: string;
  estimatedTotalGrantPool: string;
  documents: {
    docId: string;
    title: string;
    status: 'Ready for Review' | 'Submitted to Day 1 Queue' | 'Draft Complete';
    fullContent: string;
  }[];
}

export const FUNDING_PAPERWORK_CATALOG: FundingDocument[] = [
  {
    id: 'doc_sf424',
    code: 'SF-424',
    title: 'Application for Federal Assistance (Standard Form 424)',
    category: 'Federal Grant',
    agencyOrTarget: 'Grants.gov / All Federal Agencies (NSF, NIH, DOE, DOD)',
    description: 'The mandatory core cover sheet and organizational authorization form required for all federal discretionary grant and cooperative agreement applications.',
    urgency: 'Day 1 Critical',
    requiredFor: ['All SBIR/STTR Phase I/II', 'NSF Discretionary Grants', 'DOE Clean Energy Grants', 'NIH Research Grants'],
    filingPortal: 'https://www.grants.gov/forms/forms-repository/sf-424-family',
    externalUrl: 'https://www.grants.gov/forms/forms-repository/sf-424-family',
    estimatedPages: 3,
    templateSections: [
      {
        heading: 'Applicant Information & Entity Identifiers',
        description: 'Legal business name, SAM.gov Unique Entity Identifier (UEI), CAGE Code, and Taxpayer Identification Number (TIN/EIN).',
        sampleContent: 'Applicant: ASTRO LAB FAB TECHNOLOGIES INC.\nUEI: Z9X4MN88LKQ2\nCAGE: 9K8B1\nEIN: 93-8472910\nAddress: 100 Innovation Parkway, Suite 400\nType of Applicant: Small Business (For-Profit Organization, <500 Employees)',
      },
      {
        heading: 'Proposed Project Details',
        description: 'Descriptive title of applicant project, start/end dates, and congressional district.',
        sampleContent: 'Project Title: Autonomous Industry Acceleration and High-Throughput Verification Engine\nProposed Start Date: 30 Days from Award\nDuration: 12 Months\nCongressional District: CA-12',
      },
      {
        heading: 'Estimated Federal & Non-Federal Funding Breakdown',
        description: 'Total federal funds requested and matching non-federal contributions.',
        sampleContent: 'Federal Funding Requested: $275,000.00\nNon-Federal Matching: $0.00 (100% Non-Dilutive Grant)\nTotal Proposed Project Cost: $275,000.00',
      },
    ],
  },
  {
    id: 'doc_sf424a',
    code: 'SF-424A',
    title: 'Budget Information for Non-Construction Programs',
    category: 'Federal Grant',
    agencyOrTarget: 'Grants.gov / Federal Program Officers',
    description: 'Detailed financial category cost breakdown including personnel, fringe benefits, travel, equipment, supplies, contractual, and indirect rates.',
    urgency: 'Day 1 Critical',
    requiredFor: ['Grants.gov Submissions', 'NIH SBIR Budget', 'NSF Budget Table'],
    filingPortal: 'https://www.grants.gov/forms/forms-repository/sf-424-family',
    externalUrl: 'https://www.grants.gov/forms/forms-repository/sf-424-family',
    estimatedPages: 4,
    templateSections: [
      {
        heading: 'Section A - Budget Summary by Activity',
        description: 'Summary of proposed grant budget by project activity and federal share.',
        sampleContent: 'Activity 1: Core Architecture & AI Model Validation: $115,000\nActivity 2: Prototype Hardware / Security Testing: $85,000\nActivity 3: Commercial Pilot Verification & User Testing: $75,000\nTotal Direct & Indirect: $275,000',
      },
      {
        heading: 'Section B - Budget Categories',
        description: 'Line item breakdown across Personnel, Supplies, Contractual, and Indirect Costs.',
        sampleContent: 'a. Personnel (Lead PI + 2 Senior Engineers): $142,000\nb. Fringe Benefits (22%): $31,240\nc. Equipment & Cloud Compute (GPU Instances): $32,000\nd. Supplies & Software Tooling: $14,000\ne. Contractual Sub-audits: $18,000\nf. Indirect Costs (15.5% Safe Harbor): $37,760',
      },
    ],
  },
  {
    id: 'doc_tech_narrative',
    code: 'TECH-NARRATIVE',
    title: 'Technical Project Narrative & Research Plan (15-Page Volume)',
    category: 'SBIR/STTR',
    agencyOrTarget: 'NSF, DARPA, DOE, NIH Peer Review Panels',
    description: 'The core technical submission detailing innovation novelty, technical hurdles, experimental work plan, milestones, and commercial feasibility.',
    urgency: 'Day 1 Critical',
    requiredFor: ['SBIR Phase I Technical Proposal', 'STTR Research Volume', 'DARPA BAA Submissions'],
    filingPortal: 'https://www.sbir.gov/about-sbir',
    externalUrl: 'https://www.sbir.gov/about-sbir',
    estimatedPages: 15,
    templateSections: [
      {
        heading: '1. Identification and Significance of the Problem',
        description: 'Articulates the critical market gap and engineering barrier currently unsolved by commercial off-the-shelf software.',
        sampleContent: 'Current market solutions suffer from high latency, privacy vulnerabilities, and rigid manual workflows. This proposal establishes a self-healing autonomous pipeline that lowers deployment time by 85% while guaranteeing zero-data leakage.',
      },
      {
        heading: '2. Technical Objectives & Measurable Milestones',
        description: 'Specific engineering quantitative metrics to be proven during Phase I feasibility.',
        sampleContent: 'Milestone 1 (Months 1-3): Achieve <45ms response latency across 10,000 concurrent vector transactions.\nMilestone 2 (Months 4-7): Verify 99.8% precision on automated schema extraction.\nMilestone 3 (Months 8-12): Execute live pilot verification with 3 alpha enterprise customers.',
      },
      {
        heading: '3. Detailed Work Plan & Experimental Methodology',
        description: 'Task-by-task execution schedule, assigned personnel, risk mitigation, and validation criteria.',
        sampleContent: 'Task 1.1: Core Algorithm Optimization\nTask 1.2: Security Sandboxing & NIST Compliance Guardrails\nTask 2.1: Automated Test Harness & Synthetic Benchmarking\nTask 2.2: User Acceptance Pilot Deployment',
      },
    ],
  },
  {
    id: 'doc_commercialization',
    code: 'COMM-PLAN',
    title: 'Commercialization & Go-to-Market Strategy Plan',
    category: 'SBIR/STTR',
    agencyOrTarget: 'Federal Commercialization Reviewers & Private Investors',
    description: 'Proves the transition path from federally funded R&D into a high-growth scalable revenue-generating enterprise.',
    urgency: 'Standard Filing',
    requiredFor: ['SBIR Phase I/II Commercialization Plan', 'NSF Pitch Volume', 'Investor Due Diligence'],
    filingPortal: 'https://www.sbir.gov/commercialization',
    externalUrl: 'https://www.sbir.gov/commercialization',
    estimatedPages: 6,
    templateSections: [
      {
        heading: 'Market Opportunity & Addressable TAM/SAM/SOM',
        description: 'Validated market sizing, customer acquisition channels, and pricing structure.',
        sampleContent: 'Total Addressable Market (TAM): Multi-Billion Dollar sector.\nServiceable Addressable Market (SAM): Top 15% Tier-1 and Tier-2 Enterprise Accounts.\nTarget Pricing: $499 - $2,499/month SaaS + High-Margin Managed Advisory ($12,500 fixed).',
      },
      {
        heading: 'Customer Discovery & Letters of Support',
        description: 'Validated conversations with prospective enterprise buyers and signed pilot agreements.',
        sampleContent: 'Conducted 35 structured customer discovery interviews with VP of Operations and Chief Technology Officers. Secured 3 conditional Letters of Intent (LOIs) for post-grant commercial adoption.',
      },
    ],
  },
  {
    id: 'doc_sam_gov',
    code: 'SAM-REG',
    title: 'SAM.gov Entity Registration & CAGE Code Verification Packet',
    category: 'Compliance',
    agencyOrTarget: 'General Services Administration (GSA) / DOD DLA',
    description: 'Mandatory active entity registration required to receive federal grants, contracts, and electronic funds transfers.',
    urgency: 'Day 1 Critical',
    requiredFor: ['All Federal Grant Disbursements', 'USAspending Prime Awards', 'SBIR.gov Linking'],
    filingPortal: 'https://sam.gov/content/entity-registration',
    externalUrl: 'https://sam.gov/content/entity-registration',
    estimatedPages: 2,
    templateSections: [
      {
        heading: 'Entity Identification & NAICS Sector Codes',
        description: 'Primary and secondary NAICS codes defining industry operational scope.',
        sampleContent: 'Primary NAICS: 541511 (Custom Computer Programming Services)\nSecondary NAICS: 541512 (Computer Systems Design Services), 541715 (R&D in Physical, Engineering, and Life Sciences)\nPSC Codes: DA01, AC11, R425\nDisaster Response Registry: Enrolled',
      },
      {
        heading: 'FAR Reps and Certifications',
        description: 'Mandatory Federal Acquisition Regulation standard representations and corporate compliance declarations.',
        sampleContent: 'Small Business Status: Self-Certified Small Disadvantaged Business\nExecutive Compensation Reporting: Compliant\nTelecommunications Equipment Prohibition (FAR 52.204-25): Fully Certified',
      },
    ],
  },
  {
    id: 'doc_biosketches',
    code: 'BIO-SKETCH',
    title: 'Key Personnel Biographical Sketches & Current/Pending Support',
    category: 'Federal Grant',
    agencyOrTarget: 'NSF / NIH / Federal Program Managers',
    description: 'Standardized curriculum vitae format documenting principal investigator expertise, publications, and funding commitments.',
    urgency: 'Standard Filing',
    requiredFor: ['NSF SciENcv Biosketches', 'NIH Format Biosketch', 'DOD Key Personnel Form'],
    filingPortal: 'https://www.ncbi.nlm.nih.gov/sciencv/',
    externalUrl: 'https://www.ncbi.nlm.nih.gov/sciencv/',
    estimatedPages: 5,
    templateSections: [
      {
        heading: 'Professional Preparation & Positions',
        description: 'Education, degrees earned, and key industry / academic appointments.',
        sampleContent: 'Principal Investigator: Lead Systems Architect & Research Director\nEducation: M.S. Computer Science / B.S. Engineering\nRelevant Experience: 10+ Years in Distributed Systems, Real-Time Automation, and Enterprise Security Architecture.',
      },
      {
        heading: 'Current and Pending Project Commitments',
        description: 'Proves PI has sufficient dedicated time allocation (minimum 51% for SBIR) to lead the project.',
        sampleContent: 'Commitment to Proposed Project: 6.0 Person-Months (50% Calendar Effort)\nOther Federal Grants: None (Zero Active Conflicts)',
      },
    ],
  },
  {
    id: 'doc_data_ip_plan',
    code: 'DMP-IP',
    title: 'Data Management, IP Protection & Cybersecurity Plan',
    category: 'Compliance',
    agencyOrTarget: 'Federal Agencies / USPTO / NIST',
    description: 'Details data storage protocols, public access compliance, trade secret safeguarding, and patent filing roadmap.',
    urgency: 'Standard Filing',
    requiredFor: ['Federal Data Management Compliance', 'USPTO Provisional Patents', 'NIST SP 800-171'],
    filingPortal: 'https://www.uspto.gov/patents/apply',
    externalUrl: 'https://www.uspto.gov/patents/apply',
    estimatedPages: 3,
    templateSections: [
      {
        heading: 'Data Storage, Retention & Security Controls',
        description: 'Data encryption in transit (TLS 1.3) and at rest (AES-256), access logs, and disaster recovery.',
        sampleContent: 'All generated research data and code artifacts are secured in SOC2 Type II and FedRAMP authorized cloud environments with automated hourly immutable snapshots.',
      },
      {
        heading: 'Intellectual Property Protection Strategy',
        description: 'Provisional patent filings, copyright registrations, and trade secret segregation.',
        sampleContent: 'Provisional patent applications covering novel algorithmic state resolution scheduled for filing prior to public Phase I demonstration.',
      },
    ],
  },
  {
    id: 'doc_sba_1919',
    code: 'SBA-1919',
    title: 'SBA Form 1919: Borrower Information & Microloan Disclosure',
    category: 'SBA Loan',
    agencyOrTarget: 'U.S. Small Business Administration / Preferred Lenders',
    description: 'The standard borrower application for SBA 7(a) loans, 504 loans, and SBA microloans providing non-dilutive low-interest working capital.',
    urgency: 'Standard Filing',
    requiredFor: ['SBA 7(a) Working Capital Loan ($50K-$5M)', 'SBA Express Loan', 'Community Advantage Financing'],
    filingPortal: 'https://www.sba.gov/document/sba-form-1919-borrower-information-form',
    externalUrl: 'https://www.sba.gov/document/sba-form-1919-borrower-information-form',
    estimatedPages: 4,
    templateSections: [
      {
        heading: 'Applicant Business & Ownership Breakdown',
        description: 'Listing of all 20%+ equity owners, citizenship, and corporate entity structure.',
        sampleContent: 'Business Legal Structure: C-Corporation\nOwnership: 100% US Citizens / Permanent Residents\nAffiliated Entities: None\nUse of Proceeds: Software Infrastructure, Hardware Tooling, Working Capital',
      },
      {
        heading: 'Eligibility Declarations & Good Standing',
        description: 'Mandatory criminal history, credit certification, and federal debt delinquency checks.',
        sampleContent: 'Delinquent Federal Debt: None\nPrior SBA Loans: In Good Standing / First-time Applicant\nCharacter & Financial Eligibility: Certified Clean',
      },
    ],
  },
  {
    id: 'doc_irs_ss4',
    code: 'IRS-SS4',
    title: 'IRS Form SS-4: Federal Employer Identification Number (EIN) Packet',
    category: 'Tax & Entity',
    agencyOrTarget: 'Internal Revenue Service (IRS)',
    description: 'Official federal tax ID assignment necessary to open commercial bank accounts, run payroll, and establish business credit.',
    urgency: 'Day 1 Critical',
    requiredFor: ['Business Bank Account Opening', 'SAM.gov Registration', 'State Corporate Filings'],
    filingPortal: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
    externalUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
    estimatedPages: 1,
    templateSections: [
      {
        heading: 'Entity Tax Classification & Activity',
        description: 'Principal business activity, responsible party SSN/ITIN, and accounting year end.',
        sampleContent: 'Type of Entity: Corporation\nPrincipal Activity: Technology Software & Advisory Services\nAccounting Year Ending: December 31\nNumber of Anticipated Employees in Next 12 Months: 5',
      },
    ],
  },
  {
    id: 'doc_dcaa_accounting',
    code: 'DCAA-CHART',
    title: 'DCAA-Compliant Chart of Accounts & Indirect Rate Agreement',
    category: 'Compliance',
    agencyOrTarget: 'Defense Contract Audit Agency (DCAA) / Defense Contract Management Agency (DCMA)',
    description: 'Standard accounting job cost segregation policy required to pass pre-award financial audits and claim allowable indirect overhead rates.',
    urgency: 'Standard Filing',
    requiredFor: ['DOD Cost-Plus Contracts', 'SBIR Phase II Overhead Rates', 'DARPA Invoicing'],
    filingPortal: 'https://www.dcaa.mil/Checklists-and-Tools/',
    externalUrl: 'https://www.dcaa.mil/Checklists-and-Tools/',
    estimatedPages: 4,
    templateSections: [
      {
        heading: 'Direct vs. Indirect Cost Segregation Policy',
        description: 'Written corporate policy establishing separate GL accounts for unallowable expenses (FAR Part 31).',
        sampleContent: 'Direct Project Labor: Account 5000\nFringe Benefits Pool: Account 6000 (Payroll taxes, health insurance, 401k match)\nOverhead Pool: Account 7000 (Software dev tools, test equipment)\nG&A Pool: Account 8000 (Legal, accounting, executive management)\nUnallowable Costs: Account 9900 (Strictly isolated)',
      },
    ],
  },
  {
    id: 'doc_pitch_deck',
    code: 'INVESTOR-TEASER',
    title: 'Executive Pitch Teaser & 3-Year Pro Forma Financial Model',
    category: 'Investor & GTM',
    agencyOrTarget: 'Angel Investors, Venture Capital, & Seed Accelerators',
    description: 'A crisp, high-impact institutional executive brief summarizing unit economics, SaaS traction metrics, and capital capitalization table.',
    urgency: 'Standard Filing',
    requiredFor: ['Seed Capital Raising ($500K-$2M)', 'Accelerator Applications (Y Combinator, Techstars)', 'Strategic Corporate Partnerships'],
    filingPortal: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    externalUrl: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    estimatedPages: 3,
    templateSections: [
      {
        heading: 'Executive Problem / Solution Summary',
        description: 'Concise value proposition, moat, and unfair technology advantage.',
        sampleContent: 'Problem: High manual operational costs and fragmented vendor tooling.\nSolution: High-throughput automated enterprise engine delivering 10x ROI in 30 days.\nMoat: Proprietary compliance data models + non-dilutive federal grant backing.',
      },
      {
        heading: '3-Year Pro Forma Revenue Projections',
        description: 'ARR growth targets, gross margins (80%+), customer acquisition costs (CAC), and LTV.',
        sampleContent: 'Year 1: $480,000 ARR (15 Enterprise Clients @ $32K/yr average)\nYear 2: $2,100,000 ARR (65 Clients + Expansion Tiers)\nYear 3: $6,500,000 ARR (Targeting 88% Gross Margin & Positive Free Cash Flow)',
      },
    ],
  },
  {
    id: 'doc_facilities',
    code: 'FACILITIES-RES',
    title: 'Facilities, Equipment & Computational Resources Statement',
    category: 'Federal Grant',
    agencyOrTarget: 'Federal Science Agencies (DOE, NSF, DOD)',
    description: 'Details physical laboratories, cloud compute infrastructure, high-performance GPU clusters, and specialized software licenses.',
    urgency: 'Standard Filing',
    requiredFor: ['NSF Facilities & Resources Document', 'DOE Project Resources Page', 'DOD Lab Access Verification'],
    filingPortal: 'https://www.grants.gov',
    externalUrl: 'https://www.grants.gov',
    estimatedPages: 2,
    templateSections: [
      {
        heading: 'Computational Environment & Cloud Infrastructure',
        description: 'Dedicated GPU clusters, container orchestration, and automated CI/CD pipeline capabilities.',
        sampleContent: 'Computational Resources: Dedicated cloud VPC with high-performance H100/A100 GPU compute nodes, distributed Kubernetes clusters, and automated continuous integration testing frameworks.',
      },
    ],
  },
];

export function getDocumentByCode(code: string): FundingDocument | undefined {
  return FUNDING_PAPERWORK_CATALOG.find(doc => doc.code === code);
}

export function generateFundingPacket(
  industryName: string,
  industryId: string,
  grantFundingText: string,
  autoApplyOnDay1: boolean = true,
  selectedProductNames: string[] = []
): ProcessedPacketResult {
  const docs = FUNDING_PAPERWORK_CATALOG.map(doc => {
    const isDay1 = doc.urgency === 'Day 1 Critical';
    const status = autoApplyOnDay1 && isDay1
      ? ('Submitted to Day 1 Queue' as const)
      : ('Ready for Review' as const);

    const fullContent = `================================================================================
FORM CODE: ${doc.code}
DOCUMENT: ${doc.title}
CATEGORY: ${doc.category}
TARGET AGENCY / PORTAL: ${doc.agencyOrTarget}
EXTERNAL OFFICIAL PORTAL: ${doc.externalUrl}
APPLICANT ENTERPRISE: ASTRO LAB FAB - ${industryName.toUpperCase()}
TARGET FOCUS AREA: ${industryName} (${grantFundingText})
AUTO-APPLY STATUS: ${status}
SELECTED TARGET OFFERINGS: ${selectedProductNames.length > 0 ? selectedProductNames.join(', ') : 'All Sector Offerings'}
================================================================================

${doc.templateSections
  .map(
    sec => `--- ${sec.heading.toUpperCase()} ---
Description: ${sec.description}

${sec.sampleContent}
`
  )
  .join('\n')}
================================================================================
End of Document [${doc.code}] - Certified Compliant with Federal Guidelines
================================================================================`;

    return {
      docId: doc.id,
      title: `${doc.code}: ${doc.title}`,
      status,
      fullContent,
    };
  });

  return {
    industryId,
    industryName,
    totalDocuments: docs.length,
    readyDocuments: docs.length,
    autoApplyQueueEnabled: autoApplyOnDay1,
    generatedDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    estimatedTotalGrantPool: grantFundingText || '$1.5+ Billion',
    documents: docs,
  };
}
