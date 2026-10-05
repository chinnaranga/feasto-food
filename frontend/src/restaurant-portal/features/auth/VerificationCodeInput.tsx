import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { FormField } from '../../components/ui/AuthFormFields';
import Button from '../../components/ui/Button';
import { zodResolver } from '../../utils/zodResolver';

const verifySchema = z.object({
  code: z.string().length(6, 'Verification code must be exactly 6 digits').regex(/^\d+$/, 'Digits only'),
});

type VerifySchemaType = z.infer<typeof verifySchema>;

export const VerificationCodeInput: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifySchemaType>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (_data: VerifySchemaType) => {
    setIsLoading(true);
    try {
      // Simulate verification code verify
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess(true);
    } catch (e) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
  };

  if (success) {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            Email Verified Successfully
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Your merchant session is now active. You can proceed to the dashboard.
          </p>
        </div>
        <Link to="/restaurant-portal/dashboard">
          <Button variant="primary" className="w-full mt-4">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-black text-neutral-900 tracking-tight">
          Verify your email
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Enter the 6-digit confirmation code sent to your registered address.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Verification Code"
          id="code"
          placeholder="000000"
          maxLength={6}
          error={errors.code?.message}
          disabled={isLoading}
          className="text-center tracking-widest text-lg font-black font-mono"
          {...register('code')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Confirm Code
        </Button>
      </form>

      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-neutral-400">Didn't receive code?</span>
        {resendTimer > 0 ? (
          <span className="text-neutral-400 font-bold">Resend code in {resendTimer}s</span>
        ) : (
          <button
            onClick={handleResend}
            className="font-bold text-[#e35205] hover:text-[#c94804] cursor-pointer"
          >
            Resend Code
          </button>
        )}
      </div>
    </div>
  );
};
export default VerificationCodeInput;
