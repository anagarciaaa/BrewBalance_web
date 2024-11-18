import React, { createContext, useState, useContext } from 'react';

// Create the CaffeineContext
const CaffeineContext = createContext(null);

// Provider component
export const CaffeineProvider = ({ children }) => {
  const [weight, setWeight] = useState(150); // Default weight in pounds
  const [maxCaffeineLimit, setMaxCaffeineLimit] = useState((150 / 2.2) * 5.7); // Default limit based on 150 lbs

  const updateWeight = (newWeight) => {
    setWeight(newWeight);
    setMaxCaffeineLimit((newWeight / 2.2) * 5.7);
  };

  return (
    <CaffeineContext.Provider value={{ weight, maxCaffeineLimit, updateWeight }}>
      {children}
    </CaffeineContext.Provider>
  );
};

// Custom hook for easier access
export const useCaffeine = () => useContext(CaffeineContext);
