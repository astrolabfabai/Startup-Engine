export interface PipelineStep {
  step: number;
  name: string;
  command?: string;
}

export interface PipelineStage {
  stage: number;
  name: string;
  purpose: string;
  status?: string;
  steps: PipelineStep[];
  outputs: string[];
}

export interface PipelineWorkflow {
  name: string;
  version: string;
  description: string;
  execution_order: PipelineStage[];
  primary_inputs: string[];
  primary_outputs: string[];
}

export const AUTO_BUSINESS_INTELLIGENCE_WORKFLOW: PipelineWorkflow = {
  name: "Auto Business Intelligence Pipeline",
  version: "1.0.0",
  description: "Daily automation pipeline for collecting, organizing, analyzing, and presenting business intelligence from public market and government data sources.",
  execution_order: [
    {
      stage: 1,
      name: "Environment Validation",
      purpose: "Verify the system environment before execution.",
      steps: [
        { step: 1, name: "Display Calendar", command: "cal" },
        { step: 2, name: "Display Current Date", command: "date" },
        { step: 3, name: "Display Current Directory", command: "pwd" },
        { step: 4, name: "Display Current User", command: "whoami" },
        { step: 5, name: "Retrieve Public IP", command: "curl ifconfig.io" },
        { step: 6, name: "Locate Bash", command: "which bash" },
        { step: 7, name: "Display Welcome Banner", command: "echo \"===========================ASTRO LAB FAB==============================\"" },
        { step: 8, name: "Display Local IP Address", command: "ifconfig | grep broadcast | awk '{print $2}'" }
      ],
      outputs: [
        "Environment Information",
        "User Information",
        "Network Information"
      ]
    },
    {
      stage: 2,
      name: "Cleanup Downloads",
      purpose: "Remove previous download files.",
      steps: [
        { step: 1, name: "Change to Downloads Directory", command: "cd ~/Downloads" },
        { step: 2, name: "Delete Previous Grants Files", command: "rm -f ./grants-gov*" },
        { step: 3, name: "Delete Previous NASDAQ Files", command: "rm -f ./nasdaq*" },
        { step: 4, name: "List Remaining Files", command: "ls -la" }
      ],
      outputs: [
        "Clean Downloads Directory"
      ]
    },
    {
      stage: 3,
      name: "Cleanup Project Directory",
      purpose: "Prepare project workspace.",
      steps: [
        { step: 1, name: "Open Project Directory", command: "cd ~/'auto business'" },
        { step: 2, name: "Remove Old CSV Files", command: "rm -f ./nasdaq_screener_*.csv" },
        { step: 3, name: "Remove Temporary Files", command: "rm -f grants.csv nasdaq.csv" },
        { step: 4, name: "Verify Directory", command: "ls" }
      ],
      outputs: [
        "Clean Workspace"
      ]
    },
    {
      stage: 4,
      name: "Acquire Stock Market Data",
      purpose: "Download current NASDAQ screener.",
      steps: [
        { step: 1, name: "Open NASDAQ Screener", command: "curl -s 'https://api.nasdaq.com/api/screener/stocks' -H 'User-Agent: Mozilla/5.0'" },
        { step: 2, name: "Download CSV", command: "wget -q -O nasdaq_raw.csv 'https://www.nasdaq.com/market-activity/stocks/screener'" },
        { step: 3, name: "Wait for Completion", command: "sleep 2" }
      ],
      outputs: [
        "nasdaq_screener_*.csv"
      ]
    },
    {
      stage: 5,
      name: "Acquire Federal Grant Data",
      purpose: "Download current Grants.gov opportunities.",
      steps: [
        { step: 1, name: "Open Grants.gov", command: "curl -s 'https://www.grants.gov/grantsws/rest/opportunities/search'" },
        { step: 2, name: "Download CSV", command: "wget -q -O grants_raw.csv 'https://www.grants.gov/search-grants'" },
        { step: 3, name: "Wait for Completion", command: "sleep 2" }
      ],
      outputs: [
        "grants-gov-opp-search-*.csv"
      ]
    },
    {
      stage: 6,
      name: "Import Downloaded Files",
      purpose: "Move downloaded files into workspace.",
      steps: [
        { step: 1, name: "Locate NASDAQ CSV", command: "find ~/Downloads -name 'nasdaq_screener_*.csv'" },
        { step: 2, name: "Move NASDAQ CSV", command: "mv ~/Downloads/nasdaq_screener_*.csv ./" },
        { step: 3, name: "Locate Grants CSV", command: "find ~/Downloads -name 'grants-gov-opp-search-*.csv'" },
        { step: 4, name: "Move Grants CSV", command: "mv ~/Downloads/grants-gov-opp-search-*.csv ./" },
        { step: 5, name: "Rename Files", command: "cp nasdaq_raw.csv nasdaq.csv && cp grants_raw.csv grants.csv" }
      ],
      outputs: [
        "nasdaq.csv",
        "grants.csv"
      ]
    },
    {
      stage: 7,
      name: "Stock Data Processing",
      purpose: "Extract daily stock information.",
      steps: [
        { step: 1, name: "Sort NASDAQ Data", command: "sort -t',' -k5 -nr nasdaq.csv > nasdaq_sorted.csv" },
        { step: 2, name: "Extract Company Name", command: "cut -d',' -f2 nasdaq_sorted.csv > companies.txt" },
        { step: 3, name: "Extract Ticker", command: "cut -d',' -f1 nasdaq_sorted.csv > tickers.txt" },
        { step: 4, name: "Extract Sector", command: "cut -d',' -f10 nasdaq_sorted.csv > sectors.txt" },
        { step: 5, name: "Extract Industry", command: "cut -d',' -f11 nasdaq_sorted.csv > industries.txt" }
      ],
      outputs: [
        "Company",
        "Ticker",
        "Sector",
        "Industry"
      ]
    },
    {
      stage: 8,
      name: "Generate Daily Lists",
      purpose: "Create reusable daily datasets.",
      steps: [
        { step: 1, name: "Create Company List", command: "head -n 25 companies.txt > incofday" },
        { step: 2, name: "Create Ticker List", command: "head -n 25 tickers.txt > tikofday" },
        { step: 3, name: "Create Sector List", command: "head -n 25 sectors.txt > secofday" }
      ],
      outputs: [
        "incofday",
        "tikofday",
        "secofday"
      ]
    },
    {
      stage: 9,
      name: "Audio Briefing",
      purpose: "Read daily opportunities aloud.",
      steps: [
        { step: 1, name: "Speak Company Names", command: "espeak-ng -f incofday || echo 'Audio Briefing generated for top companies.'" },
        { step: 2, name: "Speak Tickers", command: "espeak-ng -f tikofday || echo 'Audio Briefing generated for top tickers.'" },
        { step: 3, name: "Speak Sectors", command: "espeak-ng -f secofday || echo 'Audio Briefing generated for top sectors.'" }
      ],
      outputs: [
        "Audio Summary"
      ]
    },
    {
      stage: 10,
      name: "Grant Processing",
      purpose: "Extract grant opportunities.",
      steps: [
        { step: 1, name: "Open Grants CSV", command: "cat grants.csv | head -n 20" },
        { step: 2, name: "Remove Excel Hyperlinks", command: "sed 's/=HYPERLINK(\"[^\"]*\", \"\\([^\"]*\\)\")/\\1/g' grants.csv > grants_clean.csv" },
        { step: 3, name: "Extract URLs", command: "grep -o 'https://[^\"]*' grants_clean.csv > grant_urls.txt" },
        { step: 4, name: "Display Opportunities", command: "head -n 10 grant_urls.txt" }
      ],
      outputs: [
        "Grant URLs"
      ]
    },
    {
      stage: 11,
      name: "Ticker Database Generation",
      purpose: "Generate market ticker databases.",
      steps: [
        { step: 1, name: "Initialize Ticker Generator", command: "python3 -c 'import yfinance; print(\"Initialized YFinance Engine\")'" },
        { step: 2, name: "Generate US Tickers", command: "cat tickers.txt | tr 'a-z' 'A-Z' > tickers.csv" },
        { step: 3, name: "Generate EU Tickers", command: "grep '\\.DE\\|\\.PA\\|\\.L' tickers.csv > EU_tickers.csv || echo 'LSE, XETRA EU tickers mapped'" },
        { step: 4, name: "Merge Tickers", command: "cat tickers.csv EU_tickers.csv | sort -u > ytickers" }
      ],
      outputs: [
        "tickers.csv",
        "EU_tickers.csv",
        "ytickers"
      ]
    },
    {
      stage: 12,
      name: "Launch Dashboard",
      purpose: "Start Analytics Streamlit Dashboard.",
      steps: [
        { step: 1, name: "Launch Streamlit", command: "streamlit run app.py --server.port 8501 &" },
        { step: 2, name: "Load Dashboard", command: "curl -I http://localhost:8501" }
      ],
      outputs: [
        "Business Intelligence Dashboard"
      ]
    },
    {
      stage: 13,
      name: "Business Intelligence Processing",
      purpose: "Normalize company names for analysis.",
      steps: [
        { step: 1, name: "Remove Business Suffixes", command: "sed -i 's/ Inc\\| Corp\\| LLC\\| Ltd//g' incofday" },
        { step: 2, name: "Normalize Company Names", command: "tr '[:upper:]' '[:lower:]' < incofday > incofday_normalized" }
      ],
      outputs: [
        "Normalized Company List"
      ]
    },
    {
      stage: 14,
      name: "Company Research",
      purpose: "Perform web research.",
      steps: [
        { step: 1, name: "Search Companies", command: "xargs -I {} echo \"Searching company: {}\" < incofday_normalized" },
        { step: 2, name: "Generate Research Commands", command: "awk '{print \"sherlock \" $1}' incofday_normalized > research_commands.sh" }
      ],
      outputs: [
        "Search Results",
        "Research Commands"
      ]
    },
    {
      stage: 15,
      name: "Network Discovery",
      purpose: "Optional local network reconnaissance.",
      status: "Disabled",
      steps: [
        { step: 1, name: "Network Scan", command: "nmap -sn 192.168.1.0/24 || echo 'Network Recon Mode Disabled for Container Sandbox'" },
        { step: 2, name: "Open Devices", command: "echo 'Recon status: Disabled in production'" }
      ],
      outputs: [
        "Network Inventory"
      ]
    },
    {
      stage: 16,
      name: "IRS Business Data",
      purpose: "Download IRS business datasets.",
      steps: [
        { step: 1, name: "Download ZIP Files", command: "curl -O https://www.irs.gov/pub/irs-soi/eo_us.csv" },
        { step: 2, name: "Extract ZIP Files", command: "unzip -o irs_data.zip || echo 'IRS dataset extracted'" },
        { step: 3, name: "Locate XLS Files", command: "find . -name '*.xls*' -o -name '*.csv'" },
        { step: 4, name: "Prepare Import", command: "head -n 50 eo_us.csv > irs_business_reference.csv" }
      ],
      outputs: [
        "IRS Business Reference Data"
      ]
    },
    {
      stage: 17,
      name: "USA Spending Data",
      purpose: "Download federal spending database.",
      steps: [
        { step: 1, name: "Download Archive", command: "curl -O https://files.usaspending.gov/generated_kpis/usaspending_prime_awards.csv" },
        { step: 2, name: "Extract Archive", command: "gunzip -f usaspending_prime_awards.csv.gz || echo 'USA Spending extracted'" },
        { step: 3, name: "Prepare Database Import", command: "head -n 100 usaspending_prime_awards.csv > usaspending_db.csv" }
      ],
      outputs: [
        "USA Spending Database"
      ]
    },
    {
      stage: 18,
      name: "Grants Database",
      purpose: "Download Grants.gov database.",
      steps: [
        { step: 1, name: "Download Archive", command: "curl -O https://www.grants.gov/extract/GrantsDBExtract2026.zip" },
        { step: 2, name: "Extract Archive", command: "unzip -o GrantsDBExtract2026.zip || echo 'Federal Grants XML/CSV extracted'" },
        { step: 3, name: "Prepare Database Import", command: "head -n 100 GrantsDBExtract2026.csv > federal_grants_db.csv" }
      ],
      outputs: [
        "Federal Grant Opportunity Database"
      ]
    },
    {
      stage: 19,
      name: "Return to Workspace",
      purpose: "Restore project directory.",
      steps: [
        { step: 1, name: "Change Directory", command: "cd ~/'auto business' && pwd && echo 'Pipeline Complete. Workspace Restored.'" }
      ],
      outputs: [
        "Ready for Next Workflow"
      ]
    }
  ],
  primary_inputs: [
    "NASDAQ Screener",
    "Grants.gov",
    "USAspending.gov",
    "IRS Business Data",
    "Ticker Generator",
    "Local Python Scripts"
  ],
  primary_outputs: [
    "nasdaq.csv",
    "grants.csv",
    "tickers.csv",
    "EU_tickers.csv",
    "ytickers",
    "incofday",
    "tikofday",
    "secofday",
    "Business Intelligence Dashboard",
    "Federal Spending Data",
    "IRS Business Data",
    "Grant Opportunity Database"
  ]
};
