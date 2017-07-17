import gql from 'graphql-tag'
// action types
export const OUTPATIENT_OUTPATIENT_QUERY = 'outpatient/outpatient/query'
export const OUTPATIENT_OUTPATIENT_QUERY_SUCCESS = 'outpatient/outpatient/query/success'
export const OUTPATIENT_OUTPATIENT_QUERY_FAIL = 'outpatient/outpatient/query/fail'

export const OUTPATIENT_OUTPAYMENT_QUERY = 'outpatient/detail/query'
export const OUTPATIENT_OUTPAYMENT_QUERY_SUCCESS = 'outpatient/detail/query/success'
export const OUTPATIENT_OUTPAYMENT_QUERY_FAIL = 'outpatient/detail/query/fail'

export const OUTPATIENT_OUTPAYMENT_SELECT = 'outpatient/outpatient/select'

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
    case OUTPATIENT_OUTPAYMENT_QUERY_SUCCESS:
      const newOutpatient = getNewOutpatient(state, action.paymentTotals)
      return Object.assign({}, state, { data: newOutpatient, loading: false, error: null })
    case OUTPATIENT_OUTPATIENT_QUERY_FAIL:
    case OUTPATIENT_OUTPAYMENT_QUERY_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case OUTPATIENT_OUTPATIENT_QUERY:
    case OUTPATIENT_OUTPAYMENT_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case OUTPATIENT_OUTPAYMENT_SELECT:
      return Object.assign({}, state, {selectId: action.selectId})
    default:
      return state
  }
}

const getNewOutpatient = (state, action) => {
  let paymentTotal = {}
  paymentTotal[action.id] = action // Object.assign({}, state.data[action.id], {outPayments: action.outPayments})
  let newData = Object.assign({}, state.data, paymentTotal)
  return newData
}

// fetch & action creators
export const queryOutpatient = (client, { userId }) => async dispatch => {
  console.log('----queryOutpatient----', userId)
  dispatch({
    type: OUTPATIENT_OUTPATIENT_QUERY
  })
  try {
    let data = await client.query({ query: OUTPAYMENTTOTALS, variables: { userId } })
    if (data.error) {
      return dispatch({
        type: OUTPATIENT_OUTPATIENT_QUERY_FAIL,
        error: data.error.message
      })
    }
    console.log('------data', data)
    let patients = data.data.user.patients
    let array = {}
    for (let patient of patients) {
      let name = patient.name
      let phone = patient.phone
      let patientId = patient.id
      for (let card of patient.patientCards) {
        if (card.appointments.length > 0) {
          for (let appoint of card.appointments) {
            if (appoint.outPaymentTotal) {
              let outpatient = {}
              outpatient.visitSchedule = appoint.visitSchedule
              outpatient.department = appoint.visitSchedule.department
              outpatient.doctor = appoint.visitSchedule.doctor
              outpatient.seqNo = appoint.seqNo
              outpatient.appointmentFee = appoint.appointmentFee
              outpatient.registerFee = appoint.visitSchedule.registerFee
              outpatient.treatFee = appoint.visitSchedule.treatFee
              outpatient.patientName = name
              outpatient.patientPhone = phone
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
export const OUTPAYMENTTOTALS = gql`
  query ($userId: ObjID!) {
    user(id: $userId) {
      id
      patients {
        id
        name
        phone
        patientCards {
          id
          appointments{
            id
            times
            seqNo
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
export const queryOutpatientDetail = (client, { id }) => async dispatch => {
  dispatch({
    type: OUTPATIENT_OUTPAYMENT_QUERY
  })
  try {
    let data = await client.query({ query: OUTPAYMENTS, variables: { id } })
    if (data.error) {
      return dispatch({
        type: OUTPATIENT_OUTPAYMENT_QUERY_FAIL,
        error: data.error.message
      })
    }
    let outPaymentTotal = data.data.outPaymentTotal
    const appoint = outPaymentTotal.appointment
    const name = appoint.patientCard.patient.name
    const phone = appoint.patientCard.patient.phone
    const patientId = appoint.patientCard.patient.id
    let outpatient = {}
    outpatient.visitSchedule = appoint.visitSchedule
    outpatient.seqNo = appoint.seqNo
    outpatient.department = appoint.visitSchedule.department
    outpatient.doctor = appoint.visitSchedule.doctor
    outpatient.appointmentFee = appoint.appointmentFee
    outpatient.registerFee = appoint.visitSchedule.registerFee
    outpatient.treatFee = appoint.visitSchedule.treatFee
    outpatient.patientName = name
    outpatient.patientPhone = phone
    outpatient.patientId = patientId
    let outData = Object.assign({}, outPaymentTotal, outpatient)
    return dispatch({
      type: OUTPATIENT_OUTPAYMENT_QUERY_SUCCESS,
      paymentTotals: outData
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: OUTPATIENT_OUTPAYMENT_QUERY_FAIL,
      error: e.message
    })
  }
}

const OUTPAYMENTS = gql`
  query($id: ObjID!) {
    outPaymentTotal(id: $id){
      id
      chargeTotal
      individualPayment
      carteVitalPayment
      carteVitalAcountPayment
      payStatus
      appointment{
        id
        times
        seqNo
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
        patientCard{
          patient{
            id
            name
            phone
          }
        }
      }
      outPayments{
        id
        ticketId
        typeCode
        typeName
        orderNo
        date
        chargeTotal
        payStatus
        outTradeNo
        paymentAcount
        createdAt
        outPaymentItems{
          id
          itemName
          itemNo
          unit
          price
          YBtype
          drugStatus
        }
      }
    }
  }
`
// 选择就诊人
export const selectOutpatient = ({ id }) => dispatch => {
  return dispatch({
    type: OUTPATIENT_OUTPAYMENT_SELECT,
    selectId: id
  })
}
