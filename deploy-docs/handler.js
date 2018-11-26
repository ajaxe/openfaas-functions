"use strict"

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const process = require("process");
const fs = require("fs");
const path = require("path");
const mime = require('mime-types');
const AWS = require("aws-sdk");
const credsFile = `${__dirname}/aws_credentials`;

const awsCreds = new AWS.SharedIniFileCredentials({
    filename: credsFile
});
const s3Client = new AWS.S3({
    credentials: awsCreds
});
const DocsBucketName = "apogee-dev.com";
const RobotsTxt = "robots.txt";

module.exports = async (context, callback) => {
    let workDir = process.env.LOCAL_REPO;

    console.info("Getting latest documentation");
    startTimer();
    let result = await prepareWorkspace(workDir);
    endTimer();
    if (result.stderr) {
        callback(result.stderr, null);
    }
    console.info("Build MkDocs");
    startTimer();
    result = await buildDocs(workDir);
    endTimer();
    if (result.stderr) {
        callback(result.stderr, null);
    }
    console.info("Clearing S3 bucket");
    startTimer();
    await clearS3Bucket();
    endTimer();

    console.info("Copying files to S3");
    startTimer();
    await Promise.all(copyFiles(`${workDir}/site`));
    endTimer();
};
let startTime, diffTime;
const startTimer = function() {
    startTime = process.hrtime();
};
const endTimer = function() {
    const NS_PER_SEC = 1e9;
    const MSEC_PER_SEC = 1e6;
    diffTime = process.hrtime(startTime);
    console.info(`Duration: ${(diffTime[0] * NS_PER_SEC + diffTime[1]) / MSEC_PER_SEC} msec`);
};

const copyFiles = function(rootdir, subdir) {
    let copyPromises = [];
    const isSubdir = subdir ? true : false;
    const abspath = subdir ? path.join(rootdir, subdir) : rootdir;
    fs.readdirSync(abspath).forEach((filename) => {
        let filepath = path.join(abspath, filename);
        if(fs.statSync(filepath).isDirectory()) {
            let p = copyFiles(rootdir, path.join(subdir || '', filename || ''));
            Array.prototype.push.apply(copyPromises, p);
        }
        else {
            let rf = util.promisify(fs.readFile);
            rf(filepath).then((filecontent) => {
                copyPromises.push(s3Client.putObject({
                    Bucket: DocsBucketName,
                    Key: isSubdir ? `${subdir}/${filename}` : filename,
                    Body: filecontent,
                    ContentType: mime.lookup(filepath)
                }).promise());
            });
        }
    });
    return copyPromises;
};

const prepareWorkspace = async function(workDir) {
    const { stdout, stderr } = await exec('git clean -fdX && git pull', {
        cwd: workDir
    });
    return { stdout, stderr };
};

const buildDocs = async function (workDir) {
    const { stdout, stderr } = await exec('mkdocs build', {
        cwd: workDir
    });
    return { stdout, stderr };
};

const clearS3Bucket = async function () {
    const listResponse = await s3Client.listObjectsV2({
        Bucket: DocsBucketName
    }).promise();

    let keys = [];
    listResponse.Contents.forEach(element => {
        if (RobotsTxt !== element.Key) {
            keys.push({ Key: element.Key });
        }
    });

    if(keys.length === 0) {
        return;
    }

    const deleteResponse = await s3Client.deleteObjects({
        Bucket: DocsBucketName,
        Delete: {
            Objects: keys
        }
    }).promise();

    if (deleteResponse && deleteResponse.Errors && deleteResponse.Errors.length > 0) {
        let errs = deleteResponse.Errors.map(function (val) {
            return {
                key: val.Key,
                code: val.Code,
                message: val.Message
            };
        });
        throw JSON.stringify(errs);
    }
};