import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import {
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Heart,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import usePortalMenuStore from '../../store/portalMenuStore';
import type { MenuItem } from '../../store/portalMenuStore';
import { FormField, FormError } from '../../components/ui/AuthFormFields';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { ToggleRow } from '../../components/ui/ToggleRow';
import { UploadPlaceholder } from '../../components/ui/UploadPlaceholder';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const menuItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(300, 'Description is too long'),
  category: z.string().min(1, 'Please select a category'),
  subcategory: z.string().min(2, 'Please enter a subcategory'),
  basePrice: z.coerce.number().min(1, 'Base price must be greater than 0'),
  discountPrice: z.coerce.number().optional(),
  packagingCharge: z.coerce.number().min(0, 'Packaging charge cannot be negative'),
  dietary: z.enum(['veg', 'non-veg', 'vegan', 'jain', 'halal']),
  calories: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  carbs: z.coerce.number().min(0),
  fat: z.coerce.number().min(0),
  allergensInput: z.string().optional(),
  tagsInput: z.string().optional(),
  variants: z.array(
    z.object({
      label: z.string().min(1, 'Label required'),
      priceAdjustment: z.coerce.number(),
      available: z.boolean(),
    })
  ),
  addons: z.array(
    z.object({
      name: z.string().min(1, 'Name required'),
      price: z.coerce.number().min(0, 'Price modifier must be >= 0'),
      available: z.boolean(),
    })
  ),
}).refine((data) => {
  if (data.discountPrice !== undefined && data.discountPrice > 0) {
    return data.discountPrice < data.basePrice;
  }
  return true;
}, {
  message: 'Discount price must be less than the base price',
  path: ['discountPrice'],
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

const CATEGORY_OPTIONS = ['Starters', 'Mains', 'Desserts', 'Beverages'] as const;
const DIETARY_OPTIONS = [
  { value: 'veg', label: 'Veg (Vegetarian)' },
  { value: 'non-veg', label: 'Non-Veg (Contains Meat/Egg)' },
  { value: 'vegan', label: 'Vegan (Strict Plant-based)' },
  { value: 'jain', label: 'Jain (No Root Veggies)' },
  { value: 'halal', label: 'Halal Certified' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export const MenuEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { items, createMenuItem, updateMenuItem } = usePortalMenuStore();

  const isEditMode = !!id;
  const editingItem = items.find((item) => item.id === id);

  // Active Tab: details, pricing, variants, dietary, availability
  const [activeFormTab, setActiveFormTab] = useState<'details' | 'pricing' | 'variants' | 'dietary'>('details');

  // Local image list state
  const [imageList, setImageList] = useState<string[]>(editingItem?.images || []);

  // AI assistant tools
  const [foodCostInput, setFoodCostInput] = useState<number | ''>('');
  const [targetMargin, setTargetMargin] = useState<number>(70);
  const [aiPriceSuggestion, setAiPriceSuggestion] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Mains',
      subcategory: '',
      basePrice: 0,
      packagingCharge: 0,
      dietary: 'veg',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      allergensInput: '',
      tagsInput: '',
      variants: [],
      addons: [],
    },
    mode: 'onBlur',
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  const { fields: addonFields, append: appendAddon, remove: removeAddon } = useFieldArray({
    control,
    name: 'addons',
  });

  // Pre-populate if editing
  useEffect(() => {
    if (isEditMode && editingItem) {
      reset({
        name: editingItem.name,
        description: editingItem.description,
        category: editingItem.category,
        subcategory: editingItem.subcategory,
        basePrice: editingItem.basePrice,
        discountPrice: editingItem.discountPrice,
        packagingCharge: editingItem.packagingCharge,
        dietary: editingItem.dietary,
        calories: editingItem.calories,
        protein: editingItem.protein,
        carbs: editingItem.carbs,
        fat: editingItem.fat,
        allergensInput: editingItem.allergens.join(', '),
        tagsInput: editingItem.tags.join(', '),
        variants: editingItem.variants,
        addons: editingItem.addons,
      });
      setImageList(editingItem.images);
    }
  }, [isEditMode, editingItem, reset]);

  // Sync pricing suggestion
  useEffect(() => {
    if (foodCostInput !== '' && foodCostInput > 0) {
      const suggested = Math.round(foodCostInput / (1 - targetMargin / 100));
      setAiPriceSuggestion(suggested);
    } else {
      setAiPriceSuggestion(null);
    }
  }, [foodCostInput, targetMargin]);

  const watched = watch();

  // AI Description Copywriter
  const handleAiCopywrite = () => {
    const itemName = watched.name || 'Dish';
    const itemCat = watched.category || 'Mains';
    const subcat = watched.subcategory || 'Specialty';
    setValue('description', `Freshly prepared ${itemName}, a classic ${itemCat} signature of ${subcat}. Expertly seasoned, plated with chef accents, and packed with premium natural ingredients.`);
  };

  // AI Allergen tagging
  const handleAiTagging = () => {
    const desc = (watched.description || '').toLowerCase();
    const allergens: string[] = [];
    if (desc.includes('milk') || desc.includes('cheese') || desc.includes('dairy')) allergens.push('Dairy');
    if (desc.includes('soy') || desc.includes('tofu')) allergens.push('Soy');
    if (desc.includes('fish') || desc.includes('salmon')) allergens.push('Fish');
    if (desc.includes('wheat') || desc.includes('flour') || desc.includes('bread')) allergens.push('Wheat');
    if (desc.includes('peanut') || desc.includes('almond') || desc.includes('nut')) allergens.push('Nuts');
    setValue('allergensInput', allergens.join(', '));
  };

  const onSubmit = (values: MenuItemFormValues) => {
    const cleanAllergens = (values.allergensInput ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const cleanTags = (values.tagsInput ?? '').split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: values.name,
      description: values.description,
      category: values.category,
      subcategory: values.subcategory,
      basePrice: values.basePrice,
      discountPrice: values.discountPrice || undefined,
      packagingCharge: values.packagingCharge,
      status: editingItem?.status || 'draft',
      dietary: values.dietary,
      calories: values.calories,
      protein: values.protein,
      carbs: values.carbs,
      fat: values.fat,
      allergens: cleanAllergens,
      tags: cleanTags,
      images: imageList,
      primaryImage: imageList[0],
      variants: values.variants.map((v, i) => ({ id: `v-${i}-${Date.now()}`, ...v })),
      addons: values.addons.map((a, i) => ({ id: `a-${i}-${Date.now()}`, ...a })),
      availability: editingItem?.availability || {
        breakfast: false,
        lunch: true,
        dinner: true,
        lateNight: false,
        weekdays: true,
        weekends: true,
        tempDisabled: false,
      },
    };

    if (isEditMode && id) {
      updateMenuItem(id, payload);
    } else {
      createMenuItem(payload);
    }
    navigate('/restaurant-portal/menu');
  };

  const formTabs = [
    { value: 'details', label: '1. Identity & Info' },
    { value: 'pricing', label: '2. Pricing Model' },
    { value: 'variants', label: '3. Customizations' },
    { value: 'dietary', label: '4. Diet & Nutrition' },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left" noValidate>
      
      {/* Editor Section Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-neutral-800">
            {isEditMode ? `Edit Catalog Details — ${editingItem?.name}` : 'Register New Catalog Item'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure metadata parameters, custom pricing variations, and channel availability toggles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/restaurant-portal/menu')}
            className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-500 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Save Item Details
          </button>
        </div>
      </div>

      {/* Editor Tab selector */}
      <div className="flex border-b border-neutral-200 overflow-x-auto select-none no-scrollbar py-0.5">
        {formTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveFormTab(tab.value)}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
              activeFormTab === tab.value
                ? 'border-[#e35205] text-neutral-800 font-black'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: Core Details ──────────────────────────────────────────────── */}
      {activeFormTab === 'details' && (
        <div className="space-y-6">
          <SectionDivider label="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Item Name"
              id="name"
              placeholder="e.g. Spicy Salmon Tempura Roll"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Category selector */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="category" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Menu Category
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <FormField
                label="Subcategory / Section"
                id="subcategory"
                placeholder="e.g. Sushi Rolls"
                error={errors.subcategory?.message}
                {...register('subcategory')}
              />
            </div>
          </div>

          {/* Description + Copywriter */}
          <div className="flex flex-col gap-1 w-full relative">
            <div className="flex justify-between items-center">
              <label htmlFor="description" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Dish Description
              </label>
              <button
                type="button"
                onClick={handleAiCopywrite}
                className="inline-flex items-center gap-1 text-[9px] font-bold text-[#e35205] hover:text-[#c94804] cursor-pointer"
              >
                <Sparkles size={10} /> Auto-write Description
              </button>
            </div>
            <textarea
              id="description"
              rows={4}
              placeholder="Provide a delicious description of your dish to entice customers. Include key ingredients."
              className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs text-neutral-800 resize-none transition-all duration-150"
              {...register('description')}
            />
            {errors.description && <FormError message={errors.description.message} />}
          </div>

          <SectionDivider label="Catalog Tags & Search Metadata" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Item Tags"
              id="tagsInput"
              placeholder="e.g. Best Seller, Signature, Spicy, Gluten Free"
              hint="Comma separated values used for tag badges"
              {...register('tagsInput')}
            />
            <FormField
              label="Allergens Warnings"
              id="allergensInput"
              placeholder="e.g. Fish, Dairy, Wheat, Sesame"
              hint="Comma separated values displayed on customer app"
              {...register('allergensInput')}
            />
          </div>

          {/* Media upload grid */}
          <SectionDivider label="Image Gallery" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-start">
            <UploadPlaceholder
              label="Primary Dish Image"
              hint="Square format recommended"
              aspectRatio="square"
              previewUrl={imageList[0]}
              onUpload={(url) => setImageList([url, ...imageList.slice(1)])}
              onClear={() => setImageList(['', ...imageList.slice(1)])}
            />
            <UploadPlaceholder
              label="Gallery Image 2"
              aspectRatio="square"
              previewUrl={imageList[1]}
              onUpload={(url) => {
                const list = [...imageList];
                list[1] = url;
                setImageList(list);
              }}
              onClear={() => {
                const list = [...imageList];
                list[1] = '';
                setImageList(list);
              }}
            />
            <UploadPlaceholder
              label="Gallery Image 3"
              aspectRatio="square"
              previewUrl={imageList[2]}
              onUpload={(url) => {
                const list = [...imageList];
                list[2] = url;
                setImageList(list);
              }}
              onClear={() => {
                const list = [...imageList];
                list[2] = '';
                setImageList(list);
              }}
            />
          </div>
        </div>
      )}

      {/* ─── TAB 2: Pricing Models ────────────────────────────────────────────── */}
      {activeFormTab === 'pricing' && (
        <div className="space-y-6">
          <SectionDivider label="Base Catalog Rates" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Base Price (INR)"
              id="basePrice"
              type="number"
              placeholder="e.g. 450"
              error={errors.basePrice?.message}
              {...register('basePrice')}
            />
            <FormField
              label="Discounted Price (INR)"
              id="discountPrice"
              type="number"
              placeholder="e.g. 390"
              error={errors.discountPrice?.message}
              hint="Leave blank if no offer discount"
              {...register('discountPrice')}
            />
            <FormField
              label="Packaging Charge (INR)"
              id="packagingCharge"
              type="number"
              placeholder="e.g. 20"
              error={errors.packagingCharge?.message}
              {...register('packagingCharge')}
            />
          </div>

          {/* Pricing Suggestion assistant card */}
          <SectionDivider label="AI Price & Margin Calculator" />
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[#e35205]" />
              <span className="text-xs font-bold text-neutral-800">Suggest Margin Optimized Pricing</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="foodCost" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Raw Food Ingredient Cost (INR)
                </label>
                <input
                  id="foodCost"
                  type="number"
                  placeholder="e.g. 150"
                  value={foodCostInput}
                  onChange={(e) => setFoodCostInput(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-lg text-xs font-semibold text-neutral-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="targetMargin" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Target Gross Margin (%)
                </label>
                <select
                  id="targetMargin"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
                >
                  <option value={50}>50% Margin</option>
                  <option value={60}>60% Margin</option>
                  <option value={70}>70% Margin (Recommended)</option>
                  <option value={75}>75% Margin</option>
                  <option value={80}>80% Margin</option>
                </select>
              </div>
            </div>

            {aiPriceSuggestion !== null && (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-neutral-200/60 justify-between">
                <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">Optimal Suggested Base Price</p>
                  <p className="text-sm font-black text-[#e35205] mt-0.5">₹{aiPriceSuggestion}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('basePrice', aiPriceSuggestion)}
                  className="px-3 py-1.5 bg-[#e35205] hover:bg-[#c94804] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Apply Suggested Price
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: Customizations (Variants/Add-ons) ─────────────────────────── */}
      {activeFormTab === 'variants' && (
        <div className="space-y-6">
          {/* Custom sizing variations */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Sizing Variations (Variants)
            </h4>
            <button
              type="button"
              onClick={() => appendVariant({ label: '', priceAdjustment: 0, available: true })}
              className="inline-flex items-center gap-1 text-[10px] font-black text-[#e35205] hover:text-[#c94804] cursor-pointer"
            >
              <Plus size={12} /> Add Variant Option
            </button>
          </div>

          {variantFields.length > 0 ? (
            <div className="space-y-2">
              {variantFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/50">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="e.g. Medium Cup, Full Plate"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800"
                      {...register(`variants.${index}.label`)}
                    />
                  </div>
                  <div className="w-36">
                    <input
                      type="number"
                      placeholder="Price adjust (+/-)"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800"
                      {...register(`variants.${index}.priceAdjustment`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-neutral-400 italic">No variants configured. Dish will be sold at flat base rate.</p>
          )}

          {/* Add-on Extra Toppings list */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2 pt-4">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Extra Toppings & Sides (Add-ons)
            </h4>
            <button
              type="button"
              onClick={() => appendAddon({ name: '', price: 0, available: true })}
              className="inline-flex items-center gap-1 text-[10px] font-black text-[#e35205] hover:text-[#c94804] cursor-pointer"
            >
              <Plus size={12} /> Add Extra Add-on
            </button>
          </div>

          {addonFields.length > 0 ? (
            <div className="space-y-2">
              {addonFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/50">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="e.g. Extra Cheese, Truffle Topping"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800"
                      {...register(`addons.${index}.name`)}
                    />
                  </div>
                  <div className="w-36">
                    <input
                      type="number"
                      placeholder="Extra cost"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800"
                      {...register(`addons.${index}.price`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAddon(index)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-neutral-400 italic">No extra add-on groups added.</p>
          )}
        </div>
      )}

      {/* ─── TAB 4: Dietary & Nutrition ───────────────────────────────────────── */}
      {activeFormTab === 'dietary' && (
        <div className="space-y-6">
          <SectionDivider label="Dietary Classification" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Classification */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="dietary" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Dietary Category
              </label>
              <select
                id="dietary"
                {...register('dietary')}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                {DIETARY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Smart tags generator */}
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={handleAiTagging}
                className="inline-flex items-center gap-1 px-4 py-2 border border-orange-100 hover:bg-orange-50/20 text-[#e35205] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all self-start cursor-pointer"
              >
                <Sparkles size={11} /> Auto-scan allergens from desc
              </button>
            </div>
          </div>

          <SectionDivider label="Nutrition Profile & Macros" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormField
              label="Calories (Kcal)"
              id="calories"
              type="number"
              error={errors.calories?.message}
              {...register('calories')}
            />
            <FormField
              label="Protein (grams)"
              id="protein"
              type="number"
              error={errors.protein?.message}
              {...register('protein')}
            />
            <FormField
              label="Carbs (grams)"
              id="carbs"
              type="number"
              error={errors.carbs?.message}
              {...register('carbs')}
            />
            <FormField
              label="Fat (grams)"
              id="fat"
              type="number"
              error={errors.fat?.message}
              {...register('fat')}
            />
          </div>
        </div>
      )}

    </form>
  );
};

export default MenuEditor;
