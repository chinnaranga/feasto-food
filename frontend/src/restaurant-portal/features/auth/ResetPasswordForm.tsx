import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { PasswordField } from '../../components/ui/AuthFormFields';
import Button from '../../components/ui/Button';
import { zodResolver } from '../../utils/zodResolver';

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password must contain a number and a special character'),
    confirmPassword: z.string().min(8, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetSchemaType = z.infer<typeof resetSchema>;

export const ResetPasswordForm: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetSchemaType>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (_data: ResetSchemaType) => {
    setIsLoading(true);
    try {
      // Simulate password reset
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
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#15803D] block">
            ✓ CREDENTIALS SYNCHRONIZED
          </span>
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
            PASSWORD UPDATED
          </h2>
          <p className="font-sans text-xs text-[#52555F] mt-1">
            Your new merchant credentials are now active across all connected terminals.
          </p>
        </div>
        <Link to="/restaurant-portal/login" className="block mt-4">
          <Button variant="acid" className="w-full">
            SIGN IN WITH NEW PASSKEY →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
          [04 / CREDENTIALS]
        </span>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
          SET NEW PASSWORD
        </h2>
        <p className="font-sans text-xs text-[#52555F] mt-1">
          Set your new high-entropy terminal access password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          label="New Master Password"
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          hint="Must include at least 8 characters, a number, and a special character."
          disabled={isLoading}
          {...register('password')}
        />

        <PasswordField
          label="Confirm New Password"
          id="confirmPassword"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          SAVE PASSWORD & PROCEED →
        </Button>
      </form>
    </div>
  );
};
export default ResetPasswordForm;
