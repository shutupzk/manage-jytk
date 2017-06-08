import React, { Component } from 'react'
import { signin, queryHospitals, queryUser, queryPatients, queryDoctors, selectPatient, addAppointment, selectSchedule, queryPatientTypes, selectPatientType } from '../../../ducks'
import { connect } from 'react-redux'
import Router from 'next/router'
import _ from 'lodash'

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
      return this.popup.alert('请选择就诊人')
    }
    this.setState({animating: true})
    var appointmentId = await props.addAppointment(props.client, { scheduleId, patientCardId, visitScheduleTimeId, timeRangeOfVist, payType })
    this.setState({animating: false})
    if (this.props.addError) return this.popup.alert(this.props.addError)
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

    return (<div className='container' style={styles.container}>
      <div style={styles.list}>
        <div style={{marginLeft: 15}}>
          <div style={styles.subView}>
            <img src='/static/icons/doctor_head.png' style={{width: 30, height: 30, borderRadius: '15px'}} />
            <span style={styles.bigName}>{doctor.doctorName}</span>
            <span style={styles.titleText}>{doctor.title}</span>
          </div>
        </div>
        <div style={{marginBottom: 30, marginTop: 15}}>
          <div>
            <span style={styles.textLeft}>就诊科室</span>
            <span style={styles.textRight}>{schedule.department.deptName}</span>
          </div>
          <div>
            <span style={styles.textLeft}>门诊类型</span>
            <span style={styles.textRight}>{schedule.clinicType || '专科'}</span>
          </div>
          <div>
            <span style={styles.textLeft}>就诊时间</span>
            <span style={styles.textRight}>{schedule.visitDate}</span>
          </div>
          <div>
            <span style={styles.textLeft}>挂号费用</span>
            <span style={styles.textRight}>{schedule.registerFee}</span>
          </div>
        </div>
        <div style={styles.item} key={'amPm'}>
          <span style={styles.textLeft}>{'就诊时间'}</span>
          <div style={styles.rightView} onClick={() => { this.setState({selectTimeRangeShow: true}) }}>
            <span style={styles.textRight}> {beginTime || (schedule.amPm === 'a' ? '8:00' : '13:00')} - {endTime || (schedule.amPm === 'a' ? '9:00' : '14:00')} </span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>
        <div style={styles.item} key={'name'}>
          <span style={styles.textLeft}>{'就诊人'}</span>
          <div style={styles.rightView} onClick={() => { Router.push('/appointment/select_patient') }}>
            <span style={styles.textRight}>{patient.name}</span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>
        {/*<div style={styles.item} key={'clinicType'}>
          <span style={styles.textLeft}>{'号        别'}</span>
          <div style={styles.rightView}>
            <span style={styles.textRight}>{schedule.clinicType || '普通号'}</span>
          </div>
        </div>*/}
        {/*<div style={styles.item} key={'deptName'}>
          <span style={styles.textLeft}>{'就诊科室'}</span>
          <div style={styles.rightView}>
            <span style={styles.textRight}>{schedule.department.deptName} </span>
          </div>
        </div>*/}
        <div style={styles.item} key={'payType'}>
          <span style={styles.textLeft}>{'支付类别'}</span>
          <div style={styles.rightView} onClick={() => {
            this.setState({selectPayTypeShow: true})
          }}>
            <span style={styles.textRight}>{this.state.payType}</span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>
        {/*<div style={styles.item} key={'registerFee'}>
          <span style={styles.textLeft}>{'支付金额'}</span>
          <div style={styles.rightView}>
            <span style={styles.textRight}>{schedule.registerFee}</span>
          </div>
        </div>*/}
        <div style={styles.item} key={'carteVital'}>
          <span style={styles.textLeft}>{'诊疗卡号'}</span>
          <div style={styles.rightView}>
            <span style={styles.textRight}>{patient.carteVital}</span>
          </div>
        </div>
      </div>
      <button
        style={{width: '100%', display: 'block'}}
        className='blockPrimaryBtn'
        onClick={() => this.submit(this.props)}
      >
        确定
      </button>
      <div style={{position: 'fixed', bottom: '20px', width: '90%'}}>
        {
          this.state.selectTimeRangeShow ? this.selectTimeRangeRender(schedule) : ''
        }
        {
          this.state.selectPayTypeShow ? this.selectPayTypeRender(schedule) : ''
        }
      </div>
      {/*<Popup ref={popup => { this.popup = popup }} />*/}
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

const styles = {
  container: {
    flex: 1
  },
  list: {
    borderTopWidth: 0,
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 0,
    backgroundColor: '#ffffff',
    paddingBottom: 10
  },
  item: {
    height: 30,
    paddingTop: 10,
    flexWrap: 'nowrap',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    marginRight: 5,
    borderBottom: 'solid 1px #eeeeee'
  },
  textLeft: {
    flex: 1,
    fontSize: 15,
    color: '#797979',
    marginLeft: 15,
    marginRight: 25
  },
  rightView: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    float: 'right'
  },
  textRight: {
    fontSize: 15,
    color: '#505050',
    marginRight: 10
  },
  buttonStyle: {
    marginTop: 35
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  bigName: {
    fontSize: 18,
    color: '#505050',
    marginLeft: 10
  },
  titleText: {
    fontSize: 14,
    color: '#797979',
    marginLeft: 10
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center'
  }
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
