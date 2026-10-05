import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, ShieldAlert, FileText, AlertTriangle, UserCheck, ShieldCheck } from 'lucide-react';
import useAdminStore from '../../store/admin/adminStore';
import { StatusBadge } from './components/AdminComponents';

export const RestaurantDetailPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, verifyRestaurant, suspendRestaurant, flagRestaurant } = useAdminStore();

  const restaurant = restaurants.find((r) => r.id === id) || restaurants[0];
  const [flagNotes, setFlagNotes] = useState<string>('');

  if (!restaurant) {
    return <div className="py-12 text-center text-neutral-400 font-bold text-xs">Restaurant record not found.</div>;
  }

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagNotes.trim()) {
      flagRestaurant(restaurant.id, flagNotes.trim());
      setFlagNotes('');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/restaurants')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Restaurant Oversight</span>
        </button>

        <div className="flex items-center gap-2">
          {restaurant.status !== 'verified' && (
            <button
              onClick={() => verifyRestaurant(restaurant.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
            >
              Approve Verification
            </button>
          )}
          {restaurant.status !== 'suspended' && (
            <button
              onClick={() => suspendRestaurant(restaurant.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
            >
              Suspend Account
            </button>
          )}
        </div>
      </div>

      {/* Main Inspection Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
              <Building2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-neutral-900">{restaurant.name}</h2>
                <StatusBadge status={restaurant.status} />
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Branch Code: <strong className="text-neutral-700 font-mono">{restaurant.branchCode}</strong> · Registered: {restaurant.registeredAt}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">RISK INDEX</span>
            <span className={`text-xl font-black ${restaurant.riskScore > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
              {restaurant.riskScore} / 100
            </span>
          </div>
        </div>

        {/* Ownership Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Owner Name</span>
            <span className="font-bold text-neutral-800 text-sm block">{restaurant.ownerName}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Business Email</span>
            <span className="font-bold text-neutral-800 block truncate">{restaurant.ownerEmail}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Phone Contact</span>
            <span className="font-bold text-neutral-800 block">{restaurant.ownerPhone}</span>
          </div>
        </div>

        {/* Submitted Verification Documents */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Submitted Business & Food Safety Licenses
          </h4>

          <div className="space-y-2">
            {restaurant.verificationDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-neutral-500" />
                  <span className="font-bold text-neutral-800">{doc.type}</span>
                  <span className="font-mono text-neutral-500">({doc.documentNumber})</span>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Moderation Flagging Action */}
        <form onSubmit={handleFlagSubmit} className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-3">
          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Super Admin Moderation Notes
          </h4>
          <textarea
            rows={2}
            placeholder="Add internal audit notes or risk warning reasons..."
            value={flagNotes}
            onChange={(e) => setFlagNotes(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Log Moderation Flag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantDetailPanel;
