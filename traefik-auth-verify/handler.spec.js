const Handler = require("./handler");

let authHeaderValue = "Basic NDM0MDE0N2M6NzllMDM2ZGQ1OWU1Zjg4YWJlMGY4YTFjNjgxMWY4ZmQ1YjhmMDE4ZQ=="

process.env.Http_Authorization = authHeaderValue;
(async function(){
    await Handler();
})()