import localforage from 'localforage'
import gql from 'graphql-tag'

const DOCTOR_QUERY_DOCTOR = 'doctor/querydoctor'
const DOCTOR_QUERY_DOCTOR_SUCCESS = 'doctor/querydoctor/success'
const DOCTOR_QUERY_DOCTOR_FAIL = 'doctor/querydoctor/fail'

const DOCTOR_QUERY_DOCTOR_DETAIL_SUCCESS = 'doctor/querydoctor/detail/success'

const UPDATE_DOCTOR_INFO_SUCCESS = 'doctor/updatedoctor/info/success'

const DOCTOR_SELECT_DOCTOR = 'doctor/selectdoctor'

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
    case UPDATE_DOCTOR_INFO_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: action.doctor },
        { loading: false, error: null }
      )
    case DOCTOR_SELECT_DOCTOR:
      return Object.assign(
        {},
        state,
        Object.assign({}, state.data, {selectedDoctor: action.data})
      )
    default:
      return state
  }
}

// doctor list
const QUERY_DOCTORS = gql`
  query($skip: Int, $limit: Int, $keyword: String, $quikeOpen: Boolean,
    $imageAndTextOpen: Boolean,
    $videoOpen: Boolean) {
		doctors(limit: $limit, skip: $skip, keyword: $keyword, quikeOpen: $quikeOpen, imageAndTextOpen: $imageAndTextOpen, videoOpen: $videoOpen) {
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
      showInternet
      isShow
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
      doctorSchedules(limit: 21){
        ampm
        week
        channel
      }
    }
	}
`

export const queryDoctors = (client, {limit, skip, keyword, quikeOpen, imageAndTextOpen, videoOpen}) => async dispatch => {
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
		const data = await client.query({ query: QUERY_DOCTORS, variables: { limit, skip, keyword, quikeOpen, imageAndTextOpen, videoOpen }, fetchPolicy: 'network-only'})
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
      $videoPrice: Int,
      $avatar: String,
      $showInternet: Boolean
  ){
    updateDoctor(id: $id, input: {major: $major, sex: $sex,
      recommend: $recommend, hot: $hot, isAppointment: $isAppointment, phone: $phone,
      workingYears: $workingYears, description: $description,
      quikeOpen: $quikeOpen, imageAndTextOpen: $imageAndTextOpen, videoOpen: $videoOpen,
      quikePrice: $quikePrice, imageAndTextPrice: $imageAndTextPrice, videoPrice: $videoPrice, avatar: $avatar,
      showInternet: $showInternet
    }){
      id
    }
  }
`

export const updateDoctor = (client, {id, major, recommend, hot, isAppointment, phone, workingYears, description, quikeOpen, imageAndTextOpen, videoOpen, quikePrice, imageAndTextPrice, videoPrice, avatar, showInternet}) => async dispatch => {
  console.log('---updateDoctor', id, major, recommend, hot, isAppointment, phone, workingYears, description, quikeOpen, imageAndTextOpen, videoOpen, quikePrice, imageAndTextPrice, videoPrice, avatar, showInternet)
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_DOCTOR,
      variables: { id, major, recommend, hot, isAppointment, phone, workingYears, description, quikeOpen, imageAndTextOpen, videoOpen, quikePrice, imageAndTextPrice, videoPrice, avatar, showInternet}
		})
		if (data.error) {
      dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_DOCTOR_INFO_SUCCESS,
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
    $hot: Boolean, $isAppointment: Boolean, $phone: String, $workingYears: Int, $description: String, $avatar: String){
    createDoctor(input: {doctorSn: $doctorSn, doctorName: $doctorName, major: $major, sex: $sex,
      recommend: $recommend, hot: $hot, isAppointment: $isAppointment, phone: $phone,
      workingYears: $workingYears, description: $description, avatar: $avatar}){
      id
    }
  }
`

export const createDoctor = (client, {doctorSn, doctorName, major, sex, recommend, hot, isAppointment, phone, workingYears, description, avatar}) => async dispatch => {
  console.log('---createDoctor', doctorSn, doctorName, major, sex, recommend, hot, isAppointment, phone, workingYears, description, avatar)
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
    let data = await client.mutate({
      mutation: CREATE_DOCTOR,
      variables: { doctorSn, doctorName, major, recommend, hot, isAppointment, phone, workingYears, description, avatar }
		})
		if (data.error) {
      dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_DOCTOR_INFO_SUCCESS,
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

export const selectdoctor = ({doctor}) => async dispatch => {
	dispatch({
		type: DOCTOR_SELECT_DOCTOR,
		data: doctor
  })
  return doctor
}

