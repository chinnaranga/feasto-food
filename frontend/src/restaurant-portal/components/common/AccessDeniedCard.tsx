import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface AccessDeniedCardProps {
  requiredPermission?: string;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({ requiredPermission }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-neutral-200/80 bg-white rounded-2xl max-w-md mx-auto my-16 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 mb-5 shrink-0">
        <ShieldAlert size={22} className="animate-pulse" />
      </div>

      <h3 className="text-sm font-black text-neutral-800 tracking-tight mb-2">
        Access Restricted
      </h3>
      
      <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mb-6">
        Your merchant account does not possess the permissions level required to access this workspace section. 
        {requiredPermission && (
          <span className="block mt-2 font-mono text-[10px] text-neutral-400">
            Required token: {requiredPermission}
          </span>
        )}
      </p>

      <Button
        variant="outline"
        onClick={() => navigate('/restaurant-portal/dashboard')}
        className="flex items-center gap-1.5"
      >
        <ArrowLeft size={11} />
        Back to Dashboard
      </Button>
    </div>
  );
};
export default AccessDeniedCard;
