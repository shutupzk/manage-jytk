import localforage from 'localforage'
import gql from 'graphql-tag'

const DOCTOR_QUERY_DOCTOR = 'doctor/querydoctor'
const DOCTOR_QUERY_DOCTOR_SUCCESS = 'doctor/querydoctor/success'
const DOCTOR_QUERY_DOCTOR_FAIL = 'doctor/querydoctor/fail'

const DOCTOR_QUERY_DOCTOR_DETAIL_SUCCESS = 'doctor/querydoctor/detail/success'

const UPDATE_DOCTOR_SUCCESS = 'doctor/updatedoctor/success'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function doctor (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case DOCTOR_QUERY_DOCTOR:
      return Object.assign({}, state, { loading: true, error: null })
    case DOCTOR_QUERY_DOCTOR_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
		case DOCTOR_QUERY_DOCTOR_SUCCESS:
		case DOCTOR_QUERY_DOCTOR_DETAIL_SUCCESS:
		case UPDATE_DOCTOR_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: action.doctor },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// doctor list
const QUERY_DOCTORS = gql`
  query {
		doctors {
			id
			doctorSn
			doctorName
			avatar
			remark
			title
			major
			description
			remark
			recommend
      hot
      quikeOpen
      videoOpen
      imageAndTextOpen
			phone
      evaluate
      quikePrice
			imageAndTextPrice
			videoPrice
			serviceTotal
			workingYears
			favorableRate
			departmentHasDoctors{
				department{
					childs {
						id
						deptName
					}
					deptName
					hospital{
						hospitalName
					}
				}
			}
    }
	}
`

export const queryDoctors = (client) => async dispatch => {
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
		const data = await client.query({ query: QUERY_DOCTORS, fetchPolicy: 'network-only'})
    if (data.error) {
      dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: DOCTOR_QUERY_DOCTOR_SUCCESS,
      doctor: data.data.doctors
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: DOCTOR_QUERY_DOCTOR_FAIL,
      error: e.message
    })
    return e.message
  }
}

// update doctor
const UPDATE_DOCTOR = gql`
  mutation($id: ObjID!, $major: String, $sex: String, $recommend: Boolean,
    $hot: Boolean, $isAppointment: Boolean, $phone: String, $workingYears: Int, $description: String,
    $quikeOpen: Boolean,
    $imageAndTextOpen: Boolean,
    $videoOpen: Boolean,
    $quikePrice: Int,
    $imageAndTextPrice: Int,
    $videoPrice: Int
){
    updateDoctor(id: $id, input: {major: $major, sex: $sex,
      recommend: $recommend, hot: $hot, isAppointment: $isAppointment, phone: $phone,
      workingYears: $workingYears, description: $description,
      quikeOpen: $quikeOpen, imageAndTextOpen: $imageAndTextOpen, videoOpen: $videoOpen,
      quikePrice: $quikePrice, imageAndTextPrice: $imageAndTextPrice, videoPrice: $videoPrice
    }){
      id
    }
  }
`

export const updateDoctor = (client, {id, major, recommend, hot, isAppointment, phone, workingYears, description, quikeOpen, imageAndTextOpen, videoOpen, quikePrice, imageAndTextPrice, videoPrice}) => async dispatch => {
  console.log('---updateDoctor', id, major, recommend, hot, isAppointment, phone, workingYears, description, quikeOpen, imageAndTextOpen, videoOpen, quikePrice, imageAndTextPrice, videoPrice)
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_DOCTOR,
      variables: { id, major, recommend, hot, isAppointment, phone, workingYears, description, quikeOpen, imageAndTextOpen, videoOpen, quikePrice, imageAndTextPrice, videoPrice}
		})
		if (data.error) {
      dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_DOCTOR_SUCCESS,
      doctor: data.data.updateDoctor
    })
    return null
  } catch (e) {
    dispatch({
      trype: DOCTOR_QUERY_DOCTOR_FAIL,
      error: e.message
    })
    return e.message
  }
}

// create doctor
const CREATE_DOCTOR = gql`
  mutation($doctorSn: String!, $doctorName: String!, $major: String, $sex: String, $recommend: Boolean,
    $hot: Boolean, $isAppointment: Boolean, $phone: String, $workingYears: Int, $description: String){
    createDoctor(input: {doctorSn: $doctorSn, doctorName: $doctorName, major: $major, sex: $sex,
      recommend: $recommend, hot: $hot, isAppointment: $isAppointment, phone: $phone,
      workingYears: $workingYears, description: $description}){
      id
    }
  }
`

export const createDoctor = (client, {doctorSn, doctorName, major, sex, recommend, hot, isAppointment, phone, workingYears, description}) => async dispatch => {
  console.log('---createDoctor', doctorSn, doctorName, major, sex, recommend, hot, isAppointment, phone, workingYears, description)
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
    let data = await client.mutate({
      mutation: CREATE_DOCTOR,
      variables: { doctorSn, doctorName, major, recommend, hot, isAppointment, phone, workingYears, description }
		})
		if (data.error) {
      dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_DOCTOR_SUCCESS,
      doctor: data.data.createDoctor
    })
    return null
  } catch (e) {
    dispatch({
      trype: DOCTOR_QUERY_DOCTOR_FAIL,
      error: e.message
    })
    return e.message
  }
}
