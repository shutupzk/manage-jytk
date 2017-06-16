import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import Router from 'next/router'

import DoctorDetail from '../components/doctor_detail'
import { isEmptyObject } from '../../../utils'
import { queryDoctors, selectDoctor, selectDepartment, removeSelectDoctor, querySchedules, selectSchedule } from '../../../ducks'

const filterDepartments = (departmentIds, departmentId) => {
  let ids = departmentIds.filter((id) => {
    if (departmentId === id) {
      return true
    }
    return false
  })
  if (ids.length > 0) {
    return true
  }
}

const filterSchedules = (schedules, doctor, departmentId, selectedDate) => {
  for (let key in schedules) {
    if (schedules[key].doctorId === doctor.id && schedules[key].departmentId === departmentId) {
      if (selectedDate && selectedDate !== '') {
        if (schedules[key].visitDate === selectedDate) {
          return true
        }
      } else {
        return true
      }
    }
  }
  return false
}

const isExistDepartment = (doctors, departmentId) => {
  let selectDoctors = []
  for (let key in doctors) {
    if (filterDepartments(doctors[key].departmentIds, departmentId)) {
      selectDoctors.push(doctors[key])
    }
  }
  return selectDoctors
}

const isExistSchedule = (doctors, departmentId, schedules, selectedDate) => {
  let selectDoctors = []
  for (let key in doctors) {
    if (filterSchedules(schedules, doctors[key], departmentId, selectedDate)) {
      selectDoctors.push(doctors[key])
    }
  }
  return selectDoctors
}

class AppointmentDoctorListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {toDetail: false, isDateTab: false, selectedDate: '', firstDate: moment().format('YYYY-MM-DD')}
  }
  componentWillMount () {
    let doctors = this.props.doctors
    let departmentId = this.props.departmentId
    if (!departmentId) {
      this.props.selectDepartment({departmentId: this.props.url.query.departmentId})
    }
    let schedules = this.props.schedules
    let selectDoctors = isExistDepartment(doctors, departmentId, schedules)
    if (isEmptyObject(doctors) || selectDoctors.length === 0) {
      this.queryData()
    } else {
      this.props.selectDoctor({doctorId: selectDoctors[0].id})
    }
  }

  // async queryData () {
  //   let { client, doctors, departmentId, queryDoctors, selectDoctor, querySchedules } = this.props
  //   this.setState({toDetail: true})
  //   await queryDoctors(client, {departmentId})
  //   if (!isEmptyObject(doctors)) {
  //     let selectDoctors = isExistDepartment(doctors, departmentId)
  //     await selectDoctor({ doctorId: selectDoctors[0] ? selectDoctors[0].id : null })
  //     if (selectDoctors[0]) {
  //       await querySchedules(client, { departmentId, doctorId: selectDoctors[0].id })
  //     }
  //   }
  //   this.setState({toDetail: false})
  // }

  async queryData () {
    let { client, doctors, departmentId, queryDoctors, selectDoctor, querySchedules, schedules } = this.props
    this.setState({toDetail: true})
    await queryDoctors(client, {departmentId})
    if (!isEmptyObject(doctors)) {
      await querySchedules(client, {departmentId})
      let selectDoctors = isExistSchedule(doctors, departmentId, schedules, this.state.selectedDate)
      await selectDoctor({ doctorId: selectDoctors[0] ? selectDoctors[0].id : null })
    }
    this.setState({toDetail: false})
  }

  tabRender (selectDoctors, doctor) {
    var departmentId = this.props.departmentId
    if (!doctor) {
      return <div>loading</div>
    }
    var doctorId = doctor.id
    return (
      <div style={{backgroundColor: '#ffffff', width: '100%'}}>
        <div style={{float: 'left', width: '20%'}}>
          <ul id='tab_nav' className={'tab_nav'}>
            {
              selectDoctors.length > 0 ? selectDoctors.map((doc) => {
                return (
                  <li className={'tab_nav_li'} key={doc.id} onClick={() => {
                    this.props.selectDoctor({doctorId: doc.id})
                    this.props.querySchedules(this.props.client, { departmentId, doctorId: doc.id })
                  }}>
                    <a className={'tab_nav_a'}>{doc.doctorName}</a>
                  </li>
                )
              }) : ''
            }
          </ul>
        </div>
        <div id='tab_content' style={{width: '80%', float: 'right'}}>
          <div id={`tab_${doctorId}`} style={{overflow: 'hidden'}}>
            <DoctorDetail doctor={doctor} schedules={this.props.schedules} departmentId={this.props.departmentId} goDetail={(schedule) => {
              this.props.selectSchedule(schedule.id)
              Router.push('/appointment/schedule_detail?scheduleId=' + schedule.id)
            }} />
          </div>
        </div>
        <div className='clearfix'>&nbsp;</div>
      </div>
    )
  }

  renderDate () {
    let date = new Date(this.state.firstDate)
    let dateList = [
      {
        date: new Date(date),
        weekday: new Date(date).getDay(),
        day: new Date(date).getDate()
      },
      {
        date: new Date(moment(date).add(1, 'day')),
        weekday: new Date(moment(date).add(1, 'day')).getDay(),
        day: new Date(moment(date).add(1, 'day')).getDate()
      },
      {
        date: new Date(moment(date).add(2, 'day')),
        weekday: new Date(moment(date).add(2, 'day')).getDay(),
        day: new Date(moment(date).add(2, 'day')).getDate()
      },
      {
        date: new Date(moment(date).add(3, 'day')),
        weekday: new Date(moment(date).add(3, 'day')).getDay(),
        day: new Date(moment(date).add(3, 'day')).getDate()
      },
      {
        date: new Date(moment(date).add(4, 'day')),
        weekday: new Date(moment(date).add(4, 'day')).getDay(),
        day: new Date(moment(date).add(4, 'day')).getDate()
      },
      {
        date: new Date(moment(date).add(5, 'day')),
        weekday: new Date(moment(date).add(5, 'day')).getDay(),
        day: new Date(moment(date).add(5, 'day')).getDate()
      }
    ]
    return (
      <div style={{display: 'flex'}}>
        <div key={date.date} style={{margin: '10px 5px 10px 10px', paddingTop: 15}} onClick={() => {
          var oldDate = this.state.firstDate
          this.setState({firstDate: moment(oldDate).add(-6, 'day').format('YYYY-MM-DD')})
        }}>
          {
            new Date(this.state.firstDate) > new Date()
              ? <img src='/static/icons/arrow_right.png' style={{width: 10, height: 10, marginTop: 4, transform: 'rotateY(180deg)'}} />
              : ''
          }
        </div>
        {
          dateList.map((date) => {
            let weekdayStr = ''
            switch (date.weekday) {
              case 0:
                weekdayStr = '周日'
                break
              case 1:
                weekdayStr = '周一'
                break
              case 2:
                weekdayStr = '周二'
                break
              case 3:
                weekdayStr = '周三'
                break
              case 4:
                weekdayStr = '周四'
                break
              case 5:
                weekdayStr = '周五'
                break
              case 6:
                weekdayStr = '周六'
                break
              default:
                break
            }
            let isToday = false
            let todayClass = {
              color: 'inherit',
              margin: 14,
              textAlign: 'center'
            }
            if (moment().format('YYYY-MM-DD') === moment(date.date).format('YYYY-MM-DD')) {
              todayClass = {
                color: 'blue',
                margin: 14,
                textAlign: 'center'
              }
              isToday = true
            }
            return <div key={date.date} style={todayClass} onClick={() => { this.setState({selectedDate: moment(date.date).format('YYYY-MM-DD')}) }}>
              <div style={{marginBottom: 5}}>{isToday ? '今天' : weekdayStr}</div>
              <div>{date.day}</div>
            </div>
          })
        }
        <div key={date.date} style={{margin: '10px 10px 10px 5px', paddingTop: 15}} onClick={() => {
          var oldDate = this.state.firstDate
          this.setState({firstDate: moment(oldDate).add(6, 'day').format('YYYY-MM-DD')})
        }}>
          <img src='/static/icons/arrow_right.png' style={{width: 10, height: 10, marginTop: 4}} />
        </div>
      </div>
    )
  }
  render () {
    if (this.state.toDetail || this.props.loading) {
      return <div>loading...</div>
    }
    // 多加判断防止状态为error时，所有的界面都是error
    if (this.props.error) {
      return <div>error...</div>
    }
    let departmentId = this.props.departmentId
    let doctors = this.props.doctors
    let schedules = this.props.schedules
    let selectDoctors = isExistSchedule(doctors, departmentId, schedules, this.state.selectedDate)
    let doctorId = this.props.doctorId
    let doctor = {}
    if (selectDoctors.length > 0) {
      doctorId = this.props.doctorId || selectDoctors[0].id
      this.props.selectDoctor({ doctorId: selectDoctors[0] ? selectDoctors[0].id : null })
      doctor = doctors[doctorId]
    }
    return (
      <div className=''>
        <div style={{display: 'flex', textAlign: 'center', backgroundColor: '#ffffff', paddingTop: '10px', paddingBottom: '10px', marginBottom: 5, borderBottom: 'solid 0.2px #eeeeee'}}>
          <li style={{textAlign: 'center', width: '50%', float: 'left', height: '25px', fontSize: '16px'}} onClick={() => { this.setState({isDateTab: false, selectedDate: '', firstDate: moment().format('YYYY-MM-DD')}) }}>全部日期</li>
          <li style={{textAlign: 'center', width: '50%', float: 'right', height: '25px', fontSize: '16px'}} onClick={() => { this.setState({isDateTab: true}) }}>按日期挂号</li>
        </div>
        <div style={{padding: '0px 5px', backgroundColor: '#ffffff'}}>
          {
            this.state.isDateTab ? this.renderDate() : ''
          }
        </div>
        {
          selectDoctors.length > 0 ? this.tabRender(selectDoctors, doctor) : '没有可预约医生'
        }
        <style jsx global>{`
          .tab_nav {
            margin: 0px;
            padding: 0px;
            height: 30px;
          },
          .tab_nav_li {
            margin: 0px 0px;
            border-bottom: 1px solid #999;
            height: 30px;
            width: 100%;
            text-align: center;
            background-color: #FFF
          }
          .tab_nav_a {
            font: bold 14px/24px "微软雅黑", Verdana, Arial, Helvetica, sans-serif;
            color: green;
            text-decoration: none;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.doctors.loading,
    error: state.doctors.error,
    user: state.user.data,
    userId: state.user.data.id,
    doctors: state.doctors.data,
    doctorId: state.doctors.selectId,
    departmentId: state.departments.selectId,
    schedules: state.schedules.data
  }
}

export default connect(mapStateToProps, { queryDoctors, selectDoctor, selectDepartment, removeSelectDoctor, querySchedules, selectSchedule })(AppointmentDoctorListScreen)
