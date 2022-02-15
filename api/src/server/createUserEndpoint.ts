import { Static, Type } from "@sinclair/typebox";
import { orgExists } from "../files/fileApi";
import { isValidIdentifier } from "../validation/isValidIdentifier";
import { EndpointNotFoundError } from "./EndpointNotFoundErrorType";
import { EndpointUser } from "./EndpointUserType";
import { FastifyServerType } from "./FastifyServerType";
import { createUser, generateCert } from "../taskd/taskdApi";
import { EndpointBadRequestError } from "./EndpointBadRequestErrorType";

const CreateUserParams = Type.Object({
  org: Type.String()
});
type CreateUserParamsType = Static<typeof CreateUserParams>;

const CreateUserBody = Type.Object({
  name: Type.String()
});
type CreateUserBodyType = Static<typeof CreateUserBody>;

const CreateUserReply = Type.Union([
  Type.Object({
    statusCode: Type.Literal(200),
    user: EndpointUser
  }),
  EndpointNotFoundError,
  EndpointBadRequestError
]);
type CreateUserReplyType = Static<typeof CreateUserReply>;

export const createUserEndpoint = (server: FastifyServerType) => {
  server.post<{
    Params: CreateUserParamsType;
    Body: CreateUserBodyType;
    Reply: CreateUserReplyType;
  }>("/orgs/:org/users", async (request, reply) => {
    if (!isValidIdentifier(request.body.name)) {
      reply.status(400);
      return {
        statusCode: 400 as const,
        error: "Bad Request",
        message: `name '${request.body.name}' is not a valid username`
      };
    }

    if (!isValidIdentifier(request.params.org) || !await orgExists(request.params.org)) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: `org '${request.params.org}' does not exist`
      };
    }

    const user = await createUser(request.params.org, request.body.name);
    await generateCert(user.uuid);

    return {
      statusCode: 200 as const,
      user: user
    };
  });
};