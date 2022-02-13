import fastify from "fastify";
import { host, port } from "./config";
import { getOrgsEndpoint } from "./server/getOrgsEndpoint";
import { getUsersEndpoint } from "./server/getUsersEndpoint";
import { createOrgEndpoint } from "./server/createOrgEndpoint";
import { createUserEndpoint } from "./server/createUserEndpoint";
import { getUserCertPemEndpoint } from "./server/getUserCertPemEndpoint";
import { getUserKeyPemEndpoint } from "./server/getUserKeyPemEndpoint";

const server = fastify({
  logger: true
});

getOrgsEndpoint(server);
getUsersEndpoint(server);
createOrgEndpoint(server);
createUserEndpoint(server);
getUserCertPemEndpoint(server);
getUserKeyPemEndpoint(server);

server.get<{
  Reply: string;
}>("/hello", async (request, reply) => {
  return "hi";
});

server.listen(port, host, () => {
  console.log(`taskd-admin listening on http://${host}:${port}`);
});
