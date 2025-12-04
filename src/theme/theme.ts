'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Comprehensive theme configuration for Booking Hub Portal
 * All colors extracted from login, register, OTP, and dashboard pages
 * 
 * Color Palette:
 * - Primary: #D2A298 (Peach/Coral - main brand color for buttons, focus states)
 * - Secondary: #A3B899 (Green - links, accents, card values)
 * - Text: Various shades for headings, body, labels, placeholders
 * - Background: White and gradient backgrounds
 * - Borders: Light grays for inputs and cards
 * - Error: Red for validation errors
 * - Special: Dashboard icon color, sidebar active state, etc.
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    // Primary brand color - used for buttons, focus states, active elements
    primary: {
      main: '#D2A298', // Main peach/coral color
      light: '#C8968A', // Hover state
      dark: '#BE8A7C', // Active/pressed state
      contrastText: '#FFFFFF',
    },
    // Secondary accent color - used for links, card values, accents
    secondary: {
      main: '#A3B899', // Main green color
      light: '#8FA68A', // Hover state
      dark: '#7A9470', // Darker variant
      contrastText: '#FFFFFF',
    },
    // Error color - used for validation errors, error states
    error: {
      main: '#FF0000', // Red for errors
      light: '#FF3333',
      dark: '#CC0000',
      contrastText: '#FFFFFF',
    },
    // Success color (can be used for success states)
    success: {
      main: '#A3B899', // Same as secondary green
      light: '#8FA68A',
      dark: '#7A9470',
      contrastText: '#FFFFFF',
    },
    // Warning color
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    // Info color
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    // Background colors
    background: {
      default: '#F9FAFB', // Light gray background
      paper: '#FFFFFF', // White for cards, inputs
    },
    // Text colors
    text: {
      primary: '#041C2C', // Dark blue/black for main headings (login, register)
      secondary: '#6A7282', // Gray for secondary text, placeholders
      disabled: '#B0B0B0', // Light gray for disabled text, labels
    },
    // Custom colors for specific use cases
    // These will be accessible via theme.palette.custom
    // @ts-ignore - MUI allows custom palette properties
    custom: {
    // Text colors
    heading: {
      primary: '#041C2C', // Login/Register headings
      dashboard: '#0A0A0A', // Dashboard page heading
      dark: '#101828', // Dark gray for service names, important text
      medium: '#333333', // Medium gray for OTP heading, terms text
    },
    // Label and placeholder colors
    label: {
      default: '#B0B0B0', // Input labels, placeholders
      secondary: '#747474', // OTP description text
    },
    // Border colors
    border: {
      default: '#EDEDED', // Default input border
      hover: '#D1D5DB', // Input border on hover
      focus: '#D2A298', // Input border on focus (primary color)
      card: '#C3C1C1', // Schedule card border
      divider: '#E5E7EB', // Sidebar, TopBar borders
      radio: '#E0E0E0', // Radio button border (unselected)
    },
    // Background colors
    background: {
      white: '#FFFFFF',
      gradient: {
        start: '#FFFFFF',
        middle: '#D6DFD1',
        end: '#A3B899',
      },
      sidebar: {
        active: '#D9B5A1', // Sidebar active item background
      },
    },
    // Special colors
    icon: {
      dashboard: '#CFA09F', // Dashboard card icon color
    },
    // Status colors
    status: {
      logout: '#E1000F', // Logout button color
      notification: '#E57373', // Notification dot color
      disabled: '#CCCCCC', // Disabled elements
    },
    // Text hierarchy
    text: {
      time: '#6A7282', // Time text in schedule cards
      client: '#6A7282', // Client name text
      service: '#101828', // Service name text
      account: '#808080', // Account number text
      subtitle: '#6A7282', // Dashboard subtitle
    },
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
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700, // Changed to 700 to match login/register
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700, // Changed to 700 to match buttons
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8, // Default border radius
  },
  // Component overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px', // Match button border radius from design
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#D2A298', // Primary color
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#C8968A', // Primary light
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: '#BE8A7C', // Primary dark
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '7.5px', // Match input border radius from design
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#EDEDED', // Default border
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#D1D5DB', // Hover border
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D2A298', // Focus border (primary)
              borderWidth: '1.5px',
            },
            '&.Mui-error fieldset': {
              borderColor: '#FF0000', // Error border
            },
            '&.Mui-error:hover fieldset': {
              borderColor: '#FF0000',
            },
            '&.Mui-error.Mui-focused fieldset': {
              borderColor: '#FF0000',
              borderWidth: '1px',
            },
          },
          '& .MuiInputBase-input': {
            color: '#041C2C', // Text color
            '&::placeholder': {
              color: '#B0B0B0', // Placeholder color
              opacity: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B0B0B0', // Label color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '15.5796px', // Match card border radius
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)', // Card shadow
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#A3B899', // Secondary green
          textDecoration: 'none',
          fontWeight: 400,
          '&:hover': {
            textDecoration: 'underline',
            color: '#8FA68A', // Secondary light
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#D2A298', // Primary color
          '&.Mui-checked': {
            color: '#D2A298',
          },
          '&.Mui-error': {
            color: '#FF0000',
            '&.Mui-checked': {
              color: '#FF0000',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#101828',
          boxShadow: 'none',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
  },
});

// Extend the theme type to include custom palette
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      heading: {
        primary: string;
        dashboard: string;
        dark: string;
        medium: string;
      };
      label: {
        default: string;
        secondary: string;
      };
      border: {
        default: string;
        hover: string;
        focus: string;
        card: string;
        divider: string;
        radio: string;
      };
      background: {
        white: string;
        gradient: {
          start: string;
          middle: string;
          end: string;
        };
        sidebar: {
          active: string;
        };
      };
      icon: {
        dashboard: string;
      };
      status: {
        logout: string;
        notification: string;
        disabled: string;
      };
      text: {
        time: string;
        client: string;
        service: string;
        account: string;
        subtitle: string;
      };
    };
  }

  interface PaletteOptions {
    custom?: {
      heading?: {
        primary?: string;
        dashboard?: string;
        dark?: string;
        medium?: string;
      };
      label?: {
        default?: string;
        secondary?: string;
      };
      border?: {
        default?: string;
        hover?: string;
        focus?: string;
        card?: string;
        divider?: string;
        radio?: string;
      };
      background?: {
        white?: string;
        gradient?: {
          start?: string;
          middle?: string;
          end?: string;
        };
        sidebar?: {
          active?: string;
        };
      };
      icon?: {
        dashboard?: string;
      };
      status?: {
        logout?: string;
        notification?: string;
        disabled?: string;
      };
      text?: {
        time?: string;
        client?: string;
        service?: string;
        account?: string;
        subtitle?: string;
      };
    };
  }
}

export default theme;
