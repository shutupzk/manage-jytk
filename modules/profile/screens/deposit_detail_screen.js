import React, {Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import localforage from 'localforage'
// import Link from 'next/link'
import { queryPatients, selectPatient, queryDeposits, selectDeposit } from '../../../ducks'
import { isEmptyObject } from '../../../utils'
class DepositDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {
    const patientId = this.props.patientId
    if (!this.props.depositId || isEmptyObject(this.props.deposits)) {
      if (patientId) {
        this.props.queryDeposits(this.props.client, {patientId})
      } else {
        this.queryPatient(this.props)
      }
    }
  }

  async queryPatient () {
    const patients = this.props.patientsData
    if (isEmptyObject(patients)) {
      var userId = await localforage.getItem('userId')
      await this.props.queryPatients(this.props.client, {userId})
    }
    let array = []
    for (let i in this.props.patientsData) {
      if (this.props.patientsData[i] && this.props.patientsData[i].id) {
        array.push(this.props.patientsData[i])
      }
    }
    if (array.length > 0) {
      this.props.selectPatient({patientId: array[0].id})
      this.props.queryDeposits(this.props.client, {patientId: array[0].id})
    }
  }
  render () {
    if (this.props.loading) {
      return (
        <div>
          loading...
        </div>
      )
    }
    if (this.props.error) {
      return (
        <div>
          error...
        </div>
      )
    }
    const deposits = this.props.deposits
    const depositId = this.props.depositId || this.props.url.query.depositId
    const deposit = deposits[depositId]
    return (
      <div>
        <div style={{textAlign: 'center', backgroundColor: '#ffffff', padding: 20, marginBottom: 1}}>
          <div style={{color: '#3CA0FF', fontSize: 16}}>-¥ {deposit.charge}</div>
          <div>支付成功</div>
        </div>
        <div style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 1}}>
          <div style={{display: 'flex', padding: 5}}>
            <div style={{flex: '1'}}>费用类别</div>
            <div>{'挂号缴费'}</div>
          </div>
          <div style={{display: 'flex', padding: 5}}>
            <div style={{flex: '1'}}>交易时间</div>
            <div>{deposit.date}</div>
          </div>
          <div style={{display: 'flex', padding: 5}}>
            <div style={{flex: '1'}}>交易方式</div>
            <div>{deposit.payWay}</div>
          </div>
          <div style={{display: 'flex', padding: 5}}>
            <div style={{flex: '1'}}>凭证单号</div>
            <div>{deposit.tradeNo}</div>
          </div>
        </div>
        <div style={{backgroundColor: '#ffffff', padding: 10, marginBottom: 1}}>
          <div style={{display: 'flex', padding: 5}}>
            <div style={{flex: '1'}}>就诊人姓名</div>
            <div>{deposit.patientName}</div>
          </div>
          <div style={{display: 'flex', padding: 5}}>
            <div style={{flex: '1'}}>就诊人ID</div>
            <div>{deposit.patientId}</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    deposits: state.deposit.data,
    patientsData: state.patients.data,
    patientId: state.patients.selectId,
    depositId: state.deposit.selectId,
    loading: state.patients.loading || state.deposit.loading,
    error: state.patients.error || state.deposit.error
  }
}

export default connect(mapStateToProps, { queryPatients, selectPatient, queryDeposits, selectDeposit })(DepositDetailScreen)
