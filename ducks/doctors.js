import gql from 'graphql-tag'
// import { REHYDRATE } from 'redux-persist/constants'

const HOSPITAL_DOCTORS_QUERY = 'hospital/doctors/query'
const HOSPITAL_DOCTORS_SUCCESS = 'hospital/doctors/success'
const HOSPITAL_DOCTORS_FAIL = 'hospital/doctors/fail'
const HOSPITAL_DOCTORS_SELECT = 'hospital/doctors/select'
const HOSPITAL_DOCTORS_REMOVE_SELECT = 'hospital/doctors/remove/select'

const PROFILE_MY_DOCTORS_QUERY = 'profile/mydoctors/query'
const PROFILE_MY_DOCTORS_SUCCESS = 'profile/mydoctors/success'
const PROFILE_MY_DOCTORS_FAIL = 'profile/mydoctors/success'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectId: null
}

export function doctors (state = initState, action = {}) {
  switch (action.type) {
    // case REHYDRATE:
    //   console.log('----REHYDRATE----', 'REHYDRATE_DOCTORS')
    //   return Object.assign({}, state, action.payload.doctors, { loading: false, error: null })
    case HOSPITAL_DOCTORS_QUERY:
    case PROFILE_MY_DOCTORS_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_MY_DOCTORS_SUCCESS:
    case HOSPITAL_DOCTORS_SUCCESS:
      let doctors = getDoctors(state, action.doctors)
      return Object.assign({}, state, { data: doctors, loading: false, error: null })
    // case PROFILE_MY_DOCTORS_SUCCESS:
    //   return Object.assign({}, state, { data: action.doctors, loading: false, error: null })
    case HOSPITAL_DOCTORS_FAIL:
    case PROFILE_MY_DOCTORS_FAIL:
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
    let departmentIds = []
    let userIds = []
    if (doctors[doc]) {
      departmentIds = doctors[doc].departmentIds || []
      if (actionDoctors[doc].departmentId && !(departmentIds.indexOf(actionDoctors[doc].departmentId) > -1)) {
        departmentIds.push(actionDoctors[doc].departmentId)
      }
      delete actionDoctors[doc].departmentId
      userIds = doctors[doc].userIds || []
      if (actionDoctors[doc].userId && !(userIds.indexOf(actionDoctors[doc].userId) > -1)) {
        userIds.push(actionDoctors[doc].userId)
      }
      delete actionDoctors[doc].userId
      doctors[doc] = Object.assign({}, doctors[doc], {departmentIds}, {userIds})
    } else {
      let departmentId = actionDoctors[doc].departmentId
      if (departmentId) {
        departmentIds.push(departmentId)
      }
      delete actionDoctors[doc].departmentId
      let userId = actionDoctors[doc].userId
      if (userId) {
        userIds.push(userId)
      }
      delete actionDoctors[doc].userId
      doctors[doc] = Object.assign({}, actionDoctors[doc], {departmentIds}, {userIds})
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

// 获取我的医生列表
var QUERY_MY_DOCTORS = gql`
  query ($id: ObjID!){
    user(id: $id) {
      id,
      userHasDoctors {
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
// 获取我的医生列表
export const queryMyDoctors = (client, {userId}) => async dispatch => {
  dispatch({
    type: PROFILE_MY_DOCTORS_QUERY
  })
  try {
    console.log(userId)
    let data = await client.query({ query: QUERY_MY_DOCTORS, variables: {id: userId} })
    if (data.error) {
      return dispatch({
        type: PROFILE_MY_DOCTORS_FAIL,
        error: data.error.message
      })
    }
    let user = data.data.user
    let doctors = {}
    for (let doc of user.userHasDoctors) {
      // let depIds = []
      // for (let det of doc.doctor.departmentHasDoctors) {
      //   depIds.push(det.department.id)
      // }
      doctors[doc.doctor.id] = Object.assign({}, doc.doctor, { userId: user.id })
    }
    return dispatch({
      type: PROFILE_MY_DOCTORS_SUCCESS,
      doctors
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: PROFILE_MY_DOCTORS_FAIL,
      error: '数据请求失败！'
    })
  }
}
