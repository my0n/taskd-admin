import { isValidIdentifier } from "./isValidIdentifier";

describe("isValidIdentifier", () => {
  test("empty string fails", () => {
    expect(isValidIdentifier("")).toBeFalsy();
  });
  test("whitespace fails", () => {
    expect(isValidIdentifier("  ")).toBeFalsy();
  });
  test("normal word passes", () => {
    expect(isValidIdentifier("apple")).toBeTruthy();
  });
  test("words with spaces fails", () => {
    expect(isValidIdentifier("tim apple")).toBeFalsy();
  });
  test("spaces before word fails", () => {
    expect(isValidIdentifier(" apple")).toBeFalsy();
  });
  test("spaces after word fails", () => {
    expect(isValidIdentifier("apple ")).toBeFalsy();
  });
  test("letters and numbers passes", () => {
    expect(isValidIdentifier("apple123")).toBeTruthy();
  });
  test("hyphens pass", () => {
    expect(isValidIdentifier("-")).toBeTruthy();
  });
  test("underscores pass", () => {
    expect(isValidIdentifier("_")).toBeTruthy();
  });
  test("words with all types of character pass", () => {
    expect(isValidIdentifier("apple-123_MIcROsOfT")).toBeTruthy();
  });
  test("max of 64 characters", () => {
    expect(isValidIdentifier("thissentenceisexactlysixtyfivecharacterslongarentyouimpressedhaha")).toBeFalsy();
  });
});
