import gql from 'graphql-tag'

const INPATIENT_INPATIENT_QUERY = 'inpatient/inpatient/query'
const INPATIENT_INPATIENT_SELECT = 'inpatient/inpatient/select'
const INPATIENT_INPATIENT_SUCCESS = 'inpatient/inpatient/success'
const INPATIENT_INPATIENT_FAIL = 'inpatient/inpatient/fail'

const INPATIENT_INPATIENT_UPDATE = 'inpatient/inpatient/update'
const INPATIENT_INPATIENT_UPDATE_SUCCESS = 'inpatient/inpatient/update/success'
const INPATIENT_INPATIENT_UPDATE_FAIL = 'inpatient/inpatient/update/fail'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectInpatientId: null
}
export function inpatient (state = initState, action = {}) {
  switch (action.type) {
    case INPATIENT_INPATIENT_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case INPATIENT_INPATIENT_SUCCESS:
      return Object.assign({}, state, { loading: false, error: null }, { data: Object.assign({}, state.data, action.inpatientRecords) })
    case INPATIENT_INPATIENT_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case INPATIENT_INPATIENT_SELECT:
      return Object.assign({}, state, {selectInpatientId: action.selectInpatientId})
    default:
      return state
  }
}

const queryGql = gql`
  query($id: ObjID!)
  {
  patient(id: $id){
    id
    name
    inpatientCards{
      id
      inpatientNo
      inpatientRecords{
        id
        deptName
        wardName
        bedNo
        inDate
        outDate
        wardName
        competentDoctor
        competentNurse
        totalConsumption
        totalPayment
        balance
        status
      }
    }
  }
}
`

export const queryInpatient = (client, {patientId}) => async dispatch => {
  if (!patientId) return
  dispatch({
    type: INPATIENT_INPATIENT_QUERY
  })
  try {
    let data = await client.query({ query: queryGql, variables: { id: '58eb7c94c77c0857c9dc5b1e' } }) // 58eb7c94c77c0857c9dc5b1e
    if (data.error) {
      return dispatch({
        type: INPATIENT_INPATIENT_FAIL,
        error: data.error.message
      })
    }
    let docs = data.data.patient.inpatientCards[0].inpatientRecords
    const inpatientNo = data.data.patient.inpatientCards[0].inpatientNo
    const name = data.data.patient.name
    let inpatientRecords = {}
    for (let doc of docs) {
      inpatientRecords[doc.id] = Object.assign({}, doc, {name, inpatientNo, patientId})
    }
    return dispatch({
      type: INPATIENT_INPATIENT_SUCCESS,
      inpatientRecords
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: INPATIENT_INPATIENT_FAIL,
      error: e
    })
  }
}

const UPDATEINPATIENTRECORD = gql`
  mutation($inpatientCardId: String!){
    createInpatientCard(input:{inpatientCardId: $inpatientCardId}){
      id
    }
  }
`

export const updateInpatient = (client, {inpatientCardId, newNativePlaceProvince, marriageFlag}) => async dispatch => {
  dispatch({
    type: INPATIENT_INPATIENT_UPDATE
  })
  try {
    let data = await client.mutate({ mutation: UPDATEINPATIENTRECORD, variables: {inpatientCardId, newNativePlaceProvince} })
    if (data.error) {
      return dispatch({
        type: INPATIENT_INPATIENT_UPDATE_FAIL,
        error: data.error.message
      })
    }
    let docs = data.data.patient.inpatientCards[0].inpatientRecords
    const inpatientNo = data.data.patient.inpatientCards[0].inpatientNo
    const name = data.data.patient.name
    let inpatientRecords = {}
    for (let doc of docs) {
      inpatientRecords[doc.id] = Object.assign({}, doc, {name, inpatientNo, patientId})
    }
    return dispatch({
      type: INPATIENT_INPATIENT_UPDATE_SUCCESS,
      inpatientRecords
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: INPATIENT_INPATIENT_UPDATE_FAIL,
      error: '数据更新失败'
    })
  }
}

export const selectInpatient = (patientId) => dispatch => {
  dispatch({
    type: INPATIENT_INPATIENT_SELECT,
    selectInpatientId: patientId
  })
}
