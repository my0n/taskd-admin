import { readFile, readdir } from "fs/promises";
import path from "path";
import { rootDataDir } from "../config";
import { Org, User } from "../types";
import { assertValidIdentifier } from "../validation/assertValidIdentifier";
import { parseUserConfigFile } from "./parseUserConfigFile";

const orgsDir = path.join(rootDataDir, "orgs");
const pkisDir = path.join(rootDataDir, "pkis");
const userCertPemFile = (uuid: string) => path.join(rootDataDir, "pkis", `generated-${uuid}.cert.pem`);
const userKeyPemFile = (uuid: string) => path.join(rootDataDir, "pkis", `generated-${uuid}.key.pem`);
const usersDir = (org: string) => path.join(rootDataDir, "orgs", org, "users");
const userConfigFile = (org: string, user: string) => path.join(rootDataDir, "orgs", org, "users", user, "config");

export const getOrgs = async (): Promise<Org[]> => {
  const orgs = await readdir(orgsDir);
  return orgs.map(org => ({
    name: org
  }));
};

export const getOrg = async (org: string): Promise<Org | null> => {
  assertValidIdentifier("org", org);
  const orgs = await getOrgs();
  const matches = orgs.filter(o => o.name === org);
  if (!matches || matches.length === 0) {
    return null;
  }
  return matches[0];
};

export const orgExists = async (org: string): Promise<boolean> => {
  assertValidIdentifier("org", org);
  const orgs = await readdir(orgsDir);
  return orgs.some(o => o === org);
};

export const getUsers = async (org: string): Promise<User[]> => {
  assertValidIdentifier("org", org);
  const orgs = await readdir(orgsDir);
  if (!orgs.some(o => o === org)) {
    return [];
  }

  const userDirs = await readdir(usersDir(org));
  const users = await Promise.all(userDirs.map(async uuid => {
    const configStream = await readFile(userConfigFile(org, uuid));
    const configContents = configStream.toString();
    const parsed = parseUserConfigFile(configContents);
    return {
      org: org,
      uuid: uuid,
      name: parsed.name
    };
  }));

  return users;
};

export const userExists = async (org: string, uuid: string): Promise<boolean> => {
  assertValidIdentifier("org", org);
  assertValidIdentifier("uuid", uuid);
  const orgs = await readdir(orgsDir);
  if (!orgs.some(o => o === org)) {
    return false;
  }
  const uuids = await readdir(usersDir(org));
  return uuids.some(o => o === uuid);
};

export const getCertPem = async (uuid: string): Promise<string | null> => {
  assertValidIdentifier("uuid", uuid);
  const files = await readdir(pkisDir);
  if (!files.some(o => o === `generated-${uuid}.cert.pem`)) {
    return null;
  }

  const contentsStream = await readFile(userCertPemFile(uuid));
  return contentsStream.toString();
};

export const getKeyPem = async (uuid: string): Promise<string | null> => {
  assertValidIdentifier("uuid", uuid);
  const files = await readdir(pkisDir);
  if (!files.some(o => o === `generated-${uuid}.key.pem`)) {
    return null;
  }

  const contentsStream = await readFile(userKeyPemFile(uuid));
  return contentsStream.toString();
};
