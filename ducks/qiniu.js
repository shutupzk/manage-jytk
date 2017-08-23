import gql from 'graphql-tag'
import axios from 'axios'
import {API_SERVER} from 'config'

const QUERY_QINIU_UPTOKEN = 'qiniu/uptoken/get'
const QUERY_QINIU_UPTOKEN_SUCCESS = 'qiniu/uptoken/get/success'
const QUERY_QINIU_UPTOKEN_FAIL = 'qiniu/uptoken/get/fail'

const SELECT_IMG_FILES = 'qiniu/selectimgfiles'

const CHANGE_IMG_BASE64 = 'qiniu/changeimgbase64'

const initState = {
  data: {},
  loading: false,
  error: null,
}

export const qiniu = (state = initState, action) => {
  switch (action.type) {
    case QUERY_QINIU_UPTOKEN:
      return Object.assign({}, state, { loading: true, error: null })
    case QUERY_QINIU_UPTOKEN_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case QUERY_QINIU_UPTOKEN_SUCCESS:
      return Object.assign({}, state, Object.assign({}, state.data, {upTokens: action.data}))
    case SELECT_IMG_FILES:
      return Object.assign({}, state, Object.assign({}, state.data, {imageFiles: action.data}))
    case CHANGE_IMG_BASE64:
      return Object.assign({}, state, Object.assign({}, state.data, {imgBase64: action.data}))
    default :
      return state
  }
}

export const getQiniuUpToken = ({key}) => async (dispatch) => {
  dispatch({
    type: QUERY_QINIU_UPTOKEN
  })
	// const url = 'http://api.bysy.uthealth.com.cn/qiniu/fileUploadToken'
	const url = `http://${API_SERVER}/qiniu/fileUploadToken`
  try {
    const data = await axios.post(url, {key})
    if (data.status !== 200) {
      dispatch({
        type: QUERY_QINIU_UPTOKEN_FAIL,
        error: '获取失败'
      })
    }
    if (data.data.msg) {
      dispatch({
        type: QUERY_QINIU_UPTOKEN_FAIL,
        error: data.data.msg
      })
    }
    let json = {}
    json[key] = data.data.token
    dispatch({
      type: QUERY_QINIU_UPTOKEN_SUCCESS,
      data: json
    })
    return null
  } catch (e) {
    dispatch({
      type: QUERY_QINIU_UPTOKEN_FAIL,
      error: e.message
    })
    return e.message
  }
}

export const selectImgFiles = ({imageFiles}) => async dispatch => {
	dispatch({
		type: SELECT_IMG_FILES,
		data: imageFiles
	})
}

export const changeImgBase64 = ({imgBase64}) => async dispatch => {
	dispatch({
		type: CHANGE_IMG_BASE64,
		data: imgBase64
  })
  return null
}
