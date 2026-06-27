import { createTheme, PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#06b6d4' : '#4f46e5', // Cyan vs Indigo
        light: isDark ? '#22d3ee' : '#6366f1',
        dark: isDark ? '#0891b2' : '#3730a3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#8b5cf6' : '#0d9488', // Violet vs Teal
        light: isDark ? '#a78bfa' : '#14b8a6',
        dark: isDark ? '#7c3aed' : '#0f766e',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#070a13' : '#f1f5f9',
        paper: isDark ? 'rgba(17, 24, 39, 0.92)' : 'rgba(255, 255, 255, 0.95)',
      },
      text: {
        primary: isDark ? '#f3f4f6' : '#0f172a',
        secondary: isDark ? '#9ca3af' : '#475569',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
      success: {
        main: '#10b981', // Emerald green
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: '#f59e0b', // Amber
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444', // Red
        light: '#f87171',
        dark: '#dc2626',
      },
      info: {
        main: '#3b82f6', // Blue
        light: '#60a5fa',
        dark: '#2563eb',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 500,
      },
      h6: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 500,
      },
      subtitle1: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
      },
      subtitle2: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
      },
      body1: {
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.6,
      },
      button: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            padding: '8px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            boxShadow: isDark
              ? '0 4px 14px 0 rgba(6, 182, 212, 0.3)'
              : '0 4px 14px 0 rgba(79, 70, 229, 0.3)',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: isDark
                ? '0 6px 20px 0 rgba(6, 182, 212, 0.4)'
                : '0 6px 20px 0 rgba(79, 70, 229, 0.4)',
            },
          },
          containedSecondary: {
            background: isDark
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            boxShadow: isDark
              ? '0 4px 14px 0 rgba(139, 92, 246, 0.3)'
              : '0 4px 14px 0 rgba(13, 148, 136, 0.3)',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              boxShadow: isDark
                ? '0 6px 20px 0 rgba(139, 92, 246, 0.4)'
                : '0 6px 20px 0 rgba(13, 148, 136, 0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.09)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark ? '0 4px 24px 0 rgba(0, 0, 0, 0.5)' : '0 4px 20px 0 rgba(15, 23, 42, 0.08)',
            borderRadius: '16px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.3)' : 'rgba(241, 245, 249, 0.5)',
              transition: 'all 0.2s ease',
              '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderWidth: '2px',
                borderColor: isDark ? '#06b6d4' : '#4f46e5',
              },
            },
          },
        },
      },
    },
  });
};
