import { Static, Type } from "@sinclair/typebox";

export const EndpointOrg = Type.Object({
  name: Type.String()
});
export type EndpointOrgType = Static<typeof EndpointOrg>;
