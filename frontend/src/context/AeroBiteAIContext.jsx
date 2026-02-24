import { createContext, useContext } from "react";

const AeroBiteAIContext = createContext();

const MESSAGES = {
    welcome: "Hi, I’m Fia. I’ll help you find the perfect meal today.",
    browsing: "Take your time — I’ll surface the best options for you.",
    cart: "This looks like a great choice for today.",
    checkout: "Everything’s ready. I’ll stay here if you need me.",
    offline: "It looks like you’re offline. I’ll wait right here."
};

export function AeroBiteAIProvider({ children }) {
    const getMessage = (key) => MESSAGES[key] || "";

    return (
        <AeroBiteAIContext.Provider value={{ getMessage }}>
            {children}
        </AeroBiteAIContext.Provider>
    );
}

export const useAeroBiteAI = () => useContext(AeroBiteAIContext);
