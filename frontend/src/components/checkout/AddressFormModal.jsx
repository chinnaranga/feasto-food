import React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Home, Briefcase, User } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

const LABEL_OPTIONS = [
    { id: "Home", icon: Home },
    { id: "Work", icon: Briefcase },
    { id: "Other", icon: User },
];

export default function AddressFormModal({ isOpen, onClose, onSave, initialData }) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            address: initialData?.address || "",
            flatNo: "",
            landmark: "",
            label: "Home"
        }
    });

    // Update form if initialData changes (e.g. map updates address)
    React.useEffect(() => {
        if (initialData?.address) {
            setValue("address", initialData.address);
        }
    }, [initialData, setValue]);

    const selectedLabel = watch("label");

    const onSubmit = (data) => {
        onSave({
            ...data,
            location: initialData?.location // Preserve lat/lng
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white">Confirm Delivery Address</h3>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                            {/* Address Preview (Read-onlyish) */}
                            <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl flex gap-3">
                                <MapPin className="text-orange-500 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-xs text-orange-400 font-bold uppercase mb-1">Selected Location</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {initialData?.address || "No address selected"}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <Input
                                    label="Flat / House No / Floor"
                                    placeholder="e.g. Flat 402, Sunshine Apts"
                                    {...register("flatNo", { required: "House details are required" })}
                                    error={errors.flatNo?.message}
                                />

                                <Input
                                    label="Nearby Landmark (Optional)"
                                    placeholder="e.g. Near Apollo Pharmacy"
                                    {...register("landmark")}
                                />
                            </div>

                            {/* Label Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-3">Save As</label>
                                <div className="flex gap-3">
                                    {LABEL_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        const isSelected = selectedLabel === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setValue("label", opt.id)}
                                                className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${isSelected
                                                        ? "bg-white text-black border-white shadow-lg shadow-white/10"
                                                        : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                                                    }`}
                                            >
                                                <Icon size={18} />
                                                <span className="text-xs font-bold">{opt.id}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-4">
                                <Button type="submit" className="w-full py-4 text-lg">
                                    Save Address & Proceed
                                </Button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
