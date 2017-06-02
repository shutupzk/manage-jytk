import { gql } from 'react-apollo'

const HOSPITAL_NEWS_QUERY = 'hospital/news/query'
const HOSPITAL_NEWS_SUCCESS = 'hospital/news/success'
const HOSPITAL_NEWS_FAIL = 'hospital/news/fail'

const HOSPITAL_NEWS_GROUP_QUERY = 'hospital/news/group/query'
const HOSPITAL_NEWS_GROUP_SUCCESS = 'hospital/news/group/success'
const HOSPITAL_NEWS_GROUP_FAIL = 'hospital/news/group/fail'

const HOSPITAL_NEWS_SELECT = 'hospital/news/select'

const HOSPITAL_NEWS_DETAIL_QUERY = 'hospital/news/detail/query'
const HOSPITAL_NEWS_DETAIL_SUCCESS = 'hospital/news/detail/success'
const HOSPITAL_NEWS_DETAIL_FAIL = 'hospital/news/detail/fail'

const initState = {
  data: {},
  error: null,
  loading: false,
  selectId: {}
}

// reducer
export function news (state = initState, action = {}) {
  switch (action.type) {
    case HOSPITAL_NEWS_GROUP_QUERY:
    case HOSPITAL_NEWS_QUERY:
    case HOSPITAL_NEWS_DETAIL_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_NEWS_GROUP_SUCCESS:
    case HOSPITAL_NEWS_DETAIL_SUCCESS:
      return Object.assign({}, state, { data: action.news, loading: false, error: null })
    case HOSPITAL_NEWS_SUCCESS:
      let news = getNewsList(state, action.newsGroup)
      return Object.assign({}, state, { data: Object.assign({}, state.data, news), loading: false, error: null })
    case HOSPITAL_NEWS_GROUP_FAIL:
    case HOSPITAL_NEWS_FAIL:
    case HOSPITAL_NEWS_DETAIL_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOSPITAL_NEWS_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: action.error })
    default:
      return state
  }
}
const getNewsList = (state, actionNews) => {
  let news = state.data
  let newsGroupId = actionNews.id
  news[newsGroupId] = Object.assign({}, news[newsGroupId], {newss: actionNews.newss})
  return news
}
const QUREY_NEWS_GGROUP = gql`
  query {
    newsGroups {
      id
      type
      newss {
        id
        title
        summary
        time
        image
        content
      }
    }
  }
`

export const queryNewsGroups = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_NEWS_GROUP_QUERY
  })
  try {
    let data = await client.query({ query: QUREY_NEWS_GGROUP })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_NEWS_GROUP_FAIL,
        error: data.error.message
      })
    }
    let newses = data.data.newsGroups
    let json = {}
    for (let news of newses) {
      // news = Object.assign({}, news, {newss: []})
      json[news.id] = news
    }
    // news[newsGroupId] = Object.assign({}, news[newsGroupId], {newss: actionNews.newss})
    dispatch({
      type: HOSPITAL_NEWS_GROUP_SUCCESS,
      news: json
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: HOSPITAL_NEWS_GROUP_FAIL,
      error: '数据请求错误'
    })
  }
}

const QUERY_NEWS_LIST = gql`
  query ($id: ObjID!) {
    newsGroup(id: $id) {
      id
      type
      newss {
        id
        title
        summary
        time
        image
        content
      }
    }
  }
`
// 查询新闻列表
export const queryNews = (client, {groupId}) => async dispatch => {
  dispatch({
    type: HOSPITAL_NEWS_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_NEWS_LIST, variables: {id: groupId} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_NEWS_FAIL,
        error: data.error.message
      })
    }
    return dispatch({
      type: HOSPITAL_NEWS_SUCCESS,
      newsGroup: data.data.newsGroup
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_NEWS_FAIL,
      error: '数据请求失败！'
    })
  }
}


const QUERY_NEWS = gql`
  query ($id: ObjID!) {
    news (id: $id) {
      id
      time
      title
      summary
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
// 查询新闻
export const queryNewsDetail = (client, {newsId}) => async dispatch => {
  dispatch({
    type: HOSPITAL_NEWS_DETAIL_QUERY
  })
  console.log(newsId)
  try {
    let data = await client.query({ query: QUERY_NEWS, variables: {id: newsId} })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_NEWS_DETAIL_FAIL,
        error: data.error.message
      })
    }
    let news = data.data.news
    let newsGroup = {}
    newsGroup.id = news.newsGroup.id
    newsGroup.type = news.newsGroup.type
    newsGroup['newss'] = [news]
    let json = {}
    json[newsGroup.id] = newsGroup
    return dispatch({
      type: HOSPITAL_NEWS_DETAIL_SUCCESS,
      news: json
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOSPITAL_NEWS_DETAIL_FAIL,
      error: '数据请求失败！'
    })
  }
}

// 选择指南
export const selectNews = ({newsGroupId, newsId}) => dispatch => {
  return dispatch({
    type: HOSPITAL_NEWS_SELECT,
    selectId: {
      newsGroupId,
      newsId
    }
  })
}
