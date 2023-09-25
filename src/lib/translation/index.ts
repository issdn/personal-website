enum Translations {
    EN = "en",
    DE = "de",
    PL = "pl"
}

type TranslationShape = typeof import("./en.json");
type TranslationKeys = keyof TranslationShape
export { Translations, type TranslationShape, type TranslationKeys };
export { default as texts, language } from "./language"