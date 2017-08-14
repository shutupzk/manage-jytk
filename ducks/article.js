import localforage from 'localforage'
import gql from 'graphql-tag'

const ARTICLE_QUERY_ARTICLES = 'article/queryarticles'
const ARTICLE_QUERY_ARTICLES_SUCCESS = 'article/queryarticles/success'
const ARTICLE_QUERY_ARTICLE_FAIL = 'article/queryarticles/fail'

const ARTICLE_QUERY_ARTICLEGROUPS_SUCCESS = 'article/queryarticleGroups/success'

const ARTICLE_CREATE_ARTICLE_SUCCESS = 'article/createArticle/success'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function article (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case ARTICLE_QUERY_ARTICLES:
      return Object.assign({}, state, { loading: true, error: null })
    case ARTICLE_QUERY_ARTICLE_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
		case ARTICLE_QUERY_ARTICLES_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, {article: action.article}) },
        { loading: false, error: null }
      )
    case ARTICLE_QUERY_ARTICLEGROUPS_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, {articleGroups: action.articleGroups}) },
        { loading: false, error: null }
      )
    case ARTICLE_CREATE_ARTICLE_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, {createNewsId: action.createNews}) },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// article groups
const QUERY_ARTICLEGROUPS = gql`
  query {
    articleGroups(limit: 1000) {
      id
      type
      hospital{
        hospitalName
        id
      }
    }
	}
`

export const queryArticleGroups = (client) => async dispatch => {
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		const data = await client.query({ query: QUERY_ARTICLEGROUPS, fetchPolicy: 'network-only'})
    if (data.error) {
      return dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: ARTICLE_QUERY_ARTICLEGROUPS_SUCCESS,
      articleGroups: data.data.articleGroups
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
  }
}
// create article groups
const CREATE_GROUPS = gql`
	mutation($type: String!, $hospitalId: ObjID!){
    createNewsGroup(input: {hospitalId: $hospitalId, type: $type}) {
      id
    }
	}
`

export const createArticleGroups = (client, {hospitalId, type}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('-----value', hospitalId, type)
    let data = await client.mutate({
      mutation: CREATE_GROUPS,
      variables: {hospitalId, type}
		})
		if (data.error) {
      dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: ARTICLE_CREATE_ARTICLE_SUCCESS,
      createNewsGroup: data.data.createNewsGroup
		})
		return null
  } catch (e) {
    dispatch({
      trype: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
    return e.message
  }
}

// update article groups
const UPDATE_ARTICLE_GROUPS = gql`
	mutation($id: ObjID!, $type: String!, $hospitalId: ObjID!){
    updateNewsGroup(id: $id, input: {hospitalId: $hospitalId, type: $type}) {
      id
    }
	}
`
export const updateArticleGroup = (client, {id, hospitalId, type}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('---update---article--value', id, hospitalId, type)
    let data = await client.mutate({
      mutation: UPDATE_ARTICLE_GROUPS,
      variables: {id, hospitalId, type}
		})
		if (data.error) {
      dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: ARTICLE_CREATE_ARTICLE_SUCCESS,
      createNewsGroup: data.data.updateNewsGroup
		})
		return null
  } catch (e) {
    dispatch({
      trype: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
    return e.message
  }
}
// remove article groups
const REMOVE_NEWS_GROUPS = gql`
	mutation($id: ObjID!){
    removeNewsGroup(id: $id)
	}
`

export const removeArticleGroup = (client, {id}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('---remove---article--value', id)
    let data = await client.mutate({
      mutation: REMOVE_NEWS_GROUPS,
      variables: {id}
		})
		if (data.error) {
      dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: ARTICLE_CREATE_ARTICLE_SUCCESS,
      createNewsGroup: data.data.removeNewsGroup
		})
		return null
  } catch (e) {
    dispatch({
      trype: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
    return e.message
  }
}

// article list
const QUERY_ARTICLES = gql`
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
			newsGroup{
				id
				type
			}
    }
	}
`

export const queryArticles = (client, {limit, skip}) => async dispatch => {
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		const data = await client.query({ query: QUERY_ARTICLES, variables: {limit, skip}, fetchPolicy: 'network-only'})
    if (data.error) {
      return dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
    }
    console.log('----article', data)
    dispatch({
      type: ARTICLE_QUERY_ARTICLES_SUCCESS,
      article: data.data.newss
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
  }
}


// update article
const UPDATE_NEWS = gql`
	mutation($id: ObjID!, $title: String!, $summary: String!, $time: String, $content: String, $newsGroupId: ObjID!){
		updateNews(id: $id, input: {title: $title, summary: $summary, time: $time, content: $content, newsGroupId: $newsGroupId}) {
			id
		}
	}
`

export const updateNews = (client, {id, title, summary, time, content, newsGroupId}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('-----value', id, title, summary, time, content, newsGroupId)
    let data = await client.mutate({
      mutation: UPDATE_NEWS,
      variables: {id, title, summary, time, content, newsGroupId}
		})
		if (data.error) {
      dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: ARTICLE_CREATE_ARTICLE_SUCCESS,
      createNews: data.data.updateNews
		})
		return null
  } catch (e) {
    dispatch({
      trype: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
    return e.message
  }
}

// create article
const CREATE_NEWS = gql`
	mutation($title: String!, $summary: String!, $time: String, $content: String, $newsGroupId: ObjID!){
		createNews(input: {title: $title, summary: $summary, time: $time, content: $content, newsGroupId: $newsGroupId}) {
			id
		}
	}
`

export const createNews = (client, {title, summary, time, content, newsGroupId}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('-----createNews----value', title, summary, time, content, newsGroupId)
    let data = await client.mutate({
      mutation: CREATE_NEWS,
      variables: {title, summary, time, content, newsGroupId}
		})
		if (data.error) {
      dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: ARTICLE_CREATE_ARTICLE_SUCCESS,
      createNews: data.data.createNews
		})
		return null
  } catch (e) {
    dispatch({
      trype: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
    return e.message
  }
}

// article
const REMOVE_NEWS = gql`
	mutation($id: ObjID!){
		removeNews(id: $id)
	}
`

export const removeNews = (client, {id}) => async dispatch => {
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('--remove---article---value', id)
    let data = await client.mutate({
      mutation: REMOVE_NEWS,
      variables: {id}
		})
		if (data.error) {
      dispatch({
        type: ARTICLE_QUERY_ARTICLE_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: ARTICLE_CREATE_ARTICLE_SUCCESS,
      createNews: data.data.removeNews
		})
		return null
  } catch (e) {
    dispatch({
      trype: ARTICLE_QUERY_ARTICLE_FAIL,
      error: e.message
    })
    return e.message
  }
}