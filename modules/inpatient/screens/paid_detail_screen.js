import React, { Component } from 'react'
import {connect} from 'react-redux'

class PaidDetailScreen extends Component {
  render () {
    const deposit = this.props.deposits[this.props.selectDepositId]
    const list = [
      {key: '凭证单号', value: deposit.tradeNo},
      {key: '缴费时间', value: deposit.date},
      {key: '支付方式', value: deposit.payWay},
      {key: '住院号', value: deposit.inpatientNo},
      {key: '患者姓名', value: deposit.patientName},
      {key: '充值金额', value: '￥' + deposit.charge}
    ]
    return (
      <div>
        <div>
          {
            list.map((item, i) => (
              <div
                style={{backgroundColor: '#ffffff', marginBottom: 1, padding: 10}}
                key={i}
              >
                <div>{title(item, i)}</div>
              </div>
            ))
         }
        </div>
      </div>
    )
  }
}

const title = (item) => {
  return (
    <div style={{display: 'flex', padding: '0px 5px'}}>
      <div style={{color: '#797979', fontSize: 15}}>{item.key}</div>
      <div style={{flex: 1, alignItems: 'flex-end'}}>
        <div style={{color: '#505050', fontSize: 15, float: 'right'}}>{item.value}</div>
      </div>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    // userId: state.user.data.id,
    // inpatientId: state.inpatient.selectInpatientId,
    // selectInpatientId: state.inpatient.selectInpatientId,
    // inpatients: state.inpatient.data,
    deposits: state.deposit.data,
    selectDepositId: state.deposit.selectId,
    loading: state.deposit.loading,
    error: state.deposit.error
  }
}

export default connect(mapStateToProps)(PaidDetailScreen)
