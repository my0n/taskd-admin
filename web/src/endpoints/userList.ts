import { Endpoint } from "rest-hooks";

type UserList = {
  statusCode: number;
  users: {
    org: string;
    name?: string;
    uuid: string;
  }[];
};

const fetchUserList = (args: { org: string }): Promise<UserList> =>
  fetch(`http://127.0.0.1:8080/orgs/${args.org}/users`).then(res => res.json());

export const userList = new Endpoint(fetchUserList);
