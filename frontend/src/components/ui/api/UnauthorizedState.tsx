import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedStateProps {
  message?: string;
}

export const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  message = 'Your session has expired or you do not have permission to view this content.',
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[250px] bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
      <div className="p-3 bg-neutral-200/80 rounded-full text-neutral-700">
        <Lock className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-neutral-900">Authentication Required</h4>
        <p className="text-xs text-neutral-600 max-w-sm">{message}</p>
      </div>
      <button
        onClick={() => navigate('/signin')}
        className="px-4 py-2 text-xs font-bold text-white bg-[#e35205] rounded-xl hover:bg-[#c84400] transition-colors"
      >
        Sign In to Continue
      </button>
    </div>
  );
};
