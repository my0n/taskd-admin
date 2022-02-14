import { isValidIdentifier } from "./isValidIdentifier";

export const assertValidIdentifier = (parameterName: string, identifier: string) => {
  if (!isValidIdentifier(identifier)) {
    throw `${parameterName} is not a valid identifier: must be a string of alphanumeric characters, -, or _, with a length between 1 and 64 characters (inclusive)`;
  }
};