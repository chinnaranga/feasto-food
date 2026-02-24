import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LiquidButton from '../../components/liquid/LiquidButton';
import LiquidInput from '../../components/liquid/LiquidInput';
import LiquidCard from '../../components/liquid/LiquidCard';
import LiquidContainer from '../../components/liquid/LiquidContainer';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or unauthorized access.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LiquidContainer className="flex items-center justify-center p-6">
            <LiquidCard className="w-full max-w-md p-8 border-white/10 relative z-20" hoverEffect={false}>
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)]"
                    >
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Access</h1>
                    <p className="text-gray-400">Secure backend console</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <LiquidInput
                        icon={Mail}
                        type="email"
                        placeholder="admin@aerobite.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <LiquidInput
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <LiquidButton
                        type="submit"
                        disabled={loading}
                        className="w-full justify-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5 ml-1" />
                            </>
                        )}
                    </LiquidButton>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600">
                        Restricted Access • IP Logged <br />
                        <span className="text-slate-500">v1.2.0 • Secured by Liquid Glass</span>
                    </p>
                </div>
            </LiquidCard>
        </LiquidContainer>
    );
}
