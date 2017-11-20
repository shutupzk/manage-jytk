import gql from 'graphql-tag'

const COURSE_COURSE_SUCCESS = 'COURSE_COURSE_SUCCESS'
const COURSE_COURSE_FAIL = 'COURSE_COURSE_FAIL'
const COURSE_COURSE_SELECT = 'COURSE_COURSE_SELECT'
const COURSE_COURSE_DELETE = 'COURSE_COURSE_DELETE'

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
    case COURSE_COURSE_DELETE:
      let newstate = Object.assign({}, state.data)
      delete newstate[action.id]
      return Object.assign({}, state, { data: newstate, error: null })
    default:
      return state
  }
}

const COLLECT_COURSE = gql`
  mutation($userId: ObjID!, $courseId: ObjID!, $subjectId: ObjID!) {
    createCourseCollect(input: { userId: $userId, courseId: $courseId, subjectId: $subjectId }) {
      id
    }
  }
`

export const createCourseCollect = async (client, { courseId, userId, subjectId }) => {
  try {
    await client.mutate({ mutation: COLLECT_COURSE, variables: { courseId, userId, subjectId } })
    return null
  } catch (e) {
    let error = e.message.replace('GraphQL error: ', '')
    if (error === '请勿重复收藏') {
      return null
    }
    return error
  }
}

const QUERY_COURSES = gql`
  query($skip: Int, $limit: Int, $hot: Boolean, $type: String, $subjectId: ObjID) {
    courses(skip: $skip, limit: $limit, hot: $hot, type: $type, subjectId: $subjectId) {
      id
      title
      url
      content
      hot
      date
      teacher
      abstract
      createdAt
      type
      free
      subject {
        id
        name
      }
    }
  }
`

export const queryCourses = (client, { skip, limit, hot, type, subjectId }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_COURSES, variables: { skip, limit, hot, type, subjectId }, fetchPolicy: 'network-only' })
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
          free
          createdAt
          type
          subject {
            id
            name
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

const CREATE_COURSE = gql`
  mutation($title: String!, $type: String!, $content: String!, $date: String!, $hot: String, $free: String, $url: String!, $teacher: String, $abstract: String, $subjectId: ObjID, $articleUrl: String) {
    createCourse(input: { title: $title, type: $type, content: $content, date: $date, hot: $hot, free: $free, url: $url, teacher: $teacher, abstract: $abstract, subjectId: $subjectId, articleUrl: $articleUrl }) {
      id
    }
  }
`

export const createCourse = (client, { title, type, content, date, url, teacher, abstract, subjectId, hot, free, articleUrl }) => async dispatch => {
  try {
    await client.mutate({ mutation: CREATE_COURSE, variables: { title, type, content, date, url, teacher, abstract, subjectId, hot, free, articleUrl } })
    return null
  } catch (e) {
    console.log(e.message)
    return e.message
  }
}

const UPDATE_COURSE = gql`
  mutation($id: ObjID!, $title: String, $url: String, $content: String, $teacher: String, $abstract: String, $hot: Boolean, $free: Boolean, $subjectId: ObjID) {
    updateCourse(id: $id, input: { title: $title, url: $url, content: $content, teacher: $teacher, abstract: $abstract, hot: $hot,free: $free, subjectId: $subjectId }) {
      id
      title
      url
      content
      hot
      date
      teacher
      abstract
      createdAt
      type
      free
      subject {
        id
        name
      }
    }
  }
`

export const updateCourse = (client, { id, title, url, content, teacher, abstract, hot, free, subjectId }) => async dispatch => {
  try {
    let data = await client.mutate({ mutation: UPDATE_COURSE, variables: { id, title, url, content, teacher, abstract, hot, free, subjectId } })
    const { updateCourse } = data.data
    let json = { [id]: updateCourse }
    dispatch({
      type: COURSE_COURSE_SUCCESS,
      data: json
    })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}

const REMOVE_COURSE = gql`
  mutation($id: ObjID!) {
    removeCourse(id: $id)
  }
`

export const removeCourse = (client, { id }) => async dispatch => {
  try {
    await client.mutate({ mutation: REMOVE_COURSE, variables: { id } })
    dispatch({
      type: COURSE_COURSE_DELETE,
      id
    })
    return null
  } catch (e) {
    return e.message
  }
}

export const selectCourse = ({ courseId }) => dispatch => {
  dispatch({
    type: COURSE_COURSE_SELECT,
    selectId: courseId
  })
}
