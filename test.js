var freeStyle = require('./index.js')


freeStyle.getWords('老师',1).then( function (res) {
  console.log(res.length)
})

setTimeout(function(){
  freeStyle.getWords('你好',1).then( function (res) {
    console.log(res.length)
  })
},15000);