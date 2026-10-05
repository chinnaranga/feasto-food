import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export const CheckoutFailure: React.FC = () => (
  <div className="min-h-screen bg-primary-bg flex flex-col items-center justify-center py-16 px-4">
    <Container className="max-w-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        className="flex flex-col items-center text-center gap-6"
      >
        <div className="w-24 h-24 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black font-heading text-text-primary mb-2">Payment Failed</h1>
          <p className="text-sm text-text-secondary">
            Something went wrong. Your cart is safe — please try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link to="/checkout" className="flex-1">
            <Button variant="primary" className="w-full justify-center rounded-2xl py-3 font-bold">
              Try Again
            </Button>
          </Link>
          <Link to="/cart" className="flex-1">
            <Button variant="outline" className="w-full justify-center rounded-2xl py-3 font-bold">
              Back to Cart
            </Button>
          </Link>
        </div>
      </motion.div>
    </Container>
  </div>
);
