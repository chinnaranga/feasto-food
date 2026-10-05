import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Clock, CheckCircle2, UserCheck, MessageSquare } from 'lucide-react';
import useAdminStore, { SupportTicket } from '../../store/admin/adminStore';
import { StatusBadge } from './components/AdminComponents';

export const AdminSupport: React.FC = () => {
  const { supportTickets, assignSupportTicket, resolveSupportTicket } = useAdminStore();

  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const filteredTickets = supportTickets.filter((t) => {
    if (priorityFilter === 'all') return true;
    return t.priority === priorityFilter;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Platform Support Escalations & SLA Management
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor support ticket queues, assign tier-2 escalation leads, track SLA response timers, and audit resolution notes
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Tickets' },
            { id: 'urgent', label: 'Urgent SLA' },
            { id: 'high', label: 'High Priority' },
            { id: 'medium', label: 'Medium' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPriorityFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                priorityFilter === tab.id
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Ticket Number / Subject</th>
                <th className="py-3 px-4">Raised By</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-center">SLA Status</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-black text-neutral-900">
                    <div>{t.subject}</div>
                    <span className="text-[10px] font-mono text-neutral-400 font-normal">{t.ticketNumber}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-neutral-800">{t.raisedBy}</div>
                    <span className="text-[10px] text-neutral-400 font-normal uppercase">{t.userType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        t.priority === 'urgent'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : t.priority === 'high'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700">{t.assignedTo || 'Unassigned'}</td>
                  <td className="py-3.5 px-4 text-center">
                    {t.slaBreachHours > 0 ? (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        {t.slaBreachHours}h SLA Breach
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-600">On Track</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {t.status !== 'resolved' ? (
                      <button
                        onClick={() => resolveSupportTicket(t.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-normal">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
