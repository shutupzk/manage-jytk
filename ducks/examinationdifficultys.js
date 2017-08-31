import gql from 'graphql-tag'

const EXAMINATION_DIFFICULTY_SUCCESS = 'EXAMINATION_DIFFICULTY_SUCCESS'
const EXAMINATION_DIFFICULTY_FAIL = 'EXAMINATION_DIFFICULTY_FAIL'
const EXAMINATION_DIFFICULTY_SELECT = 'EXAMINATION_DIFFICULTY_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function examinationdifficultys (state = initState, action = {}) {
  switch (action.type) {
    case EXAMINATION_DIFFICULTY_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case EXAMINATION_DIFFICULTY_FAIL:
      return Object.assign({}, state, { error: action.error })
    case EXAMINATION_DIFFICULTY_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_EXAMINATIONDIFFICULTYS = gql`
  query {
    examinationDifficultys {
      id
      code
      name
    }
  }
`

export const queryExaminationDifficultys = client => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_EXAMINATIONDIFFICULTYS, variables: {}, fetchPolicy: 'network-only' })
    const { examinationDifficultys } = data.data
    let json = {}
    for (let doc of examinationDifficultys) {
      json[doc.id] = Object.assign({}, doc)
    }
    dispatch({
      type: EXAMINATION_DIFFICULTY_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: EXAMINATION_DIFFICULTY_FAIL,
      error: e.message
    })
  }
}

export const selectExaminationDifficulty = ({ examinationDifficultyId }) => dispatch => {
  dispatch({
    type: EXAMINATION_DIFFICULTY_SELECT,
    selectId: examinationDifficultyId
  })
}
