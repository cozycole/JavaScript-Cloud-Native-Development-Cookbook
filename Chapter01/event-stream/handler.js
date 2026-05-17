const aws = require("aws-sdk");
const uuid = require("uuid");

module.exports.publish = (event, context, callback) => {
  console.log("event: %j", event);
  const payload = typeof event === "string" ? JSON.parse(event) : event;
  const e = {
    id: uuid.v1(),
    partitionKey: payload.partitionKey || uuid.v4(),
    timestamp: Date.now(),
    tags: {
      region: process.env.AWS_REGION,
    },
    ...payload,
  };

  console.log("event: %j", e);

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: e.partitionKey,
    Data: Buffer.from(JSON.stringify(e)),
  };

  console.log("params: %j", params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecord(params, callback);
};
