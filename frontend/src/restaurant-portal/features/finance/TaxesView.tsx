import React from 'react';
import { Receipt, Download, CheckCircle2, ShieldAlert, FileSpreadsheet, Building2 } from 'lucide-react';
import usePortalFinanceStore from '../../store/portalFinanceStore';
import { usePortalProfileStore } from '../../store/portalProfileStore';

export const TaxesView: React.FC = () => {
  const { taxes } = usePortalFinanceStore();
  const { profile } = usePortalProfileStore();

  const currentTax = taxes[1] || taxes[0];

  const handleExportGSTR1 = () => {
    alert(`Exporting GSTR-1 & GSTR-3B Tax Filing Package (JSON / Excel) for GSTIN ${profile.taxId || '29ABCDE1234F1Z5'}...`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Tax Compliance Ready
            </span>
            <span className="text-xs text-neutral-400 font-bold">GSTIN: {profile.taxId || '29ABCDE1234F1Z5'}</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            GST Tax Filing & Collected Reserves ({currentTax.period})
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Automated tax calculation on dine-in, takeaway, and delivery sales compiled for monthly GSTR-1 and GSTR-3B filing.
          </p>
        </div>

        <button
          onClick={handleExportGSTR1}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <Download size={14} />
          <span>Export GSTR-1 Package</span>
        </button>
      </div>

      {/* Tax Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Taxable Sales
          </span>
          <h3 className="text-xl font-black text-neutral-900">
            ₹{currentTax.totalTaxableSales.toLocaleString('en-IN')}
          </h3>
          <span className="text-[10px] text-neutral-400">Subject to 5% GST</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            CGST Collected (2.5%)
          </span>
          <h3 className="text-xl font-black text-neutral-900">
            ₹{currentTax.cgstCollected.toLocaleString('en-IN')}
          </h3>
          <span className="text-[10px] text-neutral-400">Central Tax Portion</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            SGST Collected (2.5%)
          </span>
          <h3 className="text-xl font-black text-neutral-900">
            ₹{currentTax.sgstCollected.toLocaleString('en-IN')}
          </h3>
          <span className="text-[10px] text-neutral-400">State Tax Portion</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1 bg-orange-50/20">
          <span className="text-[10px] font-bold text-[#e35205] uppercase tracking-wider">
            Total Tax Liability
          </span>
          <h3 className="text-xl font-black text-neutral-900">
            ₹{currentTax.totalTaxCollected.toLocaleString('en-IN')}
          </h3>
          <span className="text-[10px] text-neutral-500 font-bold">Ready for Remittance</span>
        </div>
      </div>

      {/* Tax Period History Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
          Historical GST Return Archive
        </h3>

        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4 text-right">Taxable Turnover</th>
                  <th className="py-3 px-4 text-right">CGST</th>
                  <th className="py-3 px-4 text-right">SGST</th>
                  <th className="py-3 px-4 text-right">Total GST</th>
                  <th className="py-3 px-4 text-center">Filing Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {taxes.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">{t.period}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{t.gstin}</td>
                    <td className="py-3.5 px-4 text-right">₹{t.totalTaxableSales.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right">₹{t.cgstCollected.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right">₹{t.sgstCollected.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-black text-neutral-900">
                      ₹{t.totalTaxCollected.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          t.status === 'filed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={handleExportGSTR1}
                        className="text-[10px] font-bold text-[#e35205] hover:text-[#c94804] cursor-pointer"
                      >
                        Download CSV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxesView;
