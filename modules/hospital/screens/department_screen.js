import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Link from 'next/link'
import * as actions from '../../../ducks'
// import Link from 'next/link'

class DepartmentScreen extends Component {
  constructor (props) {
    super(props)
    this.toDetail = false
  }

  componentWillMount () {
    if (isEmptyObject(this.props.data)) {
      this.getDepartments()
    }
  }

  getDepartments () {
    this.props.queryDepartments()
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
        <div className='container'>
          {
            deps.map((dep) => {
              return (
                <Link key={dep.id} href={`/hospital/departments/department_detail?id=${dep.id}`} prefetch>
                  <div style={{ verticalAlign: 'center', height: '2em', fontSize: '14px', borderBottom: '1px solid #ccc' }}>{dep.deptName}</div>
                </Link>
              )
            })
          }
        </div>
      )
    } else {
      return <div>no department</div>
    }
  }
}

function mapStateToProps (state) {
  console.log(state)
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
