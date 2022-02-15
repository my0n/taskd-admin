import { Static, Type } from "@sinclair/typebox";
import { getUserCertPem, orgExists, userExists } from "../files/fileApi";
import { isValidIdentifier } from "../validation/isValidIdentifier";
import { EndpointNotFoundError } from "./EndpointNotFoundErrorType";
import { FastifyServerType } from "./FastifyServerType";

const UserCertPemParams = Type.Object({
  org: Type.String(),
  uuid: Type.String()
});
type UserCertPemParamsType = Static<typeof UserCertPemParams>;

const UserCertPemReply = Type.Union([
  Type.String(),
  EndpointNotFoundError
]);
type UserCertPemReplyType = Static<typeof UserCertPemReply>;

export const getUserCertPemEndpoint = (server: FastifyServerType) => {
  server.get<{
    Params: UserCertPemParamsType;
    Reply: UserCertPemReplyType;
  }>("/orgs/:org/users/:uuid/cert.pem", async (request, reply) => {
    if (!isValidIdentifier(request.params.org) || !await orgExists(request.params.org)) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: `org '${request.params.org}' does not exist`
      };
    }

    if (!isValidIdentifier(request.params.uuid) || !await userExists(request.params.org, request.params.uuid)) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: `uuid '${request.params.uuid}' does not exist in org '${request.params.org}'`
      };
    }

    const pem = await getUserCertPem(request.params.uuid);

    if (!pem) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: "cert.pem does not exist for this user"
      };
    }

    return pem;
  });
};