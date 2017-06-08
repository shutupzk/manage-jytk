import gql from 'graphql-tag'
// action types
export const APPOINTMENT_PATIENT_TYPE_QUERY = 'appointment/patient_type/query'
export const APPOINTMENT_PATIENT_TYPE_QUERY_SUCCESS = 'appointment/patient_type/query/success'
export const APPOINTMENT_PATIENT_TYPE_QUERY_FAIL = 'appointment/patient_type/query/fail'

export const APPOINTMENT_PATIENT_TYPE_SELECT = 'appointment/patient_type/select'


const initState = {
  data: {},
  selectId: null,
  loading: false,
  error: null
}
// reducers
export function patientTypes (state = initState, action) {
  switch (action.type) {
    case APPOINTMENT_PATIENT_TYPE_QUERY_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case APPOINTMENT_PATIENT_TYPE_QUERY_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case APPOINTMENT_PATIENT_TYPE_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case APPOINTMENT_PATIENT_TYPE_SELECT:
      return Object.assign({}, state, {selectId: action.selectId})
    default:
      return state
  }
}

const QUERY_PATIENT_TYPES = gql`
  query($hospitalId: ObjID!){
    patientTypes(hospitalId: $hospitalId){
      id
      patientTypeName
      patientTypeCode
    }
  }
`

export const queryPatientTypes = (client, {hospitalId}) => async dispatch => {
  dispatch({
    type: APPOINTMENT_PATIENT_TYPE_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_PATIENT_TYPES, variables: { hospitalId } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_PATIENT_TYPE_QUERY_FAIL,
        error: data.error.message
      })
    }
    let patientTypes = {}
    for (let patientType of data.data.patientTypes) {
      patientTypes[patientType.id] = patientType
    }
    dispatch({
      type: APPOINTMENT_PATIENT_TYPE_QUERY_SUCCESS,
      data: patientTypes
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTMENT_PATIENT_TYPE_QUERY_FAIL,
      error: e.message
    })
  }
}

export const selectPatientType = (id) => dispatch => {
  dispatch({
    type: APPOINTMENT_PATIENT_TYPE_SELECT,
    selectId: id
  })
}
