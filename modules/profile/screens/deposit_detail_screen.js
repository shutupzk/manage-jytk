import React, {Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'
// import Link from 'next/link'
import { queryPayments, selectPayment } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
import {theme, Loading, ErrCard} from 'components'
class DepositDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {
    if (isEmptyObject(this.props.payments)) {
      this.props.selectPayment({paymentId: this.props.url.query.paymentId})
      this.props.queryPatients(this.props.client)
    }
  }

  render () {
    if (this.props.loading) {
      return (
        <div>
          <Loading showLoading={true} />
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          <ErrCard />
        </div>
      )
    }
    const payments = this.props.payments
    const paymentId = this.props.paymentId || this.props.url.query.paymentId
    const payment = payments[paymentId]
    return (
      <div style={{padding: theme.tbmargin, background: '#fff', color: theme.fontcolor}}>
        <div style={{textAlign: 'center', padding: '10px 0 20px', borderBottom: '1px dashed #fff', borderColor: theme.bordercolor}}>
          <div style={{color: theme.maincolor, fontSize: 26, fontWeight: 'bold'}}>-¥ {payment.chargeTotal}</div>
          <div style={{fontSize: theme.nfontsize}}>支付成功</div>
        </div>
        <div style={{borderBottom: '1px dashed #fff', borderColor: theme.bordercolor, lineHeight: '26px', padding: '10px 0'}}>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>费用类别</div>
            <div>{payment.typeName}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>类型详情</div>
            <div>{payment.typeInfo}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>凭证单号</div>
            <div>{payment.tradeNo}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>流水号</div>
            <div>{payment.transactionNo}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>交易时间</div>
            <div>{payment.date}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>交易方式</div>
            <div>{payment.payWay}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>当前状态</div>
            <div>{payment.status}</div>
          </div>
        </div>
        <div style={{lineHeight: '26px', paddingTop: theme.tbmargin}}>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>就诊人姓名</div>
            <div>{payment.patientName}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>就诊人ID</div>
            <div>{payment.patientIdNo}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1'}}>就诊人手机</div>
            <div>{payment.phone}</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    payments: state.payments.data,
    paymentId: state.payments.selectId,
    loading: state.payments.loading,
    error: state.payments.error
  }
}

export default connect(mapStateToProps, { queryPayments, selectPayment })(DepositDetailScreen)
