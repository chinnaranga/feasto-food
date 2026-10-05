import React, { useState } from 'react';
import { Search, SlidersHorizontal, Eye, Star, AlertTriangle, ArrowUpDown, ShieldAlert, Sparkles, Check, Archive, Mail, Phone, MessageSquare } from 'lucide-react';
import usePortalCustomerStore, { Customer } from '../../store/portalCustomerStore';
import CustomerProfilePanel from './CustomerProfilePanel';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const CustomerTable: React.FC = () => {
  const navigate = useNavigate();
  const {
    customers,
    filters,
    selectedCustomerIds,
    toggleSelectCustomer,
    setSelectedCustomerIds,
    setFilter,
    clearFilters,
    archiveCustomer,
    toggleFollowUp
  } = usePortalCustomerStore();

  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Customer>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter and Search logic
  const filteredCustomers = customers
    .filter((c) => !c.isArchived)
    .filter((c) => {
      // Search matches name, email, phone
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query)
        );
      }
      return true;
    })
    .filter((c) => {
      if (filters.branch !== 'all') {
        return c.preferredBranch.toLowerCase().includes(filters.branch.toLowerCase());
      }
      return true;
    })
    .filter((c) => {
      if (filters.loyaltyStatus !== 'all') {
        return c.loyaltyStatus === filters.loyaltyStatus;
      }
      return true;
    })
    .filter((c) => {
      if (filters.visitFrequency !== 'all') {
        return c.visitFrequency === filters.visitFrequency;
      }
      return true;
    })
    .filter((c) => {
      if (filters.riskAlert === 'high') return c.riskScore >= 60;
      if (filters.riskAlert === 'medium') return c.riskScore >= 30 && c.riskScore < 60;
      if (filters.riskAlert === 'low') return c.riskScore < 30;
      return true;
    })
    .filter((c) => {
      if (filters.consentFilter === 'email') return c.consent.email;
      if (filters.consentFilter === 'sms') return c.consent.sms;
      if (filters.consentFilter === 'whatsapp') return c.consent.whatsapp;
      return true;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCustomerIds(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomerIds([]);
    }
  };

  const getLoyaltyBadge = (status: Customer['loyaltyStatus']) => {
    switch (status) {
      case 'VIP':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Regular':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'New':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Dormant':
        return 'bg-neutral-50 text-neutral-500 border-neutral-200/50';
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 60) return 'bg-red-50 text-red-650 border-red-100';
    if (score >= 30) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  };

  return (
    <div className="space-y-6 text-left select-none relative">
      {/* Filtering Toolbar */}
      <div className="flex flex-col gap-4 border-b border-neutral-100 pb-5">
        
        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={filters.searchQuery}
              onChange={(e) => setFilter('searchQuery', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200/70 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#e35205]/40 focus:bg-white transition-all"
            />
          </div>
          
          <div className="flex gap-2 items-center justify-end">
            {selectedCustomerIds.length > 0 && (
              <div className="flex items-center gap-1 bg-orange-50 border border-orange-200/40 p-1.5 rounded-xl shadow-xs">
                <span className="text-[10px] font-black text-[#e35205] px-2 uppercase">{selectedCustomerIds.length} selected</span>
                <button
                  onClick={() => {
                    selectedCustomerIds.forEach(id => archiveCustomer(id));
                    setSelectedCustomerIds([]);
                  }}
                  className="p-1 hover:bg-white rounded text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                  title="Archive Selected"
                >
                  <Archive size={12} />
                </button>
              </div>
            )}
            
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-[10px] font-bold text-neutral-500 uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          
          {/* Branch filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Branch Preference</label>
            <select
              value={filters.branch}
              onChange={(e) => setFilter('branch', e.target.value)}
              className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#e35205]/30 cursor-pointer"
            >
              <option value="all">All Branches</option>
              <option value="Downtown">Downtown Flagship</option>
              <option value="Suburbs">Suburbs Cloud Kitchen</option>
            </select>
          </div>

          {/* Loyalty status filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Loyalty Status</label>
            <select
              value={filters.loyaltyStatus}
              onChange={(e) => setFilter('loyaltyStatus', e.target.value)}
              className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#e35205]/30 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
              <option value="New">New</option>
              <option value="Dormant">Dormant</option>
            </select>
          </div>

          {/* Visit frequency filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Visit Frequency</label>
            <select
              value={filters.visitFrequency}
              onChange={(e) => setFilter('visitFrequency', e.target.value)}
              className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#e35205]/30 cursor-pointer"
            >
              <option value="all">All Frequencies</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Rarely">Rarely</option>
            </select>
          </div>

          {/* Risk Alert filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Churn Risk Level</label>
            <select
              value={filters.riskAlert}
              onChange={(e) => setFilter('riskAlert', e.target.value)}
              className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#e35205]/30 cursor-pointer"
            >
              <option value="all">All Risks</option>
              <option value="high">High Churn Risk (&gt;=60)</option>
              <option value="medium">Medium Risk (30-59)</option>
              <option value="low">Healthy (&lt;30)</option>
            </select>
          </div>

          {/* Communication consent filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Marketing Opt-in</label>
            <select
              value={filters.consentFilter}
              onChange={(e) => setFilter('consentFilter', e.target.value)}
              className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#e35205]/30 cursor-pointer"
            >
              <option value="all">All Opt-ins</option>
              <option value="email">Email Consent</option>
              <option value="sms">SMS Consent</option>
              <option value="whatsapp">WhatsApp Consent</option>
            </select>
          </div>

        </div>

      </div>

      {/* Directory Table */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-left w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filteredCustomers.length > 0 && selectedCustomerIds.length === filteredCustomers.length}
                  className="rounded border-neutral-300 text-[#e35205] focus:ring-[#e35205] cursor-pointer w-3.5 h-3.5"
                  aria-label="Select all customers"
                />
              </th>
              
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left cursor-pointer hover:text-neutral-700" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Guest Details</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left cursor-pointer hover:text-neutral-700" onClick={() => handleSort('loyaltyStatus')}>
                <div className="flex items-center gap-1">
                  <span>Loyalty Tier</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Preferences</th>

              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left cursor-pointer hover:text-neutral-700" onClick={() => handleSort('lastVisit')}>
                <div className="flex items-center gap-1">
                  <span>Last Visit</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left cursor-pointer hover:text-neutral-700" onClick={() => handleSort('lifetimeValue')}>
                <div className="flex items-center gap-1">
                  <span>LTV</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left cursor-pointer hover:text-neutral-700" onClick={() => handleSort('riskScore')}>
                <div className="flex items-center gap-1">
                  <span>Churn Risk</span>
                  <ArrowUpDown size={10} />
                </div>
              </th>

              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Channels</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  No matching guests located in Directory.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => {
                const isSelected = selectedCustomerIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-neutral-50/40 transition-colors cursor-pointer ${isSelected ? 'bg-orange-50/10' : ''}`}
                    onClick={() => setActiveCustomerId(c.id)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectCustomer(c.id)}
                        className="rounded border-neutral-300 text-[#e35205] focus:ring-[#e35205] cursor-pointer w-3.5 h-3.5"
                        aria-label={`Select ${c.name}`}
                      />
                    </td>
                    
                    <td className="p-4 text-left">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-neutral-800">{c.name}</span>
                            {c.followUpFlag && <Star size={11} className="fill-amber-400 text-amber-400" />}
                          </div>
                          <span className="text-[10px] text-neutral-400 font-semibold block">{c.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-left">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getLoyaltyBadge(c.loyaltyStatus)}`}>
                        {c.loyaltyStatus}
                      </span>
                    </td>

                    <td className="p-4 text-left">
                      <span className="text-[10px] text-neutral-700 font-bold block">{c.preferredCuisine}</span>
                      <span className="text-[9px] text-neutral-400 block">{c.preferredBranch}</span>
                    </td>

                    <td className="p-4 text-left text-xs font-semibold text-neutral-600">
                      {c.lastVisit}
                    </td>

                    <td className="p-4 text-left text-xs font-black text-neutral-800">
                      ₹{c.lifetimeValue.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 text-left">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(c.riskScore)}`}>
                        {c.riskScore}%
                      </span>
                    </td>

                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                       <div className="flex justify-end gap-1.5 text-neutral-450">
                         <span title={c.consent.email ? 'Email Opt-in' : 'Email Opt-out'} className={c.consent.email ? 'text-neutral-700' : 'text-neutral-300'}>
                           <Mail size={12} />
                         </span>
                         <span title={c.consent.sms ? 'SMS Opt-in' : 'SMS Opt-out'} className={c.consent.sms ? 'text-neutral-700' : 'text-neutral-300'}>
                           <Phone size={12} />
                         </span>
                         <span title={c.consent.whatsapp ? 'WhatsApp Opt-in' : 'WhatsApp Opt-out'} className={c.consent.whatsapp ? 'text-neutral-700' : 'text-neutral-300'}>
                           <MessageSquare size={12} />
                         </span>
                       </div>
                     </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out detail drawer panel */}
      {activeCustomerId && (
        <CustomerProfilePanel
          customerId={activeCustomerId}
          onClose={() => setActiveCustomerId(null)}
        />
      )}

    </div>
  );
};

export default CustomerTable;
