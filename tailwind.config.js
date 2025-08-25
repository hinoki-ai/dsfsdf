/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors using CSS custom properties
        amber: {
          50: "hsl(var(--amber-50))",
          100: "hsl(var(--amber-100))",
          200: "hsl(var(--amber-200))",
          300: "hsl(var(--amber-300))",
          400: "hsl(var(--amber-400))",
          500: "hsl(var(--amber-500))",
          600: "hsl(var(--amber-600))",
          700: "hsl(var(--amber-700))",
          800: "hsl(var(--amber-800))",
          900: "hsl(var(--amber-900))",
        },
        burgundy: {
          50: "hsl(var(--burgundy-50))",
          100: "hsl(var(--burgundy-100))",
          200: "hsl(var(--burgundy-200))",
          300: "hsl(var(--burgundy-300))",
          400: "hsl(var(--burgundy-400))",
          500: "hsl(var(--burgundy-500))",
          600: "hsl(var(--burgundy-600))",
          700: "hsl(var(--burgundy-700))",
          800: "hsl(var(--burgundy-800))",
          900: "hsl(var(--burgundy-900))",
        },
        // Semantic color tokens for alcohol categories
        alcohol: {
          low: {
            bg: "hsl(var(--alcohol-low-bg))",
            text: "hsl(var(--alcohol-low-text))",
            border: "hsl(var(--alcohol-low-border))",
          },
          medium: {
            bg: "hsl(var(--alcohol-medium-bg))",
            text: "hsl(var(--alcohol-medium-text))",
            border: "hsl(var(--alcohol-medium-border))",
          },
          high: {
            bg: "hsl(var(--alcohol-high-bg))",
            text: "hsl(var(--alcohol-high-text))",
            border: "hsl(var(--alcohol-high-border))",
          },
        },
        // Semantic color tokens for status indicators
        status: {
          allowed: {
            bg: "hsl(var(--status-allowed-bg))",
            text: "hsl(var(--status-allowed-text))",
            border: "hsl(var(--status-allowed-border))",
          },
          warning: {
            bg: "hsl(var(--status-warning-bg))",
            text: "hsl(var(--status-warning-text))",
            border: "hsl(var(--status-warning-border))",
          },
          required: {
            bg: "hsl(var(--status-required-bg))",
            text: "hsl(var(--status-required-text))",
            border: "hsl(var(--status-required-border))",
          },
          restricted: {
            bg: "hsl(var(--status-restricted-bg))",
            text: "hsl(var(--status-restricted-text))",
            border: "hsl(var(--status-restricted-border))",
          },
        },
        // Premium glass morphism colors using CSS custom properties
        glass: {
          light: {
            bg: "var(--glass-light-bg)",
            border: "var(--glass-light-border)",
            backdrop: "var(--glass-light-backdrop)",
          },
          medium: {
            bg: "var(--glass-medium-bg)",
            border: "var(--glass-medium-border)",
            backdrop: "var(--glass-medium-backdrop)",
          },
          strong: {
            bg: "var(--glass-strong-bg)",
            border: "var(--glass-strong-border)",
            backdrop: "var(--glass-strong-backdrop)",
          },
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)"
          },
          to: {
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "scale-in": {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'premium': '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 8px 32px -4px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Mobile-first responsive utilities
    function({ addUtilities }) {
      addUtilities({
        '.mobile-first': {
          'width': '100%',
          'max-width': '100vw',
          'overflow-x': 'hidden',
        },
        '.glass-effect': {
          'backdrop-filter': 'var(--glass-light-backdrop)',
          'background-color': 'var(--glass-light-bg)',
          'border': '1px solid var(--glass-light-border)',
        },
        '.glass-medium': {
          'backdrop-filter': 'var(--glass-medium-backdrop)',
          'background-color': 'var(--glass-medium-bg)',
          'border': '1px solid var(--glass-medium-border)',
        },
        '.glass-strong': {
          'backdrop-filter': 'var(--glass-strong-backdrop)',
          'background-color': 'var(--glass-strong-bg)',
          'border': '1px solid var(--glass-strong-border)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      })
    }
  ],
}