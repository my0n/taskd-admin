import { FastifyInstance, FastifyLoggerInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";

export type FastifyServerType = FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>;