import React, { Component } from 'react'
export default class PayWay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      payWay: undefined
    }
  }

  render () {
    const { orderNo, payMoney } = this.props
    return (
      <div>
        { topList(orderNo, payMoney)}
        { payTypeList(this) }
        { payButton(this.props, this.state.payWay) }
      </div>
    )
  }
}
// 订单信息
const topList = (orderNo, payMoney) => {
  return (
    <div>
      <div style={{marginBottom: 1, display: 'flex', backgroundColor: '#fff', padding: '10px 15px'}}>
        <div style={{flex: 3}}>订单号: </div>
        <div style={{flex: 10}}>{orderNo}</div>
      </div>
      <div style={{marginBottom: 1, display: 'flex', backgroundColor: '#fff', padding: '10px 15px'}}>
        <div style={{flex: 3}}>支付金额: </div>
        <div style={{flex: 10}}>￥{payMoney}</div>
      </div>
    </div>
  )
}
function getRadioBoxValue (radioName) {
  var obj = document.getElementsByName(radioName)
  for (let i in obj) {
    if (obj[i].checked) {
      return obj[i].value
    }
  }
  return undefined
}
// 支付方式
const payTypeList = (me) => {
  return (
    <div>
      <div style={{padding: '5px 10px'}}>选择支付方式</div>
      <div style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: 10}}>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>微信支付<input type='radio' name='payType' value='WECHAT' style={{float: 'right'}} onClick={(e) => {
          const payWay = getRadioBoxValue('payType')
          me.setState({payWay})
        }} /></div>
        {/*<div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>支付宝支付<input type='radio' name='payType' value='ALIPY' style={{float: 'right'}} onClick={(e) => {
          const payWay = getRadioBoxValue('payType')
          me.setState({payWay})
          console.log(e.target.value)
        }} /></div>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>银联支付<input type='radio' name='payType' value='unionpay' style={{float: 'right'}} onClick={(e) => {
          const payWay = getRadioBoxValue('payType')
          me.setState({payWay})
          console.log(e.target.value)
        }} /></div>*/}
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>医保卡支付<input type='radio' name='payType' value='carteVital' style={{float: 'right'}} onClick={(e) => {
          const payWay = getRadioBoxValue('payType')
          me.setState({payWay})
          console.log(e.target.value)
        }} /></div>
      </div>
    </div>
  )
}
// 支付按钮
const payButton = (props, payWay) => {
  return (
    <div style={{margin: '10px'}} onClick={() => { props.goPay(payWay) }}>
      <button className='btnBG btnBGMain'>确认缴费</button>
    </div>
  )
}
