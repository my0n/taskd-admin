import { readFile, readdir } from "fs/promises";
import path from "path";

const rootDataDir = "/var/taskd";

const orgsDir = path.join(rootDataDir, "orgs");
const usersDir = (org: string) => path.join(rootDataDir, "orgs", org, "users");
const userConfigFile = (org: string, user: string) => path.join(rootDataDir, "orgs", org, "users", user, "config");

export type Org = {
  name: string;
};

export type User = {
  name?: string;
};

export const getOrgs = async (): Promise<Org[]> => {
  const orgs = await readdir(orgsDir);
  return orgs.map(org => ({
    name: org
  }));
};

export const getUsers = async (org: string): Promise<User[]> => {
  const orgs = await readdir(orgsDir);
  if (!orgs.some(o => o === org)) {
    throw `org does not exist`;
  }

  const userDirs = await readdir(usersDir(org));
  const users = await Promise.all(userDirs.map(async dir => {
    const configStream = await readFile(userConfigFile(org, dir));
    const configContents = configStream.toString();

    const match = /user=([^\n]+)/.exec(configContents);
    if (!match || match.length === 0) {
      return {
        name: undefined
      };
    }

    return {
      name: match[0]
    };
  }));

  return users;
};
