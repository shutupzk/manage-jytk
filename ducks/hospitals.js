import gql from 'graphql-tag'
import { REHYDRATE } from 'redux-persist/constants'

const HOSPITAL_HOSPITALS_QUERY = 'hospital/hospitals/query'
const HOSPITAL_HOSPITALS_SUCCESS = 'hospital/hospitals/success'
const HOSPITAL_HOSPITALS_FAIL = 'hospital/hospitals/fail'

const HOSPITAL_HOSPITALS_BUILDING_QUERY = 'hospital/hospitals/building/query'
const HOSPITAL_HOSPITALS_BUILDING_SUCCESS = 'hospital/hospitals/building/success'
const HOSPITAL_HOSPITALS_BUILDING_FAIL = 'hospital/hospitals/building/fail'

const HOSPITAL_HOSPITALS_GUIDE_QUERY = 'hospital/hospitals/guide/query'
const HOSPITAL_HOSPITALS_GUIDE_SUCCESS = 'hospital/hospitals/guide/success'
const HOSPITAL_HOSPITALS_GUIDE_FAIL = 'hospital/hospitals/guide/fail'

const HOSPITAL_HOSPITALS_SELECT = 'hospital/hospitals/select'
const HOSPITAL_HOSPITALS_BUILDING_SELECT = 'hospital/hospitals/building/select'
const HOSPITAL_HOSPITALS_GUIDE_SELECT = 'hospital/hospitals/guide/select'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectId: null,
  selectBuildingId: null,
  selectGuideIds: {},
  noJson: []
}

export function hospitals (state = initState, action = {}) {
  switch (action.type) {
    case REHYDRATE:
      console.log('----REHYDRATE----', '----REHYDRATE_HOSPITAL----')
      return Object.assign({}, state, action.payload.hospitals, {loading: false, error: null, selectId: null, selectBuildingId: null, selectGuideIds: {}})
    case HOSPITAL_HOSPITALS_QUERY:
    case HOSPITAL_HOSPITALS_BUILDING_QUERY:
    case HOSPITAL_HOSPITALS_GUIDE_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_HOSPITALS_SUCCESS:
      return Object.assign({}, state, { data: action.hospitals, noJson: action.noJson, loading: false, error: null })
    case HOSPITAL_HOSPITALS_BUILDING_SUCCESS:
      let buildingHospitals = getBuildingHospitals(state, action.hospital)
      return Object.assign({}, state, { data: buildingHospitals, loading: false, error: null })
    case HOSPITAL_HOSPITALS_GUIDE_SUCCESS:
      let guideHospitals = getGuideHospitals(state, action.hospital)
      return Object.assign({}, state, { data: guideHospitals, loading: false, error: null })
    case HOSPITAL_HOSPITALS_FAIL:
    case HOSPITAL_HOSPITALS_BUILDING_FAIL:
    case HOSPITAL_HOSPITALS_GUIDE_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOSPITAL_HOSPITALS_SELECT:
      return Object.assign({}, state, {selectId: action.selectId, loading: false, error: null})
    case HOSPITAL_HOSPITALS_BUILDING_SELECT:
      return Object.assign({}, state, {selectBuildingId: action.selectBuildingId, loading: false, error: null})
    case HOSPITAL_HOSPITALS_GUIDE_SELECT:
      return Object.assign({}, state, {selectGuideIds: action.selectGuideIds, loading: false, error: null})
    default:
      return state
  }
}

const getBuildingHospitals = (state, actionHospital) => {
  let hospitals = state.data // 所有医院信息
  let hospitalId = actionHospital.id // 当前医院的id
  hospitals[hospitalId] = Object.assign({}, hospitals[hospitalId], {buildings: actionHospital.buildings})
  return hospitals
}

const getGuideHospitals = (state, actionHospital) => {
  let hospitals = state.data // 所有医院信息
  let hospitalId = actionHospital.id // 当前医院的id
  hospitals[hospitalId] = Object.assign({}, hospitals[hospitalId], {visitNoticeGroup: actionHospital.visitNoticeGroup})
  return hospitals
}

const QUERY_HOSPITALS = gql`
  query {
    hospitals {
      id
      hospitalCode
      hospitalName
      phone
      logo
      image
      description
      website,
      address
    }
  }
`
// 查询医院数据
export const queryHospitals = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_HOSPITALS_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_HOSPITALS })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_HOSPITALS_FAIL,
        error: data.error.message
      })
    }
    let hospitals = data.data.hospitals
    let json = {}
    for (let hospital of hospitals) {
      json[hospital.id] = hospital
    }
    return dispatch({
      type: HOSPITAL_HOSPITALS_SUCCESS,
      hospitals: json,
      noJson: hospitals
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_HOSPITALS_FAIL,
      error: '数据请求失败！'
    })
  }
}

const QUERY_HOSPITAL_BUILDINGS = gql`
  query ($id: ObjID!) {
    hospital(id: $id) {
      id
      buildings {
        id
        code
        name
        position
        description
        floors {
          id
          floorNum
          description
          rooms {
            id
            code
            name
            description
          }
        }
      }
    }
  }
`
// 查询院内导航
export const queryHospitalBuildings = (client, {hospitalId}) => async dispatch => {
  dispatch({
    type: HOSPITAL_HOSPITALS_BUILDING_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_HOSPITAL_BUILDINGS, variables: {id: hospitalId} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_HOSPITALS_BUILDING_FAIL,
        error: data.error.message
      })
    }
    return dispatch({
      type: HOSPITAL_HOSPITALS_BUILDING_SUCCESS,
      hospital: data.data.hospital
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_HOSPITALS_BUILDING_FAIL,
      error: '数据请求失败！'
    })
  }
}

const QUERY_HOSPITAL_GUIDES = gql`
  query ($id: ObjID!) {
    hospital(id: $id) {
      id
      visitNoticeGroup {
        id
        code
        name
        visitNotices {
          id
          code
          title
          content
          image
        }
      }
    }
  }
`
// 查询院内导航
export const queryHospitalGuides = (client, {hospitalId}) => async dispatch => {
  dispatch({
    type: HOSPITAL_HOSPITALS_GUIDE_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_HOSPITAL_GUIDES, variables: {id: hospitalId} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_HOSPITALS_GUIDE_FAIL,
        error: data.error.message
      })
    }
    return dispatch({
      type: HOSPITAL_HOSPITALS_GUIDE_SUCCESS,
      hospital: data.data.hospital
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_HOSPITALS_GUIDE_FAIL,
      error: '数据请求失败！'
    })
  }
}

// 选择医院
export const selectHospital = ({ hospitalId }) => dispatch => {
  return dispatch({
    type: HOSPITAL_HOSPITALS_SELECT,
    selectId: hospitalId
  })
}

// 选择医院楼
export const selectHospitalBuildings = ({ buildingId }) => dispatch => {
  return dispatch({
    type: HOSPITAL_HOSPITALS_BUILDING_SELECT,
    selectBuildingId: buildingId
  })
}

// 选择指南
export const selectHospitalGuide = ({noticeGroupId, noticeId}) => dispatch => {
  return dispatch({
    type: HOSPITAL_HOSPITALS_GUIDE_SELECT,
    selectGuideIds: {
      noticeGroupId,
      noticeId
    }
  })
}
