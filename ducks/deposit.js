import { gql } from 'react-apollo'

const INPATEINT_DEPOSIT_QUERY = 'inpatient/deposit/query'
const INPATEINT_DEPOSIT_SELECT = 'inpatient/deposit/select'
const INPATEINT_DEPOSIT_SUCCESS = 'inpatient/deposit/success'
const INPATEINT_DEPOSIT_FAIL = 'inpatient/deposit/fail'
const INPATEINT_DEPOSIT_ERROR = 'inpatient/deposit/requesterror'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectId: null
}

export function deposit (state = initState, action = {}) {
  switch (action.type) {
    case INPATEINT_DEPOSIT_SUCCESS:
      return Object.assign({}, state, { data: action.deposits, loading: false, error: null })
    case INPATEINT_DEPOSIT_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case INPATEINT_DEPOSIT_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case INPATEINT_DEPOSIT_SELECT:
      return Object.assign({}, state, { selectId: action.depositId, loading: false, error: null })
    default:
      return state
  }
}

// const DEPOSITES = gql`{
//   depositRecodes{
//     id
//     charge
//     date
//     payWay
//     tradeNo
//   }
// }`

const DEPOSITES = gql`
  query($id: ObjID!){
    patient(id: $id) {
      id
      name
      inpatientCards {
        id
        inpatientNo
        depositRecodes{
          id
          charge
          date
          payWay
          tradeNo
          createdAt
        }
      }
    }
  }
`

export const queryDeposits = (client, {patientId}) => async dispatch => {
  if (!patientId) return
  dispatch({
    type: INPATEINT_DEPOSIT_QUERY
  })
  try {
    let data = await client.query({ query: DEPOSITES, variables: {id: patientId} }) // 58eb7c94c77c0857c9dc5b1e
    if (data.error) {
      return dispatch({
        type: INPATEINT_DEPOSIT_FAIL,
        error: data.error.message
      })
    }
    let inpatientCards = data.data.patient.inpatientCards
    // let patientId = data.data.patient.id
    let patientName = data.data.patient.name
    let json = {}
    for (let doc of inpatientCards) {
      let inpatientNo = doc.inpatientNo
      for (let deposit of doc.depositRecodes) {
        let newDeposit = Object.assign({}, deposit, {patientName, patientId, inpatientNo})
        json[deposit.id] = newDeposit
      }
    }
    return dispatch({
      type: INPATEINT_DEPOSIT_SUCCESS,
      deposits: json
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: INPATEINT_DEPOSIT_FAIL,
      error: INPATEINT_DEPOSIT_ERROR
    })
  }
}

export const selectDeposit = (depositId) => dispatch => {
  dispatch({
    type: INPATEINT_DEPOSIT_SELECT,
    depositId: depositId
  })
}
