import { gql } from 'react-apollo'

const PROFILE_QUESTIONS_QUERY = 'profile/questions/query'
const PROFILE_QUESTIONS_QUERY_SUCCESS = 'profile/questions/query/success'
const PROFILE_QUESTIONS_QUERY_FAIL = 'profile/questions/query/fail'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectId: {}
}

// reducer
export function questions (state = initState, action = {}) {
  switch (action.type) {
    case PROFILE_QUESTIONS_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_QUESTIONS_QUERY_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case PROFILE_QUESTIONS_QUERY_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    default:
      return state
  }
}

var QUERY_QUESTIONS = gql`
  query {
    questions {
      id
      title
      content
      weight
    }
  }
`
export const queryQuestions = (client) => async dispatch => {
  dispatch({
    type: PROFILE_QUESTIONS_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_QUESTIONS })
    if (data.error) {
      return dispatch({
        type: PROFILE_QUESTIONS_QUERY_FAIL,
        error: data.error.message
      })
    }
    let questions = data.data.questions
    return dispatch({
      type: PROFILE_QUESTIONS_QUERY_SUCCESS,
      data: questions
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: PROFILE_QUESTIONS_QUERY_FAIL,
      error: '查询失败'
    })
  }
}
