import gql from 'graphql-tag'
import { REHYDRATE } from 'redux-persist/constants'
import localforage from 'localforage'

const HOSPITAL_DOCTORS_QUERY = 'hospital/doctors/query'
const HOSPITAL_DOCTORS_SUCCESS = 'hospital/doctors/success'
const HOSPITAL_DOCTORS_FAIL = 'hospital/doctors/fail'
const HOSPITAL_DOCTORS_SELECT = 'hospital/doctors/select'
const HOSPITAL_DOCTORS_REMOVE_SELECT = 'hospital/doctors/remove/select'

const PROFILE_MY_DOCTORS_QUERY = 'profile/mydoctors/query'
const PROFILE_MY_DOCTORS_SUCCESS = 'profile/mydoctors/success'
const PROFILE_MY_DOCTORS_FAIL = 'profile/mydoctors/success'

const MY_DOCTOR_ADD = 'mydoctors/add'
const MY_DOCTOR_ADD_SUCCESS = 'mydoctors/add/success'
const MY_DOCTOR_ADD_FAIL = 'mydoctors/add/fail'

const APPOINTMENT_SEARCH_DOCTORS_QUERY = 'appointment/search/doctors/query'
const APPOINTMENT_SEARCH_DOCTORS_SUCCESS = 'appointment/search/doctors/success'
const APPOINTMENT_SEARCH_DOCTORS_FAIL = 'appointment/search/doctors/fail'

const REMOVE_APPOINTMENT_DOCTORS_SEARCH = 'appointment/search/doctors/remove'

const MY_DOCTOR_REMOVE = 'mydoctors/remove'
const MY_DOCTOR_REMOVE_SUCCESS = 'mydoctors/remove/success'
const MY_DOCTOR_REMOVE_FAIL = 'mydoctors/remove/fail'

const HOSPITAL_DOCTORS_DETAIL_QUERY = 'doctor/detail/query'
const HOSPITAL_DOCTORS_DETAIL_SUCCESS = 'doctor/detail/success'
const HOSPITAL_DOCTORS_DETAIL_FAIL = 'doctor/detail/fail'

const QUERY_DOCTORS_FLAG = 'doctors/query/flag'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectId: null,
  queryFlag: ''
}

export function doctors (state = initState, action = {}) {
  console.log('action', action)
  switch (action.type) {
    // case REHYDRATE:
    //   console.log('----REHYDRATE----', 'REHYDRATE_DOCTORS')
    //   return Object.assign({}, state, action.payload.doctors, { loading: false, error: null })
    case HOSPITAL_DOCTORS_QUERY:
    case PROFILE_MY_DOCTORS_QUERY:
    case APPOINTMENT_SEARCH_DOCTORS_QUERY:
    case HOSPITAL_DOCTORS_DETAIL_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_MY_DOCTORS_SUCCESS:
    case HOSPITAL_DOCTORS_SUCCESS:
    case MY_DOCTOR_ADD_SUCCESS:
    case HOSPITAL_DOCTORS_DETAIL_SUCCESS:
      let doctors = getDoctors(state, action.doctors)
      return Object.assign({}, state, { data: doctors, loading: false, error: null })
    case MY_DOCTOR_REMOVE_SUCCESS:
      let newDoctors = getNewDoctors(state, action.data)
      return Object.assign({}, state, { data: newDoctors, loading: false, error: null })
    case APPOINTMENT_SEARCH_DOCTORS_SUCCESS:
      let searchDoctors = getDoctors(state, action.doctors)
      delete searchDoctors.searchDocIds
      return Object.assign({}, state, { data: searchDoctors, searchDocIds: action.doctors.searchDocIds, loading: false, error: null })
    case HOSPITAL_DOCTORS_FAIL:
    case PROFILE_MY_DOCTORS_FAIL:
    case APPOINTMENT_SEARCH_DOCTORS_FAIL:
    case HOSPITAL_DOCTORS_DETAIL_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOSPITAL_DOCTORS_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: null })
    case HOSPITAL_DOCTORS_REMOVE_SELECT:
      return Object.assign({}, state, { selectId: null, loading: false, error: null })
    case REMOVE_APPOINTMENT_DOCTORS_SEARCH:
      return Object.assign({}, state, { searchDocIds: [], loading: false, error: null })
    case QUERY_DOCTORS_FLAG:
      return Object.assign({}, state, { queryFlag: action.queryFlag, loading: false, error: null })
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
      doctors[doc] = Object.assign({}, actionDoctors[doc], {departmentIds}, {userIds})
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

const getNewDoctors = (state, actionDoctors) => {
  let doctors = state.data
  if (doctors[actionDoctors.doctorId]) {
    doctors[actionDoctors.doctorId].userIds = []
    doctors[actionDoctors.doctorId].isMyDoctor = false
  }
  console.log(doctors)
  return doctors
}

const QUERY_DOCTORS = gql`
  query ($id: ObjID!, $userId: ObjID!){
    department(id: $id) {
      id,
      deptName
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
          isAppointment,
          userHasDoctors(userId: $userId) {
            id
            user{
              id
              name
            }
            doctor{
              id
            }
          }
        }
      }
    }
  }
`
const QUERY_DOCTORS2 = gql`
  query ($id: ObjID!){
    department(id: $id) {
      id,
      deptName
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
    const userId = await localforage.getItem('userId')
    if (userId) {
      let data = await client.query({ query: QUERY_DOCTORS, variables: {id: departmentId, userId} })
      if (data.errors) {
        return dispatch({
          type: HOSPITAL_DOCTORS_FAIL,
          error: data.errors[0].message
        })
      }
      let department = data.data.department
      let doctors = {}
      for (let doc of department.departmentHasDoctors) {
        doctors[doc.doctor.id] = Object.assign({}, doc.doctor, { departmentId: department.id, deptName: department.deptName })
        for (let user of doc.doctor.userHasDoctors) {
          if (user.doctor.id === doc.doctor.id) {
            const userHasDoctorId = user.id
            const isMyDoctor = true
            doctors[doc.doctor.id] = Object.assign({}, doc.doctor, { departmentId: department.id, deptName: department.deptName, userHasDoctorId, isMyDoctor })
          }
        }
      }
      return dispatch({
        type: HOSPITAL_DOCTORS_SUCCESS,
        doctors
      })
    } else {
      let data = await client.query({ query: QUERY_DOCTORS2, variables: {id: departmentId} })
      if (data.errors) {
        return dispatch({
          type: HOSPITAL_DOCTORS_FAIL,
          error: data.errors[0].message
        })
      }
      let department = data.data.department
      let doctors = {}
      for (let doc of department.departmentHasDoctors) {
        doctors[doc.doctor.id] = Object.assign({}, doc.doctor, { departmentId: department.id, deptName: department.deptName, isMyDoctor: false })
      }
      return dispatch({
        type: HOSPITAL_DOCTORS_SUCCESS,
        doctors
      })
    }
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_DOCTORS_FAIL,
      error: '数据请求失败！'
    })
  }
}

const QUERY_DOCTOR_DETAIL = gql`
  query($doctorId: ObjID!, $userId: ObjID!) {
    doctor(id: $doctorId) {
      id,
      doctorName,
      title,
      major,
      description,
      remark,
      recommend,
      hot,
      isAppointment,
      userHasDoctors(userId: $userId) {
        id
        user{
          id
          name
        }
        doctor{
          id
        }
      }
    }
  }
`
// 获取医生详细信息
export const queryDoctorDetail = (client, { doctorId }) => async dispatch => {
  dispatch({
    type: HOSPITAL_DOCTORS_DETAIL_QUERY
  })
  try {
    const userId = await localforage.getItem('userId')
    let data = await client.query({ query: QUERY_DOCTOR_DETAIL, variables: { userId, doctorId } })
    if (data.errors) {
      return dispatch({
        type: HOSPITAL_DOCTORS_DETAIL_FAIL,
        error: data.errors[0].message
      })
    }
    const doctor = data.data.doctor
    let doctors = {}
    for (let user of doctor.userHasDoctors) {
      if (user.doctor.id === doctor.id) {
        const userHasDoctorId = user.id
        const isMyDoctor = true
        doctors[doctor.id] = Object.assign({}, doctor, { userHasDoctorId, isMyDoctor })
      }
    }
    return dispatch({
      type: HOSPITAL_DOCTORS_DETAIL_SUCCESS,
      doctors
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_DOCTORS_DETAIL_FAIL,
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
// 设置queryFlag医生
export const setQueryFlag = ({ flag }) => dispatch => {
  dispatch({
    type: QUERY_DOCTORS_FLAG,
    queryFlag: flag
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
          departmentHasDoctors {
            department{
              id
              deptName
            }
          }
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
    if (data.errors) {
      return dispatch({
        type: PROFILE_MY_DOCTORS_FAIL,
        error: data.errors[0].message
      })
    }
    let user = data.data.user
    console.log(user.userHasDoctors)
    let doctors = {}
    for (let doc of user.userHasDoctors) {
      let deptName = ''
      for (let dep of doc.doctor.departmentHasDoctors) {
        if (deptName === '') {
          deptName = dep.department.deptName
        } else {
          deptName = deptName + ',' + dep.department.deptName
        }
      }
      doctors[doc.doctor.id] = Object.assign({}, doc.doctor, { userHasDoctorId: doc.id, isMyDoctor: true, userId, deptName })
    }
    console.log(doctors)
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
// 收藏医生
var ADD_MY_DOCTORS = gql`
  mutation ($doctorId: ObjID!, $userId: ObjID!){
    createUserHasDoctor(input: {doctorId: $doctorId, userId: $userId}) {
      id,
      user{
        id
      }
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
`
export const createUserHasDoctor = (client, {userId, doctorId}) => async dispatch => {
  dispatch({
    type: MY_DOCTOR_ADD
  })
  try {
    let data = await client.mutate({ mutation: ADD_MY_DOCTORS, variables: { doctorId, userId } })
    if (data.errors) {
      dispatch({
        type: MY_DOCTOR_ADD_FAIL,
        error: data.errors[0].message
      })
      return {
        error: data.errors[0].message
      }
    }
    let userHasDoctor = data.data.createUserHasDoctor
    let doctors = {}
    doctors[userHasDoctor.doctor.id] = Object.assign({}, userHasDoctor.doctor, { userHasDoctorId: userHasDoctor.id, isMyDoctor: true, userId: userHasDoctor.user.id })
    console.log(doctors)
    dispatch({
      type: MY_DOCTOR_ADD_SUCCESS,
      doctors
    })
    return {
      data: doctors
    }
  } catch (e) {
    console.log(e)
    dispatch({
      type: MY_DOCTOR_ADD_FAIL,
      error: '我的医生收藏失败！'
    })
    return {
      error: '我的医生收藏失败！'
    }
  }
}
// 取消收藏医生
var REMOVE_MY_DOCTORS = gql`
  mutation ($id: ObjID!){
    removeUserHasDoctor(id: $id)
  }
`
export const removeUserHasDoctor = (client, {id, userId, doctorId}) => async dispatch => {
  dispatch({
    type: MY_DOCTOR_REMOVE
  })
  try {
    let data = await client.mutate({ mutation: REMOVE_MY_DOCTORS, variables: { id } })
    if (data.errors) {
      dispatch({
        type: MY_DOCTOR_REMOVE_FAIL,
        error: data.errors[0].message
      })
      return {
        error: data.errors[0].message
      }
    }
    let isRemove = data.data.removeUserHasDoctor
    dispatch({
      type: MY_DOCTOR_REMOVE_SUCCESS,
      data: {id: id, isRemove, userId, doctorId}
    })
    return {
      data: {id: id, isRemove, userId, doctorId}
    }
  } catch (e) {
    console.log(e)
    dispatch({
      type: MY_DOCTOR_REMOVE_FAIL,
      error: '取消医生收藏失败！'
    })
    return {
      error: '取消医生收藏失败！'
    }
  }
}
// 搜索医生
const SEARCH_DOCTORS = gql`
  query($doctorName: String!) {
    searchDoctor(doctorName: $doctorName) {
      id,
      doctorName,
      title,
      major,
      description,
      remark,
      recommend,
      departmentHasDoctors {
        id
        department {
          id
          deptName
        }
      }
    }
  }
`
export const searchDoctors = (client, {doctorName}) => async dispatch => {
  dispatch({
    type: APPOINTMENT_SEARCH_DOCTORS_QUERY
  })
  try {
    let data = await client.query({ query: SEARCH_DOCTORS, variables: {doctorName} })
    if (data.errors) {
      return dispatch({
        type: APPOINTMENT_SEARCH_DOCTORS_FAIL,
        error: data.errors[0].message
      })
    }
    let searchDoctors = data.data.searchDoctor
    let doctors = {}
    let searchDocIds = []
    for (let doc of searchDoctors) {
      doctors[doc.id] = doc
      searchDocIds.push(doc.id)
    }
    let docs = Object.assign({}, doctors, { searchDocIds })
    console.log(docs)
    return dispatch({
      type: APPOINTMENT_SEARCH_DOCTORS_SUCCESS,
      doctors: docs
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: APPOINTMENT_SEARCH_DOCTORS_FAIL,
      error: '数据请求失败！'
    })
  }
}

// 取消搜索科室
export const removeSearchDocIds = () => dispatch => {
  return dispatch({
    type: REMOVE_APPOINTMENT_DOCTORS_SEARCH
  })
}
