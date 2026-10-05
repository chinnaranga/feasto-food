import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';
import { AccountStatusCard, VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderAccountReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { reviewStatus, setCurrentStep } = useRiderAuthStore();

  const handleSimulateApproval = () => {
    setCurrentStep('approved');
    navigate('/rider/account-approved');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left">
      <VerificationStepper currentStep="review" />

      <div className="p-4 max-w-sm mx-auto w-full my-auto space-y-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-modal space-y-5">
          <RiderPageHeader
            title="Account Under Review"
            subtitle="Your identity, driving license, and vehicle registration are submitted for review."
          />

          <AccountStatusCard
            readinessPct={reviewStatus.overallReadinessPct}
            approvalHours={reviewStatus.estimatedApprovalHours}
            notes={reviewStatus.reviewerNotes}
          />

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-2 text-xs">
            <h4 className="font-bold text-neutral-900">Verification Steps Checklist:</h4>
            <ul className="space-y-1 text-neutral-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Phone OTP Verified</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Government Aadhaar/PAN Submitted</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Driving License Uploaded</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> EV Vehicle Registration Checked</li>
            </ul>
          </div>

          <RiderButton variant="primary" size="lg" fullWidth onClick={handleSimulateApproval}>
            Simulate Instant Approval →
          </RiderButton>
        </div>
      </div>
    </div>
  );
};

export default RiderAccountReviewPage;
