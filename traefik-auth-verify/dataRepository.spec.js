const DataRepository = require('./dataRepository')

let userId = '4340147c'
let repo = new DataRepository();

(async function () {
  let u = await repo.getCredentialById(userId)
  console.log('user found: ' + JSON.stringify(u))
})()
