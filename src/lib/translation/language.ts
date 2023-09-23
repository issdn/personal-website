import { writable } from "svelte/store";
import type { TranslationShape, Translations } from ".";

const createLanguageStore = () => {
  const { subscribe, set } = writable<Translations>();
  
  return {
    subscribe,
    set,
  };
};

const language = createLanguageStore();

const textsStore = () => {
  const { subscribe, set } = writable<TranslationShape>();
  
  return {
    subscribe,
    set,
  };
};

const texts = textsStore();

// let fetchedLanguages = [] as Translations;
// const setFetchedLanguages = (newLanguages: string[]) => {
//   fetchedLanguages = newLanguages;
// };
export default texts;
export { language };
