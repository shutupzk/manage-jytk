import React, { Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import {Loading, theme} from 'components'

import { signin, queryUser, queryPatients, queryAppointments, queryAppointmentDetail, updateAppointment, selectAppointment } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class AppointmentSuccessScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }

  componentWillMount () {
    if (isEmptyObject(this.props.appointments)) {
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
    const { url, selectAppointment } = this.props
    await selectAppointment({appointmentId: url.query.appointmentId})
    // const appointment = appointments[appointmentId]
    // const departmentId = appointment.visitSchedule.department.id
    // const doctorId = appointment.visitSchedule.doctor.id
    // this.setState({ departmentId, doctorId })
    const appointmentId = this.props.appointmentId
    const client = this.props.client
    await this.props.queryAppointmentDetail(client, {appointmentId})
    this.setState({isInit: false})
  }

  gotoPay (appointment) {
    this.props.selectAppointment({appointmentId: appointment.id})
    Router.push('/appointment/select_pay_way')
  }

  render () {
    if (this.state.isInit || this.props.loading) {
      return (<div><Loading showLoading={true} /></div>)
    }
    if (this.props.error) {
      return (<div>error...</div>)
    }
    const { patients, appointments, appointmentId } = this.props
    const appointment = appointments[appointmentId] || {}
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
            <div className={'itemTopView flex tb-flex lr-flex'}>
              <img src='/static/icons/appointsuccess.png' />挂号成功!
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
          <div style={{margin: 10, fontSize: theme.nfontsize, color: theme.fontcolor, lineHeight: '20px'}}>
            <h3 style={{fontSize: theme.nfontsize, color: theme.fontcolor}}>*重要提示：</h3>
            <div>1.东川门诊预约患者，请于预约当天预约时段前10分钟到自助报到机/人工台报到，报到后到指定诊间外候诊。如未能在预约时段后半小时内报到，系统将自动取消此次预约。</div>
            <div>2.英东/老研所/惠福/平洲/合群门诊部预约患者，请于当天预约时段内携相关有效证件到挂号台或自助机取号，或在支付界面缴费后凭短信直接到医生诊间外候诊。</div>
            <div>3.此信息不作为报销凭证。</div>
          </div>
        </div>
        <div style={{position: 'fixed', bottom: '0px', width: '100%', backgroundColor: '#ffffff', height: '30px', padding: '10px 0px'}}>
        {/*<div style={{bottom: 15, position: 'fixed', width: '100%', backgroundColor: '#ffffff', height: 30, padding: 10}}>*/}
          <button
            style={{backgroundColor: buttonColor, color: theme.maincolor, width: '20%', display: 'block', float: 'right', border: 'solid 1px #cccccc', marginLeft: 10, marginRight: 10, borderColor: theme.maincolor, lineHeight: '28px', padding: '0', borderRadius: '4px'}}
            onClick={() => {
              this.gotoPay(appointment)
            }} >去支付</button>
          <button
            style={{backgroundColor: buttonColor, color: theme.fontcolor, width: '20%', display: 'block', float: 'right', border: 'solid 1px #ccc', borderColor: theme.fontcolor, lineHeight: '28px', padding: '0', borderRadius: '4px'}}
            onClick={() => {
              Router.push('/')
            }} >稍后支付</button>
        </div>
        {/*<Popup ref={popup => { this.popup = popup }} />*/}
        <style jsx>{`
        .detailView {
          font-size: 13px;
        }
        .itemTopView {
          padding: 40px 0;
          background-color: ${theme.maincolor};
          font-size: 20px;
          color: #fff;
          align-items: center;
          margin-bottom: 10px;
        }
        .itemTopView img{
          width: .22rem;
          padding-right: .06rem;
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
          margin: 0 10px;
          margin-bottom: 1px;
          padding: 10px;
        }
        .itemView {
          padding-left: 5px;
          flex-direction: row;
          margin-top: 10px;
        },
        .itemLeft {
          font-size: ${theme.fontsize};
          color: ${theme.nfontcolor};
        }
        .itemRight {
          float: right;
          color: ${theme.fontcolor};
          margin-right: 10px;
        }
      `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: state.user.data.id,
    appointments: state.appointments.data,
    appointmentId: state.appointments.selectId,
    patients: state.patients.data,
    error: state.appointments.error || state.patients.error,
    loading: state.appointments.loading || state.patients.loading
  }
}

export default connect(mapStateToProps, { signin, queryUser, queryPatients, queryAppointments, queryAppointmentDetail, updateAppointment, selectAppointment })(AppointmentSuccessScreen)
