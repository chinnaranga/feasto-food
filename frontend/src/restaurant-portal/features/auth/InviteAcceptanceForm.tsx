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
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#15803D] block">
            ✓ INVITATION ACCEPTED
          </span>
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
            WELCOME TO THE BRIGADE
          </h2>
          <p className="font-sans text-xs text-[#52555F] mt-1">
            You have successfully joined the restaurant studio. You can now authenticate with your master passkey.
          </p>
        </div>
        <Link to="/restaurant-portal/login" className="block mt-4">
          <Button variant="acid" className="w-full">
            PROCEED TO TERMINAL SIGN IN →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
          [05 / ONBOARDING]
        </span>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
          ACCEPT TEAM INVITATION
        </h2>
        <p className="font-sans text-xs text-[#52555F] mt-1">
          Complete your staff profile to claim access to your restaurant station.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-[#FAF8F5] border border-[#141518]/20 text-[10px] text-[#52555F] font-mono">
          INVITATION TOKEN: <span className="font-bold text-[#141518]">{token || 'STU-INV-8802'}</span>
        </div>

        <FormField
          label="Your Full Name"
          id="fullName"
          placeholder="Chef Marco Rossi"
          error={errors.fullName?.message}
          disabled={isLoading}
          {...register('fullName')}
        />

        <PasswordField
          label="Establish Station Password"
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          hint="Must include at least 8 characters, a number, and a special character."
          disabled={isLoading}
          {...register('password')}
        />

        <PasswordField
          label="Confirm Station Password"
          id="confirmPassword"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          {...register('confirmPassword')}
        />

        <CheckboxField
          label="I agree to the Feasto Kitchen Operating Standards & Data Policy"
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
          ACCEPT & JOIN BRIGADE →
        </Button>
      </form>
    </div>
  );
};
export default InviteAcceptanceForm;
