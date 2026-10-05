import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Mail, Plus, Trash2 } from 'lucide-react';
import { FormField } from '../../components/ui/AuthFormFields';
import OnboardingStepHeader from '../../components/ui/OnboardingStepHeader';
import StepNavigation from '../../components/ui/StepNavigation';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import { zodResolver } from '../../utils/zodResolver';
import Button from '../../components/ui/Button';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address').or(z.literal('')),
  role: z.enum(['Owner', 'Manager', 'Kitchen', 'Cashier', 'Finance', 'Staff']),
});

type InviteSchemaType = z.infer<typeof inviteSchema>;

export const TeamInviteForm: React.FC = () => {
  const navigate = useNavigate();
  const { drafts, setStepDraft, markStepComplete, setStepIndex } = usePortalOnboardingStore();
  const [invites, setInvites] = useState<Array<{ email: string; role: string }>>(drafts.team);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteSchemaType>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'Staff' },
  });

  const handleAddInvite = (data: InviteSchemaType) => {
    if (!data.email) return;
    const updated = [...invites, { email: data.email, role: data.role }];
    setInvites(updated);
    setStepDraft('team', updated);
    reset({ email: '', role: 'Staff' });
  };

  const handleRemoveInvite = (idx: number) => {
    const updated = invites.filter((_, i) => i !== idx);
    setInvites(updated);
    setStepDraft('team', updated);
  };

  const onSubmit = () => {
    markStepComplete('team');
    setStepIndex(6);
    navigate('/restaurant-portal/onboarding/review');
  };

  return (
    <div className="text-left">
      <OnboardingStepHeader
        title="Invite Your Operations Team"
        description="Share invite credentials to register cashiers, kitchen handlers, or managers. You can skip this step and invite them later."
      />

      <div className="space-y-6">
        
        {/* Input area */}
        <form onSubmit={handleSubmit(handleAddInvite)} className="flex flex-col md:flex-row items-end gap-3 p-4 border border-neutral-100 bg-[#fafafb]/30 rounded-xl">
          <div className="flex-1 w-full">
            <FormField
              label="Email Address"
              id="email"
              type="email"
              placeholder="staff@restaurant.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="flex flex-col gap-1 w-full md:w-48">
            <label htmlFor="role" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Role
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 rounded-lg text-xs font-bold text-neutral-800 transition-all duration-200 cursor-pointer"
              {...register('role')}
            >
              <option value="Manager">Manager</option>
              <option value="Kitchen">Kitchen Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Finance">Finance Manager</option>
              <option value="Staff">General Staff</option>
            </select>
          </div>

          <Button type="submit" variant="outline" className="flex items-center gap-1 shrink-0 h-9">
            <Plus size={12} />
            Add
          </Button>
        </form>

        {/* Invited list */}
        {invites.length > 0 && (
          <div className="space-y-2 border border-neutral-100 bg-white p-4 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] max-h-48 overflow-y-auto">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Team invitations queue
            </span>
            {invites.map((inv, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-700">{inv.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {inv.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInvite(idx)}
                    className="p-1 rounded hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-main cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <StepNavigation
          onBack={() => {
            setStepIndex(4);
            navigate('/restaurant-portal/onboarding/operations');
          }}
          onSkip={onSubmit}
        />
      </div>
    </div>
  );
};
export default TeamInviteForm;
