import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import _ from 'lodash'
import {Loading, FilterCard, FilterSelect, FilterTime, Modal, ModalHeader, ModalFooter, FilterTimeResult, theme, TabHeader, ErrCard, NoDataCard} from 'components'

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
import { isEmptyObject } from '../../../utils'

class AppointmentListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      selectedId: '',
      startDate: undefined,
      endDate: undefined,
      showFilterModal: false
    }
  }

  componentWillMount () {
    if (!this.props.userId) {
      this.autoSignin()
    } else {
      this.queryAppointments()
    }
  }

  async queryAppointments () {
    this.setState({isInit: true})
    await this.props.queryAppointments(this.props.client, { userId: this.props.userId })
    await this.props.queryPatients(this.props.client, {userId: this.props.userId})
    if (!isEmptyObject(this.props.patients)) {
      for (let key in this.props.patients) {
        this.setState({selectedId: key})
        break
      }
    }
    this.setState({isInit: false})
  }

  async autoSignin () {
    this.setState({isInit: true})
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
      this.props.queryUser(this.props.client, { userId })
      this.props.queryAppointments(this.props.client, { userId: this.props.userId })
      await this.props.queryPatients(this.props.client, {userId})
      if (!isEmptyObject(this.props.patients)) {
        for (let key in this.props.patients) {
          this.setState({selectedId: key})
          break
        }
      }
    }
    this.setState({isInit: false})
  }

    // 取消挂号
  async cancelAppointment (appointment) {
    const appointmentId = appointment.id
    const visitStatus = '02'
    // todo
    const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
    console.log(error)
    // swal({
    //   text: '确定取消？',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes!',
    //   cancelButtonText: 'No!'
    // }).then(async () => {
    //   const error = await this.props.updateAppointment(this.props.client, { appointmentId, visitStatus })
    //   if (error) return swal('', error)
    //   return window.history.back()
    // })
  }

  gotoSchedule (appointment) {
    const departmentId = appointment.visitSchedule.department.id
    const doctorId = appointment.visitSchedule.doctor.id
    this.props.selectDepartment({departmentId})
    this.props.selectDoctor({doctorId})
    Router.push('/appointment/doctor_list')
  }

  gotoPay (appointment) {
    const appointmentId = appointment.id
    this.props.selectAppointment({appointmentId})
    Router.push('/appointment/select_pay_way')
  }

  ItemView (appointment) {
    let status = '预约中'
    let statusStyle = 'unCancelText'
    let buttonText = '取消预约'
    if (appointment.visitStatus === '02') {
      status = '已取消'
      statusStyle = 'cancelText'
      buttonText = '再次预约'
    }
    if (appointment.visitStatus === '03') {
      status = '已缴费'
      statusStyle = 'unCancelText'
      buttonText = '再次预约'
    }
    return (
      <div className={'listItem'}>
        <div className={'itemTopView'}>
          <span className={'topText'}>{`就诊时间：${appointment.visitSchedule.visitDate}  ${appointment.visitSchedule.amPm === 'a' ? '上午' : '下午'}`}</span>
          <span className={statusStyle}>{status}</span>
        </div>
        <div style={{padding: theme.lrmargin, borderBottom: '1px solid #e6e6e6'}}>
          <div style={{width: '20%', float: 'left'}}>
            <img src='/static/icons/doctor_head.png' className={'avatarStyle'} />
          </div>
          <div className={'subView'}>
            <div className={'centerText'}>{'预约号码：' + appointment.orderSn}</div>
            <div className={'centerText'}>{'就诊科室：' + appointment.visitSchedule.department.deptName}</div>
            <div className={'centerText'}>{'医生姓名：' + appointment.visitSchedule.doctor.doctorName}</div>
          </div>
          <div className='clearfix'>&nbsp;</div>
        </div>
        <div className={'itemBottomView'}>
          <div style={{float: 'right'}}>
            {
              appointment.visitStatus === '02' ? <button
                style={{backgroundColor: '#fff', color: theme.fontcolor, display: 'block', border: 'solid 1px #ddd',borderColor: theme.fontcolor}}
                onClick={(e) => {
                  e.stopPropagation()
                  this.gotoSchedule(appointment)
                }} >再次预约</button>
              : <div>{
                appointment.visitStatus === '01'
                  ? <div style={{display: 'flex'}}><button
                    style={{backgroundColor: '#fff', color: theme.fontcolor, display: 'block', border: 'solid 1px #ddd',borderColor: theme.fontcolor, marginRight: 15}}
                    onClick={(e) => {
                      e.stopPropagation()
                      this.cancelAppointment(appointment)
                    }} >取消挂号</button>
                    <button
                      style={{backgroundColor: '#fff', color: theme.maincolor, display: 'block', border: 'solid 1px #ddd', borderColor: theme.maincolor}}
                      onClick={(e) => {
                        e.stopPropagation()
                        this.gotoPay(appointment)
                      }} >去缴费</button></div>
                  : <button
                    style={{backgroundColor: '#fff', color: theme.fontcolor, display: 'block', border: 'solid 1px #ddd',borderColor: theme.fontcolor}}
                    onClick={(e) => {
                      e.stopPropagation()
                      this.退费(appointment)
                    }} >退号退费</button>
                }</div>
            }
          </div>
        </div>
      </div>
    )
  }

  renderModal() {
    let modalHtml;
    modalHtml = <Modal showModalState={this.state.showTipModal || this.state.showFilterModal}>
      <ModalHeader>请选择起止时间</ModalHeader>
      <div className='flex' style={{padding: 20}}>
        <input type='date' defaultValue={this.state.startDate} ref='startDate'
          style={{border: '1px solid #ccc', flex: 6}} name='startDate' max={this.state.maxDate} />
        <span style={{flex: 1, padding: 5, textAlign: 'center'}}> - </span>
        <input type='date' defaultValue={this.state.endDate} ref='endDate'
          style={{border: '1px solid #ccc', flex: 6}} name='endDate' max={this.state.maxDate} />
      </div>
      <ModalFooter>
        <button className='modalBtn modalBtnBorder' onClick={(e) => {
          this.setState({showFilterModal: false})
        }}>取消</button>
        <button className='modalBtn modalMainBtn' onClick={(e) => {
          this.setState({startDate: this.refs.startDate.value || undefined})
          this.setState({endDate: this.refs.endDate.value || undefined})
          this.setState({showFilterModal: false})
        }}>确定</button>
      </ModalFooter>
    </Modal>
    return modalHtml;
  }

  renderPatientList () {
    const patients = this.props.patients
    let patientArr = []
    _.mapKeys(patients, (patient) => {
      patientArr.push(patient)
    })
    return (
      <FilterCard>
        <FilterSelect
          changePatientSelect={(e) => {
            console.log('------changePatientSelect', e.target.value);
            this.setState({
              selectedId: e.target.value,
              startDate: undefined,
              endDate: undefined
            })
          }}
          patientArr = {patientArr}
        />
        <FilterTime clickShowFilterModal={() => {this.setState({showFilterModal: true})}} />
      </FilterCard>
    )
  }

  render () {
    if (this.props.loading || this.state.isInit) {
      return <div><Loading showLoading={true}></Loading></div>
    }
    if (this.props.error) {
      return <div><ErrCard /></div>
    }
    const { appointments, selectAppointment } = this.props
    const dataList = getListData(this.state, appointments, this.state.selectedId)
    // var height = process.browser ? window.innerHeight - 50 : ''
    // var height = window.innerHeight - 50
    return (
      <div>
        {this.renderModal()}
        {this.renderPatientList()}
        <FilterTimeResult startDate={this.state.startDate} endDate={this.state.endDate} />
        {
          dataList.length > 0 ? dataList.map((item) => {
            return (
              <div key={item.id} onClick={() => {
                selectAppointment({appointmentId: item.id})
                const href = '/appointment/appointment_detail?appointmentId=' + item.id
                const as = '/appointment/appointment_detail'
                Router.push(href, as, { shallow: false })
              }}>
                {this.ItemView(item)}
              </div>
            )
          }) : <NoDataCard />
        }
        <style jsx global>{`
          .listItem {
            margin-top: ${theme.tbmargin};
            background-color: #ffffff;
          }
          .itemTopView {
            background-color: #FBFBFB;
            line-height: 40px;
            padding-left: ${theme.lrmargin};
            align-items: center;
          }
          .topText {
            color: ${theme.fontcolor};
          }
          .unCancelText {
            color: ${theme.maincolor};
            float: right;
            margin-right: ${theme.lrmargin};
          }
          .cancelText {
            color:${theme.fontcolor};
            font-rize: 14px;
            float: right;
            margin-right: ${theme.lrmargin};
          }
          .subView {
            width: 75%;
            float: right;
            justify-content: center;
            margin-left: 10px;
          }
          .centerText {
            font-size: 13px;
            color: #505050;
            margin-bottom: 6px;
          }
          .avatarStyle {
            height: 60px;
            width: 60px;
          }
          .itemBottomView {
            height: 30px;
            padding: 6px ${theme.lrmargin};
            align-items: center;
          }
          .itemBottomView button{
            height: 28px;
            line-height: 28px;
            padding: 0;
            width: 70px;
            border-radius: 3px;
          }
        `}</style>
      </div>
    )
  }
}

const getListData = (state, appointments, patientId) => {
  let array = []
  if (state.startDate || state.endDate) {
    for (let key in appointments) {
      if (state.startDate && state.endDate) {
        if ((new Date(appointments[key].visitSchedule.visitDate) >= new Date(state.startDate)) && (new Date(appointments[key].visitSchedule.visitDate) <= new Date(state.endDate))) {
          if (patientId) {
            if (appointments[key].patientId === patientId) {
              array.push(Object.assign({}, appointments[key], { key }))
            }
          } else {
            array.push(Object.assign({}, appointments[key], { key }))
          }
        }
      } else {
        if (state.startDate) {
          if (new Date(appointments[key].visitSchedule.visitDate) >= new Date(state.startDate)) {
            if (patientId) {
              if (appointments[key].patientId === patientId) {
                array.push(Object.assign({}, appointments[key], { key }))
              }
            } else {
              array.push(Object.assign({}, appointments[key], { key }))
            }
          }
        }
        if (state.endDate) {
          if (new Date(appointments[key].visitSchedule.visitDate) <= new Date(state.endDate)) {
            if (patientId) {
              if (appointments[key].patientId === patientId) {
                array.push(Object.assign({}, appointments[key], { key }))
              }
            } else {
              array.push(Object.assign({}, appointments[key], { key }))
            }
          }
        }
      }
    }
  } else {
    for (let key in appointments) {
      if (patientId) {
        if (appointments[key].patientId === patientId) {
          array.push(Object.assign({}, appointments[key], { key }))
        }
      } else {
        array.push(Object.assign({}, appointments[key], { key }))
      }
    }
  }
  return array
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
