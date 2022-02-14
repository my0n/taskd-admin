export const isValidIdentifier = (identifier: string) => {
  return identifier && identifier.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(identifier);
};
