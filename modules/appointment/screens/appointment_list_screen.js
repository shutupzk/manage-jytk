import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'

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
    console.log('确定取消？')
    const appointmentId = appointment.id
    const visitStatus = '02'
    this.popup.confirm({
      content: '确定取消？',
      ok: {
        text: '确定',
        style: { color: 'red' },
        callback: async () => {
          const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
          console.log('error', error)
          if (error) return this.popup.alert(error)
          return this.props.navigation.goBack(null)
        }
      },
      cancel: {text: '取消', style: {color: 'blue'}}
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
    let statusStyle = styles.unCancelText
    let buttonText = '取消预约'
    if (appointment.visitStatus === '02') {
      status = '已取消'
      statusStyle = styles.cancelText
      buttonText = '再次预约'
    }
    return (
      <div style={styles.listItem}>
        <div style={styles.itemTopView}>
          <span style={styles.topText}>{`就诊时间：${appointment.visitSchedule.visitDate}  ${appointment.visitSchedule.amPm === 'a' ? '上午' : '下午'}`}</span>
          <span style={statusStyle}>{status}</span>
        </div>
        <div>
          <div style={{width: '20%', float: 'left'}}>
            <img src='/static/icons/doctor_head.png' style={styles.avatarStyle} />
          </div>
          <div style={styles.subView}>
            <div style={styles.centerText}>{'预约号码：' + appointment.orderSn}</div>
            <div style={styles.centerText}>{'就诊科室：' + appointment.visitSchedule.department.deptName}</div>
            <div style={styles.centerText}>{'医生姓名：' + appointment.visitSchedule.doctor.doctorName}</div>
          </div>
          <div className='clearfix'>&nbsp;</div>
        </div>
        <div style={styles.itemBottomView}>
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
    var height = window.innerHeight - 50
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

const styles = {
  container: {
    flex: 1
  },
  listItem: {
    paddingTop: 10,
    width: '100%',
    height: 170,
    backgroundColor: '#ffffff',
    marginBottom: 10
  },
  itemTopView: {
    backgroundColor: '#FBFBFB',
    height: 40,
    marginBottom: 5,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topText: {
    color: '#797979',
    flex: 2,
    fontSize: 15
  },
  unCancelText: {
    color: '#0087F4',
    fontSize: 14,
    float: 'right',
    marginRight: 15
  },
  cancelText: {
    color: '#B4B4B4',
    fontSize: 14,
    float: 'right',
    marginRight: 15
  },
  subView: {
    width: '75%',
    float: 'right',
    justifyContent: 'center',
    marginLeft: 10
  },
  centerText: {
    fontSize: 13,
    color: '#505050',
    marginBottom: 6
  },
  avatarStyle: {
    height: 60,
    width: 60,
    marginLeft: 10
  },
  itemBottomView: {
    height: 40,
    marginRight: 15,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center'
  }
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
