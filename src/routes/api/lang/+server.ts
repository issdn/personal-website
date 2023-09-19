import { json } from "@sveltejs/kit";
import { translations, languages } from "../../../translations";

export async function GET({ url, setHeaders }) {
  setHeaders({
    "Cache-Control": "public, max-age=604800",
  });
  const lang = url.searchParams.get("lang");
  if (!languages.includes(lang || "")) {
    return json({
      translation: translations["en"],
      lang: "en",
    });
  }
  return json({
    translation: translations[lang as keyof typeof translations],
    lang: lang,
  });
}
