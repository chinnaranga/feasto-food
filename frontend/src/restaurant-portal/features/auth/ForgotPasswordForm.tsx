import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { FormField } from '../../components/ui/AuthFormFields';
import Button from '../../components/ui/Button';
import { zodResolver } from '../../utils/zodResolver';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotSchemaType = z.infer<typeof forgotSchema>;

export const ForgotPasswordForm: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotSchemaType>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (_data: ForgotSchemaType) => {
    setIsLoading(true);
    try {
      // Simulate dispatching link
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
            Reset Link Dispatched
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            We sent a secure password reset link to your email. Please check your inbox or spam folder.
          </p>
        </div>
        <Link to="/restaurant-portal/login">
          <Button variant="outline" className="w-full mt-4">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-black text-neutral-900 tracking-tight">
          Forgot Password
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Enter your email and we'll dispatch a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email address"
          id="email"
          type="email"
          placeholder="name@restaurant.com"
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          to="/restaurant-portal/login"
          className="text-xs font-bold text-[#e35205] hover:text-[#c94804]"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordForm;
