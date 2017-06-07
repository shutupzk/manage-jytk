import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { isEmptyObject } from '../../../utils'
import {queryDoctors} from '../../../ducks'
import DoctorDetail from '../components/doctor_detail'
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
    const departmentId = this.props.url.query.departmentId
    await this.props.queryDoctors(this.props.client, { departmentId })
    this.setState({toDetail: false})
  }

  gotoEvaluate () {
    let doctorId = this.props.url.query.doctorId
    Router.push('/hospital/departments/doctor_introduce_list/add_doctor_evaluate?doctorId=' + doctorId)
  }

  render () {
    let doctorId = this.props.url.query.doctorId
    var doctor = this.props.doctors[doctorId]
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
      <DoctorDetail doctor={doctor} gotoEvaluate={() => { this.gotoEvaluate() }} />
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

export default connect(mapStateToProps, { queryDoctors })(DoctorDetailScreen)
