import gql from 'graphql-tag'

const YEAR_LIST_SUCCESS = 'YEAR_LIST_SUCCESS'
const YEAR_LIST_FAIL = 'YEAR_LIST_FAIL'
const YEAR_LIST_SELECT = 'YEAR_LIST_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null,
  selectType: null
}

export function yearexerciselists (state = initState, action = {}) {
  switch (action.type) {
    case YEAR_LIST_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case YEAR_LIST_FAIL:
      return Object.assign({}, state, { error: action.error })
    case YEAR_LIST_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_YEARS = gql`
  query ($yearExerciseTypeId: ObjID!) {
    yearExerciseType(id: $yearExerciseTypeId) {
      id
      yearExerciseLists {
        id
        year
      }
    }
  }
`

export const queryYearExerciseLists = (client, { yearExerciseTypeId }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_YEARS, variables: { yearExerciseTypeId }, fetchPolicy: 'network-only' })
    const { yearExerciseLists } = data.data.yearExerciseType
    let json = {}
    for (let doc of yearExerciseLists) {
      json[doc.id] = Object.assign({}, doc, { yearExerciseTypeId })
    }
    dispatch({
      type: YEAR_LIST_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: YEAR_LIST_FAIL,
      error: e.message
    })
  }
}

export const selectYearExerciseList = ({ yearExerciseListId }) => dispatch => {
  dispatch({
    type: YEAR_LIST_SELECT,
    selectId: yearExerciseListId
  })
}
