import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import PayStatus from '../components/pay_status'
/**
 * 支付成功
 */
class PayFailScreen extends Component {
  render () {
    return (<div>
      <PayStatus status={false} />
      <button title='完成' onClick={() => { window.history.back() }} />
    </div>)
  }
}

function mapStateToProps (state) {
  return {
    token: state.user.data.token,
    userId: state.user.data.id,
    user: state.user.data,
    loading: state.user.loading,
    error: state.user.error
  }
}

export default connect(mapStateToProps)(withApollo(PayFailScreen))
