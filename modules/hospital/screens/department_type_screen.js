import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Link from 'next/link'
import { queryDepartmentTypes } from '../../../ducks'
import {Loading, ErrCard} from 'components'

class DepartmentTypeScreen extends Component {
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
    this.props.queryDepartmentTypes()
  }

  render () {
    let departmentType = this.props.departmentType
    if (departmentType.loading && !this.toDetail) {
      return (
        <div>
          <h1><Loading showLoading={true} /></h1>
        </div>
      )
    }
    if (departmentType.error && !this.toDetail) {
      return (
        <div>
          <h1><ErrCard /></h1>
        </div>
      )
    }
    if (!isEmptyObject(departmentType.data)) {
      let deps = []
      _.mapValues(departmentType.data, function (dep) {
        deps.push(dep)
      })
      return (
        <div className='container'>
          {
            deps.map((dep) => {
              return (
                <Link key={dep.id} href={`/hospital/department_types/departments?id=${dep.id}`} prefetch>
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
  return {
    departmentType: state.departmentTypes
  }
}
export default connect(
  mapStateToProps, { queryDepartmentTypes }
)(DepartmentTypeScreen)

function isEmptyObject (obj) {
  for (let n in obj) { return false }
  return true
}
