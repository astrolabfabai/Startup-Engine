import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper to initialize Gemini SDK on demand
  function getGenAI(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. AI Step Executor API
  app.post("/api/gemini/step-execute", async (req, res) => {
    try {
      const { stepNumber, stepName, phaseName, businessContext, valuationDriver } = req.body;
      const ai = getGenAI();

      const prompt = `You are an executive startup strategist and business systems architect for "ASTRO LAB FAB Engine".
Your task is to provide a comprehensive, actionable execution plan and deliverable draft for Step ${stepNumber}: "${stepName}" in Phase "${phaseName}".

Business Context:
${businessContext || "A technology startup launching an enterprise scalable product."}

Valuation Driver Focus: ${valuationDriver || "Strategic Fit & Revenue Impact"}

Please provide a structured output with:
1. Executive Summary & Strategic Importance
2. Step-by-step Actionable Execution SOP (3-5 concrete instructions)
3. Key Metrics to Measure Success
4. Risk Factors & Mitigation Actions
5. Ready-to-use Template/Draft Document for this step`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        success: true,
        output: response.text,
      });
    } catch (err: any) {
      console.error("Error in step-execute:", err);
      res.status(500).json({ error: err.message || "Failed to execute AI step guidance" });
    }
  });

  // 2. Creative Asset Generator API
  app.post("/api/gemini/creative-asset", async (req, res) => {
    try {
      const { assetType, brandName, tagline, industry, targetAudience, extraPrompt, mediaQuality, cameraProfile } = req.body;
      const ai = getGenAI();

      let systemPrompt = "";
      if (assetType === "business_cards") {
        systemPrompt = `You are a world-class luxury brand designer and print production director. Create an Ultra-High-Definition (UHD 300+ DPI / 8K Master) print-ready business card specification and copy. Output clean Markdown detailing: Front layout, Back layout, CMYK + Pantone & Hex color codes, Typographic kerning & hierarchy, Spot UV / Foil / Embossing / Bleed specs, and 3 high-impact Taglines.`;
      } else if (assetType === "logo") {
        systemPrompt = `You are a senior brand identity director. Produce 5 distinct UHD Photo Quality & Vector Master logo concepts for "${brandName}" in industry "${industry}". For each concept provide: Optical Symbol concept, Wordmark typography style, Sacred Geometry/Golden Ratio vector breakdown, Color Palette hex & pantone codes, 8K render backdrop composition, and Design Do's & Don'ts.`;
      } else if (assetType === "website") {
        systemPrompt = `You are a principal designer and full-stack engineer. Create an ultra-high-definition, modern, high-converting website architecture for "${brandName}". Output: 1) Sitemap & Navigation structure, 2) Hero section copy & CTA with UHD 8K media staging specs, 3) Ready-to-use HTML/Tailwind CSS interactive code block, 4) SEO meta tags & OpenGraph 8K media tags, 5) Conversion optimization metrics.`;
      } else if (assetType?.startsWith("ad_")) {
        const duration = assetType.replace("ad_", "");
        systemPrompt = `You are an award-winning commercial director shooting in UHD 8K with cinema prime lenses. Create a ${duration} video commercial script, shot list, and visual storyboard for "${brandName}". Target Audience: ${targetAudience || "Enterprise executives & founders"}. Detail: Second-by-second scene breakdown, UHD camera angle/lens focal length, Lighting setup (3-point softbox, rim light, volumetric fog), Voiceover script, On-screen typography overlays, Foley & audio sound design, and High-converting CTA.`;
      } else {
        systemPrompt = `You are an elite creative director generating UHD Photo Quality marketing assets for "${brandName}".`;
      }

      const qualityDirective = `\n\n[MANDATORY MEDIA QUALITY STANDARD]\n- Quality: ${mediaQuality || "UHD 8K Photo Quality Master"}\n- Camera/Optics: ${cameraProfile || "Hasselblad H6D-100c Medium Format / ARRI Alexa 65 Prime"}\n- Photorealism: Raytraced global illumination, hyper-detailed surface textures, professional color grade (DCI-P3).`;

      const fullPrompt = `${systemPrompt}\nBrand Name: ${brandName}\nTagline: ${tagline || ""}\nIndustry: ${industry}\nTarget Audience: ${targetAudience || ""}\nAdditional Directives: ${extraPrompt || "N/A"}${qualityDirective}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: fullPrompt,
      });

      res.json({
        success: true,
        assetType,
        output: response.text,
      });
    } catch (err: any) {
      console.error("Error in creative-asset:", err);
      res.status(500).json({ error: err.message || "Failed to generate creative asset" });
    }
  });

  // 3. IRS Tax & Business Expense Advisor API
  app.post("/api/gemini/tax-advisor", async (req, res) => {
    try {
      const { entityType, annualRevenue, expenses, homeOfficeSqFt, mileage, w2Employees, contractorCount } = req.body;
      const ai = getGenAI();

      const prompt = `You are a CPA and US IRS Small Business Tax Expert.
Analyze the following business tax profile and provide an in-depth tax deduction optimization report.

Entity Type: ${entityType} (e.g. LLC, S-Corp, Sole Prop, C-Corp)
Estimated Annual Revenue: $${annualRevenue}
Categorized Expenses: ${JSON.stringify(expenses || {})}
Home Office Space: ${homeOfficeSqFt || 0} sq ft
Business Vehicle Mileage: ${mileage || 0} miles
W-2 Employees: ${w2Employees || 0}
1099 Independent Contractors: ${contractorCount || 0}

Provide a detailed analysis including:
1. Eligible Deductions Summary (Standard Mileage rate @ $0.56-$0.575/mi, Home Office simplified $5/sqft vs actual, Section 179 bonus depreciation, De Minimis Safe Harbor <$2500, COGS deduction rules, Retirement W2 vs 1099 plans).
2. Estimated Taxable Income Adjustment & Potential Tax Savings.
3. IRS Compliance Audit Flags (Schedule C vs 1065/1120S risks, 1099-NEC required reporting by Jan 31).
4. Opportunity Zones & Clean Energy / Research Credit eligibility tips.
5. Action Checklist for Tax Prep.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        success: true,
        output: response.text,
      });
    } catch (err: any) {
      console.error("Error in tax-advisor:", err);
      res.status(500).json({ error: err.message || "Failed to generate tax advice" });
    }
  });

  // 4. Business Plan Section Generator API
  app.post("/api/gemini/business-plan", async (req, res) => {
    try {
      const { sectionId, sectionName, businessName, industry, problem, solution, targetMarket } = req.body;
      const ai = getGenAI();

      const prompt = `You are a startup CFO and management consultant. Draft a professional, production-ready section for a formal Business Plan: Section "${sectionName}" (ID: ${sectionId}).

Business Name: ${businessName}
Industry: ${industry}
Problem Solved: ${problem}
Solution Provided: ${solution}
Target Market: ${targetMarket}

Deliver a detailed, well-structured business plan section in rich Markdown format, including key figures, strategic frameworks, metrics, and actionable operational steps.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        success: true,
        output: response.text,
      });
    } catch (err: any) {
      console.error("Error in business-plan:", err);
      res.status(500).json({ error: err.message || "Failed to generate business plan section" });
    }
  });

  // 5. Phase Deliverables Generator API
  app.post("/api/gemini/generate-deliverables", async (req, res) => {
    try {
      const { phaseId, phaseName, businessContext } = req.body;
      const ai = getGenAI();

      const prompt = `You are an elite startup venture advisor and COO.
Generate 2 highly specific, realistic, and critical deliverables/milestones for Phase "${phaseName}" (ID: ${phaseId}) tailored for this business:
Business Context: ${businessContext || "High-growth AI / B2B technology startup"}

Return ONLY a JSON array of objects with the following schema:
[
  {
    "title": "Short descriptive title of the milestone objective",
    "deliverable_name": "Concrete artifact name (e.g. 'Signed Enterprise Customer LOI' or 'Automated QA Test Suite')",
    "description": "Specific requirements and acceptance criteria for completion",
    "criticality": "CRITICAL" | "HIGH" | "MEDIUM",
    "category": "Strategic" | "Legal/Compliance" | "Product/Tech" | "Financial" | "Go-to-Market" | "Operational",
    "target_deadline": "Week X",
    "owner_lead": "Role title"
  }
]
Output purely valid JSON array, no markdown code fence ticks.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text = response.text || "[]";
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      let deliverables = [];
      try {
        deliverables = JSON.parse(text);
      } catch {
        deliverables = [];
      }

      res.json({
        success: true,
        deliverables,
      });
    } catch (err: any) {
      console.error("Error in generate-deliverables:", err);
      res.status(500).json({ error: err.message || "Failed to generate deliverables" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
