import React, { useState } from 'react';
import { ShieldAlert, Plus, CheckCircle2, MessageSquare, Clock, AlertTriangle, X } from 'lucide-react';
import useAdminSecurityStore, { SecurityIncident, IncidentSeverity, IncidentStatus } from '../../../store/admin/adminSecurityStore';
import { SeverityBadge } from './SecurityComponents';

export const IncidentManagement: React.FC = () => {
  const { incidents, createIncident, updateIncidentStatus, addIncidentNote } = useAdminSecurityStore();

  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [newNote, setNewNote] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State for New Incident
  const [title, setTitle] = useState<string>('');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [affectedComponent, setAffectedComponent] = useState<string>('API Gateway / Auth');
  const [description, setDescription] = useState<string>('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      createIncident({
        title,
        severity,
        status: 'open',
        affectedComponent,
        description,
        assignedTo: 'Security On-Call Lead',
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIncident && newNote.trim()) {
      addIncidentNote(selectedIncident.id, 'Security On-Call', newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Platform Security Incident Response Desk
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Log security anomalies, track threat mitigation timelines, assign incident owners, and record incident resolution notes
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
        >
          <Plus size={14} />
          <span>Declare Security Incident</span>
        </button>
      </div>

      {/* Incident Directory Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">Ticket Number / Incident Title</th>
                <th className="py-3 px-4">Component Affected</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Assigned Lead</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-black text-neutral-900">
                    <div>{inc.title}</div>
                    <span className="text-[10px] font-mono text-neutral-400 font-normal">{inc.ticketNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700">{inc.affectedComponent}</td>
                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={inc.severity} />
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700">{inc.assignedTo || 'Unassigned'}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        inc.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inc.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {inc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        Notes ({inc.responseNotes.length})
                      </button>
                      {inc.status !== 'resolved' && (
                        <button
                          onClick={() => updateIncidentStatus(inc.id, 'resolved')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Notes Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4 text-left border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-black text-neutral-800 font-heading">{selectedIncident.title}</h3>
                <span className="text-[10px] font-mono text-neutral-400">{selectedIncident.ticketNumber}</span>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl space-y-1 text-xs text-neutral-700">
              <span className="font-bold block">Incident Description:</span>
              <p className="leading-relaxed text-neutral-600">{selectedIncident.description}</p>
            </div>

            {/* Notes Log Timeline */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Mitigation Log Stream</h4>
              {selectedIncident.responseNotes.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No mitigation notes recorded yet.</p>
              ) : (
                selectedIncident.responseNotes.map((note) => (
                  <div key={note.id} className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-150 text-xs space-y-0.5">
                    <div className="flex justify-between text-[10px] text-neutral-400 font-bold">
                      <span>{note.author}</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-neutral-800 font-semibold">{note.note}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-neutral-100">
              <textarea
                rows={2}
                placeholder="Log mitigation progress note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Add Note Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Declare Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 text-left border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider font-heading">
                Declare Security Incident
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Incident Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Credential stuffing spike on authentication gateway"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none"
                >
                  <option value="low">Low Severity</option>
                  <option value="medium">Medium Severity</option>
                  <option value="high">High Severity</option>
                  <option value="critical">CRITICAL (System Impact)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Component Affected
                </label>
                <input
                  type="text"
                  value={affectedComponent}
                  onChange={(e) => setAffectedComponent(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail anomaly indicators and initial mitigation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
                >
                  Declare Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentManagement;
