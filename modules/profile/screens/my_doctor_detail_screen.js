import React, { Component } from 'react'
import { connect } from 'react-redux'
import localforage from 'localforage'
// import Link from 'next/link'
import { signin, queryUser, queryMyDoctors, createUserHasDoctor, removeUserHasDoctor } from '../../../ducks'
import {DoctorDetail} from '../../hospital/components'
import { isEmptyObject } from '../../../utils'
class DoctorDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {toDetail: false, isMyDoctor: true}
  }

  componentWillMount () {
    if (isEmptyObject(this.props.doctors)) {
      this.setState({toDetail: true})
      this.getMyDoctors()
    }
  }

  async getMyDoctors () {
    const error = await this.props.signin({ username: null, password: null })
    if (error) return console.log(error)
    const userId = this.props.userId
    if (userId) {
      this.props.queryMyDoctors(this.props.client, { userId })
    }
    this.setState({toDetail: false})
  }

  async saveOrCancelMyDoctor (isMyDoc) {
    let doctorId = this.props.url.query.doctorId
    var doctor = this.props.doctors[doctorId]
    const userId = this.props.userId || await localforage.getItem('userId')
    if (isMyDoc) {
      const data = await this.props.removeUserHasDoctor(this.props.client, {id: doctor.userHasDoctorId, userId, doctorId: doctor.id})
      if (!data.error && data.data.isRemove) {
        this.setState({isMyDoctor: false})
      }
    } else {
      const data = await this.props.createUserHasDoctor(this.props.client, {userId, doctorId: doctor.id})
      if (!data.error) {
        this.setState({isMyDoctor: true})
      }
    }
  }

  render () {
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
    const doctorId = this.props.doctorId || this.props.url.query.doctorId
    var doctor = this.props.doctors[doctorId]
    let isMyDoc = this.state.isMyDoctor
    return (
      <div>
        <DoctorDetail doctor={doctor} isMyDoc={isMyDoc} toMyDoctor={() => { this.saveOrCancelMyDoctor(isMyDoc) }} />
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    userId: state.user.data.id,
    user: state.user.data,
    doctorId: state.doctors.data.selectId,
    doctors: state.doctors.data,
    error: state.doctors.error,
    loading: state.doctors.loading || state.user.loading
  }
}

export default connect(mapStateToProps, {signin, queryUser, queryMyDoctors, createUserHasDoctor, removeUserHasDoctor})(DoctorDetailScreen)
