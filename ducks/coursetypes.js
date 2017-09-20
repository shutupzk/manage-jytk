import gql from 'graphql-tag'

const COURSE_COURSETYPE_SUCCESS = 'COURSE_COURSETYPE_SUCCESS'
const COURSE_COURSETYPE_FAIL = 'COURSE_COURSETYPE_FAIL'
const COURSE_COURSETYPE_SELECT = 'COURSE_COURSETYPE_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function coursetypes (state = initState, action = {}) {
  switch (action.type) {
    case COURSE_COURSETYPE_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case COURSE_COURSETYPE_FAIL:
      return Object.assign({}, state, { error: action.error })
    case COURSE_COURSETYPE_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_COURSETYPES = gql`
  {
    courseTypes {
      id
      typeName
    }
  }
`

export const queryCourseTypes = (client) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_COURSETYPES, variables: { }, fetchPolicy: 'network-only' })
    const { courseTypes } = data.data
    let json = {}
    for (let doc of courseTypes) {
      json[doc.id] = Object.assign({}, doc)
    }
    dispatch({
      type: COURSE_COURSETYPE_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: COURSE_COURSETYPE_FAIL,
      error: e.message
    })
  }
}
