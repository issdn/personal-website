import { languages } from "../translations/languages";

export async function load({ fetch, url }) {
  const lang = url.searchParams.get("lang");
  return {
    ...(await (await fetch(`/api/lang?lang=${lang || "en"}`)).json()),
    languages,
  };
}
