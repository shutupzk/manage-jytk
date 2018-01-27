import gql from 'graphql-tag'

const USER_USER_SUCCESS = 'USER_USER_SUCCESS'
const USER_USER_FAIL = 'USER_USER_FAIL'
const USER_USER_SELECT = 'USER_USER_SELECT'

const initState = {
  data: {},
  error: null,
  selectId: null,
  selectType: null
}

export function users (state = initState, action = {}) {
  switch (action.type) {
    case USER_USER_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.data), error: null })
    case USER_USER_FAIL:
      return Object.assign({}, state, { error: action.error })
    case USER_USER_SELECT:
      return Object.assign({}, state, { selectId: action.selectId })
    default:
      return state
  }
}

const QUERY_SUBJECTS = gql`
  query($skip: Int, $limit: Int, $sort: String, $keyword: String) {
    users(skip: $skip, limit: $limit, sort: $sort, keyword: $keyword) {
      id
      phone
      score
      scoreUsed
      countUserAnswer
      payFee
      countRightUserAnswer
      name
      userCourseCount
      member {
        id
        name
      }
    }
  }
`

export const queryUsers = (client, { skip, limit, sort, keyword }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_SUBJECTS, variables: { skip, limit, sort, keyword }, fetchPolicy: 'network-only' })
    const { users } = data.data
    let json = {}
    for (let doc of users) {
      json[doc.id] = doc
    }
    dispatch({
      type: USER_USER_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: USER_USER_FAIL,
      error: e.message
    })
  }
}

const QUERY_USER_DETAIL = gql`
  query($id: ObjID!) {
    user(id: $id) {
      id
      phone
      score
      payFee
      scoreUsed
      countUserAnswer
      countRightUserAnswer
      name
      userCourseCount
      member {
        id
        name
      }
    }
  }
`

export const queryUserDetial = (client, { id }) => async dispatch => {
  try {
    const data = await client.query({ query: QUERY_USER_DETAIL, variables: { id }, fetchPolicy: 'network-only' })
    const { user } = data.data
    let json = { [user.id]: user }
    dispatch({
      type: USER_USER_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: USER_USER_FAIL,
      error: e.message
    })
  }
}

export const selectUser = ({ userId }) => dispatch => {
  dispatch({
    type: USER_USER_SELECT,
    selectId: userId
  })
}
