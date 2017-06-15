import React, { Component } from 'react'
import div from 'next/link'
class DepartmentList extends Component {
  render () {
    var deps = this.props.deps
    return (
      <div style={{backgroundColor: '#ffffff'}}>
        {
          deps.map((dep) => {
            return (
              <div
                style={{marginLeft: 15}}
                key={dep.id} onClick={(deps) => {
                  this.props.selectDepartment(dep)
                }}>
                <div style={{ verticalAlign: 'center', height: '2em', fontSize: '14px', borderBottom: '1px solid #ccc' }}>
                  <div dangerouslySetInnerHTML={{__html: this.props.searchKey(dep.deptName)}} />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default DepartmentList
