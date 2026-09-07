import React, { useState } from 'react';
import { StartupPhase, DriverScores } from '../types';
import { calculateStepValuation } from '../data/startupData';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface ValuationTabProps {
  phases: StartupPhase[];
}

export const ValuationTab: React.FC<ValuationTabProps> = ({ phases }) => {
  // Test Calculator State
  const [testScores, setTestScores] = useState<DriverScores>({
    revenue_impact: 8,
    risk_reduction: 7,
    strategic_fit: 9,
    time_to_value: 8,
    operational_leverage: 8,
    cost_to_complete: 2,
  });

  const { score: testScore, gate: testGate } = calculateStepValuation(testScores);

  // Compute Phase Averages
  const phaseMetrics = phases.map((p, idx) => {
    const scores = p.steps.map((s) => calculateStepValuation(s.driverScores));
    const avgScore =
      scores.reduce((acc, curr) => acc + curr.score, 0) / (scores.length || 1);
    const goCount = scores.filter((s) => s.gate === 'GO').length;
    const reviseCount = scores.filter((s) => s.gate === 'REVISE').length;
    const stopCount = scores.filter((s) => s.gate === 'STOP').length;

    return {
      phaseNumber: idx + 1,
      phaseName: p.phase_name,
      stepCount: p.steps.length,
      avgScore: Math.round(avgScore * 100) / 100,
      goCount,
      reviseCount,
      stopCount,
    };
  });

  const overallAvg =
    phaseMetrics.reduce((acc, curr) => acc + curr.avgScore, 0) / phaseMetrics.length;

  return (
    <div className="space-y-6">
      
      {/* Rubric Header Banner */}
      <div className="bento-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calculator className="w-48 h-48 text-[#00ff9d]" />
        </div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#08090a] text-[#00ff9d] border border-[#00ff9d]/30 text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00ff9d]" /> Algorithmic Business Decision Pipeline
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Shared Business Valuation & Decision Gate Rubric
          </h2>
          <p className="text-xs text-[#888e96] leading-relaxed">
            Every step across the 10 startup phases is mathematically evaluated using the formula below.
            Score every step prior to execution to determine whether to <span className="text-[#00ff9d] font-bold font-mono">GO</span>, <span className="text-amber-400 font-bold font-mono">REVISE</span>, or <span className="text-rose-400 font-bold font-mono">STOP</span>.
          </p>
        </div>
      </div>

      {/* Formula & Decision Gate Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Formula Box */}
        <div className="bento-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#00ff9d]" /> Mathematical Formula
            </h3>
            <span className="text-[10px] uppercase font-mono bg-[#08090a] text-[#00ff9d] px-2 py-0.5 rounded border border-[#00ff9d]/30">
              Scale 0 to 10
            </span>
          </div>

          <div className="bg-[#08090a] p-4 rounded-xl border border-[#1f2228] font-mono text-xs text-[#00ff9d] leading-relaxed">
            Score = round(
            <br />
            &nbsp;&nbsp;(0.25 * Revenue Impact) +
            <br />
            &nbsp;&nbsp;(0.20 * Risk Reduction) +
            <br />
            &nbsp;&nbsp;(0.20 * Strategic Fit) +
            <br />
            &nbsp;&nbsp;(0.15 * Time to Value) +
            <br />
            &nbsp;&nbsp;(0.10 * Operational Leverage) -
            <br />
            &nbsp;&nbsp;(0.10 * Cost to Complete),
            <br />
            &nbsp;&nbsp;2)
          </div>

          <div className="space-y-2 text-xs text-[#888e96]">
            <p className="font-mono font-semibold text-slate-300 uppercase tracking-wider">Metric Weights Breakdown:</p>
            <ul className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <li className="bg-[#08090a] p-2 rounded border border-[#1f2228]">
                • Revenue Impact: <span className="text-[#00ff9d] font-bold">25%</span>
              </li>
              <li className="bg-[#08090a] p-2 rounded border border-[#1f2228]">
                • Risk Reduction: <span className="text-indigo-400 font-bold">20%</span>
              </li>
              <li className="bg-[#08090a] p-2 rounded border border-[#1f2228]">
                • Strategic Fit: <span className="text-cyan-400 font-bold">20%</span>
              </li>
              <li className="bg-[#08090a] p-2 rounded border border-[#1f2228]">
                • Time to Value: <span className="text-amber-400 font-bold">15%</span>
              </li>
              <li className="bg-[#08090a] p-2 rounded border border-[#1f2228]">
                • Operational Leverage: <span className="text-purple-400 font-bold">10%</span>
              </li>
              <li className="bg-[#08090a] p-2 rounded border border-[#1f2228]">
                • Cost to Complete: <span className="text-rose-400 font-bold">-10%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Decision Gates Rules Box */}
        <div className="bento-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Decision Gate Rules
            </h3>
            <span className="text-xs text-[#888e96] font-mono uppercase">3 Threshold Tiers</span>
          </div>

          <div className="space-y-3">
            
            {/* GO Gate */}
            <div className="bg-[#08090a] border border-[#00ff9d]/30 rounded-xl p-3.5 flex items-start gap-3">
              <span className="status-glow mt-1.5 shrink-0"></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-sm text-[#00ff9d]">GO (Score &ge; 7.0)</span>
                </div>
                <p className="text-xs text-[#888e96] mt-1">
                  High strategic fit, strong revenue impact, and manageable costs. Proceed directly with resource allocation and execution.
                </p>
              </div>
            </div>

            {/* REVISE Gate */}
            <div className="bg-[#08090a] border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3">
              <span className="status-glow-amber mt-1.5 shrink-0"></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-sm text-amber-400">REVISE (Score 5.0 - 6.99)</span>
                </div>
                <p className="text-xs text-[#888e96] mt-1">
                  Moderate viability. Re-evaluate driver weights, optimize execution cost, or refine target deliverables before proceeding.
                </p>
              </div>
            </div>

            {/* STOP Gate */}
            <div className="bg-[#08090a] border border-rose-500/30 rounded-xl p-3.5 flex items-start gap-3">
              <span className="status-glow-rose mt-1.5 shrink-0"></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-sm text-rose-400">STOP (Score &lt; 5.0)</span>
                </div>
                <p className="text-xs text-[#888e96] mt-1">
                  High risk or poor strategic alignment. Pause step execution, pivot approach, or re-allocate capital to higher-impact initiatives.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive Rubric Simulator */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00ff9d]" /> Interactive Score Sandbox Simulator
          </h3>
          <span className="text-xs text-[#888e96] font-mono">Test hypothetical driver scores</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                { key: 'revenue_impact', label: 'Revenue Impact (25%)' },
                { key: 'risk_reduction', label: 'Risk Reduction (20%)' },
                { key: 'strategic_fit', label: 'Strategic Fit (20%)' },
                { key: 'time_to_value', label: 'Time to Value (15%)' },
                { key: 'operational_leverage', label: 'Operational Leverage (10%)' },
                { key: 'cost_to_complete', label: 'Cost to Complete (-10%)' },
              ] as { key: keyof DriverScores; label: string }[]
            ).map(({ key, label }) => (
              <div key={key} className="space-y-1 bg-[#08090a] p-3 rounded-xl border border-[#1f2228]">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>{label}</span>
                  <span className="font-bold text-[#00ff9d]">{testScores[key]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={testScores[key]}
                  onChange={(e) =>
                    setTestScores({ ...testScores, [key]: parseInt(e.target.value) })
                  }
                  className="w-full accent-[#00ff9d] bg-[#121417] rounded-lg h-2"
                />
              </div>
            ))}
          </div>

          <div className="bg-[#08090a] border border-[#1f2228] rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs text-[#888e96] uppercase font-mono font-semibold">Simulated Step Score</span>
            <div className="text-4xl font-black font-mono text-amber-400">{testScore} <span className="text-xs text-[#888e96]">/ 10</span></div>
            <div
              className={`px-4 py-1.5 rounded-full font-bold font-mono text-xs uppercase border ${
                testGate === 'GO'
                  ? 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30'
                  : testGate === 'REVISE'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              Gate Decision: {testGate}
            </div>
            <p className="text-[11px] text-[#888e96] italic font-mono">
              {testGate === 'GO' && 'This step is cleared for execution.'}
              {testGate === 'REVISE' && 'Adjust driver parameters to raise score above 7.0.'}
              {testGate === 'STOP' && 'Score below threshold. Step requires strategy overhaul.'}
            </p>
          </div>
        </div>
      </div>

      {/* Phase-by-Phase Health Matrix */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f2228] pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00ff9d]" /> Phase-by-Phase Valuation Matrix
            </h3>
            <p className="text-xs text-[#888e96] font-mono mt-0.5">
              Overall Portfolio Average Score: <span className="text-amber-400 font-bold">{overallAvg.toFixed(2)} / 10</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase bg-[#08090a] text-[#888e96] font-mono">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Phase</th>
                <th className="py-3 px-4">Steps</th>
                <th className="py-3 px-4">Avg Score</th>
                <th className="py-3 px-4">GO Steps</th>
                <th className="py-3 px-4">REVISE Steps</th>
                <th className="py-3 px-4 rounded-r-xl">STOP Steps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2228]">
              {phaseMetrics.map((pm) => (
                <tr key={pm.phaseNumber} className="hover:bg-[#1f2228]/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    Phase {pm.phaseNumber}: {pm.phaseName.split(':')[1] || pm.phaseName}
                  </td>
                  <td className="py-3 px-4 font-mono">{pm.stepCount}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {pm.avgScore.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#00ff9d] font-bold">{pm.goCount}</td>
                  <td className="py-3 px-4 font-mono text-amber-400 font-bold">{pm.reviseCount}</td>
                  <td className="py-3 px-4 font-mono text-rose-400 font-bold">{pm.stopCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
