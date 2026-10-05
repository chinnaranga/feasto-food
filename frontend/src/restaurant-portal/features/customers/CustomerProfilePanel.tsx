import React, { useState } from 'react';
import { X, Calendar, DollarSign, Award, Heart, HelpCircle, Mail, Phone, MessageSquare, AlertOctagon, Edit3, Trash2, Star, Plus } from 'lucide-react';
import usePortalCustomerStore, { CRMNote } from '../../store/portalCustomerStore';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

interface CustomerProfilePanelProps {
  customerId: string;
  onClose: () => void;
}

export const CustomerProfilePanel: React.FC<CustomerProfilePanelProps> = ({ customerId, onClose }) => {
  const navigate = useNavigate();
  const { customers, addCustomerNote, toggleFollowUp, archiveCustomer } = usePortalCustomerStore();

  const customer = customers.find((c) => c.id === customerId);

  // Notes Form State
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteType, setNoteType] = useState<CRMNote['type']>('visit');

  if (!customer) return null;

  // Masking utilities to protect customer data
  const maskPhone = (phone: string) => {
    if (phone.length < 4) return '***';
    return `***-***-${phone.slice(-4)}`;
  };

  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length !== 2) return '***@***';
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `*@${domain}`;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addCustomerNote(customer.id, {
      type: noteType,
      author: 'Hostess (Portal)',
      content: noteContent.trim(),
    });
    setNoteContent('');
  };

  const handleDelete = () => {
    archiveCustomer(customer.id);
    onClose();
  };

  const getNoteBadgeStyle = (type: CRMNote['type']) => {
    switch (type) {
      case 'allergy':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'complaint':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'preference':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'staff':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-neutral-200/80 shadow-2xl z-55 flex flex-col text-left select-none animate-slide-in">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <div>
          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Guest Intelligence Profile</span>
          <h3 className="text-sm font-black text-neutral-800 flex items-center gap-1.5 mt-0.5">
            {customer.name}
            {customer.followUpFlag && <Star size={12} className="fill-amber-400 text-amber-400" />}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-neutral-150 rounded-xl text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          aria-label="Close drawer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Profile Details Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Core Quick KPI Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Life Time Value</span>
            <span className="text-xs font-black text-neutral-800 mt-1 block">₹{customer.lifetimeValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Avg Ticket</span>
            <span className="text-xs font-black text-neutral-800 mt-1 block">₹{customer.averageSpend.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider block">Loyalty Tier</span>
            <span className="text-[9px] font-black text-[#e35205] mt-1.5 block uppercase tracking-wider">{customer.loyaltyStatus}</span>
          </div>
        </div>

        {/* Masked Contact Info Card */}
        <div className="bg-neutral-50/30 border border-neutral-200/50 rounded-xl p-3.5 space-y-2">
          <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Secure Contact Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-600 font-semibold">
              <Mail size={12} className="text-neutral-400" />
              <span>{maskEmail(customer.email)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-600 font-semibold">
              <Phone size={12} className="text-neutral-400" />
              <span>{maskPhone(customer.phone)}</span>
            </div>
          </div>
        </div>

        {/* AI ready predictors */}
        <Card className="p-4 bg-orange-50/20 border border-orange-100/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading flex items-center gap-1">
              <AlertOctagon size={11} className="text-[#e35205]" />
              AI CRM Intelligence Predictors
            </h4>
            <span className="text-[9px] font-bold text-[#e35205] bg-orange-50 border border-orange-200/30 px-1.5 rounded uppercase">Active Telemetry</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[9px] text-neutral-400 font-bold block">Churn Likelihood Risk</span>
              <span className={`text-[10px] font-black ${customer.riskScore >= 60 ? 'text-red-650' : 'text-neutral-750'}`}>{customer.riskScore}% Churn Probability</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-neutral-400 font-bold block">Guest Engagement Score</span>
              <span className="text-[10px] text-emerald-600 font-black">{customer.engagementScore}% Rating</span>
            </div>
            
            {customer.outreach.nextRemindSuggestion && (
              <div className="col-span-2 space-y-0.5 border-t border-neutral-100 pt-2 mt-1">
                <span className="text-[9px] text-neutral-400 font-bold block">Outreach Call to Action</span>
                <span className="text-[10px] text-[#e35205] font-black">{customer.outreach.nextRemindSuggestion}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Preferences & Behavior */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Guest Dining Profile</h4>
          <div className="grid grid-cols-2 gap-3 border border-neutral-150 rounded-xl p-3.5 text-xs">
            <div>
              <span className="text-[9px] text-neutral-400 font-bold block">Cuisine Focus</span>
              <span className="font-bold text-neutral-700">{customer.preferredCuisine}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 font-bold block">Branch Preference</span>
              <span className="font-bold text-neutral-700">{customer.preferredBranch}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 font-bold block">Dining Time Preference</span>
              <span className="font-bold text-neutral-700">{customer.outreach.preferredWindow}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 font-bold block">Frequency Profile</span>
              <span className="font-bold text-neutral-700">{customer.visitFrequency} Visited</span>
            </div>
            
            <div className="col-span-2 border-t border-neutral-100 pt-2.5">
              <span className="text-[9px] text-neutral-400 font-bold block mb-1">Loyalty Tags</span>
              <div className="flex flex-wrap gap-1">
                {customer.tags.map(t => (
                  <span key={t} className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md border border-neutral-200/55">{t}</span>
                ))}
              </div>
            </div>

            <div className="col-span-2 border-t border-neutral-100 pt-2.5">
              <span className="text-[9px] text-neutral-400 font-bold block mb-1">Favorite Items Order Index</span>
              <div className="flex flex-wrap gap-1">
                {customer.favoriteItems.map(item => (
                  <span key={item} className="text-[9px] font-bold bg-orange-50/50 text-[#e35205] px-2 py-0.5 rounded-md border border-orange-100">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Relationship notes logger */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest font-heading">Internal Logged Notes</h4>
          
          {/* Note input form */}
          <form onSubmit={handleAddNote} className="space-y-2 border border-neutral-200/60 rounded-xl p-3 bg-neutral-50/40">
            <div className="flex gap-2 items-center">
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as any)}
                className="py-1 px-2 bg-white border border-neutral-200 rounded-md text-[10px] font-bold text-neutral-600 uppercase tracking-wider focus:outline-hidden focus:border-[#e35205]/30 cursor-pointer"
              >
                <option value="visit">Visit Note</option>
                <option value="allergy">Allergy Alert</option>
                <option value="complaint">Complaint log</option>
                <option value="preference">Guest Preference</option>
                <option value="staff">Staff Directive</option>
              </select>
            </div>
            
            <textarea
              placeholder="Record visit notes, service details, or allergy alerts..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full text-xs font-semibold p-2 bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-[#e35205]/45 h-16 resize-none"
              aria-label="CRM Note content"
            />
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#e35205] text-white rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer shadow-sm hover:bg-[#c94804]"
              >
                <Plus size={10} />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          {/* Notes list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {customer.notes.length === 0 ? (
              <p className="text-[10px] text-neutral-400 font-bold text-center py-4">No internal notes logged for this guest.</p>
            ) : (
              customer.notes.map((note) => (
                <div key={note.id} className="p-3 border border-neutral-100 rounded-xl space-y-1.5 bg-white shadow-3xs">
                  <div className="flex justify-between items-center text-[9px] font-bold text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded border text-[8px] uppercase tracking-widest font-black ${getNoteBadgeStyle(note.type)}`}>
                        {note.type}
                      </span>
                      <span>By {note.author}</span>
                    </div>
                    <span>{note.timestamp}</span>
                  </div>
                  <p className="text-xs font-medium text-neutral-700 leading-normal">{note.content}</p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-neutral-100 flex gap-2.5 bg-neutral-50/50 justify-between">
        
        {/* Toggle follow up star */}
        <button
          onClick={() => toggleFollowUp(customer.id)}
          className="px-3.5 py-2 border border-neutral-250 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-600 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Star size={13} className={customer.followUpFlag ? 'fill-amber-400 text-amber-400' : 'text-neutral-400'} />
          <span>{customer.followUpFlag ? 'Unstar Guest' : 'Star Guest'}</span>
        </button>

        <div className="flex gap-2">
          {/* Edit Button */}
          <button
            onClick={() => {
              navigate(`/restaurant-portal/customers/${customer.id}/edit`);
              onClose();
            }}
            className="px-3.5 py-2 border border-neutral-250 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-600 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Edit3 size={13} />
            <span>Edit Profile</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-red-50 text-red-650 hover:bg-red-100 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 size={13} />
            <span>Archive</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default CustomerProfilePanel;
