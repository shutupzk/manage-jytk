import localforage from 'localforage'
import gql from 'graphql-tag'

const DEPARTMENT_QUERY_DEPARTMENT = 'department/querydepartment'
const DEPARTMENT_QUERY_DEPARTMENT_SUCCESS = 'department/querydepartment/success'
const DEPARTMENT_QUERY_DEPARTMENT_FAIL = 'department/querydepartment/fail'

const DEPARTMENT_QUERY_DEPARTMENT_DETAIL_SUCCESS = 'department/querydepartment/detail/success'

const UPDATE_DEPARTMENT_SUCCESS = 'department/updatedepartment/success'

const CREATE_DEPARTMENT_SUCCESS = 'department/createdepartment/success'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function department (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case DEPARTMENT_QUERY_DEPARTMENT:
      return Object.assign({}, state, { loading: true, error: null })
    case DEPARTMENT_QUERY_DEPARTMENT_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
		case DEPARTMENT_QUERY_DEPARTMENT_SUCCESS:
		case DEPARTMENT_QUERY_DEPARTMENT_DETAIL_SUCCESS:
		case UPDATE_DEPARTMENT_SUCCESS:
		case CREATE_DEPARTMENT_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: action.department },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// department list
const QUERY_DEPARTMENTS = gql`
  query {
		departments {
			id
			deptName
			deptSn
			hot
			isAppointment
			description
			childs {
				id
				deptSn
				deptName
				parent{
					id
					deptName
				}
			}
		}
	}
`

export const queryDepartments = (client) => async dispatch => {
  dispatch({
    type: DEPARTMENT_QUERY_DEPARTMENT
  })
  try {
		console.log('-----queryDepartments')
		const data = await client.query({ query: QUERY_DEPARTMENTS, fetchPolicy: 'network-only'})
    if (data.error) {
      return dispatch({
        type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: DEPARTMENT_QUERY_DEPARTMENT_SUCCESS,
      department: data.data.departments
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
      error: e.message
    })
  }
}


// department detail
const QUERY_CONSULATION_DETAIL = gql`
  query($id: ObjID!) {
		consultation(id: $id){
			id
			type
			status
			content
			fee
			refundReason
			createdAt
			consultationReason {
				id
				reason
			}
			department{
				id
				doctorName
				departmentHasDoctors{
					department{
						hospital{
							hospitalName
						}
					}
				}
			}
			patient{
				id
				name
				phone
				sex
				birthday
				user {
					id
					phone
					name
					sex
					birthday
				}
			}
			payment{
				id
				totalFee
				transactionNo
				outTradeNo
				tradeNo
				createdAt
				payWay
			}
		}
	}
`

export const queryDoctorDetail = (client, {id}) => async dispatch => {
  dispatch({
    type: DEPARTMENT_QUERY_DEPARTMENT
  })
  try {
		const data = await client.query({ query: QUERY_CONSULATION_DETAIL , variables: { id }})
		console.log('------department', data)
    if (data.error) {
      return dispatch({
        type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: DEPARTMENT_QUERY_DEPARTMENT_DETAIL_SUCCESS,
      department: data.data.consultation
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
      error: e.message
    })
  }
}

// update department
const UPDATE_DEPARTMENT = gql`
	mutation($id: ObjID!, $deptName: String, $hot: Boolean, $description: String, $isAppointment: Boolean){
		updateDepartment(id: $id, input: {deptName: $deptName, hot: $hot, description: $description, isAppointment: $isAppointment}) {
			id
			deptName
			deptSn
			hot
			childs {
				id
				deptSn
				deptName
			}
			parent {
				id
			}
		}
	}
`

export const updateDepartment = (client, {id, deptName, deptSn, hot, description, isAppointment}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: DEPARTMENT_QUERY_DEPARTMENT
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_DEPARTMENT,
      variables: { id, deptName, hot, description, isAppointment}
		})
		if (data.error) {
      return dispatch({
        type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
        error: data.error.message
      })
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

// update department
const CREATE_DEPARTMENT = gql`
	mutation( $deptName: String, $hot: Boolean, $deptSn: String!, $hospitalId: ObjID!, $description: String, $isAppointment: Boolean){
		createDepartment(input: {deptName: $deptName, hot: $hot, deptSn: $deptSn, hospitalId: $hospitalId, description: $description, isAppointment: $isAppointment}) {
			id
			deptName
			deptSn
			hot
			childs {
				id
				deptSn
				deptName
			}
			parent {
				id
			}
		}
	}
`

export const createDepartment = (client, {deptName, deptSn, hot, hospitalId, description, isAppointment}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: DEPARTMENT_QUERY_DEPARTMENT
  })
  try {
		console.log('-----value', deptName, deptSn, hot, hospitalId, description, isAppointment)
    let data = await client.mutate({
      mutation: CREATE_DEPARTMENT,
      variables: { id, deptName, deptSn, hot, hospitalId, description, isAppointment}
		})
		if (data.error) {
      return dispatch({
        type: DEPARTMENT_QUERY_DEPARTMENT_FAIL,
        error: data.error.message
      })
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
