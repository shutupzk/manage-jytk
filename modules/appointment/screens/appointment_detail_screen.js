import React, { Component } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import localforage from 'localforage'
// import swal from 'sweetalert2'
import {theme, Loading, ErrCard} from 'components'

import { signin, queryUser, selectAppointment, queryPatients, queryAppointmentDetail, updateAppointment, selectDepartment, selectDoctor } from '../../../ducks'
import { isEmptyObject } from '../../../utils'

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
    if (isEmptyObject(this.props.appointments)) {
      const appointmentId = this.props.url.query.appointmentId
      this.setState({isInit: true})
      await this.props.queryAppointmentDetail(this.props.client, {appointmentId})
      await this.props.selectAppointment({appointmentId})
      const appointments = this.props.appointments
      const appointment = appointments[this.props.appointmentId]
      const departmentId = appointment.visitSchedule.department.id
      const doctorId = appointment.visitSchedule.doctor.id
      this.setState({ departmentId, doctorId })
      const userId = await localforage.getItem('userId')
      await this.props.queryPatients(this.props.client, {userId})
    } else {
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
    if (error) return console.log('', error)
    // todo
    // swal({
    //   text: '确认删除？',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes!',
    //   cancelButtonText: 'No!'
    // }).then(async () => {
    //   const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
    //   if (error) return console.log(error)// swal('', error)
    //   return window.history.back()
    // })
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
  gotoPay () {
    Router.push('/appointment/select_pay_way')
  }
  render () {
    if (this.state.isInit || this.props.loading) {
      return (<div><Loading showLoading={true} /></div>)
    }
    if (this.props.error) {
      return (<div><ErrCard /></div>)
    }
    const { patients, appointments, appointmentId } = this.props
    const appointment = appointments[appointmentId]
    const patient = patients[appointment.patientId]
    let buttonColor = '#FFFFFF'
    let status = '预约中'
    let statusStyle = 'unCancelText'
    let buttonText = '取消预约'
    let buttonTextColor = '#E45252'
    if (appointment.visitStatus === '02') {
      status = '已取消'
      statusStyle = 'cancelText'
      buttonText = '再次预约'
      buttonColor = '#3CA0FF'
      buttonTextColor = '#FFFFFF'
    }
    if (appointment.visitStatus === '03') {
      status = '已缴费'
      statusStyle = 'cancelText'
      buttonText = '退号退费'
      buttonColor = '#3CA0FF'
      buttonTextColor = '#FFFFFF'
    }
    return (
      <div>
        <div className={'detailView'}>
          <div className={'itemTopView'}>
            <span>{`预约号码：${appointment.orderSn}`}</span>
            <span className={statusStyle}>{status}</span>
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
        <div>
          {
            appointment.visitStatus === '02' ? <button
              className='fullWidthFixed fullWidthBtn fullWidthBtnMain'
              onClick={() => {
                this.gotoSchedule()
              }} >再次预约</button>
            : <div>{
              appointment.visitStatus === '01'
                ? <div style={{display: 'flex'}} className='fullWidthFixed'><button
                  className='fullWidthBtn fullWidthBtnBackWhite'
                  style={{width: '50%'}}
                  onClick={() => {
                    this.cancelAppointment()
                  }} >取消挂号</button>
                  <button
                    className='fullWidthBtn fullWidthBtnMain'
                    style={{width: '50%'}}
                    onClick={() => {
                      this.gotoPay()
                    }} >去缴费</button></div>
                : <button
                  className='fullWidthFixed fullWidthBtn fullWidthBtnBackWhite'
                  onClick={() => {
                    this.退费()
                  }} >退号退费</button>
              }</div>
          }
          {/*<button
            style={{backgroundColor: buttonColor, color: buttonTextColor, width: '100%', display: 'block'}}
            onClick={() => {
              if (buttonText === '取消预约') {
                this.cancelAppointment(this.props)
              } else {
                this.gotoSchedule()
              }
            }} >{buttonText}</button>*/}
        </div>
        <style jsx>{`
          .detailView {
            margin: 10px;
            background-color: #FFFFFF;
            font-size: 13px;
          }
          .itemTopView {
            padding-left: ${theme.lrmargin};
            {/*background-color: #FFFFFFpx;*/}
            line-height: 30px;
            background: #fbfbfb;
            align-items: center;
          }
          .unCancelText {
            float: right;
            color: ${theme.maincolor};
            margin-right: ${theme.lrmargin};
          }
          .cancelText {
            float: right;
            color: #B4B4B4;
            margin-right: 10px;
          }
          .subView {
            justify-content: center;
            padding: ${theme.lrmargin};
          }
          .itemView {
            flex-direction: row;
            margin-top: 10px;
          },
          .itemLeft {
            color: ${theme.nfontcolor};
            margin-left: 10px;
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
    appointments: state.appointments.data,
    appointmentId: state.appointments.selectId,
    patients: state.patients.data,
    error: state.appointments.error,
    loading: state.appointments.loading
  }
}

export default connect(mapStateToProps, { signin, queryUser, selectAppointment, queryPatients, queryAppointmentDetail, updateAppointment, selectDepartment, selectDoctor })(AppointmentDetailScreen)
