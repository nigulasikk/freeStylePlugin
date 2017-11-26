var fs = require('fs');
var pinyin = require("pinyin");
/**
 * 数据清理后的中文词库，用于缓存
 * @type {Array}
 */
var dict = []

/**
 * 初始化中文词库
 */
function initDictYunMu() {
  var promise = new Promise( (resolve, reject) => {
    fs.readFile(__dirname + '/data/dict.txt', 'utf-8', function(err, data) {
        if (err) {
            console.error(err);
        } else {
            var start = new Date().getTime();
            /**
             * txt中的词库转换成一个数组
             */
            var arrRaw = data.split('\n');
            /**
             * [arr 数据清洗之后的词库]
             */
            var arr = [];
            arrRaw.forEach(item => {
                var itemSplit = item.split(' ')
                /**
                 * [构建一个新的对象push进数组]
                 * @name 单词
                 * @weight 使用频率
                 * @yunMu 韵母
                 */
                arr.push({ name: itemSplit[0], weight: itemSplit[1], yunMu: getYunMu(itemSplit[0]) });
            })
            /**
             *  根据单词的 使用频率 & 单词的长短 排序
             *  去除单个字的结果 ，用来单压搜索
             */
            arr = arr.sort((a, b) => (a.weight - b.weight)).sort((a, b) => (a.name.length - b.name.length)).filter(value => { return value.name.length > 1 })
            var end = new Date().getTime();
            // console.log(`处理词库220626多词共花费${(end-start)/1000}秒`);
            // console.log(arr);  
            dict = arr;
            resolve()
        }
    });
  })
  return promise
}
/**
 * 初始化英文词库
 */
function initDictEn() {
  var promise = new Promise( (resolve, reject) => {
    fs.readFile(__dirname + '/data/englishDict.txt', 'utf-8', function(err, data) {
        if (err) {
            console.error(err);
            reject()
        } else {
            let start = new Date().getTime();
            /**
             * txt中的词库转换成一个数组
             */
            let arrRawEn = data.split('\n');
            let arrEn = [];
            /**
             * 统计下最后字母发音
             */
            let lastProMap = new Map();
            arrRawEn.forEach(item => {
                var itemSplitEn = item.split('  ')
                arrEn.push({ name: itemSplitEn[0], yunMu: getLastEnPronunciation(itemSplitEn[1]) })
                lastProMap.set(getLastEnPronunciation(itemSplitEn[1]), 'xixi')
            })

            var end = new Date().getTime();
            // console.log(`处理英文花费${(end-start)/1000}秒`);
            resolve()
            // console.log(arrEn);  
            // console.log(lastProMap);
        }
    });
  })
  return promise      
    
}
/**
 * 根据单词得到韵母
 */
function getYunMu(word) {
    /**
     * 声母数组
     */
    var shenMu = pinyin(word, {
        style: pinyin.STYLE_INITIALS, // 设置拼音风格
        segment: true,
        heteronym: true
    })
    /**
     * 单词全拼数组
     */
    var wholePinyinArray = pinyin(word, {
        style: pinyin.STYLE_NORMAL, // 设置拼音风格
        segment: true,
        heteronym: true
    })
    // console.log(shenMu);  
    // console.log(wholePinyinArray);
    // 全拼 减去 声母 得到韵语 用逗号分隔
    var yunMu = wholePinyinArray.map((fullPinyin, index) => {
        return fullPinyin[0].replace(shenMu[index][0], '')
    }).join(',')
    // 为了除去 ui韵脚和i韵脚匹配 ，在每个韵脚前加,
    // eg 比如 ui,ao   和 i,ao 不应该匹配
    // ,ui,ao  和 ,i,ao 就不会匹配在一起啦...
    return ',' + yunMu
}
/**
 * 得到英文 最后音节发音
 */
function getLastEnPronunciation(wordEn) {
    let wordsArray = wordEn.split(' ')
    return wordsArray[wordsArray.length - 1]
}
/**
 * 解析 单词韵母  返回相似韵脚的单词
 * @param  {[type]} word [description]
 * @return {[type]}      [description]
 */
function getWords(word ,searchCondition='full') {
    word = decodeURIComponent(word)
    var result = []
    var wordBySearchCondition = searchCondition === 'full' ? word : word[word.length -1]
    var distYunmu = getYunMu(wordBySearchCondition)
    // console.log('目标韵母：' + distYunmu)
    dict.forEach(item => {
        /**
         * [if 如果韵脚匹配 && 文字末端韵母匹配]
         */
        let yunMuPosition = item.yunMu.indexOf(distYunmu)
        if (yunMuPosition > -1 && (yunMuPosition + distYunmu.length) === item.yunMu.length) {
            result.push(item.name)
        }
    })
    return result.splice(0, 1000)
}
/**
 * 如果词库已初始化，则从缓存中取，返回匹配数据
 * 不然初始化词库，再返回匹配数据
 * @param  {[string]} word            [搜索关键字]
 * @param  {[type]} searchCondition [搜索类型]
 * @return {[type]}                 [promise]
 */
exports.getWords = function (word,searchCondition) {
  var promise = new Promise( (resolve, reject) => {
    if (dict.length) {
      // console.log('从缓存里读取')
      resolve(getWords(word, searchCondition))
    } else {
      initDictYunMu()
      .then( () => {
        return initDictEn()
      })
      .then( () => {
        resolve(getWords(word, searchCondition))
      })
    }
  })
  return promise
}