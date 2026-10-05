import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@/utils/zodResolver';
import { Upload, X, CheckCircle, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useSupportStore } from '@/store/supportStore';
import { useUserStore } from '@/store/userStore';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

const ticketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  orderRef: z.string().optional(),
  description: z.string().min(15, 'Description must be at least 15 characters'),
});

type TicketFields = z.infer<typeof ticketSchema>;

export const ContactSupportForm: React.FC = () => {
  const trackEvent = useTrackEvent();
  const navigate = useNavigate();
  const location = useLocation();
  const { submitTicket } = useSupportStore();
  const { pastOrders, activeOrders } = useUserStore();

  const queryParams = new URLSearchParams(location.search);
  const orderIdParam = queryParams.get('orderId') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFields>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      category: orderIdParam ? 'Order Issues' : '',
      orderRef: orderIdParam,
      description: '',
    },
  });

  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'Order Issues', label: 'Order Issues (Late, Missing Items)' },
    { value: 'Payments & Billing', label: 'Payments & Billing (Failed Transaction, Charges)' },
    { value: 'Refunds & Cancellations', label: 'Refunds & Cancellations' },
    { value: 'Account & Security', label: 'Account & Security Preferences' },
    { value: 'General Inquiry', label: 'General Inquiry / Feedback' },
  ];

  // Combine active and past orders for selector
  const allOrders = [...activeOrders, ...pastOrders];
  const orderOptions = [
    { value: '', label: 'None / Not order related' },
    ...allOrders.map((o) => ({
      value: o.id,
      label: `${o.id} - ${o.restaurantName} (₹${o.total})`,
    })),
  ];

  const onSubmit = async (data: TicketFields) => {
    setIsSubmitting(true);
    // Simulate API submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const id = submitTicket({
      subject: data.subject,
      category: data.category,
      orderRef: data.orderRef || undefined,
      description: data.description,
    });
    
    trackEvent('settings_updated', {
      section: 'account',
      settingKey: 'support_ticket_created',
      newValue: { ticketId: id, category: data.category },
    });
    
    setSubmittedId(id);
    setIsSubmitting(false);
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setAttachedFile({
        name: file.name,
        size: `${sizeInMB} MB`,
      });
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  if (submittedId) {
    return (
      <div className="bg-primary-bg border border-border-main rounded-3xl p-8 max-w-lg mx-auto text-center shadow-soft animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-success-main/10 text-success-main rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} />
        </div>
        <h2 className="font-extrabold text-xl text-text-primary mb-2 font-heading tracking-tight">
          Support Ticket Created
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          Your ticket <strong className="text-text-primary">#{submittedId}</strong> has been successfully registered. Feasto's Smart Router has analyzed your query and assigned it to our support specialist.
        </p>
        <div className="bg-secondary-bg/50 border border-border-main rounded-2xl p-4 mb-8 text-left text-xs text-text-secondary leading-relaxed flex flex-col gap-2">
          <div className="flex justify-between border-b border-border-main/50 pb-2">
            <span className="font-semibold text-text-primary">Ticket ID:</span>
            <span>#{submittedId}</span>
          </div>
          <div className="flex justify-between border-b border-border-main/50 pb-2">
            <span className="font-semibold text-text-primary">Status:</span>
            <span className="text-success-main font-bold">Open (Pending Review)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-text-primary">Est. Response Time:</span>
            <span className="font-bold text-text-primary">&lt; 15 minutes</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/support')}
            className="rounded-xl text-xs font-bold px-6 py-3"
          >
            Go to Help Center
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSubmittedId(null);
              setAttachedFile(null);
            }}
            className="rounded-xl text-xs font-bold px-6 py-3 border border-border-main"
          >
            Submit Another Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-primary-bg border border-border-main rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-soft flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-border-main/50 pb-5">
        <button
          type="button"
          onClick={() => navigate('/support')}
          className="p-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-secondary-bg transition-main cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="text-left">
          <h2 className="font-extrabold text-base text-text-primary font-heading tracking-tight">
            Create Support Ticket
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Describe your issue and we will guide you to a resolution.
          </p>
        </div>
      </div>

      {/* Subject */}
      <Input
        label="Subject / Short Summary"
        placeholder="Brief description of the problem (e.g. Missing refund, late delivery)"
        error={errors.subject?.message}
        {...register('subject')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <Select
          label="Category"
          options={categories}
          error={errors.category?.message}
          {...register('category')}
        />

        {/* Order Reference */}
        <Select
          label="Related Order (Optional)"
          options={orderOptions}
          error={errors.orderRef?.message}
          {...register('orderRef')}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Detailed Description"
        placeholder="Please describe your issue in detail. Include any relevant details that can help us resolve your issue faster."
        error={errors.description?.message}
        helperText="Minimum 15 characters required."
        rows={4}
        {...register('description')}
      />

      {/* File Upload (Mock Drag-n-Drop) */}
      <div className="flex flex-col gap-2 text-left">
        <label className="text-xs font-semibold text-text-primary tracking-wide">
          Attachments (Receipts, Screenshots)
        </label>
        {attachedFile ? (
          <div className="flex items-center gap-3 p-4 bg-secondary-bg border border-border-main rounded-xl">
            <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
              <FileText size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text-primary truncate">{attachedFile.name}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{attachedFile.size}</p>
            </div>
            <button
              type="button"
              onClick={removeAttachedFile}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-primary-bg rounded-lg border border-border-main/50 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-border-main hover:border-brand-orange/30 hover:bg-brand-orange/[0.01] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleMockFileUpload}
            />
            <div className="p-2.5 bg-secondary-bg text-text-secondary rounded-xl">
              <Upload size={18} />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-text-primary">Click to upload or drag files</p>
              <p className="text-[10px] text-text-muted mt-0.5">PNG, JPG, PDF up to 5MB</p>
            </div>
          </label>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-border-main/50 pt-5 mt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/support')}
          className="rounded-xl text-xs font-bold px-6 py-2.5 border border-border-main"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="rounded-xl text-xs font-bold px-8 py-2.5 flex items-center gap-2 min-w-[140px] justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Ticket</span>
          )}
        </Button>
      </div>
    </form>
  );
};
