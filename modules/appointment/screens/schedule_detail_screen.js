import React, { Component } from 'react'
import { signin, queryHospitals, queryUser, queryPatients, queryDoctors, selectPatient, selectDoctor, addAppointment, selectSchedule, queryPatientTypes, selectPatientType, queryScheduleDetail, queryDoctorDetail, selectAppointment } from '../../../ducks'
import { connect } from 'react-redux'
import Router from 'next/router'
import _ from 'lodash'
import {theme, Loading, Prompt} from 'components'

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
      patientTypeId: undefined,
      visitScheduleTimeId: undefined,
      selectTimeRangeShow: false,
      selectPayTypeShow: false,
      isShow: false,
      autoClose: true,
      closeTime: 2,
      promptContent: ''
    }
  }

  componentWillMount () {
    this.setState({isInit: true})
    if (isEmptyObject(this.props.patients)) {
      this.initState()
    } else {
      this.queryPatientTypes()
    }
    // this.props.selectSchedule(this.props.scheduleId)
  }
  async queryPatientTypes () {
    if (isEmptyObject(this.props.schedules)) {
      const scheduleId = this.props.url.query.scheduleId
      await this.props.queryScheduleDetail(this.props.client, {scheduleId})
      await this.props.selectSchedule(scheduleId)
      const schedule = this.props.schedules[scheduleId]
      const doctorId = schedule.doctorId
      this.props.selectDoctor({doctorId})
      await this.props.queryDoctorDetail(this.props.client, {doctorId})
    }
    if (isEmptyObject(this.props.hospitals)) {
      await this.props.queryHospitals(this.props.client)
    }
    const hospitalId = _.findKey(this.props.hospitals)
    await this.props.queryPatientTypes(this.props.client, {hospitalId})
    this.setState({isInit: false})
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
    const schedule = this.props.schedules[scheduleId]
    let visitScheduleTimeId = schedule.visitScheduleTimes[0].id
    if (this.state.visitScheduleTimeId) {
      visitScheduleTimeId = this.state.visitScheduleTimeId
    }
    // const beginTime = this.state.beginTime
    // const endTime = this.state.endTime
    // const timeRangeOfVist = beginTime + '-' + endTime
    // const payType = this.state.payType
    let patientTypeId = _.findKey(props.patientTypes)
    const visitNo = this.refs.visitNo.value
    console.log(visitNo)
    if (this.state.patientTypeId) {
      patientTypeId = this.state.patientTypeId
    }
    if (!patientCardId) {
      return this.setState({
        isShow: true,
        autoClose: true,
        closeTime: 2,
        promptContent: '请选择就诊人'
      })
    }
    this.setState({animating: true})
    var appointmentId = await props.addAppointment(props.client, { scheduleId, patientCardId, visitScheduleTimeId, patientTypeId, visitNo })
    this.props.selectAppointment({appointmentId})
    this.setState({animating: false})
    if (this.props.addError) {
      return this.setState({
        isShow: true,
        autoClose: true,
        closeTime: 2,
        promptContent: this.props.addError
      })
    }
    // return this.props.url.back()
    if (!this.props.addLoading) return Router.push('/appointment/appointment_success?appointmentId=' + appointmentId)
  }
  render () {
    if (this.state.isInit) {
      return (
        <div><Loading showLoading={true} /></div>
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
    var patientTypes = []
    _.mapValues(this.props.patientTypes, function (type) {
      patientTypes.push(type)
    })
    return (<div style={{flex: 1}}>
      <div className={'list'}>
        <div>
          <div className={'subView flex tb-flex'}>
            <img src='/static/icons/doctor_head.png' style={{width: 30, height: 30, borderRadius: '15px'}} />
            <span className={'bigName'}>{doctor.doctorName}</span>
            <span className={'titleText'}>{doctor.title}</span>
          </div>
        </div>
        <div style={{marginBottom: 10, padding: theme.lrmargin, backgroundColor: '#fff'}}>
          <div className='flex tb-flex'>
            <span className={'textLeft'}>就诊科室</span>
            <span className={'textRight'}>{schedule.department.deptName}</span>
          </div>
          <div className='flex tb-flex'>
            <span className={'textLeft'}>门诊类型</span>
            <span className={'textRight'}>{schedule.clinicType || ''}</span>
          </div>
          <div className='flex tb-flex'>
            <span className={'textLeft'}>就诊时间</span>
            <span className={'textRight'}>{schedule.visitDate}</span>
          </div>
          <div className='flex tb-flex'>
            <span className={'textLeft'}>挂号费用</span>
            <span className={'textRight'}>{schedule.registerFee}</span>
          </div>
        </div>
        <div className={'item'} key={'name'}>
          <span className={'textLeft'}>{'就诊人'}</span>
          <div className={'rightView'} onClick={() => { Router.push('/appointment/select_patient') }}>
            <span className={'textRight'}>{patient.name}</span>
            <i className='back-left'></i>
          </div>
        </div>
        <div className={'item2'} key={'amPm'}>
          <span className={'left'}>{'就诊时间'}</span>
          <div className={'flex tb-flex'} onClick={() => {
            {/*this.setState({selectTimeRangeShow: true})*/}
          }}>
            {/*<span className={'textRight'}> {beginTime || (schedule.amPm === 'a' ? '8:00' : '13:00')} - {endTime || (schedule.amPm === 'a' ? '9:00' : '14:00')} </span>*/}
            {/*<img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />*/}
            <select style={{display: '', height: 30, width: '100%', fontSize: 15, color: '#505050'}}>
              {
                schedule.visitScheduleTimes.map((scheduleTime) => {
                  return <option
                    key={scheduleTime.beginTime}
                    style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}}
                    onClick={() => {
                      this.setState({selectTimeRangeShow: false, beginTime: scheduleTime.beginTime, endTime: scheduleTime.endTime, visitScheduleTimeId: scheduleTime.id})
                    }}
                  >{scheduleTime.beginTime}-{scheduleTime.endTime}  (余号{scheduleTime.leftNum})</option>
                })
              }
            </select>
            <i className='back-left'></i>
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
        {/*<div className={'item'} key={'payType'}>
          <span className={'textLeft'}>{'支付类别'}</span>
          <div className={'rightView'} onClick={() => {
            this.setState({selectPayTypeShow: true})
          }}>
            <span className={'textRight'}>{this.state.payType}</span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>*/}
        <div className={'item2'} key={'payType2'}>
          <span className={'left'}>{'患者类型'}</span>
          <div className={'flex tb-flex'} onClick={() => {
            {/*this.setState({selectPayTypeShow: true})*/}
            this.refs.patientTypeSelect.click()
          }}>
            {/*<span className={'textRight'}>{this.state.payType}</span>*/}
            {/*<img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />*/}
            <select ref='patientTypeSelect' style={{display: '', height: 30, width: '100%', fontSize: 15, color: '#505050'}}>
              {
                patientTypes.map((type) => {
                  return (
                    <option
                      key={type.id}
                      style={{height: 24, width: '100%', padding: 2, borderBottom: 'solid 1px #dddddd'}}
                      onClick={() => {
                        this.setState({selectPayTypeShow: false, payType: type.patientTypeName, patientTypeId: type.id})
                        this.props.selectPatientType(type.id)
                      }}
                    >{type.patientTypeName}</option>
                  )
                })
              }
            </select>
            <i className='back-left'></i>
          </div>
        </div>
        {/*<div className={item} key={'registerFee'}>
          <span className={textLeft}>{'支付金额'}</span>
          <div className={rightView}>
            <span className={textRight}>{schedule.registerFee}</span>
          </div>
        </div>*/}
        <div className={'item'} key={'carteVital'}>
          <span className={'textLeft'}>{'就诊卡号'}</span>
          <div className={'rightView'}>
            <span className={'textRight'}><input ref='visitNo' placeholder='请输入就诊卡号' defaultValue={patient.patientCards[0] ? patient.patientCards[0].visitNo : ''} /></span>
          </div>
        </div>
      </div>
      <footer style={{margin: '20px 15px'}}>
        <button
          className='btnBG btnBGMain'
          onClick={() => this.submit(this.props)}
        >
          确定
        </button>
      </footer>
      {/*<div style={{position: 'fixed', bottom: '20px', width: '100%'}}>
        {
          this.state.selectTimeRangeShow ? this.selectTimeRangeRender(schedule) : ''
        }
        {
          this.state.selectPayTypeShow ? this.selectPayTypeRender(schedule) : ''
        }
      </div>*/}
      <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
      <style jsx>{`
        select {
          direction: rtl;
          border: none;
        }
        select option {
          direction: ltr;
        }
        .list {
          margin-top: 10px;
          margin-bottom: 5px;
          {/*background-color: #ffffff;*/}
          padding-bottom: 10px;
        }
        .item2 {
          padding: 0px 15px;
          background-color: #ffffff;
          justify-content: space-between;
          margin-bottom: 1px;
          display: flex;
        }
        .left {
          font-size: 15px;
          color: #797979;
          padding: 10px 0px;
          flex: 5;
        }
        .right {
          flex: 7;
          align-items: right;
          text-align: right;
        }
        .back-left {
          display: inline-block;
          transform: rotate(135deg);
          margin-left: .06rem;
        }
        .item {
          padding: 10px 15px;
          {/*height: 30px;*/}
          {/*paddingTop: 10px;*/}
          flex-wrap: nowrap;
          align-items: center;
          flex-direction: row;
          background-color: #ffffff;
          justify-content: space-between;
          margin-bottom: 1px;
        }
        .textLeft {
          font-size: ${theme.fontsize};
          color: ${theme.fontcolor};
          padding-right: ${theme.lrmargin};
          line-height: .3rem;
        }
        .textRight {
          color: ${theme.mainfontcolor};
          line-height: .3rem;
        }
        .textRight input{
          line-height: .3rem;
          text-align: right;
          padding: 0;
          margin: 0;
          border: none;
          font-size: ${theme.fontsize};
          color: ${theme.fontcolor};
        }
        .rightView {
          color: ${theme.mainfontcolor};
          float: right;
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
          font-size: .17rem;
          color: ${theme.mainfontcolor};
          margin: 0 10px;
          font-weight: bold;
        }
        .titleText {
          font-size: ${theme.nfontsize};
          color: ${theme.fontcolor};
        }
        .subView {
          padding: ${theme.tbmargin} ${theme.lrmargin};
          background-color: #fff;
          align-items: center;
          border-bottom: 1px solid #e6e6e6;
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

export default connect(mapStateToProps, { signin, queryHospitals, queryUser, queryPatients, queryDoctors, selectPatient, selectDoctor, addAppointment, selectSchedule, queryPatientTypes, selectPatientType, queryScheduleDetail, queryDoctorDetail, selectAppointment })(ScheduleDetailScreen)
