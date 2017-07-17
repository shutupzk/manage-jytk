import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import PayStatus from '../components/pay_status'

/**
 * 支付成功
 */
class PaySuccessScreen extends Component {
  render () {
    return (<div>
      <PayStatus status />
      <button title='完成'onPress={() => {
        if (this.props.navigation.state.params && this.props.navigation.state.params.gochat) {
          Router.push('/')
        } else {
          window.history.back()
        }
      }} />
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

export default connect(mapStateToProps)(PaySuccessScreen)
