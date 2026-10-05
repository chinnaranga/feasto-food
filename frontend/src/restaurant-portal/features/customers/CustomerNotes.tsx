import React, { useState } from 'react';
import { FileText, Search, User, Clock, Filter, AlertCircle, Sparkles } from 'lucide-react';
import usePortalCustomerStore, { CRMNote } from '../../store/portalCustomerStore';
import Card from '../../components/ui/Card';

export const CustomerNotes: React.FC = () => {
  const { customers } = usePortalCustomerStore();
  const [filterType, setFilterType] = useState<string>('all');

  // Collect all notes along with their guest details
  const allNotes = customers.flatMap((c) =>
    c.notes.map((note) => ({
      ...note,
      guestName: c.name,
      guestId: c.id,
    }))
  ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const filteredNotes = allNotes.filter((note) => {
    if (filterType !== 'all') {
      return note.type === filterType;
    }
    return true;
  });

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
    <div className="space-y-6 text-left select-none">
      
      {/* Title & Toolbar */}
      <div className="border-b border-neutral-100 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-heading">Internal Guest Logs</h4>
          <p className="text-xs text-neutral-400 mt-0.5">Aggregated guest interaction records, dining preferences, and kitchen alerts.</p>
        </div>

        {/* Note Type filter */}
        <div className="flex gap-2 items-center">
          <Filter size={12} className="text-neutral-400 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#e35205]/30 cursor-pointer"
          >
            <option value="all">All Note Types</option>
            <option value="allergy">Allergies Only</option>
            <option value="preference">Preferences</option>
            <option value="visit">Visit Notes</option>
            <option value="complaint">Complaints</option>
            <option value="staff">Staff Directives</option>
          </select>
        </div>
      </div>

      {/* Feed list */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <Card className="p-8 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            No notes logged for selected category.
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="p-4 border border-neutral-200/70 rounded-2xl bg-white shadow-3xs hover:border-neutral-300 transition-colors space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Relationship Log</span>
                  <span className="text-xs font-black text-neutral-850">{note.guestName}</span>
                </div>
                
                <span className={`px-2 py-0.5 rounded border text-[9px] uppercase tracking-widest font-black ${getNoteBadgeStyle(note.type)}`}>
                  {note.type}
                </span>
              </div>

              <p className="text-xs font-medium text-neutral-700 leading-relaxed bg-neutral-50/20 p-2.5 border border-neutral-100 rounded-xl">
                {note.content}
              </p>

              <div className="flex justify-between items-center text-[9px] font-bold text-neutral-400 border-t border-neutral-50 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <User size={11} className="text-neutral-400" />
                  <span>Logged by {note.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-neutral-400" />
                  <span>{note.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Critical allergy disclaimer */}
      <div className="p-3.5 bg-red-50/35 border border-red-150 rounded-xl flex items-start gap-2.5">
        <AlertCircle size={13} className="text-red-650 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-red-750 uppercase tracking-widest font-heading">Critical Allergy Warning Protocol</p>
          <p className="text-[9px] text-red-700 mt-0.5 leading-relaxed font-semibold">
            All allergy logs are highlighted in red and shared directly with KDS order tickets for active safety checking. Kitchen teams must confirm recipe checkmarks before kitchen dispatch.
          </p>
        </div>
      </div>

    </div>
  );
};

export default CustomerNotes;
