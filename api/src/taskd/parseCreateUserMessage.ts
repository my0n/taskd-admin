export const parseCreateUserMessage = (contents: string) => {
  if (!contents) {
    return {
      uuid: undefined
    };
  }

  const uuidMatch = /New user key: ([a-f0-9-]+)/.exec(contents);
  return {
    uuid: (uuidMatch && uuidMatch.length > 1) ? uuidMatch[1] : undefined
  };
};
