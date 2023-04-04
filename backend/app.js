"use strict";
import Fastify from "fastify";
import cors from "@fastify/cors";
import mercurius from "mercurius";
import schema from "./schema.js";
import resolvers from "./resolvers.js";
import * as cfg from "./config.js";

const app = Fastify();

app.register(cors, {});

app.register(mercurius, { schema, resolvers, graphiql: true });

app.listen({ port: cfg.port });
