import fastify from "fastify";
import { host, port } from "./config";
import { getOrgsEndpoint } from "./server/getOrgsEndpoint";
import { getUsersEndpoint } from "./server/getUsersEndpoint";
import { createOrgEndpoint } from "./server/createOrgEndpoint";
import { createUserEndpoint } from "./server/createUserEndpoint";
import { getUserCertPemEndpoint } from "./server/getUserCertPemEndpoint";
import { getUserKeyPemEndpoint } from "./server/getUserKeyPemEndpoint";
import { getCaCertPemEndpoint } from "./server/getCaCertPemEndpoint";

const server = fastify({
  logger: true
});

getCaCertPemEndpoint(server);
getOrgsEndpoint(server);
getUsersEndpoint(server);
createOrgEndpoint(server);
createUserEndpoint(server);
getUserCertPemEndpoint(server);
getUserKeyPemEndpoint(server);

server.setErrorHandler((error, request, reply) => {
  request.log.info(error);
  reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Unexpected error"
  });
});

server.listen(port, host, () => {
  console.log(`taskd-admin listening on http://${host}:${port}`);
});
