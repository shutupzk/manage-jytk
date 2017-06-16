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
  }

  render () {
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
    var height = process.browser ? window.innerHeight - 70 : ''
    return (
      <div>
        <div style={{height: height, overflow: 'auto'}}>
          <div className={'detailView'}>
            <div className={'itemTopView'}>
              <div style={{fontSize: 20, textAlign: 'center'}}>挂号成功</div>
            </div>
            <div className={'subView'}>
              <div style={{color: '#000000', marginBottom: 3}}><b>挂号信息</b></div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'科        室'}</span>
                <span className={'itemRight'}>{appointment.visitSchedule.department.deptName}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'医        生'}</span>
                <span className={'itemRight'}>{appointment.visitSchedule.doctor.doctorName}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'挂号类型'}</span>
                <span className={'itemRight'}>{appointment.visitSchedule.clinicType}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'挂号类型'}</span>
                <span className={'itemRight'}>{appointment.visitPlace}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'就诊日期'}</span>
                <span className={'itemRight'}>{appointment.visitSchedule.visitDate}</span>
              </div>
              {/*<div className={'itemView'}>
                <span className={'itemLeft'}>{'支付类别'}</span>
                <span className={'itemRight'}>{appointment.payType}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'支付金额'}</span>
                <span className={'itemRight'}>{appointment.visitSchedule.registerFee}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'就  诊  号'}</span>
                <span className={'itemRight'}>{appointment.visitNo}</span>
              </div>*/}
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'预计候诊时间'}</span>
                <span className={'itemRight'}>{appointment.timeRangeOfVist}</span>
              </div>
            </div>
            <div className={'subView'}>
              <div style={{color: '#000000', marginBottom: 3}}><b>就诊人信息</b></div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'患者姓名'}</span>
                <span className={'itemRight'}>{patient.name}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'病人  ID'}</span>
                <span className={'itemRight'}>{appointment.patientCard.patientIdNo}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'身份证号'}</span>
                <span className={'itemRight'}>{patient.certificateNo}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'手机号'}</span>
                <span className={'itemRight'}>{patient.phone}</span>
              </div>
            </div>
            <div className={'subView'}>
              <div style={{color: '#000000', marginBottom: 3}}><b>订单信息</b></div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'挂号费'}</span>
                <span className={'itemRight'}>{appointment.visitSchedule.registerFee}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'诊疗费'}</span>
                <span className={'itemRight'}>{appointment.treatFee}</span>
              </div>
              <div className={'itemView'}>
                <span className={'itemLeft'}>{'流水号'}</span>
                <span className={'itemRight'}>{appointment.seqNo}</span>
              </div>
            </div>
          </div>
          <div style={{margin: 10}}>
            <h3>*重要提示：</h3>
            <div>1.东川门诊预约患者，请于预约当天预约时段前10分钟到自助报到机/人工台报到，报到后到指定诊间外候诊。如未能在预约时段后半小时内报到，系统将自动取消此次预约。</div>
            <div>2.英东/老研所/惠福/平洲/合群门诊部预约患者，请于当天预约时段内携相关有效证件到挂号台或自助机取号，或在支付界面缴费后凭短信直接到医生诊间外候诊。</div>
            <div>3.此信息不作为报销凭证。</div>
          </div>
        </div>
        <div style={{position: 'fixed', bottom: '20px', width: '100%', backgroundColor: '#ffffff', height: '30px', padding: '10px 0px'}}>
        {/*<div style={{bottom: 15, position: 'fixed', width: '100%', backgroundColor: '#ffffff', height: 30, padding: 10}}>*/}
          <button
            style={{backgroundColor: buttonColor, color: '#3CA0FF', width: '20%', display: 'block', float: 'right', border: 'solid 1px #cccccc', marginLeft: 10, marginRight: 10}}
            onClick={() => {
            }} >去支付</button>
          <button
            style={{backgroundColor: buttonColor, color: '#505050', width: '20%', display: 'block', float: 'right', border: 'solid 1px #cccccc'}}
            onClick={() => {
              Router.push('/appointment/appointment_list')
            }} >稍后支付</button>
        </div>
        {/*<Popup ref={popup => { this.popup = popup }} />*/}
        <style jsx>{`
        .detailView {
          margin: 10px;
          font-size: 13px;
        }
        .itemTopView {
          padding: 20px;
          margin-bottom: 1px;
          background-color: #FFFFFF;
          height: 30px;
          align-items: center;
        }
        .unCancelText {
          float: right;
          color: #0087F4;
          margin-right: 10px;
        }
        .cancelText {
          float: right;
          color: #B4B4B4;
          margin-right: 10px;
        }
        .subView {
          background-color: #FFFFFF;
          justify-content: center;
          padding: 10px;
          margin-bottom: 1px;
        }
        .itemView {
          padding-left: 5px;
          flex-direction: row;
          margin-top: 10px;
        },
        .itemLeft {
          color: #797979;
        }
        .itemRight {
          float: right;
          color: #505050;
          margin-right: 10px;
        }
      `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    appointments: state.appointments.data,
    appointmentId: state.appointments.selectId,
    patients: state.patients.data,
    error: state.appointments.error,
    loading: state.appointments.loading
  }
}

export default connect(mapStateToProps, { signin, queryUser, queryPatients, queryAppointments, queryAppointmentDetail, updateAppointment, selectAppointment })(AppointmentSuccessScreen)
