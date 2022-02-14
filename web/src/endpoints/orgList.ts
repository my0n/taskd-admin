import { Endpoint } from "rest-hooks";

type OrgList = {
  statusCode: number;
  orgs: {
    name: string;
  }[];
};

const fetchOrgList = (): Promise<OrgList> =>
  fetch("http://127.0.0.1:8080/orgs").then(res => res.json());

export const orgList = new Endpoint(fetchOrgList);
