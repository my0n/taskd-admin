import { Static, Type } from "@sinclair/typebox";
import { getKeyPem, orgExists, userExists } from "../files/fileApi";
import { isValidIdentifier } from "../validation/isValidIdentifier";
import { EndpointBadRequestError } from "./EndpointBadRequestErrorType";
import { EndpointNotFoundError } from "./EndpointNotFoundErrorType";
import { FastifyServerType } from "./FastifyServerType";

const UserKeyPemParams = Type.Object({
  org: Type.String(),
  uuid: Type.String()
});
type UserKeyPemParamsType = Static<typeof UserKeyPemParams>;

const UserKeyPemReply = Type.Union([
  Type.String(),
  EndpointNotFoundError,
  EndpointBadRequestError
]);
type UserKeyPemReplyType = Static<typeof UserKeyPemReply>;

export const getUserKeyPemEndpoint = (server: FastifyServerType) => {
  server.get<{
    Params: UserKeyPemParamsType;
    Reply: UserKeyPemReplyType;
  }>("/orgs/:org/users/:uuid/key.pem", async (request, reply) => {
    if (!isValidIdentifier(request.params.org)) {
      reply.status(400);
      return {
        statusCode: 400 as const,
        error: "Bad Request",
        message: "org is not a valid organization name"
      };
    }

    if (!isValidIdentifier(request.params.uuid)) {
      reply.status(400);
      return {
        statusCode: 400 as const,
        error: "Bad Request",
        message: "uuid is not a valid uuid"
      };
    }

    if (!await orgExists(request.params.org)) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: "org does not exist"
      };
    }

    if (!await userExists(request.params.org, request.params.uuid)) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: "uuid does not exist"
      };
    }

    const pem = await getKeyPem(request.params.uuid);

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