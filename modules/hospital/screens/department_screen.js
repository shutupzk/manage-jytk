import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Router from 'next/router'

import {queryDepartments, selectDepartment} from '../../../ducks'
import DepartmentList from '../components/department_list'
import { replaceSearchKey } from '../../../utils'
// import Link from 'next/link'

class DepartmentScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
  }

  componentWillMount () {
    this.getDepartments()
  }

  getDepartments () {
    this.props.queryDepartments(this.props.client)
  }

  selectDepartment (dep) {
    this.props.selectDepartment({departmentId: dep.id})
    var href = {pathname: `/hospital/departments/${this.props.url.query.toScreenKey}`, query: {departmentId: dep.id}}
    Router.push(href)
  }

  render () {
    let department = this.props.department
    if (department.loading && !this.toDetail) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      )
    }
    if (department.error && !this.toDetail) {
      return (
        <div>
          <h1>error...</h1>
        </div>
      )
    }
    if (!isEmptyObject(department.data)) {
      let deps = []
      _.mapValues(department.data, function (dep) {
        deps.push(dep)
      })
      return (
        <div>
          <DepartmentList deps={deps} selectDepartment={(dep) => { this.selectDepartment(dep) }} searchKey={(text) => { return replaceSearchKey(text, 'undefind') }} />
        </div>
      )
    } else {
      return <div>no department</div>
    }
  }
}

function mapStateToProps (state) {
  return {
    department: state.departments
  }
}
export default connect(
  mapStateToProps, {queryDepartments, selectDepartment}
)(DepartmentScreen)

function isEmptyObject (obj) {
  for (let n in obj) { return false }
  return true
}
