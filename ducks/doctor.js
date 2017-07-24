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
			phone
			evaluate
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
      return dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: DOCTOR_QUERY_DOCTOR_SUCCESS,
      doctor: data.data.doctors
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: DOCTOR_QUERY_DOCTOR_FAIL,
      error: e.message
    })
  }
}


// doctor detail
const QUERY_CONSULATION_DETAIL = gql`
  query($id: ObjID!) {
		consultation(id: $id){
			id
			type
			status
			content
			fee
			refundReason
			createdAt
			consultationReason {
				id
				reason
			}
			doctor{
				id
				doctorName
				departmentHasDoctors{
					department{
						hospital{
							hospitalName
						}
					}
				}
			}
			patient{
				id
				name
				phone
				sex
				birthday
				user {
					id
					phone
					name
					sex
					birthday
				}
			}
			payment{
				id
				totalFee
				transactionNo
				outTradeNo
				tradeNo
				createdAt
				payWay
			}
		}
	}
`

export const queryDoctorDetail = (client, {id}) => async dispatch => {
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
		const data = await client.query({ query: QUERY_CONSULATION_DETAIL , variables: { id }})
		console.log('------doctor', data)
    if (data.error) {
      return dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: DOCTOR_QUERY_DOCTOR_DETAIL_SUCCESS,
      doctor: data.data.consultation
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: DOCTOR_QUERY_DOCTOR_FAIL,
      error: e.message
    })
  }
}

// update doctor

const UPDATE_DOCTOR = gql`
  mutation($id: ObjID!, $major: String, $sex: String, $recommend: Boolean,
    $hot: Boolean, $isAppointment: Boolean, $phone: String, $workingYears: Int, $description: String){
    updateDoctor(id: $id, input: {major: $major, sex: $sex,
      recommend: $recommend, hot: $hot, isAppointment: $isAppointment, phone: $phone,
      workingYears: $workingYears, description: $description}){
      id
    }
  }
`

export const updateDoctor = (client, {id, major, recommend, hot, isAppointment, phone, workingYears, description}) => async dispatch => {
  console.log('---updateDoctor', id, major, recommend, hot, isAppointment, phone, workingYears, description)
  dispatch({
    type: DOCTOR_QUERY_DOCTOR
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_DOCTOR,
      variables: { id, major, recommend, hot, isAppointment, phone, workingYears, description }
		})
		if (data.error) {
      return dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: UPDATE_DOCTOR_SUCCESS,
      doctor: data.data.updateDoctor
    })
  } catch (e) {
    dispatch({
      trype: DOCTOR_QUERY_DOCTOR_FAIL,
      error: e.message
    })
    return e.message
  }
}

// update doctor
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
      return dispatch({
        type: DOCTOR_QUERY_DOCTOR_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: UPDATE_DOCTOR_SUCCESS,
      doctor: data.data.createDoctor
    })
  } catch (e) {
    dispatch({
      trype: DOCTOR_QUERY_DOCTOR_FAIL,
      error: e.message
    })
    return e.message
  }
}
