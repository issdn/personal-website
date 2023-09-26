export const languageImportObject = {
    en: () => import("./languages/en"),
    de: () => import("./languages/de"),
    pl: () => import("./languages/pl"),
} as const


type Translations = keyof typeof languageImportObject
export const languageImportObjectKeys = Object.keys(languageImportObject) as Translations[]

type TranslationShape = typeof import("./languages/en").default;
type TranslationKeys = keyof TranslationShape
export type { Translations, TranslationShape, TranslationKeys };
export { default as texts, language } from "./language"