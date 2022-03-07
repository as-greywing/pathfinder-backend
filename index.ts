import fastify from "fastify";
import axios from "axios";
import qs from "query-string";

import { NetworkParams, RouteQuery } from "./Types";

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
 * This endpoint returns the network json file based on the requested resoluton
 * @params {number} res - either one of 5, 10, 20, 50
 * return json/geojson
 */
const schema = {
  params: {
    type: "object",
    additionalProperties: false,
    required: ["res"],
    properties: { res: { type: "number" } },
  },
};
server.get<{
  Params: NetworkParams;
}>("/network/:res", { schema }, async (request, reply) => {
  const { params } = request;
  try {
    console.log(`Retrieving ${params.res}km file.`);
    const network = require(`./data/network-${params.res}km-linestring.json`);
    return network;
  } catch (error) {
    reply.code(404).send({ message: "Not Found" });
  }
});

server.get("/network", async (request, reply) => {
  try {
    console.log(`Retrieving 50km file.`);
    const network = require(`./data/network-50km-linestring.json`);
    return network;
  } catch (error) {
    reply.code(404).send({ message: "Not Found" });
  }
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
