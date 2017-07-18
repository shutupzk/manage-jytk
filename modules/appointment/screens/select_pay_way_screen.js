import React, { Component } from 'react'
import localforage from 'localforage'
import { connect } from 'react-redux'
import Router from 'next/router'
import {PayWay, Prompt} from 'components'
// import {convertCurrency} from '../../../utils'
import {createPayment} from 'ducks'
class SelectPayWayScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      closeTime: 2,
      autoClose: true,
      isShow: false,
      promptContent: ''
    }
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

  async goPay (appointment, payWay) {
    if (!payWay) {
      return this.setState({
        isShow: true,
        promptContent: '请选择支付方式'
      })
    }
    if (payWay === 'WECHAT') {
      const openId = await localforage.getItem('openId')
      const error = await this.props.createPayment(this.props.client, { openId, payWay, totalFee: appointment.visitSchedule.registerFee, typeName: '挂号缴费', typeInfo: '东川门诊内科-挂号缴费', appointmentId: appointment.id })
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
    } else {
      window.alert('暂不支持')
    }
  }

  render () {
    const { appointments, appointmentId } = this.props
    const appointment = appointments[appointmentId]
    return (
      <div>
        <PayWay orderNo={appointment.seqNo} payMoney={appointment.visitSchedule.registerFee} goPay={(payWay) => { this.goPay(appointment, payWay) }} />
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    appointments: state.appointments.data,
    appointmentId: state.appointments.selectId,
    orderInfo: state.orderInfo.data,
    patients: state.patients.data,
    error: state.appointments.error,
    loading: state.appointments.loading
  }
}

export default connect(mapStateToProps, {createPayment})(SelectPayWayScreen)
