import React, { Component } from 'react'

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
      <div>
        <div
          style={{backgroundColor: '#fff', marginBottom: 1, padding: '10px 15px', display: 'flex'}}
          onClick={() => {
            this.toPage('appointment')
          }}
        >
          <div style={{flex: 10}}>挂号费诊金费用</div>
          <div style={{flex: 2, textAlign: 'right'}}>></div>
        </div>
        <div
          style={{backgroundColor: '#fff', marginBottom: 1, padding: '10px 15px', display: 'flex'}}
          onClick={() => {
            this.toPage('outpatient')
          }}
        >
          <div style={{flex: 10}}>门诊费用</div>
          <div style={{flex: 2, textAlign: 'right'}}>></div>
        </div>
      </div>
    )
  }
}

export default OrderTypeScreen
