export const parseUserConfigFile = (contents: string) => {
  if (!contents) {
    return {
      name: undefined
    };
  }

  const userMatch = /user=([^\n]+)/.exec(contents);
  return {
    name: (userMatch && userMatch.length > 1) ? userMatch[1] : undefined
  };
};
