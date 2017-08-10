import localforage from 'localforage'
import gql from 'graphql-tag'
import axios from 'axios'
import { API_SERVER } from '../config'

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

const PROFILE_FORGOT_PASSWORD = 'profile/forget/password'
const PROFILE_FORGOT_PASSWORD_SUCCESS = 'profile/forget/password/success'
const PROFILE_FORGOT_PASSWORD_FAIL = 'profile/forget/password/fail'

const PROFILE_VERIFY_CODE = 'profile/send/verify/code'
const PROFILE_VERIFY_CODE_SUCCESS = 'profile/send/verify/code/success'
const PROFILE_VERIFY_CODE_FAIL = 'profile/send/verify/code/fail'

const CHECK_VERIFY_CODE = 'profile/check/verify/code'
const CHECK_VERIFY_CODE_SUCCESS = 'profile/check/verify/code/success'
const CHECK_VERIFY_CODE_FAIL = 'profile/check/verify/code/fail'

const PROFILE_USER_COOKIE = 'profile/user/cookie'
const PROFILE_USER_COOKIE_SUCCESS = 'profile/user/cookie/success'
const PROFILE_USER_COOKIE_FAIL = 'profile/user/cookie/fail'

const PROFILE_USER_COOKIE2_SUCCESS = 'profile/user/cookie2/success'
const PROFILE_USER_COOKIE2 = 'profile/user/cookie2'

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
  // console.log('action', action)
  switch (action.type) {
    case PROFILE_USER_COOKIE:
    case PROFILE_USER_SIGNUP:
    case PROFILE_USER_SIGNIN:
    case PROFILE_USER_SIGNOUT:
    case PROFILE_USER_QUERYUSER:
    case PROFILE_USER_UPDATEPASSWORD:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_USER_COOKIE_FAIL:
    case PROFILE_USER_SIGNUP_FAIL:
    case PROFILE_USER_SIGNIN_FAIL:
    case PROFILE_USER_SIGNOUT_FAIL:
    case PROFILE_USER_QUERYUSER_FAIL:
    case PROFILE_USER_UPDATEPASSWORD_FAIL:
    case PROFILE_FORGOT_PASSWORD_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case PROFILE_USER_SIGNUP_SUCCESS:
      return Object.assign({}, state, { loading: false, error: null })
    case PROFILE_USER_SIGNIN_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, { token: action.token, id: action.adminId, username: action.username, password: action.password }) },
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
    case PROFILE_VERIFY_CODE_SUCCESS:
    case CHECK_VERIFY_CODE_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, { code: action.code }) },
        { loading: false, error: null }
      )
    case PROFILE_USER_COOKIE2_SUCCESS:
    case PROFILE_USER_COOKIE_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, { cookie: action.data }) },
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
  console.log('-----------signUp', phone, password, certificateNo, name)
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
    console.log('--------signUp---data-----', data)
    if (data.errors) {
      dispatch({
        type: PROFILE_USER_SIGNUP_FAIL,
        error: data.errors[0].message
      })
      return data.errors[0].message
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
  let adminId = await localforage.getItem('adminId')
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
    adminId,
    username,
    password
  })
  return null
}

const doSignin = async (dispatch, { username, password }) => {
  dispatch({
    type: PROFILE_USER_SIGNIN
  })
  const url = `http://${API_SERVER}/admin/login`
  try {
    const data = await axios.post(url, {
      username: username,
      password: password
    })
    console.log('====doSignin', data.data)
    const token = data.data.token
    const adminId = data.data.adminId
    await localforage.setItem('token', token)
    await localforage.setItem('adminId', adminId)
    await localforage.setItem('username', username)
    await localforage.setItem('password', password)
    dispatch({
      type: PROFILE_USER_SIGNIN_SUCCESS,
      token,
      adminId,
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
  // await AsyncStorage.removeItem('adminId')
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
  query($adminId: ObjID!) {
    user(id: $adminId) {
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
export const queryUser = (client, { adminId }) => async dispatch => {
  dispatch({
    type: PROFILE_USER_QUERYUSER
  })
  try {
    const data = await client.query({ query: QUERY_USER, variables: { adminId } })
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

const UPDATE_ADMIN = gql`
  mutation ($adminId: ObjID!, $password: String) {
    updateAdmin(id: $adminId, input: {password: $password}) {
      id
    }
  }
`
// 修改密码
export const updatePassword = (client, {adminId, password}) => async dispatch => {
  dispatch({
    type: PROFILE_USER_UPDATEPASSWORD
  })
  try {
    let data = await client.mutate({
      mutation: UPDATE_ADMIN,
      variables: { adminId, password }
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

const FORGETPASSWORD = gql`
  mutation($phone: String!, $password: String!, $code: String!){
    updatePassword(phone: $phone, input: {verifyCode: $code, newPassword: $password}){
      id
    }
  }
`
export const forgotPassword = (client, {phone, password, code}) => async dispatch => {
  dispatch({
    type: PROFILE_FORGOT_PASSWORD
  })
  try {
    let data = await client.mutate({
      mutation: FORGETPASSWORD,
      variables: { phone, password, code }
    })
    if (data.errors) {
      dispatch({
        type: CHECK_VERIFY_CODE_FAIL,
        error: data.errors[0].message
      })
      return data.error[0].message
    }
    dispatch({
      type: PROFILE_FORGOT_PASSWORD_SUCCESS,
      data: data.data.updatePassword
    })
    return null
  } catch (e) {
    dispatch({
      type: PROFILE_FORGOT_PASSWORD_FAIL,
      error: e.message
    })
    return e.message
  }
}
