import localforage from 'localforage'
import gql from 'graphql-tag'

const ORDER_QUERY_ORDER = 'order/queryorder'
const ORDER_QUERY_ORDER_SUCCESS = 'order/queryorder/success'
const ORDER_QUERY_ORDER_FAIL = 'order/queryorder/fail'

const ORDER_QUERY_ORDER_DETAIL_SUCCESS = 'order/queryorder/detail/success'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function order (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case ORDER_QUERY_ORDER:
      return Object.assign({}, state, { loading: true, error: null })
    case ORDER_QUERY_ORDER_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
		case ORDER_QUERY_ORDER_SUCCESS:
		case ORDER_QUERY_ORDER_DETAIL_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: action.order },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// order list
const QUERY_CONSULATIONS = gql`
  query {
		consultations{
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
				user {
					id
					phone
					name
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

export const queryOrderList = (client) => async dispatch => {
  dispatch({
    type: ORDER_QUERY_ORDER
  })
  try {
		const data = await client.query({ query: QUERY_CONSULATIONS})
		console.log('------order', data)
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
  }
}


// order detail
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

export const queryOrderDetail = (client, {id}) => async dispatch => {
  dispatch({
    type: ORDER_QUERY_ORDER
  })
  try {
		const data = await client.query({ query: QUERY_CONSULATION_DETAIL , variables: { id }})
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

