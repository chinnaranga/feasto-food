import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@/utils/zodResolver';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordField } from '@/components/auth/PasswordField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name must not exceed 100 characters'),
    email: z.string().min(1, 'Email address is required').email('Invalid email address format'),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[6-9]\d{9}$/.test(val.replace(/\s+/g, '')), {
        message: 'Enter a valid 10-digit mobile number',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must not exceed 128 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    consent: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms to proceed',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFields = z.infer<typeof signUpSchema>;

function mapRegistrationError(err: any): string {
  const status = err?.status || err?.statusCode;
  const message = err?.message || '';

  if (status === 409 || message.includes('already exists') || message.includes('registered')) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (status === 422 || status === 400) {
    return err?.details?.message || message || 'Invalid details provided.';
  }
  if (status >= 500) {
    return 'A server error occurred. Please try again later.';
  }
  if (!navigator.onLine || err?.name === 'NetworkError') {
    return 'Unable to connect to Feasto services. Please try again.';
  }
  return message || 'Registration failed. Please try again.';
}

export const SignUp: React.FC = () => {
  const { registerUser, isLoading } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Validate returnTo
  const rawReturnTo = searchParams.get('returnTo') || useAuthStore.getState().redirectPath;
  const safeReturnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//')
    ? rawReturnTo
    : '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      consent: false,
    },
  });

  const onSubmit = async (data: SignUpFields) => {
    try {
      await registerUser({
        name: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
        role: 'customer',
      });
      addToast({ message: 'Welcome to Feasto! Account created.', type: 'success' });
      navigate(safeReturnTo);
    } catch (err: any) {
      addToast({ message: mapRegistrationError(err), type: 'error' });
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col text-left select-none">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1B3BFF] block mb-1">
          NEW CULINARY PASSPORT
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#141518] tracking-tight uppercase mb-2">
          JOIN FEASTO
        </h2>
        <p className="text-xs text-[#52555F] leading-relaxed mb-6 font-sans">
          Create your dining identity to discover artisanal kitchens, track live couriers, and explore taste stories.
        </p>

        <GoogleSignInButton label="Sign up with Google" returnTo={safeReturnTo} />

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#141518]/20" />
          </div>
          <span className="relative px-3 bg-white text-[10px] font-mono font-bold text-[#70727D] uppercase tracking-wider">
            OR COMPLETE CREDENTIALS
          </span>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Ranga Rao"
            error={errors.fullName?.message}
            disabled={isLoading}
            {...register('fullName')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={isLoading}
            {...register('email')}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+91 98201 44821"
            error={errors.phone?.message}
            disabled={isLoading}
            {...register('phone')}
          />

          <PasswordField
            label="Passphrase"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
            helperText="Minimum 8 characters."
          />

          <PasswordField
            label="Confirm Passphrase"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            {...register('confirmPassword')}
          />

          <div className="pt-1">
            <Checkbox
              label="I agree to Feasto Terms of Service and Privacy Policy"
              error={errors.consent?.message}
              disabled={isLoading}
              {...register('consent')}
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-full justify-center font-mono font-bold mt-3 py-4 text-xs tracking-widest uppercase"
          >
            {isLoading ? 'GENERATING PASSPORT...' : 'INITIALIZE PASSPORT →'}
          </Button>
        </form>

        <div className="pt-6 mt-6 border-t border-[#141518]/15 text-center">
          <p className="font-mono text-xs text-[#52555F]">
            ALREADY REGISTERED?{' '}
            <Link
              to={`/auth/signin${safeReturnTo !== '/' ? `?returnTo=${encodeURIComponent(safeReturnTo)}` : ''}`}
              className="text-[#141518] hover:text-[#1B3BFF] font-bold underline"
            >
              SIGN IN HERE →
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
