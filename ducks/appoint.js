import gql from 'graphql-tag'

const APPOINTS_QUERY_APPOINTS = 'appoints/queryappoints'
const APPOINTS_QUERY_APPOINTS_SUCCESS = 'appoints/queryappoints/success'
const APPOINTS_QUERY_APPOINTS_FAIL = 'appoints/queryappoints/fail'

const CANCEL_APPOINTMENT_SUCCESS = 'appoints/cancelappoint/success'

const APPOINTS_QUERY_APPOINT_DETAIL_SUCCESS = 'appoints/queryappointdetail/success'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function appointments (state = initState, action = {}) {
  switch (action.type) {
    case APPOINTS_QUERY_APPOINTS:
      return Object.assign({}, state, { loading: true, error: null })
    case APPOINTS_QUERY_APPOINTS_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case APPOINTS_QUERY_APPOINTS_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { appointments: action.appointments }) }, { loading: false, error: null })
    case CANCEL_APPOINTMENT_SUCCESS:
    case APPOINTS_QUERY_APPOINT_DETAIL_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { appointment: action.appointment }) }, { loading: false, error: null })
    default:
      return state
  }
}

const QUERY_APPOINTMENTS = gql`
  query($skip: Int, $limit: Int) {
    appointments(limit: $limit, skip: $skip) {
      id
      orderSn
      visitStatus
      payStatus
      visitNo
      payType
      timeRangeOfVist
      patientCard {
        id
        patient {
          name
          id
        }
        hospital {
          hospitalName
        }
      }
      visitSchedule {
        id
        visitDate
        amPm
        beginTime
        endTime
        clinicCode
        clinicType
        registerFee
        department {
          id
          deptName
        }
        doctor {
          id
          doctorName
        }
      }
    }
  }
`

export const queryAppointments = (client, { limit, skip }) => async dispatch => {
  dispatch({
    type: APPOINTS_QUERY_APPOINTS
  })
  try {
    const data = await client.query({ query: QUERY_APPOINTMENTS, variables: { limit, skip }, fetchPolicy: 'network-only' })
    if (data.error) {
      return dispatch({
        type: APPOINTS_QUERY_APPOINTS_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: APPOINTS_QUERY_APPOINTS_SUCCESS,
      appointments: data.data.appointments
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTS_QUERY_APPOINTS_FAIL,
      error: e.message
    })
  }
}

const QUERY_APPOINTMENT_DETAIL = gql`
  query($id: ObjID!) {
    appointment(id: $id) {
      id
      orderSn
      visitStatus
      payStatus
      visitNo
      payType
      timeRangeOfVist
      patientCard {
        id
        patientIdNo
        patient {
          id
          name
          sex
          certificateNo
          certificateType
        }
        hospital {
          hospitalName
        }
      }
      visitSchedule {
        id
        visitDate
        amPm
        beginTime
        endTime
        clinicCode
        clinicType
        registerFee
        department {
          id
          deptName
        }
        doctor {
          id
          doctorName
        }
      }
    }
  }
`
export const queryAppointmentDetail = (client, { id }) => async dispatch => {
  dispatch({
    type: APPOINTS_QUERY_APPOINTS
  })
  try {
    const data = await client.query({ query: QUERY_APPOINTMENT_DETAIL, variables: { id } })
    if (data.error) {
      return dispatch({
        type: APPOINTS_QUERY_APPOINTS_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: APPOINTS_QUERY_APPOINT_DETAIL_SUCCESS,
      appointment: data.data.appointment
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTS_QUERY_APPOINTS_FAIL,
      error: e.message
    })
  }
}

const CANCEL_APPOINTMENT = gql`
  mutation($id: ObjID!) {
    cancelAppointment(id: $id) {
      id
    }
  }
`
export const cancelAppointment = (client, { id }) => async dispatch => {
  dispatch({
    type: APPOINTS_QUERY_APPOINTS
  })
  try {
    let data = await client.mutate({
      mutation: CANCEL_APPOINTMENT,
      variables: { id }
    })
    if (data.error) {
      dispatch({
        type: APPOINTS_QUERY_APPOINTS_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: CANCEL_APPOINTMENT_SUCCESS,
      appointment: cancelAppointment
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTS_QUERY_APPOINTS_FAIL,
      error: e.message
    })
    return e.message
  }
}
