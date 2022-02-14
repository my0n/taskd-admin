import { Static, Type } from "@sinclair/typebox";
import { getOrgs } from "../files/fileApi";
import { EndpointOrg } from "./EndpointOrgType";
import { FastifyServerType } from "./FastifyServerType";

const OrgListReply = Type.Object({
  statusCode: Type.Literal(200),
  orgs: Type.Array(EndpointOrg)
})
type OrgListReplyType = Static<typeof OrgListReply>;

export const getOrgsEndpoint = (server: FastifyServerType) => {
  server.get<{
    Reply: OrgListReplyType;
  }>("/orgs", async (request, reply) => {
    const orgs = await getOrgs();
    return {
      statusCode: 200,
      orgs: orgs
    };
  });
};