import { gql } from 'react-apollo'

const INPATIENT_DAYFEE_QUERY = 'inpatient/dayfee/query'
const INPATIENT_DAYFEE_SUCCESS = 'inpatient/dayfee/success'
const INPATIENT_DAYFEE_FAIL = 'inpatient/dayfee/fail'
const INPATIENT_DAYFEE_SELECT = 'inpatient/dayfee/select'
const INPATIENT_DAYFEE_INPATIENTRECORD_SELECT = 'inpatient/dayfee/inpatientRecord/select'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectedDayfeeId: null,
  selectInpatientRecordId: null
}

export function dailyfee (state = initState, action = {}) {
  switch (action.type) {
    case INPATIENT_DAYFEE_SUCCESS:
      return Object.assign({}, state, { loading: false, error: null }, { data: Object.assign({}, state.data, action.dailyfee) })
    case INPATIENT_DAYFEE_FAIL:
      return Object.assign({}, state, { status: action.type, error: action.error })
    case INPATIENT_DAYFEE_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case INPATIENT_DAYFEE_SELECT:
      return Object.assign({}, state, { selectedDayfeeId: action.selectedDayfeeId })
    case INPATIENT_DAYFEE_INPATIENTRECORD_SELECT:
      return Object.assign({}, state, { selectInpatientRecordId: action.selectInpatientRecordId })
    default:
      return state
  }
}

const QUREYDAYLISTS = gql`
  query($inpatientRecordId: ObjID!){
    inpatientRecord(id: $inpatientRecordId){
      id
      inpatientDayLists{
        id
        date
        code
        name
        chargeTotal
        inpatientBillItems{
          name
          price
          amout
          unit
          total
        }
      }
    }
  }
`

export const queryDailyfee = (client, {inpatientRecordId}) => async dispatch => {
  if (!inpatientRecordId) return
  dispatch({
    type: INPATIENT_DAYFEE_QUERY
  })
  try {
    let data = await client.query({ query: QUREYDAYLISTS, variables: { inpatientRecordId } })
    if (data.error) {
      return dispatch({
        type: INPATIENT_DAYFEE_FAIL,
        error: data.error.message
      })
    }
    let docs = data.data.inpatientRecord.inpatientDayLists
    let json = {}
    for (let doc of docs) {
      json[doc.id] = doc
    }
    dispatch({
      type: INPATIENT_DAYFEE_SUCCESS,
      dailyfee: json
    })
  } catch (e) {
    dispatch({
      type: INPATIENT_DAYFEE_FAIL,
      error: e
    })
  }
}

export const selectInpatientRecord = ({patientRecordId}) => dispatch => {
  dispatch({
    type: INPATIENT_DAYFEE_INPATIENTRECORD_SELECT,
    selectInpatientRecordId: patientRecordId
  })
}
