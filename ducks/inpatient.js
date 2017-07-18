import gql from 'graphql-tag'

const INPATIENT_INPATIENT_QUERY = 'inpatient/inpatient/query'
const INPATIENT_INPATIENT_SELECT = 'inpatient/inpatient/select'
const INPATIENT_INPATIENT_SUCCESS = 'inpatient/inpatient/success'
const INPATIENT_INPATIENT_FAIL = 'inpatient/inpatient/fail'

const INPATIENT_INPATIENT_UPDATE = 'inpatient/inpatient/update'
const INPATIENT_INPATIENT_UPDATE_SUCCESS = 'inpatient/inpatient/update/success'
const INPATIENT_INPATIENT_UPDATE_FAIL = 'inpatient/inpatient/update/fail'

const INPATIENT_INPATIENTRECORD_UPDATE = 'inpatient/inpatientRecord/update'
const INPATIENT_INPATIENTRECORD_UPDATE_SUCCESS = 'inpatient/inpatientRecord/update/success'
const INPATIENT_INPATIENTRECORD_UPDATE_FAIL = 'inpatient/inpatientRecord/update/fail'

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
    case INPATIENT_INPATIENTRECORD_UPDATE_SUCCESS:
      return Object.assign({}, state, { data: action.inpatientRecords, loading: false, error: null })
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
        iPFlag
        nationalityID
        raceID
        professioinID
        marriageFlag
        newNativePlaceProvince
        newNativePlaceCity
        newCurrentAddressProvince
        newCurrentAddressCity
        newCurrentAddressTown
        newCurrentAddressStreet
        newCurrentAddressStandardNo
        newCurrentAddress
        newHRAddressProvince
        newHRAddressCity
        newHRAddress
        companyName
        companyAddress
        companyPhone
        contactPerson
        contactRelationshipFlag
        contactPhone
        contactAddress
        disChargeOrderDesc
        pharmacyWindow
      }
    }
  }
}
`

export const queryInpatient = (client, {patientId}) => async dispatch => {
  console.log('-----queryInpatient-----------', patientId)
  if (!patientId) return
  dispatch({
    type: INPATIENT_INPATIENT_QUERY
  })
  try {
    let data = await client.query({ query: queryGql, variables: { id: patientId } }) // 58eb7c94c77c0857c9dc5b1e
    console.log('-----queryInpatient----data---', data)
    if (data.error) {
      return dispatch({
        type: INPATIENT_INPATIENT_FAIL,
        error: data.error.message
      })
    }
    let docs = data.data.patient.inpatientCards[0]
    let inpatientRecords = {}
    const name = data.data.patient.name
    if (docs) {
      const inpatientCardId = docs.id
      const inpatientNo = data.data.patient.inpatientCards[0].inpatientNo
      for (let doc of docs.inpatientRecords) {
        inpatientRecords[doc.id] = Object.assign({}, doc, {name, inpatientNo, patientId, inpatientCardId})
      }
    }
    console.log(inpatientRecords)
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
  mutation($hospitalId: ObjID!, $patientId: ObjID!, $inpatientNo: String){
    createInpatientCard(input:{hospitalId: $hospitalId, patientId: $patientId, inpatientNo: $inpatientNo}){
     id
    }
  }
`

export const updateInpatient = (client, {hospitalId, patientId, inpatientNo}) => async dispatch => {
  dispatch({
    type: INPATIENT_INPATIENT_UPDATE
  })
  console.log('------params-----', hospitalId, patientId, inpatientNo)
  try {
    let data = await client.mutate({ mutation: UPDATEINPATIENTRECORD, variables: {hospitalId, patientId, inpatientNo}})
    if (data.error) {
      return dispatch({
        type: INPATIENT_INPATIENT_UPDATE_FAIL,
        error: data.error.message
      })
    }
    console.log('------successs----', data)
    // let docs = data.data.patient.inpatientCards[0].inpatientRecords
    // const inpatientNo = data.data.patient.inpatientCards[0].inpatientNo
    // const patientId = data.data.patient.id
    // const name = data.data.patient.name
    // let inpatientRecords = {}
    // for (let doc of docs) {
    //   inpatientRecords[doc.id] = Object.assign({}, doc, {name, inpatientNo, patientId})
    // }
    const createInpatientCard = data.createInpatientCard
    return dispatch({
      type: INPATIENT_INPATIENT_UPDATE_SUCCESS,
      createInpatientCard
    })
  } catch (e) {
    console.log('---bind card---successs----', e)
    return dispatch({
      type: INPATIENT_INPATIENT_UPDATE_FAIL,
      error: e.message
    })
    return e.message
  }
}

export const selectInpatient = (patientId) => dispatch => {
  dispatch({
    type: INPATIENT_INPATIENT_SELECT,
    selectInpatientId: patientId
  })
}
//  newNativePlaceProvince: "北京市", newNativePlaceCity: "海淀区", newHRAddressProvince: "北京市", newHRAddressCity: "海淀区", status: true,
// mutation($id: ObjID!, $IPFlag: String, $nationalityID: String, $raceID: String, $marriageFlag: String, $newCurrentAddress: String, $newHRAddress: String, $companyName: String, $companyAddress: String, $companyPhone: String, $contactPerson: String, $contactRelationshipFlag: String, $contactAddress: String, $contactPhone: String){
    // updateInpatientRecord(id: $id, input:{newNativePlaceProvince: "北京市", newNativePlaceCity: "海淀区", newHRAddressProvince: "北京市", newHRAddressCity: "海淀区", status: true, IPFlag: $IPFlag, nationalityID: $nationalityID, raceID: $raceID, marriageFlag: $marriageFlag, newCurrentAddress: $newCurrentAddress, newHRAddress: $newHRAddress, companyName: $companyName, companyAddress: $companyAddress, companyPhone: $companyPhone, contactPerson: $contactPerson, contactRelationshipFlag: $contactRelationshipFlag, contactAddress: $contactAddress, contactPhone: $contactPhone}){

const UPDATEINPATIENTRECORD2 = gql`
  mutation($id: ObjID!, $inpatientCardId: ObjID!, $nationalityID: String, $professioinID: String, $marriageFlag: String, $newCurrentAddress: String, $newHRAddress: String, $companyName: String, $companyAddress: String, $companyPhone: String, $contactPerson: String, $contactRelationshipFlag: String, $contactAddress: String){
    updateInpatientRecord(id: $id, input:{inpatientCardId: $inpatientCardId, newNativePlaceProvince: "北京市", newNativePlaceCity: "海淀区", newHRAddressProvince: "北京市", newHRAddressCity: "海淀区", status: true, nationalityID: $nationalityID, professioinID: $professioinID, marriageFlag: $marriageFlag, newCurrentAddress: $newCurrentAddress, newHRAddress: $newHRAddress, companyName: $companyName, companyAddress: $companyAddress, companyPhone: $companyPhone, contactPerson: $contactPerson, contactRelationshipFlag: $contactRelationshipFlag, contactAddress: $contactAddress}){
      id
      deptName
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
      iPFlag
      nationalityID
      professioinID
      raceID
      marriageFlag
      newNativePlaceProvince
      newNativePlaceCity
      newCurrentAddressProvince
      newCurrentAddressCity
      newCurrentAddressTown
      newCurrentAddressStreet
      newCurrentAddressStandardNo
      newCurrentAddress
      newHRAddressProvince
      newHRAddressCity
      newHRAddress
      companyName
      companyAddress
      companyPhone
      contactPerson
      contactRelationshipFlag
      contactPhone
      contactAddress
      disChargeOrderDesc
      pharmacyWindow
      inpatientCard{
        id
        inpatientNo
        patient{
          id
          name
        }
      }
    }
  }
`
export const updateInpatientRecord = (client, {id, inpatientCardId, nationalityID, raceID, professioinID, marriageFlag, newCurrentAddress, newHRAddress, companyAddress, companyName, companyPhone, contactPerson, contactRelationshipFlag, contactPhone, contactAddress}) => async dispatch => {
  dispatch({
    type: INPATIENT_INPATIENTRECORD_UPDATE
  })
  console.log(inpatientCardId)
  try {
    let data = await client.mutate({ mutation: UPDATEINPATIENTRECORD2, variables: {id, inpatientCardId, nationalityID, raceID, professioinID, marriageFlag, newCurrentAddress, newHRAddress, companyAddress, companyName, companyPhone, contactPerson, contactRelationshipFlag, contactPhone, contactAddress} })
    if (data.error) {
      return dispatch({
        type: INPATIENT_INPATIENTRECORD_UPDATE_FAIL,
        error: data.error.message
      })
    }
    let doc = data.data.updateInpatientRecord
    const inpatientNo = doc.inpatientCard.inpatientNo
    const patientId = doc.inpatientCard.patient.id
    const name = doc.inpatientCard.patient.name
    let inpatientRecords = {}
    inpatientRecords[doc.id] = Object.assign({}, doc, {name, inpatientNo, patientId, inpatientCardId})
    return dispatch({
      type: INPATIENT_INPATIENTRECORD_UPDATE_SUCCESS,
      inpatientRecords
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: INPATIENT_INPATIENTRECORD_UPDATE_FAIL,
      error: '数据更新失败'
    })
  }
}
