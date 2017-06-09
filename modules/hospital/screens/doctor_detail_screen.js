import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'

import { isEmptyObject } from '../../../utils'
import {queryDoctors, createUserHasDoctor, removeUserHasDoctor} from '../../../ducks'
import DoctorDetail from '../components/doctor_detail'
class DoctorDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {toDetail: false, userId: ''}
  }
  componentWillMount () {
    this.getUserId()
    if (isEmptyObject(this.props.doctors)) {
      this.setState({toDetail: true})
      this.getMyDoctors()
    }
  }
  async getUserId () {
    var userId = await localforage.getItem('userId')
    this.setState({userId})
  }
  async getMyDoctors () {
    const departmentId = this.props.url.query.departmentId
    await this.props.queryDoctors(this.props.client, { departmentId })
    this.setState({toDetail: false})
  }

  gotoEvaluate () {
    let doctorId = this.props.url.query.doctorId
    Router.push('/hospital/departments/doctor_introduce_list/add_doctor_evaluate?doctorId=' + doctorId)
  }

  saveOrCancelMyDoctor (isMyDoc) {
    let doctorId = this.props.url.query.doctorId
    var doctor = this.props.doctors[doctorId]
    const userId = this.state.userId
    if (isMyDoc) {
      this.props.removeUserHasDoctor(this.props.client, {id: doctor.userHasDoctorId})
    } else {
      this.props.createUserHasDoctor(this.props.client, {userId, doctorId: doctor.id})
    }
  }

  render () {
    let doctorId = this.props.url.query.doctorId
    var doctor = this.props.doctors[doctorId]
    const userId = this.state.userId
    let isMyDoc = false
    if (doctor.userIds.indexOf(userId) > -1) {
      isMyDoc = true
    }
    if (this.props.error) {
      return (
        <div className='container'>error...</div>
      )
    }
    if (this.props.loading || this.state.toDetail) {
      return (
        <div className='container'>loading...</div>
      )
    }
    return (
      <DoctorDetail doctor={doctor} isMyDoc={isMyDoc} toMyDoctor={() => { this.saveOrCancelMyDoctor(isMyDoc) }} gotoEvaluate={() => { this.gotoEvaluate() }} />
    )
  }
}
function mapStateToProps (state) {
  return {
    doctors: state.doctors.data,
    error: state.doctors.error,
    loading: state.doctors.loading
  }
}

export default connect(mapStateToProps, { queryDoctors, createUserHasDoctor, removeUserHasDoctor })(DoctorDetailScreen)
