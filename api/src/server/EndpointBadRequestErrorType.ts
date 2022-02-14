import { Static, Type } from "@sinclair/typebox";

export const EndpointBadRequestError = Type.Object({
  message: Type.String(),
  error: Type.Literal("Bad Request"),
  statusCode: Type.Literal(400)
});
export type EndpointBadRequestErrorType = Static<typeof EndpointBadRequestError>;
