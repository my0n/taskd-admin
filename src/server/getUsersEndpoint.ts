import { Static, Type } from "@sinclair/typebox";
import { getUsers, orgExists } from "../files/fileApi";
import { isValidIdentifier } from "../validation/isValidIdentifier";
import { EndpointValidationError } from "./EndpointValidationErrorType";
import { EndpointUser } from "./EndpointUserType";
import { FastifyServerType } from "./FastifyServerType";

const UserListParams = Type.Object({
  org: Type.String()
});
type UserListParamsType = Static<typeof UserListParams>;

const UserListReply = Type.Union([
  Type.Object({
    statusCode: Type.Literal(200),
    users: Type.Array(EndpointUser)
  }),
  Type.Object({
    statusCode: Type.Literal(400),
    error: EndpointValidationError
  }),
  Type.Object({
    statusCode: Type.Literal(404),
    error: EndpointValidationError
  })
]);
type UserListReplyType = Static<typeof UserListReply>;

export const getUsersEndpoint = (server: FastifyServerType) => {
  server.get<{
    Params: UserListParamsType;
    Reply: UserListReplyType;
  }>("/orgs/:org/users", async (request, reply) => {
    if (!isValidIdentifier(request.params.org)) {
      reply.status(400);
      return {
        statusCode: 400 as const,
        error: {
          message: "org is not a valid organization name"
        }
      };
    }

    if (!await orgExists(request.params.org)) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: {
          message: "org does not exist"
        }
      };
    }

    return {
      statusCode: 200 as const,
      users: await getUsers(request.params.org)
    };
  });
};