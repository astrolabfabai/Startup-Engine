import { FrameworkSubstep, BusinessFrameworkIndex } from '../types';

export const FRAMEWORK_METADATA: BusinessFrameworkIndex = {
  framework_version: '2.4.0',
  framework_name: 'ASTRO LAB FAB Autonomous Enterprise Business Framework',
  description: '11-module complete business execution, AI prompt engineering, SOP, automation, and validation framework with 33-field substep granularity.',
  last_updated: '2026-07-22',
  modules: {
    '00_schema': '00_schema.json',
    '01_business_plan': '01_business_plan.json',
    '02_business_models': '02_business_models.json',
    '03_pipeline': '03_pipeline.json',
    '04_sops': '04_sops.json',
    '05_prompts': '05_prompts.json',
    '06_scripts': '06_scripts.json',
    '07_workflows': '07_workflows.json',
    '08_validation': '08_validation.json',
    '09_assets': '09_assets.json',
    '10_outputs': '10_outputs.json'
  }
};

/**
  * Factory to generate a complete 33-field FrameworkSubstep
  */
export function createDefaultSubstep(
  stepNumber: number,
  substepNumber: number,
  stepName: string,
  phaseName: string
): FrameworkSubstep {
  const id = `substep_${stepNumber}_${substepNumber}`;
  return {
    id,
    title: `${stepName} - Subtask ${substepNumber}`,
    description: `Detailed execution protocol for ${stepName} within ${phaseName}. Performs automated state validation and AI artifact generation.`,
    objective: `Establish verified deliverables for ${stepName} ensuring high compliance with valuation decision gates.`,
    prerequisites: [
      `Completed Step #${Math.max(1, stepNumber - 1)} deliverables`,
      'Valid API keys for Gemini / Local Ollama instance',
      'Configured workspace environment variables'
    ],
    dependencies: [
      stepNumber > 1 ? `substep_${stepNumber - 1}_1` : 'root_initialization'
    ],
    inputs: [
      'business_context.json',
      'valuation_score_matrix.json',
      'market_parameters.config'
    ],
    outputs: [
      `${id}_deliverable.json`,
      `${id}_execution_log.txt`,
      `${id}_audit_report.pdf`
    ],
    required_files: [
      'config/env.json',
      'prompts/system_prompt.txt'
    ],
    generated_files: [
      `dist/artifacts/${id}_output.json`,
      `logs/${id}_audit.log`
    ],
    estimated_time: '25-45 minutes',
    difficulty: stepNumber < 30 ? 'Beginner' : stepNumber < 90 ? 'Intermediate' : 'Advanced',
    automation_level: 'Semi-Automated',
    ai_required: true,
    human_required: false,
    primary_model: 'gemini-2.5-flash',
    fallback_model: 'deepseek-coder:14b',
    prompt: `Act as a Principal Enterprise Architect. Execute ${stepName} for phase ${phaseName}. Analyze inputs, optimize valuation driver scores, and output a structured execution schema.`,
    context: `Operating in ASTRO LAB FAB runtime environment. Goal: Drive maximum revenue impact and risk reduction for high valuation gate transition.`,
    validation_prompt: `Evaluate the generated deliverable for ${stepName}. Check if output contains valid JSON, meets all 5 quality checklist criteria, and satisfies audit rules.`,
    python_script: `import json, sys\n\ndef run_substep():\n    print(f"Executing Python worker for ${id}: ${stepName}")\n    output = {"status": "SUCCESS", "substep_id": "${id}", "score_boost": 0.85}\n    with open("dist/artifacts/${id}_output.json", "w") as f:\n        json.dump(output, f, indent=2)\n\nif __name__ == '__main__':\n    run_substep()`,
    bash_script: `#!/usr/bin/env bash\nset -euo pipefail\necho "[ASTRO LAB FAB] Running Substep ${id}: ${stepName}"\npython3 scripts/run_${id}.py\necho "[SUCCESS] Substep ${id} completed."`,
    sql_script: `INSERT INTO substep_execution_logs (substep_id, step_number, step_name, status, executed_at)\nVALUES ('${id}', ${stepNumber}, '${stepName.replace(/'/g, "''")}', 'COMPLETED', NOW());`,
    n8n_workflow: JSON.stringify({
      nodes: [
        { name: "Trigger", type: "n8n-nodes-base.webhook", position: [100, 200] },
        { name: "Gemini AI Step Executor", type: "n8n-nodes-base.httpRequest", position: [300, 200] },
        { name: "Log Result", type: "n8n-nodes-base.postgres", position: [500, 200] }
      ],
      connections: {}
    }, null, 2),
    docker_container: `astro-lab-fab/worker:${id.toLowerCase()}`,
    api_calls: [
      {
        endpoint: '/api/gemini/step-execute',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber, stepName, phaseName })
      }
    ],
    verification: `Check if dist/artifacts/${id}_output.json exists and returns exit status 0 with valid schema.`,
    expected_output: `Formatted JSON deliverable containing compliance logs, valuation driver score multipliers, and audit checklist.`,
    quality_checklist: [
      'Valid JSON format with no syntax errors',
      'All 6 valuation drivers calculated and non-zero',
      'Decision gate evaluation returned GO or REVISE',
      'Execution log written to disk without fatal warnings',
      'Security and license requirements met'
    ],
    rollback: `git checkout HEAD~1 -- dist/artifacts/ && python3 scripts/rollback_${id}.py`,
    retry: {
      max_attempts: 3,
      backoff_seconds: 5,
      action: 'Switch to fallback_model (deepseek-coder:14b) and re-trigger pipeline.'
    },
    next_substep: `substep_${stepNumber}_${substepNumber + 1}`,
    references: [
      'https://docs.astrolabfab.ai/substeps/specification',
      'https://sba.gov/business-guide',
      'https://irs.gov/publications/p334'
    ]
  };
}

/**
  * Full 11 Module Business Framework Content Generators
  */
export function generateFrameworkModules(phases: any[], activeModelName: string, businessContext: string) {
  // Sample 33-field Substep for demonstration & schema export
  const sampleSubstep = createDefaultSubstep(1, 1, "Define Business Vision & Core Problem", "Phase 1: Idea & Concept Validation");

  const module00_schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "AstroLabFabBusinessFrameworkSchema",
    type: "object",
    properties: {
      framework_version: { type: "string" },
      substep_schema: {
        type: "object",
        required: [
          "id", "title", "description", "objective", "prerequisites", "dependencies",
          "inputs", "outputs", "required_files", "generated_files", "estimated_time",
          "difficulty", "automation_level", "ai_required", "human_required", "primary_model",
          "fallback_model", "prompt", "context", "validation_prompt", "python_script",
          "bash_script", "sql_script", "n8n_workflow", "docker_container", "api_calls",
          "verification", "expected_output", "quality_checklist", "rollback", "retry",
          "next_substep", "references"
        ],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          objective: { type: "string" },
          prerequisites: { type: "array", items: { type: "string" } },
          dependencies: { type: "array", items: { type: "string" } },
          inputs: { type: "array", items: { type: "string" } },
          outputs: { type: "array", items: { type: "string" } },
          required_files: { type: "array", items: { type: "string" } },
          generated_files: { type: "array", items: { type: "string" } },
          estimated_time: { type: "string" },
          difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
          automation_level: { type: "string", enum: ["Fully Automated", "Semi-Automated", "Manual"] },
          ai_required: { type: "boolean" },
          human_required: { type: "boolean" },
          primary_model: { type: "string" },
          fallback_model: { type: "string" },
          prompt: { type: "string" },
          context: { type: "string" },
          validation_prompt: { type: "string" },
          python_script: { type: "string" },
          bash_script: { type: "string" },
          sql_script: { type: "string" },
          n8n_workflow: { type: "string" },
          docker_container: { type: "string" },
          api_calls: { type: "array" },
          verification: { type: "string" },
          expected_output: { type: "string" },
          quality_checklist: { type: "array", items: { type: "string" } },
          rollback: { type: "string" },
          retry: { type: "object" },
          next_substep: { type: ["string", "null"] },
          references: { type: "array", items: { type: "string" } }
        }
      }
    }
  };

  const module01_business_plan = {
    plan_title: "Formal AI Enterprise Business Plan",
    active_model: activeModelName,
    business_context: businessContext,
    sections: [
      { id: "EX_SUM", name: "Executive Summary", status: "DRAFTED" },
      { id: "MKT_ANALYSIS", name: "Market Analysis & TAM/SAM/SOM", status: "DRAFTED" },
      { id: "PRODUCT_LINE", name: "Product & Service Offerings", status: "DRAFTED" },
      { id: "MKTG_SALES", name: "Marketing & Go-to-Market Strategy", status: "DRAFTED" },
      { id: "OPERATIONS", name: "Operations & Legal Entity Design", status: "DRAFTED" },
      { id: "FINANCIALS", name: "Financial Projections & Tax Optimization", status: "DRAFTED" }
    ]
  };

  const module02_business_models = {
    selected_model: activeModelName,
    available_models: [
      "Software as a Service (SaaS / Enterprise)",
      "High-Margin Marketplace / Platform",
      "Direct-to-Consumer (D2C) E-Commerce",
      "Agency / Tech-Enabled Consulting Service",
      "Freemium Consumer App with In-App Subscriptions",
      "Hardware-as-a-Service (HaaS) + Recurring Software",
      "Franchise / Licensing Enterprise Network",
      "Open Source Core with Enterprise Premium Plugins"
    ]
  };

  const module03_pipeline = {
    total_phases: phases.length,
    total_steps: phases.reduce((acc, p) => acc + p.steps.length, 0),
    phases_breakdown: phases.map((p) => ({
      phase_id: p.phase_id,
      phase_name: p.phase_name,
      step_count: p.steps.length,
      sample_substep: createDefaultSubstep(p.steps[0]?.step || 1, 1, p.steps[0]?.name || "Phase Initialization", p.phase_name)
    }))
  };

  const module04_sops = {
    sop_count: 5,
    sops: [
      { id: "SOP-001", name: "Automated Data Ingestion & Customer Validation", cli: "ollama run deepseek-coder:14b 'SOP-001'" },
      { id: "SOP-002", name: "AI Statement of Work (SOW) Audit Protocol", cli: "python3 scripts/sow_audit.py" },
      { id: "SOP-003", name: "IRS Tax Deduction & Mileage Calculation Engine", cli: "node scripts/tax_calc.js" },
      { id: "SOP-004", name: "Grants.gov API Opportunity Ingestion", cli: "curl -X GET https://api.grants.gov" },
      { id: "SOP-005", name: "Creative Brand Asset & Video Ad Blueprinting", cli: "gemini generate-creative-spec" }
    ]
  };

  const module05_prompts = {
    system_prompt: "You are ASTRO LAB FAB AI Executive Advisor. Maintain strict enterprise format and produce validated business schema deliverables.",
    step_execution_prompt: "Execute step {stepNumber}: {stepName} for {businessContext}.",
    validation_prompt: "Verify output artifact against 5-point quality checklist."
  };

  const module06_scripts = {
    bash_entrypoint: "#!/usr/bin/env bash\npython3 scripts/run_pipeline.py",
    python_pipeline: "import json, os\nprint('Astro Lab Fab Autonomous Pipeline Standard Engine')",
    sql_schema: "CREATE TABLE IF NOT EXISTS startup_execution_logs (id SERIAL PRIMARY KEY, step_id INT, status VARCHAR(50));"
  };

  const module07_workflows = {
    orchestrator: "n8n_docker_runner",
    docker_image: "astrolabfab/engine:2.4",
    endpoints: [
      { path: "/api/gemini/step-execute", method: "POST" },
      { path: "/api/business-plan/generate", method: "POST" },
      { path: "/api/creative/generate", method: "POST" },
      { path: "/api/tax/report", method: "POST" }
    ]
  };

  const module08_validation = {
    quality_checklist_default: [
      "Valid JSON format with no syntax errors",
      "All 6 valuation drivers calculated and non-zero",
      "Decision gate evaluation returned GO or REVISE",
      "Execution log written to disk without fatal warnings",
      "Security and license requirements met"
    ],
    retry_policy: {
      max_attempts: 3,
      backoff_seconds: 5,
      fallback_model: "deepseek-coder:14b"
    }
  };

  const module09_assets = {
    branding_assets: ["Business Cards", "Logo Concepts", "Responsive Landing Page Code", "15s/30s/60s Ad Scripts"],
    color_palette: {
      bg: "#08090a",
      card: "#121417",
      border: "#1f2228",
      accent: "#00ff9d"
    }
  };

  const module10_outputs = {
    generated_artifacts_count: 145,
    sample_deliverable: sampleSubstep
  };

  const master_framework = {
    metadata: FRAMEWORK_METADATA,
    schema: module00_schema,
    business_plan: module01_business_plan,
    business_models: module02_business_models,
    pipeline: module03_pipeline,
    sops: module04_sops,
    prompts: module05_prompts,
    scripts: module06_scripts,
    workflows: module07_workflows,
    validation: module08_validation,
    assets: module09_assets,
    outputs: module10_outputs
  };

  return {
    '00_schema.json': module00_schema,
    '01_business_plan.json': module01_business_plan,
    '02_business_models.json': module02_business_models,
    '03_pipeline.json': module03_pipeline,
    '04_sops.json': module04_sops,
    '05_prompts.json': module05_prompts,
    '06_scripts.json': module06_scripts,
    '07_workflows.json': module07_workflows,
    '08_validation.json': module08_validation,
    '09_assets.json': module09_assets,
    '10_outputs.json': module10_outputs,
    'business_framework.json': master_framework
  };
}
