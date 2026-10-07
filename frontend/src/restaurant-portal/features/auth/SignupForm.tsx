import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { FormField, PasswordField, CheckboxField } from '../../components/ui/AuthFormFields';
import Button from '../../components/ui/Button';
import { zodResolver } from '../../utils/zodResolver';

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    workspaceName: z.string().min(3, 'Restaurant name must be at least 3 characters'),
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

type SignupSchemaType = z.infer<typeof signupSchema>;

export const SignupForm: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      workspaceName: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (_data: SignupSchemaType) => {
    setIsLoading(true);
    try {
      // Simulate registration
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
            ✓ REGISTRATION CONFIRMED
          </span>
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
            ACCOUNT CREATED
          </h2>
          <p className="font-sans text-xs text-[#52555F] mt-1">
            A secure terminal verification code has been dispatched. Verify your session to initiate setup.
          </p>
        </div>
        <Link to="/restaurant-portal/verify" className="block mt-4">
          <Button variant="acid" className="w-full">
            VERIFY TERMINAL CODE →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
          [02 / REGISTER]
        </span>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
          REGISTER KITCHEN BRAND
        </h2>
        <p className="font-sans text-xs text-[#52555F] mt-1">
          Establish your culinary merchant identity and connect branch dispatch terminals.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Executive Chef / Owner Name"
          id="fullName"
          placeholder="Chef Vikram Sethi"
          error={errors.fullName?.message}
          disabled={isLoading}
          {...register('fullName')}
        />

        <FormField
          label="Corporate / Merchant Email"
          id="email"
          type="email"
          placeholder="kitchen@restaurant.com"
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <FormField
          label="Restaurant / Brand Legal Name"
          id="workspaceName"
          placeholder="The Bombay Hearth"
          error={errors.workspaceName?.message}
          disabled={isLoading}
          {...register('workspaceName')}
        />

        <PasswordField
          label="Terminal Master Password"
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
          label="I agree to the Feasto Merchant Operating Agreement & Data Standards"
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
          REGISTER MERCHANT STUDIO →
        </Button>
      </form>

      <div className="text-center pt-3 border-t border-[#141518]/10">
        <span className="font-mono text-xs text-[#52555F]">
          Already registered?{' '}
          <Link
            to="/restaurant-portal/login"
            className="font-bold text-[#141518] underline hover:text-[#1B3BFF]"
          >
            Sign in to existing studio
          </Link>
        </span>
      </div>
    </div>
  );
};
export default SignupForm;
