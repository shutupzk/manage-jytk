import gql from 'graphql-tag'

const SUBJECT_ANSWERS_SUCCESS = 'SUBJECT_ANSWERS_SUCCESS'
const EXAMINATION_ANSWERS_SUCCESS = 'EXAMINATION_ANSWERS_SUCCESS'
const SUBJECT_ANSWERS_FAIL = 'SUBJECT_ANSWERS_FAIL'
const SUBJECT_ANSWERS_SELECT = 'SUBJECT_ANSWERS_SECTION_SELECT'

const initState = {
  data: {},
  error: null,
  skip: 0,
  selectId: null
}

export function answers (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_ANSWERS_SUCCESS:
    case EXAMINATION_ANSWERS_SUCCESS:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data),
        skip: action.skip,
        error: null
      })
    case SUBJECT_ANSWERS_FAIL:
      return Object.assign({}, state, { error: action.error })
    case SUBJECT_ANSWERS_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_ANSWERS = gql`
  query($exerciseId: ObjID!) {
    exercise(id: $exerciseId) {
      id
      answers {
        id
        num
        content
        isAnswer
      }
    }
  }
`

export const queryAnswers = (client, { exerciseId }) => async dispatch => {
  try {
    const data = await client.query({
      query: QUERY_ANSWERS,
      variables: { exerciseId },
      fetchPolicy: 'network-only'
    })
    const { answers } = data.data.exercise
    let json = {}
    for (let doc of answers) {
      json[doc.id] = Object.assign({}, doc, { exerciseId })
    }
    dispatch({
      type: SUBJECT_ANSWERS_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_ANSWERS_FAIL,
      error: e.message
    })
  }
}

export const selectAnswer = ({ answerId }) => dispatch => {
  dispatch({
    type: SUBJECT_ANSWERS_SELECT,
    selectId: answerId
  })
}
