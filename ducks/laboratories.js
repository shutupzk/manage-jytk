// 检验
import { gql } from 'react-apollo'

import {isEmptyObject} from '../utils'
const REPORT_LABORATORY_QUERY = 'report/laboratory/query'
const REPORT_LABORATORY_SUCCESS = 'report/laboratory/success'
const REPORT_LABORATORY_FAIL = 'report/laboratory/fail'

const REPORT_LABORATORY_ITEMS_QUERY = 'report/laboratory/items/query'
const REPORT_LABORATORY_ITEMS_SUCCESS = 'report/laboratory/items/success'
const REPORT_LABORATORY_ITEMS_FAIL = 'report/laboratory/items/fail'

const REPORT_LABORATORY_SELECT = 'report/laboratory/select'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectId: null
}

// reducer
export function laboratories (state = initState, action = {}) {
  switch (action.type) {
    case REPORT_LABORATORY_QUERY:
    case REPORT_LABORATORY_ITEMS_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case REPORT_LABORATORY_SUCCESS:
      return Object.assign({}, state, { data: action.laboratories, loading: false, error: null })
    case REPORT_LABORATORY_ITEMS_SUCCESS:
      let laboratories = getLaboratories(state, action.laboratory)
      return Object.assign({}, state, { data: Object.assign([], state.data, laboratories), loading: false, error: null })
    case REPORT_LABORATORY_FAIL:
    case REPORT_LABORATORY_ITEMS_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case REPORT_LABORATORY_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: action.error })
    default:
      return state
  }
}
const getLaboratories = (state = {}, actionLaboratory) => {
  if (!isEmptyObject(state.data)) {
    let {date, laboratoryId} = state.selectId
    let laboratoriesByDate = filterLaboratoriesByDate(state.data, date)[date]
    for (let i = 0; i < laboratoriesByDate.length; i++) {
      if (laboratoriesByDate[i].id === laboratoryId) {
        laboratoriesByDate[i] = Object.assign({}, laboratoriesByDate[i], {inspectionItems: actionLaboratory.inspectionItems})
        break
      }
    }
    let laboratories = state.data
    let newLaboratories = Object.assign([], laboratories, {[laboratoryId]: laboratoriesByDate})
    return newLaboratories
  } else {
    let newLaboratories = Object.assign([], laboratories, {[actionLaboratory.id]: actionLaboratory})
    return newLaboratories
  }
}
const filterLaboratoriesByDate = (laboratories, date) => {
  let newLaboratories = laboratories.filter((laboratory) => {
    if (Object.keys(laboratory)[0] === date) {
      return true
    }
    return false
  })
  return newLaboratories[0]
}
const QUREY_LABORATORY = gql`
  query ($id: ObjID!) {
  patient(id: $id) {
    id
    patientCards {
      id
      inspections {
        id
        reportNo
        inspectName
        samplingTime
        applyTime
        sampleName
        reportTime
        inspectTime
        sampleStatus
        inspectDept
        applyDept
        applyDoctor
        inspectDoctor
        reportDoctor
      }
    }
  }
}
`
let inspections = [
  {
    id: '592802ce39feba2cbed12cf1',
    reportNo: '111',
    inspectName: '钾钠两项_生化二十项',
    samplingTime: '2017-05-12',
    applyTime: '2017-05-10',
    sampleName: '血',
    reportTime: '2017-05-13',
    inspectTime: '2017-05-12',
    sampleStatus: 'AA',
    inspectDept: '胸外科',
    applyDept: '胸外科',
    applyDoctor: '董宜胜',
    inspectDoctor: '董宜胜',
    reportDoctor: '李医生'
  },
  {
    id: '67891',
    reportNo: '111',
    inspectName: '乙肝二十项',
    samplingTime: '2017-05-12',
    applyTime: '2017-05-10',
    sampleName: '血',
    reportTime: '2017-05-13',
    inspectTime: '2017-05-12',
    sampleStatus: 'AA',
    inspectDept: '胸外科',
    applyDept: '胸外科',
    applyDoctor: '董宜胜',
    inspectDoctor: '董宜胜',
    reportDoctor: '李医生'
  },
  {
    id: '2211',
    reportNo: '111',
    inspectName: '尿十项',
    samplingTime: '2017-05-13',
    applyTime: '2017-05-10',
    sampleName: '血',
    reportTime: '2017-05-14',
    inspectTime: '2017-05-13',
    sampleStatus: 'AA',
    inspectDept: '胸外科',
    applyDept: '胸外科',
    applyDoctor: '董宜胜',
    inspectDoctor: '董宜胜',
    reportDoctor: '李医生'
  }
]
export const queryLaboratories = (client, {patientId}) => async dispatch => {
  dispatch({
    type: REPORT_LABORATORY_QUERY
  })
  try {
    let data = await client.query({ query: QUREY_LABORATORY, variables: {id: '58eb7c94c77c0857c9dc5b1e'} })
    if (data.error) {
      return dispatch({
        type: REPORT_LABORATORY_FAIL,
        error: data.error.message
      })
    }
    let laboratories = groupLaboratoriesByTime(data.data.patient.patientCards[0].inspections)
    dispatch({
      type: REPORT_LABORATORY_SUCCESS,
      laboratories
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: REPORT_LABORATORY_FAIL,
      error: '数据请求错误'
    })
  }
}

const groupLaboratoriesByTime = (laboratories) => {
  let groupLaboratories = []
  let times = []
  for (let i = 0; i < laboratories.length; i++) {
    let isNull = true
    for (let j = 0; j < times.length; j++) {
      if (times[j] === laboratories[i].reportTime) {
        isNull = false
        break
      }
    }
    if (isNull) {
      let laboratory = filterLaboratories(laboratories, laboratories[i].reportTime)
      times.push(laboratories[i].reportTime)
      groupLaboratories.push({[laboratories[i].reportTime]: laboratory})
    }
  }
  // return sortLaboratories(groupLaboratories) // 是否排序待确定
  return groupLaboratories
}

const filterLaboratories = (laboratories, time) => {
  let newLaboratory = laboratories.filter((laboratory) => {
    if (laboratory.reportTime === time) {
      return true
    }
    return false
  })
  return newLaboratory
}

// 倒序排序
// const sortLaboratories = (laboratories) => {
//   const compare = () => {
//     return function (a, b) {
//       let v1 = Object.keys(a)[0]
//       let v2 = Object.keys(b)[0]
//       return moment(v2).isBefore(moment(v1))
//     }
//   }
//   return laboratories.sort(compare())
// }

export const selectLaboratory = ({date, laboratoryId}) => dispatch => {
  dispatch({
    type: REPORT_LABORATORY_SELECT,
    selectId:
    {
      laboratoryId,
      date
    }
  })
}

const QUREY_LABORATORY_ITEMS = gql`
  query ($id: ObjID!) {
    inspection(id: $id) {
      id
      reportNo
      inspectName
      samplingTime
      applyTime
      sampleName
      reportTime
      inspectTime
      sampleStatus
      inspectDept
      applyDept
      applyDoctor
      inspectDoctor
      reportDoctor
      inspectionItems {
        id
        itemName
        itemEnglishName
        resultValue
        unit
        maxValue
        minValue
        abnormalSign
        type
      }
    }
  }
`
var items = {
  id: '592802ce39feba2cbed12cf1',
  inspectionItems: [
    {
      id: '12345',
      itemName: 'A霉',
      itemEnglishName: 'a',
      resultValue: '12',
      unit: 'c',
      maxValue: '15',
      minValue: '12',
      abnormalSign: '正常',
      type: '哈哈'
    },
    {
      id: '97578',
      itemName: 'D霉',
      itemEnglishName: 'd',
      resultValue: '250',
      unit: 'mul',
      maxValue: '320',
      minValue: '260',
      abnormalSign: '低',
      type: '呜呜'
    },
    {
      id: '3333',
      itemName: 'B霉',
      itemEnglishName: 'b',
      resultValue: '250',
      unit: 'cd',
      maxValue: '300',
      minValue: '100',
      abnormalSign: '正常',
      type: '哈哈'
    },
    {
      id: '09887',
      itemName: '酒霉',
      itemEnglishName: 'J',
      resultValue: '500',
      unit: 'duc',
      maxValue: '300',
      minValue: '20',
      abnormalSign: '高',
      type: '呜呜'
    }
  ]
}

export const queryLaboratoryItems = (client, {laboratoryId}) => async dispatch => {
  dispatch({
    type: REPORT_LABORATORY_ITEMS_QUERY
  })
  try {
    let data = await client.query({ query: QUREY_LABORATORY_ITEMS, variables: {id: laboratoryId} })
    if (data.error) {
      return dispatch({
        type: REPORT_LABORATORY_ITEMS_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: REPORT_LABORATORY_ITEMS_SUCCESS,
      laboratory: data.data.inspection
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: REPORT_LABORATORY_ITEMS_FAIL,
      error: '数据请求错误'
    })
  }
}
