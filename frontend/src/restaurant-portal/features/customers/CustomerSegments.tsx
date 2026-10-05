import React, { useState } from 'react';
import { Layers, Plus, Trash2, Shield, Users, Sparkles, X } from 'lucide-react';
import usePortalCustomerStore, { CustomerSegment } from '../../store/portalCustomerStore';
import Card from '../../components/ui/Card';

export const CustomerSegments: React.FC = () => {
  const { segments, createSegment, deleteSegment, customers } = usePortalCustomerStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Calculate dynamic segment member counts based on rules
  const getDynamicCount = (id: string) => {
    switch (id) {
      case 'seg-vip':
        return customers.filter(c => c.lifetimeValue >= 50000 && c.riskScore < 50).length;
      case 'seg-high':
        return customers.filter(c => c.averageSpend >= 2500).length;
      case 'seg-dormant':
        return customers.filter(c => c.loyaltyStatus === 'Dormant').length;
      case 'seg-delivery':
        return customers.filter(c => c.preferredBranch.includes('Cloud')).length;
      default:
        // Mock matching count for user custom segment
        return Math.floor(Math.random() * 3) + 1;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createSegment({
      name: name.trim(),
      description: description.trim(),
      rulesCount: 1,
    });
    setName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-left select-none relative">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
        <div>
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-heading">Active Campaign Segments</h4>
          <p className="text-xs text-neutral-400 mt-0.5">Group clients dynamically using LTV tiers, branches, and frequency rules.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e35205] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm hover:bg-[#c94804] transition-colors cursor-pointer"
        >
          <Plus size={11} />
          <span>New Segment</span>
        </button>
      </div>

      {/* Segments grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {segments.map((seg) => {
          const count = getDynamicCount(seg.id);
          return (
            <Card key={seg.id} className="p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <h5 className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                    <Layers size={13} className="text-[#e35205]" />
                    {seg.name}
                  </h5>
                  
                  {seg.isCustom && (
                    <button
                      onClick={() => deleteSegment(seg.id)}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-red-650 transition-colors cursor-pointer"
                      title="Delete Custom Segment"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">{seg.description}</p>
              </div>

              <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-1 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
                  <Users size={12} />
                  <span>{count} guest{count !== 1 ? 's' : ''} matched</span>
                </div>
                
                <span className="text-[9px] font-bold text-neutral-400 uppercase bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200/50">
                  {seg.rulesCount} filter rule{seg.rulesCount !== 1 ? 's' : ''}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI segment suggestion */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Segment Suggestion</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            We detected a growing cohort of "Weekend Dessert Enthusiasts" (18 guests ordering sweet platters after 20:00). Creating a targeted segment for this group can drive higher margins.
          </p>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl border border-neutral-100">
            <div className="flex justify-between items-center border-b border-neutral-150 pb-3">
              <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">Define Dynamic Segment</h4>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest font-heading">Segment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian High Spenders"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold p-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-[#e35205]/45 bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest font-heading">Description & Parameters</label>
                <textarea
                  placeholder="Describe rules, e.g. Guests ordering vegetarian dishes with LTV > ₹20k"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs font-semibold p-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-[#e35205]/45 h-16 resize-none bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-150 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-[10px] font-black uppercase tracking-wider text-neutral-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#e35205] text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-[#c94804]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerSegments;
