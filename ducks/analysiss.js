import gql from 'graphql-tag'

const SUBJECT_ANALYSISS_SUCCESS = 'SUBJECT_ANALYSISS_SUCCESS'
const EXAMINATION_ANALYSISS_SUCCESS = 'EXAMINATION_ANALYSISS_SUCCESS'
const SUBJECT_ANALYSISS_FAIL = 'SUBJECT_ANALYSISS_FAIL'
const SUBJECT_ANALYSISS_SELECT = 'SUBJECT_ANALYSISS_SECTION_SELECT'

const initState = {
  data: {},
  error: null,
  skip: 0,
  selectId: null
}

export function analysiss (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_ANALYSISS_SUCCESS:
    case EXAMINATION_ANALYSISS_SUCCESS:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data),
        skip: action.skip,
        error: null
      })
    case SUBJECT_ANALYSISS_FAIL:
      return Object.assign({}, state, { error: action.error })
    case SUBJECT_ANALYSISS_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_ANALYSISS = gql`
  query($exerciseId: ObjID!) {
    exercise(id: $exerciseId) {
      id
      analysiss{
        id
        content
        createdAt
        user{
          id
          name
          phone
        }
      }
    }
  }
`

export const queryAnalysiss = (client, { exerciseId }) => async dispatch => {
  try {
    const data = await client.query({
      query: QUERY_ANALYSISS,
      variables: { exerciseId },
      fetchPolicy: 'network-only'
    })
    const { analysiss } = data.data.exercise
    let json = {}
    for (let doc of analysiss) {
      json[doc.id] = Object.assign({}, doc, { exerciseId })
    }
    dispatch({
      type: SUBJECT_ANALYSISS_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_ANALYSISS_FAIL,
      error: e.message
    })
  }
}

export const selectAnalysis = ({ analysisId }) => dispatch => {
  dispatch({
    type: SUBJECT_ANALYSISS_SELECT,
    selectId: analysisId
  })
}
