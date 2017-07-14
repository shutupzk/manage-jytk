import gql from 'graphql-tag'
// import { REHYDRATE } from 'redux-persist/constants'

const HOSPITAL_DEPARTMENTS_QUERY = 'hospital/departments/query'
const HOSPITAL_DEPARTMENTS_SUCCESS = 'hospital/departments/success'
const HOSPITAL_DEPARTMENTS_FAIL = 'hospital/departments/fail'

const HOSPITAL_CHILD_DEPARTMENTS_QUERY = 'hospital/child/departments/query'
const HOSPITAL_CHILD_DEPARTMENTS_SUCCESS = 'hospital/child/departments/success'
const HOSPITAL_CHILD_DEPARTMENTS_FAIL = 'hospital/child/departments/fail'

const HOSPITAL_PARENT_DEPARTMENTS_SELECT = 'hospital/parent/departments/select'

const HOSPITAL_DEPARTMENTS_DEPARTMENT_QUERY = 'hospital/departments/department/query'
const HOSPITAL_DEPARTMENTS_DEPARTMENT_DETAIL = 'hospital/departments/department/detail'
const HOSPITAL_DEPARTMENTS_DEPARTMENT_FAIL = 'hospital/departments/department/fail'

const HOSPITAL_DEPARTMENTS_SELECT = 'hospital/departments/select'

const DEPARTMENT_EVALUATE_ADD = 'hospital/department/evaluate/add/fail'
const DEPARTMENT_EVALUATE_ADD_SUCCESS = 'hospital/department/evaluate/add/success'
const DEPARTMENT_EVALUATE_ADD_FAIL = 'hospital/department/evaluate/add/fail'

const APPOINTMENT_DEPARTMENTS_SEARCH = 'appointment/departments/search'
const APPOINTMENT_DEPARTMENTS_SEARCH_SUCCESS = 'appointment/departments/search/success'
const APPOINTMENT_DEPARTMENTS_SEARCH_FAIL = 'appointment/departments/search/fail'

const REMOVE_APPOINTMENT_DEPARTMENTS_SEARCH = 'appointment/departments/search/remove'

const initState = {
  data: {},
  loading: true,
  error: null,
  selectId: null
}

export function departments (state = initState, action = {}) {
  switch (action.type) {
    // case REHYDRATE:
    //   console.log('----REHYDRATE----', '----REHYDRATE_DEPARTMENTS----')
    //   return Object.assign({}, state, action.payload.departments, { loading: false, error: null })
    case HOSPITAL_DEPARTMENTS_QUERY:
    case HOSPITAL_DEPARTMENTS_DEPARTMENT_QUERY:
    case DEPARTMENT_EVALUATE_ADD:
    case HOSPITAL_CHILD_DEPARTMENTS_QUERY:
    case APPOINTMENT_DEPARTMENTS_SEARCH:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_DEPARTMENTS_SUCCESS:
    case HOSPITAL_DEPARTMENTS_DEPARTMENT_DETAIL:
    case DEPARTMENT_EVALUATE_ADD_SUCCESS:
    case HOSPITAL_CHILD_DEPARTMENTS_SUCCESS:
      return Object.assign({}, state, { data: Object.assign(state.data, action.data), loading: false, error: null })
    case APPOINTMENT_DEPARTMENTS_SEARCH_SUCCESS:
      let departments = action.data
      let searchDepIds = departments.searchDepIds
      delete departments.searchDepIds
      return Object.assign({}, state, { data: departments, searchDepIds: searchDepIds, loading: false, error: null })
    case HOSPITAL_DEPARTMENTS_FAIL:
    case HOSPITAL_DEPARTMENTS_DEPARTMENT_FAIL:
    case DEPARTMENT_EVALUATE_ADD_FAIL:
    case HOSPITAL_CHILD_DEPARTMENTS_FAIL:
    case APPOINTMENT_DEPARTMENTS_SEARCH_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOSPITAL_PARENT_DEPARTMENTS_SELECT:
      return Object.assign({}, state, {parentId: action.selectId, loading: false, error: null})
    case HOSPITAL_DEPARTMENTS_SELECT:
      return Object.assign({}, state, {selectId: action.selectId, loading: false, error: null})
    case REMOVE_APPOINTMENT_DEPARTMENTS_SEARCH:
      return Object.assign({}, state, {searchDepIds: [], loading: false, error: null})
    default:
      return state
  }
}

const QUERY_DEPARTMENTS = gql`
  query($level: String) {
    departments(level: $level) {
      id
      deptSn
      deptName
      icon
      level
      floor
      childs{
        id
        deptName
      }
    }
  }
`

/**
 * 科室列表
 * @param {*} client
 */
export const queryDepartments = (client, {level}) => async dispatch => {
  dispatch({
    type: HOSPITAL_DEPARTMENTS_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_DEPARTMENTS, variables: {level} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_DEPARTMENTS_FAIL,
        error: data.error.message
      })
    }
    let departments = data.data.departments
    let json = {}
    for (let department of departments) {
      json[department.id] = department
    }
    return dispatch({
      type: HOSPITAL_DEPARTMENTS_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_DEPARTMENTS_FAIL,
      error: '获取科室列表失败！'
    })
  }
}


const QUERY_CHILDS_DEPARTMENTS = gql`
  query($departmentId: ObjID!) {
    department(id: $departmentId) {
      id
      deptSn
      deptName
      childs{
        id
        deptSn
        level
        deptName
      }
    }
  }
`
/**
 * 子科室列表
 * @param {*} client
 */
export const queryChildDepartments = (client, {departmentId}) => async dispatch => {
  dispatch({
    type: HOSPITAL_CHILD_DEPARTMENTS_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_CHILDS_DEPARTMENTS, variables: {departmentId} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_CHILD_DEPARTMENTS_FAIL,
        error: data.error.message
      })
    }
    let department = data.data.department
    let json = {}
    for (let dep of department.childs) {
      dep = Object.assign({}, dep, {parentId: department.id, parentName: department.deptName})
      json[dep.id] = dep
    }
    return dispatch({
      type: HOSPITAL_CHILD_DEPARTMENTS_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_CHILD_DEPARTMENTS_FAIL,
      error: '获取科室列表失败！'
    })
  }
}

const QUERY_DEPARTMENT = gql`
   query ($id: ObjID!){
    department(id: $id) {
      id
      deptSn
      deptName
      description
      features
      position
      parent{
        id
        deptName
      }
      departmentEvaluates{
        id
        user{
          id
          name
        }
        advice
        orderlyScore
        technologyScore
        createdAt
      }
    }
  }
`
/**
 * 科室详情
 * @param {*} client
 * @param {*} departmentId
 * @param {*} departments
 */
export const queryDepartmentDetail = (client, {departmentId}) => async dispatch => {
  dispatch({
    type: HOSPITAL_DEPARTMENTS_DEPARTMENT_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_DEPARTMENT, variables: {id: departmentId} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_DEPARTMENTS_DEPARTMENT_FAIL,
        error: data.error.message
      })
    }
    let department = data.data.department
    let json = {}
    json[department.id] = department // Object.assign({}, department, {parentId: department.parent.id, parentName: department.parent.deptName})
    return dispatch({
      type: HOSPITAL_DEPARTMENTS_DEPARTMENT_DETAIL,
      data: json
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_DEPARTMENTS_DEPARTMENT_FAIL,
      error: '获取科室详情失败！'
    })
  }
}

export const selectParentDepartment = ({ departmentId }) => dispatch => {
  return dispatch({
    type: HOSPITAL_PARENT_DEPARTMENTS_SELECT,
    selectId: departmentId
  })
}

// 选择科室
export const selectDepartment = ({ departmentId }) => dispatch => {
  return dispatch({
    type: HOSPITAL_DEPARTMENTS_SELECT,
    selectId: departmentId
  })
}

var ADD_DEPARTMENT_EVALUATE = gql`
  mutation($departmentId: ObjID!,$userId: ObjID!,$orderlyScore: Int!, $technologyScore: Int!, $advice:String!) {
  createDepartmentEvaluate(input:{departmentId:$departmentId,userId:$userId,orderlyScore:$orderlyScore,technologyScore:$technologyScore,advice:$advice}) {
    id
    user{
      id
      name
    }
    orderlyScore
    technologyScore
    advice
    createdAt
  }
}
`
export const addDepartmentEvaluate = (client, {departmentId, userId, orderlyScore, technologyScore, advice}) => async dispatch => {
  dispatch({
    type: DEPARTMENT_EVALUATE_ADD
  })
  console.log(departmentId, userId, orderlyScore, technologyScore, advice)
  try {
    let data = await client.mutate({ mutation: ADD_DEPARTMENT_EVALUATE, variables: { departmentId, userId, orderlyScore, technologyScore, advice } })
    if (data.error) {
      return dispatch({
        type: DEPARTMENT_EVALUATE_ADD_FAIL,
        error: data.error.message
      })
    }
    return dispatch({
      type: DEPARTMENT_EVALUATE_ADD_SUCCESS,
      data: data.data.departmentEvaluates
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: DEPARTMENT_EVALUATE_ADD_FAIL,
      error: '添加评价失败！'
    })
  }
}

var SEARCH_DEPARTMENTS = gql`
  query($deptName: String!) {
    searchDepartment(deptName: $deptName) {
      id
      hospital{
        id
        hospitalName
      }
      deptName
      position
      childs {
        id
        deptName
      }
      deptSn
      description
    }
  }
`

export const searchDepartments = (client, {deptName}) => async dispatch => {
  dispatch({
    type: APPOINTMENT_DEPARTMENTS_SEARCH
  })
  try {
    let data = await client.query({ query: SEARCH_DEPARTMENTS, variables: { deptName } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_DEPARTMENTS_SEARCH_FAIL,
        error: data.error.message
      })
    }
    let departments = data.data.searchDepartment
    let json = {}
    let depIds = []
    for (let department of departments) {
      json[department.id] = department
      depIds.push(department.id)
    }
    let deps = Object.assign({}, json, {searchDepIds: depIds})
    return dispatch({
      type: APPOINTMENT_DEPARTMENTS_SEARCH_SUCCESS,
      data: deps
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: APPOINTMENT_DEPARTMENTS_SEARCH_FAIL,
      error: '查找科室失败'
    })
  }
}

// 取消搜索科室
export const removeSearchDepIds = () => dispatch => {
  return dispatch({
    type: REMOVE_APPOINTMENT_DEPARTMENTS_SEARCH
  })
}
