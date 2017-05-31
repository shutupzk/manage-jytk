import { gql } from 'react-apollo'

const HOSPITAL_CLOSED_QUERY = 'hospital/closed/query'
const HOSPITAL_CLOSED_SUCCESS = 'hospital/closed/success'
const HOSPITAL_CLOSED_FAIL = 'hospital/closed/fail'

const initState = {
  data: {},
  error: null,
  loading: false
}

// reducer
export function clinicStops (state = initState, action = {}) {
  switch (action.type) {
    case HOSPITAL_CLOSED_QUERY:
      return Object.assign({}, state, { loading: true, error: null })
    case HOSPITAL_CLOSED_SUCCESS:
      return Object.assign({}, state, { data: action.closed, loading: false, error: null })
    case HOSPITAL_CLOSED_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    default:
      return state
  }
}

const QUREYCLOSED = gql`
  query {
    clinicStops{
      id
      date
      amPm
      clinicType
      clinicCode
      stopId
      biginDate
      endDate
      reason
      departmentHasDoctors{
        id
        doctor{
          id
          doctorName
          avatar
          major
          title
        }
        department {
          id
          deptName
        }
      }
    }
  }
`

export const queryClinicStops = (client) => async dispatch => {
  dispatch({
    type: HOSPITAL_CLOSED_QUERY
  })
  try {
    let data = await client.query({ query: QUREYCLOSED })
    if (data.error) {
      return dispatch({
        type: HOSPITAL_CLOSED_FAIL,
        error: data.error.message
      })
    }
    console.log('-=-=--=', data)
    let docs = data.data.clinicStops
    // let json = {}
    // for (let doc of docs) {
    //   json[doc.id] = doc
    // }
    dispatch({
      type: HOSPITAL_CLOSED_SUCCESS,
      closed: docs
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: HOSPITAL_CLOSED_FAIL,
      error: '数据请求错误'
    })
  }
}
