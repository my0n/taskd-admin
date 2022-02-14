import { parseUserConfigFile } from "./parseUserConfigFile";

describe("parseUserConfigFile", () => {
  test("parses undefined file contents", () => {
    expect(parseUserConfigFile(undefined!)).toEqual({
      name: undefined
    });
  });
  test("parses null file contents", () => {
    expect(parseUserConfigFile(null!)).toEqual({
      name: undefined
    });
  });
  test("parses empty file", () => {
    expect(parseUserConfigFile("")).toEqual({
      name: undefined
    });
  });
  test("parses file without user field", () => {
    expect(parseUserConfigFile("country=france")).toEqual({
      name: undefined
    });
  });
  test("parses file with user field", () => {
    expect(parseUserConfigFile("user=ben")).toEqual({
      name: "ben"
    });
  });
  test("parses file with user field and other fields", () => {
    expect(parseUserConfigFile(
      "title=sir\n" +
      "user=ben\n" +
      "country=france")).toEqual({
      name: "ben"
    });
  });
  test("parses file with many user fields", () => {
    expect(parseUserConfigFile(
      "user=ben\n" +
      "user=benjamin")).toEqual({
      name: "ben"
    });
  });
});
