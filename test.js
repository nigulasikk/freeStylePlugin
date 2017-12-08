var freeStyle = require('./index.js')



freeStyle.getWords('老娘舅','full').then( function (res) {
  console.log(res)
})

setTimeout(() => {

  freeStyle.getWords('白头发','en').then( function (res) {
    console.log(res)
  })

  freeStyle.getWords('小程序','single').then( function (res) {
    console.log(res)
  })

}, 15000)
