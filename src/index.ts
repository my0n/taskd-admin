import fastify from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { getOrgs } from "./fileApi";

const port = 8080;
const host = "0.0.0.0";

const server = fastify();

const OrgList = Type.Array(Type.Object({
  name: Type.String()
}));
type OrgListType = Static<typeof OrgList>;
server.get<{
  Reply: OrgListType;
}>("/orgs", (request, reply) => {
  return getOrgs();
});

server.get<{
  Reply: string;
}>("/hello", async (request, reply) => {
  return "hi";
});

server.listen(port, host, () => {
  console.log(`taskd-admin listening on http://${host}:${port}`);
});
