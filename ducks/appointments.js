import gql from 'graphql-tag'

const APPOINTMENT_APPOINTMENTS_QUERY = 'appointment/appointments/query'
const APPOINTMENT_APPOINTMENTS_QUERY_SUCCESS = 'appointment/appointments/query/success'
const APPOINTMENT_APPOINTMENTS_QUERY_FAIL = 'appointment/appointments/query/fail'
const APPOINTMENT_APPOINTMENTS_QUERYDETAIL = 'appointment/appointments/querydetail'
const APPOINTMENT_APPOINTMENTS_QUERYDETAIL_SUCCESS = 'appointment/appointments/querydetail/success'
const APPOINTMENT_APPOINTMENTS_QUERYDETAIL_FAIL = 'appointment/appointments/querydetail/fail'
const APPOINTMENT_APPOINTMENTS_SELECT = 'appointment/appointments/select'
const APPOINTMENT_APPOINTMENTS_ADD = 'appointment/appointments/add'
const APPOINTMENT_APPOINTMENTS_ADD_SUCCESS = 'appointment/appointments/add/success'
const APPOINTMENT_APPOINTMENTS_ADD_FAIL = 'appointment/appointments/add/fail'
const APPOINTMENT_APPOINTMENTS_UPDATE = 'appointment/appointments/update'
const APPOINTMENT_APPOINTMENTS_UPDATE_SUCCESS = 'appointment/appointments/update/success'
const APPOINTMENT_APPOINTMENTS_UPDATE_FAIL = 'appointment/appointments/update/fail'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectId: null
}

export const appointments = (state = initState, action) => {
  switch (action.type) {
    case APPOINTMENT_APPOINTMENTS_QUERY:
    case APPOINTMENT_APPOINTMENTS_QUERYDETAIL:
    case APPOINTMENT_APPOINTMENTS_ADD:
    case APPOINTMENT_APPOINTMENTS_UPDATE:
      return Object.assign({}, state, { loading: true, error: null })
    case APPOINTMENT_APPOINTMENTS_QUERY_FAIL:
    case APPOINTMENT_APPOINTMENTS_QUERYDETAIL_FAIL:
    case APPOINTMENT_APPOINTMENTS_ADD_FAIL:
    case APPOINTMENT_APPOINTMENTS_UPDATE_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case APPOINTMENT_APPOINTMENTS_QUERY_SUCCESS:
    case APPOINTMENT_APPOINTMENTS_QUERYDETAIL_SUCCESS:
    case APPOINTMENT_APPOINTMENTS_ADD_SUCCESS:
    case APPOINTMENT_APPOINTMENTS_UPDATE_SUCCESS:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.appointments),
        loading: false,
        error: action.error
      })
    case APPOINTMENT_APPOINTMENTS_SELECT:
      return Object.assign({}, state, {selectId: action.appointmentId})
    default :
      return state
  }
}

const QUERY_APPOINTMENTS = gql`
  query ($userId: ObjID!) {
    user(id: $userId) {
      id
      patients {
        id
        patientCards {
          id
          appointments {
            id
            orderSn
            visitStatus
            payStatus
            visitNo
            payType
            seqNo
            timeRangeOfVist
            patientCard{
              id
              patientIdNo
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
      }
    }
  }
`

// 获取挂号列表
export const queryAppointments = (client, { userId }) => async dispatch => {
  console.log('----suerId', userId)
  dispatch({
    type: APPOINTMENT_APPOINTMENTS_QUERY
  })
  try {
    const data = await client.query({ query: QUERY_APPOINTMENTS, variables: { userId } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_APPOINTMENTS_QUERY_FAIL,
        error: data.error.message
      })
    }
    const patients = data.data.user.patients
    const json = {}
    for (let patient of patients) {
      const patientId = patient.id
      const patientCards = patient.patientCards
      for (let patientCard of patientCards) {
        const appointments = patientCard.appointments
        for (let appointment of appointments) {
          json[appointment.id] = Object.assign({}, appointment, { patientId })
        }
      }
    }
    console.log('----json', patients, json)
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_QUERY_SUCCESS,
      appointments: json
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_QUERY_FAIL,
      error: e.message
    })
  }
}

const QUERY_APPOINTMENT_DETAIL = gql`
  query ($appointmentId: ObjID!) {
    appointment(id: $appointmentId) {
      id
      orderSn
      visitStatus
      payStatus
      visitNo
      payType
      seqNo
      timeRangeOfVist
      patientCard {
        id
        patientIdNo
        patient{
          id
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

// 获取挂号订单详情
export const queryAppointmentDetail = (client, { appointmentId }) => async dispatch => {
  dispatch({
    type: APPOINTMENT_APPOINTMENTS_QUERYDETAIL
  })
  try {
    const data = await client.query({ query: QUERY_APPOINTMENT_DETAIL, variables: { appointmentId } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_APPOINTMENTS_QUERYDETAIL_FAIL,
        error: data.error.message
      })
    }
    const appointment = data.data.appointment
    const patientId = appointment.patientCard.patient.id
    const json = {}
    json[appointment.id] = Object.assign({}, appointment, { patientId })
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_QUERYDETAIL_SUCCESS,
      appointments: json
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_QUERYDETAIL_FAIL,
      error: e.message
    })
  }
}

const ADD_APPOINTMENT = gql`
  mutation ($scheduleId: ObjID!, $patientCardId: ObjID!, $visitScheduleTimeId: ObjID, $patientTypeId: ObjID, $timeRangeOfVist:String, $payType: String, $visitNo: String) {
    createAppointment(input: {visitScheduleId: $scheduleId, patientCardId: $patientCardId, patientTypeId: $patientTypeId, visitScheduleTimeId: $visitScheduleTimeId, timeRangeOfVist:$timeRangeOfVist, payType: $payType, visitNo: $visitNo}) {
      id
      orderSn
      visitStatus
      payStatus
      visitNo
      seqNo
      payType
      timeRangeOfVist
      patientCard {
        id
        patientIdNo
        patient {
          id
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

// 挂号
export const addAppointment = (client, {scheduleId, patientCardId, patientTypeId, visitScheduleTimeId, timeRangeOfVist, payType, visitNo}) => async dispatch => {
  console.log(scheduleId, patientCardId, visitScheduleTimeId, payType)
  dispatch({
    type: APPOINTMENT_APPOINTMENTS_ADD
  })
  try {
    let data = await client.mutate({ mutation: ADD_APPOINTMENT, variables: { scheduleId, patientCardId, patientTypeId, visitScheduleTimeId, timeRangeOfVist, payType, visitNo } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_APPOINTMENTS_ADD_FAIL,
        error: data.error.message
      })
    }
    const appointment = data.data.createAppointment
    const patientId = appointment.patientCard.patient.id
    const json = {}
    json[appointment.id] = Object.assign({}, appointment, { patientId })
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_ADD_SUCCESS,
      appointments: json
    })
    return appointment.id
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_ADD_FAIL,
      error: e.message
    })
  }
}

const UPDATE_APPOINTMENT = gql`
  mutation ($appointmentId: ObjID!, $visitStatus: String, $payStatus: Boolean) {
    updateAppointment(id: $appointmentId, input: {visitStatus: $visitStatus, payStatus: $payStatus}) {
      id
      orderSn
      visitStatus
      payStatus
      seqNo
      visitNo
      payType
      timeRangeOfVist
      patientCard {
        id
        patientIdNo
        patient {
          id
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

// 修改挂号订单 （取消，支付）
export const updateAppointment = (client, { appointmentId, visitStatus, payStatus }) => async dispatch => {
  let variables = {
    appointmentId
  }
  if (visitStatus) variables.visitStatus = visitStatus
  if (payStatus) variables.payStatus = payStatus
  dispatch({
    type: APPOINTMENT_APPOINTMENTS_UPDATE
  })
  try {
    let data = await client.mutate({ mutation: UPDATE_APPOINTMENT, variables: variables })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_APPOINTMENTS_UPDATE_FAIL,
        error: data.error.message
      })
    }
    const appointment = data.data.updateAppointment
    const patientId = appointment.patientCard.patient.id
    const json = {}
    json[appointment.id] = Object.assign({}, appointment, { patientId })
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_UPDATE_SUCCESS,
      appointments: json
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: APPOINTMENT_APPOINTMENTS_UPDATE_FAIL,
      error: e.message
    })
  }
}

// 选择挂号订单
export const selectAppointment = ({ appointmentId }) => dispatch => {
  dispatch({
    type: APPOINTMENT_APPOINTMENTS_SELECT,
    appointmentId
  })
}
