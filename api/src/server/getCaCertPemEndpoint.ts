import { Static, Type } from "@sinclair/typebox";
import { getCaCertPem } from "../files/fileApi";
import { EndpointNotFoundError } from "./EndpointNotFoundErrorType";
import { FastifyServerType } from "./FastifyServerType";

const CaCertPemReply = Type.Union([
  Type.String(),
  EndpointNotFoundError
]);
type CaCertPemReplyType = Static<typeof CaCertPemReply>;

export const getCaCertPemEndpoint = (server: FastifyServerType) => {
  server.get<{
    Reply: CaCertPemReplyType;
  }>("/ca.cert.pem", async (request, reply) => {
    const pem = await getCaCertPem();

    if (!pem) {
      reply.status(404);
      return {
        statusCode: 404 as const,
        error: "Not Found",
        message: "ca.cert.pem does not exist"
      };
    }

    return pem;
  });
};