import { parseCreateUserMessage } from "./parseCreateUserMessage";

describe("parseCreateUserMessage", () => {
  test("parses undefined message contents", () => {
    expect(parseCreateUserMessage(undefined!)).toEqual({
      uuid: undefined
    });
  });
  test("parses null message contents", () => {
    expect(parseCreateUserMessage(null!)).toEqual({
      uuid: undefined
    });
  });
  test("parses empty message contents", () => {
    expect(parseCreateUserMessage("")).toEqual({
      uuid: undefined
    });
  });
  test("parses normal message contents", () => {
    expect(parseCreateUserMessage(
      "New user key: 81eeb70e-200f-4b34-89a3-8bba3dbaae39\n" +
      "Created user 'myepicbro' for organization 'Bruh2'\n")).toEqual({
      uuid: "81eeb70e-200f-4b34-89a3-8bba3dbaae39"
    });
  });
});
