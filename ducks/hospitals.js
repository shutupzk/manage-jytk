import gql from 'graphql-tag'
import { REHYDRATE } from 'redux-persist/constants'

const HOSPITAL_HOSPITALS_QUERY = 'hospital/introductions/query'
const HOSPITAL_HOSPITALS_SUCCESS = 'hospital/introductions/success'
const HOSPITAL_HOSPITALS_FAIL = 'hospital/introductions/fail'

const initState = {
  data: {},
  loading: false,
  error: null
}

export function hospitals (state = initState, action = {}) {
  switch (action.type) {
    case REHYDRATE:
      console.log('----REHYDRATE----', 'REHYDRATE_HOSPITALS')
      return Object.assign({}, state, action.payload.hospitals, { loading: false, error: null })
    case HOSPITAL_HOSPITALS_QUERY:
      return Object.assign({}, state, { loading: true })
    case HOSPITAL_HOSPITALS_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case HOSPITAL_HOSPITALS_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    default:
      return state
  }
}

// const QUERYHOSPITALS = gql`
//   query {
//     hospitals {
//       id
//       hospitalCode
//       hospitalName
//       phone
//       logo
//       image
//       description
//       website
//     }
//   }
// `

export const queryHospitals = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_HOSPITALS_QUERY
  })
  return dispatch({
    type: HOSPITAL_HOSPITALS_SUCCESS,
    data: {
      'hospital1': {
        id: 'hospital1',
        hospitalCode: 'h01',
        hospitalName: '海淀医院',
        phone: '010-9870987',
        logo: '',
        image: '',
        description: '包治百病',
        website: 'https//www.haidianhospital.com'
      },
      'hospital2': {
        id: 'hospital2',
        hospitalCode: 'h02',
        hospitalName: '北大附属医院',
        phone: '010-45678222',
        logo: '',
        image: '',
        description: '药到病除',
        website: 'https//www.beijinghospital.com'
      }
    }
  })
}
// export const queryHospitals = (client) => async dispatch => {
//   dispatch({
//     type: HOSPITAL_HOSPITALS_QUERY
//   })
//   try {
//     let data = await client.query({ query: QUERYHOSPITALS })
//     if (data.error) {
//       return dispatch({
//         type: HOSPITAL_HOSPITALS_FAIL,
//         error: data.error.message
//       })
//     }
//     let hospitals = data.data.hospitals
//     let json = {}
//     for (let hospital of hospitals) {
//       json[hospital.id] = hospital
//     }
//     return dispatch({
//       type: HOSPITAL_HOSPITALS_SUCCESS,
//       data: json
//     })
//   } catch (e) {
//     console.log(e)
//     return dispatch({
//       type: HOSPITAL_HOSPITALS_FAIL,
//       error: '数据请求失败！'
//     })
//   }
// }