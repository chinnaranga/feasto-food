import { useLoyaltyStore } from '@/store/loyalty/loyaltyStore';
import { referralClient } from '@/services/loyalty/referralClient';

export function useReferralProgram() {
  const code = useLoyaltyStore((state) => state.referralCode);
  const referrals = useLoyaltyStore((state) => state.referrals);
  const addReferral = useLoyaltyStore((state) => state.addReferral);
  const completeReferral = useLoyaltyStore((state) => state.completeReferral);

  const shareText = referralClient.getReferralShareText(code);

  return {
    code,
    referrals,
    shareText,
    inviteFriend: (name: string, email: string) => addReferral(name, email),
    simulateFriendSignUp: (id: string) => completeReferral(id),
  };
}
