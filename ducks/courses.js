import gql from 'graphql-tag'

const COURSE_COURSE_SUCCESS = 'COURSE_COURSE_SUCCESS'
const COURSE_COURSE_FAIL = 'COURSE_COURSE_FAIL'
const COURSE_COURSE_SELECT = 'COURSE_COURSE_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null
}

export function courses (state = initState, action = {}) {
  switch (action.type) {
    case COURSE_COURSE_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case COURSE_COURSE_FAIL:
      return Object.assign({}, state, { error: action.error })
    case COURSE_COURSE_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const COLLECT_COURSE = gql`
  mutation($userId: ObjID!, $courseId: ObjID!) {
    createCourseCollect(input: { userId: $userId, courseId: $courseId }) {
      id
    }
  }
`

export const createCourseCollect = async (client, { courseId, userId }) => {
  try {
    await client.mutate({ mutation: COLLECT_COURSE, variables: { courseId, userId } })
    return null
  } catch (e) {
    console.log(e.message)
    let error = e.message.replace('GraphQL error: ', '')
    if (error === '请勿重复收藏') {
      return null
    }
    return error
  }
}

const QUERY_COURSES = gql`
  query($skip: Int, $limit: Int, $hot: Boolean) {
    courses(skip: $skip, limit: $limit, hot: $hot) {
      id
      title
      url
      content
      hot
      date
      teacher
      abstract
      createdAt
      courseType {
        id
        typeName
      }
    }
  }
`

export const queryCourses = (client, { skip, limit, hot }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_COURSES, variables: { skip, limit, hot }, fetchPolicy: 'network-only' })
    const { courses } = data.data
    let json = {}
    for (let doc of courses) {
      json[doc.id] = Object.assign({}, doc)
    }
    dispatch({
      type: COURSE_COURSE_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: COURSE_COURSE_FAIL,
      error: e.message
    })
  }
}

const QUERY_COLLECT_COURSE = gql`
  query($userId: ObjID!, $skip: Int, $limit: Int) {
    user(id: $userId) {
      id
      courseCollects(skip: $skip, limit: $limit) {
        id
        course {
          id
          title
          url
          content
          hot
          date
          teacher
          abstract
          createdAt
          courseType {
            id
            typeName
          }
        }
      }
    }
  }
`

export const queryCollectCourses = (client, { skip, limit, userId }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_COLLECT_COURSE, variables: { skip, limit, userId }, fetchPolicy: 'network-only' })
    const { courseCollects } = data.data.user
    let json = {}
    for (let courseCollect of courseCollects) {
      let doc = courseCollect.course
      json[doc.id] = Object.assign({}, doc, { collect: true })
    }
    dispatch({
      type: COURSE_COURSE_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: COURSE_COURSE_FAIL,
      error: e.message
    })
  }
}

export const selectCourse = ({ courseId }) => dispatch => {
  dispatch({
    type: COURSE_COURSE_SELECT,
    selectId: courseId
  })
}
