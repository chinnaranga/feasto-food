import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

interface PortalErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const PortalErrorState: React.FC<PortalErrorStateProps> = ({
  title = 'Workspace error logged',
  message = 'An unexpected fault interrupted this view. Please try reloading or check permissions settings.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-red-100 bg-red-50/20 rounded-2xl max-w-lg mx-auto my-12">
      <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-4 shrink-0">
        <AlertCircle size={20} />
      </div>
      
      <h3 className="text-xs font-black text-red-800 tracking-tight mb-1">{title}</h3>
      <p className="text-[11px] text-red-600/80 max-w-xs mb-5 leading-normal">{message}</p>
      
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="flex items-center gap-1">
          <RotateCcw size={11} />
          Retry Operation
        </Button>
      )}
    </div>
  );
};
export default PortalErrorState;
