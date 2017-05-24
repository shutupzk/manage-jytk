import React, { Component } from 'react'
import { connect } from 'react-redux'
// import _ from 'lodash'

import DoctorList from '../components/doctor_list'
import { queryDoctors, selectDoctor } from '../../../ducks'

const filterDepartments = (departmentIds, departmentId) => {
  let ids = departmentIds.filter((id) => {
    if (departmentId === id) {
      return true
    }
    return false
  })
  if (ids.length > 0) {
    return true
  }
}

const isExistDepartment = (doctors, departmentId) => {
  let selectDoctors = []
  for (let key in doctors) {
    if (filterDepartments(doctors[key].departmentIds, departmentId)) {
      selectDoctors.push(doctors[key])
    }
  }
  return selectDoctors
}

class DoctorScreen extends Component {
  // constructor (props) {
  //   super(props)
  // }
  componentWillMount () {
    this.queryData()
  }
  queryData () {
    // var depId = getQueryString('id')
    let departmentId = this.props.url.query.departmentId
    this.props.queryDoctors(this.props.client, { departmentId })
    // this.props.queryDoctors({departmentId: '58eb4faec77c0857c9dc5b0c'})
  }

  render () {
    console.log(this.props)
    let departmentId = this.props.url.query.departmentId
    let doctors = this.props.doctorsData
    let selectDoctors = isExistDepartment(doctors, departmentId)
    if (this.props.loading) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <h1>error...</h1>
        </div>
      )
    }
    // var docArr = []
    // _.mapValues(selectDoctors, function (doc) {
    //   docArr.push(doc)
    // })
    return (
      <div className='container'>
        <DoctorList doctors={selectDoctors} toUrl='/hospital/departments/doctor_introduce_list/doctor_detail' />
        {/* {tab(selectDoctors)} */}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    departmentId: state.departments.selectId,
    doctorsData: state.doctors.data,
    loading: state.doctors.loading,
    error: state.doctors.error
  }
}

export default connect(
  mapStateToProps, {queryDoctors, selectDoctor}
)(DoctorScreen)
