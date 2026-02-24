import React, { useState, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FlyingCart = forwardRef(({ targetRef }, ref) => {
    const [flyingItems, setFlyingItems] = useState([]);

    useImperativeHandle(ref, () => ({
        trigger: (src, startRect) => {
            if (!targetRef?.current) return;
            const targetRect = targetRef.current.getBoundingClientRect();

            const id = Date.now() + Math.random();
            setFlyingItems(prev => [...prev, { id, src, startRect, targetRect }]);

            // Cleanup
            setTimeout(() => {
                setFlyingItems(prev => prev.filter(item => item.id !== id));
            }, 1000);
        }
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            <AnimatePresence>
                {flyingItems.map(item => (
                    <motion.img
                        key={item.id}
                        src={item.src}
                        initial={{
                            position: "absolute",
                            top: item.startRect.top,
                            left: item.startRect.left,
                            width: 60,
                            height: 60,
                            opacity: 1,
                            scale: 1,
                            borderRadius: "12px",
                            zIndex: 100
                        }}
                        animate={{
                            top: item.targetRect.top,
                            left: item.targetRect.left,
                            width: 20,
                            height: 20,
                            opacity: 0,
                            scale: 0.5
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="object-cover shadow-2xl border-2 border-white"
                        style={{ pointerEvents: "none" }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
});

export default FlyingCart;
