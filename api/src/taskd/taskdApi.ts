import { Org, User } from "../types";
import { spawn } from "child_process";
import { assertValidIdentifier } from "../validation/assertValidIdentifier";
import { parseCreateUserMessage } from "./parseCreateUserMessage";
import path from "path/posix";
import { rootDataDir } from "../config";

const cmd = (args: string[], cwd?: string): Promise<{ stdout: string; stderr: string; code: number | null }> => {
  return new Promise((res, rej) => {
    console.log(`cmd: ${JSON.stringify(args)}`);
    let stdout = "";
    let stderr = "";
    const command = spawn(args[0], args.slice(1), { cwd });
    command.stdout.on("data", data => {
      stdout += data;
    });
    command.stderr.on("data", data => {
      stderr += data;
    });
    command.on("close", code => {
      res({
        stdout,
        stderr,
        code
      });
    });
    command.on("error", error => {
      rej(error);
    });
  });
};

export const createOrg = async (org: string): Promise<Org> => {
  assertValidIdentifier("org", org);

  const { stdout, code } = await cmd(["taskd", "add", "org", org]);
  if (code) {
    throw stdout;
  }

  return {
    name: org
  };
};

export const createUser = async (org: string, user: string): Promise<User> => {
  assertValidIdentifier("org", org);
  assertValidIdentifier("user", user);

  const { stdout, code } = await cmd(["taskd", "add", "user", org, user]);
  if (code) {
    throw stdout;
  }

  const parsed = parseCreateUserMessage(stdout);
  if (!parsed.uuid) {
    throw "could not parse generated uuid";
  }

  return {
    org: org,
    uuid: parsed.uuid,
    name: user
  };
};

export const generateCert = async (uuid: string): Promise<boolean> => {
  assertValidIdentifier("uuid", uuid);

  const { stdout, code } = await cmd(["gosu", "taskd", "./generate.client", `generated-${uuid}`], path.join(rootDataDir, "pki"));
  if (code) {
    throw stdout;
  }

  return true;
};
