import React, { createContext, useContext, useState } from "react";

const LandingContext = createContext();

export function LandingProvider({ children }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  return (
    <LandingContext.Provider value={{ featuredProducts, setFeaturedProducts }}>
      {children}
    </LandingContext.Provider>
  );
}

export function useLanding() {
  return useContext(LandingContext);
}
