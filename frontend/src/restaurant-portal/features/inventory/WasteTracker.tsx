import React, { useState } from 'react';
import { Trash2, AlertTriangle, Plus, PlusCircle, Check, HelpCircle, Save, Info } from 'lucide-react';
import usePortalInventoryStore from '../../store/portalInventoryStore';
import Card from '../../components/ui/Card';

export const WasteTracker: React.FC = () => {
  const { items, logWasteItem } = usePortalInventoryStore();

  const [activeLogId, setActiveLogId] = useState<string>('');
  const [logQty, setLogQty] = useState<number | ''>('');
  const [logReason, setLogReason] = useState<'spoilage' | 'damaged' | 'expired' | 'kitchen-waste'>('spoilage');
  const [logNote, setLogNote] = useState<string>('');
  
  const [showAddLog, setShowAddLog] = useState<boolean>(false);

  // Aggregate all waste logs
  const allWasteLogs = items.flatMap((item) =>
    item.wasteLogs.map((log) => ({
      ...log,
      itemName: item.name,
      unit: item.unit,
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLogId || !logQty || logQty <= 0) return;

    logWasteItem(activeLogId, {
      quantity: Number(logQty),
      reason: logReason,
      note: logNote || 'No extra notes provided.',
    });

    // Reset Form
    setActiveLogId('');
    setLogQty('');
    setLogReason('spoilage');
    setLogNote('');
    setShowAddLog(false);
  };

  const getElapsedTime = (isoStr: string) => {
    const elapsedMs = Date.now() - new Date(isoStr).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins < 1) return 'Just now';
    if (elapsedMins < 60) return `${elapsedMins}m ago`;
    return `${Math.floor(elapsedMins / 60)}h ago`;
  };

  const getReasonBadge = (reason: string) => {
    const styles: Record<string, string> = {
      spoilage: 'text-red-700 bg-red-50 border-red-100',
      damaged: 'text-amber-700 bg-amber-50 border-amber-100',
      expired: 'text-neutral-700 bg-neutral-100 border-neutral-200',
      'kitchen-waste': 'text-indigo-700 bg-indigo-50 border-indigo-100',
    };
    return styles[reason] || styles.spoilage;
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Kitchen Waste & Spoilage Log</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Log raw ingredient food waste and adjust quantities directly to maintain accurate supply levels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddLog(!showAddLog)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
        >
          <Plus size={12} /> Log Waste
        </button>
      </div>

      {/* Add Spoilage Form */}
      {showAddLog && (
        <form onSubmit={handleLogSubmit} className="p-5 border border-neutral-200 bg-neutral-50/50 rounded-2xl space-y-4 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Select Stock Item */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="adjustItem" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Select Ingredient
              </label>
              <select
                id="adjustItem"
                value={activeLogId}
                onChange={(e) => setActiveLogId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
                required
              >
                <option value="">Choose item...</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>{i.name} ({i.currentQuantity} {i.unit} in stock)</option>
                ))}
              </select>
            </div>

            {/* Quantity input */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="adjustQty" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Wasted Quantity
              </label>
              <input
                id="adjustQty"
                type="number"
                step="any"
                placeholder="e.g. 2.5"
                value={logQty}
                onChange={(e) => setLogQty(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800"
                required
              />
            </div>

            {/* Reason code */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="adjustReason" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Reason Code
              </label>
              <select
                id="adjustReason"
                value={logReason}
                onChange={(e) => setLogReason(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                <option value="spoilage">Spoilage / Rotten</option>
                <option value="damaged">Damaged / Bruised</option>
                <option value="expired">Expired date reached</option>
                <option value="kitchen-waste">Kitchen Spill / Waste</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-3 flex flex-col gap-1 w-full">
              <label htmlFor="adjustNote" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Adjustment Note
              </label>
              <input
                id="adjustNote"
                type="text"
                placeholder="e.g. Avocado was bruised during cargo container transit."
                value={logNote}
                onChange={(e) => setLogNote(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 h-9"
            >
              <Save size={12} />
              <span>Log Spoilage</span>
            </button>
          </div>
        </form>
      )}

      {/* Logs Table */}
      {allWasteLogs.length > 0 ? (
        <div className="border border-neutral-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-200">
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Ingredient</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Quantity Wasted</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Reason Code</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Timestamp</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {allWasteLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50/30 transition-colors">
                  <td className="p-4 text-xs font-bold text-neutral-800 text-left">{log.itemName}</td>
                  <td className="p-4 text-xs font-black text-red-600 text-left">-{log.quantity} {log.unit}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${getReasonBadge(log.reason)}`}>
                      {log.reason}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] text-neutral-400 font-semibold text-left">{getElapsedTime(log.timestamp)}</td>
                  <td className="p-4 text-xs text-neutral-500 font-semibold text-left max-w-sm truncate" title={log.note}>{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
            <Check size={18} />
          </div>
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Zero Waste Logged
          </h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-sm leading-relaxed">
            Congratulations, no food waste or spoiled items have been recorded in this workspace during the active cycle.
          </p>
        </Card>
      )}

      {/* SLA Notification Footer */}
      <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl">
        <Info size={13} className="text-neutral-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-neutral-500 leading-normal">
          Wastage logs adjust raw inventories directly and are logged inside the workspace's monthly operational reports for profit/loss calculation.
        </p>
      </div>

    </div>
  );
};

export default WasteTracker;
