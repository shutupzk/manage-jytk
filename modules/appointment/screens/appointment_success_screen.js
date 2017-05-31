import React, { Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'

import { signin, queryUser, queryPatients, queryAppointments, queryAppointmentDetail, updateAppointment, selectAppointment } from '../../../ducks'

class AppointmentSuccessScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }

  componentWillMount () {
    if (this.props.userId) {
      this.initState()
    }
  }

  async initState () {
    console.log('1')
    this.setState({isInit: true})
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
      this.props.queryUser(this.props.client, { userId })
      this.props.queryPatients(this.props.client, {userId})
      this.props.queryAppointments(this.props.client, { userId: this.props.userId })
    }
    const { appointmentId, appointments, url, selectAppointment } = this.props
    await selectAppointment({appointmentId: url.query.appointmentId})
    const appointment = appointments[appointmentId]
    const departmentId = appointment.visitSchedule.department.id
    const doctorId = appointment.visitSchedule.doctor.id
    this.setState({ departmentId, doctorId })
    const client = this.props.client
    await this.props.queryAppointmentDetail(client, {appointmentId})
    this.setState({isInit: false})
    console.log('2')
  }

  render () {
    console.log('3')
    if (this.state.isInit || this.props.loading) {
      return (<div>loading</div>)
    }
    if (this.props.error) {
      return (<div>error</div>)
    }
    const { patients, appointments, appointmentId } = this.props
    const appointment = appointments[appointmentId]
    const patient = patients[appointment.patientId]
    let buttonColor = '#FFFFFF'
    if (appointment.visitStatus === '02') {
      buttonColor = '#3CA0FF'
    }
    return (
      <div style={styles.container}>
        <div style={styles.detailView}>
          <div style={styles.itemTopView}>
            <div style={{fontSize: 20, textAlign: 'center'}}>挂号成功</div>
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
            {/*<div style={styles.itemView}>
              <span style={styles.itemLeft}>{'支付类别'}</span>
              <span style={styles.itemRight}>{appointment.payType}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'支付金额'}</span>
              <span style={styles.itemRight}>{appointment.visitSchedule.registerFee}</span>
            </div>
            <div style={styles.itemView}>
              <span style={styles.itemLeft}>{'就  诊  号'}</span>
              <span style={styles.itemRight}>{appointment.visitNo}</span>
            </div>*/}
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
        <div style={{margin: 5}}>
          <h3>*重要提示：</h3>
          <div>1.东川门诊预约患者，请于预约当天预约时段前10分钟到自助报到机/人工台报到，报到后到指定诊间外候诊。如未能在预约时段后半小时内报到，系统将自动取消此次预约。</div>
          <div>2.英东/老研所/惠福/平洲/合群门诊部预约患者，请于当天预约时段内携相关有效证件到挂号台或自助机取号，或在支付界面缴费后凭短信直接到医生诊间外候诊。</div>
          <div>3.此信息不作为报销凭证。</div>
        </div>
        <div style={{marginTop: 15, backgroundColor: '#ffffff', height: 30, padding: 10}}>
          <button
            style={{backgroundColor: buttonColor, color: '#3CA0FF', width: '20%', display: 'block', float: 'right', border: 'solid 1px #cccccc', marginLeft: 10}}
            onClick={() => {
            }} >去支付</button>
          <button
            style={{backgroundColor: buttonColor, color: '#505050', width: '20%', display: 'block', float: 'right', border: 'solid 1px #cccccc'}}
            onClick={() => {
              Router.push('/appointment/appointment_list')
            }} >稍后支付</button>
        </div>
        {/*<Popup ref={popup => { this.popup = popup }} />*/}
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

export default connect(mapStateToProps, { signin, queryUser, queryPatients, queryAppointments, queryAppointmentDetail, updateAppointment, selectAppointment })(AppointmentSuccessScreen)
