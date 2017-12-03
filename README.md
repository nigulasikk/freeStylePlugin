# freeStylePlugin
中文韵脚搜词插件
#### 安装
* 用 [`npm`](https://www.npmjs.com/get-npm)安装:

  ```console
  $ npm install free-style-plugin
  ```

 可以这么用:
  ```js
  var freeStyle = require('free-style-plugin')
  freeStyle.getWords('单词','full').then( function (res) {
      console.log(res)
  })  
  ```

#### 参数 (其中keyWordParam,searchTypeParam请参照下面表格)
  ```js
  var freeStyle = require('free-style-plugin')
  freeStyle.getWords(keyWordParam,searchTypeParam).then( function (res) {
      console.log(res)
  })  
  ```

| 参数         | 描述      | 可选值  |
| ----------- |:---------:| -----:|
| keyWord     | 搜索关键词 | 任何中文单词 |
| searchType  | 搜索类型(全压，单压，英文韵脚)  |  'full','single','en' |
#### 测试本项目
* 先更新node.js至最新版本(v8.2.1及以上)
* 运行
  ```console
  $ node test.js
  ```