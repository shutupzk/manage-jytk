import React, { Component } from 'react'
import { connect } from 'react-redux'
// import localforage from 'localforage'
// import moment from 'moment'
// import _ from 'lodash'
import Router from 'next/router'
import {Loading, FilterCard, FilterSelect, FilterTime, Modal, ModalHeader, ModalFooter, FilterTimeResult, theme, TabHeader, ErrCard} from 'components'

import {queryOutpatient, queryPatients, queryOutpatientDetail, selectOutpatient} from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class OutpatientDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isInit: false,
      payStatus: false
    }
  }
  componentWillMount () {
    this.queryOutPayments()
  }

  async queryOutPayments () {
    this.setState({isInit: true})
    if (!this.props.outpatientId) {
      this.props.selectOutpatient({id: this.props.url.query.outpatientId})
    }
    await this.props.queryOutpatientDetail(this.props.client, {id: this.props.outpatientId || this.props.url.query.outpatientId})
    this.setState({isInit: false})
  }

  render () {
    if (this.props.loading || this.state.isInit) {
      return (<div><Loading showLoading>loading...</Loading></div>)
    }
    if (this.props.error) {
      return (<div><ErrCard /></div>)
    }
    const outpatient = this.props.outpatients[this.props.outpatientId]
    return (
      <div>
        <div className='out-list header'>
          <div className='leftText'>
            名称
          </div>
          <div className='rightText'>
            费用
          </div>
        </div>
        {
          outpatient.outPayments.map((outpayment) => {
            return (
              <div key={outpayment.id} className='out-list'>
                <div className='leftText'>
                  {outpayment.typeName}
                </div>
                <div className='rightText'>
                  {outpayment.chargeTotal}元
                </div>
              </div>
            )
          })
        }
        <div className='bottomDiv'>
          <div>共{outpatient.chargeTotal}元</div>
          <div>个人缴纳费用{outpatient.individualPayment}元</div>
          <div>医保记账费用{outpatient.carteVitalPayment}元</div>
        </div>
        <button
          className='fullWidthFixed fullWidthBtn fullWidthBtnMain'
          onClick={() => Router.push('')}>去缴费</button>
        <style jsx>{`
          .out-list {
            display: flex;
            padding: 10px 15px;
            background-color: #FFF;
            margin-bottom: 1px;
          }
          .header {
            color: #d0d0d0 !important;
            margin-bottom: 1px;
          }
          .out-list .leftText {
            flex: 1;
            padding-left: 10px;
          }
          .out-list .rightText {
            flex: 1;
            text-align: right;
            padding-right: 10px;
          }
          .bottomDiv {
            padding: 25px;
            background-color: #FFF;
            text-align: right;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    outpatientId: state.outpatient.selectId,
    outpatients: state.outpatient.data,
    loading: state.outpatient.loading,
    error: state.outpatient.error
  }
}

export default connect(mapStateToProps, {queryOutpatient, queryPatients, queryOutpatientDetail, selectOutpatient})(OutpatientDetailScreen)
