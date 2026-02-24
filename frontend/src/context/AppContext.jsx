import React, { createContext, useContext, useReducer } from "react";

const AppContext = createContext();

const initialState = {
  isLoading: false,
  search: "",
  location: "Current Location",
  activeFilter: "All",
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_FILTER":
      return { ...state, activeFilter: action.payload };
    case "HIGHLIGHT_RESTAURANT":
      return { ...state, highlightRestaurantId: action.payload };
    default:
      return state;
  }
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

