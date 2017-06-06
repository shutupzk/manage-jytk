import gql from 'graphql-tag'
const HOSPITAL_EVALUATE_ADD = 'profile/hospital/evaluate/add'
const HOSPITAL_EVALUATE_ADD_SUCCESS = 'profile/hospital/evaluate/add/success'
const HOSPITAL_EVALUATE_ADD_FAIL = 'profile/hospital/evaluate/add/fail'

const HOSPITAL_EVALUATE_QUERY = 'profile/hospital/evaluates/query'
const HOSPITAL_EVALUATE_QUERY_SUCCESS = 'profile/hospital/evaluates/query/success'
const HOSPITAL_EVALUATE_QUERY_FAIL = 'profile/hospital/evaluates/query/fail'

const initState = {
  data: {},
  loading: false,
  error: null
}

export function hospitalEvaluates (state = initState, action = {}) {
  console.log('action', action)
  switch (action.type) {
    case HOSPITAL_EVALUATE_ADD:
    case HOSPITAL_EVALUATE_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_EVALUATE_ADD_SUCCESS:
    case HOSPITAL_EVALUATE_QUERY_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case HOSPITAL_EVALUATE_ADD_FAIL:
    case HOSPITAL_EVALUATE_QUERY_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    default:
      return state
  }
}

var ADD_HOSPITAL_EVALUATE = gql`
  mutation($hospitalId: ObjID!,$userId: ObjID!,$waitingScore: Int!, $appointmentScore: Int!,$environmentScore: Int!, $feelingScore: Int! $advice:String) {
    createHospitalEvaluate(input:{hospitalId:$hospitalId,userId:$userId,waitingScore:$waitingScore,appointmentScore:$appointmentScore,environmentScore:$environmentScore,feelingScore:$feelingScore,advice:$advice}) {
      id
      user{
        id
        name
      }
      waitingScore
      appointmentScore
      appointmentScore
      feelingScore
      advice
      createdAt
    }
  }
`
export const addHospitalEvaluate = (client, {hospitalId, userId, waitingScore, appointmentScore, environmentScore, feelingScore, advice}) => async dispatch => {
  dispatch({
    type: HOSPITAL_EVALUATE_ADD
  })
  console.log(hospitalId, userId, waitingScore, appointmentScore, environmentScore, feelingScore, advice)
  try {
    let data = await client.mutate({ mutation: ADD_HOSPITAL_EVALUATE, variables: { hospitalId, userId, waitingScore, appointmentScore, environmentScore, feelingScore, advice } })
    if (data.error) {
      dispatch({
        type: HOSPITAL_EVALUATE_ADD_FAIL,
        error: data.error.message
      })
      return {
        error: data.error.message
      }
    }
    dispatch({
      type: HOSPITAL_EVALUATE_ADD_SUCCESS,
      data: data.data.createHospitalEvaluate
    })
    return {
      data: data.data.createHospitalEvaluate
    }
  } catch (e) {
    console.log(e)
    dispatch({
      type: HOSPITAL_EVALUATE_ADD_FAIL,
      error: '添加评价失败！'
    })
    return {
      error: '添加评价失败！'
    }
  }
}
