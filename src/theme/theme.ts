export interface objectTheme {
	colors: objectColors,
}

export interface objectColors {
	primary: string,
	secondary: string,
	background: background,
	text: objectText,
	error: string,
}

export interface background {
	main: string,
	transparent: string,
}

export interface objectText {
	dark: string,
	light: string,
	main: string,
}

export const theme: objectTheme = {
	colors: {
		primary: '#00AA5B',
		secondary: '#C9FDE0',
		background: {
			transparent: 'rgba(0,0,0,0.5)',
			main: '#F7FAFF',
		},
		text: {
			dark: '#959694',
			light: '#ffffff',
			main: '#474f47',
		},
		error: 'red',
	},
};
