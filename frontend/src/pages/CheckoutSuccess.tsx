import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Clock, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export const CheckoutSuccess: React.FC = () => {
  const orderId = `FST-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center py-16 px-4">
      <Container className="max-w-lg">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Success icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
              <CheckCircle2 size={44} className="text-emerald-500" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-white text-sm"
            >
              🎉
            </motion.div>
          </div>

          <div>
            <h1 className="text-3xl font-black font-heading text-text-primary tracking-tight mb-2">
              Order Placed!
            </h1>
            <p className="text-sm text-text-secondary">
              Your order has been confirmed and is being prepared.
            </p>
          </div>

          {/* Order ID */}
          <div className="w-full px-5 py-4 bg-secondary-bg border border-border-main rounded-2xl">
            <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-1">Order ID</p>
            <p className="text-lg font-black text-text-primary font-heading tracking-wider">{orderId}</p>
          </div>

          {/* Delivery estimate */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary-bg border border-border-main rounded-xl">
              <Clock size={15} className="text-brand-orange shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-text-primary">Estimated Delivery</p>
                <p className="text-xs text-text-secondary">25–35 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary-bg border border-border-main rounded-xl">
              <MapPin size={15} className="text-brand-orange shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-text-primary">Delivering to</p>
                <p className="text-xs text-text-secondary">Your selected address</p>
              </div>
            </div>
          </div>

          {/* AI hint */}
          <div className="w-full flex items-center gap-2.5 px-4 py-3 bg-brand-orange/5 border border-brand-orange/15 rounded-xl">
            <Sparkles size={13} className="text-brand-orange animate-pulse shrink-0" />
            <p className="text-xs font-bold text-text-secondary text-left">
              Feasto will remember this order for quick reorder next time.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link to="/discover" className="flex-1">
              <Button variant="primary" className="w-full justify-center rounded-2xl py-3 font-bold">
                Explore More Food
              </Button>
            </Link>
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full justify-center rounded-2xl py-3 font-bold">
                Track Order
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};
