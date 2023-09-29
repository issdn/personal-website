import { beforeEach, describe, expect, test } from "vitest";
import { texts } from ".";
import { get } from "svelte/store";
import en from "./languages/en.js"
import de from "./languages/de.js"

describe("testing translation api", () => {
  beforeEach(() => {
    texts.set(en)
  })
  test("texts store should return english translation", () => {    
    expect(get(texts)["submit"]).toBe("Submit");
  });
  test("texts store should return german translation", () => {
    texts.set(de)
    expect(get(texts)["submit"]).toBe("Einreichen");
  });
});
