import React, { Component } from 'react'
import {theme, Prompt} from 'components'
import { connect } from 'react-redux'
import {queryOutpatientDetail, selectOutpatient} from '../../../ducks'
import { phone } from '../../../utils'
import Router from 'next/router'
class BindCarteVitalScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      closeTime: 2,
      autoClose: true,
      isShow: false,
      promptContent: ''
    }
  }

  componentWillMount () {
    this.queryOutPayments()
  }

  async queryOutPayments () {
    this.setState({isInit: true})
    if (!this.props.outpatientId) {
      this.props.selectOutpatient({id: this.props.url.query.outpatientId})
      await this.props.queryOutpatientDetail(this.props.client, {id: this.props.outpatientId || this.props.url.query.outpatientId})
    }
    this.setState({isInit: false})
  }

  submit (props) {
    console.log(props)
  }

  render () {
    const { outpatients, outpatientId } = this.props
    const outpatient = outpatients[outpatientId]
    return (
      <div>
        <div>
          <div className='item'>
            <div className='label'>就诊人</div>
            <div className='text'>{outpatient.patientName}</div>
          </div>
          <div className='item'>
            <div className='label'>手机号</div>
            <div className='text'>{phone(outpatient.patientPhone)}</div>
          </div>
          <div style={{marginTop: 10, padding: 10, fontWeight: 'bold'}}>请输入医保卡号</div>
          <div className=''>
            <input />
          </div>
          <footer style={{margin: '30px 15px'}}>
            <button
              className='btnBG btnBGMain loginPageBtnItem'
              onClick={() => this.submit(this.props)}>确定</button>
          </footer>
          <div className='notice'>
            <div>
              *请确保手机号与办理医保卡时填写的手机号相同，否则无法使用医保卡在线支付。
            </div>
          </div>
        </div>
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
        <style jsx>{`
          .item {
            display: flex;
            padding: 10px;
            margin-bottom: 1px;
            background-color: #fff;
          }
          .label {
            flex: 3;
            color: #d0d0d0;
          }
          .text {
            flex: 9;
            color: #000;
          }
          .notice {
            margin: 25px;
          }
          input {
            width: 100%;
            padding: 0px 10px;
            height: 40px;
            background-color: #fff;
          }
        `}</style>
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    outpatientId: state.outpatient.selectId,
    outpatients: state.outpatient.data,
    loading: state.outpatient.loading,
    error: state.outpatient.error
  }
}

export default connect(mapStateToProps, {queryOutpatientDetail, selectOutpatient})(BindCarteVitalScreen)
