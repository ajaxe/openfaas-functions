const h = require('./handler')

const cb = function (err, result) {
  if (err) {
    console.error(err)
    return
  }
  console.log(JSON.stringify(result, null, 2))
}

Promise.resolve().then(function () {
  return h('https://www.artofmanliness.com/articles/the-four-archetypes-of-the-mature-masculine-the-warrior/', cb)
}).catch(e => {
  console.error(e.stack)
  process.exit(1)
}).then(function () {
  process.exit()
})
