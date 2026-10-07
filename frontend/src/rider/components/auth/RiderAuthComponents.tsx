import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Camera,
  Lock,
  Smartphone,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import type { VerificationStatus, OnboardingStep } from '../../types/auth';

// ─── VerificationBadge ───────────────────────────────────────────────────────
export const VerificationBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
  const styles: Record<VerificationStatus, string> = {
    approved: 'bg-[#D7F04A] text-[#141518] border-[#141518]',
    under_review: 'bg-[#FEF08A] text-[#141518] border-[#141518]',
    submitted: 'bg-[#BFDBFE] text-[#141518] border-[#141518]',
    pending: 'bg-[#F3F0E8] text-[#55565B] border-[#141518]/30',
    rejected: 'bg-[#FEE2E2] text-[#991B1B] border-[#141518]',
    expired: 'bg-[#E9D5FF] text-[#581C87] border-[#141518]',
  };

  const labels: Record<VerificationStatus, string> = {
    approved: '● VERIFIED',
    under_review: '⏳ IN REVIEW',
    submitted: '✓ SUBMITTED',
    pending: '○ PENDING',
    rejected: '✖ ACTION REQ',
    expired: '⚠️ EXPIRED',
  };

  return (
    <span
      className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border shadow-[1px_1px_0px_#141518] ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

// ─── VerificationStepper ─────────────────────────────────────────────────────
export const VerificationStepper: React.FC<{ currentStep: OnboardingStep }> = ({ currentStep }) => {
  const steps: { id: OnboardingStep; label: string; code: string }[] = [
    { id: 'register', label: 'Identity', code: '01' },
    { id: 'otp', label: 'Phone 2FA', code: '02' },
    { id: 'identity', label: 'Gov KYC', code: '03' },
    { id: 'documents', label: 'DL Permit', code: '04' },
    { id: 'vehicle', label: 'Fleet RC', code: '05' },
    { id: 'review', label: 'Verification', code: '06' },
  ];

  const stepOrder: OnboardingStep[] = [
    'welcome',
    'register',
    'otp',
    'email_verify',
    'identity',
    'documents',
    'vehicle',
    'review',
    'approved',
  ];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="w-full bg-[#FAF8F5] border-b border-[#141518] px-4 py-3 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-3 min-w-max">
        {steps.map((s, idx) => {
          const sIndex = stepOrder.indexOf(s.id);
          const isDone = currentIndex > sIndex;
          const isCurrent = currentStep === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold border border-[#141518] ${
                    isDone
                      ? 'bg-[#141518] text-[#FAF8F5]'
                      : isCurrent
                      ? 'bg-[#D7F04A] text-[#141518] shadow-[2px_2px_0px_#141518]'
                      : 'bg-[#F3F0E8] text-[#55565B]'
                  }`}
                >
                  {isDone ? '✓' : s.code}
                </span>
                <span
                  className={`text-[11px] font-mono uppercase tracking-wider ${
                    isCurrent
                      ? 'text-[#141518] font-black underline underline-offset-4 decoration-[#D7F04A] decoration-2'
                      : isDone
                      ? 'text-[#141518] font-bold'
                      : 'text-[#55565B]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && <span className="text-[#141518]/30 text-xs font-mono">→</span>}
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
    <div className="flex items-center justify-center gap-2.5 py-3">
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          className="w-12 h-14 text-center text-xl font-mono font-black border border-[#141518] bg-[#FAF8F5] text-[#141518] shadow-[3px_3px_0px_#141518] focus:outline-none focus:bg-[#D7F04A]/20 focus:border-[#141518] transition-all"
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
    <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-3 text-left">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-xs font-heading font-black uppercase text-[#141518] tracking-wider">{title}</h4>
          <span className="text-[11px] text-[#55565B] block font-sans mt-0.5">{subtitle}</span>
        </div>
        <VerificationBadge status={status} />
      </div>

      <div
        onClick={onUpload}
        className="p-4 border border-dashed border-[#141518] bg-[#F3F0E8] hover:bg-[#eae6dd] text-center cursor-pointer transition-colors space-y-1.5"
      >
        <div className="w-8 h-8 bg-[#141518] text-[#FAF8F5] flex items-center justify-center mx-auto">
          <Camera size={16} />
        </div>
        <span className="text-xs font-mono font-bold uppercase text-[#141518] block">
          TAP TO CAPTURE OR UPLOAD DOCUMENT
        </span>
        <span className="text-[10px] text-[#55565B] block font-mono">
          PNG, JPG, PDF (MAX 10MB) • HIGH RESOLUTION PHOTO OCR
        </span>
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
  const labels = ['WEAK', 'FAIR', 'SOLID', 'STRONG', 'ENTERPRISE'];
  const colors = ['bg-[#EF4444]', 'bg-[#F59E0B]', 'bg-[#1B3BFF]', 'bg-[#10B981]', 'bg-[#D7F04A]'];

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex gap-1 h-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 border border-[#141518] transition-all ${
              i <= score ? colors[score] : 'bg-[#E8E4DA]'
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#55565B]">
        SECURITY RATING: {password ? labels[score] : 'REQUIRED'}
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
    <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3.5 text-left">
      <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#141518]" />
          <h4 className="text-xs font-heading font-black text-[#141518] uppercase tracking-wider">
            ONBOARDING VERIFICATION AUDIT
          </h4>
        </div>
        <span className="text-xs font-mono font-black px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
          {readinessPct}% READY
        </span>
      </div>

      <p className="text-xs text-[#55565B] leading-relaxed font-sans">
        Estimated approval turnaround:{' '}
        <strong className="text-[#141518] font-mono">~{approvalHours} HOURS</strong>. Partner dispatch
        compliance team is inspecting your KYC credentials and vehicle permit.
      </p>

      {notes && (
        <div className="p-3 bg-[#F3F0E8] border border-[#141518] text-[11px] font-mono text-[#141518]">
          <strong className="uppercase">COMPLIANCE OFFICER NOTE:</strong> {notes}
        </div>
      )}
    </div>
  );
};
