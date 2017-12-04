import gql from 'graphql-tag'

const PAYMENT_PAYMENT_SUCCESS = 'PAYMENT_PAYMENT_SUCCESS'
const PAYMENT_PAYMENT_SELECT = 'PAYMENT_PAYMENT_SELECT'

const initState = {
  data: {},
  selectId: null
}

export function payments (state = initState, action = {}) {
  switch (action.type) {
    case PAYMENT_PAYMENT_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data) })
    case PAYMENT_PAYMENT_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_SUBJECTS = gql`
  query($skip: Int, $name: String, $tradeNo: String) {
    payments(skip: $skip, name: $name, tradeNo: $tradeNo) {
      id
      totalFee
      type
      outTradeNo
      tradeNo
      payWay
      status
      bussStatus
      payTime
      refundTime
      createdAt
      user {
        id
        phone
        name
      }
    }
  }
`

export const queryPayments = (client, { skip, name, tradeNo }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SUBJECTS, variables: { skip, name, tradeNo }, fetchPolicy: 'network-only' })
    const { payments } = data.data
    let json = {}
    for (let doc of payments) {
      json[doc.id] = doc
    }
    dispatch({
      type: PAYMENT_PAYMENT_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
  }
}

export const selectPayment = ({ paymentId }) => dispatch => {
  dispatch({
    type: PAYMENT_PAYMENT_SELECT,
    selectId: paymentId
  })
}
