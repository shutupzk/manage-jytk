import PinYin from './pinyin'

export const checkPhoneNumber = (phone) => {
  const r = /(1([3578][0-9]))\d{8}/
  return (r.test(phone) && (phone.length === 11))
}

export const checkIdCard = (num) => {
  if (num.length !== 18) {
    return false
  }
  const re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
  let arrSplit = num.match(re)
  let dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
  let bGoodDay
  bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]))
  if (!bGoodDay) {
    return false
  } else {
    let valnum
    let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let nTemp = 0
    for (let i = 0; i < 17; i++) {
      nTemp += num.substr(i, 1) * arrInt[i]
    }
    valnum = arrCh[nTemp % 11]
    if (valnum !== num.substr(17, 1)) {
      return false
    }
    return num
  }
}

/**
 * 模糊查询
 * @param {*} list 
 * @param {*} keyword 
 * @param {*} apiKeyword
 */
export function fuzzyQuery(list, keyword, apiKeyword) {
  //正则表达式
  var len = list.length;
  var arr = [];
  var reg = new RegExp(keyword);
  for(var i=0;i<len;i++){
      //如果字符串中不包含目标字符会返回-1
      if(list[i][apiKeyword[0]] && list[i][apiKeyword[0]].match(reg) ||
         list[i][apiKeyword[1]] && list[i][apiKeyword[1]].match(reg) ||
         list[i][apiKeyword[2]] && list[i][apiKeyword[2]].match(reg) ||
         list[i][apiKeyword[3]] && list[i][apiKeyword[3]].match(reg) ||
         list[i][apiKeyword[4]] && list[i][apiKeyword[4]].match(reg)){
          arr.push(list[i]);
      }
  }
  return arr;
}

/**
 * 判断对象是否为空对象{}
 * @param {*} obj
 */
export function isEmptyObject (obj) {
  for (let n in obj) { return false }
  return true
}

/**
 * 去除数组重复数据
 */
export function removeDuplicateData (arr) {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i])
    }
  }
  return newArr
}

/**
 * 将汉字转换为拼音并获取大写首字母
 */
export function getFirstUpLetter (l1) {
  return convertPinyin(l1).substr(0, 1)
}

// 汉字转拼音首字母

export function convertPinyinFirst (l1) {
  let l2 = l1.length
  let I1 = ''
  let reg = new RegExp('[a-zA-Z0-9\\- ]')
  for (let i = 0; i < l2; i++) {
    let val = l1.substr(i, 1)
    let name = arraySearch(val, PinYin, true)
    if (reg.test(val)) {
      I1 += val.toUpperCase()
    } else if (name !== false) {
      I1 += name
    }
  }
  I1 = I1.replace(/ /g, '-')
  while (I1.indexOf('--') > 0) {
    I1 = I1.replace('--', '-')
  }
  return I1
}

// 汉字转拼音
export function convertPinyin (l1) {
  let l2 = l1.length
  let I1 = ''
  let reg = new RegExp('[a-zA-Z0-9\\- ]')
  for (let i = 0; i < l2; i++) {
    let val = l1.substr(i, 1)
    let name = arraySearch(val, PinYin)
    if (reg.test(val)) {
      I1 += val
    } else if (name !== false) {
      I1 += name
    }
  }
  I1 = I1.replace(/ /g, '-')
  while (I1.indexOf('--') > 0) {
    I1 = I1.replace('--', '-')
  }
  return I1
}
// 在对象中搜索
function arraySearch (l1, l2, flage) {
  for (let name in PinYin) {
    if (PinYin[name].indexOf(l1) !== -1) {
      if (flage) {
        return getUcfirst(name)
      } else {
        return ucfirst(name)
      }
    }
  }
  return false
}
// 首字母大写
function ucfirst (l1) {
  if (l1.length > 0) {
    let first = l1.substr(0, 1).toUpperCase()
    let spare = l1.substr(1, l1.length)
    return first + spare
  }
}

//  获得大写首字母
function getUcfirst (l1) {
  if (l1.length > 0) {
    let first = l1.substr(0, 1).toUpperCase()
    return first
  }
}

export function getBirthday (certificateNo) {
  return certificateNo.substr(6, 4) + '-' + certificateNo.substr(10, 2) + '-' + certificateNo.substr(12, 2)
}

// 根据日期，获取年龄 日期格式：1980-02-02
export function ages (str) {
  var r = str&&str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
  if (r == null) return false
  var d = new Date(r[1], r[3] - 1, r[4])
  if (Number(d.getFullYear()) === Number(r[1]) && Number((d.getMonth() + 1)) === Number(r[3]) && Number(d.getDate()) === Number(r[4])) {
    var Y = new Date().getFullYear()
    return ((Y - r[1]))
  }
  return ('生日格式错误！')
}
// 隐藏手机号中间四位
export function phone (str) {
  var reg = /1(\d{2})\d{4}(\d{4})/g
  str = str.replace(reg, '1$1****$2')
  if (str) {
    return str
  }
  return '手机格式错误！'
}
// 隐藏身份证号中间几位
export function certificateNo (card) {
  var str = card.substr(6, 8)
  card = card.replace(str, '********')
  return card
}

export function getSex (certificateNo) {
  return certificateNo.substr(16, 1) % 2 + ''
}

// 判断性别
export function sex (sex) {
  console.log('----sex', sex)
  switch (sex) {
    case '0':
      return '女'
    case '1':
      return '男'
    default:
      return '未知'
  }
}
// 判断object是否为｛ ｝空
export function judge (obj) {
  for (var i in obj) { // 如果不为空，则会执行到这一步，返回true
    return true
  }
  return false
}

// 钱数字转大写金额
export function convertCurrency (money) {
  // 汉字的数字
  var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  var cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  var cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  var cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  var cnInteger = '整'
  // 整型完以后的单位
  var cnIntLast = '元'
  // 最大处理的数字
  var maxNum = 999999999999999.9999
  // 金额整数部分
  var integerNum
  // 金额小数部分
  var decimalNum
  // 输出的中文金额字符串
  var chineseStr = ''
  // 分离金额后用的数组，预定义
  var parts
  if (money === '') { return '' }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0
    var IntLen = integerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    var decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}

// 替换字符串的部分
export function replaceStr (sorceText, startIndex, endIndex, repStr) {
  var str = sorceText.substring(startIndex, endIndex)
  if (str.length > 0) {
    sorceText = sorceText.replace(str, repStr)
  }
  return sorceText
}

// 查询字符蓝色替换
export function replaceSearchKey (text, searchKey) {
  if (text.indexOf(searchKey) >= 0) {
    let first = text.substr(0, text.indexOf(searchKey))
    let newkey = '<span style="color: #22BAD9">' + searchKey + '</span>'
    let lastText = text.substr(text.indexOf(searchKey) + searchKey.length)
    console.log(first + newkey + lastText)
    return first + newkey + lastText
  } else {
    return text
  }
}
