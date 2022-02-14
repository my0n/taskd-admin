import { Static, Type } from "@sinclair/typebox";
import { isValidIdentifier } from "../validation/isValidIdentifier";
import { FastifyServerType } from "./FastifyServerType";
import { createOrg } from "../taskd/taskdApi";
import { EndpointOrg } from "./EndpointOrgType";
import { EndpointBadRequestError } from "./EndpointBadRequestErrorType";
import { orgExists } from "../files/fileApi";

const CreateOrgBody = Type.Object({
  name: Type.String()
});
type CreateOrgBodyType = Static<typeof CreateOrgBody>;

const CreateOrgReply = Type.Union([
  Type.Object({
    statusCode: Type.Literal(200),
    org: EndpointOrg
  }),
  EndpointBadRequestError
]);
type CreateOrgReplyType = Static<typeof CreateOrgReply>;

export const createOrgEndpoint = (server: FastifyServerType) => {
  server.post<{
    Body: CreateOrgBodyType;
    Reply: CreateOrgReplyType;
  }>("/orgs", async (request, reply) => {
    if (!isValidIdentifier(request.body.name)) {
      reply.status(400);
      return {
        statusCode: 400 as const,
        error: "Bad Request",
        message: "org is not a valid organization name"
      };
    }

    if (await orgExists(request.body.name)) {
      reply.status(400);
      return {
        statusCode: 400 as const,
        error: "Bad Request",
        message: "org already exists"
      }
    }

    const org = await createOrg(request.body.name);
    return {
      statusCode: 200 as const,
      org: org
    };
  });
};