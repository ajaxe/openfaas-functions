// Copyright (c) Alex Ellis 2017. All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2018. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict"
const process = require("process");
const getStdin = require('get-stdin');
const handler = require('./function/handler');

getStdin().then(val => {
    return handler(val, (err, res) => {
        if (err) {
            return console.error(err);
        }

        if (!res) {
            return;
        }

        if (isArray(res) || isObject(res)) {
            console.log(JSON.stringify(res));
        } else {
            process.stdout.write(res);
        }
    });
}).catch(e => {
    console.error(e.stack);
    process.exit(1);
})
.then(function(){
    process.exit();
});

const isArray = (a) => {
    return (!!a) && (a.constructor === Array);
};

const isObject = (a) => {
    return (!!a) && (a.constructor === Object);
};
