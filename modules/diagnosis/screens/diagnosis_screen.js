import React, {Component } from 'react'
import {connect} from 'react-redux'
import Link from 'next/link'

class DiagnosisScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gender: true,
      frontBack: true
    }
  }
  render () {
    return (
      <div style={{backgroundColor: '#fff'}}>
        智能导诊
        {/*<div style={{padding: 20, textAlign: 'right', fontWeight: 'bold'}}><Link href='/diagnosis/body_parts'><a>列表</a></Link></div>
        <div style={{display: 'flex', padding: 20}}>
          <div style={{flex: 2, textAlign: 'right'}}><div onClick={() => { this.setState({gender: !this.state.gender}) }}>{this.state.gender ? '女' : '男'}</div></div>
          <div style={{flex: 7, textAlign: 'center', height: 500}}>{
            this.state.gender && this.state.frontBack
            ? <div>{'女前'}</div>
            : (
                this.state.gender && !this.state.frontBack
                ? <div>{'女后'}</div>
                : (
                    !this.state.gender && this.state.frontBack
                    ? <div>{'男前'}</div>
                    : <div>{'男后'}</div>
                  )
              )
          }</div>
          <div style={{flex: 3, paddingTop: 480}}><div onClick={() => { this.setState({frontBack: !this.state.frontBack}) }}>{this.state.frontBack ? '前' : '后'}</div></div>
        </div>*/}
      </div>
    )
  }
}

export default connect()(DiagnosisScreen)
