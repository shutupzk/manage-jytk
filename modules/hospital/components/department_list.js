import React, { Component } from 'react'
import Link from 'next/link'
class DepartmentList extends Component {
  render () {
    var deps = this.props.deps
    var params = this.props.params
    console.log(params)
    return (
      <div>
        {
          deps.map((dep) => {
            var href = {pathname: '/hospital/departments/' + params.toScreenKey, query: {departmentId: dep.id}}
            return (
              <Link key={dep.id} href={href} onClick={() => {
                this.props.selectDepartment(dep.id)
              }} prefetch>
                <div style={{ verticalAlign: 'center', height: '2em', fontSize: '14px', borderBottom: '1px solid #ccc' }}>{dep.deptName}</div>
              </Link>
            )
          })
        }
      </div>
    )
  }
}

export default DepartmentList
