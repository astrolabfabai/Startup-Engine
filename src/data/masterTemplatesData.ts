// Master Business Plan, Startup SOP Manual & Application Workbook Data

export interface PlanSectionDetail {
  id: string;
  title: string;
  category: string;
  purpose: string;
  keyFields: { fieldName: string; description: string; exampleValue: string; tips: string }[];
  aiAutomationTip: string;
  n8nWorkflowIdea: string;
}

export interface ProductServiceItem {
  id: string;
  name: string;
  category: 'Product' | 'Service';
  valueProp: string;
  pricingModel: string;
  targetSegment: string;
  aiEnhancement: string;
}

export interface FinancialYearProjection {
  year: number;
  revenue: string;
  cogs: string;
  grossProfit: string;
  opex: string;
  ebitda: string;
  netIncome: string;
  kpis: string[];
}

export interface MasterBusinessPlanTemplate {
  title: string;
  description: string;
  sections: PlanSectionDetail[];
  products: ProductServiceItem[];
  services: ProductServiceItem[];
  financialProjections: FinancialYearProjection[];
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  kpiDashboardMetrics: { metric: string; target: string; frequency: string; owner: string }[];
}

export interface SopStepGuide {
  id: string;
  title: string;
  category: string;
  objective: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredDocs: string[];
  stepByStepInstructions: string[];
  checklists: string[];
  disasterRecoveryTip: string;
  aiAutomationOpportunity: string;
}

export interface ApplicationWorksheetField {
  fieldId: string;
  fieldName: string;
  explanation: string;
  whatBelongsHere: string;
  commonAcceptableValues: string;
  submissionTip: string;
}

export interface ApplicationWorksheet {
  id: string;
  title: string;
  purpose: string;
  issuingAgencyOrBody: string;
  requiredSupportingDocs: string[];
  prepChecklist: string[];
  fields: ApplicationWorksheetField[];
  expertSubmissionTips: string[];
}

// 1. MASTER BUSINESS PLAN TEMPLATE
export const MASTER_BUSINESS_PLAN_TEMPLATE: MasterBusinessPlanTemplate = {
  title: "Universal Master Business Plan Template",
  description: "Comprehensive 18-section business framework applicable to any industry with AI automation, n8n opportunities, 10 products & 10 services catalogs, and 5-year financial projections.",
  swotAnalysis: {
    strengths: [
      "Proprietary 145-step autonomous startup execution pipeline",
      "High gross margins (>82%) on digital products & enterprise SaaS",
      "Modular multi-agent AI framework for rapid SOW generation and auditing",
      "Experienced core team with domain expertise in AI & corporate law"
    ],
    weaknesses: [
      "Initial brand recognition requires strategic B2B content marketing",
      "Dependence on third-party cloud infrastructure (GCP / AWS / Firebase)",
      "CapEx required for advanced GPU model fine-tuning"
    ],
    opportunities: [
      "Rapidly expanding SMB market adopting AI-driven automation tools ($120B TAM)",
      "Federal & state grant funding (SBIR / STTR) for AI research and development",
      "Enterprise licensing of automated business valuation & decision gate algorithms"
    ],
    threats: [
      "Evolving regulatory compliance landscape around AI disclosures (EU AI Act)",
      "Aggressive price competition from legacy ERP and consulting incumbents",
      "Cybersecurity and data privacy vulnerabilities"
    ]
  },
  products: [
    { id: "PROD-01", name: "Autonomous Startup Pipeline Engine", category: "Product", valueProp: "145-step guided execution engine with algorithmic valuation scoring.", pricingModel: "$499/mo SaaS", targetSegment: "Tech Founders & Venture Studios", aiEnhancement: "Automated step execution & deliverable drafting via Gemini 2.5." },
    { id: "PROD-02", name: "IRS Tax Deduction & Mileage Tracker App", category: "Product", valueProp: "Real-time IRS mileage calculation & Schedule C deduction optimization.", pricingModel: "$149/yr Annual", targetSegment: "Sole Proprietors & Freelancers", aiEnhancement: "AI optical receipt scanning & automatic expense categorization." },
    { id: "PROD-03", name: "AI Statement of Work (SOW) Generator", category: "Product", valueProp: "Generates legal-grade enterprise SOW contracts in 60 seconds.", pricingModel: "$99/mo per Seat", targetSegment: "Agencies & Tech Consultants", aiEnhancement: "Natural language contract clause audit & risk identification." },
    { id: "PROD-04", name: "Grants.gov API Opportunity Aggregator", category: "Product", valueProp: "Real-time non-dilutive federal grant matching & alert system.", pricingModel: "$299/mo B2B", targetSegment: "R&D Startups & Universities", aiEnhancement: "AI grant proposal outline generation matching agency guidelines." },
    { id: "PROD-05", name: "Corporate Valuation & Decision Gate Portal", category: "Product", valueProp: "Algorithmic 6-driver valuation modeling & GO/REVISE decision gates.", pricingModel: "$1,200/yr Enterprise", targetSegment: "Angel Investors & Accelerators", aiEnhancement: "Monte Carlo simulation of financial risk drivers." },
    { id: "PROD-06", name: "Branding & Ad Video Blueprint Toolkit", category: "Product", valueProp: "Generates 15s, 30s, and 60s high-converting video ad storyboards.", pricingModel: "$49/pack", targetSegment: "E-Commerce & Digital Marketers", aiEnhancement: "Text-to-Video prompt synthesizer for AI Studio generation." },
    { id: "PROD-07", name: "Business Credit Builder Dashboard", category: "Product", valueProp: "Step-by-step D-U-N-S and Tier 1-3 vendor credit building suite.", pricingModel: "$199 One-time", targetSegment: "New LLCs & Small Businesses", aiEnhancement: "Automated tradeline reporting & credit profile monitoring." },
    { id: "PROD-[#8]", name: "n8n Enterprise Automation Flow Pack", category: "Product", valueProp: "Pre-built webhooks and API orchestration templates for n8n.", pricingModel: "$349/pack", targetSegment: "DevOps & Automation Engineers", aiEnhancement: "Self-healing error retry workflows with AI prompt fallbacks." },
    { id: "PROD-09", name: "IRS Business Master File Search Portal", category: "Product", valueProp: "Searchable database of verified EIN records and NAICS codes.", pricingModel: "$79/mo API Access", targetSegment: "B2B Sales Teams & Analysts", aiEnhancement: "Automated NAICS code mapping from company domain names." },
    { id: "PROD-10", name: "Disaster Recovery & Compliance Vault", category: "Product", valueProp: "Encrypted document storage with automated compliance reminder logs.", pricingModel: "$99/yr Add-on", targetSegment: "All Incorporated Entities", aiEnhancement: "AI automated audit of filing deadlines and corporate minutes." }
  ],
  services: [
    { id: "SERV-01", name: "Custom Enterprise AI Workflow Development", category: "Service", valueProp: "Bespoke n8n and Python automation pipelines for enterprise back-offices.", pricingModel: "$15,000 / Project", targetSegment: "Mid-Market Corporations", aiEnhancement: "AI agentic code generation and pipeline validation." },
    { id: "SERV-02", name: "SOW Contract Risk Audit & Negotiation Support", category: "Service", valueProp: "Expert legal and technical review of vendor SOW contracts.", pricingModel: "$2,500 / Audit", targetSegment: "Enterprise Procurement Departments", aiEnhancement: "LLM clause comparison against corporate playbook standards." },
    { id: "SERV-03", name: "Grant Proposal Writing & Submission Management", category: "Service", valueProp: "Full-service grant drafting, technical writing, and portal submission.", pricingModel: "10% Success Fee + $3,000 retainer", targetSegment: "Biotech & Deep Tech Startups", aiEnhancement: "AI literature review synthesis and budget justification formatting." },
    { id: "SERV-[#4]", name: "Corporate Incorporation & EIN Setup Service", category: "Service", valueProp: "Turnkey Delaware/Wyoming LLC/Corp filing, EIN, and bank account setup.", pricingModel: "$799 + State Fees", targetSegment: "International & First-time Founders", aiEnhancement: "Automated state filing document pre-population." },
    { id: "SERV-05", name: "Business Credit Line Advisory & Tier Setup", category: "Service", valueProp: "Guaranteed $50k+ business credit building roadmap within 180 days.", pricingModel: "$3,500 Advisor Fee", targetSegment: "Capital-Intensive Startups", aiEnhancement: "Real-time credit score optimization algorithms." },
    { id: "SERV-06", name: "Fractional Chief Automation Officer (CAO)", category: "Service", valueProp: "Part-time executive leadership to automate company operations.", pricingModel: "$6,000 / month", targetSegment: "Growing Companies ($2M-$10M ARR)", aiEnhancement: "Weekly AI automation audit and efficiency dashboards." },
    { id: "SERV-07", name: "R&D Tax Credit Calculation & IRS Defense", category: "Service", valueProp: "Full calculation of Form 6765 federal R&D tax credits.", pricingModel: "15% of Claimed Credit", targetSegment: "Software & Engineering Firms", aiEnhancement: "Automated git commit & developer hourly log parsing." },
    { id: "SERV-08", name: "SBA 7(a) & 504 Loan Package Preparation", category: "Service", valueProp: "Bank-ready SBA application binder with 3-year cash flow projections.", pricingModel: "$4,500 Flat Fee", targetSegment: "Physical Retail & Franchise Buyers", aiEnhancement: "Financial statement auto-formatting to bank underwriting criteria." },
    { id: "SERV-09", name: "Disaster Recovery & Data Resilience Audit", category: "Service", valueProp: "Comprehensive audit of cloud infrastructure, backup SOPs, and failovers.", pricingModel: "$5,000 / Audit", targetSegment: "Healthcare & Fintech Firms", aiEnhancement: "Simulated cyber-attack & data recovery testing script." },
    { id: "SERV-10", name: "Custom AI Studio Applet Design & Deployment", category: "Service", valueProp: "End-to-end design of custom interactive Web applets in AI Studio.", pricingModel: "$8,500 / Applet", targetSegment: "Corporate Strategy & Training Depts", aiEnhancement: "Gemini-powered natural language UI customization." }
  ],
  financialProjections: [
    { year: 1, revenue: "$450,000", cogs: "$81,000", grossProfit: "$369,000", opex: "$240,000", ebitda: "$129,000", netIncome: "$101,910", kpis: ["Active Clients: 45", "CAC: $620", "LTV: $10,000", "Gross Margin: 82%"] },
    { year: 2, revenue: "$1,850,000", cogs: "$296,000", grossProfit: "$1,554,000", opex: "$720,000", ebitda: "$834,000", netIncome: "$658,860", kpis: ["Active Clients: 190", "CAC: $480", "LTV: $14,500", "Gross Margin: 84%"] },
    { year: 3, revenue: "$5,200,000", cogs: "$728,000", grossProfit: "$4,472,000", opex: "$1,800,000", ebitda: "$2,672,000", netIncome: "$2,110,880", kpis: ["Active Clients: 550", "CAC: $390", "LTV: $18,200", "Gross Margin: 86%"] },
    { year: 4, revenue: "$12,400,000", cogs: "$1,612,000", grossProfit: "$10,788,000", opex: "$3,900,000", ebitda: "$6,888,000", netIncome: "$5,441,520", kpis: ["Active Clients: 1,200", "CAC: $320", "LTV: $22,000", "Gross Margin: 87%"] },
    { year: 5, revenue: "$24,500,000", cogs: "$2,940,000", grossProfit: "$21,560,000", opex: "$7,100,000", ebitda: "$14,460,000", netIncome: "$11,423,400", kpis: ["Active Clients: 2,500", "CAC: $280", "LTV: $26,500", "Gross Margin: 88%"] }
  ],
  kpiDashboardMetrics: [
    { metric: "Monthly Recurring Revenue (MRR)", target: "$100,000 / mo", frequency: "Real-Time / Daily", owner: "CEO / Head of Growth" },
    { metric: "Customer Acquisition Cost (CAC)", target: "< $400", frequency: "Weekly", owner: "CMO / Marketing Lead" },
    { metric: "Lifetime Value (LTV) : CAC Ratio", target: "> 4.5x", frequency: "Monthly", owner: "CFO / Finance Lead" },
    { metric: "Net Revenue Retention (NRR)", target: "> 125%", frequency: "Monthly", owner: "Head of Customer Success" },
    { metric: "Gross Margin Percentage", target: "> 85%", frequency: "Monthly", owner: "CFO" },
    { metric: "SOW Audit Turnaround Time", target: "< 4 Hours", frequency: "Daily", owner: "Operations Lead" }
  ],
  sections: [
    {
      id: "EX_SUM",
      title: "Executive Summary & Vision",
      category: "Strategic Foundation",
      purpose: "Provide a compelling, high-level summary of the venture, problem solved, market opportunity, financial highlights, and capital requirements.",
      keyFields: [
        { fieldName: "Company Name & Legal Entity", description: "Official corporate name and entity structure.", exampleValue: "ASTRO LAB FAB INC. (Delaware C-Corp)", tips: "Match exact spelling on IRS Form SS-4 and state registration." },
        { fieldName: "Mission Statement", description: "Clear, 1-2 sentence core purpose.", exampleValue: "To democratize enterprise business execution through autonomous AI pipelines and algorithmic decision tools.", tips: "Keep under 30 words; focus on customer outcome." },
        { fieldName: "Core Problem & Solution", description: "The burning market pain and your distinct advantage.", exampleValue: "Problem: Startups waste $150k+ on slow manual consulting. Solution: Autonomous 145-step AI pipeline delivering instant SOPs and financial rubrics.", tips: "Quantify the time or dollar savings." },
        { fieldName: "Financial Highlights & Ask", description: "Funding target, use of funds, and 3-year target revenue.", exampleValue: "Seeking $1.5M Seed round at $10M valuation to accelerate AI development and expand B2B sales team.", tips: "State exact allocation breakdown (% R&D, Sales, Ops)." }
      ],
      aiAutomationTip: "Use Gemini 2.5 Flash to automatically condense the 18-section business plan into a 1-page executive summary formatted for venture capital pitch decks.",
      n8nWorkflowIdea: "Trigger an n8n webhook upon form submission to automatically draft an Executive Summary PDF and email it to prospective investors."
    },
    {
      id: "MKT_ANALYSIS",
      title: "Market Analysis, TAM/SAM/SOM & Competitive Moats",
      category: "Market Opportunity",
      purpose: "Demonstrate market size, target customer personas, growth CAGR, and competitive moat defensibility.",
      keyFields: [
        { fieldName: "TAM (Total Addressable Market)", description: "Global potential revenue for your category.", exampleValue: "$120 Billion (Global Business Process Automation & AI Software)", tips: "Use credible industry analyst reports (Gartner, IDC, McKinsey)." },
        { fieldName: "SAM (Serviceable Addressable Market)", description: "Segment of TAM reachable by your product.", exampleValue: "$12.5 Billion (North American SMB & Venture Studio Tech Tools)", tips: "Filter TAM by geography and customer size." },
        { fieldName: "SOM (Serviceable Obtainable Market)", description: "Realistic market share captured in years 1-3.", exampleValue: "$450 Million (0.1% capture of US tech startups & agencies)", tips: "Base on your direct sales team capacity." },
        { fieldName: "Competitive Moat", description: "Defensible unfair advantage.", exampleValue: "Proprietary 145-step database schema & algorithmic valuation scoring matrix.", tips: "Highlight network effects, IP, or data flywheels." }
      ],
      aiAutomationTip: "Run automated Web scraping scripts to monitor competitor pricing changes and aggregate market news directly into your market analysis dashboard.",
      n8nWorkflowIdea: "Schedule weekly n8n workflows to pull Google Trends and Grants.gov keyword volume for market demand tracking."
    },
    {
      id: "PRODUCT_LINE",
      title: "10 Products & 10 Services Architecture",
      category: "Product Strategy",
      purpose: "Define the complete catalog of 10 digital/SaaS products and 10 tech-enabled high-margin services.",
      keyFields: [
        { fieldName: "Product Catalog (10 Items)", description: "List of core SaaS tools, desktop engines, and downloadable automation packs.", exampleValue: "See 10 Products table above (SaaS Pipeline, Tax Tracker, SOW Audit, Grants Matching, etc.)", tips: "Ensure distinct price tiers from entry to enterprise." },
        { fieldName: "Service Catalog (10 Items)", description: "List of tech-enabled consulting, legal compliance, and fractional executive services.", exampleValue: "See 10 Services table above (Custom Workflows, SOW Review, Grant Writing, CAO, etc.)", tips: "Maintain >60% gross margin on services by leveraging AI." }
      ],
      aiAutomationTip: "Auto-generate product feature comparison charts and service Statement of Work (SOW) blueprints using structured JSON schema prompts.",
      n8nWorkflowIdea: "Integrate Stripe webhooks with n8n to instantly provision client user accounts upon product purchase."
    },
    {
      id: "BUDGET_FINANCIALS",
      title: "Startup Budget & 5-Year Financial Projections",
      category: "Financial Architecture",
      purpose: "Establish detailed startup capital requirements, CapEx/OpEx breakdown, and 1/3/5-year income statements.",
      keyFields: [
        { fieldName: "Initial Startup Budget", description: "Capital required before initial revenue launch.", exampleValue: "$125,000 (Legal $15k, Software Dev $60k, Branding/Web $20k, Working Capital $30k)", tips: "Include 20% contingency buffer." },
        { fieldName: "Year 1 Revenue & Net Profit", description: "First year top-line and bottom-line target.", exampleValue: "Revenue: $450,000 | Net Profit: $101,910 (22.6% Net Margin)", tips: "Keep Year 1 revenue conservative with ramp-up in Q3/Q4." },
        { fieldName: "Year 3 & 5 Projections", description: "Long-term scaling metrics.", exampleValue: "Year 3: $5.2M Revenue / $2.11M Net | Year 5: $24.5M Revenue / $11.42M Net", tips: "Ensure OpEx scales slower than revenue to show operating leverage." }
      ],
      aiAutomationTip: "Run Monte Carlo financial risk simulations to test revenue sensitivity against varying customer churn rates.",
      n8nWorkflowIdea: "Automate monthly financial reconciliation by feeding QuickBooks / Xero P&L exports into n8n for automated KPI reporting."
    },
    {
      id: "SOPS_OPERATIONS",
      title: "Operations, Sales, HR & Customer Service SOPs",
      category: "Operational Execution",
      purpose: "Standardize procedures for sales prospecting, client onboarding, employee hiring, and customer support.",
      keyFields: [
        { fieldName: "Sales SOP", description: "Inbound lead qualification, demo scripting, proposal audit, and closing protocol.", exampleValue: "Lead ingested -> AI qualification score >80 -> Demo scheduled within 2 hours -> SOW auto-generated.", tips: "Define clear SLAs for lead response time (<15 minutes)." },
        { fieldName: "Operations SOP", description: "Daily project delivery, quality assurance checklists, and cloud deployment pipelines.", exampleValue: "All code deployed to Cloud Run staging -> 100% unit test pass -> Deployed to production.", tips: "Automate deployment checks with CI/CD." },
        { fieldName: "HR & Hiring SOP", description: "Job requisition, technical skill assessment, background check, and onboarding.", exampleValue: "Job posting -> Automated resume screen -> 45-min coding assessment -> Background check -> 1-day onboarding.", tips: "Maintain standardized rubric for interviewing." },
        { fieldName: "Customer Support SOP", description: "Tier 1-3 ticket escalation, SLA response targets, and customer retention workflows.", exampleValue: "Ticket received -> AI bot attempts resolution -> Escalated to human within 1 hour if unresolved.", tips: "Aim for >90% first-contact resolution." }
      ],
      aiAutomationTip: "Implement AI chatbot agents trained on internal SOP documents to answer routine employee HR and operational questions.",
      n8nWorkflowIdea: "Trigger automated Zendesk / Crisp support ticket routing based on sentiment analysis via n8n."
    },
    {
      id: "RISK_EXPANSION",
      title: "Risk Management, Expansion Plan & KPI Dashboard",
      category: "Governance & Scaling",
      purpose: "Identify operational risks, outline geographical/vertical expansion, and define core KPI dashboard metrics.",
      keyFields: [
        { fieldName: "Risk Mitigation Matrix", description: "Identification of top 5 risks and specific containment strategies.", exampleValue: "Risk: Data Breach -> Containment: SOC2 Type II certification + end-to-end encryption.", tips: "Review risk matrix quarterly." },
        { fieldName: "Expansion Roadmap", description: "Phase 1: US Tech Founders -> Phase 2: EU Expansion -> Phase 3: Enterprise Government Grants.", exampleValue: "Launch EU localization in Year 2; target DoD/NSF government grant automation in Year 3.", tips: "Tie expansion milestones to MRR thresholds ($100k MRR before EU launch)." },
        { fieldName: "Core KPI Dashboard", description: "Real-time tracking metrics (MRR, CAC, LTV, NRR, Gross Margin, SOW SLA).", exampleValue: "MRR Target: $100k | CAC Target: <$400 | LTV/CAC Target: >4.5x", tips: "Display on central team TV/dashboard." }
      ],
      aiAutomationTip: "Use AI anomaly detection algorithms on financial and server logs to trigger real-time risk alerts.",
      n8nWorkflowIdea: "Send daily automated Slack / Telegram executive digests summarizing top KPIs every morning at 8:00 AM."
    }
  ]
};

// 2. BUSINESS STARTUP SOP MANUAL
export const BUSINESS_STARTUP_SOP_MANUAL: SopStepGuide[] = [
  {
    id: "SOP-STARTUP-01",
    title: "LLC & Corporation Entity Formation",
    category: "Legal & Structure",
    objective: "Select optimal jurisdiction (Delaware vs. Home State) and file Articles of Incorporation / Organization legally.",
    estimatedTime: "2 - 5 Business Days",
    difficulty: "Intermediate",
    requiredDocs: ["Name Availability Search Result", "Articles of Incorporation / Organization Form", "Registered Agent Consent", "Filing Fee Payment ($90 - $300)"],
    stepByStepInstructions: [
      "Conduct a formal business name availability check on the Secretary of State website.",
      "Select an authorized Registered Agent physically located in the state of formation.",
      "Draft Articles of Incorporation (for C-Corp) or Articles of Organization (for LLC). Include initial authorized shares (e.g. 10,000,000 shares for C-Corp).",
      "Submit electronic filing through state online portal (e.g., Delaware eCorp / California bizfile).",
      "Receive certified stamped copy of Articles and store in digital corporate compliance vault."
    ],
    checklists: [
      "[ ] Business name verified unique in target state",
      "[ ] Registered Agent appointed and address confirmed",
      "[ ] Articles filed and certified copy received",
      "[ ] Initial Directors / Members recorded in meeting minutes"
    ],
    disasterRecoveryTip: "If filing is rejected due to name similarity, immediately submit an amended filing with a unique 'Inc' or 'Labs' suffix.",
    aiAutomationOpportunity: "Auto-generate pre-filled state incorporation forms using Gemini document synthesis."
  },
  {
    id: "SOP-STARTUP-02",
    title: "IRS Employer Identification Number (EIN) Registration",
    category: "Tax & Compliance",
    objective: "Obtain an official 9-digit IRS EIN (Tax ID) for tax filings, bank account setup, and payroll.",
    estimatedTime: "15 Minutes (Online)",
    difficulty: "Beginner",
    requiredDocs: ["Certified Articles of Incorporation", "Responsible Party SSN / ITIN", "Physical US Business Address"],
    stepByStepInstructions: [
      "Navigate to the official IRS.gov EIN Assistant portal (Monday-Friday 7am-10pm EST).",
      "Select entity type matching your corporate filing (Corporation, LLC, Partnership).",
      "Enter Responsible Party full legal name, SSN/ITIN, and relationship to entity.",
      "Specify principal business location address (P.O. Boxes are prohibited).",
      "Review input data and click Submit -> Instantly download official IRS Confirmation Letter CP 575."
    ],
    checklists: [
      "[ ] IRS CP 575 Notice downloaded and saved to secure cloud storage",
      "[ ] 9-digit EIN recorded without hyphens (XX-XXXXXXX)",
      "[ ] Responsible Party information matches IRS records exactly"
    ],
    disasterRecoveryTip: "If online portal gives Error 101, fax completed Form SS-4 to IRS (processing takes 4 business days).",
    aiAutomationOpportunity: "Pre-validate Form SS-4 fields with AI regex parser to prevent IRS rejection error codes."
  },
  {
    id: "SOP-STARTUP-03",
    title: "State Tax & Sales Tax Registration",
    category: "Tax & Compliance",
    objective: "Register with State Department of Revenue for sales tax permit, state employer withholding, and unemployment tax.",
    estimatedTime: "1 - 3 Business Days",
    difficulty: "Intermediate",
    requiredDocs: ["Federal EIN (CP 575)", "Articles of Incorporation", "Officer / Member Personal Details"],
    stepByStepInstructions: [
      "Access the State Department of Revenue online portal (e.g. CDTFA in CA / Comptroller in TX).",
      "Create business tax account linked to your federal EIN.",
      "Complete Sales & Use Tax Permit application if selling taxable goods or digital services.",
      "Register for State Employer Withholding Tax and Unemployment Insurance (SUI) if hiring employees.",
      "Receive State Tax Registration ID and display sales tax certificate."
    ],
    checklists: [
      "[ ] State Tax Account Number issued",
      "[ ] Sales Tax Permit active and resale certificate template downloaded",
      "[ ] State Unemployment Insurance (SUI) rate assigned"
    ],
    disasterRecoveryTip: "Ensure monthly/quarterly zero-sales tax returns are filed even if no revenue was collected to avoid $50 late filing penalties.",
    aiAutomationOpportunity: "Automate sales tax rate lookup by ZIP code using n8n and Avalara/TaxJar API integrations."
  },
  {
    id: "SOP-STARTUP-04",
    title: "D-U-N-S Number Registration & Dun & Bradstreet Profile",
    category: "Business Credit",
    objective: "Obtain a free 9-digit D-U-N-S Number from Dun & Bradstreet to establish commercial credit identity.",
    estimatedTime: "5 - 14 Business Days (Free)",
    difficulty: "Beginner",
    requiredDocs: ["Official Business Legal Name", "EIN CP 575 Letter", "Physical Address & Business Phone Number"],
    stepByStepInstructions: [
      "Go to the official Dun & Bradstreet D-U-N-S lookup portal (dnb.com).",
      "Search business database to verify no existing D-U-N-S assignment.",
      "Click 'Request a D-U-N-S Number' -> Select Government Contractor or General Business option.",
      "Submit official legal name, address, phone number, EIN, and principal officer contact.",
      "Receive D-U-N-S Number via email within 14 business days and claim D&B CreditBuilder profile."
    ],
    checklists: [
      "[ ] D-U-N-S Number assigned and verified on dnb.com",
      "[ ] Business address & phone number match Secretary of State filing exactly",
      "[ ] Free D&B iUpdate profile registered"
    ],
    disasterRecoveryTip: "Do not pay third-party expediters $300+ for a D-U-N-S number; use the free Apple Developer / SAM.gov expedited portal if urgent.",
    aiAutomationOpportunity: "Monitor D&B credit score changes automatically with Python cron job script."
  },
  {
    id: "SOP-STARTUP-05",
    title: "Business Checking Account & Merchant Account Setup",
    category: "Banking & Finance",
    objective: "Open a dedicated business bank account and set up Stripe/Square payment processing.",
    estimatedTime: "1 Day",
    difficulty: "Beginner",
    requiredDocs: ["IRS EIN CP 575 Letter", "Certified Articles of Incorporation", "Operating Agreement / Bylaws", "Government Issued ID (Passport / Drivers License)"],
    stepByStepInstructions: [
      "Select business-friendly bank (e.g. Mercury, Chase, Relay, or local credit union).",
      "Submit online application or attend in-person branch appointment with all officer IDs.",
      "Upload CP 575, Articles of Incorporation, and executed Operating Agreement.",
      "Deposit initial opening funds ($100 - $1,000) from owner's personal account marked as 'Owner Equity Contribution'.",
      "Connect business bank account to Stripe / Square for online payment processing."
    ],
    checklists: [
      "[ ] Business checking account active with debit card issued",
      "[ ] Online banking credentials configured with 2-Factor Authentication (2FA)",
      "[ ] Stripe account linked and test transaction verified"
    ],
    disasterRecoveryTip: "Never commingle personal and business funds; all transactions must flow strictly through the dedicated business account to preserve limited liability protection.",
    aiAutomationOpportunity: "Sync bank feed transactions directly into accounting ledger via Plaid API."
  },
  {
    id: "SOP-STARTUP-06",
    title: "Building Tier 1 & Tier 2 Business Credit Tradelines",
    category: "Business Credit",
    objective: "Establish vendor credit accounts that report to D&B, Experian Commercial, and Equifax Business to build a 80+ PAYDEX score.",
    estimatedTime: "60 - 90 Days",
    difficulty: "Intermediate",
    requiredDocs: ["D-U-N-S Number", "Business Checking Account", "Business Website & Domain Email"],
    stepByStepInstructions: [
      "Apply for Tier 1 Net-30 vendor accounts (Uline, Quill, Grainger, Summa Office Supplies).",
      "Place initial orders of $75+ on Net-30 credit terms.",
      "Pay invoices early (10-15 days before due date) to maximize D&B PAYDEX score.",
      "After 3-4 reporting tradelines reflect on credit bureau, apply for Tier 2 accounts (Amazon Business Store Card, Sam's Club, Fuel Cards).",
      "Monitor commercial credit reports monthly to verify active tradeline reporting."
    ],
    checklists: [
      "[ ] 3+ Tier 1 Net-30 vendor accounts active",
      "[ ] Invoices paid 10 days early",
      "[ ] D&B PAYDEX score generated (>80 target)"
    ],
    disasterRecoveryTip: "Ensure vendor accounts use exact legal business name and D-U-N-S address to prevent unlinked tradeline errors.",
    aiAutomationOpportunity: "Automate invoice payment scheduling to guarantee 10-day early payment discounts and credit score boosts."
  },
  {
    id: "SOP-STARTUP-07",
    title: "Commercial Insurance Coverage Setup",
    category: "Risk & Insurance",
    objective: "Procure General Liability, Cyber Liability, and Professional Liability (E&O) insurance policies.",
    estimatedTime: "1 - 2 Days",
    difficulty: "Beginner",
    requiredDocs: ["Business Operations Description", "Estimated Annual Revenue", "Payroll Estimate", "Prior Loss History"],
    stepByStepInstructions: [
      "Gather business activity details, annual revenue estimate, and headcount.",
      "Request quotes from commercial insurance brokers or digital platforms (Hiscox, NEXT, Embroker).",
      "Select Business Owner's Policy (BOP) combining General Liability and Property coverage.",
      "Add Cyber Liability ($1M policy) if handling customer data or SaaS applications.",
      "Download Certificate of Insurance (COI) and name key clients as Additional Insured where contractually required."
    ],
    checklists: [
      "[ ] General Liability policy active ($1M / $2M limits)",
      "[ ] Cyber Liability active",
      "[ ] COI generated and archived in compliance vault"
    ],
    disasterRecoveryTip: "Set annual calendar reminders 45 days prior to policy expiration to shop renewal rates.",
    aiAutomationOpportunity: "Automatically audit vendor COIs using optical AI document analysis."
  }
];

// 3. BUSINESS APPLICATION WORKBOOK
export const BUSINESS_APPLICATION_WORKBOOK: ApplicationWorksheet[] = [
  {
    id: "WORKBOOK-01",
    title: "IRS EIN Application Preparation Worksheet (Form SS-4)",
    purpose: "Gather and pre-validate all required information before opening the official IRS EIN online application.",
    issuingAgencyOrBody: "Internal Revenue Service (IRS) - U.S. Department of the Treasury",
    requiredSupportingDocs: [
      "Approved Articles of Incorporation or Articles of Organization",
      "Social Security Card or ITIN Letter of Responsible Party",
      "Physical Business Street Address Proof (Lease or Utility Bill)"
    ],
    prepChecklist: [
      "[ ] Verify exact legal business name spelling on state incorporation document",
      "[ ] Identify the designated Responsible Party (must own or control entity)",
      "[ ] Confirm physical address is NOT a P.O. Box or virtual mail drop",
      "[ ] Determine primary business activity and principal product/service sold"
    ],
    fields: [
      {
        fieldId: "SS4-01",
        fieldName: "Legal Name of Entity (Line 1)",
        explanation: "The official legal name of your corporation, LLC, or partnership as registered with the Secretary of State.",
        whatBelongsHere: "Full legal business name including entity designator (e.g., 'ASTRO LAB FAB INC.')",
        commonAcceptableValues: "Must match Articles of Incorporation exactly. Examples: 'Acme Solutions LLC', 'Apex Tech Inc.'",
        submissionTip: "Do not abbreviate words unless they are abbreviated on your state certified filing."
      },
      {
        fieldId: "SS4-02",
        fieldName: "Trade Name / DBA (Line 2)",
        explanation: "Doing Business As (DBA) name if operating under a name different from legal name.",
        whatBelongsHere: "Trade name if registered; leave blank if operating under official legal name.",
        commonAcceptableValues: "Example: Legal Name: 'Smith & Co Enterprises LLC', Trade Name: 'Apex Marketing'",
        submissionTip: "If no DBA is registered, leave completely blank to prevent IRS database confusion."
      },
      {
        fieldId: "SS4-03",
        fieldName: "Responsible Party Legal Name & SSN/ITIN (Line 7a-7b)",
        explanation: "The individual who ultimately owns or controls the entity or exercises ultimate effective control.",
        whatBelongsHere: "Full Legal Name (First, Middle, Last) and 9-digit SSN or ITIN of the principal founder/officer.",
        commonAcceptableValues: "SSN format: XXX-XX-XXXX | ITIN format: 9XX-XX-XXXX",
        submissionTip: "The Responsible Party MUST be an individual person, not another holding company or entity."
      },
      {
        fieldId: "SS4-04",
        fieldName: "Physical Business Address (Line 4a-4b)",
        explanation: "The primary physical location where business operations occur.",
        whatBelongsHere: "Street number, street name, suite number, city, state, and ZIP code.",
        commonAcceptableValues: "Commercial office address or founder home address. P.O. Boxes are INVALID.",
        submissionTip: "Using a virtual address or P.O. Box will result in online application rejection (Error Code 101)."
      },
      {
        fieldId: "SS4-05",
        fieldName: "Entity Type (Line 8a-9a)",
        explanation: "The specific legal and tax structure of the applying organization.",
        whatBelongsHere: "Check appropriate box: Corporation (Form 1120), LLC, Partnership, Sole Proprietorship.",
        commonAcceptableValues: "Corporation, Member-Managed LLC, Manager-Managed LLC, Sole Proprietor",
        submissionTip: "For single-member LLCs, select 'LLC' and specify 1 member for disregarded entity tax status."
      },
      {
        fieldId: "SS4-06",
        fieldName: "Reason for Applying (Line 10)",
        explanation: "The primary operational trigger requiring an EIN assignment.",
        whatBelongsHere: "Select primary reason: Started new business, Hired employees, Opened banking account, Changed organization type.",
        commonAcceptableValues: "Started new business (specify type), Banking purpose, Created trust",
        submissionTip: "Select 'Started new business' for first-time startup entity creation."
      }
    ],
    expertSubmissionTips: [
      "Complete the application online between Monday and Friday, 7:00 AM to 10:00 PM Eastern Time.",
      "Save the generated CP 575 confirmation PDF immediately; getting a duplicate letter from the IRS takes 30-60 days via mail (Form 147C).",
      "Ensure pop-up blockers are disabled in your browser so the CP 575 PDF opens cleanly upon submission."
    ]
  },
  {
    id: "WORKBOOK-02",
    title: "Business Credit Card & Commercial Line Application Worksheet",
    purpose: "Organize entity financials and officer personal guarantor details to secure high-limit business credit lines ($10k - $100k).",
    issuingAgencyOrBody: "Commercial Banking Partners (Chase, AMEX, Capital One, Bank of America)",
    requiredSupportingDocs: [
      "IRS EIN CP 575 Letter",
      "Articles of Incorporation / Organization",
      "Prior 2 Years Business Bank Statements (or 3 months for new entities)",
      "Government Photo ID of Principal Officer / Guarantor"
    ],
    prepChecklist: [
      "[ ] Verify business checking account has been active for at least 30 days",
      "[ ] Check personal guarantor credit score (700+ recommended for initial Tier 1 cards)",
      "[ ] Ensure annual business revenue estimate is realistic and supported by financial plan",
      "[ ] Confirm physical business address matches bank and state records exactly"
    ],
    fields: [
      {
        fieldId: "CRED-01",
        fieldName: "Legal Business Name & DBA",
        explanation: "Exact legal entity name as registered with Secretary of State and IRS.",
        whatBelongsHere: "Full entity name + DBA if applicable.",
        commonAcceptableValues: "Matches EIN CP 575 letter exactly.",
        submissionTip: "Do not leave off 'Inc' or 'LLC' suffix."
      },
      {
        fieldId: "CRED-02",
        fieldName: "Federal Tax ID (EIN)",
        explanation: "9-digit IRS Tax Identification Number.",
        whatBelongsHere: "EIN without hyphens or spaces.",
        commonAcceptableValues: "Format: 88-XXXXXXX",
        submissionTip: "Never enter personal SSN in the business EIN field."
      },
      {
        fieldId: "CRED-03",
        fieldName: "Annual Business Revenue",
        explanation: "Total gross revenue generated by the business in the last 12 months (or projected year 1 revenue for new startups).",
        whatBelongsHere: "Gross dollar amount.",
        commonAcceptableValues: "New Startups: $100,000 - $500,000 projected | Established: Actual Gross Revenue",
        submissionTip: "Banks permit reasonable projected year 1 revenue for newly formed entities."
      },
      {
        fieldId: "CRED-04",
        fieldName: "Monthly Spend / Expected Credit Limit Request",
        explanation: "Anticipated monthly commercial expense charges.",
        whatBelongsHere: "Target monthly credit limit required for operations.",
        commonAcceptableValues: "$10,000 - $50,000",
        submissionTip: "Request limits aligned with 25-30% of projected monthly gross revenue."
      },
      {
        fieldId: "CRED-05",
        fieldName: "Personal Guarantor Information",
        explanation: "Personal details of officer/owner providing personal guarantee.",
        whatBelongsHere: "Full Legal Name, Home Address, SSN, Date of Birth, Total Personal Annual Income.",
        commonAcceptableValues: "Owner with 25%+ equity ownership.",
        submissionTip: "Including personal income from all household sources strengthens underwriting."
      }
    ],
    expertSubmissionTips: [
      "Apply for business credit cards under your business EIN to ensure tradelines report to D&B and Experian Commercial.",
      "Keep revolving credit utilization below 30% of total limit to rapidly boost commercial credit score.",
      "Set up automatic full monthly statement balance auto-pay from your business checking account."
    ]
  },
  {
    id: "WORKBOOK-03",
    title: "D-U-N-S Number & D&B Commercial Profile Information Worksheet",
    purpose: "Compile all corporate details required for a free Dun & Bradstreet D-U-N-S assignment.",
    issuingAgencyOrBody: "Dun & Bradstreet (D&B)",
    requiredSupportingDocs: [
      "Certified Filing of Articles of Incorporation",
      "IRS CP 575 EIN Confirmation Notice",
      "Active Business Telephone Utility Bill or Domain Registration Proof"
    ],
    prepChecklist: [
      "[ ] Search dnb.com to verify entity does not already have a duplicate D-U-N-S profile",
      "[ ] Confirm business telephone number is listed in commercial directory (411 / Google Business)",
      "[ ] Verify executive officer names and ownership percentages"
    ],
    fields: [
      {
        fieldId: "DUNS-01",
        fieldName: "Exact Legal Name of Firm",
        explanation: "Corporate legal entity name.",
        whatBelongsHere: "Legal name matching state filing.",
        commonAcceptableValues: "Matches state registration exactly.",
        submissionTip: "Punctuation (commas, periods) must match state documents."
      },
      {
        fieldId: "DUNS-02",
        fieldName: "Physical Headquarters Location",
        explanation: "Physical location of primary business office.",
        whatBelongsHere: "Street, suite, city, state, zip.",
        commonAcceptableValues: "Commercial office or verified home office address.",
        submissionTip: "Residential addresses are acceptable if listed on state corporate filing."
      },
      {
        fieldId: "DUNS-03",
        fieldName: "Primary Business Line & NAICS Code",
        explanation: "6-digit North American Industry Classification System code describing operations.",
        whatBelongsHere: "Primary 6-digit NAICS code + descriptive text.",
        commonAcceptableValues: "541511 (Custom Software), 541611 (Management Consulting), 541810 (Advertising)",
        submissionTip: "Selecting high-risk NAICS codes (gambling, real estate speculation) may restrict credit terms."
      },
      {
        fieldId: "DUNS-04",
        fieldName: "Number of Employees at Location",
        explanation: "Total headcount including active founders and full/part-time staff.",
        whatBelongsHere: "Numeric headcount.",
        commonAcceptableValues: "Startups: 1 - 5 employees",
        submissionTip: "Count active full-time equivalent founders as employees."
      }
    ],
    expertSubmissionTips: [
      "Use the free Apple Developer / SAM.gov D-U-N-S portal to receive your 9-digit number in 3 business days at $0 cost.",
      "Once issued, log into D&B iUpdate to verify profile data and upload 3 initial vendor trade references."
    ]
  },
  {
    id: "WORKBOOK-04",
    title: "Commercial Bank Account Opening Worksheet",
    purpose: "Organize corporate documents and officer resolutions for opening business checking & savings accounts.",
    issuingAgencyOrBody: "FDIC Insured Commercial Banking Institutions",
    requiredSupportingDocs: [
      "IRS EIN CP 575 Confirmation Notice",
      "Certified Articles of Incorporation / Organization",
      "Executed Corporate Bylaws / LLC Operating Agreement",
      "Two Forms of ID for All Authorized Signers (Driver's License + Passport/Credit Card)"
    ],
    prepChecklist: [
      "[ ] Schedule in-person appointment or prepare digital upload scan files",
      "[ ] Ensure all 25%+ beneficial owners are present or provide certified ID copies",
      "[ ] Prepare initial opening deposit ($100 - $1,000 via wire, check, or transfer)"
    ],
    fields: [
      {
        fieldId: "BANK-01",
        fieldName: "Corporate Resolution & Authorized Signers",
        explanation: "Formal document authorizing specific officers to open accounts and execute wire transfers.",
        whatBelongsHere: "Names and titles of authorized signers (e.g. CEO, CFO, Treasurer).",
        commonAcceptableValues: "Chief Executive Officer, Managing Member, President",
        submissionTip: "Ensure Corporate Resolution is signed by Corporate Secretary or all LLC Members."
      },
      {
        fieldId: "BANK-02",
        fieldName: "Beneficial Ownership Disclosure (25%+ Rule)",
        explanation: "Federal FinCEN mandate requiring disclosure of all individuals owning 25% or more equity.",
        whatBelongsHere: "Name, Date of Birth, Address, SSN, and Equity % for each 25%+ owner.",
        commonAcceptableValues: "Full legal personal names & residential addresses.",
        submissionTip: "If no single individual owns 25%, list the single officer with significant management control."
      },
      {
        fieldId: "BANK-03",
        fieldName: "Expected Cash Flow & Wire Volume",
        explanation: "Estimated monthly deposit volume, check volume, and international wire activity.",
        whatBelongsHere: "Dollar estimates for monthly incoming/outgoing wires and ACH deposits.",
        commonAcceptableValues: "Initial Monthly Wires: $10,000 - $100,000 | Domestic ACH: $20,000",
        submissionTip: "Disclosing expected international wires upfront prevents automated risk freezes on initial transfers."
      }
    ],
    expertSubmissionTips: [
      "Maintain a minimum $5,000 average daily balance to waive monthly commercial account maintenance fees.",
      "Set up dual-authorization for outgoing wire transfers exceeding $10,000 for internal fraud prevention."
    ]
  },
  {
    id: "WORKBOOK-05",
    title: "Vendor Credit Application Worksheet (Tier 1 Net-30)",
    purpose: "Prepare vendor credit applications for Uline, Quill, and Grainger to establish initial commercial tradelines.",
    issuingAgencyOrBody: "Commercial Net-30 Vendors",
    requiredSupportingDocs: [
      "State Tax ID / Resale Certificate (if claiming tax exemption)",
      "Business Checking Account Routing & Account Number",
      "3 Commercial Trade References (or bank reference for brand new entities)"
    ],
    prepChecklist: [
      "[ ] Verify D-U-N-S Number is active and searchable",
      "[ ] Ensure commercial phone number is listed in directory",
      "[ ] Confirm delivery address can accept physical package shipments"
    ],
    fields: [
      {
        fieldId: "VEND-01",
        fieldName: "Purchasing Department Contact & Email",
        explanation: "Designated point of contact for purchase orders and invoice billing.",
        whatBelongsHere: "Name, Title, Domain Email address (e.g. billing@company.com).",
        commonAcceptableValues: "Purchasing Manager, Finance Director",
        submissionTip: "Always use domain-branded email addresses (@company.com); free Gmail/Yahoo addresses are frequently rejected."
      },
      {
        fieldId: "VEND-02",
        fieldName: "Requested Net Terms & Initial Credit Limit",
        explanation: "Desired payment credit terms (Net-15, Net-30, Net-60).",
        whatBelongsHere: "Net-30 Terms | Requested Limit: $1,000 - $5,000",
        commonAcceptableValues: "Net-30 Terms",
        submissionTip: "Request modest initial limit ($1,000) to ensure instant automatic approval without manual underwriting."
      }
    ],
    expertSubmissionTips: [
      "Place a $75+ order immediately upon account approval.",
      "Pay invoice within 10 days of receipt to earn a 100 PAYDEX rating on D&B."
    ]
  },
  {
    id: "WORKBOOK-06",
    title: "SBA 7(a) & 504 Loan Preparation Worksheet",
    purpose: "Compile all financial statements, tax returns, and collateral documentation for Small Business Administration backed loan underwriting.",
    issuingAgencyOrBody: "U.S. Small Business Administration (SBA) / Preferred Lender Network",
    requiredSupportingDocs: [
      "SBA Form 1919 (Borrower Information Form)",
      "SBA Form 413 (Personal Financial Statement for all 20%+ owners)",
      "3 Years Personal and Business Federal Tax Returns",
      "3-Year Projected Monthly Cash Flow Statement & Profit/Loss",
      "Business Debt Schedule (Form 2203)"
    ],
    prepChecklist: [
      "[ ] Calculate Global Debt Service Coverage Ratio (DSCR target > 1.25x)",
      "[ ] Clean up any personal tax liens or delinquent credit obligations",
      "[ ] Prepare detailed Use of Loan Proceeds breakdown (Equipment, Working Capital, Real Estate)"
    ],
    fields: [
      {
        fieldId: "SBA-01",
        fieldName: "Loan Amount Requested & Specific Purpose",
        explanation: "Total capital requested and itemized allocation.",
        whatBelongsHere: "Total requested dollar amount + breakdown (e.g. $350,000: $200k Equipment, $100k Working Capital, $50k Refinancing).",
        commonAcceptableValues: "$50,000 - $5,000,000",
        submissionTip: "Working capital requests must be supported by 12-month cash flow forecast projection."
      },
      {
        fieldId: "SBA-02",
        fieldName: "Personal Net Worth & Liquid Assets (Form 413)",
        explanation: "Itemization of personal cash, real estate, retirement accounts, and personal liabilities for guarantors.",
        whatBelongsHere: "Total Personal Assets minus Total Personal Liabilities.",
        commonAcceptableValues: "Must show sufficient personal equity and secondary repayment capacity.",
        submissionTip: "Do not include business equity value in personal net worth calculation on Form 413."
      }
    ],
    expertSubmissionTips: [
      "Work with an SBA Preferred Lender (PLP) who has direct in-house authority to approve loans without sending to SBA regional offices.",
      "Maintain a minimum Debt Service Coverage Ratio (DSCR) of 1.25x on projected cash flows."
    ]
  },
  {
    id: "WORKBOOK-07",
    title: "Commercial Insurance Application Worksheet",
    purpose: "Gather operational risk profiles to secure competitive quotes for General Liability, Cyber, and Workers Comp.",
    issuingAgencyOrBody: "Commercial Insurance Carriers (Travelers, Chubb, Hiscox, Hartford)",
    requiredSupportingDocs: [
      "Prior 3 Years Loss Runs (Claims History) or Letter of No Loss for Startups",
      "Subcontractor Agreement Templates & Hold Harmless Clauses",
      "Estimated Annual Payroll and Gross Revenue Breakdown"
    ],
    prepChecklist: [
      "[ ] Determine required policy limits (Standard: $1M per Occurrence / $2M Aggregate)",
      "[ ] Identify if client contracts require specific Additional Insured endorsements",
      "[ ] Verify worker classifications for Workers Compensation audit compliance"
    ],
    fields: [
      {
        fieldId: "INS-01",
        fieldName: "Gross Projected Revenue & Payroll",
        explanation: "Total estimated revenue and payroll for the upcoming 12-month policy term.",
        whatBelongsHere: "Dollar estimates for next 12 months.",
        commonAcceptableValues: "Revenue: $250,000 - $1,000,000 | Payroll: $100,000",
        submissionTip: "Overestimating revenue will result in higher advance premiums; underestimating will trigger audit adjustments."
      }
    ],
    expertSubmissionTips: [
      "Bundle General Liability, Property, and Business Interruption into a single Business Owner's Policy (BOP) for up to 25% savings.",
      "Implement strong cyber security protocols (MFA, encrypted backups) to lower Cyber Liability insurance premiums."
    ]
  },
  {
    id: "WORKBOOK-08",
    title: "Payroll & Employee Onboarding Registration Worksheet",
    purpose: "Set up automated payroll processing and state employer tax registrations for hiring W-2 staff and 1099 contractors.",
    issuingAgencyOrBody: "State Department of Labor & Federal IRS (Gusto, ADP, Rippling)",
    requiredSupportingDocs: [
      "IRS EIN CP 575 Notice",
      "State Employer Unemployment (SUI) & Withholding Tax Numbers",
      "Signed Form W-4 (Federal Withholding) and Form I-9 (Employment Eligibility) for each employee",
      "Direct Deposit Voided Check or Bank Letter"
    ],
    prepChecklist: [
      "[ ] Verify physical work location state for proper state withholding registration",
      "[ ] Determine pay frequency (Weekly, Bi-Weekly, Semi-Monthly)",
      "[ ] Setup Workers Compensation policy before first employee start date"
    ],
    fields: [
      {
        fieldId: "PAY-01",
        fieldName: "State Employer Unemployment (SUI) Rate",
        explanation: "State-assigned unemployment tax rate for new employers.",
        whatBelongsHere: "Assigned percentage rate (e.g. 3.4% new employer rate).",
        commonAcceptableValues: "New Employer Default Rates: 2.7% - 5.4% depending on state.",
        submissionTip: "Enter exact rate from state registration letter to avoid payroll tax miscalculation penalties."
      }
    ],
    expertSubmissionTips: [
      "Use automated digital payroll platforms (Gusto / Rippling) that automatically calculate, withhold, and deposit federal and state payroll taxes.",
      "Complete Form I-9 verification within 3 business days of employee's first working day to remain compliant with federal immigration laws."
    ]
  },
  {
    id: "WORKBOOK-09",
    title: "Corporate Tax Information & IRS Schedule C/1120 Worksheet",
    purpose: "Compile tax classification details and annual deduction categories for CPA tax preparation.",
    issuingAgencyOrBody: "Internal Revenue Service (IRS) & State Franchise Tax Board",
    requiredSupportingDocs: [
      "Form 1120 (C-Corp) or Form 1065 (Partnership) or Schedule C (Single Member LLC)",
      "Year-End Balance Sheet and Income Statement (P&L)",
      "Form 1099-NEC Copies Issued to Independent Contractors ($600+)",
      "IRS Form 8832 (Entity Classification Election) or Form 2553 (S-Corp Election)"
    ],
    prepChecklist: [
      "[ ] Reconcile 12 months of business bank statements against accounting software",
      "[ ] File Form 1099-NEC for contractors by January 31 deadline",
      "[ ] Calculate annual mileage logs and qualifying home office square footage"
    ],
    fields: [
      {
        fieldId: "TAX-01",
        fieldName: "IRS Tax Entity Classification",
        explanation: "The tax return form required based on entity structure and elections.",
        whatBelongsHere: "Form 1120 (C-Corp), Form 1120-S (S-Corp), Form 1065 (Partnership), or Schedule C (Sole Proprietor).",
        commonAcceptableValues: "Form 1120 for C-Corporations",
        submissionTip: "Ensure S-Corp election (Form 2553) was filed within 75 days of formation if electing S-Corp status."
      }
    ],
    expertSubmissionTips: [
      "Claim qualifying R&D Tax Credits (Form 6765) to offset up to $500,000 annually in federal payroll taxes for early-stage tech companies.",
      "Keep digital receipts for all business meals, travel, and software subscriptions over $75."
    ]
  },
  {
    id: "WORKBOOK-10",
    title: "Municipal & State Business Licensing Worksheet",
    purpose: "Identify and track required city, county, and state operational licenses and health/safety permits.",
    issuingAgencyOrBody: "City / County Finance Department & State Licensing Boards",
    requiredSupportingDocs: [
      "Business Entity Registration Certificate",
      "Zoning Compliance Approval or Home Occupation Permit",
      "Lease Agreement or Property Deed",
      "Professional License Certificate (for regulated fields: legal, medical, accounting, engineering)"
    ],
    prepChecklist: [
      "[ ] Check city finance website for local Business License Tax registration",
      "[ ] Verify commercial office zoning permits target business activities",
      "[ ] Calculate annual gross receipts for local business license tax calculation"
    ],
    fields: [
      {
        fieldId: "LIC-01",
        fieldName: "City / County Business Tax Certificate Number",
        explanation: "Local municipality operating license number.",
        whatBelongsHere: "Issued license ID number.",
        commonAcceptableValues: "Issued by local City Hall / Revenue Department.",
        submissionTip: "Post physical license certificate at primary business location if required by local ordinance."
      }
    ],
    expertSubmissionTips: [
      "Apply for local city business tax permit within 30 days of starting operations to avoid 25% late registration penalties.",
      "If working from home, secure a Home Occupation Permit to ensure zoning compliance."
    ]
  },
  {
    id: "WORKBOOK-11",
    title: "Comprehensive Business Profile & Master Identity Worksheet",
    purpose: "Consolidate all corporate identifiers into a single master document for banking, vendor, and investor due diligence.",
    issuingAgencyOrBody: "Internal Master Records (ASTRO LAB FAB Engine)",
    requiredSupportingDocs: [
      "Master Incorporation Binder",
      "IRS EIN CP 575 Letter",
      "D-U-N-S Confirmation Notice",
      "Banking Direct Deposit Form & Voided Check"
    ],
    prepChecklist: [
      "[ ] Verify consistency of legal name across state, IRS, D&B, and bank records",
      "[ ] Store digital PDF backup of all core documents in encrypted compliance vault",
      "[ ] Share master profile with corporate attorney, CPA, and executive officers"
    ],
    fields: [
      {
        fieldId: "PROF-01",
        fieldName: "Master Corporate Summary Block",
        explanation: "Consolidated record of Legal Name, EIN, D-U-N-S, State ID, and Primary Bank Account.",
        whatBelongsHere: "All core corporate numbers in a single reference table.",
        commonAcceptableValues: "Master corporate identity record.",
        submissionTip: "Keep updated in real-time whenever corporate officers or addresses change."
      }
    ],
    expertSubmissionTips: [
      "Use this Master Profile to quickly pre-fill government grant applications, investor due diligence questionnaires, and enterprise vendor forms.",
      "Review and audit corporate profile annually during annual meeting minutes preparation."
    ]
  }
];
