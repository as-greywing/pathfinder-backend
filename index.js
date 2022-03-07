const fastify = require("fastify")({ logger: false });
const _ = require("lodash");
const axios = require("axios");
const qs = require("query-string");
// const network = require("./data/network-5km.json");
const network = require("./data/5km-linestring.json");

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
  const url = `http://139.59.193.83/seaws?${qs.stringify(submit)}`;
  console.log("sending", url);
  try {
    const { data } = await axios(url);
    console.log("result is", data);
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
    await fastify.listen(3123);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
