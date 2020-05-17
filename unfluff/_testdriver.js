const h = require("./handler");

const cb = function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(JSON.stringify(result, null, 2));
};

Promise.resolve()
  .then(function () {
    return h(
      "https://devdutt.com/articles/from-kali-to-krishna-a-love-song/",
      cb
    );
  })
  .catch((e) => {
    console.error(e.stack);
    process.exit(1);
  })
  .then(function () {
    process.exit();
  });
