import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'
// import _ from 'lodash'

import DoctorList from '../components/doctor_list'
import { queryDoctors, selectDoctor, queryMyDoctors, setQueryFlag } from '../../../ducks'
import { isEmptyObject } from '../../../utils'

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
  constructor (props) {
    super(props)
    this.state = {
      isInit: false
    }
  }
  componentWillMount () {
    if (isEmptyObject(this.props.doctorsData) || this.props.queryFlag !== 'hospitalDoctors') {
      this.queryData()
    }
  }
  async queryData () {
    // var depId = getQueryString('id')
    this.setState({isInit: true})
    let departmentId = this.props.departmentId || this.props.url.query.departmentId
    await this.props.queryDoctors(this.props.client, { departmentId })
    this.props.setQueryFlag({flag: 'hospitalDoctors'})
    const userId = await localforage.getItem('userId')
    this.setState({userId})
    // this.props.queryMyDoctors(this.props.client, {userId})
    this.setState({isInit: false})
    // this.props.queryDoctors({departmentId: '58eb4faec77c0857c9dc5b0c'})
  }
  toUrl (docId) {
    Router.push('/hospital/departments/doctor_introduce_list/doctor_detail?departmentId=' + this.props.url.query.departmentId + '&doctorId=' + docId)
  }

  render () {
    if (this.props.loading || this.state.isInit) {
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
    let departmentId = this.props.departmentId || this.props.url.query.departmentId
    let doctors = this.props.doctorsData
    // console.log(doctors)
    let selectDoctors = isExistDepartment(doctors, departmentId)
    // var docArr = []
    // _.mapValues(selectDoctors, function (doc) {
    //   docArr.push(doc)
    // })
    return (
      <div className='container'>
        <DoctorList doctors={selectDoctors} userId={this.state.userId} toUrl={(docId) => { this.toUrl(docId) }} />
        {/* {tab(selectDoctors)} */}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    departmentId: state.departments.selectId,
    queryFlag: state.doctors.queryFlag,
    doctorsData: state.doctors.data,
    loading: state.doctors.loading,
    error: state.doctors.error
  }
}

export default connect(
  mapStateToProps, {queryDoctors, selectDoctor, queryMyDoctors, setQueryFlag}
)(DoctorScreen)
