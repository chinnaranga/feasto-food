import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/utils/zodResolver';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';
import { authApi } from '@/services/api/authApi';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Read email + verified OTP code from VerifyOtp page state
  const email: string = (location.state as any)?.email || '';
  const code: string = (location.state as any)?.code || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFields) => {
    if (!email || !code) {
      addToast({ message: 'Session expired. Please restart the password reset flow.', type: 'error' });
      navigate('/auth/forgot-password');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        target: email,
        code,
        newPassword: data.password,
      });
      addToast({ message: 'Password updated. Please sign in with your new credentials.', type: 'success' });
      navigate('/auth/signin');
    } catch (err: any) {
      const msg = err?.message || '';
      if (err?.status === 400 || msg.includes('Invalid') || msg.includes('expired')) {
        addToast({ message: 'Reset code expired. Please request a new one.', type: 'error' });
        navigate('/auth/forgot-password');
      } else {
        addToast({ message: 'Failed to update password. Try again.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col text-left select-none">
        <h2 className="text-2xl font-black text-text-primary tracking-tight font-heading mb-1">
          Create new password
        </h2>
        <p className="text-xs font-semibold text-text-secondary mb-8">
          Enter your new credentials below. Must be at least 8 characters.
        </p>

        <form className="flex flex-col gap-4.5" onSubmit={handleSubmit(onSubmit)}>
          <PasswordField
            label="New Password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
            helperText="Must be at least 8 characters."
          />

          <PasswordField
            label="Confirm New Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            {...register('confirmPassword')}
          />

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-full justify-center rounded-xl font-bold mt-2 py-3 shadow-soft"
          >
            {isLoading ? 'Updating Password...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
