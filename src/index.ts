import "reflect-metadata";
import "dotenv/config";

import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { notFound } from "./middlewares/response";

import { buildDataLoaders } from "./db/dataLoader";
import { buildSchema } from "type-graphql";
import { Context } from "./types/Context";
import { getUserFromToken } from "./utils/getUserFromToken";
import { authChecker } from "./utils/authChecker";
import dataSource from "./db/dataSource";
import logger from "./logger";

import resolvers from "./resolvers";

const port = process.env.PORT || 5000;

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  dataSource
    .initialize()
    .then(async () => {
      logger.info("DataSource initialize successfully.");
    })
    .catch(error =>
      logger.error("Error during DataSource initialization:", error)
    );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: resolvers,
      authChecker: authChecker,
      validate: false
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  await server.start();

  app.use(
    "/graph",
    cors(),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<Context> => {
        let user = null;
        let error = null;
        try {
          user = await getUserFromToken(req.headers.authorization as string);
        } catch (err) {
          error = err;
        }
        return {
          token: req.headers.authorization,
          request: req,
          response: res,
          dataLoaders: buildDataLoaders(),
          user,
          error
        };
      }
    })
  );

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(compression);

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(notFound);

  // Modified server startup
  await new Promise(resolve =>
    httpServer.listen({ port: port }, resolve as () => void)
  );
  logger.info(`Server is listening on port ${port}! Graphql is ready on localhost:${port}/graph`);
}

start().catch(err => logger.error("Server startup error:", err));
