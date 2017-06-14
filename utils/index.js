import PinYin from './pinyin'

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
  var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
  if (r == null) return false
  var d = new Date(r[1], r[3] - 1, r[4])
  if (Number(d.getFullYear()) === Number(r[1]) && Number((d.getMonth() + 1)) === Number(r[3]) && Number(d.getDate()) === Number(r[4])) {
    var Y = new Date().getFullYear()
    console.log('年龄   =   ' + (Y - r[1]) + '   周岁')
    return ((Y - r[1]))
  }
  console.log('生日日期==', str)
  return ('生日格式错误！')
}
// 隐藏手机号中间四位
export function phone (str) {
  var reg = /1(\d{2})\d{4}(\d{4})/g
  str = str.replace(reg, '1$1****$2')
  console.log('phone==', str)
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
  console.log('sex==', sex)
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
