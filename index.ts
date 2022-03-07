import fastify from "fastify";
import axios from "axios";
import qs from "query-string";
import network from "./data/5km-linestring.json";

import { RouteQuery } from "./Types";

const { PORT, SEA_ROUTE_URL } = process.env;

const server = fastify({ logger: false });

/**
 * We need CORS to work with frontend!
 */
server.register(require("fastify-cors"), {
  // put your options here
  origin: true,
});

/**
 * This endpoint simply returns the network json file
 */
server.get("/network", async () => {
  return network;
});

/**
 * This endpoint parrots the response from the sea route endpoint as the response
 */
server.get<{
  Querystring: RouteQuery;
}>("/", async (request, reply) => {
  const { query } = request;
  const { res, suez, panama, nonIRTC, opos, dpos } = query;
  const submit = {
    res: res ?? 5,
    suez: suez ?? 1,
    panama: panama ?? 1,
    nonIRTC: nonIRTC ?? 1,
    opos: opos || "103.7, 1.33333",
    dpos: dpos || "106.718, 10.7587",
  };
  const url = `${SEA_ROUTE_URL}/seaws?${qs.stringify(submit)}`;
  try {
    const { data } = await axios(url);
    return data;
  } catch (error) {
    return {
      status: "fail",
    };
  }
});

// Run the server!
const start = async () => {
  try {
    await server.listen(PORT || 3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
