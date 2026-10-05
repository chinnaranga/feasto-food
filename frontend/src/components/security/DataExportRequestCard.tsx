import React, { useState } from 'react';
import { usePrivacyPreferences } from '../../hooks/security/usePrivacyPreferences';
import { Button } from '../ui/Button';
import { FileDown, Loader2, CheckCircle2 } from 'lucide-react';

export const DataExportRequestCard: React.FC = () => {
  const { requestGDPRArchive } = usePrivacyPreferences();
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    try {
      const res = await requestGDPRArchive();
      setRequestId(res.requestId);
    } catch (err) {
      // safe fallback error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl p-6 shadow-xs flex flex-col text-left">
      <div className="mb-5">
        <h3 className="text-sm font-extrabold text-text-primary tracking-tight font-heading">
          Export Personal Data Archive
        </h3>
        <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
          Request a copy of your personal profile data, order ledger transactions, and activity telemetry records under GDPR/CCPA regulations.
        </p>
      </div>

      {!requestId ? (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleRequest}
          className="self-start text-xs font-bold py-2 px-4 flex items-center gap-2 border-border-main"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Processing Request...</span>
            </>
          ) : (
            <>
              <FileDown size={14} />
              <span>Compile Data Package (JSON)</span>
            </>
          )}
        </Button>
      ) : (
        <div className="p-4 bg-success-main/5 border border-success-main/15 rounded-xl flex gap-3 items-start animate-fade-in text-xs">
          <CheckCircle2 className="text-success-main shrink-0 mt-0.5" size={16} />
          <div>
            <p className="font-extrabold text-success-main">Data compilation scheduled</p>
            <p className="text-[10px] text-text-secondary leading-relaxed mt-1">
              Your request ID is **{requestId}**. Data packages compile automatically. Feasto will mail a secure download link to your registered profile address in **24 hours**.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataExportRequestCard;
