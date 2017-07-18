import React, { Component } from 'react'
class PayStatus extends Component {
  render () {
    return (
      <div style={{backgroundColor: '#fff', padding: 20}}>
        <div>
          <div style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#03417D', margin: '20px'}}>缴费结果</div>
        </div>
        <div>
          <div style={{fontSize: 20, textAlign: 'center'}}>{this.props.status === true ? '  支付成功' : '  支付失败'}</div>
        </div>
        <div>
          <div style={{fontSize: 15, margin: '20px'}}>{this.props.status === true ? '您好！支付成功，请点击完成回到费用详情页面进行查看。' : '您好！支付失败，请核对信息后重新支付。'}</div>
        </div>
      </div>
    )
  }
}

export default PayStatus
