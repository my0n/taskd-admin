import { Static, Type } from "@sinclair/typebox";
import { getUserKeyPem, orgExists, userExists } from "../files/fileApi";
import { isValidIdentifier } from "../validation/isValidIdentifier";
import { EndpointNotFoundError } from "./EndpointNotFoundErrorType";
import { FastifyServerType } from "./FastifyServerType";

const UserKeyPemParams = Type.Object({
  org: Type.String(),
  uuid: Type.String()
});
type UserKeyPemParamsType = Static<typeof UserKeyPemParams>;

const UserKeyPemReply = Type.Union([
  Type.String(),
  EndpointNotFoundError
]);
type UserKeyPemReplyType = Static<typeof UserKeyPemReply>;

export const getUserKeyPemEndpoint = (server: FastifyServerType) => {
  server.get<{
    Params: UserKeyPemParamsType;
    Reply: UserKeyPemReplyType;
  }>("/orgs/:org/users/:uuid/key.pem", async (request, reply) => {
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

    const pem = await getUserKeyPem(request.params.uuid);

    if (!pem) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: "key.pem does not exist for this user"
      };
    }

    return pem;
  });
};