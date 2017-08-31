import gql from 'graphql-tag'

const SUBJECT_SUBJECT_SUCCESS = 'SUBJECT_SUBJECT_SUCCESS'
const SUBJECT_SUBJECT_FAIL = 'SUBJECT_SUBJECT_FAIL'
const SUBJECT_SUBJECT_SELECT = 'SUBJECT_SUBJECT_SELECT'
const SUBJECT_SUBJECT_TYPE = 'SUBJECT_SUBJECT_TYPE'

const initState = {
  data: {},
  error: null,
  selectId: null,
  selectType: null
}

export function subjects (state = initState, action = {}) {
  switch (action.type) {
    case SUBJECT_SUBJECT_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case SUBJECT_SUBJECT_FAIL:
      return Object.assign({}, state, { error: action.error })
    case SUBJECT_SUBJECT_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    case SUBJECT_SUBJECT_TYPE:
      return Object.assign({}, state, { selectType: action.selectType })
    default:
      return state
  }
}

const QUERY_SUBJECTS = gql`
  query{
    subjects(limit: 0){
      id
      name
    }
  }
`

export const querySubjects = (client) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SUBJECTS, variables: {}, fetchPolicy: 'network-only' })
    const { subjects } = data.data
    let json = {}
    for (let doc of subjects) {
      json[doc.id] = doc
    }
    dispatch({
      type: SUBJECT_SUBJECT_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: SUBJECT_SUBJECT_FAIL,
      error: e.message
    })
  }
}

export const selectSubject = ({ subjectId }) => dispatch => {
  dispatch({
    type: SUBJECT_SUBJECT_SELECT,
    selectId: subjectId
  })
}

export const selectSubjectType = ({ selectType }) => dispatch => {
  dispatch({
    type: SUBJECT_SUBJECT_TYPE,
    selectType
  })
}
