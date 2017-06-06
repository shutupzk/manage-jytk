import { gql } from 'react-apollo'

const INPATIENT_BILLITEM_QUERY = 'inpatient/billitem/query'
const INPATIENT_BILLITEM_SELECT = 'inpatient/billitem/select'
const INPATIENT_BILLITEM_SUCCESS = 'inpatient/billitem/success'
const INPATIENT_BILLITEM_FAIL = 'inpatient/billitem/fail'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectedBillItemId: null
}

// reducer
export function billitem (state = initState, action = {}) {
  switch (action.type) {
    case INPATIENT_BILLITEM_SUCCESS:
      return Object.assign({}, state, action.billItems, { status: action.type, error: null })
    case INPATIENT_BILLITEM_FAIL:
      return Object.assign({}, state, { status: action.type, error: action.error })
    case INPATIENT_BILLITEM_QUERY:
      return Object.assign({}, state, { status: action.type, error: null })
    case INPATIENT_BILLITEM_SELECT:
      return Object.assign({}, state, { selectedBillItemId: action.selectedBillItemId })
    default:
      return state
  }
}

const QUREBILLITEM = gql`{
  inpatientDayList(id:"59099f9ce092df3f5576afb3"){
    inpatientBillItems{
      id
      name
      price
      amout
      unit
      total
    }
  }
}`

export const queryBillitems = (client, dayListId) => async dispatch => {
  if (!dayListId) return
  dispatch({
    type: INPATIENT_BILLITEM_QUERY
  })
  try {
    let data = await client.query({ query: QUREBILLITEM })
    if (data.error) {
      return dispatch({
        type: INPATIENT_BILLITEM_FAIL,
        error: data.error.message
      })
    }
    let docs = data.data.inpatientDayList.inpatientBillItems
    let json = {}
    for (let doc of docs) {
      json[doc.id] = doc
    }
    dispatch({
      type: INPATIENT_BILLITEM_SUCCESS,
      billItems: json
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: INPATIENT_BILLITEM_FAIL,
      error: e
    })
  }
}

export const selectBillitem = (billItemId) => dispatch => {
  dispatch({
    type: INPATIENT_BILLITEM_SELECT,
    selectedBillItemId: billItemId
  })
}
