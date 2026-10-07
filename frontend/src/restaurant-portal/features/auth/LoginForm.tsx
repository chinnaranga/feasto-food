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
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
          [01 / MERCHANTS]
        </span>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
          SIGN IN TO STUDIO
        </h2>
        <p className="font-sans text-xs text-[#52555F] mt-1">
          Enter verified merchant credentials to access kitchen and dispatch terminals.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs font-mono font-bold text-red-700">
            ⚠ {error}
          </div>
        )}

        <FormField
          label="Email address"
          id="email"
          type="email"
          placeholder="chef@restaurant.com"
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
        <div className="flex flex-col gap-1 w-full text-left">
          <label htmlFor="preferredRole" className="text-[10px] font-mono font-bold text-[#141518] uppercase tracking-wider">
            Simulate Merchant Role
          </label>
          <select
            id="preferredRole"
            className="w-full px-3 py-2.5 bg-white border border-[#141518]/20 focus:border-[#141518] focus:ring-1 focus:ring-[#141518] text-xs font-mono font-bold text-[#141518] transition-all duration-150 cursor-pointer"
            {...register('preferredRole')}
          >
            <option value="Owner">Owner (All Stations & Financials)</option>
            <option value="Manager">Manager (Menus, Catalog & Staff)</option>
            <option value="Finance">Finance (Settlements & Velocity)</option>
            <option value="Kitchen">Kitchen (Hearth & KDS Line)</option>
            <option value="Cashier">Cashier (POS & Pass Dispatch)</option>
            <option value="Staff">Staff (Read-Only Terminal)</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs select-none">
          <CheckboxField
            label="Remember this terminal"
            id="rememberMe"
            {...register('rememberMe')}
          />
          <Link
            to="/restaurant-portal/forgot-password"
            className="font-mono text-xs font-bold text-[#1B3BFF] hover:underline"
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
          ENTER KITCHEN STUDIO →
        </Button>
      </form>

      <div className="text-center pt-3 border-t border-[#141518]/10">
        <span className="font-mono text-xs text-[#52555F]">
          New restaurant brand?{' '}
          <Link
            to="/restaurant-portal/signup"
            className="font-bold text-[#141518] underline hover:text-[#1B3BFF]"
          >
            Create merchant account
          </Link>
        </span>
      </div>
    </div>
  );
};
export default LoginForm;
