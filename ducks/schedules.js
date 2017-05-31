import gql from 'graphql-tag'

const APPOINTMENT_SCHEDULES_QUERY = 'appointment/schedules/query'
const APPOINTMENT_SCHEDULES_SUCCESS = 'appointment/schedules/success'
const APPOINTMENT_SCHEDULES_FAIL = 'appointment/schedules/fail'
const APPOINTMENT_SCHEDULES_QUERYDETAIL = 'appointment/schedules/querydetail'
const APPOINTMENT_SCHEDULES_QUERYDETAIL_SUCCESS = 'appointment/schedules/querydetail/success'
const APPOINTMENT_SCHEDULES_QUERYDETAIL_FAIL = 'appointment/schedules/querydetail/fail'
const APPOINTMENT_SCHEDULES_SELECT = 'appointment/schedules/select'

const initState = {
  data: {},
  loading: false,
  error: null,
  selectId: null
}

// reducer
export function schedules (state = initState, action = {}) {
  switch (action.type) {
    case APPOINTMENT_SCHEDULES_QUERY:
    case APPOINTMENT_SCHEDULES_QUERYDETAIL:
      return Object.assign({}, state, { loading: true, error: null })
    case APPOINTMENT_SCHEDULES_SUCCESS:
    case APPOINTMENT_SCHEDULES_QUERYDETAIL_SUCCESS:
      return Object.assign({}, state, { data: Object.assign({}, state.data, action.schedules), loading: false, error: null })
    case APPOINTMENT_SCHEDULES_FAIL:
    case APPOINTMENT_SCHEDULES_QUERYDETAIL_FAIL:
      return Object.assign({}, state, { loading: false, error: action.error })
    case APPOINTMENT_SCHEDULES_SELECT:
      return Object.assign({}, state, {selectId: action.scheduleId})
    default:
      return state
  }
}

const QUERY_SCHEDULES = gql`
  query ($departmentId: ObjID!, $doctorId: ObjID!) {
    doctor(id: $doctorId) {
      id
      visitSchedules(departmentId: $departmentId) {
        id
        visitDate
        amPm
        registerFee
        status
        leftNum
        totalNum
        department {
          id
          deptName
        }
        doctor {
          id
          doctorName
        }
      }
    }
  }
`
const QUERY_SCHEDULES2 = gql`
  query ($departmentId: ObjID!) {
    department(id: $departmentId) {
      id
      doctors {
        id
        visitSchedules(departmentId: $departmentId) {
          id
          visitDate
          amPm
          registerFee
          status
          leftNum
          totalNum
          visitScheduleTimes {
            id
            beginTime
            endTime
            leftNum
            totalNum
            status
          }
          department {
            id
            deptName
          }
          doctor {
            id
            doctorName
          }
        }
      }
    }
  }
`

var schedulesEg = [
  {
    'id': '58eb7af0c77c0857c9dc5b16',
    'visitDate': '2017-05-30',
    'amPm': 'a',
    'registerFee': '20',
    'status': true,
    'leftNum': 25,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '8:00',
      'endTime': '9:00',
      'leftNum': 12,
      'totalNum': 20
    },
    {
      'beginTime': '9:00',
      'endTime': '10:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '10:00',
      'endTime': '11:00',
      'leftNum': 10,
      'totalNum': 20
    },
    {
      'beginTime': '11:00',
      'endTime': '12:00',
      'leftNum': 8,
      'totalNum': 10
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  },
  {
    'id': '58eb7afec77c0857c9dc5b17',
    'visitDate': '2017-05-30',
    'amPm': 'p',
    'registerFee': '80',
    'status': true,
    'leftNum': 0,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '13:00',
      'endTime': '14:00',
      'leftNum': 12,
      'totalNum': 20
    },
    {
      'beginTime': '14:00',
      'endTime': '15:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '15:00',
      'endTime': '16:00',
      'leftNum': 11,
      'totalNum': 20
    },
    {
      'beginTime': '16:00',
      'endTime': '17:00',
      'leftNum': 6,
      'totalNum': 10
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  },
  {
    'id': '58eb7b13c77c0857c9dc5b18',
    'visitDate': '2017-05-28',
    'amPm': 'a',
    'registerFee': '90',
    'status': true,
    'leftNum': 12,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '8:00',
      'endTime': '9:00',
      'leftNum': 12,
      'totalNum': 20
    },
    {
      'beginTime': '9:00',
      'endTime': '10:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '10:00',
      'endTime': '11:00',
      'leftNum': 10,
      'totalNum': 20
    },
    {
      'beginTime': '11:00',
      'endTime': '12:00',
      'leftNum': 8,
      'totalNum': 10
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  },
  {
    'id': '58eb7b1ac77c0857c9dc5b19',
    'visitDate': '2017-05-28',
    'amPm': 'p',
    'registerFee': '120',
    'status': true,
    'leftNum': 45,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '13:00',
      'endTime': '14:00',
      'leftNum': 6,
      'totalNum': 20
    },
    {
      'beginTime': '14:00',
      'endTime': '15:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '15:00',
      'endTime': '16:00',
      'leftNum': 0,
      'totalNum': 20
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  },
  {
    'id': '58eb7b20c77c0857c9dc5b1a',
    'visitDate': '2017-05-27',
    'amPm': 'a',
    'registerFee': '100',
    'status': true,
    'leftNum': 8,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '8:00',
      'endTime': '9:00',
      'leftNum': 12,
      'totalNum': 20
    },
    {
      'beginTime': '9:00',
      'endTime': '10:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '10:00',
      'endTime': '11:00',
      'leftNum': 10,
      'totalNum': 20
    },
    {
      'beginTime': '11:00',
      'endTime': '12:00',
      'leftNum': 8,
      'totalNum': 10
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  },
  {
    'id': '58eb7b26c77c0857c9dc5b1b',
    'visitDate': '2017-05-27',
    'amPm': 'p',
    'registerFee': '20',
    'status': true,
    'leftNum': 25,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '13:00',
      'endTime': '14:00',
      'leftNum': 12,
      'totalNum': 20
    },
    {
      'beginTime': '14:00',
      'endTime': '15:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '15:00',
      'endTime': '16:00',
      'leftNum': 10,
      'totalNum': 20
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  },
  {
    'id': '58eb7b2bc77c0857c9dc5b1c',
    'visitDate': '2017-05-29',
    'amPm': 'a',
    'registerFee': '10',
    'status': true,
    'leftNum': 35,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '8:00',
      'endTime': '9:00',
      'leftNum': 12,
      'totalNum': 20
    },
    {
      'beginTime': '9:00',
      'endTime': '10:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '10:00',
      'endTime': '11:00',
      'leftNum': 10,
      'totalNum': 20
    },
    {
      'beginTime': '11:00',
      'endTime': '12:00',
      'leftNum': 8,
      'totalNum': 10
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  },
  {
    'id': '58eb7b2fc77c0857c9dc5b1d',
    'visitDate': '2017-05-29',
    'amPm': 'p',
    'registerFee': '20',
    'status': true,
    'leftNum': 40,
    'totalNum': 50,
    'visitScheduleTimes': [{
      'beginTime': '13:00',
      'endTime': '14:00',
      'leftNum': 12,
      'totalNum': 20
    },
    {
      'beginTime': '14:00',
      'endTime': '15:00',
      'leftNum': 4,
      'totalNum': 20
    },
    {
      'beginTime': '15:00',
      'endTime': '16:00',
      'leftNum': 10,
      'totalNum': 20
    },
    {
      'beginTime': '16:00',
      'endTime': '17:00',
      'leftNum': 8,
      'totalNum': 10
    }
    ],
    'department': {
      'id': '58eb4fb7c77c0857c9dc5b0d',
      'deptName': '妇科'
    },
    'doctor': {
      'id': '58eb4f24c77c0857c9dc5b0a',
      'doctorName': '王慧华'
    }
  }
]
// 获取医生排版
export const querySchedules2 = (client, { departmentId, doctorId }) => async dispatch => {
  dispatch({
    type: APPOINTMENT_SCHEDULES_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_SCHEDULES, variables: { departmentId, doctorId } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_SCHEDULES_FAIL,
        error: data.error.message
      })
    }
    const doctor = data.data.doctor
    const visitSchedules = doctor.visitSchedules
    // const visitSchedules = schedulesEg
    let schedules = {}
    for (let schedule of visitSchedules) {
      schedules[schedule.id] = Object.assign({}, schedule, { departmentId, doctorId })
    }
    dispatch({
      type: APPOINTMENT_SCHEDULES_SUCCESS,
      schedules
    })
    return visitSchedules
  } catch (e) {
    console.log(e)
    return dispatch({
      type: APPOINTMENT_SCHEDULES_FAIL,
      error: e.message
    })
  }
}

// 获取医生排版
export const querySchedules = (client, { departmentId }) => async dispatch => {
  dispatch({
    type: APPOINTMENT_SCHEDULES_QUERY
  })
  try {
    let data = await client.query({ query: QUERY_SCHEDULES2, variables: { departmentId } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_SCHEDULES_FAIL,
        error: data.error.message
      })
    }
    let schedules = {}
    const doctors = data.data.department.doctors
    for (let doctor of doctors) {
      const visitSchedules = schedulesEg // doctor.visitSchedules
      for (let schedule of visitSchedules) {
        schedules[schedule.id] = Object.assign({}, schedule, { departmentId, doctorId: doctor.id })
        // if (new Date(schedule.visitDate) > new Date()) {
        //   schedules[schedule.id] = Object.assign({}, schedule, { departmentId, doctorId: doctor.id })
        // }
      }
    }
    return dispatch({
      type: APPOINTMENT_SCHEDULES_SUCCESS,
      schedules
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: APPOINTMENT_SCHEDULES_FAIL,
      error: e.message
    })
  }
}

const QUERY_SCHEDULE_DETAIL = gql`
  query ($scheduleId: ObjID!) {
    visitSchedule(id: $scheduleId) {
      id
      visitDate
      amPm
      totalNum
      leftNum
      registerFee
      clinicCode
      clinicType
      department {
        id
        deptName
      }
      doctor {
        id
        doctorName
      }
    }
  }
`

// 获取排版详情
export const queryScheduleDetail = (client, { doctorId }) => async dispatch => {
  dispatch({
    type: APPOINTMENT_SCHEDULES_QUERYDETAIL
  })
  try {
    let data = await client.query({ query: QUERY_SCHEDULE_DETAIL, variables: { doctorId } })
    if (data.error) {
      return dispatch({
        type: APPOINTMENT_SCHEDULES_QUERYDETAIL_FAIL,
        error: data.error.message
      })
    }
    let schedule = data.data.visitSchedule
    let schedules = {}
    schedules[schedule.id] = schedule
    dispatch({
      type: APPOINTMENT_SCHEDULES_QUERYDETAIL_SUCCESS,
      schedules
    })
  } catch (e) {
    console.log(e)
    return dispatch({
      type: APPOINTMENT_SCHEDULES_QUERYDETAIL_FAIL,
      error: e.message
    })
  }
}

export const selectSchedule = (scheduleId) => dispatch => {
  dispatch({
    type: APPOINTMENT_SCHEDULES_SELECT,
    scheduleId
  })
}
