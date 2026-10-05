import React, { useState } from 'react';
import { Copy, Check, Users, Send } from 'lucide-react';
import { useReferralProgram } from '@/hooks/loyalty/useReferralProgram';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';

export const ReferralCard: React.FC = () => {
  const { code, referrals, shareText, inviteFriend, simulateFriendSignUp } = useReferralProgram();
  const { addToast } = useToastStore();
  const [copied, setCopied] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    addToast({ message: 'Referral link copied to clipboard!', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName || !friendEmail) return;
    inviteFriend(friendName, friendEmail);
    addToast({ message: `Invite sent to ${friendName}!`, type: 'success' });
    setFriendName('');
    setFriendEmail('');
  };

  return (
    <div className="p-6 bg-white border border-border-main rounded-3xl shadow-xs text-left grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* Invite form */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-brand-orange" />
          <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">Refer a Friend</h3>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          Invite your friends to Feasto. They get <span className="font-bold text-text-primary">₹150 off</span> their first order, and you earn <span className="font-bold text-text-primary">1,500 points (₹150 credit)</span> when they order!
        </p>

        <div className="flex gap-2 p-3 bg-secondary-bg/30 border border-border-main/50 rounded-2xl mb-5 items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Your referral code</span>
            <span className="text-sm font-black text-brand-orange tracking-wider">{code}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white border border-border-main hover:border-brand-orange/30 rounded-xl transition-main cursor-pointer"
            aria-label="Copy code to clipboard"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-text-muted" />}
          </button>
        </div>

        <form onSubmit={handleInvite} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Friend's full name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="w-full bg-primary-bg border border-border-main rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-hidden focus:border-brand-orange"
            required
          />
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Friend's email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              className="flex-1 bg-primary-bg border border-border-main rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-hidden focus:border-brand-orange"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5"
            >
              <Send size={12} />
              <span>Invite</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Referrals list */}
      <div className="border-t lg:border-t-0 lg:border-l border-border-main/50 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
        <div>
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted mb-4">Referrals status</h4>
          {referrals.length === 0 ? (
            <p className="text-xs text-text-muted italic py-8 text-center">No friends referred yet.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
              {referrals.map((ref) => (
                <div key={ref.id} className="p-3 bg-secondary-bg/25 border border-border-main/50 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">{ref.friendName}</span>
                    <span className="text-[9px] text-text-muted font-semibold">{ref.friendEmail} · {ref.date}</span>
                  </div>
                  {ref.status === 'pending' ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[8px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase">
                        Pending
                      </span>
                      <button
                        onClick={() => simulateFriendSignUp(ref.id)}
                        className="text-[8px] font-black text-brand-orange hover:text-brand-orange-dark border border-brand-orange/20 px-2 py-0.5 rounded-lg bg-white transition-main cursor-pointer"
                        title="Simulate friend sign up for testing"
                      >
                        Claim
                      </button>
                    </div>
                  ) : (
                    <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase shrink-0">
                      Claimed (₹{ref.rewardEarned})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
