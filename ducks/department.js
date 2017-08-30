import gql from 'graphql-tag'
import { HOSPITALINFO } from 'config'

const DEPARTMENT_QUERY_DEPARTMENT = 'department/querydepartment'
const DEPARTMENT_QUERY_DEPARTMENT_SUCCESS = 'department/querydepartment/success'
const DEPARTMENT_QUERY_DEPARTMENT_FAIL = 'department/querydepartment/fail'

const DEPARTMENT_QUERY_DEPARTMENT_DETAIL_SUCCESS = 'department/querydepartment/detail/success'

const UPDATE_DEPARTMENT_SUCCESS = 'department/updatedepartment/success'

const CREATE_DEPARTMENT_SUCCESS = 'department/createdepartment/success'

const DEPARTMENT_SELECT_DEPARTMENT = 'department/selectdepartment'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function department (state = initState, action = {}) {
  switch (action.type) {
    case DEPARTMENT_QUERY_DEPARTMENT:
      return Object.assign({}, state, { loading: true, error: null })
    case DEPARTMENT_QUERY_DEPARTMENT_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case DEPARTMENT_QUERY_DEPARTMENT_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          data: Object.assign({}, state.data, { departments: action.departments }, { departmentsLevel1: action.departmentsLevel1 }, { departmentsLevel2: action.departmentsLevel2 })
        },
        { loading: false, error: null }
      )
    case DEPARTMENT_QUERY_DEPARTMENT_DETAIL_SUCCESS:
    case UPDATE_DEPARTMENT_SUCCESS:
    case CREATE_DEPARTMENT_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { department: action.department }) }, { loading: false, error: null })
    case DEPARTMENT_SELECT_DEPARTMENT:
      return Object.assign({}, state, Object.assign({}, state.data, { selectedDepartment: action.data }))
    default:
      return state
  }
}

// department list
const QUERY_DEPARTMENTS = gql`
  query($skip: Int, $limit: Int, $keyword: String, $hot: Boolean) {
    departments(limit: $limit, skip: $skip, keyword: $keyword, hot: $hot) {
      id
      deptSn
      deptName
      description
      features
      position
      deptPic
      hot
      weight
      isAppointment
      level
      image
      icon
      type
      floor
      hospital {
        id
        hospitalName
      }
      parent {
        id
        deptSn
        deptName
      }
    }
  }
`

export const queryDepartments = (client, { limit, skip, keyword, hot }) => async dispatch => {
  dispatch({
    type: DEPARTMENT_QUERY_DEPARTMENT
  })
  try {
    const data = await client.query({ query: QUERY_DEPARTMENTS, variables: { limit, skip, keyword, hot }, fetchPolicy: 'network-only' })
    if (data.error) {
      dispatch({
        type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    let departments = data.data.departments
    let departmentsLevel1
    if (HOSPITALINFO.department_level === 1) {
      departmentsLevel1 = departments
    } else {
      departmentsLevel1 = departments.filter(department => {
        return department.level === '1'
      })
    }
    let departmentsLevel2 = departments.filter(department => {
      return department.level === '2'
    })
    dispatch({
      type: DEPARTMENT_QUERY_DEPARTMENT_SUCCESS,
      departments: departments,
      departmentsLevel1: departmentsLevel1,
      departmentsLevel2: departmentsLevel2
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
      error: e.message
    })
    return e.message
  }
}

// update department
const UPDATE_DEPARTMENT = gql`
  mutation($id: ObjID!, $deptName: String, $hot: Boolean, $description: String, $isAppointment: Boolean, $level: String, $parentId: ObjID, $deptPic: String, $weight: Int, $position: String) {
    updateDepartment(
      id: $id
      input: { deptName: $deptName, hot: $hot, description: $description, isAppointment: $isAppointment, level: $level, parentId: $parentId, deptPic: $deptPic, weight: $weight, position: $position }
    ) {
      id
    }
  }
`

export const updateDepartment = (client, { id, deptName, deptSn, hot, description, isAppointment, level, parentId, deptPic, weight, position }) => async dispatch => {
  console.log('---updateDepartment', id, description)
  dispatch({
    type: DEPARTMENT_QUERY_DEPARTMENT
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_DEPARTMENT,
      variables: { id, deptName, hot, description, isAppointment, level, parentId, deptPic, weight, position }
    })
    if (data.error) {
      dispatch({
        type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPDATE_DEPARTMENT_SUCCESS,
      department: data.data.updateDepartment
    })
    return null
  } catch (e) {
    dispatch({
      trype: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
      error: e.message
    })
    return e.message
  }
}

// create department
const CREATE_DEPARTMENT = gql`
  mutation($deptName: String!, $deptSn: String!, $hospitalId: ObjID!, $hot: Boolean, $description: String, $isAppointment: Boolean, $level: String, $parentId: ObjID) {
    createDepartment(
      input: { deptName: $deptName, deptSn: $deptSn, hospitalId: $hospitalId, hot: $hot, description: $description, isAppointment: $isAppointment, level: $level, parentId: $parentId }
    ) {
      id
    }
  }
`

export const createDepartment = (client, { deptName, deptSn, hot, hospitalId, description, isAppointment, level, parentId }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: DEPARTMENT_QUERY_DEPARTMENT
  })
  try {
    console.log('-----value', deptName, deptSn, hot, hospitalId, description, isAppointment, level, parentId)
    let data = await client.mutate({
      mutation: CREATE_DEPARTMENT,
      variables: { deptName, deptSn, hot, hospitalId, description, isAppointment, level, parentId }
    })
    if (data.error) {
      dispatch({
        type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: CREATE_DEPARTMENT_SUCCESS,
      department: data.data.createDepartment
    })
    return null
  } catch (e) {
    dispatch({
      trype: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
      error: e.message
    })
    return e.message
  }
}

export const selectdepartment = ({ department }) => async dispatch => {
  dispatch({
    type: DEPARTMENT_SELECT_DEPARTMENT,
    data: department
  })
}
