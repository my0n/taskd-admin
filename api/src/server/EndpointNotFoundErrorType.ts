import { Static, Type } from "@sinclair/typebox";

export const EndpointNotFoundError = Type.Object({
  message: Type.String(),
  error: Type.Literal("Not Found"),
  statusCode: Type.Literal(404)
});
export type EndpointNotFoundErrorType = Static<typeof EndpointNotFoundError>;
