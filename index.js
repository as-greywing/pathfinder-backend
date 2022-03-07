const fastify = require("fastify")({ logger: false });
const axios = require("axios");
const qs = require("query-string");
const network = require("./data/5km-linestring.json");

const { PORT, SEA_ROUTE_URL } = process.env;

fastify.register(require("fastify-cors"), {
  // put your options here
  origin: true,
});

fastify.get("/network", async (request, reply) => {
  return network;
});

fastify.get("/", async (request, reply) => {
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
    await fastify.listen(PORT || 3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
