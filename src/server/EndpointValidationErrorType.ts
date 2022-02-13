import { Static, Type } from "@sinclair/typebox";

export const EndpointValidationError = Type.Object({
  message: Type.String()
});
export type EndpointValidationErrorType = Static<typeof EndpointValidationError>;
