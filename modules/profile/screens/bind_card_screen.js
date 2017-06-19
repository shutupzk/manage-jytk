import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Router from 'next/router'
// import swal from 'sweetalert2'

import { updatePatient } from '../../../ducks'

/**
 * 绑定医保卡
 */
class BindCardScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  // 提交
  async submit () {
    const patientId = this.props.patientId || this.url.query.patientId
    const carteVital = this.state.carteVital
    if (!carteVital) {
      return console.log('请输入医保卡')
    }
    this.setState({animating: true})
    const error = await this.props.updatePatient(this.props.client, { patientId, carteVital })
    if (error) return console.log(error)
    this.props.url.back()
  }
  render () {
    if (this.props.error) {
      return (
        <div>error...</div>
      )
    }
    if (this.props.loading) {
      return (
        <div>loading...</div>
      )
    }
    return (<div>
      <div>
        <div className='item' key={'carteVital'}>
          <span className='textLeft'>医保卡</span>
          <input placeholder={'输入医保卡'} style={{float: 'right', width: '72%', marginRight: 15}} className='textInput'
            onChange={(e) => this.setState({ carteVital: e.target.value })} />
        </div>
      </div>
      <button title='确定' onClick={() => this.submit()} style={{display: 'block', width: '100%', borderRadius: '10px', height: 40}}>确定</button>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
      <style jsx>{`
        .item {
          padding: 10px;
          height: 51px;
          flex-wrap: nowrap;
          align-items: center;
          flex-direction: row;
          background-color: #ffffff;
          justify-content: 'space-between';
          margin-bottom: 10px;
        }
        .textLeft {
          flex: 1;
          font-size: 16px;
          color: #505050;
          margin-left: 15px;
        }
      `}</style>
    </div>)
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    patientId: state.patients.selectId,
    loading: state.patients.loading,
    error: state.patients.error
  }
}

export default connect(mapStateToProps, { updatePatient })(BindCardScreen)
