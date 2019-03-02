'use strict'
const extractor = require('unfluff')
const url = require('url')
const https = require('https')
const http = require('http')

module.exports = async (context, callback) => {
  try {
    if (!context) {
      throw new Error('invalid url')
    }
    let link = new url.URL(context)
    let htmlFetch = link.protocol.toLowerCase() === 'https:' ? https.get : http.get
    htmlFetch(link.href, function (res) {
      const { statusCode } = res
      if (statusCode !== 200) {
        callback(new Error(`failed to get: ${link.href}, status code: ${statusCode}`), null)
        return
      }
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          const extData = extractor(rawData)
          callback(undefined, extData)
        } catch (e) {
          callback(e.stack, null)
        }
      })
    })
  } catch (err) {
    callback(err.stack, null)
  }
}
