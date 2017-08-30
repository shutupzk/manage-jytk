import gql from 'graphql-tag'

const ORDER_QUERY_ORDER = 'order/queryorder'
const ORDER_QUERY_ORDER_SUCCESS = 'order/queryorder/success'
const ORDER_QUERY_ORDER_FAIL = 'order/queryorder/fail'

const ORDER_QUERY_ORDER_DETAIL_SUCCESS = 'order/queryorder/detail/success'

const UPDATE_ORDER_SUCCESS = 'order/updateorder/success'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function order (state = initState, action = {}) {
  switch (action.type) {
    case ORDER_QUERY_ORDER:
      return Object.assign({}, state, { loading: true, error: null })
    case ORDER_QUERY_ORDER_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case ORDER_QUERY_ORDER_SUCCESS:
    case ORDER_QUERY_ORDER_DETAIL_SUCCESS:
      return Object.assign({}, state, { data: action.order }, { loading: false, error: null })
    case UPDATE_ORDER_SUCCESS:
      return Object.assign({}, state, Object.assign({}, state.data, { updateOrder: action.data }))
    default:
      return state
  }
}

// order list
const QUERY_CONSULATIONS = gql`
  query($skip: Int, $limit: Int, $status: [String], $keyword: String) {
    consultations(limit: $limit, skip: $skip, status: $status, keyword: $keyword) {
      id
      type
      status
      content
      fee
      consultationNo
      refundReason
      payTime
      createdAt
      consultationReason {
        id
        reason
      }
      doctor {
        id
        doctorName
        avatar
        departmentHasDoctors {
          department {
            hospital {
              hospitalName
            }
          }
        }
      }
      patient {
        id
        name
        phone
        user {
          id
          phone
          name
          avatar
        }
      }
      payment {
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

export const queryOrderList = (client, { limit, skip, status, keyword }) => async dispatch => {
  dispatch({
    type: ORDER_QUERY_ORDER
  })
  try {
    const data = await client.query({ query: QUERY_CONSULATIONS, variables: { limit, skip, status, keyword }, fetchPolicy: 'network-only' })
    if (data.error) {
      return dispatch({
        type: ORDER_QUERY_ORDER_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: ORDER_QUERY_ORDER_SUCCESS,
      order: data.data.consultations
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: ORDER_QUERY_ORDER_FAIL,
      error: e.message
    })
    return e.message
  }
}

// order detail
const QUERY_CONSULATION_DETAIL = gql`
  query($id: ObjID!) {
    consultation(id: $id) {
      id
      type
      status
      content
      fee
      payTime
      refundReason
      refundRemark
      consultationNo
      createdAt
      consultationOperations {
        operationTime
        operationCode
        operationPeople
      }
      consultationReason {
        id
        reason
      }
      doctor {
        id
        doctorName
        avatar
        departmentHasDoctors {
          department {
            hospital {
              hospitalName
            }
          }
        }
      }
      patient {
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
          avatar
        }
      }
      payment {
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

export const queryOrderDetail = (client, { id }) => async dispatch => {
  dispatch({
    type: ORDER_QUERY_ORDER
  })
  try {
    const data = await client.query({ query: QUERY_CONSULATION_DETAIL, variables: { id } })
    console.log('------order', data)
    if (data.error) {
      return dispatch({
        type: ORDER_QUERY_ORDER_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: ORDER_QUERY_ORDER_DETAIL_SUCCESS,
      order: data.data.consultation
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: ORDER_QUERY_ORDER_FAIL,
      error: e.message
    })
  }
}

// update consultation
const UPDATE_CONSULTATION = gql`
  mutation($id: ObjID!, $status: String, $refundReason: String, $refundRemark: String) {
    updateConsultation(id: $id, input: { status: $status, refundReason: $refundReason, refundRemark: $refundRemark }) {
      id
    }
  }
`
export const updateConsultation = (client, { id, status, refundReason, refundRemark }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ORDER_QUERY_ORDER
  })
  try {
    console.log('---update---consultation--value', id, status, refundReason, refundRemark)
    let data = await client.mutate({
      mutation: UPDATE_CONSULTATION,
      variables: { id, status, refundReason, refundRemark }
    })
    if (data.error) {
      dispatch({
        type: ORDER_QUERY_ORDER_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_ORDER_SUCCESS,
      data: data.data.updateConsultation
    })
    return null
  } catch (e) {
    dispatch({
      trype: ORDER_QUERY_ORDER_FAIL,
      error: e.message
    })
    return e.message
  }
}
