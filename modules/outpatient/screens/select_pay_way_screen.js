import React, { Component } from 'react'
import { connect } from 'react-redux'
import {PayWay, Prompt} from 'components'
import Router from 'next/router'
// import {convertCurrency} from '../../../utils'
import {queryOutpatientDetail, selectOutpatient} from '../../../ducks'
class SelectPayWayScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      closeTime: 2,
      autoClose: true,
      isShow: false,
      promptContent: ''
    }
  }
  componentWillMount () {
    this.queryOutPayments()
  }

  async queryOutPayments () {
    this.setState({isInit: true})
    if (!this.props.outpatientId) {
      this.props.selectOutpatient({id: this.props.url.query.outpatientId})
      await this.props.queryOutpatientDetail(this.props.client, {id: this.props.outpatientId || this.props.url.query.outpatientId})
    }
    this.setState({isInit: false})
  }

  goPay (payWay) {
    console.log(payWay)
    if (!payWay) {
      return this.setState({
        isShow: true,
        promptContent: '请选择支付方式'
      })
    }
    if (payWay === 'carteVital') {
      Router.push('/outpatient/carte_vital_pay')
    }
  }
  render () {
    const { outpatients, outpatientId } = this.props
    const outpatient = outpatients[outpatientId]
    return (
      <div>
        <PayWay orderNo={outpatient.seqNo} payMoney={outpatient.chargeTotal} goPay={(payWay) => { this.goPay(payWay) }} />
        <Prompt isShow={this.state.isShow} autoClose={this.state.autoClose} closeTime={this.state.closeTime}>{this.state.promptContent}</Prompt>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    patients: state.patients.data,
    outpatientId: state.outpatient.selectId,
    outpatients: state.outpatient.data,
    loading: state.outpatient.loading,
    error: state.outpatient.error
  }
}

export default connect(mapStateToProps, {queryOutpatientDetail, selectOutpatient})(SelectPayWayScreen)
