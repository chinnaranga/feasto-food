import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";

const CartContext = createContext();

const initialState = {
  items: [],
  savedItems: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_ITEM': {
      const { food, qty } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === food.id);
      let newItems;
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        newItems = [...state.items, { ...food, quantity: qty }];
      }
      return { ...state, items: newItems };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    case 'INCREASE_QTY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    case 'DECREASE_QTY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'SAVE_FOR_LATER': {
      const itemToSave = state.items.find(item => item.id === action.payload.id);
      if (!itemToSave) return state;
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        savedItems: [...state.savedItems, itemToSave]
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('food-app-cart');
    if (storedCart) {
      try {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(storedCart) });
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('food-app-cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (food, qty = 1) => dispatch({ type: 'ADD_ITEM', payload: { food, qty } });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }); // for compatibility
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const increaseQty = (id) => dispatch({ type: 'INCREASE_QTY', payload: { id } });
  const decreaseQty = (id) => dispatch({ type: 'DECREASE_QTY', payload: { id } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const saveForLater = (id) => dispatch({ type: 'SAVE_FOR_LATER', payload: { id } });

  const totalItems = useMemo(() => state.items.reduce((total, item) => total + item.quantity, 0), [state.items]);
  const totalPrice = useMemo(() => state.items.reduce((total, item) => total + item.price * item.quantity, 0), [state.items]);

  // Merge guest cart items (for guest checkout → login flow)
  const mergeGuestCart = (guestItems) => {
    if (!guestItems || !Array.isArray(guestItems)) return;
    guestItems.forEach(item => {
      addToCart(item, item.quantity || 1);
    });
  };

  const value = {
    cartItems: state.items,
    savedItems: state.savedItems,
    addToCart,
    removeFromCart,
    removeItem,
    updateQuantity,
    increaseQty,
    decreaseQty,
    clearCart,
    saveForLater,
    mergeGuestCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default useCart;
