import React, { useState } from 'react';
import { Zap, Plus, Play, Pause, Copy, Trash2, ArrowRight } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';
import { AutomationCard, IntegrationsEmptyState } from './IntegrationsComponents';
import { TRIGGER_DEFINITIONS, ACTION_DEFINITIONS } from '../../constants/integrations';
import type { TriggerEventType, ActionType } from '../../types/integrations';

export const AutomationsPage: React.FC = () => {
  const {
    automations,
    addAutomation,
    toggleAutomationStatus,
    duplicateAutomation,
    deleteAutomation,
  } = usePortalIntegrationsStore();

  const [showBuilder, setShowBuilder] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [triggerEvent, setTriggerEvent] = useState<TriggerEventType>('order.created');
  const [action, setAction] = useState<ActionType>('send_notification');

  const handleCreateAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addAutomation({
      title,
      description: description || `Automatically run ${action} when ${triggerEvent} occurs.`,
      triggerEvent,
      action,
      actionConfig: {},
      isActive: true,
      createdByName: 'Restaurant Admin',
      branchScope: 'all',
      status: 'active',
    });
    setTitle('');
    setDescription('');
    setShowBuilder(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              ⚡ Trigger → Action Workflow Automation Engine
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Automated Operational Rules & Event Workflows
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Construct no-code trigger-action rules for kitchen SLA SLA alerts, auto-pausing zero-stock dishes, guest retention messaging, and financial accounting.
          </p>
        </div>

        <button
          onClick={() => setShowBuilder(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e35205] hover:bg-[#c94804] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-3xs shrink-0"
        >
          <Plus size={13} />
          <span>Create Automation Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      {automations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map((rule) => (
            <AutomationCard
              key={rule.id}
              rule={rule}
              onToggle={toggleAutomationStatus}
              onDuplicate={duplicateAutomation}
              onDelete={deleteAutomation}
            />
          ))}
        </div>
      ) : (
        <IntegrationsEmptyState
          title="No Automation Rules Configured"
          description="Create your first trigger-action workflow to automate repetitive kitchen and operational tasks."
          actionLabel="Create Automation Rule"
          onAction={() => setShowBuilder(true)}
        />
      )}

      {/* Automation Rule Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAutomation}
            className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-modal max-w-lg w-full text-left space-y-4"
          >
            <h3 className="text-base font-black text-neutral-900 font-heading">Build Workflow Automation Rule</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Rule Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Instant WhatsApp Order Confirmation"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this automation accomplishes..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>

            {/* Trigger Selector */}
            <div className="space-y-1.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
              <label className="text-xs font-black text-[#e35205] uppercase tracking-wider block">
                1. WHEN THIS TRIGGER OCCURS:
              </label>
              <select
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value as TriggerEventType)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none"
              >
                {TRIGGER_DEFINITIONS.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label} ({t.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center text-neutral-400 my-1">
              <ArrowRight size={16} className="rotate-90" />
            </div>

            {/* Action Selector */}
            <div className="space-y-1.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <label className="text-xs font-black text-blue-700 uppercase tracking-wider block">
                2. THEN AUTOMATICALLY DO THIS ACTION:
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as ActionType)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none"
              >
                {ACTION_DEFINITIONS.map((a) => (
                  <option key={a.type} value={a.type}>
                    {a.label} — {a.targetSystem}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#e35205] text-white rounded-xl hover:bg-[#c94804] cursor-pointer shadow-3xs"
              >
                Save Automation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AutomationsPage;
