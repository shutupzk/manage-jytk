import localforage from 'localforage'
import gql from 'graphql-tag'
import axios from 'axios'
import { API_SERVER } from '../config'

const PROFILE_USER_SAVEPHONE = 'profile/user/savephone'
const PROFILE_USER_SIGNUP = 'profile/user/signup'
const PROFILE_USER_SIGNUP_SUCCESS = 'profile/user/signup/success'
const PROFILE_USER_SIGNUP_FAIL = 'profile/user/signup/fail'
const PROFILE_USER_SIGNIN = 'profile/user/signin'
const PROFILE_USER_SIGNIN_SUCCESS = 'profile/user/signin/success'
const PROFILE_USER_SIGNIN_FAIL = 'profile/user/signin/fail'
const PROFILE_USER_SIGNOUT = 'profile/user/signout'
const PROFILE_USER_SIGNOUT_SUCCESS = 'profile/user/signout/success'
const PROFILE_USER_SIGNOUT_FAIL = 'profile/user/signout/fail'
const PROFILE_USER_QUERYUSER = 'profile/user/queryuser'
const PROFILE_USER_QUERYUSER_SUCCESS = 'profile/user/queryuser/success'
const PROFILE_USER_QUERYUSER_FAIL = 'profile/user/queryuser/fail'
const PROFILE_USER_UPDATEPASSWORD = 'profile/user/updatepassword'
const PROFILE_USER_UPDATEPASSWORD_SUCCESS = 'profile/user/updatepassword/success'
const PROFILE_USER_UPDATEPASSWORD_FAIL = 'profile/user/updatepassword/fail'

const initState = {
  data: {
    token: null,
    id: null
  },
  loading: false,
  error: null
}

// reducer
export function user (state = initState, action = {}) {
  console.log('action', action)
  switch (action.type) {
    case PROFILE_USER_SIGNUP:
    case PROFILE_USER_SIGNIN:
    case PROFILE_USER_SIGNOUT:
    case PROFILE_USER_QUERYUSER:
    case PROFILE_USER_UPDATEPASSWORD:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_USER_SIGNUP_FAIL:
    case PROFILE_USER_SIGNIN_FAIL:
    case PROFILE_USER_SIGNOUT_FAIL:
    case PROFILE_USER_QUERYUSER_FAIL:
    case PROFILE_USER_UPDATEPASSWORD_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case PROFILE_USER_SIGNUP_SUCCESS:
      return Object.assign({}, state, { loading: false, error: null })
    case PROFILE_USER_SIGNIN_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, { token: action.token, id: action.userId, username: action.username, password: action.password }) },
        { loading: false, error: null }
      )
    case PROFILE_USER_SIGNOUT_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: {token: null, id: null} },
        { loading: false, error: null }
      )
    case PROFILE_USER_QUERYUSER_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, action.user) },
        { loading: false, error: null }
      )
    case PROFILE_USER_UPDATEPASSWORD_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, { password: action.password }) },
        { loading: false, error: null }
      )
    case PROFILE_USER_SAVEPHONE:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, { phone: action.phone, password: action.password }) },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// 注册
const SIGNUP = gql`
  mutation($phone: String!,$password: String!,$certificateNo: String!, $name: String! ){
    signUp(input:{phone: $phone,password:$password,certificateNo: $certificateNo,name: $name}){
      id
    }
  }
`
export const signup = (client, { phone, password, certificateNo, name }, callback) => async dispatch => {
  dispatch({
    type: PROFILE_USER_SIGNUP
  })
  try {
    const data = await client.mutate({
      mutation: SIGNUP,
      variables: {
        phone: phone,
        password: password,
        certificateNo: certificateNo,
        name: name
      }
    })
    if (data.error) {
      dispatch({
        type: PROFILE_USER_SIGNUP_FAIL,
        error: data.error.message
      })
      return data.data.error
    }
    dispatch({
      type: PROFILE_USER_SIGNUP_SUCCESS
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_USER_SIGNUP_FAIL,
      error: e.message
    })
    return e.message
  }
}

// 登陆
export const signin = ({ username, password }) => async (dispatch) => {
  let localUsername = await localforage.getItem('username')
  let loacalPassword = await localforage.getItem('password')
  let token = await localforage.getItem('token')
  let userId = await localforage.getItem('userId')
  console.log('signin:', username, password, localUsername, loacalPassword)
  if (!username && !localUsername) return
  if (username || (username !== localUsername && password)) {
    if (!password) return
    return doSignin(dispatch, {username, password})
  }

  password = loacalPassword
  dispatch({
    type: PROFILE_USER_SIGNIN_SUCCESS,
    token,
    userId,
    username,
    password
  })
  return null
}

const doSignin = async (dispatch, { username, password }) => {
  dispatch({
    type: PROFILE_USER_SIGNIN
  })
  const url = `http://${API_SERVER}/login`
  try {
    const data = await axios.post(url, {
      username: username,
      password: password
    })
    const token = data.data.token
    const userId = data.data.userId
    await localforage.setItem('token', token)
    await localforage.setItem('userId', userId)
    await localforage.setItem('username', username)
    await localforage.setItem('password', password)
    dispatch({
      type: PROFILE_USER_SIGNIN_SUCCESS,
      token,
      userId,
      username,
      password
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_USER_SIGNIN_FAIL,
      error: e.message
    })
    return e.message
  }
}

// 登出
export const signout = () => async dispatch => {
  // await AsyncStorage.removeItem('user')
  // await AsyncStorage.removeItem('patients')
  // await AsyncStorage.removeItem('token')
  // await AsyncStorage.removeItem('userId')
  // await AsyncStorage.removeItem('username')
  // await AsyncStorage.removeItem('password')
  await localforage.clear()
  dispatch({
    type: PROFILE_USER_SIGNOUT_SUCCESS
  })
  return null
}

// 获取用户信息
const QUERY_USER = gql`
  query($userId: ObjID!) {
    user(id: $userId) {
      id
      name
      phone
      certificateNo
      certificateType
      sex
      birthday
    }
  }
`
export const queryUser = (client, { userId }) => async dispatch => {
  dispatch({
    type: PROFILE_USER_QUERYUSER
  })
  try {
    const data = await client.query({ query: QUERY_USER, variables: { userId } })
    if (data.error) {
      return dispatch({
        type: PROFILE_USER_QUERYUSER_FAIL,
        error: data.error.message
      })
    }
    dispatch({
      type: PROFILE_USER_QUERYUSER_SUCCESS,
      user: data.data.user
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_USER_QUERYUSER_FAIL,
      error: e.message
    })
  }
}

const UPDATE_USER = gql`
  mutation ($userId: ObjID!, $password: String) {
    updateUser(id: $userId, input: {password: $password}) {
      id
    }
  }
`
// 修改密码
export const updatePassword = (client, {userId, password}) => async dispatch => {
  dispatch({
    type: PROFILE_USER_UPDATEPASSWORD
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_USER,
      variables: { userId, password }
    })
    if (data.error) {
      dispatch({
        type: PROFILE_USER_UPDATEPASSWORD_FAIL,
        error: data.error.message
      })
      return data.error.error
    }
    dispatch({
      type: PROFILE_USER_UPDATEPASSWORD_SUCCESS,
      password
    })
    await localforage.setItem('password', password)
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_USER_UPDATEPASSWORD_FAIL,
      error: e.message
    })
    return e.message
  }
}

export const savePhone = ({phone, password}) => dispatch => {
  console.log(phone)
  console.log(password)
  dispatch({
    type: PROFILE_USER_SAVEPHONE,
    phone,
    password
  })
}