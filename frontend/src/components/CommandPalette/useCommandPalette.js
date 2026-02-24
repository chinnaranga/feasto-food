import { useEffect } from "react";

export function useCommandPalette(open, setOpen) {
    useEffect(() => {
        const handler = e => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(prev => !prev);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [setOpen]);
}
