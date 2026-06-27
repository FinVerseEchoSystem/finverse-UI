import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store, RootState } from './store/store';
import { getTheme } from './theme/theme';
import App from './App';
import './index.css';

// Wrapper to dynamically handle theme mode updates from Redux state
const ThemeManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = useSelector((state: RootState) => state.preferences.theme);
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeManager>
        <App />
      </ThemeManager>
    </Provider>
  </React.StrictMode>
);
