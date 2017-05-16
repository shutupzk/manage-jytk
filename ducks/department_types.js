import gql from 'graphql-tag'
import { REHYDRATE } from 'redux-persist/constants'
import { initClient } from '../config'

const HOSPITAL_DEPARTMENTTYPES_QUERY = 'hospital/departement_types/query'
const HOSPITAL_DEPARTMENTTYPES_SUCCESS = 'hospital/departement_types/success'
const HOSPITAL_DEPARTMENTTYPES_FAIL = 'hospital/departement_types/fail'

const initState = {
  data: {},
  loading: false,
  error: null
}

export function departementTypes (state = initState, action = {}) {
  switch (action.type) {
    case REHYDRATE:
      console.log('----REHYDRATE----', action.payload.departement_types)
      return Object.assign({}, state, action.payload.departement_types, { loading: false, error: null })
    case HOSPITAL_DEPARTMENTTYPES_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_DEPARTMENTTYPES_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case HOSPITAL_DEPARTMENTTYPES_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    default:
      return state
  }
}

const QUERYDEPARTMENTTYPES = gql`
  query {
    departement_types {
      id
      typeName
    }
  }
`

var deptTypes = {
  'type1': {
    id: 'type1',
    typeName: '内科',
    position: '三楼'
  },
  'type2': {
    id: 'type2',
    typeName: '外科',
    position: '三楼'
  },
  'type3': {
    id: 'type3',
    typeName: '心理精神疾病门诊',
    position: '三楼'
  },
  'type4': {
    id: 'type4',
    typeName: '疑难病会诊',
    position: '三楼'
  },
  'type5': {
    id: 'type5',
    typeName: '妇产科',
    position: '四楼'
  },
  'type6': {
    id: 'type6',
    typeName: '儿科',
    position: '四楼'
  },
  'type7': {
    id: 'type7',
    typeName: '中医科',
    position: '四楼'
  },
  'type8': {
    id: 'type8',
    typeName: '肿瘤疾病',
    position: '四楼'
  },
  'type9': {
    id: 'type9',
    typeName: '康复医学科',
    position: '四楼'
  },
  'type10': {
    id: 'type10',
    typeName: '皮肤科',
    position: '五楼'
  }
}
/**
 * 科室列表
 * @param {*} client
 */
export const queryDepartments = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_DEPARTMENTTYPES_QUERY
  })
  return dispatch({
    type: HOSPITAL_DEPARTMENTTYPES_SUCCESS,
    data: deptTypes
  })
  // try {
  //   let data = await initClient().query({ query: QUERYDEPARTMENTTYPES })
  //   if (data.error) {
  //     return dispatch({
  //       type: HOSPITAL_DEPARTMENTTYPES_FAIL,
  //       error: data.error.message
  //     })
  //   }
  //   let departementTypes = data.data.departement_types
  //   let json = {}
  //   for (let department of departementTypes) {
  //     json[department.id] = department
  //   }
  //   return dispatch({
  //     type: HOSPITAL_DEPARTMENTTYPES_SUCCESS,
  //     data: json
  //   })
  // } catch (e) {
  //   console.log(e)
  //   return dispatch({
  //     type: HOSPITAL_DEPARTMENTTYPES_FAIL,
  //     error: '获取科室列表失败！'
  //   })
  // }
}
