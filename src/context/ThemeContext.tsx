import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { ThemeType } from '../types/theme';

interface ThemeContextType {
  theme: ThemeType;
  updateTheme: (theme: ThemeType) => void;
}

const defaultTheme: ThemeType = {
  primary: '#FF9933',
  background: '#FFF5E6',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  const updateTheme = useCallback((newTheme: ThemeType) => {
    setTheme(newTheme);
  }, []);

  // Performance Optimization: 
  // Memoize context value to prevent unnecessary renders for consumers 
  // when other parts of the provider re-render.
  const contextValue = useMemo(() => ({
    theme,
    updateTheme,
  }), [theme, updateTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
