import React from 'react';
import { usePermissionCheck } from '../../hooks/security/usePermissionCheck';
import { StatusBadge } from '../admin/StatusBadge';

export const PermissionBadge: React.FC = () => {
  const { activeRole } = usePermissionCheck();

  return (
    <div className="flex items-center gap-1.5 select-none text-left">
      <span className="text-[10px] text-text-muted font-bold uppercase">Active Scope:</span>
      <StatusBadge value={activeRole} type="role" className="px-2 py-0.5 text-[8.5px]" />
    </div>
  );
};
export default PermissionBadge;
