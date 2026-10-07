import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6 selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="max-w-xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="review" />

        <div className="bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-5">
          <RiderPageHeader
            title="Dossier Under Review"
            subtitle="Your government KYC, driving license permit, and vehicle registration are queued in the compliance inspection stream."
          />

          <AccountStatusCard
            readinessPct={reviewStatus.overallReadinessPct}
            approvalHours={reviewStatus.estimatedApprovalHours}
            notes={reviewStatus.reviewerNotes}
          />

          <div className="p-4 bg-[#F3F0E8] border border-[#141518] space-y-2 text-xs font-mono">
            <h4 className="font-black text-[#141518] uppercase tracking-wider">
              VERIFICATION AUDIT CHECKLIST:
            </h4>
            <ul className="space-y-1.5 text-[#141518]">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#141518] text-[#FAF8F5] text-[10px] flex items-center justify-center font-bold">
                  ✓
                </span>
                <span>Phone OTP Cryptographic Handshake Verified</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#141518] text-[#FAF8F5] text-[10px] flex items-center justify-center font-bold">
                  ✓
                </span>
                <span>Government UIDAI / NSDL Identity Record Synced</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#141518] text-[#FAF8F5] text-[10px] flex items-center justify-center font-bold">
                  ✓
                </span>
                <span>Commercial Driving License Authenticated</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#141518] text-[#FAF8F5] text-[10px] flex items-center justify-center font-bold">
                  ✓
                </span>
                <span>Vehicle Parivahan RC Verified</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <RiderButton variant="primary" size="lg" fullWidth onClick={handleSimulateApproval}>
              SIMULATE INSTANT APPROVAL CLEARANCE →
            </RiderButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderAccountReviewPage;
