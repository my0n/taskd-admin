import { Static, Type } from "@sinclair/typebox";
import { isValidIdentifier } from "../validation/isValidIdentifier";
import { EndpointValidationError } from "./EndpointValidationErrorType";
import { FastifyServerType } from "./FastifyServerType";
import { createOrg } from "../taskd/taskdApi";
import { EndpointOrg } from "./EndpointOrgType";

const CreateOrgBody = Type.Object({
  name: Type.String()
});
type CreateOrgBodyType = Static<typeof CreateOrgBody>;

const CreateOrgReply = Type.Union([
  Type.Object({
    statusCode: Type.Literal(200),
    org: EndpointOrg
  }),
  Type.Object({
    statusCode: Type.Literal(400),
    error: EndpointValidationError
  })
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
        error: {
          message: "org is not a valid organization name"
        }
      };
    }

    const org = await createOrg(request.body.name);
    return {
      statusCode: 200 as const,
      org: org
    };
  });
};