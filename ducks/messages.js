import { gql } from 'react-apollo'
import localforage from 'localforage'
import _ from 'lodash'

const HOME_MESSAGE_TYPES_QUERY = 'home/messageTypes/query'
const HOME_MESSAGE_TYPES_SUCCESS = 'home/messageTypes/success'
const HOME_MESSAGE_TYPES_FAIL = 'home/messageTypes/fail'

const HOME_MESSAGE_TYPES_SELECT = 'home/messageTypes/select'

const HOME_MESSAGES_QUERY = 'home/messages/query'
const HOME_MESSAGES_SUCCESS = 'home/messages/success'
const HOME_MESSAGES_FAIL = 'home/messages/fail'

const HOME_MESSAGES_READ = 'home/messages/read'
const HOME_MESSAGES_READ_SUCCESS = 'home/messages/read/success'
const HOME_MESSAGES_READ_FAIL = 'home/messages/read/fail'

const initState = {
  data: [],
  error: null,
  loading: false,
  selectId: {}
}

// reducer
export function messages (state = initState, action = {}) {
  switch (action.type) {
    case HOME_MESSAGE_TYPES_QUERY:
    case HOME_MESSAGES_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case HOME_MESSAGE_TYPES_SUCCESS:
    case HOME_MESSAGES_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case HOME_MESSAGE_TYPES_FAIL:
    case HOME_MESSAGES_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOME_MESSAGE_TYPES_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: action.error })
    default:
      return state
  }
}

const QUREY_MESSAGE_TYPES = gql`
  query {
    messageTypes{
      id
      name
      code
      description
      message{
        id
        content
        read
        createdAt
        user{
          id
          name
        }
      }
    }
  }
`

export const queryMessageTypes = (client) => async dispatch => {
  dispatch({
    type: HOME_MESSAGE_TYPES_QUERY
  })
  try {
    const userId = await localforage.getItem('userId')
    console.log(userId)
    let data = await client.query({ query: QUREY_MESSAGE_TYPES })
    if (data.errors) {
      return dispatch({
        type: HOME_MESSAGE_TYPES_FAIL,
        error: data.errors[0].message
      })
    }
    let messageTypes = data.data.messageTypes
    let json = {}
    let newList = []
    for (let type of messageTypes) {
      let messages = []
      let read = true
      for (let message of type.message) {
        if (message.user.id === userId) {
          if (!message.read) {
            read = false
          }
          messages.push(message)
        }
      }
      const messageTime = messages[0].createdAt
      type = Object.assign({}, type, {read, messageTime, messages: messages})
      delete type.message
      newList.push(type)
      // json[type.id] = type
    }
    newList.sort(function (a, b) {
      return b.messageTime - a.messageTime
    })
    for (let msg of newList) {
      json[msg.id] = msg
    }
    dispatch({
      type: HOME_MESSAGE_TYPES_SUCCESS,
      data: json
    })
    return
  } catch (e) {
    console.log(e)
    dispatch({
      type: HOME_MESSAGE_TYPES_FAIL,
      error: '数据请求错误'
    })
  }
}

const QUERY_MESSAGE_LIST = gql`
  query ($id: ObjID!) {
    messageType(id: $id) {
      id
      name
      code
      description
      message {
        id
        content
        read
        createdAt
        appointment{
          id
        }
        evaluate{
          id
        }
        user{
          id
          name
        }
      }
    }
  }
`
// 查询消息列表
export const queryMessages = (client, {typeId}) => async dispatch => {
  dispatch({
    type: HOME_MESSAGES_QUERY
  })
  try {
    const userId = await localforage.getItem('userId')
    let data = await client.query({ query: QUERY_MESSAGE_LIST, variables: {id: typeId} })
    if (data.errors) {
      return dispatch({
        type: HOME_MESSAGES_FAIL,
        error: data.errors[0].message
      })
    }
    let messageType = data.data.messageType
    let json = {}
    let messages = []
    let read = true
    let messageTime = ''
    for (let message of messageType.message) {
      if (message.user.id === userId) {
        messageTime = message.createdAt
        if (!message.read) {
          read = false
        }
        messages.push(message)
      }
    }
    messageType = Object.assign({}, messageType, {read, messageTime, messages: messages})
    delete messageType.message
    json[messageType.id] = messageType
    return dispatch({
      type: HOME_MESSAGES_SUCCESS,
      data: json
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: HOME_MESSAGES_FAIL,
      error: '数据请求失败！'
    })
  }
}

// 选择消息类型
export const selectMessageType = ({typeId}) => dispatch => {
  return dispatch({
    type: HOME_MESSAGE_TYPES_SELECT,
    selectId: typeId
  })
}

const HOME_LAST_MESSAGES_QUERY = 'home/last/messages/query'
const HOME_LAST_MESSAGE_SUCCESS = 'home/last/messages/success'
const HOME_LAST_MESSAGES_FAIL = 'home/last/messages/fail'

// reducer
export function lastMessages (state = initState, action = {}) {
  switch (action.type) {
    case HOME_LAST_MESSAGES_QUERY:
      return Object.assign({}, state, { loading: true, error: null, data: [] })
    case HOME_LAST_MESSAGE_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case HOME_LAST_MESSAGES_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case HOME_MESSAGE_TYPES_SELECT:
      return Object.assign({}, state, { selectId: action.selectId, loading: false, error: action.error })
    default:
      return state
  }
}
const QUERY_LAST_MESSAGES = gql`
  query($id: ObjID!, $limit: Int){
    user(id: $id){
      id
      name
      messages(limit: $limit){
        id
        content
        read
        createdAt
        appointment{
          id
        }
        evaluate{
          id
        }
        messageType{
          id
          name
          code
        }
      }
    }
  }
`
export const queryLastMessage = (client, {limit}) => async dispatch => {
  dispatch({
    type: HOME_LAST_MESSAGES_QUERY
  })
  try {
    const userId = await localforage.getItem('userId')
    if (!limit) limit = 0
    let data = await client.query({ query: QUERY_LAST_MESSAGES, variables: {id: userId, limit} })
    if (data.errors) {
      return dispatch({
        type: HOME_MESSAGES_FAIL,
        error: data.errors[0].message
      })
    }
    if (!data.data.user) {
      return dispatch({
        type: HOME_LAST_MESSAGES_FAIL,
        error: '请登陆'
      })
    }
    const newMessage = []
    const messages = data.data.user ? data.data.user.messages : []
    for (let message of messages) {
      message = Object.assign({}, message, {messageTypeId: message.messageType.id})
      newMessage.push(message)
    }
    return dispatch({
      type: HOME_LAST_MESSAGE_SUCCESS,
      data: newMessage
    })
  } catch (e) {
    return dispatch({
      type: HOME_LAST_MESSAGES_FAIL,
      error: '获取失败'
    })
  }
}

export const readMessage = (client, {typeId}) => async dispatch => {
  dispatch({
    type: HOME_MESSAGES_READ
  })
  try {
    return dispatch({
      type: HOME_MESSAGES_READ_SUCCESS,
      data: ''
    })
  } catch (e) {
    return dispatch({
      type: HOME_MESSAGES_READ_FAIL,
      error: '修改失败'
    })
  }
}
