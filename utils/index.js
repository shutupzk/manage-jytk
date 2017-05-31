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
