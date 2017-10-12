import gql from 'graphql-tag'

const SUBJECT_ANALYSISS_SUCCESS = 'SUBJECT_ANALYSISS_SUCCESS'
const EXAMINATION_ANALYSISS_SUCCESS = 'EXAMINATION_ANALYSISS_SUCCESS'
const SUBJECT_ANALYSISS_FAIL = 'SUBJECT_ANALYSISS_FAIL'
const SUBJECT_ANALYSISS_SELECT = 'SUBJECT_ANALYSISS_SECTION_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function analysiss (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_ANALYSISS_SUCCESS:
    case EXAMINATION_ANALYSISS_SUCCESS:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, action.data),
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
  {
    analysiss(isUser: true) {
      id
      content
      adopt
      user {
        id
        name
      }
      exercise {
        id
        content
      }
      createdAt
    }
  }
`

export const queryAnalysiss = client => async dispatch => {
  try {
    const data = await client.query({
      query: QUERY_ANALYSISS,
      variables: {},
      fetchPolicy: 'network-only'
    })
    const { analysiss } = data.data
    let json = {}
    for (let doc of analysiss) {
      json[doc.id] = doc
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

const QUERY_EXERCISE_ANALYSISS = gql`
  query($exerciseId: ObjID!) {
    exercise(id: $exerciseId) {
      id
      num
      analysiss {
        id
        content
        adopt
        user {
          id
          name
        }
        exercise {
          id
          content
        }
        createdAt
      }
    }
  }
`

export const queryExerciseAnalysiss = (client, { exerciseId }) => async dispatch => {
  try {
    const data = await client.query({
      query: QUERY_EXERCISE_ANALYSISS,
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

const UPDATE_ANALYSISS = gql`
  mutation($id: ObjID!, $adopt: String, $content: String) {
    updateAnalysis(id: $id, input: { adopt: $adopt, content: $content }) {
      id
      content
      adopt
      user {
        id
        name
      }
      exercise {
        id
        content
      }
      createdAt
    }
  }
`

export const upadateAnalysis = (client, { id, adopt, content }) => async dispatch => {
  try {
    let data = await client.mutate({ mutation: UPDATE_ANALYSISS, variables: { id, adopt, content } })
    const { updateAnalysis } = data.data
    let json = { [updateAnalysis.id]: updateAnalysis }
    dispatch({
      type: SUBJECT_ANALYSISS_SUCCESS,
      data: json
    })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}

export const selectAnalysis = ({ analysisId }) => dispatch => {
  dispatch({
    type: SUBJECT_ANALYSISS_SELECT,
    selectId: analysisId
  })
}
