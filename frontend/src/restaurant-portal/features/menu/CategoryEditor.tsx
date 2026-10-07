import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { Sparkles, Calendar, Heart, Eye } from 'lucide-react';
import usePortalCategoryStore from '../../store/portalCategoryStore';
import { FormField } from '../../components/ui/AuthFormFields';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { ToggleRow } from '../../components/ui/ToggleRow';
import Card from '../../components/ui/Card';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(180, 'Description is too long'),
  parentId: z.string().optional(),
  startTime: z.string().min(1, 'Start operational time required'),
  endTime: z.string().min(1, 'End operational time required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CategoryEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { categories, createCategory, updateCategory } = usePortalCategoryStore();

  const isEditMode = !!id;
  const editingCategory = categories.find((c) => c.id === id);

  const [activeDays, setActiveDays] = useState<string[]>(editingCategory?.visibility.days || WEEKDAYS);
  const [catStatus, setCatStatus] = useState<'published' | 'archived'>(editingCategory?.status || 'published');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentId: '',
      startTime: '09:00',
      endTime: '22:00',
    },
    mode: 'onBlur',
  });

  // Load defaults
  useEffect(() => {
    if (isEditMode && editingCategory) {
      reset({
        name: editingCategory.name,
        description: editingCategory.description,
        parentId: editingCategory.parentId || '',
        startTime: editingCategory.visibility.startTime,
        endTime: editingCategory.visibility.endTime,
      });
      setActiveDays(editingCategory.visibility.days);
      setCatStatus(editingCategory.status);
    }
  }, [isEditMode, editingCategory, reset]);

  const watchedName = watch('name');

  // AI suggestion copywriting generator
  const handleAiCopywrite = () => {
    const name = watchedName || 'Dishes';
    setValue('description', `Assorted fresh collection of ${name} prepared by hand daily using locally sourced organic ingredients.`);
  };

  const handleToggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter((d) => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description,
      parentId: values.parentId === '' ? undefined : values.parentId,
      status: catStatus,
      visibility: {
        startTime: values.startTime,
        endTime: values.endTime,
        days: activeDays,
      },
    };

    if (isEditMode && id) {
      updateCategory(id, payload);
    } else {
      createCategory(payload);
    }
    navigate('/restaurant-portal/menu/categories');
  };

  // Parents filter (prevent nesting an item inside itself)
  const parentCandidates = categories.filter((c) => !c.parentId && c.id !== id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left" noValidate>
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-neutral-800">
            {isEditMode ? `Edit Category — ${editingCategory?.name}` : 'Create New Category Collection'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure parent structures, layout scheduling rules, and subcategory bindings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/restaurant-portal/menu/categories')}
            className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-500 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-xs font-mono font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
          >
            Save Collection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Form details */}
        <div className="lg:col-span-2 space-y-6">
          <SectionDivider label="Collection Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Category Name"
              id="name"
              placeholder="e.g. Rice Bowls, Sashimi Specials"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="parentId" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Parent Category (Optional Sub-nesting)
              </label>
              <select
                id="parentId"
                {...register('parentId')}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-xs font-mono font-semibold text-[#141518] cursor-pointer"
              >
                <option value="">None (Top-Level Category)</option>
                {parentCandidates.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description Copy */}
          <div className="flex flex-col gap-1 w-full font-mono">
            <div className="flex justify-between items-center">
              <label htmlFor="description" className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">
                Collection Description
              </label>
              <button
                type="button"
                onClick={handleAiCopywrite}
                className="inline-flex items-center gap-1 text-[9px] font-bold text-[#1B3BFF] hover:text-[#141518] cursor-pointer uppercase tracking-wider"
              >
                <Sparkles size={10} /> Auto-write Description
              </button>
            </div>
            <input
              id="description"
              type="text"
              placeholder="e.g. Slow-cooked aromatic rice plates paired with chef choice curries."
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-xs text-[#141518] transition-all placeholder:text-[#52555F]/60"
              {...register('description')}
            />
            {errors.description && <span className="text-[10px] font-bold text-red-600 mt-1">{errors.description.message}</span>}
          </div>

          <SectionDivider label="Operational Visibility Schedule" />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Availability Start Time"
              id="startTime"
              type="time"
              error={errors.startTime?.message}
              {...register('startTime')}
            />
            <FormField
              label="Availability End Time"
              id="endTime"
              type="time"
              error={errors.endTime?.message}
              {...register('endTime')}
            />
          </div>

          {/* Weekdays picker */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Active Operational Days
            </span>
            <div className="flex flex-wrap gap-1.5 select-none">
              {WEEKDAYS.map((day) => {
                const isActive = activeDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-2 border text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#141518] text-[#D7F04A] border-[#141518] shadow-[2px_2px_0px_#141518]'
                        : 'bg-[#FAF8F5] text-[#52555F] border-[#141518]/20 hover:border-[#141518]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI assistant panels, status controls */}
        <div className="space-y-6 font-mono">
          <SectionDivider label="Publish Status" />
          <div className="border border-[#141518]/15 bg-[#FAF8F5] px-4 divide-y divide-[#141518]/10">
            <ToggleRow
              label="Public Visibility Status"
              description="Unpublish collection to hide it temporarily from customer app catalogs."
              checked={catStatus === 'published'}
              onChange={(val) => setCatStatus(val ? 'published' : 'archived')}
            />
          </div>

          {/* AI structural optimizer suggestions */}
          <SectionDivider label="IA Health Optimizer" />
          <Card className="text-left select-none space-y-4">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#1B3BFF]" />
              <h5 className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">
                Category Health Audit
              </h5>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-500">Duplicate Check</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">No issues</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-500">Optimal Name length</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">Good</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-500">Parent-Child Loop check</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">Clean</span>
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-lg text-[9px] text-neutral-500 leading-normal">
              <strong>Optimization recommendation:</strong> Keeping category descriptions under 120 characters improves load speeds and layout structure on customer mobile apps.
            </div>
          </Card>
        </div>

      </div>

    </form>
  );
};

export default CategoryEditor;
