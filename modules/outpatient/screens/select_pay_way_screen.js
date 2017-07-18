import React, { Component } from 'react'
import { connect } from 'react-redux'
import {PayWay, Prompt} from 'components'
import Router from 'next/router'
import localforage from 'localforage'
// import {convertCurrency} from '../../../utils'
import {queryOutpatientDetail, selectOutpatient, createPayment} from '../../../ducks'
class SelectPayWayScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
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
  wxPayment (params, callback) {
    const componentThis = this
    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', componentThis.onBridgeReady, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', componentThis.onBridgeReady)
        document.attachEvent('onWeixinJSBridgeReady', componentThis.onBridgeReady)
      }
    } else {
      componentThis.onBridgeReady(params, callback)
    }
  }

  onBridgeReady (params, callback) {
    // alert('onBridgeReady');
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', params, callback
    )
  }

  async goPay (outpatient, payWay) {
    if (!payWay) {
      return this.setState({
        isShow: true,
        promptContent: '请选择支付方式'
      })
    }
    if (payWay === 'carteVital') {
      Router.push('/outpatient/carte_vital_pay')
      return
    }
    if (payWay === 'WECHAT') {
      const openId = await localforage.getItem('openId')
      const error = await this.props.createPayment(this.props.client, { openId, payWay, totalFee: outpatient.chargeTotal, typeName: '挂号缴费', typeInfo: '东川门诊内科-挂号缴费', outpatientId: outpatient.id })
      const param = JSON.parse(this.props.orderInfo.orderInfo)
      const params = {
        appId: param.appId,
        timeStamp: param.timeStamp,
        nonceStr: param.nonceStr,
        signType: param.signType,
        package: param.package,
        paySign: param.paySign
      }
      if (!error) {
        this.wxPayment(params, (res) => {
            // window.alert(res.err_msg);
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            Router.push('/pay/success')
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            // window.alert('支付失败，请重新支付');
            Router.push('/pay/fail')
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            // window.alert('支付取消');
          }
        })
      }
    }
  }
  render () {
    const { outpatients, outpatientId } = this.props
    const outpatient = outpatients[outpatientId]
    return (
      <div>
        <PayWay orderNo={outpatient.seqNo} payMoney={outpatient.chargeTotal} goPay={(payWay) => { this.goPay(payWay) }} />
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    outpatientId: state.outpatient.selectId,
    outpatients: state.outpatient.data,
    orderInfo: state.orderInfo.data,
    loading: state.outpatient.loading,
    error: state.outpatient.error
  }
}

export default connect(mapStateToProps, {queryOutpatientDetail, selectOutpatient, createPayment})(SelectPayWayScreen)
