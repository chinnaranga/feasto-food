import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import usePortalCustomerStore, { Customer } from '../../store/portalCustomerStore';
import Card from '../../components/ui/Card';
import { FormField } from '../../components/ui/AuthFormFields';
import { Sparkles, Save, X } from 'lucide-react';

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  preferredBranch: string;
  preferredCuisine: string;
  favoriteItemsString: string; // Comma separated items
  averageSpend: number;
  visitFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Rarely';
  loyaltyStatus: 'VIP' | 'Regular' | 'New' | 'Dormant';
  tagsString: string; // Comma separated tags
  emailConsent: boolean;
  smsConsent: boolean;
  whatsappConsent: boolean;
  preferredWindow: string;
  timezone: string;
  language: string;
}

export const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { customers, createCustomer, updateCustomer } = usePortalCustomerStore();

  const isEditMode = !!id;
  const existingCustomer = customers.find((c) => c.id === id);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CustomerFormData>();

  // Load existing profile details
  useEffect(() => {
    if (isEditMode && existingCustomer) {
      setValue('name', existingCustomer.name);
      setValue('phone', existingCustomer.phone);
      setValue('email', existingCustomer.email);
      setValue('preferredBranch', existingCustomer.preferredBranch);
      setValue('preferredCuisine', existingCustomer.preferredCuisine);
      setValue('favoriteItemsString', existingCustomer.favoriteItems.join(', '));
      setValue('averageSpend', existingCustomer.averageSpend);
      setValue('visitFrequency', existingCustomer.visitFrequency);
      setValue('loyaltyStatus', existingCustomer.loyaltyStatus);
      setValue('tagsString', existingCustomer.tags.join(', '));
      setValue('emailConsent', existingCustomer.consent.email);
      setValue('smsConsent', existingCustomer.consent.sms);
      setValue('whatsappConsent', existingCustomer.consent.whatsapp);
      setValue('preferredWindow', existingCustomer.outreach.preferredWindow);
      setValue('timezone', existingCustomer.outreach.timezone);
      setValue('language', existingCustomer.outreach.language);
    } else {
      // Set defaults for new customer
      setValue('preferredBranch', 'Downtown Flagship');
      setValue('preferredCuisine', 'Continental');
      setValue('visitFrequency', 'Weekly');
      setValue('loyaltyStatus', 'New');
      setValue('emailConsent', true);
      setValue('smsConsent', true);
      setValue('whatsappConsent', false);
      setValue('preferredWindow', '18:00 - 20:00');
      setValue('timezone', 'IST');
      setValue('language', 'English');
    }
  }, [id, existingCustomer, isEditMode, setValue]);

  const onSubmit = (data: CustomerFormData) => {
    const favoriteItems = data.favoriteItemsString
      ? data.favoriteItemsString.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
    const tags = data.tagsString
      ? data.tagsString.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

    const customerPayload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      preferredBranch: data.preferredBranch,
      preferredCuisine: data.preferredCuisine,
      lastVisit: existingCustomer?.lastVisit || new Date().toISOString().split('T')[0],
      favoriteItems,
      averageSpend: Number(data.averageSpend),
      visitFrequency: data.visitFrequency,
      loyaltyStatus: data.loyaltyStatus,
      tags,
      consent: {
        email: data.emailConsent,
        sms: data.smsConsent,
        whatsapp: data.whatsappConsent,
      },
      outreach: {
        preferredWindow: data.preferredWindow,
        timezone: data.timezone,
        language: data.language,
      }
    };

    if (isEditMode && existingCustomer) {
      updateCustomer(existingCustomer.id, customerPayload);
    } else {
      createCustomer(customerPayload);
    }

    navigate('/restaurant-portal/customers');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left select-none pb-12">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
        <div>
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-heading">
            {isEditMode ? 'Modify Guest Record' : 'Enroll New Guest Profile'}
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure contact parameters, preferences, tags, and consent status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Core Profile Card */}
        <Card className="p-5 space-y-4">
          <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider font-heading">Primary Contact Parameters</h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Guest Full Name"
              id="name"
              placeholder="e.g. Rohan Mehta"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />

            <FormField
              label="Secure Email Address"
              id="email"
              type="email"
              placeholder="e.g. rohan.mehta@gmail.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/, message: 'Please enter a valid email' }
              })}
            />

            <FormField
              label="Mobile Number"
              id="phone"
              placeholder="e.g. 9876543210"
              error={errors.phone?.message}
              {...register('phone', { required: 'Mobile number is required' })}
            />

            <FormField
              label="Average Ticket Spend (₹)"
              id="averageSpend"
              type="number"
              placeholder="e.g. 2400"
              error={errors.averageSpend?.message}
              {...register('averageSpend', { required: 'Average ticket is required' })}
            />
          </div>
        </Card>

        {/* Preference Settings */}
        <Card className="p-5 space-y-4">
          <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider font-heading">Dining & Loyalty Profile</h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Preferred Branch</label>
              <select
                {...register('preferredBranch')}
                className="w-full text-xs font-semibold p-2 border border-neutral-250 rounded-xl focus:outline-hidden focus:border-[#e35205]/45 cursor-pointer bg-white"
              >
                <option value="Downtown Flagship">Downtown Flagship</option>
                <option value="Suburbs Cloud Kitchen">Suburbs Cloud Kitchen</option>
              </select>
            </div>

            <FormField
              label="Primary Cuisine Preference"
              id="preferredCuisine"
              placeholder="e.g. Japanese Fusion"
              error={errors.preferredCuisine?.message}
              {...register('preferredCuisine', { required: 'Cuisine is required' })}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Loyalty Tier Status</label>
              <select
                {...register('loyaltyStatus')}
                className="w-full text-xs font-semibold p-2 border border-neutral-250 rounded-xl focus:outline-hidden focus:border-[#e35205]/45 cursor-pointer bg-white"
              >
                <option value="VIP">VIP</option>
                <option value="Regular">Regular</option>
                <option value="New">New</option>
                <option value="Dormant">Dormant</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Visit Frequency Profile</label>
              <select
                {...register('visitFrequency')}
                className="w-full text-xs font-semibold p-2 border border-neutral-250 rounded-xl focus:outline-hidden focus:border-[#e35205]/45 cursor-pointer bg-white"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Rarely">Rarely</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <FormField
                label="Favorite Menu Items (Comma separated)"
                id="favoriteItemsString"
                placeholder="e.g. Tuna Nigiri, Spicy Salmon Roll, Truffle Edamame"
                {...register('favoriteItemsString')}
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <FormField
                label="Relationship & Segment Tags (Comma separated)"
                id="tagsString"
                placeholder="e.g. Regular, Wine Lover, Weekend Diners"
                {...register('tagsString')}
              />
            </div>

          </div>
        </Card>

        {/* Outreach & Consent */}
        <Card className="p-5 space-y-4">
          <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider font-heading">Marketing & Outreach Consent</h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <FormField
              label="Preferred Contact Time window"
              id="preferredWindow"
              placeholder="e.g. 18:00 - 20:00"
              {...register('preferredWindow')}
            />

            <FormField
              label="Outreach Language"
              id="language"
              placeholder="e.g. English"
              {...register('language')}
            />

            {/* Checkbox Consent list */}
            <div className="col-span-1 sm:col-span-2 space-y-2 border-t border-neutral-100 pt-3">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Communication Channel Opt-ins</span>
              
              <div className="flex gap-4 text-xs font-semibold text-neutral-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('emailConsent')}
                    className="rounded border-neutral-350 text-[#e35205] focus:ring-[#e35205] w-4 h-4 cursor-pointer"
                  />
                  <span>Email Outreach</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('smsConsent')}
                    className="rounded border-neutral-350 text-[#e35205] focus:ring-[#e35205] w-4 h-4 cursor-pointer"
                  />
                  <span>SMS Alerts</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('whatsappConsent')}
                    className="rounded border-neutral-350 text-[#e35205] focus:ring-[#e35205] w-4 h-4 cursor-pointer"
                  />
                  <span>WhatsApp Chat</span>
                </label>
              </div>
            </div>

          </div>
        </Card>

        {/* Submit row */}
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/restaurant-portal/customers')}
            className="px-4 py-2 border border-neutral-250 hover:bg-neutral-100 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Save size={14} />
            <span>Save Profile</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default CustomerForm;
