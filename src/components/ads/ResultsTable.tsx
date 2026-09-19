import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { ComputedVariantStats, CampaignVariantMetrics } from '@/lib/stats';
import { formatInr, formatPercent } from '@/lib/format';
import { Badge } from '../ui/Badge';

interface ResultsTableProps {
  metrics: ComputedVariantStats[];
  onUpdateVariant: (id: string, field: keyof CampaignVariantMetrics, value: number) => void;
  onResetToSample: () => void;
  selectedVariantId: string;
  onSelectVariant: (id: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  metrics,
  onUpdateVariant,
  onResetToSample,
  selectedVariantId,
  onSelectVariant,
}) => {
  return (
    <div className="bg-white border border-[#ECE9F8] rounded-[22px] p-5 sm:p-6 shadow-card space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE9F8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">
              Creative Performance & Z-Test Analyzer
            </h3>
            <Badge kind="simulated" />
          </div>
          <p className="text-xs text-body mt-0.5">
            Click values to edit. Deterministic two-proportion z-tests (CTR & CR) vs Control baseline.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetToSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-lavender-50 hover:bg-lavender-100 text-brand-purple border border-[#ECE9F8] self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulated Data</span>
        </button>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#ECE9F8] text-[10px] font-extrabold uppercase tracking-wider text-body">
              <th className="pb-3 pr-4">Variant</th>
              <th className="pb-3 px-3">Impressions</th>
              <th className="pb-3 px-3">Clicks</th>
              <th className="pb-3 px-3">Installs</th>
              <th className="pb-3 px-3">Spend (INR)</th>
              <th className="pb-3 px-3">CTR</th>
              <th className="pb-3 px-3">Install Rate</th>
              <th className="pb-3 px-3 font-bold text-ink">CPI</th>
              <th className="pb-3 px-3">Z-Score (CTR)</th>
              <th className="pb-3 px-3">P-Value</th>
              <th className="pb-3 pl-3 text-right">Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE9F8]">
            {metrics.map((v) => {
              const isSelected = v.id === selectedVariantId;

              const getVerdictBadge = (verdict: typeof v.verdict) => {
                if (verdict === 'SCALE') {
                  return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E6F8EE] text-[#12A36B] border border-[#BBF7D0]">
                      <CheckCircle2 className="w-3 h-3" /> SCALE
                    </span>
                  );
                }
                if (verdict === 'KILL') {
                  return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                      <XCircle className="w-3 h-3" /> KILL
                    </span>
                  );
                }
                return (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFF4E0] text-[#D97706] border border-[#FDE68A]">
                    KEEP TESTING
                  </span>
                );
              };

              return (
                <tr
                  key={v.id}
                  onClick={() => onSelectVariant(v.id)}
                  className={clsx(
                    'cursor-pointer transition-colors',
                    isSelected ? 'bg-lavender-50/90' : 'hover:bg-lavender-50/50'
                  )}
                >
                  {/* Variant Name */}
                  <td className="py-3.5 pr-4">
                    <div className="font-extrabold text-ink flex items-center gap-1.5">
                      <span>{v.name}</span>
                      {v.isControl && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-lavender-100 text-brand-purple">
                          Ctrl
                        </span>
                      )}
                    </div>
                    {v.sampleWarning && (
                      <div className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{v.sampleWarning}</span>
                      </div>
                    )}
                  </td>

                  {/* Impressions (Editable) */}
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={v.impressions}
                      onChange={(e) =>
                        onUpdateVariant(v.id, 'impressions', Math.max(1, Number(e.target.value)))
                      }
                      className="w-20 px-2 py-1 bg-white border border-[#ECE9F8] rounded-lg text-xs font-mono text-ink focus:border-brand-purple outline-none"
                    />
                  </td>

                  {/* Clicks (Editable) */}
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={v.clicks}
                      onChange={(e) =>
                        onUpdateVariant(v.id, 'clicks', Math.max(0, Number(e.target.value)))
                      }
                      className="w-16 px-2 py-1 bg-white border border-[#ECE9F8] rounded-lg text-xs font-mono text-ink focus:border-brand-purple outline-none"
                    />
                  </td>

                  {/* Installs (Editable) */}
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={v.installs}
                      onChange={(e) =>
                        onUpdateVariant(v.id, 'installs', Math.max(0, Number(e.target.value)))
                      }
                      className="w-16 px-2 py-1 bg-white border border-[#ECE9F8] rounded-lg text-xs font-mono text-ink focus:border-brand-purple outline-none"
                    />
                  </td>

                  {/* Spend (Editable) */}
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={v.spend}
                      onChange={(e) =>
                        onUpdateVariant(v.id, 'spend', Math.max(0, Number(e.target.value)))
                      }
                      className="w-20 px-2 py-1 bg-white border border-[#ECE9F8] rounded-lg text-xs font-mono text-ink focus:border-brand-purple outline-none"
                    />
                  </td>

                  {/* Computed CTR */}
                  <td className="py-3.5 px-3 font-mono font-semibold text-ink">
                    {formatPercent(v.ctr)}
                  </td>

                  {/* Computed Install Rate */}
                  <td className="py-3.5 px-3 font-mono text-body">
                    {formatPercent(v.installRate)}
                  </td>

                  {/* Computed CPI */}
                  <td className="py-3.5 px-3 font-mono font-black text-ink text-sm">
                    {formatInr(v.cpi)}
                  </td>

                  {/* Z-Score (CTR) */}
                  <td className="py-3.5 px-3 font-mono text-body">
                    {v.isControl ? '—' : v.zScoreCtr !== null ? (v.zScoreCtr > 0 ? `+${v.zScoreCtr}` : v.zScoreCtr) : 'N/A'}
                  </td>

                  {/* P-Value */}
                  <td className="py-3.5 px-3 font-mono text-xs">
                    {v.isControl ? (
                      '—'
                    ) : v.pValueCtr !== null ? (
                      <span className={v.isCtrSignificant ? 'text-brand-success font-bold' : 'text-body'}>
                        {v.pValueCtr} {v.isCtrSignificant && '★'}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>

                  {/* Verdict */}
                  <td className="py-3.5 pl-3 text-right">
                    {getVerdictBadge(v.verdict)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-body/80 flex items-center justify-between pt-1">
        <span>★ Statistically significant difference vs Control at 95% confidence level (p &lt; 0.05).</span>
        <span>Click any row to inspect qualitative AI memo below</span>
      </div>
    </div>
  );
};
