import gql from 'graphql-tag'
import { REHYDRATE } from 'redux-persist/constants'

const HOSPITAL_DOCTORS_QUERY = 'hospital/doctors/query'
const HOSPITAL_DOCTORS_SUCCESS = 'hospital/doctors/success'
const HOSPITAL_DOCTORS_FAIL = 'hospital/doctors/fail'
const HOSPITAL_DOCTORS_SELECT = 'hospital/doctors/select'
const HOSPITAL_DOCTORS_REMOVE_SELECT = 'hospital/doctors/remove/select'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectId: null
}

export function doctors (state = initState, action = {}) {
  switch (action.type) {
    case REHYDRATE:
      console.log('----REHYDRATE----', 'REHYDRATE_DOCTORS')
      return Object.assign({}, state, action.payload.doctors, { loading: false, error: null })
    case HOSPITAL_DOCTORS_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_DOCTORS_SUCCESS:
      let doctors = getDoctors(state, action.doctors)
      return Object.assign({}, state, { data: doctors, loading: false, error: null })
    case HOSPITAL_DOCTORS_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOSPITAL_DOCTORS_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: null })
    case HOSPITAL_DOCTORS_REMOVE_SELECT:
      return Object.assign({}, state, { selectId: null, loading: false, error: null })
    default:
      return state
  }
}

const getDoctors = (state, actionDoctors) => {
  let doctors = state.data
  for (let doc in actionDoctors) {
    if (doctors[doc]) {
      let departmentIds = doctors[doc].departmentIds
      if (!(departmentIds.indexOf(actionDoctors[doc].departmentId) > -1)) {
        departmentIds.push(actionDoctors[doc].departmentId)
      }
      delete actionDoctors[doc].departmentId
      doctors[doc] = Object.assign({}, doctors[doc], {departmentIds})
    } else {
      let departmentId = actionDoctors[doc].departmentId
      delete actionDoctors[doc].departmentId
      doctors[doc] = Object.assign({}, actionDoctors[doc], {departmentIds: [departmentId]})
    }
  }
  return doctors
}

const QUERY_DOCTORS = gql`
  query ($id: ObjID!){
    department(id: $id) {
      id,
      departmentHasDoctors {
        id,
        doctor {
          id,
          doctorName,
          title,
          major,
          description,
          remark,
          recommend,
          hot,
          isAppointment
        }
      }
    }
  }
`

// 获取医生列表
export const queryDoctors = (client, {departmentId}) => async dispatch => {
  dispatch({
    type: HOSPITAL_DOCTORS_QUERY
  })
  try {
    console.log(departmentId)
    let data = await client.query({ query: QUERY_DOCTORS, variables: {id: departmentId} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_DOCTORS_FAIL,
        error: data.error.message
      })
    }
    let department = data.data.department
    let doctors = {}
    for (let doc of department.departmentHasDoctors) {
      console.log(doc)
      doctors[doc.doctor.id] = Object.assign({}, doc.doctor, { departmentId: department.id })
    }
    return dispatch({
      type: HOSPITAL_DOCTORS_SUCCESS,
      doctors
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_DOCTORS_FAIL,
      error: '数据请求失败！'
    })
  }
}

// 选择医生
export const selectDoctor = ({ doctorId }) => dispatch => {
  dispatch({
    type: HOSPITAL_DOCTORS_SELECT,
    selectId: doctorId
  })
}

// 取消选择医生
export const removeSelectDoctor = () => dispatch => {
  dispatch({
    type: HOSPITAL_DOCTORS_SELECT
  })
}
