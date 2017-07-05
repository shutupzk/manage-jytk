import React, { Component } from 'react'
import div from 'next/link'
import {theme} from 'components'

class DepartmentList extends Component {
  render () {
    var deps = this.props.deps
    return (
      <div style={{backgroundColor: '#ffffff'}}>
        {
          deps.map((dep) => {
            return (
              <div
                key={dep.id} onClick={(deps) => {
                  this.props.selectDepartment(dep)
                }}
                className='item'>
                <div dangerouslySetInnerHTML={{__html: this.props.searchKey(dep.deptName)}} />
                <style jsx>{`
                  .item{
                    margin-left: ${theme.lrmargin};
                    border-bottom: 1px solid ${theme.bordercolor};
                    line-height: .4rem;
                    color: ${theme.mainfontcolor};
                    font-size: ${theme.fontsize};
                  }
                  .item:last-child{
                    border-bottom: 0px solid ${theme.bordercolor};
                  }
                `}</style>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default DepartmentList
