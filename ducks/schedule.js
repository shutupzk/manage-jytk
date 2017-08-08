import localforage from 'localforage'
import gql from 'graphql-tag'

const SCHEDULE_QUERY_SCEDULES = 'schedule/queryschedule'
const SCHEDULE_QUERY_SCEDULES_SUCCESS = 'schedule/queryschedule/success'
const SCHEDULE_QUERY_SCEDULES_FAIL = 'schedule/queryschedule/fail'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function schedule (state = initState, action = {}) {
  // console.log('action', action)
  switch (action.type) {
    case SCHEDULE_QUERY_SCEDULES:
      return Object.assign({}, state, { loading: true, error: null })
    case SCHEDULE_QUERY_SCEDULES_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
		case SCHEDULE_QUERY_SCEDULES_SUCCESS:
      return Object.assign(
        {},
        state,
        { data: action.schedules },
        { loading: false, error: null }
      )
    default:
      return state
  }
}

// schedules list
const QUERY_SCHEDULES = gql`
  query($skip: Int, $limit: Int) {
		doctors(limit: $limit, skip: $skip) {
			id
			doctorSn
			doctorName
			avatar
			remark
			title
			major
			description
			remark
			recommend
      hot
      quikeOpen
      videoOpen
      imageAndTextOpen
			phone
      evaluate
      quikePrice
			imageAndTextPrice
			videoPrice
			serviceTotal
			workingYears
			favorableRate
			departmentHasDoctors{
				department{
					childs {
						id
						deptName
					}
					deptName
					hospital{
						hospitalName
					}
				}
			}
    }
	}
`

export const querySchedules = (client, {limit, skip}) => async dispatch => {
  dispatch({
    type: SCHEDULE_QUERY_SCEDULES
  })
  try {
		const data = await client.query({ query: QUERY_SCHEDULES, variables: { limit, skip }, fetchPolicy: 'network-only'})
    if (data.error) {
      dispatch({
        type: SCHEDULE_QUERY_SCEDULES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: SCHEDULE_QUERY_SCEDULES_SUCCESS,
      schedules: data.data.doctors
    })
    return null
  } catch (e) {
    console.log(e)
    dispatch({
      type: SCHEDULE_QUERY_SCEDULES_FAIL,
      error: e.message
    })
    return e.message
  }
}
