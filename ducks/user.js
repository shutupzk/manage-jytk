import gql from 'graphql-tag'
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
const PROFILE_USER_CREATEHASDOCTOR = 'profile/user/createhasdoctor'
const PROFILE_USER_CREATEHASDOCTOR_SUCCESS = 'profile/user/createhasdoctor/success'
const PROFILE_USER_CREATEHASDOCTOR_FAIL = 'profile/user/createhasdoctor/fail'
const PROFILE_USER_REMOVEHASDOCTOR = 'profile/user/removehasdoctor'
const PROFILE_USER_REMOVEHASDOCTOR_SUCCESS = 'profile/user/removehasdoctor/success'
const PROFILE_USER_REMOVEHASDOCTOR_FAIL = 'profile/user/removehasdoctor/fail'
const PROFILE_USER_QUERYHASDOCTORS = 'profile/user/queryhasdoctors'
const PROFILE_USER_QUERYHASDOCTORS_SUCCESS = 'profile/user/queryhasdoctors/success'
const PROFILE_USER_QUERYHASDOCTORS_FAIL = 'profile/user/queryhasdoctors/fail'
const CREATE_VERIFY_CODE = 'create/verify/code'
const CREATE_VERIFY_CODE_SUCCESS = 'create/verify/code/success'
const CREATE_VERIFY_CODE_FAIL = 'create/verify/code/fail'
const initState = {
  data: {
    token: null,
    id: null
  },
  hasDoctors: {},
  loading: false,
  error: null
}

// reducer
export function user (state = initState, action = {}) {
  switch (action.type) {
    case PROFILE_USER_SIGNUP:
    case PROFILE_USER_SIGNIN:
    case PROFILE_USER_SIGNOUT:
    case PROFILE_USER_QUERYUSER:
    case PROFILE_USER_CREATEHASDOCTOR:
    case PROFILE_USER_REMOVEHASDOCTOR:
    case PROFILE_USER_QUERYHASDOCTORS:
    case PROFILE_USER_UPDATEPASSWORD:
    case CREATE_VERIFY_CODE:
      return Object.assign({}, state, { loading: true, error: null })
    case PROFILE_USER_SIGNUP_FAIL:
    case PROFILE_USER_SIGNIN_FAIL:
    case PROFILE_USER_SIGNOUT_FAIL:
    case PROFILE_USER_QUERYUSER_FAIL:
    case PROFILE_USER_CREATEHASDOCTOR_FAIL:
    case PROFILE_USER_REMOVEHASDOCTOR_FAIL:
    case PROFILE_USER_QUERYHASDOCTORS_FAIL:
    case PROFILE_USER_UPDATEPASSWORD_FAIL:
    case CREATE_VERIFY_CODE_FAIL:
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
    case CREATE_VERIFY_CODE_SUCCESS:
      return Object.assign(
        {},
        state,
        { loading: false, error: null }
      )
    case PROFILE_USER_SIGNOUT_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: { token: null, id: null } },
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
    case PROFILE_USER_CREATEHASDOCTOR_SUCCESS:
      return Object.assign(
        {},
        state,
        { hasDoctors: Object.assign({}, state.hasDoctors, action.hasDoctors) },
        { loading: false, error: null }
      )
    case PROFILE_USER_REMOVEHASDOCTOR_SUCCESS:
      let newData = Object.assign({}, state.hasDoctors)
      delete newData[action.removeId]
      return Object.assign(
        {},
        state,
        { hasDoctors: newData },
        { loading: false, error: null }
      )
    case PROFILE_USER_QUERYHASDOCTORS_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: Object.assign({}, state.data, { hasDoctors: action.hasDoctors }) },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// 注册
const SIGNUP = gql`
  mutation($phone: String!,$password: String!, $sex: String!, $name: String! ){
    signUp(input:{phone: $phone,password:$password,sex: $sex,name: $name}){
      id
    }
  }
`
export const signup = (client, { phone, password, sex, name }, callback) => async dispatch => {
  dispatch({
    type: PROFILE_USER_SIGNUP
  })
  try {
    const data = await client.mutate({
      mutation: SIGNUP,
      variables: {
        phone,
        password,
        sex,
        name
      }
    })
    if (data.error) {
      dispatch({
        type: PROFILE_USER_SIGNUP_FAIL,
        error: data.error.message
      })
      return data.data.error
    }
    console.log('注册成功了', data)
    dispatch({
      type: PROFILE_USER_SIGNUP_SUCCESS
    })
    return null
  } catch (e) {
    console.log('注册失败了', e)
    dispatch({
      type: PROFILE_USER_SIGNUP_FAIL,
      error: e.message
    })
    return (e.message).replace('GraphQL error:', '')
  }
}

// 登录
export const signin = ({ username, password }) => async (dispatch) => {
  try {
    if (!username) return { error: '请输入手机号' }
    if (username && password) {
      if (!password) return { error: '请输入密码' }
      return doSignin(dispatch, { username, password })
    }
  } catch (e) {
    console.log(e)
    return { error: (e.message).replace('GraphQL error:', '') }
  }
}

const doSignin = async (dispatch, { username, password }) => {
  const url = `http://${API_SERVER}/login`
  console.log('登录接口', url)
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    let data = await response.json()
    let { token, userId } = data
    console.log('登录了', data)
    dispatch({
      type: PROFILE_USER_SIGNIN_SUCCESS,
      token,
      userId,
      username,
      password
    })
    return {userId}
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_USER_SIGNIN_FAIL,
      error: e.message
    })
    return {error: (e.message).replace('GraphQL error:', '')}
  }
}

// 登出
export const signout = () => async dispatch => {
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
  mutation ($phone: String!, $password: String, $newPassword: String, $verifyCode: String) {
    updatePassword(phone: $phone, input: {password: $password, newPassword: $newPassword, verifyCode: $verifyCode}) {
      id
    }
  }
`

// 修改密码
export const updatePassword = (client, { phone, password, newPassword, verifyCode }) => async dispatch => {
  try {
    let data = await client.mutate({
      mutation: UPDATE_USER,
      variables: { phone, password, newPassword, verifyCode }
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
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: PROFILE_USER_UPDATEPASSWORD_FAIL,
      error: e.message
    })
    return (e.message).replace('GraphQL error:', '')
  }
}

const CREATE_VERIFYCODE = gql`
  mutation ($phone: String!) {
    createVerifyCode(input: {phone: $phone}) {
      id
      verifyCode
    }
  }
`
// 发送验证码
export const createVerifyCode = (client, {phone}) => async dispatch => {
  try {
    await client.mutate({
      mutation: CREATE_VERIFYCODE,
      variables: { phone }
    })
  } catch (e) {
    console.log(e)
    return (e.message).replace('GraphQL error:', '')
  }
}

const CHECK_VERIFYCODE = gql`
  mutation ($phone: String!, $code: String!) {
    checkVerifyCode(input: {phone: $phone, code: $code}) {
      id
    }
  }
`
// 验证码校验
export const checkVerifyCode = (client, { phone, code }) => async dispatch => {
  try {
    let data = await client.mutate({
      mutation: CHECK_VERIFYCODE,
      variables: { phone, code }
    })
    if (data.error) {
      dispatch({
        type: CREATE_VERIFY_CODE_FAIL,
        error: data.error.message
      })
      return data.error.error
    }
    return null
  } catch (e) {
    console.log(e)
    return (e.message).replace('GraphQL error:', '')
  }
}

export const savePhone = ({ phone, password }) => dispatch => {
  dispatch({
    type: PROFILE_USER_SAVEPHONE,
    phone,
    password
  })
}
