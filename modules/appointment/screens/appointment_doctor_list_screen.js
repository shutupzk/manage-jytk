import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import Router from 'next/router'
import localforage from 'localforage'

import DoctorDetail from '../components/doctor_detail'
import { isEmptyObject } from '../../../utils'
import { queryDoctors, selectDoctor, selectDepartment, removeSelectDoctor, querySchedules, selectSchedule, createUserHasDoctor, removeUserHasDoctor } from '../../../ducks'
import {TabHeader, Loading, theme, ErrCard} from 'components'

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
    this.state = {toDetail: false, isDateTab: false, selectedDate: '', firstDate: moment().format('YYYY-MM-DD'), isMyDoctor: false}
  }
  componentWillMount () {
    let doctors = this.props.doctors
    let departmentId = this.props.departmentId
    if (!departmentId) {
      this.props.selectDepartment({departmentId: this.props.url.query.departmentId})
    }
    let selectDoctors = isExistDepartment(doctors, departmentId)
    if (isEmptyObject(doctors) || selectDoctors.length === 0) {
      this.queryData()
    } else {
      // this.props.selectDoctor({doctorId: selectDoctors[0].id})
      this.querySchedule()
    }
  }

  async querySchedule () {
    let { client, url, doctors, selectDoctor, querySchedules } = this.props
    const departmentId = this.props.departmentId || url.query.departmentId
    this.setState({toDetail: true})
    if (!isEmptyObject(doctors)) {
      await querySchedules(client, {departmentId})
      const schedules = this.props.schedules
      let selectDoctors = isExistSchedule(doctors, departmentId, schedules, this.state.selectedDate)
      if (selectDoctors.length > 0) {
        await selectDoctor({ doctorId: selectDoctors[0] ? selectDoctors[0].id : null })
        this.setState({isMyDoctor: selectDoctors[0].isMyDoctor})
      }
    }
    this.setState({toDetail: false})
  }

  async queryData () {
    let { client, doctors, url, queryDoctors, selectDoctor, querySchedules } = this.props
    const departmentId = this.props.departmentId || url.query.departmentId
    this.setState({toDetail: true})
    await queryDoctors(client, {departmentId})
    if (!isEmptyObject(doctors)) {
      await querySchedules(client, {departmentId})
      const schedules = this.props.schedules
      let selectDoctors = isExistSchedule(doctors, departmentId, schedules, this.state.selectedDate)
      if (selectDoctors.length > 0) {
        await selectDoctor({ doctorId: selectDoctors[0] ? selectDoctors[0].id : null })
        this.setState({isMyDoctor: selectDoctors[0].isMyDoctor})
      }
    }
    this.setState({toDetail: false})
  }

  async saveOrCancelMyDoctor (isMyDoc) {
    let doctorId = this.props.doctorId
    var doctor = this.props.doctors[doctorId]
    var userId = await localforage.getItem('userId')
    if (isMyDoc) {
      const data = await this.props.removeUserHasDoctor(this.props.client, {id: doctor.userHasDoctorId, userId, doctorId: doctor.id})
      if (!data.error && data.data.isRemove) {
        this.setState({isMyDoctor: false})
      }
    } else {
      const data = await this.props.createUserHasDoctor(this.props.client, {userId, doctorId: doctor.id})
      if (!data.error) {
        this.setState({isMyDoctor: true})
      }
    }
  }

  tabRender (selectDoctors, doctor) {
    var departmentId = this.props.departmentId
    if (!doctor) {
      return <div><Loading showLoading={true} /></div>
    }
    var doctorId = doctor.id
    return (
      <div style={{display: '-webkit-box'}}>
        <ul id='tab_nav' className={'tab_nav'}>
          {
            selectDoctors.length > 0 ? selectDoctors.map((doc) => {
              return (
                <li className={this.props.doctorId === doc.id ? 'flex tb-flex lr-flex active' : 'flex lr-flex tb-flex'} key={doc.id} onClick={() => {
                  this.props.selectDoctor({doctorId: doc.id})
                  this.setState({isMyDoctor: this.props.doctors[doc.id].isMyDoctor})
                  this.props.querySchedules(this.props.client, { departmentId, doctorId: doc.id })
                }}>
                  <i className='sanjiao'></i><span>{doc.doctorName}</span>
                </li>
              )
            }) : ''
          }
        </ul>
        <div id='tab_content' className='tab_content'>
          <div id={`tab_${doctorId}`} style={{overflow: 'hidden'}}>
            <DoctorDetail isMyDoc={this.state.isMyDoctor} toMyDoctor={() => { this.saveOrCancelMyDoctor(this.state.isMyDoctor) }} doctor={doctor} schedules={this.props.schedules} departmentId={this.props.departmentId} goDetail={(schedule) => {
              this.props.selectSchedule(schedule.id)
              Router.push('/appointment/schedule_detail?scheduleId=' + schedule.id)
            }} />
          </div>
        </div>
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
      <div className='flex tb-flex lr-flex' style={{padding: '.1rem 0', justifyContent: 'spance-between',  borderTop: '1px solid #d8d8d8'}}>
        {
            new Date(this.state.firstDate) > new Date() ?
              <div key={date.date} className='canlendarBack flex lr-flex' onClick={() => {
                var oldDate = this.state.firstDate
                this.setState({firstDate: moment(oldDate).add(-6, 'day').format('YYYY-MM-DD')})}}>
                <p className='back-left' style={{transform: 'rotate(-45deg'}}></p>
              </div>
            : ''
          }
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
              backgroundColor: '#FFF',
              minWidth: '.5rem',
              minHeight: '.5rem',
              textAlign: 'center'
            }
            if (moment().format('YYYY-MM-DD') === moment(date.date).format('YYYY-MM-DD')) {
              todayClass = {
                color: theme.maincolor,
                backgroundColor: '#FFF',
                minWidth: '.5rem',
                minHeight: '.5rem',
                textAlign: 'center'
              }
              isToday = true
            }
            if (moment(date.date).format('YYYY-MM-DD') === this.state.selectedDate) {
              todayClass = {
                color: '#FFF',
                backgroundColor: theme.maincolor,
                borderRadius: '100%',
                minWidth: '.5rem',
                minHeight: '.5rem',
                textAlign: 'center'
              }
            }
            return <div key={date.date} style={todayClass} onClick={() => { this.setState({selectedDate: moment(date.date).format('YYYY-MM-DD')}) }}>
              <div style={{paddingTop: '.06rem', fontSize: '.12rem'}}>{isToday ? '今天' : weekdayStr}</div>
              <div style={{fontSize: '.16rem'}}>{date.day}</div>
            </div>
          })
        }
        <div key={date.date} className='canlendarBack flex lr-flex' onClick={() => {
          var oldDate = this.state.firstDate
          this.setState({firstDate: moment(oldDate).add(6, 'day').format('YYYY-MM-DD')})
        }}>
          <p className='back-left' style={{transform: 'rotate(135deg'}} />
        </div>
        <style jsx>{`
          .canlendarBack{
            display: flex;
            width: 26px;
            text-align: center;
          }
          .canlendarBack p{
            display: inline-block;
          }
        `}</style>
      </div>
    )
  }
  render () {
    if (this.state.toDetail || this.props.loading) {
      return <div><Loading showLoading={true} /></div>
    }
    // 多加判断防止状态为error时，所有的界面都是error
    if (this.props.error) {
      return <div><ErrCard /></div>
    }
    console.log(this.props)
    let departmentId = this.props.departmentId
    let doctors = this.props.doctors
    let schedules = this.props.schedules
    let selectDoctors = isExistSchedule(doctors, departmentId, schedules, this.state.selectedDate)
    let doctorId = this.props.doctorId
    let doctor = {}
    if (selectDoctors.length > 0) {
      doctorId = this.props.doctorId || selectDoctors[0].id
      this.props.selectDoctor({ doctorId })
      doctor = doctors[doctorId]
    }
    const types = [{text: '全部日期', value: false}, {text: '按日期挂号', value: true}]
    return (
      <div className=''>
        {/*<div style={{display: 'flex', textAlign: 'center', backgroundColor: '#ffffff', marginBottom: 1.5}}>
          <li
          onClick={() => {  }}>全部日期</li>
          <li className={this.state.isDateTab ? 'top_nav_active' : ''}
          onClick={() => {  }}>按日期挂号</li>
        </div>*/}
        <TabHeader types={types} curPayStatue={this.state.isDateTab}
          clickTab={(type) => {
            if (type) {
              this.setState({isDateTab: type})
            } else {
              this.setState({isDateTab: type, selectedDate: '', firstDate: moment().format('YYYY-MM-DD')})
            }
          }} />
        <div style={{backgroundColor: '#fff', borderBottom: '1px solid #d8d8d8'}}>
          {
            this.state.isDateTab ? this.renderDate() : ''
          }
        </div>
        {
          selectDoctors.length > 0 ? this.tabRender(selectDoctors, doctor) : '没有可预约医生'
        }
        <style jsx global>{`
          .tab_nav {
            min-width: 1rem;
          }
          .tab_nav li {
            border-bottom: 1px solid ${theme.bordercolor};
            line-height: .4rem;
            width: 100%;
            text-align: center;
            color: ${theme.fontcolor};
            position: relative;
          }
          .tab_nav li i.sanjiao{
            transform: rotate(-90deg);
            border-top: .06rem solid #f2f2f2;
            position: absolute;
            left: 10px;
          }
          .tab_nav li.active {
            background-color: #FFF;
            color: ${theme.maincolor};
          }
          .tab_nav li.active i.sanjiao {
            border-top: .06rem solid ${theme.maincolor};
          }
          .tab_content{
            -webkit-box-flex: 1;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.doctors.loading || state.schedules.loading,
    error: state.doctors.error || state.schedules.error,
    user: state.user.data,
    userId: state.user.data.id,
    doctors: state.doctors.data,
    doctorId: state.doctors.selectId,
    departmentId: state.departments.selectId,
    schedules: state.schedules.data
  }
}

export default connect(mapStateToProps, { queryDoctors, selectDoctor, selectDepartment, removeSelectDoctor, querySchedules, selectSchedule, createUserHasDoctor, removeUserHasDoctor })(AppointmentDoctorListScreen)
