import React, { Component } from 'react'
import { connect } from 'react-redux'
import {theme} from 'components'

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
    <div style={{backgroundColor: '#ffffff', marginBottom: 10, color: theme.mainfontcolor}}>
      <div style={{padding: 10, borderBottom: '1px solid #e6e6e6'}}>住院号<span style={{float: 'right', color: theme.fontcolor}}>{inpatientRecord.inpatientNo}</span></div>
      <div style={{padding: 10, borderBottom: '1px solid #e6e6e6'}}>姓名<span style={{float: 'right', color: theme.fontcolor}}>{inpatientRecord.name}</span></div>
    </div>
  )
}
// 充值金额
const payValueSet = (me) => {
  return (
    <div style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: 10}}>
      <div>充值金额 <span style={{float: 'right', fontSize: '12px', color: theme.nfontcolor}}>*系统单笔缴纳限额为5000元人民币</span></div>
      <div style={{fontSize: 30, margin: '20px 10px', color: theme.mainfontcolor,paddingBottom: theme.tbmargin, borderBottom: '1px solid #eee'}}>
        ¥<input
          onChange={(e) => { me.setState({payValue2: convertCurrency(e.target.value)}) }}
          style={{borderBottom: 'solid 1px #eeeeee', height: '25px', fontSize: 30, width: '90%', border: 'none', textIndent: '6px'}} /></div>
      <div style={{fontSize: theme.fontSize, margin: '10px 10px 0'}}>"{me.state.payValue2}"</div>
    </div>
  )
}

// 支付方式
const payTypeList = () => {
  return (
    <div>
      <div style={{padding: '5px 10px', fontSize: theme.nfontsize}}>选择支付方式</div>
      <div className='flex tb-flex' style={{padding: '0 15px', justifyContent: 'space-between', background: '#fff'}}>
        微信支付
        <svg width="44px" height="44px" viewBox="642 717 88 88" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <desc>Created with Sketch.</desc>
          <defs></defs>
          <g id="pay_selected" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(642.000000, 717.000000)">
            <rect id="Cell-Frame" x="0" y="0" width="88" height="88"></rect>
            <ellipse id="Circle" fill="#03417D" cx="44" cy="44" rx="22" ry="22"></ellipse>
            <polyline id="Check" stroke="#FFFFFF" stroke-width="3" points="33 45 40 52 56 36"></polyline>
          </g>
        </svg>
        {/*<input type='radio' name='payType' value='weixin' style={{float: 'right'}} />*/}
      </div>
      {/*<div style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: 10}}>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>支付宝支付<input type='radio' name='payType' value='zhifubao' style={{float: 'right'}} /></div>
        <div style={{padding: 10}}>银联支付<input type='radio' name='payType' value='yinlian' style={{float: 'right'}} /></div>
      </div>*/}
    </div>
  )
}
// 支付按钮
const payButton = () => {
  return (
    <div style={{margin: '30px 15px'}}>
      <button className='btnBG btnBGMain'>确认缴费</button>
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
