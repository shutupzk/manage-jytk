import gql from 'graphql-tag'
const DOCTOR_EVALUATE_ADD = 'hospital/doctor/evaluate/add'
const DOCTOR_EVALUATE_ADD_SUCCESS = 'hospital/doctor/evaluate/add/success'
const DOCTOR_EVALUATE_ADD_FAIL = 'hospital/doctor/evaluate/add/fail'

const DOCTOR_EVALUATE_QUERY = 'hospital/doctor/evaluates/query'
const DOCTOR_EVALUATE_QUERY_SUCCESS = 'hospital/doctor/evaluates/query/success'
const DOCTOR_EVALUATE_QUERY_FAIL = 'hospital/doctor/evaluates/query/fail'

const initState = {
  data: {},
  loading: false,
  error: null
}

export function doctorEvaluates (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case DOCTOR_EVALUATE_ADD:
    case DOCTOR_EVALUATE_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case DOCTOR_EVALUATE_ADD_SUCCESS:
    case DOCTOR_EVALUATE_QUERY_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case DOCTOR_EVALUATE_ADD_FAIL:
    case DOCTOR_EVALUATE_QUERY_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    default:
      return state
  }
}

var ADD_DOCTOR_EVALUATE = gql`
  mutation($doctorId: ObjID!,$userId: ObjID!,$serviceScore: Int!, $technologyScore: Int!, $advice:String!) {
  createDoctorEvaluate(input:{doctorId:$doctorId,userId:$userId,serviceScore:$serviceScore,technologyScore:$technologyScore,advice:$advice}) {
    id
    user{
      id
      name
    }
    serviceScore
    technologyScore
    advice
    createdAt
  }
}
`
export const addDoctorEvaluate = (client, {doctorId, userId, serviceScore, technologyScore, advice}) => async dispatch => {
  dispatch({
    type: DOCTOR_EVALUATE_ADD
  })
  console.log('doctorId')
  console.log(doctorId, userId, serviceScore, technologyScore, advice)
  try {
    let data = await client.mutate({ mutation: ADD_DOCTOR_EVALUATE, variables: { doctorId, userId, serviceScore, technologyScore, advice } })
    if (data.error) {
      return dispatch({
        type: DOCTOR_EVALUATE_ADD_FAIL,
        error: data.error.message
      })
    }
    return dispatch({
      type: DOCTOR_EVALUATE_ADD_SUCCESS,
      data: data.data.createDoctorEvaluate
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: DOCTOR_EVALUATE_ADD_FAIL,
      error: '添加评价失败！'
    })
  }
}
