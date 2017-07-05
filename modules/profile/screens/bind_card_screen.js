import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Router from 'next/router'
import {theme, ErrCard, Loading} from 'components'

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
        <div><ErrCard /></div>
      )
    }
    if (this.props.loading) {
      return (
        <div><Loading showLoading={true} /></div>
      )
    }
    return (
      <div className='list'>
      <div className='item flex tb-flex' key={'carteVital'}>
        <span className='textLeft'>医保卡</span>
        <input placeholder={'输入医保卡'} className='textInput'
          onChange={(e) => this.setState({ carteVital: e.target.value })} />
      </div>
      <footer style={{margin: '20px 15px'}}>
        <button title='确定' className='btnBG btnBGMain' onClick={() => this.submit()}>确定</button>
      </footer>
      {/* <Popup ref={popup => { this.popup = popup }} /> */}
      <style jsx>{`
        .item {
          padding: 10px 20px;
          {/*height: 31px;*/}
          {/*flexWrap: nowrap;*/}
          align-items: center;
          flexDirection: row;
          background-color: #ffffff;
          justifyContent: space-between;
          margin-bottom: 1px;
        }
        .textLeft {
          {/*font-size: ;*/}
          color: ${theme.fontcolor};
          font-size: ${theme.fontsize};
          padding-right: ${theme.tbmargin};
        }
        .textInput{
          border: none;
          background: #fff;
          font-size: ${theme.fontsize};
          color: ${theme.mainfontcolor};
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
