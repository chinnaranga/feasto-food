import React, { useEffect } from 'react';
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

const signInSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type SignInFields = z.infer<typeof signInSchema>;

function mapAuthError(err: any): string {
  const status = err?.status || err?.statusCode;
  const message = err?.message || '';

  if (status === 401 || message.includes('Invalid credentials') || message.includes('password')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (status === 403 || message.includes('suspended') || message.includes('banned')) {
    return 'Your account has been suspended. Contact support for assistance.';
  }
  if (status === 403 && message.includes('verified')) {
    return 'Please verify your email before signing in.';
  }
  if (status === 429) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  if (status >= 500) {
    return 'A server error occurred. Please try again later.';
  }
  if (!navigator.onLine || err?.name === 'NetworkError') {
    return 'Unable to connect to Feasto services. Please try again.';
  }
  return message || 'Sign in failed. Please try again.';
}

export const SignIn: React.FC = () => {
  const { signIn, isLoading, rememberedEmailOrPhone, setRememberedEmailOrPhone } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Validate returnTo internal application paths (no open redirects)
  const rawReturnTo = searchParams.get('returnTo') || useAuthStore.getState().redirectPath;
  const safeReturnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//')
    ? rawReturnTo
    : '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (rememberedEmailOrPhone) {
      setValue('email', rememberedEmailOrPhone);
      setValue('rememberMe', true);
    }
  }, [rememberedEmailOrPhone, setValue]);

  const onSubmit = async (data: SignInFields) => {
    if (data.rememberMe) {
      setRememberedEmailOrPhone(data.email);
    } else {
      setRememberedEmailOrPhone(null);
    }

    try {
      await signIn(data.email, data.password);
      addToast({ message: 'Welcome back to Feasto!', type: 'success' });
      navigate(safeReturnTo);
    } catch (err: any) {
      addToast({ message: mapAuthError(err), type: 'error' });
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col text-left select-none">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1B3BFF] block mb-1">
          PASSPORT VERIFICATION
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#141518] tracking-tight uppercase mb-2">
          SIGN IN
        </h2>
        <p className="text-xs text-[#52555F] leading-relaxed mb-6 font-sans">
          Synchronize your live order bag, delivery radar, and saved kitchen coordinates.
        </p>

        <GoogleSignInButton label="Continue with Google" returnTo={safeReturnTo} />

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#141518]/20" />
          </div>
          <span className="relative px-3 bg-white text-[10px] font-mono font-bold text-[#70727D] uppercase tracking-wider">
            OR WITH CREDENTIALS
          </span>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={isLoading}
            {...register('email')}
          />

          <PasswordField
            label="Passphrase"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-xs select-none pt-1">
            <Checkbox label="Remember device" disabled={isLoading} {...register('rememberMe')} />
            <Link
              to="/auth/forgot-password"
              className="font-mono text-xs text-[#52555F] hover:text-[#141518] underline"
            >
              Reset Key?
            </Link>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-full justify-center font-mono font-bold mt-3 py-4 text-xs tracking-widest uppercase"
          >
            {isLoading ? 'AUTHENTICATING...' : 'ENTER FEASTO →'}
          </Button>
        </form>

        <div className="pt-6 mt-6 border-t border-[#141518]/15 text-center">
          <p className="font-mono text-xs text-[#52555F]">
            FIRST TIME AT FEASTO?{' '}
            <Link
              to={`/auth/signup${safeReturnTo !== '/' ? `?returnTo=${encodeURIComponent(safeReturnTo)}` : ''}`}
              className="text-[#141518] hover:text-[#1B3BFF] font-bold underline"
            >
              CREATE PASSPORT →
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
