import { writable } from "svelte/store";

const createLanguageStore = () => {
  const { subscribe, set } = writable<string>();
  
  return {
    subscribe,
    set,
  };
};

const language = createLanguageStore();

const translationsStore = () => {
  const { subscribe, set } = writable<TranslationShape>();
  
  return {
    subscribe,
    set,
  };
};

const translations = translationsStore();

export let languages = [] as string[];
export let setLanguages = (langs: string[]) => {
  languages = langs;
};
export default translations;
export { language };
