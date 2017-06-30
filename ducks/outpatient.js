import gql from 'graphql-tag'
// action types
export const OUTPATIENT_OUTPATIENT_QUERY = 'outpatient/outpatient/query'
export const OUTPATIENT_OUTPATIENT_QUERY_SUCCESS = 'outpatient/outpatient/query/success'
export const OUTPATIENT_OUTPATIENT_QUERY_FAIL = 'outpatient/outpatient/query/fail'

const initState = {
  data: {},
  selectId: null,
  loading: false,
  error: null
}

// reducers
export function outpatient (state = initState, action) {
  switch (action.type) {
    case OUTPATIENT_OUTPATIENT_QUERY_SUCCESS:
      return Object.assign({}, state, { data: action.paymentTotals, loading: false, error: null })
    case OUTPATIENT_OUTPATIENT_QUERY_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case OUTPATIENT_OUTPATIENT_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    default:
      return state
  }
}
// fetch & action creators
export const queryOutpatient = (client, { userId }) => async dispatch => {
  dispatch({
    type: OUTPATIENT_OUTPATIENT_QUERY
  })
  try {
    let data = await client.query({ query: OUTPAYMENTS, variables: { userId } })
    if (data.error) {
      return dispatch({
        type: OUTPATIENT_OUTPATIENT_QUERY_FAIL,
        error: data.error.message
      })
    }
    let patients = data.data.user.patients
    let array = {}
    for (let patient of patients) {
      let name = patient.name
      let patientId = patient.id
      for (let card of patient.patientCards) {
        if (card.appointments.length > 0) {
          for (let appoint of card.appointments) {
            if (appoint.outPaymentTotal) {
              let outpatient = {}
              outpatient.visitSchedule = appoint.visitSchedule
              outpatient.department = appoint.visitSchedule.department
              outpatient.doctor = appoint.visitSchedule.doctor
              outpatient.appointmentFee = appoint.appointmentFee
              outpatient.registerFee = appoint.visitSchedule.registerFee
              outpatient.treatFee = appoint.visitSchedule.treatFee
              outpatient.patientName = name
              outpatient.patientId = patientId
              let outpatient2 = Object.assign({}, appoint.outPaymentTotal, outpatient)
              // outpatient.outPaymentTotal = appoint.outPaymentTotal
              array[appoint.outPaymentTotal.id] = outpatient2
            }
          }
        }
      }
    }
    return dispatch({
      type: OUTPATIENT_OUTPATIENT_QUERY_SUCCESS,
      paymentTotals: array
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: OUTPATIENT_OUTPATIENT_QUERY_FAIL,
      error: e.message
    })
  }
}
export const OUTPAYMENTS = gql`
  query ($userId: ObjID!) {
    user(id: $userId) {
      id
      patients {
        id
        name
        patientCards {
          id
          appointments{
            id
            times
            appointmentFee
            visitSchedule {
              visitDate
              amPm
              registerFee
              treatFee
              doctor{
                id
                doctorName
              }
              department {
                id
                deptName
              }
            }
            outPaymentTotal{
              id
              chargeTotal
              individualPayment
              carteVitalPayment
              carteVitalAcountPayment
              payStatus
            }
          }
        }
      }
    }
  }
`
