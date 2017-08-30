import gql from 'graphql-tag'
import { tableTh, apTh } from '../modules/doctor/config'
import { isArray } from 'utils'

const SCHEDULE_QUERY_SCEDULES = 'schedule/queryschedule'
const SCHEDULE_QUERY_SCEDULES_SUCCESS = 'schedule/queryschedule/success'
const SCHEDULE_QUERY_SCEDULES_FAIL = 'schedule/queryschedule/fail'

const UPSERT_QUICK_SCHEDULE_SUCCESS = 'schedule/upsert/quickschedule/success'

const SELECT_QUICK_SCHEDULE = 'select/quick/schedule'

const initState = {
  data: {},
  loading: false,
  error: null
}

// reducer
export function schedule (state = initState, action = {}) {
  switch (action.type) {
    case SCHEDULE_QUERY_SCEDULES:
      return Object.assign({}, state, { loading: true, error: null })
    case SCHEDULE_QUERY_SCEDULES_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case SCHEDULE_QUERY_SCEDULES_SUCCESS:
      return Object.assign(
        {},
        state,
        {
          data: Object.assign({}, state.data, { fastSchedules: action.fastSchedules })
        },
        { loading: false, error: null }
      )
    case UPSERT_QUICK_SCHEDULE_SUCCESS:
      return Object.assign({}, state, { data: action.schedule }, { loading: false, error: null })
    case SELECT_QUICK_SCHEDULE:
      return Object.assign({}, state, Object.assign({}, state.data, { selectedFastSchedules: action.data }))
    default:
      return state
  }
}

// doctor list
const QUERY_DOCTOR_SCHEDULES = gql`
  query {
    doctorSchedules(limit: 0) {
      id
      week
      ampm
      channel
      scheduleTypeCode
      doctor {
        id
        doctorName
      }
    }
  }
`

export const queryDoctorSchedules = client => async dispatch => {
  dispatch({
    type: SCHEDULE_QUERY_SCEDULES
  })
  try {
    const data = await client.query({ query: QUERY_DOCTOR_SCHEDULES, variables: {}, fetchPolicy: 'network-only' })
    if (data.error) {
      dispatch({
        type: SCHEDULE_QUERY_SCEDULES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    let fastSchedules = {}
    const totalSchedules = data.data.doctorSchedules
    // {
    //   "1a": [
    //     {
    //       "id": "59830f238c01fb201389019a",
    //       "doctorName": "薛梅"
    //     },
    //     {
    //       "id": "59830f238c01fb201389019a",
    //       "doctorName": "薛梅"
    //     }
    //   ]
    // }
    for (let tableItem of tableTh) {
      for (let apThItem of apTh) {
        if (tableItem.value !== 0) {
          for (let key of totalSchedules) {
            if (tableItem.value === key.week && apThItem.value === key.ampm && key.channel && key.scheduleTypeCode === '01') {
              let prev = fastSchedules[tableItem.value + apThItem.value] || []
              prev.push(key.doctor)
              fastSchedules[tableItem.value + apThItem.value] = prev
            }
          }
        }
      }
    }
    dispatch({
      type: SCHEDULE_QUERY_SCEDULES_SUCCESS,
      fastSchedules: fastSchedules
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

// update doctor schedule
const UPSERT_QUICK_SCHEDULE = gql`
  mutation($arraySchedule: [upsertQuickScheduleInput!]) {
    upsertQuickSchedule(input: $arraySchedule)
  }
`

export const upsertQuickSchedule = (client, { arraySchedule }) => async dispatch => {
  console.log('---upsertQuickSchedule', arraySchedule)
  dispatch({
    type: SCHEDULE_QUERY_SCEDULES
  })
  try {
    let data = await client.mutate({
      mutation: UPSERT_QUICK_SCHEDULE,
      variables: { arraySchedule }
    })
    if (data.error) {
      dispatch({
        type: SCHEDULE_QUERY_SCEDULES_FAIL,
        error: data.error.message
      })
      return data.error.message
    }
    dispatch({
      type: UPSERT_QUICK_SCHEDULE_SUCCESS,
      schedule: data.data.upsertQuickSchedule
    })
    return null
  } catch (e) {
    dispatch({
      trype: SCHEDULE_QUERY_SCEDULES_FAIL,
      error: e.message
    })
    return e.message
  }
}

export const selectFastSchedules = ({ schedule, doctorId }) => async dispatch => {
  let newschedules = {}
  if (!schedule || (isArray(schedule) && schedule.length === 0)) {
    for (let tableItem of tableTh) {
      for (let apThItem of apTh) {
        let newschedule = { week: tableItem.value, ampm: apThItem.value, channel: false, doctorId }
        if (tableItem.value !== 0) {
          newschedules[tableItem.value + apThItem.value] = newschedule
        }
      }
    }
  } else if (isArray(schedule)) {
    for (let key in schedule) {
      let scheduleItem = schedule[key]
      let newschedule = { week: scheduleItem.week, ampm: scheduleItem.ampm, channel: scheduleItem.channel, doctorId }
      newschedules[scheduleItem.week + scheduleItem.ampm] = newschedule
    }
  } else {
    newschedules = schedule
  }
  dispatch({
    type: SELECT_QUICK_SCHEDULE,
    data: newschedules
  })
  return null
}
