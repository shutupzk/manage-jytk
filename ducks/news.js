import gql from 'graphql-tag'

const NEWS_QUERY_NEWS = 'news/querynews'
const NEWS_QUERY_NEWS_SUCCESS = 'news/querynews/success'
const NEWS_QUERY_NEWS_FAIL = 'news/querynews/fail'

const NEWS_QUERY_NEWGROUPS_SUCCESS = 'news/querynewGroups/success'

const NEWS_CREATE_NEWS_SUCCESS = 'news/createNews/success'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function news (state = initState, action = {}) {
  switch (action.type) {
    case NEWS_QUERY_NEWS:
      return Object.assign({}, state, { loading: true, error: null })
    case NEWS_QUERY_NEWS_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case NEWS_QUERY_NEWS_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { news: action.news }) }, { loading: false, error: null })
    case NEWS_QUERY_NEWGROUPS_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { newsGroups: action.newsGroups }) }, { loading: false, error: null })
    case NEWS_CREATE_NEWS_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, { createNewsId: action.createNews }) }, { loading: false, error: null })
    default:
      return state
  }
}

// department list
const QUERY_NEWGROUPS = gql`
  query {
    newsGroups(limit: 1000) {
      id
      type
      hospital {
        hospitalName
        id
      }
    }
  }
`

export const queryNewGroups = client => async dispatch => {
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    const data = await client.query({ query: QUERY_NEWGROUPS, fetchPolicy: 'network-only' })
    if (data.error) {
      return dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: NEWS_QUERY_NEWGROUPS_SUCCESS,
      newsGroups: data.data.newsGroups
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
  }
}
// create news groups
const CREATE_GROUPS = gql`
  mutation($type: String!, $hospitalId: ObjID!) {
    createNewsGroup(input: { hospitalId: $hospitalId, type: $type }) {
      id
    }
  }
`

export const createGroups = (client, { hospitalId, type }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    console.log('-----value', hospitalId, type)
    let data = await client.mutate({
      mutation: CREATE_GROUPS,
      variables: { hospitalId, type }
    })
    if (data.error) {
      dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NEWS_CREATE_NEWS_SUCCESS,
      createNewsGroup: data.data.createNewsGroup
    })
    return null
  } catch (e) {
    dispatch({
      trype: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
    return e.message
  }
}

// update news groups
const UPDATE_NEWS_GROUPS = gql`
  mutation($id: ObjID!, $type: String!, $hospitalId: ObjID!) {
    updateNewsGroup(id: $id, input: { hospitalId: $hospitalId, type: $type }) {
      id
    }
  }
`
export const updateNewsGroup = (client, { id, hospitalId, type }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    console.log('---update---news--value', id, hospitalId, type)
    let data = await client.mutate({
      mutation: UPDATE_NEWS_GROUPS,
      variables: { id, hospitalId, type }
    })
    if (data.error) {
      dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NEWS_CREATE_NEWS_SUCCESS,
      createNewsGroup: data.data.updateNewsGroup
    })
    return null
  } catch (e) {
    dispatch({
      trype: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
    return e.message
  }
}
// remove news groups
const REMOVE_NEWS_GROUPS = gql`
  mutation($id: ObjID!) {
    removeNewsGroup(id: $id)
  }
`

export const removeNewsGroup = (client, { id }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    console.log('---remove---news--value', id)
    let data = await client.mutate({
      mutation: REMOVE_NEWS_GROUPS,
      variables: { id }
    })
    if (data.error) {
      dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NEWS_CREATE_NEWS_SUCCESS,
      createNewsGroup: data.data.removeNewsGroup
    })
    return null
  } catch (e) {
    dispatch({
      trype: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
    return e.message
  }
}

// news list
const QUERY_NEWS = gql`
  query($limit: Int, $skip: Int) {
    newss(limit: $limit, skip: $skip) {
      id
      title
      summary
      time
      author
      content
      url
      image
      newsGroup {
        id
        type
      }
    }
  }
`

export const queryNews = (client, { limit, skip }) => async dispatch => {
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    const data = await client.query({ query: QUERY_NEWS, variables: { limit, skip }, fetchPolicy: 'network-only' })
    if (data.error) {
      return dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
    }
    console.log('----news', data)
    dispatch({
      type: NEWS_QUERY_NEWS_SUCCESS,
      news: data.data.newss
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
  }
}

// update news
const UPDATE_NEWS = gql`
  mutation($id: ObjID!, $title: String!, $summary: String!, $time: String, $content: String, $newsGroupId: ObjID!) {
    updateNews(id: $id, input: { title: $title, summary: $summary, time: $time, content: $content, newsGroupId: $newsGroupId }) {
      id
    }
  }
`

export const updateNews = (client, { id, title, summary, time, content, newsGroupId }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    console.log('-----value', id, title, summary, time, content, newsGroupId)
    let data = await client.mutate({
      mutation: UPDATE_NEWS,
      variables: { id, title, summary, time, content, newsGroupId }
    })
    if (data.error) {
      dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NEWS_CREATE_NEWS_SUCCESS,
      createNews: data.data.updateNews
    })
    return null
  } catch (e) {
    dispatch({
      trype: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
    return e.message
  }
}

// create news
const CREATE_NEWS = gql`
  mutation($title: String!, $summary: String!, $time: String, $content: String, $newsGroupId: ObjID!) {
    createNews(input: { title: $title, summary: $summary, time: $time, content: $content, newsGroupId: $newsGroupId }) {
      id
    }
  }
`

export const createNews = (client, { title, summary, time, content, newsGroupId }) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    console.log('-----createNews----value', title, summary, time, content, newsGroupId)
    let data = await client.mutate({
      mutation: CREATE_NEWS,
      variables: { title, summary, time, content, newsGroupId }
    })
    if (data.error) {
      dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NEWS_CREATE_NEWS_SUCCESS,
      createNews: data.data.createNews
    })
    return null
  } catch (e) {
    dispatch({
      trype: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
    return e.message
  }
}

// news
const REMOVE_NEWS = gql`
  mutation($id: ObjID!) {
    removeNews(id: $id)
  }
`

export const removeNews = (client, { id }) => async dispatch => {
  dispatch({
    type: NEWS_QUERY_NEWS
  })
  try {
    console.log('--remove---news---value', id)
    let data = await client.mutate({
      mutation: REMOVE_NEWS,
      variables: { id }
    })
    if (data.error) {
      dispatch({
        type: NEWS_QUERY_NEWS_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: NEWS_CREATE_NEWS_SUCCESS,
      createNews: data.data.removeNews
    })
    return null
  } catch (e) {
    dispatch({
      trype: NEWS_QUERY_NEWS_FAIL,
      error: e.message
    })
    return e.message
  }
}
