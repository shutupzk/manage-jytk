import React, { Component } from 'react'
import {ResultFailCard} from 'components'
import { connect } from 'react-redux'
// import PayStatus from '../components/pay_status'
import Router from 'next/router'
/**
 * 支付成功
 */
class PayFailScreen extends Component {
  render () {
    return (<div>
      {/*<PayStatus status={false} />
      <div style={{margin: 20}}>
        <button className='btnBG btnBGMain loginPageBtnItem' onClick={() => { window.history.back() }} >完成</button>
      </div>*/}
      <ResultFailCard clickResultSuccess={() => { window.history.back() }} />
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

export default connect(mapStateToProps)(PayFailScreen)
