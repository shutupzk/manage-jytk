import localforage from 'localforage'
import gql from 'graphql-tag'

const ARTICLE_QUERY_ARTICLES = 'article/queryarticles'
const ARTICLE_QUERY_ARTICLES_SUCCESS = 'article/queryarticles/success'
const ARTICLE_QUERY_ARTICLE_FAIL = 'article/queryarticles/fail'

const ARTICLE_CREATE_ARTICLE_SUCCESS = 'article/createArticle/success'

const ARTICLE_SELECTED_ARTICLE = 'article/selectedArticle'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectedArticle: {}
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
    case ARTICLE_CREATE_ARTICLE_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, {createArticle: action.createArticle}) },
        { loading: false, error: null }
      )
    case ARTICLE_SELECTED_ARTICLE:
      return Object.assign(
        {},
        state,
        { selectedArticle: action.selectedArticle},
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// article list
const QUERY_ARTICLES = gql`
  query($limit: Int, $skip: Int) {
    protocols(limit: $limit, skip: $skip) {
      id
      code
      name
      description
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
    dispatch({
      type: ARTICLE_QUERY_ARTICLES_SUCCESS,
      article: data.data.protocols
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
const UPDATE_ARTICLE = gql`
	mutation($id: ObjID!, $code: String, $name: String, $description: String){
		updateProtocol(id: $id, input: {code: $code, name: $name, description: $description}) {
			id
		}
	}
`

export const updateArticle = (client, {id, code, name, description}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('-----value', id, code, name, description)
    let data = await client.mutate({
      mutation: UPDATE_ARTICLE,
      variables: {id, code, name, description}
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
      createArticle: data.data.updateProtocol
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
const CREATE_ARTICLE = gql`
	mutation($code: String!, $name: String, $description: String){
		createProtocol(input: {code: $code, name: $name, description: $description}) {
			id
		}
	}
`

export const createArticle = (client, {code, name, description}) => async dispatch => {
  // console.log('---updateDepartment', id, deptName, hot)
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('-----createArticle----value', code, name, description)
    let data = await client.mutate({
      mutation: CREATE_ARTICLE,
      variables: {code, name, description}
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
      createArticle: data.data.createProtocol
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

// article remove
const REMOVE_ARTICLE = gql`
	mutation($id: ObjID!){
		removeProtocol(id: $id)
	}
`

export const removeArticle = (client, {id}) => async dispatch => {
  dispatch({
    type: ARTICLE_QUERY_ARTICLES
  })
  try {
		console.log('--remove---article---value', id)
    let data = await client.mutate({
      mutation: REMOVE_ARTICLE,
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
      createArticle: data.data.removeProtocol
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

export const selecteArticle = ({data}) => async dispatch => {
  dispatch({
    type: ARTICLE_SELECTED_ARTICLE,
    selectedArticle: data
  })
}