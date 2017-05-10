import gql from 'graphql-tag'
import { REHYDRATE } from 'redux-persist/constants'

const HOSPITAL_DOCTORS_QUERY = 'hospital/doctors/query'
const HOSPITAL_DOCTORS_SUCCESS = 'hospital/doctors/success'
const HOSPITAL_DOCTORS_FAIL = 'hospital/doctors/fail'

const initState = {
  data: {},
  loading: false,
  error: null
}

export function doctors (state = initState, action = {}) {
  switch (action.type) {
    case REHYDRATE:
      console.log('----REHYDRATE----', 'REHYDRATE_DOCTOR')
      return Object.assign({}, state, action.payload.doctors, { loading: false, error: null })
    case HOSPITAL_DOCTORS_QUERY:
      return Object.assign({}, state, { loading: true })
    case HOSPITAL_DOCTORS_SUCCESS:
      return Object.assign({}, state, { data: action.data, loading: false, error: null })
    case HOSPITAL_DOCTORS_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    default:
      return state
  }
}

// const QUERYDOCTORS = gql`
//   query {
//     departments {
//       id,
//       deptSn,
//       deptName,
//       description,
//       features,
//       position,
//       hot,
//       isAppointment,
//       level,
//       departmentHasDoctors {
//         id,
//         doctor {
//           id,
//           doctorName,
//           title,
//           major,
//           description,
//           remark,
//           recommend,
//           hot,
//           isAppointment
//         }
//       }
//     }
//   }

// `

export const queryDoctors = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_DOCTORS_QUERY
  })
  return dispatch({
    type: HOSPITAL_DOCTORS_SUCCESS,
    data: {
      'dep1': {
        id: 'dep1',
        deptSn: '001',
        deptName: '内科',
        description: '内科',
        features: '',
        position: 'lalal',
        hot: 'yes',
        isAppointment: true,
        level: '2',
        departmentHasDoctors: {
          'doctor1': {
            id: 'doctor1',
            doctorName: '张医生',
            title: '主任医师',
            major: '',
            description: '明天',
            remark: '',
            recommend: '',
            hot: 'yes',
            isAppointment: true
          },
          'doctor2': {
            id: 'doctor2',
            doctorName: '王医生',
            title: '主治医师',
            major: '',
            description: '主治医师',
            remark: '',
            recommend: '',
            hot: 'yes',
            isAppointment: true
          }
        }
      },
      'dep2': {
        id: 'dep2',
        deptSn: '002',
        deptName: '外科',
        description: '外科',
        features: '',
        position: 'haha',
        hot: 'yes',
        isAppointment: true,
        level: '2',
        departmentHasDoctors: {
          'doctor3': {
            id: 'doctor3',
            doctorName: '董医生',
            title: '主治医师',
            major: '',
            description: '名医啊',
            remark: '',
            recommend: '',
            hot: 'no',
            isAppointment: true
          },
          'doctor4': {
            id: 'doctor4',
            doctorName: '李医生',
            title: '副主任医师',
            major: '',
            description: '神医就是我！',
            remark: '',
            recommend: '',
            hot: 'yes',
            isAppointment: false
          }
        }
      }
    }
  })
}


// export const queryDoctors = (client) => async dispatch => {
//   dispatch({
//     type: HOSPITAL_DOCTORS_QUERY
//   })
//   try {
//     let data = await client.query({ query: QUERYDOCTORS })
//     if (data.error) {
//       return dispatch({
//         type: HOSPITAL_DOCTORS_FAIL,
//         error: data.error.message
//       })
//     }
//     let departments = data.data.departments
//     let json = {}
//     for (let department of departments) {
//       json[department.id] = department
//     }
//     return dispatch({
//       type: HOSPITAL_DOCTORS_SUCCESS,
//       doctors: json
//     })
//   } catch (e) {
//     console.log(e)
//     return dispatch({
//       type: HOSPITAL_DOCTORS_FAIL,
//       error: '数据请求失败！'
//     })
//   }
// }
