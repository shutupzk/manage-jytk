import localforage from 'localforage'
import gql from 'graphql-tag'

const HOSPITAL_QUERY_HOSPITAL = 'hospital/queryhospital'
const HOSPITAL_QUERY_HOSPITAL_SUCCESS = 'hospital/queryhospital/success'
const HOSPITAL_QUERY_HOSPITAL_FAIL = 'hospital/queryhospital/fail'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function hospital (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case HOSPITAL_QUERY_HOSPITAL:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_QUERY_HOSPITAL_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
		case HOSPITAL_QUERY_HOSPITAL_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: action.hospital },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// query hospital
const QUERY_HOSPITALS = gql`
  query {
		hospitals {
			id
      hospitalName
      hospitalCode
      phone
      logo
      address
      description
		}
	}
`

export const queryHospitals = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_QUERY_HOSPITAL
  })
  try {
		const data = await client.query({ query: QUERY_HOSPITALS, fetchPolicy: 'network-only'})
    if (data.error) {
      dispatch({
        type: HOSPITAL_QUERY_HOSPITAL_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: HOSPITAL_QUERY_HOSPITAL_SUCCESS,
      hospital: data.data.hospitals
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: HOSPITAL_QUERY_HOSPITAL_FAIL,
      error: e.message
    })
    return e.message
  }
}

// update hospital
const UPDATE_HOSPITAL = gql`
	mutation($id: ObjID!, $hospitalName: String, $hospitalCode: String, $phone: String, $logo: String, $address: String, $description: String){
		updateHospital(id: $id, input: {hospitalName: $hospitalName, hospitalCode: $hospitalCode, phone: $phone, logo: $logo, address: $address, description: $description}) {
			id
		}
	}
`

export const updateHospital = (client, {id, hospitalName, hospitalCode, phone, logo, address, description}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: HOSPITAL_QUERY_HOSPITAL
  })
  try {
		console.log('-----value', id, hospitalName, hospitalCode, phone, logo, address, description)
    let data = await client.mutate({
      mutation: UPDATE_HOSPITAL,
      variables: {id, hospitalName, hospitalCode, phone, logo, address, description}
		})
		if (data.error) {
      dispatch({
        type: HOSPITAL_QUERY_HOSPITAL_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: HOSPITAL_QUERY_HOSPITAL_SUCCESS,
      hospital: data.data.updateHospital
		})
		return null
  } catch (e) {
    dispatch({
      trype: HOSPITAL_QUERY_HOSPITAL_FAIL,
      error: e.message
    })
    return e.message
  }
}

// create hospital
const CREATE_HOSPITAL = gql`
	mutation($hospitalName: String!, $hospitalCode: String!, $phone: String, $logo: String, $address: String, $description: String){
		createHospital(input: {hospitalName: $hospitalName, hospitalCode: $hospitalCode, phone: $phone, logo: $logo, address: $address, description: $description}) {
			id
		}
	}
`

export const createHospital = (client, { hospitalName, hospitalCode, phone, logo, address, description}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: HOSPITAL_QUERY_HOSPITAL
  })
  try {
		console.log('-----value', hospitalName, hospitalCode, phone, logo, address, description)
    let data = await client.mutate({
      mutation: CREATE_HOSPITAL,
      variables: {hospitalName, hospitalCode, phone, logo, address, description}
		})
		if (data.error) {
      dispatch({
        type: HOSPITAL_QUERY_HOSPITAL_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: HOSPITAL_QUERY_HOSPITAL_SUCCESS,
      hospital: data.data.createHospital
		})
		return null
  } catch (e) {
    dispatch({
      trype: HOSPITAL_QUERY_HOSPITAL_FAIL,
      error: e.message
    })
    return e.message
  }
}