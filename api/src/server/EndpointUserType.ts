import { Static, Type } from "@sinclair/typebox";

export const EndpointUser = Type.Object({
  org: Type.String(),
  uuid: Type.String(),
  name: Type.Optional(Type.String())
});
export type EndpointUserType = Static<typeof EndpointUser>;
