import React, { Component } from 'react'
import {theme} from 'components'

// import { isEmptyObject } from '../../../utils'
import Router from 'next/router'
class OrderTypeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      payStatus: false,
      selectedId: ''
    }
  }

  componentWillMount () {

  }
  toPage (key) {
    Router.push('/outpatient?key=' + key)
  }
  render () {
    return (
      <div className='bottomView'>
        <div
          onClick={() => {
            this.toPage('appointment')
          }}>
          <a className='flex tb-flex'>
            <p className='flex tb-flex'>
              挂号费诊金费用
            </p>
            <i className='back-left'></i>
          </a>
        </div>
        <div
          onClick={() => {
            this.toPage('outpatient')
          }}>
          <a className='flex tb-flex'>
            <p className='flex tb-flex'>
              门诊费用
            </p>
            <i className='back-left'></i>
          </a>
        </div>
        <style jsx>{`
          .bottomView {
            border-top: 1px solid ${theme.bordercolor};
            background: #fff;
            margin-top: ${theme.tbmargin};
          }
          .bottomView a{
            border-bottom: 1px solid ${theme.bordercolor};
            padding: 0 .15rem;
            justify-content: space-between;
          }
          .bottomView p{
            color: ${theme.mainfontcolor};
            line-height: 44px;
          }
          .bottomView i{
            transform: rotate(135deg);
          }
        `}</style>
      </div>
    )
  }
}

export default OrderTypeScreen
