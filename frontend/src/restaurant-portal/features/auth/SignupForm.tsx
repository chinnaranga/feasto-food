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
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            Account Created Successfully
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            An email verification code has been dispatched. Please verify your session to log in.
          </p>
        </div>
        <Link to="/restaurant-portal/verify">
          <Button variant="primary" className="w-full mt-4">
            Verify Email
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-black text-neutral-900 tracking-tight">
          Create merchant account
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Register your brand to manage branch menus.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Full Name"
          id="fullName"
          placeholder="Chef Kenji Sato"
          error={errors.fullName?.message}
          disabled={isLoading}
          {...register('fullName')}
        />

        <FormField
          label="Email address"
          id="email"
          type="email"
          placeholder="name@restaurant.com"
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <FormField
          label="Restaurant Name"
          id="workspaceName"
          placeholder="Sora Sushi"
          error={errors.workspaceName?.message}
          disabled={isLoading}
          {...register('workspaceName')}
        />

        <PasswordField
          label="Password"
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
          Create Account
        </Button>
      </form>

      <div className="text-center pt-2">
        <span className="text-xs text-neutral-400">
          Already registered?{' '}
          <Link
            to="/restaurant-portal/login"
            className="font-bold text-[#e35205] hover:text-[#c94804]"
          >
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
};
export default SignupForm;
