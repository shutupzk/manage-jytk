import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Link from 'next/link'
// import * as actions from '../../../ducks'
import DoctorDetail from '../../hospital/components/doctor_detail'
class DoctorDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
  }

  render () {
    console.log(this.props)
    let doctorId = this.props.url.query.doctorId
    console.log(doctorId)
    var doctor = this.props.doctors[doctorId]
    console.log(doctor)
    if (this.props.error) {
      return (
        <div className='container'>error...</div>
      )
    }
    if (this.props.loading) {
      return (
        <div className='container'>loading...</div>
      )
    }
    return (
      <DoctorDetail doctor={doctor} />
    )
  }
}
function mapStateToProps (state) {
  console.log(state)
  return {
    doctors: state.doctors.data,
    error: state.doctors.error,
    loading: state.doctors.loading
  }
}

export default connect(mapStateToProps)(DoctorDetailScreen)
