import React, { Component } from 'react'
import { connect } from 'react-redux'
import {PayWay, Prompt} from 'components'
// import {convertCurrency} from '../../../utils'
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
  goPay (payWay) {
    console.log(payWay)
    if (!payWay) {
      return this.setState({
        isShow: true,
        promptContent: '请选择支付方式'
      })
    }
  }
  render () {
    const { appointments, appointmentId } = this.props
    const appointment = appointments[appointmentId]
    return (
      <div>
        <PayWay orderNo={appointment.seqNo} payMoney={appointment.visitSchedule.registerFee} goPay={(payWay) => { this.goPay(payWay) }} />
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
      </div>
    )
  }
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
