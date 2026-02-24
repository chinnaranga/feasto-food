import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
    User, Mail, Phone, MapPin, CreditCard,
    ShoppingBag, Edit2, Camera, ChevronRight, LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function UserProfilePage() {
    const { currentUser, userData, updateUserProfile, logout } = useAuth();
    const { addToast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentUser?.photoURL || null);

    const fileInputRef = useRef(null);

    const stats = [
        { label: "Total Orders", value: userData?.totalOrders || 0, icon: ShoppingBag },
        { label: "Saved Places", value: userData?.savedAddresses?.length || 0, icon: MapPin },
        { label: "Wallet Balance", value: `₹${userData?.walletBalance || 0}`, icon: CreditCard },
    ];

    const quickLinks = [
        { icon: ShoppingBag, label: "Your Orders", path: "/orders", color: "text-blue-400" },
        { icon: MapPin, label: "Manage Addresses", path: "/manage-addresses", color: "text-purple-400" },
        { icon: CreditCard, label: "Payment Methods", path: "/payments", color: "text-green-400" },
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                addToast("Image size should be less than 2MB", "error");
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!displayName.trim()) {
            addToast("Name cannot be empty", "error");
            return;
        }

        setIsSaving(true);
        try {
            await updateUserProfile({ displayName }, avatarFile);
            addToast("Profile updated successfully", "success");
            setIsEditing(false);
            setAvatarFile(null); // Clear file after upload
        } catch (error) {
            addToast(error.message, "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="pb-24 space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1c22] to-[#2a2a35] border border-white/5 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar Group */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1c1c22] shadow-xl bg-gray-800">
                            {(previewUrl || currentUser?.photoURL) ? (
                                <img
                                    src={previewUrl || currentUser.photoURL}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                    <User size={48} className="text-gray-400" />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute bottom-1 right-1 p-2 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {currentUser?.displayName || "Foodie"}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                            <Mail size={16} />
                            <span>{currentUser?.email}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                            <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/5">
                                Member since {new Date(currentUser?.metadata.creationTime).getFullYear()}
                            </span>
                        </div>
                    </div>

                    <div className="flex md:flex-col gap-3">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center md:text-left">
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1">
                                <stat.icon size={12} />
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white px-1">Account Settings</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {quickLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.path}
                            className="group relative overflow-hidden rounded-2xl bg-[#151518] border border-white/5 p-4 hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-white/5 ${link.color}`}>
                                        <link.icon size={24} />
                                    </div>
                                    <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
                                        {link.label}
                                    </span>
                                </div>
                                <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1c1c22] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                                    <button
                                        onClick={() => { setIsEditing(false); setPreviewUrl(currentUser?.photoURL); }}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Avatar Upload */}
                                    <div className="flex justify-center">
                                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-600 group-hover:border-green-500 transition-colors">
                                                {(previewUrl || currentUser?.photoURL) ? (
                                                    <img
                                                        src={previewUrl || currentUser.photoURL}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <Camera className="text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                <Camera className="text-white" />
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {/* Name Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => { setIsEditing(false); setPreviewUrl(currentUser?.photoURL); }}
                                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
