import React from 'react';
import { Shield, Sparkles, Key, CheckSquare, Square, Info } from 'lucide-react';
import usePortalStaffStore from '../../store/portalStaffStore';
import type { RoleDefinition } from '../../store/portalStaffStore';

export const RoleManager: React.FC = () => {
  const { roles, updateRole } = usePortalStaffStore();

  const handleTogglePermission = (roleId: string, permissionKey: keyof RoleDefinition['permissions']) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    const updatedPermissions = {
      ...role.permissions,
      [permissionKey]: !role.permissions[permissionKey],
    };

    updateRole(roleId, { permissions: updatedPermissions });
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Roles & Permission Matrix Lock</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure granular module boundaries across different role categories to maintain strict merchant data security.
        </p>
      </div>

      {/* Roster matrix grid */}
      <div className="border border-neutral-200/85 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left w-64">Role Name & Scope</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-center">Menu Editor</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-center">Staff Roster</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-center">Inventory Stocks</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-center">Settings Config</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-center">Finance Logs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {roles.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50/30 transition-colors">
                <td className="p-4 text-left">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-neutral-800">{r.name}</span>
                    <span className="text-[10px] text-neutral-400 font-semibold">{r.description}</span>
                  </div>
                </td>
                
                {/* Menu */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleTogglePermission(r.id, 'menuControl')}
                    disabled={r.id === 'role-owner'}
                    className={`inline-flex p-1 rounded hover:bg-neutral-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {r.permissions.menuControl ? (
                      <CheckSquare size={14} className="text-[#e35205]" />
                    ) : (
                      <Square size={14} className="text-neutral-300" />
                    )}
                  </button>
                </td>

                {/* Staff */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleTogglePermission(r.id, 'staffControl')}
                    disabled={r.id === 'role-owner'}
                    className={`inline-flex p-1 rounded hover:bg-neutral-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {r.permissions.staffControl ? (
                      <CheckSquare size={14} className="text-[#e35205]" />
                    ) : (
                      <Square size={14} className="text-neutral-300" />
                    )}
                  </button>
                </td>

                {/* Inventory */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleTogglePermission(r.id, 'inventoryControl')}
                    disabled={r.id === 'role-owner'}
                    className={`inline-flex p-1 rounded hover:bg-neutral-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {r.permissions.inventoryControl ? (
                      <CheckSquare size={14} className="text-[#e35205]" />
                    ) : (
                      <Square size={14} className="text-neutral-300" />
                    )}
                  </button>
                </td>

                {/* Settings */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleTogglePermission(r.id, 'settingsControl')}
                    disabled={r.id === 'role-owner'}
                    className={`inline-flex p-1 rounded hover:bg-neutral-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {r.permissions.settingsControl ? (
                      <CheckSquare size={14} className="text-[#e35205]" />
                    ) : (
                      <Square size={14} className="text-neutral-300" />
                    )}
                  </button>
                </td>

                {/* Finance */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleTogglePermission(r.id, 'financeControl')}
                    disabled={r.id === 'role-owner'}
                    className={`inline-flex p-1 rounded hover:bg-neutral-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {r.permissions.financeControl ? (
                      <CheckSquare size={14} className="text-[#e35205]" />
                    ) : (
                      <Square size={14} className="text-neutral-300" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info footer */}
      <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl">
        <Info size={13} className="text-neutral-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-neutral-500 leading-normal">
          <strong>Security Note:</strong> Owner roles maintain full global override keys. Permission configuration changes are applied immediately across all active employee sessions.
        </p>
      </div>

    </div>
  );
};

export default RoleManager;
