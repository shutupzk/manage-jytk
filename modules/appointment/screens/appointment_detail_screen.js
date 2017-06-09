import React, { Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import localforage from 'localforage'
import swal from 'sweetalert2'

import { signin, queryUser, selectAppointment, queryPatients, queryAppointmentDetail, updateAppointment, selectDepartment, selectDoctor } from '../../../ducks'

class AppointmentDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }

  componentWillMount () {
    // const appointment = this.props.appointments[this.props.appointmentId]
    // const departmentId = appointment.visitSchedule.department.id
    // const doctorId = appointment.visitSchedule.doctor.id
    // this.setState({ departmentId, doctorId })
    // const client = this.props.client
    // this.props.queryAppointmentDetail(client, {appointmentId: this.props.appointmentId})
    this.initState()
  }

  async initState () {
    if (this.props.appointments) {
      const appointmentId = this.props.url.query.appointmentId
      this.setState({isInit: true})
      await this.props.queryAppointmentDetail(this.props.client, {appointmentId})
      await this.props.selectAppointment({appointmentId})
      const appointments = this.props.appointments
      console.log(appointments)
      const appointment = appointments[this.props.appointmentId]
      const departmentId = appointment.visitSchedule.department.id
      const doctorId = appointment.visitSchedule.doctor.id
      this.setState({ departmentId, doctorId })
      const userId = await localforage.getItem('userId')
      await this.props.queryPatients(this.props.client, {userId})
    } else {
      console.log('sw')
      const { appointmentId, appointments } = this.props
      const appointment = appointments[appointmentId]
      const departmentId = appointment.visitSchedule.department.id
      const doctorId = appointment.visitSchedule.doctor.id
      this.setState({ departmentId, doctorId })
      const client = this.props.client
      this.setState({isInit: true})
      this.props.queryAppointmentDetail(client, {appointmentId})
    }
    this.setState({isInit: false})
  }
  // 取消挂号
  async cancelAppointment () {
    const appointmentId = this.props.appointmentId
    const visitStatus = '02'
    const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
    if (error) return swal('', error)
    swal({
      text: '确认删除？',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No!'
    }).then(async () => {
      const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
      if (error) return swal('', error)
      return window.history.back()
    })
    return this.props.url.back()
    // this.popup.confirm({
    //   content: '确定取消？',
    //   ok: {
    //     text: '确定',
    //     style: { color: 'red' },
    //     callback: async () => {
    //       const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
    //       console.log('error', error)
    //       if (error) return this.popup.alert(error)
    //       return this.props.url.goBack()
    //     }
    //   },
    //   cancel: {text: '取消', style: {color: 'blue'}}
    // })
  }

  // 再次预约跳转医生排版
  gotoSchedule () {
    const { selectDepartment, selectDoctor } = this.props
    const departmentId = this.state.departmentId
    const doctorId = this.state.doctorId
    Router.push('/appointment/doctor_list')
    selectDepartment({departmentId})
    selectDoctor({doctorId})
  }

  render () {
    console.log(this.props)
    if (this.state.isInit || this.props.loading) {
      return (<div>loading...</div>)
    }
    if (this.props.error) {
      return (<div>error...</div>)
    }
    const { patients, appointments, appointmentId } = this.props
    const appointment = appointments[appointmentId]
    const patient = patients[appointment.patientId]
    let buttonColor = '#FFFFFF'
    let status = '待取号'
    let statusStyle = styles.unCancelText
    let buttonText = '取消预约'
    let buttonTextColor = '#E45252'
    if (appointment.visitStatus === '02') {
      status = '已取消'
      statusStyle = styles.cancelText
      buttonText = '再次预约'
      buttonColor = '#3CA0FF'
      buttonTextColor = '#FFFFFF'
    }
    return (
      <div style={styles.container}>
        <div style={styles.detailView}>
          <div style={styles.itemTopView}>
            <span>{`预约号码：${appointment.orderSn}`}</span>
            <span style={statusStyle}>{status}</span>
          </div>
          <div style={styles.subView}>
            <div style={{color: '#000000', marginBottom: 3}}><b>挂号信息</b></div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'科        室'}</span>
              <span style={styles.itemRight}>{appointment.visitSchedule.department.deptName}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'医        生'}</span>
              <span style={styles.itemRight}>{appointment.visitSchedule.doctor.doctorName}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'挂号类型'}</span>
              <span style={styles.itemRight}>{appointment.visitSchedule.clinicType}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'挂号类型'}</span>
              <span style={styles.itemRight}>{appointment.visitPlace}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'就诊日期'}</span>
              <span style={styles.itemRight}>{appointment.visitSchedule.visitDate}</span>
            </div>
            
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'预计候诊时间'}</span>
              <span style={styles.itemRight}>{appointment.timeRangeOfVist}</span>
            </div>
          </div>
          <div style={styles.subView}>
            <div style={{color: '#000000', marginBottom: 3}}><b>就诊人信息</b></div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'患者姓名'}</span>
              <span style={styles.itemRight}>{patient.name}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'病人  ID'}</span>
              <span style={styles.itemRight}>{appointment.patientCard.patientIdNo}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'身份证号'}</span>
              <span style={styles.itemRight}>{patient.certificateNo}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'手机号'}</span>
              <span style={styles.itemRight}>{patient.phone}</span>
            </div>
          </div>
          <div style={styles.subView}>
            <div style={{color: '#000000', marginBottom: 3}}><b>订单信息</b></div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'挂号费'}</span>
              <span style={styles.itemRight}>{appointment.visitSchedule.registerFee}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'诊疗费'}</span>
              <span style={styles.itemRight}>{appointment.treatFee}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'流水号'}</span>
              <span style={styles.itemRight}>{appointment.seqNo}</span>
            </div>
          </div>

        </div>
        <div style={{marginTop: 15}}>
          <button
            style={{backgroundColor: buttonColor, color: buttonTextColor, width: '100%', display: 'block'}}
            onClick={() => {
              if (buttonText === '取消预约') {
                this.cancelAppointment(this.props)
              } else {
                this.gotoSchedule()
              }
            }} >{buttonText}</button>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
  },
  detailView: {
    // marginTop: 15,
    // marginLeft: 15,
    // marginRight: 15,
    backgroundColor: '#FFFFFF',
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 13
  },
  itemTopView: {
    marginLeft: 10,
    paddingTop: 15,
    // backgroundColor: '#FFFFFF',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  unCancelText: {
    float: 'right',
    color: '#0087F4',
    marginRight: 10
  },
  cancelText: {
    float: 'right',
    color: '#B4B4B4',
    marginRight: 10
  },
  subView: {
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 20
  },
  itemView: {
    flexDirection: 'row',
    marginTop: 10
  },
  itemLeft: {
    color: '#797979'
  },
  itemRight: {
    float: 'right',
    color: '#505050',
    marginRight: 10
  }
}

function mapStateToProps (state) {
  console.log('state:', state)
  return {
    appointments: state.appointments.data,
    appointmentId: state.appointments.selectId,
    patients: state.patients.data,
    error: state.appointments.error,
    loading: state.appointments.loading
  }
}

export default connect(mapStateToProps, { signin, queryUser, selectAppointment, queryPatients, queryAppointmentDetail, updateAppointment, selectDepartment, selectDoctor })(AppointmentDetailScreen)
