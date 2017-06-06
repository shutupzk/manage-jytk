import React, { Component } from 'react'
import { connect } from 'react-redux'

import {convertCurrency} from '../../../utils'
class PaymentScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectInpatientId: null,
      payValue2: '零元整'

    }
  }
  filterRecord (inpatientRecordArray, selectInpatientId) {
    let inpatientRecord = inpatientRecordArray.filter((inpatientRecord) => {
      if (selectInpatientId === inpatientRecord.patientId) {
        return true
      }
      return false
    })
    return inpatientRecord[0]
  }

  render () {
    var selectInpatientId = this.props.selectInpatientId
    const inpatientRecords = this.props.inpatientRecords
    let inpatientRecordArray = []
    for (let i in inpatientRecords) {
      if (inpatientRecords[i] && inpatientRecords[i].id) {
        inpatientRecordArray.push(inpatientRecords[i])
      }
    }
    return (
      <div>
        { TopList(this.filterRecord(inpatientRecordArray, selectInpatientId))}
        { payValueSet(this) }
        { payTypeList() }
        { payButton() }
      </div>
    )
  }
}

// 用户信息
const TopList = (inpatientRecord) => {
  return (
    <div style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: 10}}>
      <div style={{padding: 10}}>住院号<span style={{float: 'right'}}>{inpatientRecord.inpatientNo}</span></div>
      <div style={{padding: 10}}>姓名<span style={{float: 'right'}}>{inpatientRecord.name}</span></div>
    </div>
  )
}
// 充值金额
const payValueSet = (me) => {
  return (
    <div style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: 10}}>
      <div>充值金额 <span style={{float: 'right'}}>*系统单笔缴纳限额为5000元人民币</span></div>
      <div style={{fontSize: 20, margin: 10}}>
        ¥<input
          onChange={(e) => { me.setState({payValue2: convertCurrency(e.target.value)}) }}
          style={{borderBottom: 'solid 1px #eeeeee', height: '25px', width: '90%', borderLeft: 'none', borderRight: 'none', borderTop: 'none'}} /></div>
      <div style={{fontSize: 20, margin: 10}}>"{me.state.payValue2}"</div>
    </div>
  )
}

// 支付方式
const payTypeList = () => {
  return (
    <div>
      <div style={{padding: '5px 10px'}}>选择支付方式</div>
      <div style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: 10}}>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>微信支付<input type='radio' name='payType' value='weixin' style={{float: 'right'}} /></div>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>支付宝支付<input type='radio' name='payType' value='zhifubao' style={{float: 'right'}} /></div>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>银联支付<input type='radio' name='payType' value='yinlian' style={{float: 'right'}} /></div>
      </div>
    </div>
  )
}
// 支付按钮
const payButton = () => {
  return (
    <div style={{margin: '10px'}}>
      <button style={{width: '100%', backgroundColor: '#3CA0FF', marginTop: 30, display: 'block', borderRadius: 10, padding: 10, textAlign: 'center'}}>确认缴费</button>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    patientsData: state.patients.data,
    patientsLoading: state.patients.loading,
    inpatientLoading: state.inpatient.loading,
    selectInpatientId: state.inpatient.selectInpatientId,
    inpatientRecords: state.inpatient.data
  }
}

export default connect(mapStateToProps)(PaymentScreen)
