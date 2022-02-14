import fastify from "fastify";
import { host, port } from "./config";
import { getOrgsEndpoint } from "./server/getOrgsEndpoint";
import { getUsersEndpoint } from "./server/getUsersEndpoint";
import { createOrgEndpoint } from "./server/createOrgEndpoint";
import { createUserEndpoint } from "./server/createUserEndpoint";
import { getUserCertPemEndpoint } from "./server/getUserCertPemEndpoint";
import { getUserKeyPemEndpoint } from "./server/getUserKeyPemEndpoint";
import fastifyStatic from "fastify-static";
import path from "path/posix";

const server = fastify({
  logger: true
});

getOrgsEndpoint(server);
getUsersEndpoint(server);
createOrgEndpoint(server);
createUserEndpoint(server);
getUserCertPemEndpoint(server);
getUserKeyPemEndpoint(server);

server.register(fastifyStatic, {
  root: path.join(__dirname, "..", "..", "web", "build")
});

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
