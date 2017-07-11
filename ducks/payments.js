import { gql } from 'react-apollo'
import localforage from 'localforage'

const PROFILE_PAYMENTS_QUERY = 'profile/payments/query'
const PROFILE_PAYMENTS_QUERY_SUCCESS = 'profile/payments/query/success'
const PROFILE_PAYMENTS_QUERY_FAIL = 'profile/payments/query/fail'

const PROFILE_PAYMENTS_SELECT = 'profile/payments/select'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectId: {}
}

// reducer
export function payments (state = initState, action = {}) {
  switch (action.type) {
    case PROFILE_PAYMENTS_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_PAYMENTS_QUERY_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case PROFILE_PAYMENTS_QUERY_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case PROFILE_PAYMENTS_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: null })
    default:
      return state
  }
}

var QUERY_PAYMENTS = gql`
  query($id: ObjID!) {
    user(id: $id){
      id
      name
      patients{
        id
        name
        phone
        patientCards{
          id
          patientIdNo
        }
        payments{
          id
          totalFee
          typeId
          typeName
          typeInfo
          outTradeNo
          tradeNo
          transactionNo
          payWay
          status
          orderInfo
          createdAt
        }
      }
    }
  }
`
export const queryPayments = (client) => async dispatch => {
  dispatch({
    type: PROFILE_PAYMENTS_QUERY
  })
  try {
    let userId = await localforage.getItem('userId')
    let data = await client.query({ query: QUERY_PAYMENTS, variables: {id: userId} })
    if (data.error) {
      return dispatch({
        type: PROFILE_PAYMENTS_QUERY_FAIL,
        error: data.error.message
      })
    }
    let patients = data.data.user.patients
    let json = {}
    for (let pat of patients) {
      const patientName = pat.name
      const patientIdNo = pat.patientCards[0].patientIdNo
      const phone = pat.phone
      for (let payment of pat.payments) {
        json[payment.id] = Object.assign({}, payment, {patientName, patientIdNo, phone})
      }
    }
    return dispatch({
      type: PROFILE_PAYMENTS_QUERY_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: PROFILE_PAYMENTS_QUERY_FAIL,
      error: '查询失败'
    })
  }
}


// 选择缴费记录
export const selectPayment = ({paymentId}) => dispatch => {
  return dispatch({
    type: PROFILE_PAYMENTS_SELECT,
    selectId: paymentId
  })
}
