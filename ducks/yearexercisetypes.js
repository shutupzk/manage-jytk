import gql from 'graphql-tag'

const EXAMINATION_YEAR_TYPE_SUCCESS = 'EXAMINATION_YEAR_TYPE_SUCCESS'
const EXAMINATION_YEAR_TYPE_FAIL = 'EXAMINATION_YEAR_TYPE_FAIL'
const EXAMINATION_YEAR_TYPE_SELECT = 'EXAMINATION_YEAR_TYPE_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null,
  selectType: null
}

export function yearexercisetypes (state = initState, action = {}) {
  switch (action.type) {
    case EXAMINATION_YEAR_TYPE_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case EXAMINATION_YEAR_TYPE_FAIL:
      return Object.assign({}, state, { error: action.error })
    case EXAMINATION_YEAR_TYPE_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_EXAMINATION_YEAR_TYPES = gql`
  query($examinationDifficultyId: ObjID!) {
    examinationDifficulty(id: $examinationDifficultyId) {
      id
      name
      yearExerciseTypes {
        id
        name
      }
    }
  }
`

export const queryYearExerciseTypes = (client, { examinationDifficultyId }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_EXAMINATION_YEAR_TYPES, variables: { examinationDifficultyId }, fetchPolicy: 'network-only' })
    const { yearExerciseTypes } = data.data.examinationDifficulty
    let json = {}
    for (let doc of yearExerciseTypes) {
      json[doc.id] = Object.assign({}, doc, { examinationDifficultyId })
    }
    dispatch({
      type: EXAMINATION_YEAR_TYPE_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: EXAMINATION_YEAR_TYPE_FAIL,
      error: e.message
    })
  }
}

export const selectYearExerciseType = ({ yearExerciseTypeId }) => dispatch => {
  dispatch({
    type: EXAMINATION_YEAR_TYPE_SELECT,
    selectId: yearExerciseTypeId
  })
}
