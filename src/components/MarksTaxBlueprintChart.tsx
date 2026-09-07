import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  Calculator,
  Lock,
  Award,
} from 'lucide-react';

interface MarksTaxBlueprintChartProps {
  annualRevenue: number;
  expenses: {
    depreciableAssets: number;
    homeOfficeSqFt: number;
    vehicleMileage: number;
    retirementContributions: number;
    advertising: number;
    contractorLabor: number;
    employeeSalaries: number;
    healthInsurance: number;
  };
}

export const MarksTaxBlueprintChart: React.FC<MarksTaxBlueprintChartProps> = ({
  annualRevenue,
  expenses,
}) => {
  const [activeSide, setActiveSide] = useState<'both' | 'operating' | 'holding'>('both');
  const [w2SalaryPercent, setW2SalaryPercent] = useState<number>(35); // 35% reasonable salary, 65% distribution

  // Financial Calculations for Mark's Chart
  const grossIncome = annualRevenue;
  const directOperatingExpenses =
    expenses.advertising +
    expenses.contractorLabor +
    expenses.healthInsurance +
    expenses.employeeSalaries;

  const netOperatingProfit = Math.max(0, grossIncome - directOperatingExpenses);

  // S-Corp Split: Reasonable Salary vs Flow-through K-1 Distribution
  const w2Salary = Math.round(netOperatingProfit * (w2SalaryPercent / 100));
  const k1Distribution = Math.max(0, netOperatingProfit - w2Salary);

  // FICA / Self-Employment Tax Savings on K-1 Distribution (15.3%)
  const ficaSavings = Math.round(k1Distribution * 0.153);

  // Accountable Plan Reimbursements (Tax-Free to owner, deductible to business)
  const homeOfficeReimbursement = Math.min(expenses.homeOfficeSqFt, 300) * 5;
  const autoMileageReimbursement = Math.round(expenses.vehicleMileage * 0.575);
  const accountablePlanTotal = homeOfficeReimbursement + autoMileageReimbursement + 4800; // includes cell/tech

  // Asset Holding Company Triple Net Lease (Leasing IP & equipment back to S-Corp)
  const annualAssetLeasePayment = Math.round(expenses.depreciableAssets * 0.35 + 18000);

  // Section 179 & Bonus Depreciation Waterfall
  const sec179Depreciation = expenses.depreciableAssets;

  // QSBS Section 1202 100% Tax-Free Exit Potential (up to $10M or 10x basis)
  const qsbsExitShield = Math.min(10000000, grossIncome * 8);

  return (
    <div className="bg-[#08090a] border border-[#1f2228] rounded-2xl p-6 text-slate-100 font-mono space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f2228]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Mark's Tax & Legal Trifecta Blueprint
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30">
              Live Interactive Matrix
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00ff9d]" />
            Mark's Master Entity Tax Shield & Asset Flow Chart
          </h3>
          <p className="text-xs text-[#888e96] mt-0.5">
            Auto-populated with active revenue (<span className="text-white">${grossIncome.toLocaleString()}</span>), S-Corp salary splits, Asset Holding LLC leasebacks, Section 1202 QSBS build-to-sale tax exemption, and revocable living trust protection.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[#121417] p-1 rounded-xl border border-[#1f2228] text-xs">
          <button
            onClick={() => setActiveSide('both')}
            className={`px-3 py-1 rounded-lg transition ${
              activeSide === 'both' ? 'bg-[#00ff9d] text-black font-bold' : 'text-[#888e96] hover:text-white'
            }`}
          >
            Full Trifecta
          </button>
          <button
            onClick={() => setActiveSide('operating')}
            className={`px-3 py-1 rounded-lg transition ${
              activeSide === 'operating' ? 'bg-cyan-400 text-black font-bold' : 'text-[#888e96] hover:text-white'
            }`}
          >
            Operating Side
          </button>
          <button
            onClick={() => setActiveSide('holding')}
            className={`px-3 py-1 rounded-lg transition ${
              activeSide === 'holding' ? 'bg-purple-400 text-black font-bold' : 'text-[#888e96] hover:text-white'
            }`}
          >
            Holding Side
          </button>
        </div>
      </div>

      {/* Salary vs Distribution Ratio Slider */}
      <div className="bg-[#121417] p-4 rounded-xl border border-[#1f2228] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-[#00ff9d]" /> S-Corp Reasonable Salary Split: {w2SalaryPercent}% W-2 / {100 - w2SalaryPercent}% K-1 Distribution
          </span>
          <p className="text-[11px] text-[#888e96]">
            FICA taxes apply ONLY to W-2 Salary. The remaining {100 - w2SalaryPercent}% K-1 Distribution is 100% exempt from 15.3% Self-Employment Tax!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="25"
            max="60"
            step="5"
            value={w2SalaryPercent}
            onChange={(e) => setW2SalaryPercent(parseInt(e.target.value))}
            className="w-32 accent-[#00ff9d] cursor-pointer"
          />
          <span className="text-xs font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-1 rounded border border-[#00ff9d]/30">
            Saves ${ficaSavings.toLocaleString()}/yr
          </span>
        </div>
      </div>

      {/* 2-Branch Visual Matrix (The Trifecta) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: THE OPERATING SIDE (Active Ordinary Income & Tax Shields) */}
        {(activeSide === 'both' || activeSide === 'operating') && (
          <div className="bg-gradient-to-b from-[#0e1726] to-[#08090a] border border-cyan-500/40 rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Branch A: Operating Entity (S-Corp)
                  </h4>
                  <span className="text-[10px] text-cyan-400">Active Ordinary Income & Daily Business</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                Active Operations
              </span>
            </div>

            {/* Operating Entity Box */}
            <div className="bg-[#08090a] p-4 rounded-lg border border-cyan-500/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Gross Business Revenue:</span>
                <span className="text-white font-bold text-sm">${grossIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#888e96]">
                <span>Operating Overhead & COGS:</span>
                <span className="text-rose-400">-${directOperatingExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-[#1f2228] font-bold">
                <span className="text-cyan-400">Net Operating Flow:</span>
                <span className="text-white">${netOperatingProfit.toLocaleString()}</span>
              </div>
            </div>

            {/* Flow Down Splits */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* W-2 Reasonable Salary */}
              <div className="bg-[#121417] p-3 rounded-lg border border-[#1f2228] space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">1. W-2 Reasonable Salary ({w2SalaryPercent}%)</div>
                <div className="text-base font-bold text-white">${w2Salary.toLocaleString()}</div>
                <div className="text-[10px] text-amber-400">Subject to FICA & Payroll</div>
              </div>

              {/* K-1 Distribution */}
              <div className="bg-[#121417] p-3 rounded-lg border border-[#00ff9d]/30 space-y-1">
                <div className="text-[11px] text-[#00ff9d] font-bold">2. K-1 Distribution ({100 - w2SalaryPercent}%)</div>
                <div className="text-base font-bold text-[#00ff9d]">${k1Distribution.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-bold">0% Self-Employment Tax!</div>
              </div>
            </div>

            {/* Deductions & Credits attached to Operating */}
            <div className="space-y-2 text-xs pt-1">
              <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5">
                <div className="flex justify-between font-bold text-white text-[11px]">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Accountable Plan (Tax-Free Payouts):
                  </span>
                  <span>${accountablePlanTotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-[#888e96]">
                  Reimburses home office (${homeOfficeReimbursement}), vehicle mileage (${autoMileageReimbursement}), and cell/tech without FICA or income tax.
                </p>
              </div>

              <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5">
                <div className="flex justify-between font-bold text-white text-[11px]">
                  <span className="flex items-center gap-1 text-[#00ff9d]">
                    <Sparkles className="w-3.5 h-3.5 text-[#00ff9d]" /> Form 6765 R&D Payroll Tax Credit:
                  </span>
                  <span className="text-[#00ff9d]">Up to $500,000 Offset</span>
                </div>
                <p className="text-[10px] text-[#888e96]">
                  Directly offsets employer FICA payroll taxes using qualified software & AI development costs.
                </p>
              </div>

              <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5">
                <div className="flex justify-between font-bold text-white text-[11px]">
                  <span className="flex items-center gap-1 text-purple-300">
                    <Lock className="w-3.5 h-3.5 text-purple-400" /> Solo 401(k) / SEP-IRA Plan:
                  </span>
                  <span>${expenses.retirementContributions.toLocaleString()} / $66,000</span>
                </div>
                <p className="text-[10px] text-[#888e96]">
                  Employer profit sharing contribution de-risks tax liability dollar-for-dollar into pre-tax or Backdoor Roth.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: THE HOLDING SIDE (Passive Wealth, Asset Protection & Depreciation) */}
        {(activeSide === 'both' || activeSide === 'holding') && (
          <div className="bg-gradient-to-b from-[#1c122c] to-[#08090a] border border-purple-500/40 rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Branch B: Asset Holding Company (LLC)
                  </h4>
                  <span className="text-[10px] text-purple-400">Passive Wealth, IP, Equipment & Real Estate</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                Asset Protection
              </span>
            </div>

            {/* Holding Entity Box */}
            <div className="bg-[#08090a] p-4 rounded-lg border border-purple-500/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Owns Equipment, IP & Software:</span>
                <span className="text-white font-bold text-sm">${expenses.depreciableAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#888e96]">
                <span>Intercompany Lease to S-Corp:</span>
                <span className="text-[#00ff9d]">+${annualAssetLeasePayment.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-[#1f2228] font-bold">
                <span className="text-purple-400">Asset Protection Shield:</span>
                <span className="text-emerald-400">Separated from Operating Liability</span>
              </div>
            </div>

            {/* Holding Tax Benefits */}
            <div className="space-y-2 text-xs">
              <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5">
                <div className="flex justify-between font-bold text-white text-[11px]">
                  <span className="flex items-center gap-1 text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Section 179 & Bonus Depreciation:
                  </span>
                  <span className="text-amber-400">${sec179Depreciation.toLocaleString()} 100% Write-off</span>
                </div>
                <p className="text-[10px] text-[#888e96]">
                  Immediate first-year write-off for heavy equipment, compute clusters, server hardware, and off-the-shelf software.
                </p>
              </div>

              {/* Build-to-Sale QSBS Exemption */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 p-3 rounded-lg border border-emerald-500/40 space-y-1.5">
                <div className="flex justify-between font-bold text-white text-[11px]">
                  <span className="flex items-center gap-1 text-[#00ff9d]">
                    <Sparkles className="w-3.5 h-3.5 text-[#00ff9d]" /> Section 1202 QSBS (Build-to-Sale Exit):
                  </span>
                  <span className="text-[#00ff9d] font-bold">100% Tax-Free Exit (${qsbsExitShield.toLocaleString()})</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Qualified Small Business Stock permits up to <strong className="text-white">$10,000,000 or 10x basis</strong> in capital gains to be completely excluded from federal income tax upon acquisition!
                </p>
              </div>

              <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228] space-y-1.5">
                <div className="flex justify-between font-bold text-white text-[11px]">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" /> Section 1031 Tax-Deferred Exchange:
                  </span>
                  <span className="text-cyan-300">Indefinite Rollover</span>
                </div>
                <p className="text-[10px] text-[#888e96]">
                  Roll capital gains from commercial facility and real estate sales forward into replacement properties with zero immediate tax recognition.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOUNDATION LAYER: ESTATE, LIVING TRUST & HEALTHCARE */}
      <div className="bg-gradient-to-r from-[#0d1117] via-[#121417] to-[#0d1117] p-5 rounded-xl border border-amber-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2228] pb-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Base Foundation: Revocable Living Trust & Dynasty Protection
            </h4>
          </div>
          <span className="text-[10px] text-amber-400 font-bold">100% Avoidance of Probate & Public Exposure</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228]">
            <div className="font-bold text-white text-[11px] mb-1">Revocable Living Trust</div>
            <p className="text-[10px] text-[#888e96]">
              Holds 100% of membership shares in Operating S-Corp & Holding LLC. Ensures seamless generational transfer.
            </p>
          </div>

          <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228]">
            <div className="font-bold text-emerald-400 text-[11px] mb-1">HSA (Triple Tax-Free)</div>
            <p className="text-[10px] text-[#888e96]">
              Tax deduction going in, tax-free growth over time, and 100% tax-free withdrawals for healthcare expenses.
            </p>
          </div>

          <div className="bg-[#08090a] p-3 rounded-lg border border-[#1f2228]">
            <div className="font-bold text-cyan-400 text-[11px] mb-1">Charitable Remainder (CRT)</div>
            <p className="text-[10px] text-[#888e96]">
              Pre-exit donation of appreciated assets provides immediate large charitable deductions and lifetime income streams.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Total Tax Shield Banner */}
      <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#00ff9d] shrink-0" />
          <div>
            <span className="text-white font-bold block">
              Total Estimated Annual Tax Shield & Savings: ${Math.round(ficaSavings + accountablePlanTotal * 0.25 + sec179Depreciation * 0.25).toLocaleString()}
            </span>
            <span className="text-[#888e96] text-[11px]">
              Combining S-Corp FICA exemption (${ficaSavings.toLocaleString()}), Accountable Plan (${accountablePlanTotal.toLocaleString()}), and Section 179 depreciation.
            </span>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-[#00ff9d] text-black font-bold text-xs shrink-0 shadow">
          Fully Compliant IRS Architecture
        </span>
      </div>
    </div>
  );
};
