import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, CheckCircle2, Clock, ShieldAlert, Key } from 'lucide-react';
import useAdminStore from '../../store/admin/adminStore';
import { StatusBadge } from './components/AdminComponents';

export const UserDetailPanel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, suspendUser, activateUser } = useAdminStore();

  const user = users.find((u) => u.id === id) || users[0];

  if (!user) {
    return <div className="py-12 text-center text-neutral-400 font-bold text-xs">User record not found.</div>;
  }

  const ALL_PERMISSIONS = [
    { key: 'view_dashboard', label: 'View Dashboard Metrics' },
    { key: 'manage_restaurants', label: 'Approve & Suspend Restaurants' },
    { key: 'manage_users', label: 'Manage Users & Permissions' },
    { key: 'manage_support', label: 'Handle Escalated Support Tickets' },
    { key: 'manage_trust_safety', label: 'Conduct Trust & Safety Audits' },
    { key: 'manage_flags', label: 'Toggle Feature Flags & Rollouts' },
    { key: 'view_audit_logs', label: 'View Compliance Audit Logs' },
    { key: 'manage_content', label: 'Publish Platform Banners' },
    { key: 'manage_settings', label: 'Edit System Settings & Policies' },
    { key: 'view_system_health', label: 'Monitor Infrastructure Health' },
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to User Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {user.status === 'active' ? (
            <button
              onClick={() => suspendUser(user.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
            >
              Suspend Account
            </button>
          ) : (
            <button
              onClick={() => activateUser(user.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
            >
              Re-Activate Account
            </button>
          )}
        </div>
      </div>

      {/* User Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
              <User size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-neutral-900">{user.name}</h2>
                <StatusBadge status={user.status} />
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Role: <strong className="text-neutral-700">{user.role}</strong> · Account ID: <strong className="text-neutral-700 font-mono">{user.id}</strong>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">FLAG COUNT</span>
            <span className="text-xl font-black text-neutral-900">{user.flagCount} Flags</span>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Email Address</span>
            <span className="font-bold text-neutral-800 text-sm block truncate">{user.email}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Phone Number</span>
            <span className="font-bold text-neutral-800 block">{user.phone}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Registered Date</span>
            <span className="font-bold text-neutral-800 block">{user.registeredAt}</span>
          </div>
        </div>

        {/* Assigned RBAC Permission Matrix */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Key size={15} className="text-[#e35205]" />
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Assigned Role RBAC Permission Matrix
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {ALL_PERMISSIONS.map((perm) => {
              const isAssigned = user.permissions.includes(perm.key as any) || user.role === 'Super Admin';
              return (
                <div
                  key={perm.key}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isAssigned ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900' : 'bg-neutral-50 border-neutral-150 text-neutral-400'
                  }`}
                >
                  <span className="font-bold">{perm.label}</span>
                  {isAssigned ? (
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider">Off</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPanel;
