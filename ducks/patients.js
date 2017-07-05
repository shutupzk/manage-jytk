import gql from 'graphql-tag'

const PROFILE_PATIENTS_QUERY = 'profile/patients/query'
const PROFILE_PATIENTS_QUERY_SUCCESS = 'profile/patients/query/success'
const PROFILE_PATIENTS_QUERY_FAIL = 'profile/patients/query/fial'
const PROFILE_PATIENTS_ADD = 'profile/patients/add'
const PROFILE_PATIENTS_ADD_SUCCESS = 'profile/patients/add/success'
const PROFILE_PATIENTS_ADD_FAIL = 'profile/patients/add/fail'
const PROFILE_PATIENTS_REMOVE = 'profile/patients/remove'
const PROFILE_PATIENTS_REMOVE_SUCCESS = 'profile/patients/remove/success'
const PROFILE_PATIENTS_REMOVE_FAIL = 'profile/patients/remove/fail'
const PROFILE_PATIENTS_UPDATE = 'profile/pateints/update'
const PROFILE_PATIENTS_UPDATE_SUCCESS = 'profile/pateints/update/suceess'
const PROFILE_PATIENTS_UPDATE_FAILE = 'profile/pateints/update/fail'
const PROFILE_PATIENTS_SELECT = 'profile/pateints/select'
const PROFILE_PATIENTS_CLEAR = 'profile/pateints/clear'
const PROFILE_PATIENTS_UPDATE_DEFAULT = 'profile/patient/update_default'
const PROFILE_PATIENTS_UPDATE_DEFAULT_SUCCESS = 'profile/patient/update_default/success'
const PROFILE_PATIENTS_UPDATE_DEFAULT_FAIL = 'profile/patient/update_default/fail'

const initState = {
  data: {},
  selectId: null,
  loading: false,
  error: null
}

// reducer
export function patients (state = initState, action = {}) {
  switch (action.type) {
    case PROFILE_PATIENTS_QUERY:
    case PROFILE_PATIENTS_ADD:
    case PROFILE_PATIENTS_UPDATE:
    case PROFILE_PATIENTS_REMOVE:
    case PROFILE_PATIENTS_UPDATE_DEFAULT:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_PATIENTS_QUERY_FAIL:
    case PROFILE_PATIENTS_ADD_FAIL:
    case PROFILE_PATIENTS_UPDATE_FAILE:
    case PROFILE_PATIENTS_REMOVE_FAIL:
    case PROFILE_PATIENTS_UPDATE_DEFAULT_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case PROFILE_PATIENTS_REMOVE_SUCCESS:
      let newData = Object.assign({}, state.data)
      delete newData[action.patientId]
      return Object.assign({}, state, {data: newData}, { loading: false, error: null, selectId: null })
    case PROFILE_PATIENTS_QUERY_SUCCESS:
    case PROFILE_PATIENTS_UPDATE_SUCCESS:
    case PROFILE_PATIENTS_ADD_SUCCESS:
    case PROFILE_PATIENTS_UPDATE_DEFAULT_SUCCESS:
      return Object.assign({}, state, { loading: false, error: null }, { data: Object.assign({}, state.data, action.patients) })
    case PROFILE_PATIENTS_SELECT:
      return Object.assign({}, state, {selectId: action.selectId})
    case PROFILE_PATIENTS_CLEAR:
      return Object.assign({}, state, { data: {}, selectId: null, loading: false, error: null })
    default :
      return state
  }
}

const QUERY_PATIENTS = gql`
  query($userId: ObjID!){
    user(id: $userId){
      id
      patients{
        id
        name
        phone
        certificateNo
        default
        sex
        birthday
        relationship
        carteVital
        patientCards{
          id
          patientIdNo
        }
        inpatientCards{
          id
          inpatientNo
        }
      }
    }
  }
`

export const queryPatients = (client, { userId }) => async dispatch => {
  dispatch({
    type: PROFILE_PATIENTS_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_PATIENTS, variables: { userId } })
    if (data.error) {
      return dispatch({
        type: PROFILE_PATIENTS_QUERY_FAIL,
        error: data.error.message
      })
    }
    const docs = data.data.user.patients
    let patients = {}
    for (let doc of docs) {
      patients[doc.id] = doc
    }
    dispatch({
      type: PROFILE_PATIENTS_QUERY_SUCCESS,
      patients
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_PATIENTS_QUERY_FAIL,
      error: e.message
    })
  }
}

const ADD_PATIENT = gql`
  mutation ($userId: ObjID!,$name: String!, $phone: String!, $certificateNo: String!, $relationship: String!, $carteVital: String, $default: Boolean ){
    createPatient(input: {userId: $userId, name: $name phone: $phone, certificateNo: $certificateNo, relationship: $relationship, carteVital: $carteVital, default: $default}) {
      id
      name
      phone
      certificateNo
      sex
      default
      birthday
      relationship
      carteVital
      patientCards {
        id
        patientIdNo
      }
      inpatientCards {
        id
        inpatientNo
      }
    }
  }
`

export const addPatient = (client, { userId, name, phone, certificateNo, relationship, carteVital, isDefault }) => async dispatch => {
  console.log('传入参数：', userId, name, phone, certificateNo, relationship, carteVital, isDefault)
  dispatch({
    type: PROFILE_PATIENTS_ADD
  })
  try {
    let data = await client.mutate({
      mutation: ADD_PATIENT,
      variables: { userId, name, phone, certificateNo, relationship, carteVital, default: isDefault }
    })
    if (data.error) {
      dispatch({
        type: PROFILE_PATIENTS_ADD_FAIL,
        error: data.error.message
      })
      return {
        error: data.error.error
      }
    }
    const doc = data.data.createPatient
    let patients = {[doc.id]: doc}
    dispatch({
      type: PROFILE_PATIENTS_ADD_SUCCESS,
      patients
    })
    return {
      data: doc.id
    }
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_PATIENTS_ADD_FAIL,
      error: e.message
    })
    return {
      error: e.message
    }
  }
}

const REMOVE_PATIENT = gql`
  mutation ($patientId: ObjID!){
    removePatient(id: $patientId)
  }
`

export const removePatient = (client, { patientId }) => async dispatch => {
  console.log(patientId)
  dispatch({
    type: PROFILE_PATIENTS_REMOVE
  })
  try {
    let data = await client.mutate({
      mutation: REMOVE_PATIENT,
      variables: { patientId: patientId }
    })
    if (data.error) {
      dispatch({
        type: PROFILE_PATIENTS_REMOVE_FAIL,
        error: data.error.message
      })
      return data.error.error
    }
    dispatch({
      type: PROFILE_PATIENTS_REMOVE_SUCCESS,
      patientId
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_PATIENTS_REMOVE_FAIL,
      error: e.message
    })
    return e.message
  }
}

const UPDATE_PATIENT = gql`
  mutation ($patientId: ObjID!, $phone: String, $relationship: String, $carteVital: String, $default: Boolean) {
    updatePatient(id: $patientId, input: {phone: $phone, relationship: $relationship, carteVital: $carteVital, default: $default}) {
      id
      name
      phone
      certificateNo
      sex
      default
      birthday
      relationship
      carteVital
      patientCards {
        id
        patientIdNo
        visitNo
      }
      inpatientCards {
        id
        inpatientNo
      }
    }
  }
`
// 修改就诊人
export const updatePatient = (client, params) => async dispatch => {
  dispatch({
    type: PROFILE_PATIENTS_UPDATE
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_PATIENT,
      variables: params
    })
    if (data.errors) {
      dispatch({
        type: PROFILE_PATIENTS_UPDATE_FAILE,
        error: data.errors[0].message
      })
      return data.errors[0].message
    }
    const doc = data.data.updatePatient
    let patients = {[doc.id]: doc}
    dispatch({
      type: PROFILE_PATIENTS_UPDATE_SUCCESS,
      patients
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_PATIENTS_UPDATE_FAILE,
      error: e.message
    })
    return e.message
  }
}
// 更新默认就诊人
const UPDATE_DEFAULT_PATIENT = gql`
  mutation ($patientId: ObjID!, $default: Boolean) {
    updatePatient(id: $patientId, input: {default: $default}) {
      id
      name
      phone
      certificateNo
      sex
      default
      birthday
      relationship
      carteVital
      patientCards {
        id
        patientIdNo
      }
      inpatientCards {
        id
        inpatientNo
      }
    }
  }
`

export const updatePatientDefault = (client, { patientId, isDefault }) => async dispatch => {
  dispatch({
    type: PROFILE_PATIENTS_UPDATE_DEFAULT
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_DEFAULT_PATIENT,
      variables: { patientId, default: isDefault }
    })
    if (data.error) {
      dispatch({
        type: PROFILE_PATIENTS_UPDATE_DEFAULT_FAIL,
        error: data.error.message
      })
      return data.error.error
    }
    const doc = data.data.updatePatient
    let patients = {[doc.id]: doc}
    dispatch({
      type: PROFILE_PATIENTS_UPDATE_DEFAULT_SUCCESS,
      patients
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_PATIENTS_UPDATE_DEFAULT_FAIL,
      error: e.message
    })
    return e.message
  }
}

// 选择就诊人
export const selectPatient = ({ patientId }) => dispatch => {
  return dispatch({
    type: PROFILE_PATIENTS_SELECT,
    selectId: patientId
  })
}

// 清空就诊人
export const clearPateints = () => dispatch => {
  return dispatch({
    type: PROFILE_PATIENTS_CLEAR
  })
}
