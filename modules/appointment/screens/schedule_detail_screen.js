import React, { Component } from 'react'
import { signin, queryHospitals, queryUser, queryPatients, queryDoctors, selectPatient, addAppointment, selectSchedule, queryPatientTypes, selectPatientType } from '../../../ducks'
import { connect } from 'react-redux'
import Router from 'next/router'
import _ from 'lodash'
// import swal from 'sweetalert2'

import { isEmptyObject } from '../../../utils'
/**
 * 号源详情
 */
class ScheduleDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      beginTime: null,
      endTime: null,
      payType: '自费',
      visitScheduleTimeId: undefined,
      selectTimeRangeShow: false,
      selectPayTypeShow: false
    }
  }

  componentWillMount () {
    this.setState({isInit: true})
    if (isEmptyObject(this.props.patients)) {
      this.initState()
    } else {
      this.queryPatientTypes()
    }
    this.setState({isInit: false})
    // this.props.selectSchedule(this.props.scheduleId)
  }
  async queryPatientTypes () {
    if (isEmptyObject(this.props.hospitals)) {
      await this.props.queryHospitals(this.props.client)
    }
    const hospitalId = _.keys(this.props.hospitals)[0]
    this.props.queryPatientTypes(this.props.client, {hospitalId})
  }
  async initState () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
      await this.props.queryUser(this.props.client, { userId })
      await this.props.queryPatients(this.props.client, {userId})
      // await this.props.queryAppointments(this.props.client, { userId: this.props.userId })
    }
    const array = getPatients(this.props.selectPatient, this.props.patients, this.props.patientId)
    const patientId = this.props.patientId || array[0].id
    this.props.selectPatient({ patientId })
    if (!this.props.scheduleId) {
      this.props.selectSchedule(this.props.url.query.scheduleId)
    }
    this.queryPatientTypes()
  }

  selectTimeRangeRender (schedule) {
    return (
      <div style={{width: '100%', textAlign: 'center', backgroundColor: '#ffffff', paddingTop: 2}}>
        {
          schedule.visitScheduleTimes.map((scheduleTime) => {
            return <option key={scheduleTime.beginTime} style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}} onClick={() => {
              this.setState({selectTimeRangeShow: false, beginTime: scheduleTime.beginTime, endTime: scheduleTime.endTime, visitScheduleTimeId: scheduleTime.id})
            }}>{scheduleTime.beginTime}-{scheduleTime.endTime}  (余号{scheduleTime.leftNum})</option>
          })
        }
      </div>
    )
  }

  selectPayTypeRender (schedule) {
    var patientTypes = []
    _.mapValues(this.props.patientTypes, function (type) {
      patientTypes.push(type)
    })
    return (
      <div style={{width: '100%', textAlign: 'center', backgroundColor: '#ffffff', paddingTop: 2}}>
        {
          patientTypes.map((type) => {
            return (
              <option
                key={type.id}
                style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}}
                onClick={() => {
                  this.setState({selectPayTypeShow: false, payType: type.patientTypeName})
                  this.props.selectPatientType(type.id)
                }}
              >{type.patientTypeName}</option>
            )
          })
        }
        {/*<option style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}} onClick={() => { this.setState({selectPayTypeShow: false, payType: '自费'}) }}>自费</option>
        <option style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}} onClick={() => { this.setState({selectPayTypeShow: false, payType: '职工医保'}) }}>职工医保</option>
        <option style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}} onClick={() => { this.setState({selectPayTypeShow: false, payType: '铁路医保'}) }}>铁路医保</option>
        <option style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}} onClick={() => { this.setState({selectPayTypeShow: false, payType: '生育保险'}) }}>生育保险</option>
        <option style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}} onClick={() => { this.setState({selectPayTypeShow: false, payType: '农合医保'}) }}>农合医保</option>
        <option style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}} onClick={() => { this.setState({selectPayTypeShow: false, payType: '城镇医保'}) }}>城镇医保</option>*/}
      </div>
    )
  }

  // 提交
  async submit (props) {
    const patient = this.props.patients[this.props.patientId]
    const patientCardId = patient.patientCards[0].id
    const scheduleId = this.props.scheduleId
    const visitScheduleTimeId = this.state.visitScheduleTimeId
    const beginTime = this.state.beginTime
    const endTime = this.state.endTime
    const timeRangeOfVist = beginTime + '-' + endTime
    const payType = this.state.payType
    if (!patientCardId) {
      return console.log('', '请选择就诊人')
    }
    this.setState({animating: true})
    var appointmentId = await props.addAppointment(props.client, { scheduleId, patientCardId, visitScheduleTimeId, timeRangeOfVist, payType })
    this.setState({animating: false})
    if (this.props.addError) return console.log('', this.props.addError)
    // return this.props.url.back()
    if (!this.props.addLoading) return Router.push('/appointment/appointment_success?appointmentId=' + appointmentId)
  }
  render () {
    if (this.state.isInit) {
      return (
        <div>loading...</div>
      )
    }
    const {doctors, doctorId, schedules, scheduleId, patients, selectPatient} = this.props
    const doctor = doctors[doctorId]
    const schedule = schedules[scheduleId]
    const array = getPatients(selectPatient, this.props.patients, this.props.patientId)
    let beginTime = this.state.beginTime || (schedule.visitScheduleTimes && schedule.visitScheduleTimes[0] ? schedule.visitScheduleTimes[0].beginTime : null)
    let endTime = this.state.endTime || (schedule.visitScheduleTimes && schedule.visitScheduleTimes[0] ? schedule.visitScheduleTimes[0].endTime : null)
    let patientId = this.props.patientId
    if (!patientId) {
      patientId = array[0].id
    }
    const patient = patients[patientId]

    return (<div style={{flex: 1}}>
      <div className={'list'}>
        <div>
          <div className={'subView'}>
            <img src='/static/icons/doctor_head.png' style={{width: 30, height: 30, borderRadius: '15px'}} />
            <span className={'bigName'}>{doctor.doctorName}</span>
            <span className={'titleText'}>{doctor.title}</span>
          </div>
        </div>
        <div style={{marginBottom: 10, padding: 10, backgroundColor: '#fff'}}>
          <div>
            <span className={'textLeft'}>就诊科室</span>
            <span className={'textRight'}>{schedule.department.deptName}</span>
          </div>
          <div>
            <span className={'textLeft'}>门诊类型</span>
            <span className={'textRight'}>{schedule.clinicType || '专科'}</span>
          </div>
          <div>
            <span className={'textLeft'}>就诊时间</span>
            <span className={'textRight'}>{schedule.visitDate}</span>
          </div>
          <div>
            <span className={'textLeft'}>挂号费用</span>
            <span className={'textRight'}>{schedule.registerFee}</span>
          </div>
        </div>
        <div className={'item'} key={'amPm'}>
          <span className={'textLeft'}>{'就诊时间'}</span>
          <div className={'rightView'} onClick={() => { this.setState({selectTimeRangeShow: true}) }}>
            <span className={'textRight'}> {beginTime || (schedule.amPm === 'a' ? '8:00' : '13:00')} - {endTime || (schedule.amPm === 'a' ? '9:00' : '14:00')} </span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>
        <div className={'item'} key={'name'}>
          <span className={'textLeft'}>{'就诊人'}</span>
          <div className={'rightView'} onClick={() => { Router.push('/appointment/select_patient') }}>
            <span className={'textRight'}>{patient.name}</span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>
        {/*<div className={'item'} key={'clinicType'}>
          <span className={'textLeft'}>{'号        别'}</span>
          <div className={'rightView'}>
            <span className={'textRight'}>{schedule.clinicType || '普通号'}</span>
          </div>
        </div>*/}
        {/*<div className={'item'} key={'deptName'}>
          <span className={'textLeft'}>{'就诊科室'}</span>
          <div className={'rightView'}>
            <span className={'textRight'}>{schedule.department.deptName} </span>
          </div>
        </div>*/}
        <div className={'item'} key={'payType'}>
          <span className={'textLeft'}>{'支付类别'}</span>
          <div className={'rightView'} onClick={() => {
            this.setState({selectPayTypeShow: true})
          }}>
            <span className={'textRight'}>{this.state.payType}</span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>
        {/*<div className={item} key={'registerFee'}>
          <span className={textLeft}>{'支付金额'}</span>
          <div className={rightView}>
            <span className={textRight}>{schedule.registerFee}</span>
          </div>
        </div>*/}
        <div className={'item'} key={'carteVital'}>
          <span className={'textLeft'}>{'诊疗卡号'}</span>
          <div className={'rightView'}>
            <span className={'textRight'}>{patient.carteVital}</span>
          </div>
        </div>
      </div>
      <button
        style={{width: '92%', display: 'block', margin: '4%'}}
        className='blockPrimaryBtn'
        onClick={() => this.submit(this.props)}
      >
        确定
      </button>
      <div style={{position: 'fixed', bottom: '20px', width: '100%'}}>
        {
          this.state.selectTimeRangeShow ? this.selectTimeRangeRender(schedule) : ''
        }
        {
          this.state.selectPayTypeShow ? this.selectPayTypeRender(schedule) : ''
        }
      </div>
      {/*<Popup ref={popup => { this.popup = popup }} />*/}
      <style jsx>{`
        .list {
          margin-top: 10px;
          margin-bottom: 5px;
          {/*background-color: #ffffff;*/}
          padding-bottom: 10px;
        }
        .item {
          padding: 10px;
          {/*height: 30px;*/}
          {/*paddingTop: 10px;*/}
          flex-wrap: nowrap;
          align-items: center;
          flex-direction: row;
          background-color: #ffffff;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .textLeft {
          flex: 1;
          font-size: 15px;
          color: #797979;
          margin-right: 25px;
        }
        .rightView {
          flex: 3;
          flex-direction: row;
          align-items: center;
          float: right;
        }
        .textRight {
          font-size: 15px;
          color: #505050;
          margin-right: 10px;
        }
        .buttonStyle {
          margin-top: 35px;
        }
        .loading {
          align-items: center;
          justify-content: center;
          height: 80px;
        }
        .bigName {
          font-size: 18px;
          color: #505050;
          margin-left: 10px;
        }
        .titleText {
          font-size: 14px;
          color: #797979;
          margin-left: 10px;
        }
        .subView {
          padding: 10px;
          background-color: #fff;
          margin-bottom: 1px;
          flex-direction: row;
          align-items: center;
        }
      `}</style>
    </div>)
  }
}

const getPatients = (selectPatient, patients, patientId) => {
  let array = []
  for (let key in patients) {
    if (!patientId && patients[key].default) {
      selectPatient({patientId: patients[key].id})
    }
    array.push(patients[key])
  }
  return array
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    user: state.user.data,
    hospitals: state.hospitals.data,
    patients: state.patients.data,
    patientId: state.patients.selectId,
    doctors: state.doctors.data,
    doctorId: state.doctors.selectId,
    schedules: state.schedules.data,
    scheduleId: state.schedules.selectId,
    patientTypes: state.patientTypes.data,
    addError: state.appointments.error,
    addLoading: state.appointments.loading
  }
}

export default connect(mapStateToProps, { signin, queryHospitals, queryUser, queryPatients, queryDoctors, selectPatient, addAppointment, selectSchedule, queryPatientTypes, selectPatientType })(ScheduleDetailScreen)
