import React from 'react';
import { MapPin, Check, Plus } from 'lucide-react';
import type { SavedAddress } from '@/store/cartStore';
import { useCartStore } from '@/store/cartStore';

// ─── Address Card ─────────────────────────────────────────────────────────────

interface AddressCardProps {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition-main cursor-pointer
      ${isSelected
        ? 'bg-brand-orange/5 border-brand-orange/30 ring-2 ring-brand-orange/10'
        : 'bg-primary-bg border-border-main hover:border-[#cbd5e1]'
      }`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5
      ${isSelected ? 'bg-brand-orange text-white' : 'bg-secondary-bg text-text-muted border border-border-main'}`}>
      <MapPin size={14} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-xs font-extrabold text-text-primary uppercase tracking-wide">{address.label}</span>
        {address.isDefault && (
          <span className="text-[9px] font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-1.5 py-0.5 rounded uppercase">
            Default
          </span>
        )}
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{address.fullAddress}</p>
      <p className="text-xs text-text-muted mt-0.5">{address.city} — {address.pincode}</p>
      {address.landmark && <p className="text-[10px] text-text-muted mt-0.5">Near {address.landmark}</p>}
    </div>
    {isSelected && (
      <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center shrink-0 mt-1">
        <Check size={11} className="text-white" />
      </div>
    )}
  </button>
);

// ─── Address Selector ─────────────────────────────────────────────────────────

interface AddressSelectorProps {
  onAddNew: () => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({ onAddNew }) => {
  const { savedAddresses, checkoutForm, selectAddress } = useCartStore();

  return (
    <div className="flex flex-col gap-3">
      {savedAddresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          isSelected={checkoutForm.addressId === addr.id}
          onSelect={() => selectAddress(addr.id)}
        />
      ))}
      <button
        onClick={onAddNew}
        className="flex items-center gap-2 w-full px-4 py-3 border border-dashed border-border-main hover:border-brand-orange/40 rounded-2xl text-xs font-bold text-text-muted hover:text-brand-orange transition-main cursor-pointer"
      >
        <Plus size={14} />
        <span>Add new address</span>
      </button>
    </div>
  );
};
