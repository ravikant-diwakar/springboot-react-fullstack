import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0466c8',
      light: '#3b82f6',
      dark: '#0353a4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0096c7',
      light: '#48cae4',
      dark: '#023e8a',
      contrastText: '#ffffff',
    },
    success: {
      main: '#02c39a',
      light: '#90e0c5',
      dark: '#018a6c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#fcbf49',
      light: '#ffd166',
      dark: '#f77f00',
      contrastText: '#000000',
    },
    error: {
      main: '#d62828',
      light: '#f77f7f',
      dark: '#9e1a1a',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;