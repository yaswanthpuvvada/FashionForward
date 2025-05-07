
import type { Config } from "tailwindcss";

export default {
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#6E59A5',
					foreground: '#FFFFFF',
					100: '#E5DEFF',
					200: '#C9BDFF',
					300: '#AE9CFF',
					400: '#967BF5',
					500: '#6E59A5',
					600: '#5A47A0',
					700: '#473580',
					800: '#352460',
					900: '#221540',
				},
				secondary: {
					DEFAULT: '#F2FCE2',
					foreground: '#403E43',
					500: '#F2FCE2',
					600: '#D9E5CB',
					700: '#B6C2A8',
				},
				accent: {
					DEFAULT: '#F97316',
					foreground: '#FFFFFF',
				},
				destructive: {
					DEFAULT: '#ea384c',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F1F0FB',
					foreground: '#403E43',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: '#6E59A5',
					'primary-foreground': '#FFFFFF',
					accent: '#F1F0FB',
					'accent-foreground': '#403E43',
					border: '#E5DEFF',
					ring: '#967BF5'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				shimmer: {
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				fadeIn: 'fadeIn 0.5s ease-in-out',
				shimmer: 'shimmer 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
