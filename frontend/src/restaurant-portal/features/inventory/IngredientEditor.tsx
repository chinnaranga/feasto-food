import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { Sparkles, Save, Calendar, CheckSquare, Square, Info } from 'lucide-react';
import usePortalInventoryStore, { type StockItem } from '../../store/portalInventoryStore';
import usePortalMenuStore from '../../store/portalMenuStore';
import { FormField } from '../../components/ui/AuthFormFields';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { ToggleRow } from '../../components/ui/ToggleRow';
import Card from '../../components/ui/Card';

// ─── Zod Validation Schema ───────────────────────────────────────────────────
const ingredientSchema = z.object({
  name: z.string().min(2, 'Ingredient name must be at least 2 characters'),
  category: z.enum(['ingredients', 'raw-materials', 'finished-goods', 'packaging', 'beverages', 'other']),
  unit: z.enum(['kg', 'g', 'l', 'ml', 'piece', 'packet', 'bottle', 'litre', 'pack', 'box']),
  location: z.enum(['kitchen', 'freezer', 'cold-storage', 'dry-storage', 'warehouse', 'shelf']),
  currentQuantity: z.coerce.number().min(0, 'Current quantity cannot be negative'),
  maxStock: z.coerce.number().min(1, 'Max capacity must be at least 1'),
  minStock: z.coerce.number().min(0),
  safetyStock: z.coerce.number().min(0),
  reorderPoint: z.coerce.number().min(0),
  supplierName: z.string().min(2, 'Supplier name required'),
  supplierContact: z.string().min(2, 'Contact person name required'),
  supplierPhone: z.string().min(6, 'Supplier phone number required'),
  supplierEmail: z.string().email('Supplier email must be a valid email'),
  leadTimeDays: z.coerce.number().min(0, 'Lead time cannot be negative'),
  mfgDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

// Explicit interface matching StockItem fields — prevents stale Zod-inference IDE errors
type IngredientFormValues = {
  name: string;
  category: StockItem['category'];
  unit: StockItem['unit'];
  location: StockItem['location'];
  currentQuantity: number;
  maxStock: number;
  minStock: number;
  safetyStock: number;
  reorderPoint: number;
  supplierName: string;
  supplierContact: string;
  supplierPhone: string;
  supplierEmail: string;
  leadTimeDays: number;
  mfgDate?: string;
  expiryDate?: string;
};

const TYPE_OPTIONS = [
  { value: 'ingredients', label: 'Ingredients (e.g. Masala, Garlic)' },
  { value: 'raw-materials', label: 'Raw Materials (e.g. Rice, Flour)' },
  { value: 'finished-goods', label: 'Finished Goods (e.g. Boba cups, Sauce)' },
  { value: 'packaging', label: 'Packaging Box (e.g. Bento Boxes)' },
] as const;

const UNIT_OPTIONS = ['kg', 'g', 'l', 'ml', 'piece', 'packet', 'bottle'] as const;

const LOCATION_OPTIONS = [
  { value: 'kitchen', label: 'Kitchen Counter' },
  { value: 'freezer', label: 'Walk-In Freezer' },
  { value: 'cold-storage', label: 'Cold Storage Room' },
  { value: 'dry-storage', label: 'Dry Storage Pantry' },
  { value: 'warehouse', label: 'Central Warehouse' },
  { value: 'shelf', label: 'Display Shelves' },
] as const;

export const IngredientEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { items, createIngredient, updateIngredient } = usePortalInventoryStore();
  const { items: menuItems } = usePortalMenuStore();

  const isEditMode = !!id;
  const editingIngredient = items.find((item) => item.id === id);

  const [preferredSupplier, setPreferredSupplier] = useState<boolean>(editingIngredient?.supplier.preferred || true);
  const [recipeMenuIds, setRecipeMenuIds] = useState<string[]>(editingIngredient?.recipeMenuIds || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      category: 'ingredients' as StockItem['category'],
      unit: 'kg' as StockItem['unit'],
      location: 'dry-storage' as StockItem['location'],
      currentQuantity: 0,
      maxStock: 100,
      minStock: 10,
      safetyStock: 15,
      reorderPoint: 25,
      supplierName: '',
      supplierContact: '',
      supplierPhone: '',
      supplierEmail: '',
      leadTimeDays: 3,
      mfgDate: '',
      expiryDate: '',
    },
    mode: 'onBlur',
  });

  // Pre-populate if editing
  useEffect(() => {
    if (isEditMode && editingIngredient) {
      reset({
        name: editingIngredient.name,
        category: editingIngredient.category,
        unit: editingIngredient.unit,
        location: editingIngredient.location,
        currentQuantity: editingIngredient.currentQuantity,
        maxStock: editingIngredient.maxStock,
        minStock: editingIngredient.minStock,
        safetyStock: editingIngredient.safetyStock,
        reorderPoint: editingIngredient.reorderPoint,
        supplierName: editingIngredient.supplier.name,
        supplierContact: editingIngredient.supplier.contact,
        supplierPhone: editingIngredient.supplier.phone,
        supplierEmail: editingIngredient.supplier.email,
        leadTimeDays: editingIngredient.supplier.leadTimeDays,
        mfgDate: editingIngredient.mfgDate || '',
        expiryDate: editingIngredient.expiryDate || '',
      });
      setPreferredSupplier(editingIngredient.supplier.preferred);
      setRecipeMenuIds(editingIngredient.recipeMenuIds);
    }
  }, [isEditMode, editingIngredient, reset]);

  const handleToggleRecipeLink = (menuId: string) => {
    if (recipeMenuIds.includes(menuId)) {
      setRecipeMenuIds(recipeMenuIds.filter((x) => x !== menuId));
    } else {
      setRecipeMenuIds([...recipeMenuIds, menuId]);
    }
  };

  const onSubmit = (values: IngredientFormValues) => {
    const payload = {
      name: values.name,
      category: values.category,
      unit: values.unit,
      location: values.location,
      currentQuantity: values.currentQuantity,
      reservedQuantity: editingIngredient?.reservedQuantity || 0,
      safetyStock: values.safetyStock,
      minStock: values.minStock,
      maxStock: values.maxStock,
      reorderPoint: values.reorderPoint,
      supplier: {
        name: values.supplierName,
        contact: values.supplierContact,
        phone: values.supplierPhone,
        email: values.supplierEmail,
        leadTimeDays: values.leadTimeDays,
        preferred: preferredSupplier,
      },
      mfgDate: values.mfgDate === '' ? undefined : values.mfgDate,
      expiryDate: values.expiryDate === '' ? undefined : values.expiryDate,
      recipeMenuIds,
    };

    if (isEditMode && id) {
      updateIngredient(id, payload);
    } else {
      createIngredient(payload);
    }
    navigate('/restaurant-portal/inventory');
  };

  // AI safety thresholds optimizer
  const handleAiOptimizeLevels = () => {
    const qty = watch('currentQuantity') || 10;
    setValue('safetyStock', Math.round(qty * 0.25) || 5);
    setValue('reorderPoint', Math.round(qty * 0.45) || 8);
    setValue('maxStock', Math.round(qty * 2.5) || 50);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left" noValidate>
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-neutral-800">
            {isEditMode ? `Edit Ingredient Details — ${editingIngredient?.name}` : 'Add New Inventory Stock'}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure raw categories, minimum safety margins, supplier details, and recipe couplings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/restaurant-portal/inventory')}
            className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-500 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Save Stock Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Form inputs */}
        <div className="lg:col-span-2 space-y-6">
          <SectionDivider label="Item Identity & Storage" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Ingredient Name"
              id="name"
              placeholder="e.g. Avocado Hass, Jasmine Rice"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="category" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Stock Type
                </label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="unit" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Measurement Unit
                </label>
                <select
                  id="unit"
                  {...register('unit')}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="location" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Storage Area
              </label>
              <select
                id="location"
                {...register('location')}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Mfg Date"
                id="mfgDate"
                type="date"
                error={errors.mfgDate?.message}
                {...register('mfgDate')}
              />
              <FormField
                label="Expiry Date"
                id="expiryDate"
                type="date"
                error={errors.expiryDate?.message}
                {...register('expiryDate')}
              />
            </div>
          </div>

          <SectionDivider label="Stock Quantities & Thresholds" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <FormField
              label="Current Qty"
              id="currentQuantity"
              type="number"
              error={errors.currentQuantity?.message}
              {...register('currentQuantity')}
            />
            <FormField
              label="Min Threshold"
              id="minStock"
              type="number"
              error={errors.minStock?.message}
              {...register('minStock')}
            />
            <FormField
              label="Safety Margin"
              id="safetyStock"
              type="number"
              error={errors.safetyStock?.message}
              {...register('safetyStock')}
            />
            <FormField
              label="Reorder Trigger"
              id="reorderPoint"
              type="number"
              error={errors.reorderPoint?.message}
              {...register('reorderPoint')}
            />
            <FormField
              label="Max Capacity"
              id="maxStock"
              type="number"
              error={errors.maxStock?.message}
              {...register('maxStock')}
            />
          </div>

          <SectionDivider label="Preferred Vendor details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Supplier Company Name"
              id="supplierName"
              placeholder="e.g. Pacific Seafoods Ltd"
              error={errors.supplierName?.message}
              {...register('supplierName')}
            />
            <FormField
              label="Contact Representative"
              id="supplierContact"
              placeholder="e.g. Marcus Vance"
              error={errors.supplierContact?.message}
              {...register('supplierContact')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Supplier Phone"
              id="supplierPhone"
              placeholder="e.g. +91 98845 22001"
              error={errors.supplierPhone?.message}
              {...register('supplierPhone')}
            />
            <FormField
              label="Supplier Email"
              id="supplierEmail"
              placeholder="e.g. orders@pacific.com"
              error={errors.supplierEmail?.message}
              {...register('supplierEmail')}
            />
            <FormField
              label="Lead Time (Days)"
              id="leadTimeDays"
              type="number"
              error={errors.leadTimeDays?.message}
              {...register('leadTimeDays')}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Recipe Coupling & AI Optimization cards */}
        <div className="space-y-6">
          <SectionDivider label="Supplier Verification" />
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/40 px-4 divide-y divide-neutral-100">
            <ToggleRow
              label="Preferred Partner Status"
              description="Marks this supplier as preferred for automatic reorder suggestions."
              checked={preferredSupplier}
              onChange={setPreferredSupplier}
            />
          </div>

          {/* AI optimizer trigger card */}
          <SectionDivider label="AI Safety Optimizer" />
          <Card className="text-left space-y-4">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#e35205]" />
              <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Safety Stock Calculator
              </h5>
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Based on your current stock capacity, let AI calculate optimal safety, reorder trigger bounds, and maximum stock sizes.
            </p>
            <button
              type="button"
              onClick={handleAiOptimizeLevels}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Generate Optimal Bounds
            </button>
          </Card>

          {/* Recipe Menu Linking checklist */}
          <SectionDivider label="Recipe Menu Coupling" />
          <Card className="text-left select-none space-y-3 max-h-64 overflow-y-auto pr-1">
            <div className="flex items-start gap-1.5 border-b border-neutral-100 pb-2">
              <Info size={12} className="text-neutral-400 mt-0.5 shrink-0" />
              <p className="text-[9px] text-neutral-400 leading-normal">
                Checkmark which client-app dishes rely on this raw stock item. (Enables auto-out-of-stock warning triggers).
              </p>
            </div>

            {menuItems.length > 0 ? (
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const isChecked = recipeMenuIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleRecipeLink(item.id)}
                      className="flex items-center gap-2.5 py-1.5 hover:bg-neutral-50/60 rounded px-1.5 -mx-1.5 cursor-pointer"
                    >
                      {isChecked ? (
                        <CheckSquare size={13} className="text-[#e35205]" />
                      ) : (
                        <Square size={13} className="text-neutral-300" />
                      )}
                      <span className="text-xs font-bold text-neutral-700">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[10px] text-neutral-400 italic">No menu items configured inside catalog. Create menu items first.</p>
            )}
          </Card>
        </div>

      </div>

    </form>
  );
};

export default IngredientEditor;
