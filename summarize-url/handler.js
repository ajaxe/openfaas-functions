'use strict'

const https = require('https')
const url = require('url')

const summaizerUrl = 'https://faas.apogee-dev.com/function/summarizer'
const unfluffUrl = 'https://faas.apogee-dev.com/function/unfluff'

const httpsPost = function (href, data) {
  let urlParsed = new url.URL(href)
  let options = {
    hostname: urlParsed.hostname,
    port: urlParsed.port,
    path: urlParsed.pathname,
    method: 'POST'
  }
  return new Promise(function (resolve, reject) {
    let req = https.request(options, (res) => {
      const { statusCode } = res
      if (statusCode !== 200) {
        reject(new Error(`request to url: [${url}] failed. statusCode: ${statusCode}`))
        return
      }
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          resolve(rawData)
        } catch (e) {
          reject(e)
        }
      })
    })
    req.write(data)
    req.end()
  })
}

const callUnfluff = function (hrefToExtract) {
  return httpsPost(unfluffUrl, hrefToExtract)
    .then(function (data) {
      const parsedData = JSON.parse(data)
      return Promise.resolve(parsedData)
    })
}

const callSummarizer = function (text) {
  return httpsPost(summaizerUrl, text)
    .then(function (data) {
      return Promise.resolve(JSON.parse(data))
    })
}

module.exports = (context, callback) => {
  let c1 = callUnfluff(context)
  let c2 = c1.then(function (jsonData) {
    return callSummarizer(jsonData.text)
  })
  Promise.all([c1, c2]).then(function (values) {
    let unfluff = values[0]
    let summarized = values[1]
    delete unfluff.text
    let r = Object.assign({}, unfluff, { summary: summarized })
    callback(null, r)
  }).catch(function (e) {
    callback({ error: e.stack }, null)
  })
}
