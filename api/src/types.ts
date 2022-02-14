export type Org = {
  name: string;
};

export type User = {
  org: string;
  uuid: string;
  name?: string;
};
