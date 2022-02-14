import { Endpoint } from "rest-hooks";

type Org = {
  statusCode: number;
  org: {
    name: string;
  };
};

const fetchCreateOrg = (args: { name: string }): Promise<Org> =>
  fetch("http://127.0.0.1:8080/orgs", { method: "POST", body: JSON.stringify(args) }).then(res => res.json());

export const createOrg = new Endpoint(fetchCreateOrg);
