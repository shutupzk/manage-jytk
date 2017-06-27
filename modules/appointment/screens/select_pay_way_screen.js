import React, { Component } from 'react'
import { connect } from 'react-redux'

// import {convertCurrency} from '../../../utils'
class SelectPayWayScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      payWay: ''
    }
  }

  render () {
    const { appointments, appointmentId } = this.props
    const appointment = appointments[appointmentId]
    return (
      <div>
        { topList(appointment)}
        { payTypeList() }
        { payButton() }
      </div>
    )
  }
}
// 订单信息
const topList = (appointment) => {
  return (
    <div>
      <div style={{marginBottom: 1, display: 'flex', backgroundColor: '#fff', padding: '10px 15px'}}>
        <div style={{flex: 3}}>订单号: </div>
        <div style={{flex: 10}}>{appointment.seqNo}</div>
      </div>
      <div style={{marginBottom: 1, display: 'flex', backgroundColor: '#fff', padding: '10px 15px'}}>
        <div style={{flex: 3}}>支付金额: </div>
        <div style={{flex: 10}}>￥{appointment.visitSchedule.registerFee}</div>
      </div>
    </div>
  )
}
// 支付方式
const payTypeList = () => {
  return (
    <div>
      <div style={{padding: '5px 10px'}}>选择支付方式</div>
      <div style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: 10}}>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>微信支付<input type='radio' name='payType' value='weixin' style={{float: 'right'}} onClick={(e) => { console.log(e.target.value) }} /></div>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>支付宝支付<input type='radio' name='payType' value='zhifubao' style={{float: 'right'}} onClick={(e) => { console.log(e.target.value) }} /></div>
        <div style={{padding: 10, borderBottom: 'solid 0.5px #eeeeee'}}>银联支付<input type='radio' name='payType' value='yinlian' style={{float: 'right'}} onClick={(e) => { console.log(e.target.value) }} /></div>
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
    appointments: state.appointments.data,
    appointmentId: state.appointments.selectId,
    patients: state.patients.data,
    error: state.appointments.error,
    loading: state.appointments.loading
  }
}

export default connect(mapStateToProps)(SelectPayWayScreen)
