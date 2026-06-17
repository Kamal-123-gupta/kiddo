import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HomeScreen } from './screens/HomeScreen';

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
