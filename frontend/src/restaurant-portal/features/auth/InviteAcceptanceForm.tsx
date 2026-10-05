import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useParams, Link } from 'react-router-dom';
import { FormField, PasswordField, CheckboxField } from '../../components/ui/AuthFormFields';
import Button from '../../components/ui/Button';
import { zodResolver } from '../../utils/zodResolver';

const inviteSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password must contain a number and a special character'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type InviteSchemaType = z.infer<typeof inviteSchema>;

export const InviteAcceptanceForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteSchemaType>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { fullName: '', password: '', confirmPassword: '', termsAccepted: false },
  });

  const onSubmit = async (_data: InviteSchemaType) => {
    setIsLoading(true);
    try {
      // Simulate invitation accept
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
    } catch (e) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            Invitation Accepted
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            You have successfully joined the restaurant workspace. You can now log in using your password credentials.
          </p>
        </div>
        <Link to="/restaurant-portal/login">
          <Button variant="primary" className="w-full mt-4">
            Proceed to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-black text-neutral-900 tracking-tight">
          Join your workspace team
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Complete your profile creation to accept the invitation link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] text-neutral-500 font-bold">
          Invitation Token: <span className="font-mono text-neutral-700">{token || 'simulated-token-xyz'}</span>
        </div>

        <FormField
          label="Full Name"
          id="fullName"
          placeholder="Chef Sato"
          error={errors.fullName?.message}
          disabled={isLoading}
          {...register('fullName')}
        />

        <PasswordField
          label="Choose Password"
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          hint="Must include at least 8 characters, a number, and a special character."
          disabled={isLoading}
          {...register('password')}
        />

        <PasswordField
          label="Confirm Password"
          id="confirmPassword"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          {...register('confirmPassword')}
        />

        <CheckboxField
          label="I agree to the Terms of Service and Privacy Policy"
          id="termsAccepted"
          error={errors.termsAccepted?.message}
          {...register('termsAccepted')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Accept & Join Team
        </Button>
      </form>
    </div>
  );
};
export default InviteAcceptanceForm;
