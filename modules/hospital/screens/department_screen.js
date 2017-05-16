import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// import { withApollo } from 'react-apollo'
import Link from 'next/link'
import * as actions from '../../../ducks'
import DepartmentList from '../components/department_list'
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

  selectDepartment (depId) {
    console.log(depId)
    this.props.selectDepartment(depId)
  }

  render () {
    console.log(this.props)
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
        <div className='container'>
          <DepartmentList deps={deps} params={this.props.url.query} selectDepartment={(depId) => { this.selectDepartment(depId) }} client={this.props.client} />
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
  mapStateToProps, actions
)(DepartmentScreen)

function isEmptyObject (obj) {
  for (let n in obj) { return false }
  return true
}
