import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import { RiderButton, RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderActiveExceptionsPage: React.FC = () => {
  const { exceptions, setReportIssueModalOpen } = useRiderActiveStore();

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <RiderPageHeader title="Exception Reports & Issues" subtitle="Audit log of active delivery exceptions and support escalations." />
        <RiderButton variant="danger" size="sm" onClick={() => setReportIssueModalOpen(true)}>
          + Report Issue
        </RiderButton>
      </div>

      {exceptions.length > 0 ? (
        <div className="space-y-3">
          {exceptions.map((exc) => (
            <div key={exc.id} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-neutral-900">
                <span className="flex items-center gap-1.5 text-red-600">
                  <AlertTriangle size={14} />
                  <span>{exc.title}</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">{exc.timestamp}</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">{exc.notes}</p>
            </div>
          ))}
        </div>
      ) : (
        <RiderEmptyState title="No Exception Reports" description="You have not reported any active delivery delays or issues." />
      )}
    </div>
  );
};

export default RiderActiveExceptionsPage;
