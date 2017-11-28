var freeStyle = require('./index.js')


freeStyle.getWords('比特福','en').then( function (res) {
  console.log(res)
})


freeStyle.getWords('小程序','full').then( function (res) {
  console.log(res)
})


freeStyle.getWords('小程序','single').then( function (res) {
  console.log(res)
})

