import React, { useState, useMemo } from 'react';
import { TaxExpenses } from '../types';
import { MarksTaxBlueprintChart } from './MarksTaxBlueprintChart';
import {
  Receipt,
  Calculator,
  ShieldAlert,
  Sparkles,
  DollarSign,
  Building,
  Car,
  Home,
  Users,
  Award,
  RotateCcw,
  BookOpen,
  CheckSquare,
  Layers,
  TrendingDown,
  Download,
} from 'lucide-react';

const DEDUCTION_STRATEGIES = [
  {
    id: 'sec179',
    title: 'Section 179 Full Expensing',
    code: 'IRC §179',
    description: 'Expense 100% of equipment, machinery, computer hardware & off-the-shelf software up to $1.04M in year 1.',
    estSavings: '$3,750 - $15,000',
    applicable: 'All Entities',
  },
  {
    id: 'home_office',
    title: 'Simplified Home Office Deduction',
    code: 'IRS Pub 587',
    description: 'Deduct $5.00/sq ft for up to 300 sq ft dedicated exclusively and regularly for business operations ($1,500 standard).',
    estSavings: '$375 - $1,500',
    applicable: 'LLC, Sole-Prop, S-Corp (Accountable Plan)',
  },
  {
    id: 'mileage_standard',
    title: 'Vehicle Standard Mileage Method',
    code: 'Rev. Proc. 2019-46',
    description: 'Deduct $0.575/mile for business travel plus parking, tolls, and auto loan interest percentage.',
    estSavings: '$1,800 - $7,187',
    applicable: 'All Entities',
  },
  {
    id: 'sep_ira',
    title: 'SEP-IRA / Solo 401(k) Retirement Plan',
    code: 'IRC §408(k)',
    description: 'Contribute up to 25% of net adjusted business earnings or $66,000 to defer federal & state income taxes.',
    estSavings: '$2,500 - $16,500',
    applicable: 'All Entities',
  },
  {
    id: 'de_minimis',
    title: 'De Minimis Safe Harbor Election',
    code: 'Treas. Reg. §1.263(a)-1(f)',
    description: 'Immediately expense tangible property or invoice line items costing under $2,500 per item without capitalization.',
    estSavings: '$1,200 - $5,000',
    applicable: 'All Entities',
  },
  {
    id: 'accountable_plan',
    title: 'S-Corp Accountable Reimbursement Plan',
    code: 'IRC §62(a)(2)(A)',
    description: 'Reimburse owner-employee for personal funds used for business out-of-pocket expenses free of payroll and income taxes.',
    estSavings: '$2,000 - $8,000',
    applicable: 'S-Corp, C-Corp',
  },
  {
    id: 'rd_tax_credit',
    title: 'R&D Tax Credit (Payroll Offset)',
    code: 'IRC §41 / Form 6765',
    description: 'Qualified small businesses can offset up to $500,000 in employer FICA payroll taxes using qualified R&D software costs.',
    estSavings: '$5,000 - $50,000',
    applicable: 'Startups < 5 yrs old',
  },
];

export const TaxOptimizerTab: React.FC = () => {
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<Array<'LLC' | 'S-Corp' | 'Sole-Prop' | 'C-Corp'>>(['LLC', 'S-Corp']);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(['sec179', 'home_office', 'mileage_standard', 'sep_ira']);
  const [annualRevenue, setAnnualRevenue] = useState<number>(250000);

  const [expenses, setExpenses] = useState<TaxExpenses>({
    advertising: 12000,
    businessMeals: 4500,
    insurance: 3600,
    bankFees: 800,
    vehicleMileage: 12500, // miles
    contractorLabor: 28000,
    depreciableAssets: 15000,
    homeOfficeSqFt: 250,
    legalProfessional: 5000,
    officeRent: 0,
    employeeSalaries: 45000,
    taxesLicenses: 2200,
    phoneInternet: 2400,
    travelExpenses: 6500,
    retirementContributions: 10000,
    healthInsurance: 6000,
  });

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleEntityType = (entity: 'LLC' | 'S-Corp' | 'Sole-Prop' | 'C-Corp') => {
    setSelectedEntityTypes(prev => {
      const exists = prev.includes(entity);
      const updated = exists ? prev.filter(e => e !== entity) : [...prev, entity];
      return updated.length === 0 ? [entity] : updated;
    });
  };

  const toggleStrategy = (id: string) => {
    setSelectedStrategyIds(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(s => s !== id) : [...prev, id];
    });
  };

  const selectAllStrategies = () => {
    if (selectedStrategyIds.length === DEDUCTION_STRATEGIES.length) {
      setSelectedStrategyIds([DEDUCTION_STRATEGIES[0].id]);
    } else {
      setSelectedStrategyIds(DEDUCTION_STRATEGIES.map(s => s.id));
    }
  };

  // Math deductions
  const mileageDeduction = expenses.vehicleMileage * 0.575;
  const homeOfficeDeduction = Math.min(expenses.homeOfficeSqFt, 300) * 5; // Simplified $5/sqft
  const mealsDeduction = expenses.businessMeals * 0.5; // 50%

  const totalDeductions =
    expenses.advertising +
    mealsDeduction +
    expenses.insurance +
    expenses.bankFees +
    mileageDeduction +
    expenses.contractorLabor +
    expenses.depreciableAssets +
    homeOfficeDeduction +
    expenses.legalProfessional +
    expenses.officeRent +
    expenses.employeeSalaries +
    expenses.taxesLicenses +
    expenses.phoneInternet +
    expenses.travelExpenses +
    expenses.retirementContributions +
    expenses.healthInsurance;

  const estimatedTaxableIncome = Math.max(0, annualRevenue - totalDeductions);
  const estimatedTaxSavings = totalDeductions * 0.25; // assumed 25% bracket

  // Multi-entity comparative model calculation
  const entityTaxComparison = useMemo(() => {
    return [
      {
        entity: 'Sole-Prop' as const,
        name: 'Sole Proprietorship / Disregarded Single-Member LLC',
        seTaxRate: '15.3% (FICA + Med on 100% Net)',
        selfEmploymentTax: estimatedTaxableIncome * 0.9235 * 0.153,
        estimatedTotalTax: estimatedTaxableIncome * 0.22 + (estimatedTaxableIncome * 0.9235 * 0.153),
        pros: 'Simplest filing (Schedule C), no payroll overhead, full write-offs.',
        cons: '15.3% Self-Employment tax applies to every dollar of profit.',
      },
      {
        entity: 'LLC' as const,
        name: 'LLC (Pass-Through Default)',
        seTaxRate: '15.3% on Active Member Profit',
        selfEmploymentTax: estimatedTaxableIncome * 0.9235 * 0.153,
        estimatedTotalTax: estimatedTaxableIncome * 0.22 + (estimatedTaxableIncome * 0.9235 * 0.153),
        pros: 'Strong liability protection, flexible ownership, simple pass-through.',
        cons: 'Subject to standard Self-Employment tax unless S-Corp election made.',
      },
      {
        entity: 'S-Corp' as const,
        name: 'S-Corporation (Form 2553 Election)',
        seTaxRate: '15.3% ONLY on Reasonable W-2 Salary (e.g. 50%)',
        selfEmploymentTax: Math.min(estimatedTaxableIncome, 85000) * 0.153,
        estimatedTotalTax: estimatedTaxableIncome * 0.22 + (Math.min(estimatedTaxableIncome, 85000) * 0.153),
        pros: 'Saves 15.3% FICA on shareholder dividend distributions ($5K-$18K/yr avg savings).',
        cons: 'Requires payroll processing and Form 1120-S corporate return.',
      },
      {
        entity: 'C-Corp' as const,
        name: 'C-Corporation (IRC Subchapter C)',
        seTaxRate: '21% Flat Federal Corporate Tax + Dividend Tax',
        selfEmploymentTax: 0,
        estimatedTotalTax: estimatedTaxableIncome * 0.21,
        pros: '21% flat rate, Section 1202 QSBS 100% capital gains exclusion, venture-investor standard.',
        cons: 'Double taxation on dividend payouts to owners.',
      },
    ];
  }, [estimatedTaxableIncome]);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/tax-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityTypes: selectedEntityTypes,
          entityType: selectedEntityTypes[0],
          annualRevenue,
          expenses,
          homeOfficeSqFt: expenses.homeOfficeSqFt,
          mileage: expenses.vehicleMileage,
          selectedStrategies: selectedStrategyIds,
          w2Employees: expenses.employeeSalaries > 0 ? 1 : 0,
          contractorCount: expenses.contractorLabor > 0 ? 3 : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate tax report');
      }

      setAiReport(data.output);
    } catch (err: any) {
      setError(err.message || 'Error generating tax report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bento-card p-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#08090a] text-[#00ff9d] border border-[#00ff9d]/30 text-xs font-mono uppercase tracking-wider">
            <Receipt className="w-3.5 h-3.5 text-[#00ff9d]" /> IRS Business Tax & Multi-Entity Optimizer
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Multi-Entity Tax Shield & Strategy Optimizer
          </h2>
          <p className="text-xs text-[#888e96]">
            Compare LLC, S-Corp, Sole-Prop, and C-Corp tax liability side-by-side. Select multi-strategy deductions including Section 179, Simplified Home Office, Vehicle Standard Mileage, Accountable Plans, and R&D Credits.
          </p>
        </div>
      </div>

      {/* Mark's Tax & Legal Blueprint Matrix Visual Chart */}
      <MarksTaxBlueprintChart
        annualRevenue={annualRevenue}
        expenses={expenses}
      />

      {/* Multi-Entity Comparative Matrix */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f2228] pb-3 gap-2">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-[#00ff9d]" /> Multi-Entity Comparative Tax Simulator ({selectedEntityTypes.length} Active)
          </h3>
          <span className="text-[10px] font-mono text-[#888e96]">Click Entity Cards to Multi-Select & Compare</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {entityTaxComparison.map((item) => {
            const isSelected = selectedEntityTypes.includes(item.entity);
            return (
              <div
                key={item.entity}
                onClick={() => toggleEntityType(item.entity)}
                className={`p-4 rounded-xl border transition-all cursor-pointer font-mono space-y-3 ${
                  isSelected
                    ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-white ring-1 ring-[#00ff9d]'
                    : 'bg-[#08090a] border-[#1f2228] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-[#00ff9d] text-black font-bold' : 'bg-[#121417] border border-[#1f2228]'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="text-xs font-bold text-white">{item.entity}</span>
                  </div>
                  <span className="text-[9px] text-[#00ff9d] bg-[#00ff9d]/15 px-1.5 py-0.5 rounded">
                    {isSelected ? 'Selected' : 'Click to Add'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-[#888e96]">Est. Total Tax Burden:</div>
                  <div className="text-lg font-bold text-white">${Math.round(item.estimatedTotalTax).toLocaleString()}</div>
                  <div className="text-[10px] text-amber-400">SE Tax: ${Math.round(item.selfEmploymentTax).toLocaleString()}</div>
                </div>

                <div className="text-[10px] space-y-1 pt-2 border-t border-[#1f2228]">
                  <div className="text-[#00ff9d]">✓ {item.pros}</div>
                  <div className="text-rose-400">⚠ {item.cons}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Strategy Deduction Checklist */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-mono">
            <CheckSquare className="w-4 h-4 text-[#00ff9d]" /> Multi-Strategy Deduction Optimizer ({selectedStrategyIds.length}/{DEDUCTION_STRATEGIES.length} Active)
          </h3>
          <button
            onClick={selectAllStrategies}
            className="text-[10px] font-mono text-[#00ff9d] hover:underline"
          >
            {selectedStrategyIds.length === DEDUCTION_STRATEGIES.length ? 'Deselect All' : 'Select All Strategies'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEDUCTION_STRATEGIES.map((strat) => {
            const isSelected = selectedStrategyIds.includes(strat.id);
            return (
              <div
                key={strat.id}
                onClick={() => toggleStrategy(strat.id)}
                className={`p-3.5 rounded-xl border font-mono transition cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-white shadow-sm ring-1 ring-[#00ff9d]'
                    : 'bg-[#08090a] border-[#1f2228] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-[#00ff9d] text-black font-bold' : 'bg-[#121417] border border-[#1f2228]'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="text-xs font-bold text-white">{strat.title}</span>
                  </div>
                  <span className="text-[9px] text-[#00ff9d] bg-[#00ff9d]/15 px-1.5 py-0.5 rounded">
                    {strat.code}
                  </span>
                </div>

                <p className="text-[11px] text-[#888e96] leading-relaxed">
                  {strat.description}
                </p>

                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#1f2228]">
                  <span className="text-amber-400 font-bold">Est. Savings: {strat.estSavings}</span>
                  <span className="text-cyan-400">{strat.applicable}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Expense Calculator */}
        <div className="bento-card p-6 space-y-5">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-[#1f2228] pb-3">
            <Calculator className="w-4 h-4 text-[#00ff9d]" /> Business Financial Inputs
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-[#888e96] block mb-1">
                Gross Annual Revenue ($)
              </label>
              <input
                type="number"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#08090a] border border-[#1f2228] rounded-xl px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            {/* Expenses List Inputs */}
            <div className="space-y-2 text-xs pt-2">
              <span className="font-mono font-bold text-slate-300 block uppercase text-[11px]">Operating Expenses ($):</span>
              
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <label className="text-[#888e96]">Advertising & Promo</label>
                  <input
                    type="number"
                    value={expenses.advertising}
                    onChange={(e) => setExpenses({ ...expenses, advertising: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888e96]">Meals (50%)</label>
                  <input
                    type="number"
                    value={expenses.businessMeals}
                    onChange={(e) => setExpenses({ ...expenses, businessMeals: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888e96]">Vehicle Miles</label>
                  <input
                    type="number"
                    value={expenses.vehicleMileage}
                    onChange={(e) => setExpenses({ ...expenses, vehicleMileage: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888e96]">1099 Contractor Labor</label>
                  <input
                    type="number"
                    value={expenses.contractorLabor}
                    onChange={(e) => setExpenses({ ...expenses, contractorLabor: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888e96]">Section 179 Assets</label>
                  <input
                    type="number"
                    value={expenses.depreciableAssets}
                    onChange={(e) => setExpenses({ ...expenses, depreciableAssets: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888e96]">Home Office (sq ft)</label>
                  <input
                    type="number"
                    value={expenses.homeOfficeSqFt}
                    onChange={(e) => setExpenses({ ...expenses, homeOfficeSqFt: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888e96]">Legal & Accounting</label>
                  <input
                    type="number"
                    value={expenses.legalProfessional}
                    onChange={(e) => setExpenses({ ...expenses, legalProfessional: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#888e96]">SEP-IRA Retirement</label>
                  <input
                    type="number"
                    value={expenses.retirementContributions}
                    onChange={(e) => setExpenses({ ...expenses, retirementContributions: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#08090a] border border-[#1f2228] rounded-lg p-1.5 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Live Deduction Summary */}
            <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#888e96]">
                <span>Total Calculated Deductions:</span>
                <span className="font-bold text-[#00ff9d]">${totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#888e96]">
                <span>Estimated Taxable Income:</span>
                <span className="font-bold text-white">${estimatedTaxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-[#1f2228] font-bold">
                <span className="text-amber-300">Est. Tax Savings (@25%):</span>
                <span className="text-amber-400">${estimatedTaxSavings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-[#08090a] font-bold font-mono text-xs py-3 rounded-xl shadow-[0_0_12px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" /> Synthesizing Multi-Entity Tax Report...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate IRS AI Multi-Entity Tax Report
              </>
            )}
          </button>
        </div>

        {/* AI Tax Advisor Report Output */}
        <div className="lg:col-span-2 bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00ff9d]" /> Executive IRS Tax Report & Multi-Entity Shield Strategy
            </h3>
            <span className="text-[10px] font-mono text-[#888e96]">IRS Pub 334, 535 & 1040-ES</span>
          </div>

          <div className="flex-1 bg-[#08090a] border border-[#1f2228] rounded-xl p-5 overflow-y-auto max-h-[500px]">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
                {error}
              </div>
            )}

            {aiReport ? (
              <div className="text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {aiReport}
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center text-[#888e96] space-y-2 font-mono">
                <Receipt className="w-10 h-10 text-[#1f2228]" />
                <p className="text-xs font-semibold text-slate-300">
                  No Multi-Entity Tax Audit Generated Yet
                </p>
                <p className="text-[11px] text-[#888e96] max-w-sm">
                  Select entity types and deduction strategies, then click <span className="text-[#00ff9d] font-semibold">"Generate IRS AI Multi-Entity Tax Report"</span>.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
