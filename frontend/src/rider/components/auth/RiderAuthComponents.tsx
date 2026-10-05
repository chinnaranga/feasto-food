import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Upload, Camera, Lock, Smartphone, ChevronRight } from 'lucide-react';
import type { VerificationStatus, OnboardingStep } from '../../types/auth';

// ─── VerificationBadge ───────────────────────────────────────────────────────
export const VerificationBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  const styles: Record<VerificationStatus, string> = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    under_review: 'bg-amber-50 text-amber-700 border-amber-200',
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    pending: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const labels: Record<VerificationStatus, string> = {
    approved: '● Verified',
    under_review: '⏳ Under Review',
    submitted: '✓ Submitted',
    pending: 'Pending',
    rejected: '✖ Action Needed',
    expired: '⚠️ Expired',
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// ─── VerificationStepper ─────────────────────────────────────────────────────
export const VerificationStepper: React.FC<{ currentStep: OnboardingStep }> = ({ currentStep }) => {
  const steps: { id: OnboardingStep; label: string }[] = [
    { id: 'register', label: 'Register' },
    { id: 'otp', label: 'Phone OTP' },
    { id: 'identity', label: 'Gov ID' },
    { id: 'documents', label: 'License' },
    { id: 'vehicle', label: 'Vehicle' },
    { id: 'review', label: 'Review' },
  ];

  const stepOrder: OnboardingStep[] = ['welcome', 'register', 'otp', 'email_verify', 'identity', 'documents', 'vehicle', 'review', 'approved'];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="w-full bg-white border-b border-neutral-200/80 px-4 py-2.5 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-2 min-w-max">
        {steps.map((s, idx) => {
          const sIndex = stepOrder.indexOf(s.id);
          const isDone = currentIndex > sIndex;
          const isCurrent = currentStep === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#e35205] text-white shadow-3xs'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </span>
                <span
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-neutral-900 font-heading' : isDone ? 'text-emerald-700' : 'text-neutral-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && <span className="text-neutral-300 text-xs">/</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ─── OTPInput ────────────────────────────────────────────────────────────────
export const OTPInput: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.slice(-1);
    const chars = value.split('');
    chars[idx] = char;
    const nextVal = chars.join('');
    onChange(nextVal);

    if (char && e.target.nextElementSibling) {
      (e.target.nextElementSibling as HTMLInputElement).focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          className="w-11 h-12 text-center text-lg font-mono font-black border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:border-[#e35205] focus:bg-white transition-all shadow-2xs"
        />
      ))}
    </div>
  );
};

// ─── DocumentUploader ────────────────────────────────────────────────────────
export const DocumentUploader: React.FC<{
  title: string;
  subtitle: string;
  status: VerificationStatus;
  onUpload: () => void;
}> = ({ title, subtitle, status, onUpload }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-left">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-xs font-black text-neutral-900 font-heading">{title}</h4>
          <span className="text-[11px] text-neutral-500 block">{subtitle}</span>
        </div>
        <VerificationBadge status={status} />
      </div>

      <div
        onClick={onUpload}
        className="p-4 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50 text-center cursor-pointer transition-colors space-y-1.5"
      >
        <Camera size={20} className="text-neutral-400 mx-auto" />
        <span className="text-xs font-bold text-neutral-800 block">Tap to Capture or Upload Document Photo</span>
        <span className="text-[10px] text-neutral-400 block font-mono">PNG, JPG, PDF (Max 10MB) • Quality Analyzer Ready</span>
      </div>
    </div>
  );
};

// ─── PasswordStrength ────────────────────────────────────────────────────────
export const PasswordStrength: React.FC<{ password?: string }> = ({ password = '' }) => {
  const getScore = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s += 1;
    if (/[A-Z]/.test(p)) s += 1;
    if (/[0-9]/.test(p)) s += 1;
    if (/[^A-Za-z0-9]/.test(p)) s += 1;
    return s;
  };

  const score = getScore(password);
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Enterprise Grade'];
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-emerald-600'];

  return (
    <div className="space-y-1 text-left">
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-neutral-200'}`}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-neutral-500">
        Password Strength: {password ? labels[score] : 'Required'}
      </span>
    </div>
  );
};

// ─── AccountStatusCard ───────────────────────────────────────────────────────
export const AccountStatusCard: React.FC<{
  readinessPct: number;
  approvalHours: number;
  notes?: string;
}> = ({ readinessPct, approvalHours, notes }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#e35205]" />
          <h4 className="text-xs font-black text-neutral-900 font-heading uppercase">
            Onboarding Verification Status
          </h4>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700">{readinessPct}% Complete</span>
      </div>

      <p className="text-xs text-neutral-600 leading-relaxed">
        Estimated approval time: <strong className="text-neutral-900">~{approvalHours} hours</strong>. Our partner onboarding team is reviewing your identity and vehicle documents.
      </p>

      {notes && (
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 text-[11px] text-neutral-700">
          <strong>Reviewer Note:</strong> {notes}
        </div>
      )}
    </div>
  );
};
