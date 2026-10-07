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
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#15803D] block">
            ✓ RECOVERY DISPATCHED
          </span>
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
            CHECK YOUR INBOX
          </h2>
          <p className="font-sans text-xs text-[#52555F] mt-1">
            We sent an authenticated recovery link to your merchant email. Please verify within 15 minutes.
          </p>
        </div>
        <Link to="/restaurant-portal/login" className="block mt-4">
          <Button variant="outline" className="w-full">
            RETURN TO SIGN IN →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
          [03 / RECOVERY]
        </span>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518] mt-1">
          RECOVER TERMINAL ACCESS
        </h2>
        <p className="font-sans text-xs text-[#52555F] mt-1">
          Enter your registered merchant email to receive secure recovery instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Merchant Email address"
          id="email"
          type="email"
          placeholder="chef@restaurant.com"
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
          DISPATCH RECOVERY LINK →
        </Button>
      </form>

      <div className="text-center pt-3 border-t border-[#141518]/10">
        <Link
          to="/restaurant-portal/login"
          className="font-mono text-xs font-bold text-[#141518] underline hover:text-[#1B3BFF]"
        >
          ← Return to merchant sign in
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordForm;
