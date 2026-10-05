import { Referral } from '@/types/loyalty';

export const referralClient = {
  generateReferralCode(username: string): string {
    const cleanName = username.replace(/\s+/g, '').toUpperCase().slice(0, 5);
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${cleanName}${randomNum}`;
  },

  getReferralShareText(referralCode: string): string {
    return `Hey! Use my referral code ${referralCode} to get ₹150 off on your first gourmet meal delivery with Feasto! 🍔✨ Order now: https://feasto.ai/refer/${referralCode}`;
  },

  createNewReferral(friendName: string, friendEmail: string): Referral {
    return {
      id: `ref-${Math.random().toString(36).substr(2, 9)}`,
      friendName,
      friendEmail,
      status: 'pending',
      rewardEarned: 150,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
  },
};
