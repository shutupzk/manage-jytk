import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Link from 'next/link'
import { signin, queryUser, queryMyDoctors } from '../../../ducks'
import {DoctorDetail} from '../../hospital/components'
import { isEmptyObject } from '../../../utils'
class DoctorDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {toDetail: false}
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
    const userId = this.props.userId
    let isMyDoc = false
    if (doctor.userIds.indexOf(userId) > -1) {
      isMyDoc = true
    }
    return (
      <div>
        <DoctorDetail doctor={doctor} isMyDoc={isMyDoc} />
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    userId: state.user.data.id,
    user: state.user.data,
    doctorId: state.doctors.data.selectId,
    doctors: state.doctors.data,
    error: state.doctors.error,
    loading: state.doctors.loading || state.user.loading
  }
}

export default connect(mapStateToProps, {signin, queryUser, queryMyDoctors})(DoctorDetailScreen)
