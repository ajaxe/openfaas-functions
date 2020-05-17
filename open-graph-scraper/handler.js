"use strict";

const ogs = require("open-graph-scraper");

let execute = async function (url) {
  var options = { url: url, headers: { "accept-language": "en" } };
  return ogs(options).then(function (result) {
    return result;
  });
};

module.exports = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));
  const result = {
    data: await execute(event.body),
  };

  return context.status(200).succeed(result);
};
