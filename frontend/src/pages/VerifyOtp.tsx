import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';
import { authApi } from '@/services/api/authApi';

export const VerifyOtp: React.FC = () => {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Read the email + OTP type passed from ForgotPassword page
  const email: string = (location.state as any)?.email || '';
  const otpType: string = (location.state as any)?.type || 'password_reset';

  // Timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (!email) {
      addToast({ message: 'Cannot resend — email not found. Please restart the flow.', type: 'error' });
      return;
    }
    try {
      await authApi.forgotPassword(email);
      setResendTimer(30);
      addToast({ message: 'New verification OTP dispatched.', type: 'success' });
    } catch {
      addToast({ message: 'Failed to resend code. Please try again.', type: 'error' });
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }
    if (!email) {
      setError('Email context lost. Please restart from Forgot Password.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await authApi.verifyOtp({
        target: email,
        code: otpCode,
        type: otpType as 'password_reset' | 'email_verification' | 'phone_verification' | 'login_otp',
      });
      addToast({ message: 'OTP code verified successfully!', type: 'success' });
      // Pass email + verified code to the reset password page
      navigate('/auth/reset-password', { state: { email, code: otpCode } });
    } catch (err: any) {
      const msg = err?.message || '';
      if (err?.status === 400 || msg.includes('Invalid') || msg.includes('expired')) {
        setError('Invalid or expired code. Please request a new one.');
      } else {
        setError('Verification failed. Please try again.');
      }
      addToast({ message: 'Verification failed.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col text-left select-none">
        <h2 className="text-2xl font-black text-text-primary tracking-tight font-heading mb-1">
          Verify code
        </h2>
        <p className="text-xs font-semibold text-text-secondary mb-8">
          Enter the 6-digit verification code sent to{' '}
          {email ? <strong className="text-text-primary">{email}</strong> : 'your inbox'}.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <OTPInput
            length={6}
            value={otpCode}
            onChange={(val) => {
              setOtpCode(val);
              if (error) setError('');
            }}
            error={error}
            disabled={isLoading}
          />

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || otpCode.length < 6}
            className="w-full justify-center rounded-xl font-bold py-3 shadow-soft"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-2 mt-8 text-xs font-semibold text-text-secondary">
          {resendTimer > 0 ? (
            <span>
              Resend code in <strong className="text-text-primary">{resendTimer}s</strong>
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-brand-orange hover:text-[#c94804] font-bold cursor-pointer transition-main"
            >
              Resend verification code
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
