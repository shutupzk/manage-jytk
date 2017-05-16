import gql from 'graphql-tag'
// import { REHYDRATE } from 'redux-persist/constants'

const HOSPITAL_DEPARTMENTS_QUERY = 'hospital/departments/query'
const HOSPITAL_DEPARTMENTS_SUCCESS = 'hospital/departments/success'
const HOSPITAL_DEPARTMENTS_FAIL = 'hospital/departments/fail'

const HOSPITAL_DEPARTMENTS_DEPARTMENT_QUERY = 'hospital/departments/department/query'
const HOSPITAL_DEPARTMENTS_DEPARTMENT_DETAIL = 'hospital/departments/department/detail'
const HOSPITAL_DEPARTMENTS_DEPARTMENT_FAIL = 'hospital/departments/department/fail'

const HOSPITAL_DEPARTMENTS_SELECT = 'hospital/departments/select'

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
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_DEPARTMENTS_SUCCESS:
    case HOSPITAL_DEPARTMENTS_DEPARTMENT_DETAIL:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case HOSPITAL_DEPARTMENTS_FAIL:
    case HOSPITAL_DEPARTMENTS_DEPARTMENT_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOSPITAL_DEPARTMENTS_SELECT:
      return Object.assign({}, state, {selectId: action.selectId, loading: false, error: null})
    default:
      return state
  }
}

const QUERY_DEPARTMENTS = gql`
  query {
    departments {
      id
      deptSn
      deptName
    }
  }
`

/**
 * 科室列表
 * @param {*} client
 */
export const queryDepartments = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_DEPARTMENTS_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_DEPARTMENTS })
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

const QUERY_DEPARTMENT = gql`
   query ($id: ObjID!){
    department(id: $id) {
      id
      deptSn
      deptName
      description
      features
      position
    }
  }
`
/**
 * 科室详情
 * @param {*} client
 * @param {*} departmentId
 * @param {*} departments
 */
export const queryDepartmentDetail = (client, {departmentId, departments}) => async dispatch => {
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
    departments[departmentId] = department
    return dispatch({
      type: HOSPITAL_DEPARTMENTS_DEPARTMENT_DETAIL,
      data: departments
    })
  } catch (e) {
    return dispatch({
      type: HOSPITAL_DEPARTMENTS_DEPARTMENT_FAIL,
      error: '获取科室详情失败！'
    })
  }
}

// 选择科室
export const selectDepartment = ({ departmentId }) => dispatch => {
  return dispatch({
    type: HOSPITAL_DEPARTMENTS_SELECT,
    selectId: departmentId
  })
}
