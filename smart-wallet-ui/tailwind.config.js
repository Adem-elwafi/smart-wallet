/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic Color Palette - Professional FinTech Design
        primary: {
          DEFAULT: '#1E3A8A',     // Deep Blue - Primary trust color
          dark: '#1E3A8A',        // Darker shade for hover states
          light: '#3B82F6',       // Electric Blue - Accent for highlights
          lighter: '#DBEAFE',     // Light blue for backgrounds
        },
        accent: {
          DEFAULT: '#3B82F6',     // Electric Blue - Highlight & accent
          light: '#93C5FD',       // Light accent
          lighter: '#DBEAFE',     // Very light accent
        },
        surface: {
          DEFAULT: '#F8FAFC',     // Slate-50 - Card backgrounds
          elevated: '#FFFFFF',    // White - Elevated surfaces
          subtle: '#F1F5F9',      // Slate-100 - Subtle backgrounds
        },
        text: {
          primary: '#0F172A',     // Slate-900 - Main text
          secondary: '#475569',   // Slate-600 - Secondary text
          tertiary: '#94A3B8',    // Slate-400 - Tertiary text
          inverse: '#F8FAFC',     // Light text on dark backgrounds
        },
        success: {
          DEFAULT: '#10B981',     // Emerald-500 - Success state
          light: '#D1FAE5',       // Light success background
          dark: '#059669',        // Dark success for text
        },
        error: {
          DEFAULT: '#EF4444',     // Red-500 - Error state
          light: '#FEE2E2',       // Light error background
          dark: '#DC2626',        // Dark error for text
        },
        warning: {
          DEFAULT: '#F59E0B',     // Amber-500 - Warning state
          light: '#FEF3C7',       // Light warning background
        },
        border: {
          DEFAULT: '#E2E8F0',     // Slate-200 - Default border
          light: '#F1F5F9',       // Slate-100 - Light border
          dark: '#CBD5E1',        // Slate-300 - Dark border
        },
        // Keep fintech for backward compatibility
        fintech: {
          dark: '#1a1f2c',
          primary: '#3b82f6',
          secondary: '#64748b'
        }
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.95)',  // Glass effect background
      }
    },
  },
  plugins: [],
}