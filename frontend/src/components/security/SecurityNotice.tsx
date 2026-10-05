import { ShieldCheck } from 'lucide-react';

export interface SecurityNoticeProps {
  message?: string;
  className?: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  message = 'Feasto utilizes industry-standard token encryptions (SOC2) to safeguard transaction details. Representatives will never request credentials verification codes via email/SMS.',
  className = '',
}) => {
  return (
    <div className={`p-4 bg-surface-bg border border-border-main rounded-xl flex gap-3 text-xs text-left leading-relaxed ${className}`}>
      <ShieldCheck className="text-brand-orange shrink-0 mt-0.5" size={16} />
      <div>
        <p className="font-extrabold text-text-primary">System Security Notice</p>
        <p className="text-[10px] text-text-secondary mt-1">
          {message}
        </p>
      </div>
    </div>
  );
};
export default SecurityNotice;
