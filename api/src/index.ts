import fastify from "fastify";
import { adminPass, adminUser, host, port } from "./config";
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

server.register(require("fastify-auth"));
server.register(require("fastify-basic-auth"), {
  validate: async (user: string, pass: string, request: any, reply: any) => {
    if (user !== adminUser || pass !== adminPass) {
      return new Error("Login failed");
    }
  }
});

getCaCertPemEndpoint(server);
getOrgsEndpoint(server);
getUsersEndpoint(server);
createOrgEndpoint(server);
createUserEndpoint(server);
getUserCertPemEndpoint(server);
getUserKeyPemEndpoint(server);

server.after(() => {
  server.addHook("preHandler", (server as any).auth([(server as any).basicAuth]));
});

server.setErrorHandler((error, request, reply) => {
  if (error.statusCode === 401) {
    reply.status(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Unauthorized"
    });
  } else {
    request.log.error(error);
    reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Unexpected error"
    });
  }
});

server.listen(port, host, () => {
  console.log(`taskd-admin listening on http://${host}:${port}`);
});
