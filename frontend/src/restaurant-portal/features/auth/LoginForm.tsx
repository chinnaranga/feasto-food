import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { FormField, PasswordField, CheckboxField } from '../../components/ui/AuthFormFields';
import Button from '../../components/ui/Button';
import { usePortalAuthStore } from '../../store/portalAuthStore';
import { zodResolver } from '../../utils/zodResolver';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
  preferredRole: z.enum(['Owner', 'Manager', 'Kitchen', 'Cashier', 'Finance', 'Staff']),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginMerchant, isLoading, error } = usePortalAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      preferredRole: 'Owner',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    await loginMerchant(data.email, data.preferredRole);
    navigate('/restaurant-portal/dashboard');
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-black text-neutral-900 tracking-tight">
          Sign in to merchant desk
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Enter your restaurant credentials to manage orders.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-[10px] font-bold text-red-600">
            {error}
          </div>
        )}

        <FormField
          label="Email address"
          id="email"
          type="email"
          placeholder="name@restaurant.com"
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <PasswordField
          label="Password"
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />

        {/* Access Role Presets Selector (for merchant sandbox test purposes) */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="preferredRole" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Simulate Merchant Role
          </label>
          <select
            id="preferredRole"
            className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 rounded-lg text-xs font-bold text-neutral-800 transition-all duration-200 cursor-pointer"
            {...register('preferredRole')}
          >
            <option value="Owner">Owner (Manage All)</option>
            <option value="Manager">Manager (Menus & Staff)</option>
            <option value="Finance">Finance (Analytics & Sales)</option>
            <option value="Kitchen">Kitchen (Orders Monitor)</option>
            <option value="Cashier">Cashier (Orders Fulfill)</option>
            <option value="Staff">Staff (Read Only Dashboard)</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs select-none">
          <CheckboxField
            label="Remember me"
            id="rememberMe"
            {...register('rememberMe')}
          />
          <Link
            to="/restaurant-portal/forgot-password"
            className="text-xs font-bold text-[#e35205] hover:text-[#c94804]"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center pt-2">
        <span className="text-xs text-neutral-400">
          New restaurant brand?{' '}
          <Link
            to="/restaurant-portal/signup"
            className="font-bold text-[#e35205] hover:text-[#c94804]"
          >
            Create account
          </Link>
        </span>
      </div>
    </div>
  );
};
export default LoginForm;
