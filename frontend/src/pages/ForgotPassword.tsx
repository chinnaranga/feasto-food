import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/utils/zodResolver';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';
import { authApi } from '@/services/api/authApi';
import { MailCheck } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address'),
});

type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      addToast({ message: 'Verification code dispatched to your email.', type: 'success' });
    } catch (err: any) {
      const msg = err?.message || '';
      if (err?.status === 404 || msg.includes('not found')) {
        addToast({ message: 'No account found with that email address.', type: 'error' });
      } else if (err?.status === 429) {
        addToast({ message: 'Too many requests. Please wait before trying again.', type: 'error' });
      } else {
        addToast({ message: 'Failed to send code. Please try again.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="flex flex-col text-left select-none">
          <div className="flex items-center justify-center w-12 h-12 bg-success-main/5 text-success-main rounded-2xl mb-6">
            <MailCheck size={22} />
          </div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight font-heading mb-2">
            Check your email
          </h2>
          <p className="text-xs font-semibold text-text-secondary leading-relaxed mb-8">
            We've sent a 6-digit OTP code to{' '}
            <strong className="text-text-primary">{submittedEmail}</strong>. Enter it to reset
            your password.
          </p>

          <Button
            variant="primary"
            onClick={() =>
              navigate('/auth/verify-otp', { state: { email: submittedEmail, type: 'password_reset' } })
            }
            className="w-full justify-center rounded-xl font-bold py-3 shadow-soft"
          >
            Enter Verification OTP
          </Button>

          <p className="text-xs font-semibold text-text-secondary text-center mt-6">
            Incorrect email?{' '}
            <button
              onClick={() => setIsSuccess(false)}
              className="text-brand-orange hover:text-[#c94804] font-bold cursor-pointer"
            >
              Go back
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col text-left select-none">
        <h2 className="text-2xl font-black text-text-primary tracking-tight font-heading mb-1">
          Forgot password?
        </h2>
        <p className="text-xs font-semibold text-text-secondary mb-8">
          No worries. Enter your email and we'll dispatch a secure reset OTP code.
        </p>

        <form className="flex flex-col gap-4.5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={isLoading}
            {...register('email')}
          />

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-full justify-center rounded-xl font-bold mt-2 py-3 shadow-soft"
          >
            {isLoading ? 'Sending Code...' : 'Request Reset OTP'}
          </Button>
        </form>

        <p className="text-xs font-semibold text-text-secondary text-center mt-6">
          Remembered your password?{' '}
          <Link
            to="/auth/signin"
            className="text-brand-orange hover:text-[#c94804] font-bold transition-main"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
