var freeStyle = require('./index.js')


freeStyle.getWords('小程序','single').then( function (res) {
  console.log(res)
})

setTimeout(function(){
  freeStyle.getWords('运动', 'full').then( function (res) {
    console.log(res)
  })
},15000);