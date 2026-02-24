import React, { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

/**
 * FEASTO WALLET SYSTEM
 * - Stores wallet balance
 * - Tracks transactions
 * - Persists to localStorage
 */

const WALLET_STORAGE_KEY = "aerobite_wallet";

const initialWallet = {
    balance: 0,
    transactions: [],
};

export function WalletProvider({ children }) {
    const [wallet, setWallet] = useState(initialWallet);

    // Load wallet from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(WALLET_STORAGE_KEY);
        if (stored) {
            try {
                setWallet(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse wallet:", e);
            }
        } else {
            // Give new users a welcome bonus
            const welcomeWallet = {
                balance: 120,
                transactions: [{
                    id: `TXN-${Date.now()}`,
                    type: "CREDIT",
                    amount: 120,
                    reason: "WELCOME_BONUS",
                    description: "Welcome to AeroBite! 🎉",
                    createdAt: new Date().toISOString(),
                }],
            };
            setWallet(welcomeWallet);
            localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(welcomeWallet));
        }
    }, []);

    // Persist wallet changes
    useEffect(() => {
        if (wallet.balance > 0 || wallet.transactions.length > 0) {
            localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
        }
    }, [wallet]);

    // Credit wallet (refunds, cashback, promo)
    const creditWallet = (amount, reason = "CREDIT", description = "") => {
        const txn = {
            id: `TXN-${Date.now()}`,
            type: "CREDIT",
            amount,
            reason,
            description,
            createdAt: new Date().toISOString(),
        };

        setWallet(prev => ({
            balance: prev.balance + amount,
            transactions: [txn, ...prev.transactions],
        }));

        return txn;
    };

    // Debit wallet (payments)
    const debitWallet = (amount, reason = "ORDER_PAYMENT", orderId = "", description = "") => {
        if (amount > wallet.balance) {
            throw new Error("Insufficient wallet balance");
        }

        const txn = {
            id: `TXN-${Date.now()}`,
            type: "DEBIT",
            amount,
            reason,
            orderId,
            description,
            createdAt: new Date().toISOString(),
        };

        setWallet(prev => ({
            balance: prev.balance - amount,
            transactions: [txn, ...prev.transactions],
        }));

        return txn;
    };

    // Calculate how much wallet can pay
    const getWalletPayment = (total) => {
        const walletUsed = Math.min(wallet.balance, total);
        const onlineAmount = total - walletUsed;
        return { walletUsed, onlineAmount };
    };

    // Reset wallet (for testing)
    const resetWallet = () => {
        const freshWallet = {
            balance: 120,
            transactions: [{
                id: `TXN-${Date.now()}`,
                type: "CREDIT",
                amount: 120,
                reason: "WELCOME_BONUS",
                description: "Wallet reset with welcome bonus",
                createdAt: new Date().toISOString(),
            }],
        };
        setWallet(freshWallet);
    };

    return (
        <WalletContext.Provider value={{
            balance: wallet.balance,
            transactions: wallet.transactions,
            creditWallet,
            debitWallet,
            getWalletPayment,
            resetWallet,
        }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
