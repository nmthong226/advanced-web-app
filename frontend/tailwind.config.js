/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	safelist: [
		'row-span-1', 'row-span-2', 'row-span-3',
		'row-span-4', 'row-span-5', 'row-span-6',
		'row-span-7', 'row-span-8', 'row-span-9',
		'row-span-10', 'row-span-11', 'row-span-12',
		'row-span-13', 'row-span-14', 'row-span-15',
		'row-span-16', 'row-span-17', 'row-span-18',
		'row-span-19', 'row-span-20', 'row-span-21',
		'row-span-22', 'row-span-23', 'row-span-24',
		/^row-span-\d{1,2}$/, // Safelist all row-span classes up to two digits
		//Safelist for colors
		'bg-green-600', 'bg-blue-600', 'bg-red-600',
		'bg-purple-600', 'bg-emerald-600', 'bg-sky-600',
		'bg-orange-600', 'bg-amber-600', 'bg-pink-600',
		'bg-rose-600', 'bg-teal-600', 'bg-lime-600',
	],
	theme: {
		extend: {
			transitionProperty: {
				'colors': 'background-color, border-color, color, fill, stroke',
			},
			transitionDuration: {
				'300': '300ms',
				'500': '500ms',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			gridRow: {
				...Array.from({ length: 24 }, (_, i) => i + 1).reduce(
					(acc, num) => ({ ...acc, [`span-${num}`]: `span ${num} / span ${num}` }),
					{}
				),
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
			animation: {
				fadeIn: 'fadeIn 0.5s ease-in-out',
			},
		}
	},
	plugins: [tailwindcssAnimate],
}

