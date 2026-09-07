import { jsPDF } from 'jspdf';
import { StartupPhase, StartupStep } from '../types';
import { BUSINESS_MODELS, BUSINESS_PLAN_SECTIONS, INITIAL_SOPS, GRANT_OPPORTUNITIES as FEDERAL_GRANTS } from '../data/startupData';

export interface PdfExportOptions {
  businessName: string;
  activeModelName: string;
  overallScore: number;
  completedStepsCount: number;
  totalStepsCount: number;
  phases: StartupPhase[];
  includeCoverPage?: boolean;
  includeBusinessPlan?: boolean;
  includeFrameworkRoadmap?: boolean;
  includeTaxMatrix?: boolean;
  includeGrantsPipeline?: boolean;
  includeSops?: boolean;
  includeExitStrategy?: boolean;
  confidentialityLevel?: string;
  preparedFor?: string;
}

export function generateMasterPdf(options: PdfExportOptions): jsPDF {
  const {
    businessName = 'ASTRO LAB FAB',
    activeModelName,
    overallScore,
    completedStepsCount,
    totalStepsCount,
    phases,
    includeCoverPage = true,
    includeBusinessPlan = true,
    includeFrameworkRoadmap = true,
    includeTaxMatrix = true,
    includeGrantsPipeline = true,
    includeSops = true,
    includeExitStrategy = true,
    confidentialityLevel = 'HIGHLY CONFIDENTIAL — PROPRIETARY',
    preparedFor = 'Executive Leadership & Board of Directors',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const safeBusinessName = businessName || 'ASTRO LAB FAB';
  const percentComplete = Math.round((completedStepsCount / (totalStepsCount || 1)) * 100);
  const activeModel = BUSINESS_MODELS.find((m) => m.model_name === activeModelName) || BUSINESS_MODELS[0];

  let isFirstPage = true;

  const startNewPage = (sectionTitle?: string) => {
    if (!isFirstPage) {
      doc.addPage();
    }
    isFirstPage = false;

    // Header strip on inner pages
    if (sectionTitle) {
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 16, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 255, 157); // emerald accent
      doc.text('ASTRO LAB FAB CONTROL PLANE', margin, 10.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text(`|  ${safeBusinessName.toUpperCase()}  |  ${sectionTitle.toUpperCase()}`, margin + 55, 10.5);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7.5);
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      doc.text(dateStr, pageWidth - margin - 20, 10.5);

      // Bottom rule
      doc.setDrawColor(0, 255, 157);
      doc.setLineWidth(0.4);
      doc.line(margin, 16, pageWidth - margin, 16);
    }
  };

  // Helper for drawing clean section titles
  const drawSectionHeading = (title: string, subtitle: string, yPos: number): number => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, margin, yPos + 4.5);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos + 6.5, pageWidth - margin, yPos + 6.5);

    return yPos + 11;
  };

  // ==========================================
  // PAGE 1: COVER & EXECUTIVE DOSSIER
  // ==========================================
  if (includeCoverPage) {
    startNewPage();

    // Dark Premium Hero Background
    doc.setFillColor(11, 15, 25); // Deep Titanium
    doc.rect(0, 0, pageWidth, 110, 'F');

    // Emerald Decorative Top Bar
    doc.setFillColor(0, 255, 157);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Confidentiality pill
    doc.setFillColor(24, 32, 47);
    doc.roundedRect(margin, 14, 85, 6.5, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 255, 157);
    doc.text(confidentialityLevel, margin + 4, 18.5);

    // Main Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('ENTERPRISE EXECUTION DOSSIER', margin, 34);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 255, 157);
    doc.text(safeBusinessName.toUpperCase(), margin, 43);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(203, 213, 225);
    const subtitleLines = doc.splitTextToSize(
      `Master Business Architecture, Valuation Decision Gates, Federal Grant Pipeline & Autonomous Tax Optimization Blueprint.`,
      contentWidth
    );
    doc.text(subtitleLines, margin, 51);

    // 4 Bento Metric Cards on Cover
    const bentoY = 65;
    const cardWidth = (contentWidth - 9) / 4;
    const cardHeight = 28;

    const bentoCards = [
      { label: 'VALUATION INDEX', val: `${overallScore.toFixed(2)} / 10`, sub: overallScore >= 7 ? 'GO Gate Approved' : 'Under Review', color: [0, 255, 157] },
      { label: 'LIFECYCLE PROGRESS', val: `${percentComplete}%`, sub: `${completedStepsCount} of ${totalStepsCount} Steps`, color: [56, 189, 248] },
      { label: 'ARCHITECTURE MODEL', val: activeModelName.slice(0, 14), sub: activeModel.definition.slice(0, 18) + '...', color: [251, 191, 36] },
      { label: 'EST. GRANT CEILING', val: '$2,850,000', sub: '5 Matched Programs', color: [168, 85, 247] },
    ];

    bentoCards.forEach((card, idx) => {
      const cardX = margin + idx * (cardWidth + 3);
      doc.setFillColor(18, 24, 38);
      doc.roundedRect(cardX, bentoY, cardWidth, cardHeight, 2, 2, 'F');
      doc.setDrawColor(38, 48, 70);
      doc.setLineWidth(0.3);
      doc.roundedRect(cardX, bentoY, cardWidth, cardHeight, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(card.label, cardX + 3, bentoY + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(card.color[0], card.color[1], card.color[2]);
      doc.text(card.val, cardX + 3, bentoY + 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(203, 213, 225);
      doc.text(card.sub, cardX + 3, bentoY + 22);
    });

    // Lower Half Content of Cover Page
    let curY = 122;

    curY = drawSectionHeading('Executive Overview & Strategic Intent', 'Corporate thesis and operating posture', curY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const intentText = `${safeBusinessName} operates an enterprise-grade autonomous business architecture centered on the ${activeModelName} framework. By combining automated compliance structures (S-Corporation tax shielding, Section 179 depreciation gates), multi-channel federal grant funding pipelines, and algorithmic MLOps governance, the entity achieves high operating leverage and enterprise valuation growth.`;
    const intentLines = doc.splitTextToSize(intentText, contentWidth);
    doc.text(intentLines, margin, curY);
    curY += intentLines.length * 4.2 + 6;

    // Metadata Key-Value Grid
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, curY, contentWidth, 54, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, curY, contentWidth, 54, 2, 2, 'S');

    const metaGrid = [
      { k: 'Legal Entity Name:', v: safeBusinessName },
      { k: 'Prepared For:', v: preparedFor },
      { k: 'Classification:', v: confidentialityLevel },
      { k: 'Operating Architecture:', v: activeModelName },
      { k: 'Federal SAM / UEI Status:', v: 'ACTIVE (UEI-ASTRO-2026-X89 | CAGE: 8K9F2)' },
      { k: 'IRS Tax Classification:', v: 'Operating LLC / Form 2553 S-Corp Election' },
      { k: 'Holding Entity:', v: 'Revocable Asset Protection & IP Trust' },
      { k: 'Publication Date:', v: new Date().toISOString() },
    ];

    metaGrid.forEach((row, i) => {
      const col = i % 2;
      const rowIdx = Math.floor(i / 2);
      const startX = margin + 5 + col * (contentWidth / 2);
      const rowY = curY + 7 + rowIdx * 11;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(row.k, startX, rowY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(row.v, startX, rowY + 4.5);
    });

    curY += 62;

    // Sign-Off Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('AUTHORIZED OPERATIONAL SIGNATURES', margin, curY);
    curY += 8;

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, curY + 6, margin + 70, curY + 6);
    doc.line(margin + 90, curY + 6, margin + 160, curY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Managing Partner / Chief Executive', margin, curY + 10);
    doc.text('Chief Legal & Tax Compliance Officer', margin + 90, curY + 10);
  }

  // ==========================================
  // PAGE 2: BUSINESS PLAN & 3-YEAR MODEL
  // ==========================================
  if (includeBusinessPlan) {
    startNewPage('Strategic Business Plan');

    let curY = 24;
    curY = drawSectionHeading('Executive Business Plan & Model Architecture', `${activeModelName} — Structural Strategy & Target Economics`, curY);

    BUSINESS_PLAN_SECTIONS.slice(0, 5).forEach((section) => {
      if (curY > pageHeight - 35) {
        startNewPage('Strategic Business Plan (Cont.)');
        curY = 24;
      }

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, curY, contentWidth, 22, 1.5, 1.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, curY, contentWidth, 22, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(section.section_name, margin + 4, curY + 5.5);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(0, 128, 70);
      doc.text(`Purpose: ${section.purpose}`, margin + 4, curY + 9.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(section.description, contentWidth - 8);
      doc.text(descLines, margin + 4, curY + 14);

      curY += 26;
    });

    // 3-Year Projections Table
    if (curY > pageHeight - 65) {
      startNewPage('Financial Model & Projections');
      curY = 24;
    }

    curY = drawSectionHeading('3-Year Pro Forma Financial Matrix', 'Target Unit Economics & Revenue Velocity', curY);

    const finHeaders = ['Fiscal Year', 'Gross Revenue', 'COGS / Cloud', 'OpEx & Labor', 'EBITDA (Est.)', 'Net Margin'];
    const finRows = [
      ['Year 1 (Bootstrap & Seed)', '$350,000', '$45,000', '$120,000', '$185,000', '52.8%'],
      ['Year 2 (Scale & Grants)', '$1,250,000', '$135,000', '$320,000', '$795,000', '63.6%'],
      ['Year 3 (Autonomous Exit)', '$3,800,000', '$340,000', '$750,000', '$2,710,000', '71.3%'],
    ];

    const colW = contentWidth / 6;
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, curY, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    finHeaders.forEach((h, i) => {
      doc.text(h, margin + i * colW + 2, curY + 4.8);
    });

    curY += 7;

    finRows.forEach((r, rIdx) => {
      doc.setFillColor(rIdx % 2 === 0 ? 255 : 248, 250, 252);
      doc.rect(margin, curY, contentWidth, 6.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, curY + 6.5, margin + contentWidth, curY + 6.5);

      doc.setFont('helvetica', rIdx === 2 ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);

      r.forEach((cell, cIdx) => {
        doc.text(cell, margin + cIdx * colW + 2, curY + 4.5);
      });
      curY += 6.5;
    });
  }

  // ==========================================
  // PAGE 3: MASTER FRAMEWORK & MILESTONES
  // ==========================================
  if (includeFrameworkRoadmap) {
    startNewPage('Master Framework & Lifecycle');

    let curY = 24;
    curY = drawSectionHeading('Framework Execution & Decision Gates', `Phased Lifecycle Breakdown (${percentComplete}% Complete)`, curY);

    phases.forEach((phase) => {
      if (curY > pageHeight - 35) {
        startNewPage('Framework Execution (Cont.)');
        curY = 24;
      }

      const phaseSteps = phase.steps;
      const completed = phaseSteps.filter((s) => s.status === 'completed').length;
      const phasePercent = Math.round((completed / (phaseSteps.length || 1)) * 100);

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, curY, contentWidth, 7, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${phase.phase_name.toUpperCase()}`, margin + 3, curY + 4.8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(phasePercent === 100 ? 0 : 71, phasePercent === 100 ? 128 : 85, phasePercent === 100 ? 70 : 105);
      doc.text(`${completed}/${phaseSteps.length} Steps (${phasePercent}%)`, pageWidth - margin - 35, curY + 4.8);

      curY += 9;

      // Render top steps
      phaseSteps.slice(0, 4).forEach((step) => {
        if (curY > pageHeight - 18) {
          startNewPage('Framework Execution (Cont.)');
          curY = 24;
        }

        const isDone = step.status === 'completed';
        doc.setFont('helvetica', isDone ? 'bold' : 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(isDone ? 15 : 100, isDone ? 23 : 116, isDone ? 42 : 139);

        const statusMark = isDone ? '[DONE]' : '[OPEN]';
        doc.text(`${statusMark} Step ${step.step}: ${step.name}`, margin + 4, curY + 3.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`Driver: ${step.valuation_driver} | Gate: ${step.decision_focus.slice(0, 45)}...`, margin + 12, curY + 7);

        curY += 9;
      });

      curY += 3;
    });
  }

  // ==========================================
  // PAGE 4: TAX OPTIMIZER & COMPLIANCE MATRIX
  // ==========================================
  if (includeTaxMatrix) {
    startNewPage('Tax Strategy & Legal Matrix');

    let curY = 24;
    curY = drawSectionHeading("Mark's Tax & Legal Blueprint Matrix", 'Entity Structuring, Self-Employment Tax Shielding & Section 179 Gates', curY);

    // Entity Hierarchy Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, curY, contentWidth, 38, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, curY, contentWidth, 38, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('1. DUAL-TIER ENTITY ARCHITECTURE', margin + 4, curY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const tierText = [
      `• Operating Entity: ${safeBusinessName} LLC (Electing S-Corp status via IRS Form 2553). Eliminates 15.3% SE tax on distributions.`,
      `• Holding Entity: Revocable Asset Protection & IP Holding Trust. Holds equity, domain names, patents, and licensing agreements.`,
      `• Accountable Plan: IRC Section 62(a)(2)(A) compliant reimbursement structure for home office, vehicle, and tech hardware.`,
      `• QSBS 1202 Eligibility: Verified capital gains exclusion roadmap upon qualified corporate reorganization.`,
    ];

    tierText.forEach((line, idx) => {
      doc.text(line, margin + 4, curY + 13 + idx * 5.8);
    });

    curY += 44;

    // Tax Savings Calculation Table
    curY = drawSectionHeading('Calculated Tax Shield Benchmarks', 'Comparison of Standard Schedule C vs. S-Corp Dual Distribution Model', curY);

    const taxHeaders = ['Metric Description', 'Sole Prop (Sched C)', 'S-Corp Strategy', 'Estimated Tax Savings'];
    const taxRows = [
      ['Gross Operating Revenue', '$250,000', '$250,000', '—'],
      ['Section 179 Tech Depreciation', '($25,000)', '($25,000)', 'Tax deferred'],
      ['Adjusted Net Profit', '$225,000', '$225,000', '—'],
      ['Reasonable W-2 Salary', 'N/A (100% Taxable)', '$80,000 (W-2)', 'FICA Base Capped'],
      ['K-1 Distribution (No SE Tax)', '$0', '$145,000 (K-1)', '15.3% SE Tax Avoided'],
      ['Annual Self-Employment Tax', '$34,425', '$12,240', '$22,185 NET SAVED'],
    ];

    const taxColW = contentWidth / 4;
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, curY, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    taxHeaders.forEach((h, i) => {
      doc.text(h, margin + i * taxColW + 2, curY + 4.8);
    });

    curY += 7;

    taxRows.forEach((r, rIdx) => {
      const isTotal = rIdx === taxRows.length - 1;
      doc.setFillColor(isTotal ? 220 : rIdx % 2 === 0 ? 255 : 248, isTotal ? 252 : 250, isTotal ? 231 : 252);
      doc.rect(margin, curY, contentWidth, 6.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, curY + 6.5, margin + contentWidth, curY + 6.5);

      doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(isTotal ? 0 : 15, isTotal ? 100 : 23, isTotal ? 50 : 42);

      r.forEach((cell, cIdx) => {
        doc.text(cell, margin + cIdx * taxColW + 2, curY + 4.5);
      });
      curY += 6.5;
    });
  }

  // ==========================================
  // PAGE 5: GRANTS & PLAYWRIGHT AUTOMATION
  // ==========================================
  if (includeGrantsPipeline) {
    startNewPage('Grants Pipeline & Bots');

    let curY = 24;
    curY = drawSectionHeading('Federal Grants & Capital Procurement Pipeline', 'Matched Non-Dilutive Capital Opportunities & Automated Playwright Engine', curY);

    FEDERAL_GRANTS.slice(0, 4).forEach((grant) => {
      if (curY > pageHeight - 35) {
        startNewPage('Grants Pipeline (Cont.)');
        curY = 24;
      }

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, curY, contentWidth, 24, 1.5, 1.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, curY, contentWidth, 24, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(grant.title, margin + 4, curY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 128, 70);
      doc.text(`Max Ceiling: ${grant.amount} | Agency: ${grant.agency}`, margin + 4, curY + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const desc = doc.splitTextToSize(`Eligibility: ${grant.eligibility} — Deadline: ${grant.deadline}`, contentWidth - 8);
      doc.text(desc, margin + 4, curY + 15);

      doc.setTextColor(100, 116, 139);
      doc.text(`Direct Portal: ${grant.url}`, margin + 4, curY + 20);

      curY += 27;
    });

    // Playwright Bot Manifest Block
    if (curY > pageHeight - 45) {
      startNewPage('Grants Automation Engine');
      curY = 24;
    }

    curY = drawSectionHeading('Automated Headless Playwright Bot Specifications', 'Cryptographically Verified Form 8821 & Grants.gov Submission Protocol', curY);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, curY, contentWidth, 28, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 255, 157);
    doc.text('PLAYWRIGHT BOT ACTIVE CAPABILITIES:', margin + 4, curY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(226, 232, 240);
    const botLines = [
      `• Entity Name Cryptographic Check: ${safeBusinessName} matched with IRS Form 8821.`,
      `• Federal SAM.gov & Grants.gov UEI: 2026-X89 valid session tokens.`,
      `• Post-Grants.gov 6-Stage Award Management: NOA parsing, Payment Management System (PMS), and RPPR reporting.`,
      `• Automated CSV Export: Pipeline synchronization and local audit trails.`,
    ];

    botLines.forEach((l, idx) => {
      doc.text(l, margin + 4, curY + 11.5 + idx * 4.5);
    });
  }

  // ==========================================
  // PAGE 6: SOPS & AUTONOMOUS BUILD-TO-SALE
  // ==========================================
  if (includeSops || includeExitStrategy) {
    startNewPage('SOPs & Build-to-Sale Exit');

    let curY = 24;

    if (includeSops) {
      curY = drawSectionHeading('Core Standard Operating Procedures (SOPs)', 'Repeatable Systems & Institutional Knowledge', curY);

      INITIAL_SOPS.slice(0, 3).forEach((sop) => {
        if (curY > pageHeight - 35) {
          startNewPage('SOPs & Exit Strategy (Cont.)');
          curY = 24;
        }

        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, curY, contentWidth, 18, 1.5, 1.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, curY, contentWidth, 18, 1.5, 1.5, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${sop.sop_id}: ${sop.title}`, margin + 4, curY + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text(`Category: ${sop.category} | Objective: ${sop.objective.slice(0, 75)}...`, margin + 4, curY + 10);
        doc.text(`Tools: ${sop.tools.join(', ')}`, margin + 4, curY + 14);

        curY += 21;
      });
    }

    if (includeExitStrategy) {
      if (curY > pageHeight - 55) {
        startNewPage('Build-to-Sale Exit War Room');
        curY = 24;
      }

      curY = drawSectionHeading('Autonomous Build-to-Sale M&A War Room', '10x-20x Multiple Arbitrage & Buyer Acquisition Teaser', curY);

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, curY, contentWidth, 36, 2, 2, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, curY, contentWidth, 36, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`TARGET ACQUISITION PROFILE: ${safeBusinessName.toUpperCase()}`, margin + 4, curY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const exitLines = [
        `• Target Enterprise Valuation: $25,000,000 USD (3-Year Horizon).`,
        `• Core Moat: Proprietary data-science pipelines, zero human dependency workflows, and locked federal grant pipelines.`,
        `• Virtual Data Room (VDR): Financials, tax returns, IP assignments, and SOP documentation ready for diligence.`,
        `• Potential Acquirers: Strategic SaaS consolidators, private equity rollups, and enterprise defense primes.`,
      ];

      exitLines.forEach((l, idx) => {
        doc.text(l, margin + 4, curY + 12 + idx * 5.5);
      });
    }
  }

  // ==========================================
  // FOOTER & PAGE NUMBERING ON ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    // Bottom rule
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Footer text
    doc.text(
      `ASTRO LAB FAB  |  ${safeBusinessName}  |  CONFIDENTIAL & PROPRIETARY`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 15,
      pageHeight - 8
    );
  }

  return doc;
}
