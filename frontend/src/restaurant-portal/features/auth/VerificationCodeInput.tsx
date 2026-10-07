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
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#15803D] block">
            ✓ SECURITY CLEARANCE VERIFIED
          </span>
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
            SESSION VALIDATED
          </h2>
          <p className="font-sans text-xs text-[#52555F] mt-1">
            Your merchant terminal session is authenticated. You can now access your restaurant control surface.
          </p>
        </div>
        <Link to="/restaurant-portal/dashboard" className="block mt-4">
          <Button variant="acid" className="w-full">
            OPEN RESTAURANT STUDIO →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
          [06 / SECURITY]
        </span>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
          2FA TERMINAL VERIFY
        </h2>
        <p className="font-sans text-xs text-[#52555F] mt-1">
          Enter the 6-digit confirmation code dispatched to your registered merchant device.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="6-Digit Terminal Token"
          id="code"
          placeholder="000 000"
          maxLength={6}
          error={errors.code?.message}
          disabled={isLoading}
          className="text-center tracking-[0.5em] text-xl font-black font-mono border-2 border-[#141518]"
          {...register('code')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          CONFIRM TOKEN & ENTER →
        </Button>
      </form>

      <div className="flex items-center justify-between pt-3 border-t border-[#141518]/10 text-xs font-mono">
        <span className="text-[#8A8D98]">Token not received?</span>
        {resendTimer > 0 ? (
          <span className="text-[#8A8D98] font-bold">Resend in {resendTimer}s</span>
        ) : (
          <button
            onClick={handleResend}
            className="font-bold text-[#141518] underline hover:text-[#1B3BFF] cursor-pointer"
          >
            Dispatch new token
          </button>
        )}
      </div>
    </div>
  );
};
export default VerificationCodeInput;
