import { writable } from "svelte/store";
import type { TranslationShape, Translations } from ".";

const createLanguageStore = () => {
  const { subscribe, set: _set } = writable<Translations>();
  
  const set = (newLanguage: Translations) => {
    if(document) {
      document.getElementsByTagName("html")[0].setAttribute("lang", newLanguage)
    }
    _set(newLanguage)
  }

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

export default texts;
export { language };
