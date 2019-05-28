'use strict'
const extractor = require('unfluff')
const url = require('url')
const https = require('https')
const http = require('http')

const httpsGetAsync = function (url, options) {
  return new Promise(function (resolve, reject) {
    https.get(url, options, function (resp) {
      if (checkStatus(url, resp, reject)) {
        resolve(resp)
      }
    })
  })
}

const httpGetAsync = function (url, options) {
  return new Promise(function (resolve, reject) {
    http.get(url, options, function (resp) {
      if (checkStatus(url, resp, reject)) {
        resolve(resp)
      }
    })
  })
}

const execute = async function (context) {
  try {
    if (!context) {
      throw new Error('invalid url')
    }
    let link = new url.URL(context)
    let requestOpts = {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
      }
    }
    let resp = null
    if (link.protocol && link.protocol.toLowerCase() === 'https:') {
      resp = await httpsGetAsync(link, requestOpts)
    } else {
      resp = await httpGetAsync(link, requestOpts)
    }
    return processResponse(resp, link)
  } catch (err) {
    throw err
  }
}

const processResponse = async function (res, link) {
  return new Promise(function (resolve, reject) {
    if (checkStatus(link.href, res, reject)) {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          const extData = extractor(rawData)
          delete extData.softTitle
          delete extData.image
          delete extData.tags
          delete extData.links
          delete extData.videos
          delete extData.canonicalLink
          delete extData.lang
          resolve(extData)
        } catch (e) {
          reject(e)
        }
      })
    }
  })
}

const checkStatus = function (url, res, reject) {
  const { statusCode } = res
  if (statusCode !== 200) {
    res.resume()
    reject(new Error(`failed to get: ${url}, status code: ${statusCode}`))
    return false
  }
  return true
}
module.exports = (context, callback) => {
  return execute(context)
    .then((result) => callback(null, result))
    .catch((err) => callback(err, null))
}
