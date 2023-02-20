import { writable } from 'svelte/store';

export const languages = ['en', 'de', 'pl'] as const;
export type Languages = (typeof languages)[number];

const translations = {
	deleteAll: { en: 'Delete all', de: 'Alles löschen', pl: 'Usuń wszystko' },
	submit: { en: 'Submit', de: 'Einreichen', pl: 'Prześlij' },
	erase: { en: 'Erase', de: 'Löschen', pl: 'Wymaż' },
	drag: { en: 'Drag', de: 'Ziehen', pl: 'Przeciągnij' },
	title: { en: "Hi, I'm Karol", de: 'Hallo, ich bin Karol', pl: 'Cześć, jestem Karol' },
	painterInfo: {
		en: 'Paint over my website for EVERYONE to see (after verification).',
		de: 'Malen Sie über meine Website, damit JEDER sie sehen kann (nach Überprüfung).',
		pl: 'Namaluj na mojej stronie internetowej, aby KAŻDY mógł ją zobaczyć (po weryfikacji).'
	},
	mainPar: {
		en: `I like to tinker, build and think. 
            You can contact me in Polish, German or English at karol.bielski@gmx.de.`,
		de: `Ich mag es zu basteln, zu bauen und zu denken.
            Du kannst mich auf Polnisch, Deutsch oder Englisch unter karol.bielski@gmx.de kontaktieren.`,
		pl: `Lubię majsterkować, budować i myśleć.
            Możesz się ze mną skontaktować po polsku, niemiecku lub angielsku pod adresem karol.bielski@gmx.de`
	},
	skillsTitle: {
		en: 'Some stuff I know:',
		de: 'Einige Sachen die ich kenne:',
		pl: 'Kilka rzeczy które znam:'
	},
	skills: {
		en: `Typescript, Python, FastAPI, Nodejs, React, Svelte, Vercel Ecosystem, Docker... 
            and couple more that I’ve played around with and which you can check on my Github.`,
		de: `Typescript, Python, FastAPI, Nodejs, React, Svelte, Vercel Ecosystem, Docker...
            und noch ein paar mehr, mit denen ich herumgespielt habe und die du auf meinem Github nachsehen kannst.`,
		pl: `Typescript, Python, FastAPI, Nodejs, React, Svelte, Vercel Ecosystem, Docker...
            i kilka innych, które możesz sprawdzić na moim Githubie.`
	},
	githubProfile: {
		en: 'Github profile',
		de: 'Github Profil',
		pl: 'Profil na Githubie'
	},
	LinkedInProfile: {
		en: 'LinkedIn profile',
		de: 'LinkedIn Profil',
		pl: 'Profil na LinkedIn'
	},
	CVDownload: {
		en: 'Download my CV',
		de: 'Mein Lebenslauf herunterladen',
		pl: 'Pobierz moje CV'
	}
} as const;

export type Translations = keyof typeof translations;

const createLanguageStore = (defaultLanguage = languages[0]) => {
	const { subscribe, set, update } = writable<Languages>(defaultLanguage);

	return {
		subscribe,
		set,
		update
	};
};

const language = createLanguageStore();
export const translator = (language: Languages) => (key: Translations) =>
	translations[key][language];
export default language;
