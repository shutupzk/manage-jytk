import React, { Component } from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'

import {selectDepartment} from 'ducks'
import { Loading, theme, ErrCard } from 'components'

class DiagnosisResultScreen extends Component {
  render () {
    if (this.props.loading) {
      return (
        <Loading />
      )
    }
    if (this.props.error) {
      return (
        <ErrCard />
      )
    }
    const results = []
    return (
      <div>
        {
          results.map((result) => {
            return (
              <div>1</div>
            )
          })
        }
        <div>
          <div className={'result-item header'}>
            <div className='label'>可能疾病</div>
            <div className='text'>{'眼脸痉挛'}</div>
          </div>
          <div className={'result-item'}>
            <div className='label'>疾病简介</div>
            <div className='text'>{'眼脸痉挛'}</div>
          </div>
          <div className={'result-item'}>
            <div className='label'>常见症状</div>
            <div className='text'>{'不自主眼部跳动'}</div>
          </div>
          <div className={'result-item last'}>
            <div className='label'>推荐科室</div>
            <div className='text'>{'普通眼科'}</div>
            <div className='linkDiv' onClick={() => {
              const departmentId = '58eb4fb7c77c0857c9dc5b0d'
              this.props.selectDepartment({departmentId})
              Router.push('/appointment/doctor_list?departmentId=' + departmentId)
            }}>去挂号></div>
          </div>
        </div>
        <style jsx>{`
          .result-item {
            padding: 10px;
            background-color: #fff;
            margin-bottom: 1px;
          }
          .header{
            text-align: center;
          }
          .result-item .label{
            color: #D4D4D4;
            padding: 0px 5px;
          }
          .result-item .text{
            color: ${theme.mainfontcolor};
            padding: 0px 5px;
          }
          .last {
            display: flex;
          }
          .last .linkDiv {
            flex: 2;
            color: ${theme.maincolor};
            text-align: right;
            float: right;
            font-weight: bold;
          }
        `}</style>
      </div>
    )
  }
}

export default connect(null, {selectDepartment})(DiagnosisResultScreen)
