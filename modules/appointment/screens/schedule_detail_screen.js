import React, { Component } from 'react'
import { selectPatient, addAppointment, selectSchedule } from '../../../ducks'
import { connect } from 'react-redux'
import Router from 'next/router'
/**
 * 号源详情
 */
class ScheduleDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animating: false
    }
  }

  componentWillMount () {
    const array = getPatients(this.props.patients)
    const patientId = array[0].id
    this.props.selectPatient({ patientId })
    this.props.selectSchedule(this.props.scheduleId)
  }

  // 提交
  async submit (props) {
    const patient = this.props.patients[this.props.patientId]
    const patientCardId = patient.patientCards[0].id
    const scheduleId = this.props.scheduleId
    if (!patientCardId) {
      return this.popup.alert('请选择就诊人')
    }
    this.setState({animating: true})
    await props.addAppointment(props.client, { scheduleId, patientCardId })
    this.setState({animating: false})
    if (this.props.addError) return this.popup.alert(this.props.addError)
    // return this.props.url.back()
    return Router.push('/appointment/appointment_list')
  }
  render () {
    const {doctors, doctorId, schedules, scheduleId, patients} = this.props
    const doctor = doctors[doctorId]
    const schedule = schedules[scheduleId]
    const array = getPatients(this.props.patients)
    console.log('patients：：：：：', patients)
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
          <div style={styles.rightView}>
            <span style={styles.textRight}> {schedule.amPm === 'a' ? '8:00-12:00' : '13:00-17:00'} </span>
            <img src='/static/icons/arrow_right.png' style={{width: 10, height: 12}} />
          </div>
        </div>
        <div style={styles.item} key={'name'}>
          <span style={styles.textLeft}>{'就诊人'}</span>
          <div style={styles.rightView}>
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
          <div style={styles.rightView}>
            <span style={styles.textRight}>自费</span>
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
      {/*<Popup ref={popup => { this.popup = popup }} />*/}
    </div>)
  }
}

const getPatients = (patients) => {
  let array = []
  for (let key in patients) {
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
    height: 35,
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
  console.log(state)
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    user: state.user.data,
    patients: state.patients.data,
    patientId: state.patients.selectId,
    doctors: state.doctors.data,
    doctorId: state.doctors.selectId,
    schedules: state.schedules.data,
    scheduleId: state.schedules.selectId,
    addError: state.appointments.error,
    addLoading: state.appointments.loading
  }
}

export default connect(mapStateToProps, { selectPatient, addAppointment, selectSchedule })(ScheduleDetailScreen)
