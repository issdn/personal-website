/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',

	theme: {
		extend: {
			backgroundImage: {
				special:
					'linear-gradient(60deg, rgba(108,145,56,1) 30%, rgba(93,56,145,1) 40%, rgba(93,56,145,1) 60%, rgba(108,145,56,1) 70%)'
			},
			transitionProperty: {
				width: 'width',
				wh: 'width, height'
			},
			keyframes: {
				width: {
					0: { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				background: {
					'0%': {
						'background-position': '0% 50%'
					},
					'100%': {
						'background-position': '100% 50%'
					}
				}
			},
			animation: {
				background: 'background 2s linear infinite'
			},
			fontFamily: {
				primary: 'Rubik, arial, sans-serif',
				secondary: 'Roboto Mono'
			},
			colors: {
				primary: '#5D3891',
				accent: '#F99417',
				'accent-secondary': '#D9D9D9',
				light: '#E8E2E2',
				dark: '#1a1a1a',
				'accent-secondary-dark': '#232323'
			},
			dropShadow: {
				'md-light': ['0 4px 3px rgb(232 226 226 / 0.07)', '0 2px 2px rgb(232 226 226 / 0.06)']
			},
			boxShadow: {
				'indication-sm': '0 0 0 5px rgba(232, 226, 226, 0.25)',
				'indication-sm-dark': '0 0 0 5px rgba(26, 26, 26, 0.25)',
				'indication-md': '0 0 0 8px rgba(232, 226, 226, 0.25)',
				'indication-md-dark': '0 0 0 8px rgba(26, 26, 26, 0.25)',
				'special-primary': '3px 3px 0 rgba(93, 56, 145, 1)',
				'special-dark': '3px 3px 0 rgba(26, 26, 26, 1)',
				'special-light': '3px 3px 0 rgba(232, 226, 226, 1)'
			},
			height: {
				'icon-xs': '20px',
				'icon-sm': '24px',
				'icon-md': '40px',
				'icon-lg': '48px'
			}
		}
	},
	plugins: []
};
