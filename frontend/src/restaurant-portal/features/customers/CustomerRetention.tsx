import React, { useState } from 'react';
import { ShieldAlert, Award, Star, Clock, AlertTriangle, Sparkles, Send, Check } from 'lucide-react';
import usePortalCustomerStore, { Customer } from '../../store/portalCustomerStore';
import Card from '../../components/ui/Card';

export const CustomerRetention: React.FC = () => {
  const { customers, updateCustomer } = usePortalCustomerStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter customers with moderate to high churn risk
  const riskCandidates = customers.filter(c => c.riskScore >= 30 && !c.isArchived);

  const handleSendOffer = (cust: Customer) => {
    setSuccessMsg(`Outreach campaign successfully dispatched to ${cust.name} via ${cust.consent.email ? 'Email' : 'SMS'}.`);
    // Lower the risk score representing active outreach intervention
    updateCustomer(cust.id, { riskScore: Math.max(10, cust.riskScore - 25) });
    
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const getRiskLabel = (score: number) => {
    if (score >= 60) return { text: 'CRITICAL CHURN RISK', style: 'text-red-750 bg-red-50 border-red-200' };
    return { text: 'MODERATE CHURN RISK', style: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-3">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-heading">Retention & Winback Intelligence</h4>
        <p className="text-xs text-neutral-400 mt-0.5">Identify dormant regulars, review churn probabilities, and trigger outreach offers.</p>
      </div>

      {/* Dispatched alert banner */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[10px] font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
          <Check size={13} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Candidates list */}
      <div className="space-y-4">
        {riskCandidates.length === 0 ? (
          <Card className="p-8 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            All customer loyalty segments show healthy retention profiles.
          </Card>
        ) : (
          riskCandidates.map((c) => {
            const label = getRiskLabel(c.riskScore);
            return (
              <div key={c.id} className="border border-neutral-200/80 rounded-2xl p-4 bg-white shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-neutral-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-neutral-800">{c.name}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${label.style}`}>
                      {label.text} ({c.riskScore}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[10px] font-semibold text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Clock size={11} className="text-neutral-400" />
                      <span>Last Visit: {c.lastVisit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-neutral-400" />
                      <span>LTV: ₹{c.lifetimeValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                      <Award size={11} className="text-neutral-400" />
                      <span>Fav Cuisine: {c.preferredCuisine}</span>
                    </div>
                  </div>
                </div>

                {/* Target Outreach Action */}
                <div className="flex items-center gap-2.5 w-full md:w-auto border-t md:border-t-0 border-neutral-100 pt-3.5 md:pt-0">
                  <div className="flex-1 md:flex-none text-left md:text-right">
                    <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Recommended campaign</span>
                    <span className="text-[10px] font-black text-[#e35205] block">
                      {c.loyaltyStatus === 'Dormant' ? 'Send 20% Winback Promo' : 'Gift Free Dessert Coupon'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleSendOffer(c)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Send size={11} />
                    <span>Outreach</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Retention insight */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Retention Scorecard</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            By dispatching the recommended coupon templates to dormant regulars, we estimate a 38% win-back recovery rate within 14 days, contributing approximately ₹18,500 in recovering pipeline revenue.
          </p>
        </div>
      </div>

    </div>
  );
};

export default CustomerRetention;
