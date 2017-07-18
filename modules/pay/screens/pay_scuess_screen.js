import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
// import PayStatus from '../components/pay_status'
import {ResultSuccessCard} from 'components'
/**
 * 支付成功
 */
class PaySuccessScreen extends Component {
  render () {
    return (<div>
      {/*<PayStatus status />
      <div style={{margin: 20}}>
        <button className='btnBG btnBGMain loginPageBtnItem' onClick={() => {
          Router.push('/appointment/appointment_list')
        }} >完成</button>
      </div>*/}
      <ResultSuccessCard clickResultSuccess={() => { Router.push('/appointment/appointment_list') }} />
    </div>)
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    user: state.user.data,
    outpatientId: state.outpatient.selectId,
    outpatients: state.outpatient.data,
    appointments: state.appointments.data,
    appointmentId: state.appointments.selectId,
    orderInfo: state.orderInfo.data,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps)(PaySuccessScreen)
