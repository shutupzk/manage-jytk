// 检查
import { gql } from 'react-apollo'
// import moment from 'moment'
// moment(data.updated_at).format('YYYY/MM/DD HH:mm:ss')
// moment('2010-10-20').isBefore('2010-10-21')
const REPORT_EXAMINATION_QUERY = 'report/examination/query'
const REPORT_EXAMINATION_SUCCESS = 'report/examination/success'
const REPORT_EXAMINATION_FAIL = 'report/examination/fail'

const REPORT_EXAMINATION_SELECT = 'report/examination/select'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectId: {}
}

// reducer
export function examinations (state = initState, action = {}) {
  switch (action.type) {
    case REPORT_EXAMINATION_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case REPORT_EXAMINATION_SUCCESS:
      return Object.assign({}, state, { data: action.examinations, loading: false, error: null })
    case REPORT_EXAMINATION_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case REPORT_EXAMINATION_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: action.error })
    default:
      return state
  }
}

const QUREY_EXAMINATION = gql`
  query ($id: ObjID!){
    patient (id: $id){
      id
      name
      birthday
      sex
      patientCards {
        id
        examinations {
          id
          reportNo
          exammineName
          exammineSite
          reportTime
          examineTime
          reportDoctor
          applyDoctor
          examineParam
          examineFindings
          examineResult
        }
      }
    }
  }
`

export const queryExaminations = (client, {patientId}) => async dispatch => {
  dispatch({
    type: REPORT_EXAMINATION_QUERY
  })
  try {
    let data = await client.query({ query: QUREY_EXAMINATION, variables: {id: patientId} })
    if (data.error) {
      return dispatch({
        type: REPORT_EXAMINATION_FAIL,
        error: data.error.message
      })
    }
    // let examinations = groupExaminationsByTime(data.data.patient.patientCards[0].examinations)
    const patient = data.data.patient
    const pat = {patientId: patient.id, patientName: patient.name, patientBirthday: patient.birthday, patientSex: patient.sex}
    let newExam = []
    for (let lab of patient.patientCards[0].examinations) {
      lab = Object.assign({}, lab, pat)
      newExam.push(lab)
    }
    let examinations = groupExaminationsByTime(newExam)
    dispatch({
      type: REPORT_EXAMINATION_SUCCESS,
      examinations
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: REPORT_EXAMINATION_FAIL,
      error: '数据请求错误'
    })
  }
}

const groupExaminationsByTime = (examinations) => {
  let groupExaminations = []
  let times = []
  for (let i = 0; i < examinations.length; i++) {
    let isNull = true
    for (let j = 0; j < times.length; j++) {
      if (times[j] === examinations[i].reportTime) {
        isNull = false
        break
      }
    }
    if (isNull) {
      let examination = filterExaminations(examinations, examinations[i].reportTime)
      times.push(examinations[i].reportTime)
      groupExaminations.push({[examinations[i].reportTime]: examination})
    }
  }
  // return sortExaminations(groupExaminations) // 是否排序带确定
  return groupExaminations
}

const filterExaminations = (examinations, time) => {
  let newExaminations = examinations.filter((examination) => {
    if (examination.reportTime === time) {
      return true
    }
    return false
  })
  return newExaminations
}

// 倒叙排序
// const sortExaminations = (examinations) => {
//   const compare = () => {
//     return function (a, b) {
//       let v1 = Object.keys(a)[0]
//       let v2 = Object.keys(b)[0]
//       return moment(v1).isBefore(moment(v2))
//     }
//   }
//   return examinations.sort(compare())
// }

export const selectExamination = ({date, examinationId, patientId}) => dispatch => {
  dispatch({
    type: REPORT_EXAMINATION_SELECT,
    selectId: {
      date,
      examinationId
    }
  })
}
