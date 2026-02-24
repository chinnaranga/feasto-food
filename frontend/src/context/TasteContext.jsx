import { createContext, useContext, useEffect, useState } from "react";

const TasteContext = createContext();

const DEFAULT_PROFILE = {
    cuisines: {},
    priceRange: {},
    spiceLevel: {},
    favorites: [],
};

export function TasteProvider({ children }) {
    const [profile, setProfile] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("aerobite_taste")) || DEFAULT_PROFILE;
        } catch {
            return DEFAULT_PROFILE;
        }
    });

    useEffect(() => {
        localStorage.setItem("aerobite_taste", JSON.stringify(profile));
    }, [profile]);

    function recordOrder(item) {
        if (!item) return;
        setProfile(prev => ({
            ...prev,
            cuisines: {
                ...prev.cuisines,
                [item.cuisine]: (prev.cuisines[item.cuisine] || 0) + 1,
            },
            priceRange: {
                ...prev.priceRange,
                [item.priceBucket]: (prev.priceRange[item.priceBucket] || 0) + 1,
            },
            spiceLevel: {
                ...prev.spiceLevel,
                [item.spiceLevel]: (prev.spiceLevel[item.spiceLevel] || 0) + 1,
            },
        }));
    }

    function addFavorite(itemId) {
        setProfile(prev => ({
            ...prev,
            favorites: Array.from(new Set([...prev.favorites, itemId])),
        }));
    }

    return (
        <TasteContext.Provider value={{ profile, recordOrder, addFavorite }}>
            {children}
        </TasteContext.Provider>
    );
}

export const useTaste = () => useContext(TasteContext);
