/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
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
			gridTemplateRows: {
				'row-span-13': 'grid-row: span 13 / span 13', // 13 rows
				'span-14': 'repeat(14, 1fr)', // 14 rows
				'span-15': 'repeat(15, 1fr)', // 15 rows
				'span-16': 'repeat(16, 1fr)', // 16 rows
				'span-17': 'repeat(17, 1fr)', // 17 rows
				'span-18': 'repeat(18, 1fr)', // 18 rows
				'span-19': 'repeat(19, 1fr)', // 19 rows
				'span-20': 'repeat(20, 1fr)', // 20 rows
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
}

