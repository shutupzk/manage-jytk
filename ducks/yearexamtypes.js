import gql from 'graphql-tag'

const YEAR_EXAM_TYPE_SUCCESS = 'YEAR_EXAM_TYPE_SUCCESS'
const YEAR_EXAM_TYPE_FAIL = 'YEAR_EXAM_TYPE_FAIL'
const YEAR_EXAM_TYPE_SELECT = 'YEAR_EXAM_TYPE_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function yearexamtypes (state = initState, action = {}) {
  switch (action.type) {
    case YEAR_EXAM_TYPE_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case YEAR_EXAM_TYPE_FAIL:
      return Object.assign({}, state, { error: action.error })
    case YEAR_EXAM_TYPE_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_SUBJECTS = gql`
  query {
    yearExamTypes(limit: 0) {
      id
      name
    }
  }
`

export const queryYearExamTypes = client => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SUBJECTS, variables: {}, fetchPolicy: 'network-only' })
    const { yearExamTypes } = data.data
    let json = {}
    for (let doc of yearExamTypes) {
      json[doc.id] = doc
    }
    dispatch({
      type: YEAR_EXAM_TYPE_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: YEAR_EXAM_TYPE_FAIL,
      error: e.message
    })
  }
}

export const selectYearExamType = ({ yearExamTypeId }) => dispatch => {
  dispatch({
    type: YEAR_EXAM_TYPE_SELECT,
    selectId: yearExamTypeId
  })
}
