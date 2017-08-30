import gql from 'graphql-tag'

const NOTICES_QUERY_NOTICES = 'notices/querynotices'
const NOTICES_QUERY_NOTICES_SUCCESS = 'notices/querynotices/success'
const NOTICES_QUERY_NOTICES_FAIL = 'notices/querynotices/fail'
const NOTICES_UPDATE_NOTICES_SUCCESS = 'notices/updatenotices/success'
const NOTICES_CREATE_NOTICES_SUCCESS = 'notices/createNotices/success'
const NOTICES_UPDATE_NOTICES_GROUPS_SUCCESS = 'notices/update_notices_groups/success'
const NOTICES_CREATE_NOTICES_GROUPS_SUCCESS = 'notices/create_notices_groups/success'
const NOTICES_SELECTED_NOTICES = 'notices/selected_notices'
const HOSPITAL_SELECT_HOSPITAL = 'HOSPITAL_SELECT_HOSPITAL'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectedNotice: {}
}

// reducer
export function notices (state = initState, action = {}) {
  //
  switch (action.type) {
    case NOTICES_QUERY_NOTICES:
      return Object.assign({}, state, { loading: true, error: null })
    case NOTICES_QUERY_NOTICES_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case NOTICES_QUERY_NOTICES_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { notices: action.notices }) }, { loading: false, error: null })
    case NOTICES_UPDATE_NOTICES_SUCCESS:
    case NOTICES_CREATE_NOTICES_GROUPS_SUCCESS:
    case NOTICES_UPDATE_NOTICES_GROUPS_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { noticesGroups: action.noticesGroups }) }, { loading: false, error: null })
    case NOTICES_CREATE_NOTICES_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { createNewsId: action.createNotices }) }, { loading: false, error: null })
    case NOTICES_SELECTED_NOTICES:
      return Object.assign({}, state, { selectedNotice: action.selectedNotice }, { loading: false, error: null })
    default:
      return state
  }
}

// notice groups list
const QUERY_NOTICESGROUPS = gql`
  query {
    visitNoticeGroups(limit: 100) {
      name
      id
      code
      hospital {
        id
        hospitalName
      }
    }
  }
`

export const queryNoticesGroups = client => async dispatch => {
  dispatch({
    type: NOTICES_QUERY_NOTICES
  })
  try {
    const data = await client.query({ query: QUERY_NOTICESGROUPS, fetchPolicy: 'network-only' })
    if (data.error) {
      dispatch({
        type: NOTICES_QUERY_NOTICES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NOTICES_UPDATE_NOTICES_SUCCESS,
      noticesGroups: data.data.visitNoticeGroups
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: NOTICES_QUERY_NOTICES_FAIL,
      error: e.message
    })
    return e.message
  }
}
// create notices groups
const CREATE_NOTICE_GROUPS = gql`
  mutation($code: String!, $name: String!, $hospitalId: ObjID!) {
    createVisitNoticeGroup(input: { code: $code, name: $name, hospitalId: $hospitalId }) {
      id
    }
  }
`
export const createNoticesGroups = (client, { code, name, hospitalId }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NOTICES_QUERY_NOTICES
  })
  try {
    console.log('-----value', code, name, hospitalId)
    let data = await client.mutate({
      mutation: CREATE_NOTICE_GROUPS,
      variables: { code, name, hospitalId }
    })
    if (data.error) {
      dispatch({
        type: NOTICES_QUERY_NOTICES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NOTICES_CREATE_NOTICES_GROUPS_SUCCESS,
      createNewsGroup: data.data.createVisitNoticeGroup
    })
    return null
  } catch (e) {
    dispatch({
      trype: NOTICES_QUERY_NOTICES_FAIL,
      error: e.message
    })
    return e.message
  }
}

// update notices groups
const UPDATE_NOTICE_GROUPS = gql`
  mutation($id: ObjID!, $code: String!, $name: String!, $hospitalId: ObjID!) {
    updateVisitNoticeGroup(id: $id, input: { code: $code, name: $name, hospitalId: $hospitalId }) {
      id
    }
  }
`
export const updateNoticesGroups = (client, { id, code, name, hospitalId }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NOTICES_QUERY_NOTICES
  })
  try {
    console.log('--update-notice--groups---value', id, code, name, hospitalId)
    let data = await client.mutate({
      mutation: UPDATE_NOTICE_GROUPS,
      variables: { id, code, name, hospitalId }
    })
    if (data.error) {
      dispatch({
        type: NOTICES_QUERY_NOTICES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NOTICES_UPDATE_NOTICES_GROUPS_SUCCESS,
      createNewsGroup: data.data.createVisitNoticeGroup
    })
    return null
  } catch (e) {
    dispatch({
      trype: NOTICES_QUERY_NOTICES_FAIL,
      error: e.message
    })
    return e.message
  }
}

// news list
const QUERY_NOTICES = gql`
  query($limit: Int, $skip: Int) {
    visitNotices(limit: $limit, skip: $skip) {
      id
      code
      title
      content
      image
      visitNoticeGroup {
        code
        id
        name
        hospital {
          id
          hospitalName
        }
      }
    }
  }
`

export const querynotices = (client, { limit, skip }) => async dispatch => {
  dispatch({
    type: NOTICES_QUERY_NOTICES
  })
  try {
    const data = await client.query({ query: QUERY_NOTICES, variables: { limit, skip }, fetchPolicy: 'network-only' })
    if (data.error) {
      return dispatch({
        type: NOTICES_QUERY_NOTICES_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: NOTICES_QUERY_NOTICES_SUCCESS,
      notices: data.data.visitNotices
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: NOTICES_QUERY_NOTICES_FAIL,
      error: e.message
    })
  }
}

// update notices
const UPDATE_NOYICES = gql`
  mutation($id: ObjID!, $code: String, $title: String!, $content: String!, $image: String!, $visitNoticeGroupId: ObjID!) {
    updateVisitNotice(id: $id, input: { code: $code, title: $title, content: $content, image: $image, visitNoticeGroupId: $visitNoticeGroupId }) {
      id
    }
  }
`

export const updateVisitNotice = (client, { id, code, title, content, image, visitNoticeGroupId }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NOTICES_QUERY_NOTICES
  })
  try {
    console.log('-----value', id, code, title, content, image, visitNoticeGroupId)
    let data = await client.mutate({
      mutation: UPDATE_NOYICES,
      variables: { id, code, title, content, image, visitNoticeGroupId }
    })
    if (data.error) {
      dispatch({
        type: NOTICES_QUERY_NOTICES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NOTICES_CREATE_NOTICES_SUCCESS,
      createNotices: data.data.updateVisitNotice
    })
    return null
  } catch (e) {
    dispatch({
      trype: NOTICES_QUERY_NOTICES_FAIL,
      error: e.message
    })
    return e.message
  }
}

// create notices
const CREATE_NOTICES = gql`
  mutation($code: String, $title: String!, $content: String!, $image: String!, $visitNoticeGroupId: ObjID!) {
    createVisitNotice(input: { code: $code, title: $title, content: $content, image: $image, visitNoticeGroupId: $visitNoticeGroupId }) {
      id
    }
  }
`

export const createVisitNotice = (client, { code, title, content, image, visitNoticeGroupId }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NOTICES_QUERY_NOTICES
  })
  try {
    console.log('-----createNotices----value', code, title, content, image, visitNoticeGroupId)
    let data = await client.mutate({
      mutation: CREATE_NOTICES,
      variables: { code, title, content, image, visitNoticeGroupId }
    })
    if (data.error) {
      dispatch({
        type: NOTICES_QUERY_NOTICES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NOTICES_CREATE_NOTICES_SUCCESS,
      createNotices: data.data.createVisitNotice
    })
    return null
  } catch (e) {
    dispatch({
      trype: NOTICES_QUERY_NOTICES_FAIL,
      error: e.message
    })
    return e.message
  }
}

export const selectNotice = ({ data }) => async dispatch => {
  dispatch({
    type: HOSPITAL_SELECT_HOSPITAL,
    selectedNotice: data
  })
}
