import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import swal from 'sweetalert2'

import {
  signin,
  queryUser,
  queryAppointments,
  queryPatients,
  selectAppointment,
  selectPatient,
  selectDepartment,
  updateAppointment,
  selectDoctor } from '../../../ducks'

class AppointmentListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }

  componentWillMount () {
    if (!this.props.userId) {
      this.autoSignin()
    } else {
      this.props.queryAppointments(this.props.client, { userId: this.props.userId })
    }
  }

  async autoSignin () {
    this.setState({isInit: true})
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
      this.props.queryUser(this.props.client, { userId })
      this.props.queryPatients(this.props.client, {userId})
      this.props.queryAppointments(this.props.client, { userId: this.props.userId })
    }
    this.setState({isInit: false})
  }

    // 取消挂号
  async cancelAppointment (appointment) {
    const appointmentId = appointment.id
    const visitStatus = '02'
    swal({
      text: '确定取消？',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No!'
    }).then(async () => {
      const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
      if (error) return swal('', error)
      return window.history.back()
    })
  }

  gotoSchedule (appointment) {
    const departmentId = appointment.visitSchedule.department.id
    const doctorId = appointment.visitSchedule.doctor.id
    this.props.selectDepartment({departmentId})
    this.props.selectDoctor({doctorId})
    Router.push('/appointment/doctor_list')
  }

  ItemView (appointment) {
    let status = '待取号'
    let statusStyle = 'unCancelText'
    let buttonText = '取消预约'
    if (appointment.visitStatus === '02') {
      status = '已取消'
      statusStyle = 'cancelText'
      buttonText = '再次预约'
    }
    return (
      <div className={'listItem'}>
        <div className={'itemTopView'}>
          <span className={'topText'}>{`就诊时间：${appointment.visitSchedule.visitDate}  ${appointment.visitSchedule.amPm === 'a' ? '上午' : '下午'}`}</span>
          <span className={statusStyle}>{status}</span>
        </div>
        <div>
          <div style={{width: '20%', float: 'left'}}>
            <img src='/static/icons/doctor_head.png' className={'avatarStyle'} />
          </div>
          <div className={'subView'}>
            <div className={'centerText'}>{'预约号码：' + appointment.orderSn}</div>
            <div className={'centerText'}>{'就诊科室：' + appointment.visitSchedule.department.deptName}</div>
            <div className={'centerText'}>{'医生姓名：' + appointment.visitSchedule.doctor.doctorName}</div>
          </div>
          <div className='clearfix'>&nbsp;</div>
        </div>
        <div className={'itemBottomView'}>
          <button
            style={{float: 'right'}}
            onClick={(e) => {
              e.stopPropagation()
              if (status === '已取消') {
                this.gotoSchedule(appointment)
              } else {
                this.cancelAppointment(appointment)
              }
            }}
            >{buttonText}</button>
        </div>
      </div>
    )
  }

  render () {
    if (this.props.loading || this.state.isInit) {
      return <div>loading...</div>
    }
    if (this.props.error) {
      return <div>error...</div>
    }
    const { appointments, selectAppointment } = this.props
    const dataList = getListData(appointments)
    var height = process.browser ? window.innerHeight - 50 : ''
    // var height = window.innerHeight - 50
    return (
      <div style={{height: height}}>
        {
          dataList.map((item) => {
            return (
              <div key={item.id} onClick={() => {
                selectAppointment({appointmentId: item.id})
                Router.push('/appointment/appointment_detail?appointmentId=' + item.id)
              }}>
                {this.ItemView(item)}
              </div>
            )
          })
        }
        <style jsx global>{`
          .listItem {
            padding-top: 10px;
            width: 100%;
            height: 170px;
            background-color: #ffffff;
            margin-bottom: 10px;
          }
          .itemTopView {
            background-color: #FBFBFB;
            height: 40px;
            margin-bottom: 5px;
            margin-left: 15px;
            flex-direction: row;
            align-items: center;
          }
          .topText {
            color: #797979;
            flex: 2;
            font-size: 15px;
          }
          .unCancelText {
            color: #0087F4;
            font-size: 14px;
            float: right;
            margin-right: 15px;
          }
          .cancelText {
            color: #B4B4B4;
            font-rize: 14px;
            float: right;
            margin-right: 15px;
          }
          .subView {
            width: 75%;
            float: right;
            justify-content: center;
            margin-left: 10px;
          }
          .centerText {
            font-size: 13px;
            color: #505050;
            margin-bottom: 6px;
          }
          .avatarStyle {
            height: 60px;
            width: 60px;
            margin-left: 10px;
          }
          .itemBottomView {
            height: 40px;
            margin-right: 15px;
            margin-top: 5px;
            flex-direction: row;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}

const getListData = (appointments, patientId) => {
  let array = []
  for (let key in appointments) {
    if (patientId) {
      if (appointments[key].patientId === patientId) {
        array.push(Object.assign({}, appointments[key], { key }))
      }
    } else {
      array.push(Object.assign({}, appointments[key], { key }))
    }
  }
  return array
}

function mapStateToProps (state) {
  return {
    userId: state.user.data.id,
    patients: state.patients.data,
    appointments: state.appointments.data,
    loading: state.patients.loading || state.appointments.loading,
    error: state.patients.error || state.appointments.error
  }
}

export default connect(mapStateToProps, {
  signin,
  queryUser,
  queryAppointments,
  queryPatients,
  selectAppointment,
  selectPatient,
  selectDepartment,
  selectDoctor,
  updateAppointment})(AppointmentListScreen)
