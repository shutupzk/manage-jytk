import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import localforage from 'localforage'
import Router from 'next/router'

import SearchBar from './search_bar'
import DepartmentList from '../../hospital/components/department_list'
import { queryDepartments, selectDepartment } from '../../../ducks'
import { isEmptyObject } from '../../../utils'

class AppointmentDepartmentListScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
  }
  componentWillMount () {
    // if (!this.props.token) {
    //   this.getCurrentUser()
    // }
    if (isEmptyObject(this.props.data)) {
      this.getDepartments()
    }
  }
  // async getCurrentUser () {
  //   let userId = await localforage.getItem('userId')
  //   console.log(userId)
  //   this.props.queryUser(this.props.client, { userId })
  // }
  selectDepartment (dep) {
    console.log(dep.id)
    this.props.selectDepartment({departmentId: dep.id})
    var href = {pathname: '/appointment/doctor_list', query: {departmentId: dep.id}}
    Router.push(href)
    // this.props.url.push(href)
  }
  getDepartments () {
    this.props.queryDepartments(this.props.client)
  }
  render () {
    console.log(this.props)
    let department = this.props.departments
    if (!this.props.token) {
      return (
        <div>
          <span>请先登录...</span>
        </div>
      )
    }
    if (this.props.loading && !this.toDetail) {
      return (
        <div>
          <span>loading...</span>
        </div>
      )
    }
    if (this.props.error && !this.toDetail) {
      return (
        <div>
          <span>error...</span>
        </div>
      )
    }
    if (!isEmptyObject(department)) {
      let deps = []
      _.mapValues(department, function (dep) {
        deps.push(dep)
      })
      return (
        <div>
          <div style={{margin: '10px 15px'}}><SearchBar /></div>
          <DepartmentList deps={deps} selectDepartment={(dep) => { this.selectDepartment(dep) }} />
        </div>
      )
    } else {
      return <div>no department</div>
    }
  }
}

function mapStateToProps (state) {
  // let userId = await localforage.getItem('userId')
  // let token = await localforage.getItem('token')
  // let user = {
  //   userId,
  //   token
  // }
  return {
    token: state.user.data.token,
    user: state.user.data,
    departments: state.departments.data,
    loading: state.departments.loading || state.user.loading,
    error: state.departments.error || state.user.error
  }
}
export default connect(mapStateToProps, { queryDepartments, selectDepartment })(AppointmentDepartmentListScreen)
